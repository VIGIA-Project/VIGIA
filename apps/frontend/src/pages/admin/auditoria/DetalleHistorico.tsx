import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { useEventoPorIdAdmin } from '../../../hooks/useAdmin';

export default function DetalleHistorico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventoQuery = useEventoPorIdAdmin(id);
  const evento = eventoQuery.data;

  return (
    <Box>
      <PageHeader
        title="Detalle de Evento Histórico"
        breadcrumbs={[{ label: 'Auditoría' }, { label: 'Historial', href: '/admin/auditoria/eventos' }, { label: `ID ${id}` }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/auditoria/eventos')}>Volver</Button>}
      />

      {eventoQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : eventoQuery.isError || !evento ? (
        <Typography color="error">No se pudo cargar el evento.</Typography>
      ) : (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <StatusChip kind="decision" value={evento.decisionOperativa} size="medium" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Evento de Acceso — {evento.placaObservada}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(evento.capturadoEn).toLocaleString('es-EC')} · {evento.tipoMovimiento}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Información del Evento</Typography>
              <Grid container spacing={2}>
                {[
                  ['ID del Evento', evento.eventoAccesoId],
                  ['Fecha y Hora', new Date(evento.capturadoEn).toLocaleString('es-EC')],
                  ['Resuelto en', evento.resueltoEn ? new Date(evento.resueltoEn).toLocaleString('es-EC') : '—'],
                  ['Placa Observada', evento.placaObservada],
                  ['Vehículo', evento.vehiculoId ?? 'No identificado'],
                  ['Persona Detectada', evento.personaDetectadaId ?? 'No identificada'],
                  ['Movimiento', evento.tipoMovimiento],
                  ['Decisión', evento.decisionOperativa],
                  ['Origen de la Decisión', evento.origenResolucion],
                  ['Motivo', evento.motivoCodigo],
                  ['Detalle del Motivo', evento.motivoDetalle ?? '—'],
                ].map(([label, value]) => (
                  <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>{label}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>{value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          {evento.vehiculoId && (
            <Card sx={{ bgcolor: 'rgba(13, 92, 207, 0.03)', border: '1px solid rgba(13, 92, 207, 0.1)', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>Inspeccionar Vehículo</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verifique el estado del vehículo involucrado y sus autorizaciones vigentes.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DirectionsCarIcon />}
                  onClick={() => navigate(`/admin/registry/vehiculos/${evento.vehiculoId}`)}
                  sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, boxShadow: '0 8px 16px rgba(13, 92, 207, 0.2)' }}
                >
                  Ver Vehículo
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
