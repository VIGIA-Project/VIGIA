import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { registryService } from '../../../services/registry.service';
import { biometricService } from '../../../services/biometric.service';

interface Perfil {
  id: string;
  persona: string;
  identificacion: string;
  estado: 'DISPONIBLE' | 'PENDIENTE' | 'NO_DISPONIBLE';
  ultimaActualizacion: string;
  representaciones: number;
}

const columns: Column<Perfil>[] = [
  {
    id: 'persona',
    label: 'Persona',
    render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem', bgcolor: 'primary.main' }}>{row.persona.charAt(0)}</Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.persona}</Typography>
          <Typography variant="caption" color="text.secondary">{row.identificacion}</Typography>
        </Box>
      </Box>
    ),
  },
  { id: 'estado', label: 'Estado de Registro', render: (row) => <StatusChip kind="disponibilidad" value={row.estado} /> },
  { id: 'representaciones', label: 'Representaciones', render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.representaciones} activas</Typography> },
  { id: 'ultimaActualizacion', label: 'Última Actualización', render: (row) => <Typography variant="caption" color="text.secondary">{row.ultimaActualizacion}</Typography> },
];

export default function PerfilesList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        setLoading(true);
        const [personas, perfiles] = await Promise.all([
          registryService.getPersonas(),
          biometricService.obtenerTodos(),
        ]);
        
        const mappedRows = perfiles.map((p: any) => {
          const persona = personas.find(pers => pers.personaId === p.personaId);
          return {
            id: p.id,
            persona: persona ? `${persona.nombres} ${persona.apellidos}` : 'Usuario Desconocido',
            identificacion: persona?.identificacionNumero || 'N/A',
            estado: p.estado === 'ACTIVO' ? 'DISPONIBLE' : 'NO_DISPONIBLE',
            ultimaActualizacion: 'Reciente',
            representaciones: 1,
          };
        });
        setRows(mappedRows as Perfil[]);
      } catch (err) {
        console.error("Error fetching personas for perfiles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfiles();
  }, []);

  return (
    <Box>
      <PageHeader
        title="Perfiles Biométricos"
        subtitle="Gestión de perfiles biométricos faciales de personas"
        breadcrumbs={[{ label: 'Biometric' }, { label: 'Perfiles' }]}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/biometric/perfiles/nuevo')}>Registrar Biometría</Button>}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Perfiles Disponibles', value: '0', color: '#5B9C5F' },
          { label: 'Pendientes de Captura', value: rows.length.toString(), color: '#E0A82E' },
          { label: 'No Disponibles', value: '0', color: '#C0524A' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
            <Card><CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FaceRetouchingNaturalIcon sx={{ color: s.color }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por persona o identificación..."
          searchKeys={(r) => `${r.persona} ${r.identificacion}`}
          onRowClick={(row) => navigate(`/admin/biometric/perfiles/${row.id}`)}
          rowActions={(row) => [
            { icon: <VisibilityIcon fontSize="small" />, label: 'Ver detalle', onClick: () => navigate(`/admin/biometric/perfiles/${row.id}`), color: 'primary' },
          ]}
        />
      )}
    </Box>
  );
}
