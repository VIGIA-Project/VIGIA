import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';

interface Perfil {
  id: number;
  persona: string;
  identificacion: string;
  estado: 'DISPONIBLE' | 'PENDIENTE' | 'NO_DISPONIBLE';
  ultimaActualizacion: string;
  representaciones: number;
}

const rows: Perfil[] = [
  { id: 1, persona: 'Carlos Andrés Mendoza', identificacion: '1718901234', estado: 'DISPONIBLE', ultimaActualizacion: '2024-08-15 10:32', representaciones: 3 },
  { id: 2, persona: 'Patricia Salazar Naranjo', identificacion: '1709876543', estado: 'DISPONIBLE', ultimaActualizacion: '2024-07-20 14:15', representaciones: 3 },
  { id: 3, persona: 'María Fernanda López', identificacion: '1712345678', estado: 'PENDIENTE', ultimaActualizacion: 'Nunca', representaciones: 0 },
  { id: 4, persona: 'Jorge Luis Velasteguí', identificacion: '1714567890', estado: 'PENDIENTE', ultimaActualizacion: 'Nunca', representaciones: 0 },
  { id: 5, persona: 'Diego Fernando Ramírez', identificacion: '1716789012', estado: 'DISPONIBLE', ultimaActualizacion: '2024-08-18 09:00', representaciones: 3 },
  { id: 6, persona: 'Ana Lucía Paredes', identificacion: '1723456789', estado: 'NO_DISPONIBLE', ultimaActualizacion: '2024-06-01 11:20', representaciones: 0 },
];

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
  { id: 'estado', label: 'Disponibilidad', render: (row) => <StatusChip kind="disponibilidad" value={row.estado} /> },
  { id: 'representaciones', label: 'Representaciones', render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.representaciones} activas</Typography> },
  { id: 'ultimaActualizacion', label: 'Última Actualización', render: (row) => <Typography variant="caption" color="text.secondary">{row.ultimaActualizacion}</Typography> },
];

export default function PerfilesList() {
  const navigate = useNavigate();
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
          { label: 'Perfiles Disponibles', value: '1,102', color: '#5B9C5F' },
          { label: 'Pendientes de Captura', value: '146', color: '#E0A82E' },
          { label: 'No Disponibles', value: '23', color: '#C0524A' },
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
    </Box>
  );
}
