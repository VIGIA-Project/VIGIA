import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { useEventosRecientesAdmin } from '../../../hooks/useAdmin';
import { EventoAcceso } from '../../../services/types/admin.types';

type EventoRow = EventoAcceso & { id: string };

const columns: Column<EventoRow>[] = [
  { id: 'fecha', label: 'Fecha', render: (r) => <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{new Date(r.capturadoEn).toLocaleString('es-EC')}</Typography> },
  { id: 'placa', label: 'Placa', render: (r) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{r.placaObservada}</Typography> },
  { id: 'tipoMovimiento', label: 'Movimiento', render: (r) => <Typography variant="body2">{r.tipoMovimiento}</Typography> },
  { id: 'decision', label: 'Decisión', render: (r) => <StatusChip kind="decision" value={r.decisionOperativa} /> },
  { id: 'origen', label: 'Origen', render: (r) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.origenResolucion}</Typography> },
  { id: 'motivo', label: 'Motivo', render: (r) => <Typography variant="caption" color="text.secondary">{r.motivoCodigo}</Typography> },
];

export default function HistorialEventos() {
  const navigate = useNavigate();
  const eventosQuery = useEventosRecientesAdmin(200);

  const rows: EventoRow[] = useMemo(
    () => (eventosQuery.data ?? []).map((e) => ({ ...e, id: e.eventoAccesoId })),
    [eventosQuery.data]
  );

  const stats = useMemo(
    () => ({
      total: rows.length,
      successful: rows.filter((r) => r.decisionOperativa === 'SUCCESSFUL').length,
      pending: rows.filter((r) => r.decisionOperativa === 'PENDING_VERIFY').length,
      denied: rows.filter((r) => r.decisionOperativa === 'DENIED').length,
    }),
    [rows]
  );

  return (
    <Box>
      <PageHeader
        title="Historial de Eventos"
        subtitle="Auditoría de eventos de acceso al sistema VIGIA (últimos 200 registros)"
        breadcrumbs={[{ label: 'Auditoría' }, { label: 'Historial de Eventos' }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Eventos Mostrados', value: stats.total, color: '#0D5CCF' },
          { label: 'SUCCESSFUL', value: stats.successful, color: '#5B9C5F' },
          { label: 'PENDING_VERIFY', value: stats.pending, color: '#E0A82E' },
          { label: 'DENIED', value: stats.denied, color: '#C0524A' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card><CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>
                {eventosQuery.isLoading ? <CircularProgress size={22} /> : s.value}
              </Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      {eventosQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : eventosQuery.isError ? (
        <Typography color="error">No se pudo cargar el historial de eventos.</Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por placa o motivo..."
          searchKeys={(r) => `${r.placaObservada} ${r.motivoCodigo}`}
          onRowClick={(row) => navigate(`/admin/auditoria/eventos/${row.id}`)}
        />
      )}
    </Box>
  );
}
