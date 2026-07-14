import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { useAlertaPorIdAdmin, useMarcarAlertaAtendidaAdmin } from '../../../hooks/useAdmin';

const SEVERIDAD_ICON = {
  ALTA: <ErrorIcon sx={{ color: '#fff' }} />,
  MEDIA: <WarningAmberIcon sx={{ color: '#fff' }} />,
  INFORMATIVA: <InfoIcon sx={{ color: '#fff' }} />,
} as const;

const SEVERIDAD_COLOR = {
  ALTA: 'error.main',
  MEDIA: 'warning.main',
  INFORMATIVA: 'info.main',
} as const;

export default function AlertaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const alertaQuery = useAlertaPorIdAdmin(id);
  const atenderMutation = useMarcarAlertaAtendidaAdmin();
  const alerta = alertaQuery.data;

  return (
    <Box>
      <PageHeader
        title="Detalle de Alerta"
        breadcrumbs={[{ label: 'Alerting' }, { label: 'Alertas', href: '/admin/alerting/alertas' }, { label: `ID ${id}` }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/alerting/alertas')}>Volver</Button>}
      />

      {alertaQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : alertaQuery.isError || !alerta ? (
        <Typography color="error">No se pudo cargar la alerta.</Typography>
      ) : (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: SEVERIDAD_COLOR[alerta.severidad as keyof typeof SEVERIDAD_COLOR] || 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {SEVERIDAD_ICON[alerta.severidad as keyof typeof SEVERIDAD_ICON] || <InfoIcon sx={{ color: '#fff' }} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <StatusChip kind="severity" value={alerta.severidad} />
                    <StatusChip kind="atencion" value={alerta.estadoAtencion} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {alerta.mensajeResumen}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {alerta.causaOrigen} · {new Date(alerta.generadaEn).toLocaleString('es-EC')}
                  </Typography>
                </Box>
                {alerta.estadoAtencion !== 'ATENDIDA' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    disabled={atenderMutation.isPending}
                    onClick={() => atenderMutation.mutate(alerta.alertaId)}
                  >
                    Marcar atendida
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Detalle</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[
                  ['ID de Alerta', alerta.alertaId],
                  ['Severidad', alerta.severidad],
                  ['Estado de Atención', alerta.estadoAtencion],
                  ['Fecha de Generación', new Date(alerta.generadaEn).toLocaleString('es-EC')],
                  ['Causa de Origen', alerta.causaOrigen],
                  ['Referencia de Origen', alerta.referenciaOrigenId],
                  ['Vehículo Involucrado', alerta.vehiculoId ?? '—'],
                  ['Atendida en', alerta.atendidaEn ? new Date(alerta.atendidaEn).toLocaleString('es-EC') : '—'],
                ].map(([label, value]) => (
                  <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>{label}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>{value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          {alerta.vehiculoId && (
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
                  onClick={() => navigate(`/admin/registry/vehiculos/${alerta.vehiculoId}`)}
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
