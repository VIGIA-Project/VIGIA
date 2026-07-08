import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';

interface Permiso {
  id: number;
  persona: string;
  vehiculo: string;
  estado: 'ACTIVA' | 'EXPIRADO' | 'PENDIENTE';
  validoDesde: string;
  validoHasta: string;
  creadoPor: string;
  motivo: string;
}

const rows: Permiso[] = [
  { id: 1, persona: 'Diego Ramírez', vehiculo: 'KJH-3344', estado: 'ACTIVA', validoDesde: '2024-08-20 06:00', validoHasta: '2024-08-20 18:00', creadoPor: 'jperez', motivo: 'Evento institucional' },
  { id: 2, persona: 'Ana Lucía Paredes', vehiculo: 'LPM-5566', estado: 'ACTIVA', validoDesde: '2024-08-20 08:00', validoHasta: '2024-08-20 20:00', creadoPor: 'admin', motivo: 'Mantenimiento' },
  { id: 3, persona: 'Fernando Cevallos', vehiculo: 'QWE-7788', estado: 'PENDIENTE', validoDesde: '2024-08-21 00:00', validoHasta: '2024-08-22 23:59', creadoPor: 'admin', motivo: 'Visita académica' },
  { id: 4, persona: 'Manuel Borrero', vehiculo: 'RTY-3322', estado: 'EXPIRADO', validoDesde: '2024-08-15 06:00', validoHasta: '2024-08-15 18:00', creadoPor: 'jperez', motivo: 'Reunión de coordinación' },
  { id: 5, persona: 'Sofía Cevallos', vehiculo: 'UIO-1100', estado: 'ACTIVA', validoDesde: '2024-08-20 00:00', validoHasta: '2024-08-21 23:59', creadoPor: 'admin', motivo: 'Investigación de campo' },
];

const columns: Column<Permiso>[] = [
  { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.persona}</Typography> },
  { id: 'vehiculo', label: 'Vehículo', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{r.vehiculo}</Typography> },
  { id: 'estado', label: 'Estado', render: (r) => <StatusChip kind="autorizacion" value={r.estado === 'PENDIENTE' ? 'INACTIVA' : r.estado === 'ACTIVA' ? 'ACTIVA' : 'EXPIRADO'} /> },
  { id: 'validoDesde', label: 'Válido desde', render: (r) => <Typography variant="caption" color="text.secondary">{r.validoDesde}</Typography> },
  { id: 'validoHasta', label: 'Válido hasta', render: (r) => <Typography variant="caption" color="text.secondary">{r.validoHasta}</Typography> },
  { id: 'motivo', label: 'Motivo', render: (r) => r.motivo },
  { id: 'creadoPor', label: 'Creado por', render: (r) => <Chip label={r.creadoPor} size="small" variant="outlined" /> },
];

export default function PermisosTemporal() {
  return (
    <Box>
      <PageHeader
        title="Permisos Temporales"
        subtitle="Consulta de permisos temporales otorgados (solo lectura para administrador)"
        breadcrumbs={[{ label: 'Authorization' }, { label: 'Temporales' }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Permisos Activos', value: '57', color: '#5B9C5F' },
          { label: 'Próximos a Expirar', value: '3', color: '#E0A82E' },
          { label: 'Expirados (mes actual)', value: '24', color: '#9E9E9E' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
            <Card><CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Buscar por persona, vehículo o motivo..."
        searchKeys={(r) => `${r.persona} ${r.vehiculo} ${r.motivo}`}
      />
    </Box>
  );
}
