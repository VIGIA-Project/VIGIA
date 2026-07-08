import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';

interface Notificacion {
  id: number;
  alerta: string;
  canal: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
  destinatario: string;
  estado: 'ENTREGADA' | 'PENDIENTE' | 'FALLIDA';
  fecha: string;
}

const rows: Notificacion[] = [
  { id: 1, alerta: 'ALT-001', canal: 'EMAIL', destinatario: 'guardia@uce.edu.ec', estado: 'ENTREGADA', fecha: '2024-08-20 14:32' },
  { id: 2, alerta: 'ALT-001', canal: 'PUSH', destinatario: 'App Guardia', estado: 'ENTREGADA', fecha: '2024-08-20 14:32' },
  { id: 3, alerta: 'ALT-002', canal: 'EMAIL', destinatario: 'admin@uce.edu.ec', estado: 'ENTREGADA', fecha: '2024-08-20 14:20' },
  { id: 4, alerta: 'ALT-002', canal: 'SMS', destinatario: '+593 99 123 4567', estado: 'PENDIENTE', fecha: '2024-08-20 14:20' },
  { id: 5, alerta: 'ALT-003', canal: 'WEBHOOK', destinatario: 'https://api.uce.edu.ec/vigia', estado: 'FALLIDA', fecha: '2024-08-20 13:45' },
  { id: 6, alerta: 'ALT-004', canal: 'EMAIL', destinatario: 'guardia@uce.edu.ec', estado: 'ENTREGADA', fecha: '2024-08-20 13:32' },
];

const canalColor: Record<string, 'primary' | 'secondary' | 'info' | 'warning'> = {
  EMAIL: 'primary',
  SMS: 'secondary',
  PUSH: 'info',
  WEBHOOK: 'warning',
};

const columns: Column<Notificacion>[] = [
  { id: 'alerta', label: 'Alerta', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{r.alerta}</Typography> },
  { id: 'canal', label: 'Canal', render: (r) => <Chip label={r.canal} size="small" color={canalColor[r.canal]} variant="outlined" /> },
  { id: 'destinatario', label: 'Destinatario', render: (r) => <Typography variant="body2">{r.destinatario}</Typography> },
  { id: 'estado', label: 'Estado', render: (r) => <StatusChip kind="atencion" value={r.estado === 'ENTREGADA' ? 'ATENDIDA' : r.estado === 'PENDIENTE' ? 'ENTREGADA' : 'GENERADA'} /> },
  { id: 'fecha', label: 'Fecha', render: (r) => <Typography variant="caption" color="text.secondary">{r.fecha}</Typography> },
];

export default function Notificaciones() {
  return (
    <Box>
      <PageHeader
        title="Notificaciones"
        subtitle="Historial de entregas de alertas por canal"
        breadcrumbs={[{ label: 'Alerting' }, { label: 'Notificaciones' }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Entregadas', value: '4,231', color: '#5B9C5F' },
          { label: 'Pendientes', value: '12', color: '#E0A82E' },
          { label: 'Fallidas', value: '8', color: '#C0524A' },
          { label: 'Tasa de Entrega', value: '99.5%', color: '#0D5CCF' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
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
        searchPlaceholder="Buscar por alerta o destinatario..."
        searchKeys={(r) => `${r.alerta} ${r.destinatario}`}
      />
    </Box>
  );
}
