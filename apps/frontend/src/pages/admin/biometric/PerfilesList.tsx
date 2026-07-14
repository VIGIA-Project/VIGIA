import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { usePerfilesBiometricosAdmin } from '../../../hooks/useAdmin';
import { PerfilBiometrico } from '../../../services/types/admin.types';

interface Row extends PerfilBiometrico {
  id: string;
}

const columns: Column<Row>[] = [
  {
    id: 'persona',
    label: 'Persona',
    render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
          {(row.personaNombre ?? row.personaId).charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.personaNombre ?? `Persona ${row.personaId.slice(0, 8)}`}</Typography>
        </Box>
      </Box>
    ),
  },
  {
    id: 'estado',
    label: 'Disponibilidad',
    render: (row) => <StatusChip kind="disponibilidad" value={row.estadoDisponibilidad === 'PENDIENTE_CAPTURA' ? 'PENDIENTE' : row.estadoDisponibilidad} />,
  },
  {
    id: 'ultimaActualizacion',
    label: 'Última Actualización',
    render: (row) => (
      <Typography variant="caption" color="text.secondary">
        {row.ultimaActualizacionBiometrica ? new Date(row.ultimaActualizacionBiometrica).toLocaleString('es-EC') : 'Nunca'}
      </Typography>
    ),
  },
];

export default function PerfilesList() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = usePerfilesBiometricosAdmin();

  const rows: Row[] = (data ?? []).map((p) => ({ ...p, id: p.perfilBiometricoId }));
  const disponibles = rows.filter((r) => r.estadoDisponibilidad === 'DISPONIBLE').length;
  const pendientes = rows.filter((r) => r.estadoDisponibilidad === 'PENDIENTE_CAPTURA').length;
  const noDisponibles = rows.filter((r) => r.estadoDisponibilidad === 'NO_DISPONIBLE').length;

  return (
    <Box>
      <PageHeader
        title="Perfiles Biométricos"
        subtitle="Supervisión de perfiles biométricos registrados en el sistema VIGIA"
        breadcrumbs={[{ label: 'Biometric' }, { label: 'Perfiles' }]}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/biometric/perfiles/nuevo')}>Registrar Perfil</Button>}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Perfiles Disponibles', value: disponibles, color: '#5B9C5F' },
          { label: 'Pendientes de Captura', value: pendientes, color: '#E0A82E' },
          { label: 'No Disponibles', value: noDisponibles, color: '#C0524A' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
            <Card><CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FaceRetouchingNaturalIcon sx={{ color: s.color }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{isLoading ? '-' : s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      {isLoading ? (
        <Skeleton variant="rounded" height={320} />
      ) : isError ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => refetch()}>Reintentar</Button>}>
          No se pudieron cargar los perfiles biométricos.
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por persona..."
          searchKeys={(r) => `${r.personaNombre ?? ''} ${r.personaId}`}
          onRowClick={(row) => navigate(`/admin/biometric/perfiles/${row.id}`)}
        />
      )}
    </Box>
  );
}
