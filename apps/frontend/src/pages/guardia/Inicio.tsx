import { Box, Grid2 as Grid, Card, CardContent, Typography, Divider, Chip, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { KpiCard, EventQueueItem } from '../../components/molecules';
import { EmptyState, LoadingSkeleton } from '../../components/atoms';
import { useAuth } from '../../context';
import {
  useEventosRecientes,
  useEventosCountHoy,
  useEventosCountHoyPorTipo,
  useInvitadosActivos,
  useInvitadosActivosCount,
} from '../../hooks/useGuard';
import { useAlertasNoAtendidasCount } from '../../hooks/useNotifications';
import { vigiaColors } from '../../theme/vigia-theme';

const decodeJwtName = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    const claims = JSON.parse(json);
    return typeof claims?.name === 'string' ? claims.name : null;
  } catch {
    return null;
  }
};

const tiempoRelativo = (iso: string) => {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 1) return 'ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  return `hace ${Math.round(minutos / 60)} h`;
};

const decisionColor = (decision: string): 'error' | 'warning' | 'default' => {
  if (decision === 'DENIED') return 'error';
  if (decision === 'PENDING_VERIFY') return 'warning';
  return 'default';
};

export default function GuardiaInicioPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const nombreGuardia = decodeJwtName(token) || user?.email?.split('@')[0] || 'Guardia';
  const nombreCapitalizado = nombreGuardia.charAt(0).toUpperCase() + nombreGuardia.slice(1);
  const ahora = new Date().toLocaleString('es-EC', { dateStyle: 'long', timeStyle: 'short' });

  const eventosCount = useEventosCountHoy();
  const eventosPorTipo = useEventosCountHoyPorTipo();
  const invitadosCount = useInvitadosActivosCount();
  const alertasCount = useAlertasNoAtendidasCount();
  const eventosRecientes = useEventosRecientes(5);
  const invitadosActivos = useInvitadosActivos();

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Inicio">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: vigiaColors.textHeading }}>
          Bienvenido, {nombreCapitalizado}
        </Typography>
        <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, mt: 0.5 }}>
          {ahora}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        <Button variant="contained" startIcon={<FactCheckOutlinedIcon />} onClick={() => navigate('/guardia/revision')}>
          Revisión manual
        </Button>
        <Button variant="outlined" startIcon={<ListAltIcon />} onClick={() => navigate('/guardia/cola')}>
          Cola de eventos
        </Button>
        <Button variant="outlined" color="warning" startIcon={<PersonAddAltIcon />} onClick={() => navigate('/guardia/contingencia')}>
          Registrar invitado
        </Button>
        <Button variant="outlined" color="error" startIcon={<NotificationsActiveOutlinedIcon />} onClick={() => navigate('/guardia/alertas')}>
          Ver alertas
        </Button>
      </Stack>

      <Typography variant="overline" sx={{ fontWeight: 700, color: vigiaColors.textTertiary, letterSpacing: 1 }}>
        Actividad de hoy
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3, mt: 0.25 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {eventosPorTipo.isLoading ? (
            <LoadingSkeleton variant="cards" rows={1} />
          ) : (
            <KpiCard
              value={eventosPorTipo.data?.entradas ?? 0}
              label="Entradas de hoy"
              accentColor={vigiaColors.success ?? '#2E7D32'}
              onClick={() => navigate('/guardia/cola', { state: { filtroMov: 'ENTRADA' } })}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {eventosPorTipo.isLoading ? (
            <LoadingSkeleton variant="cards" rows={1} />
          ) : (
            <KpiCard
              value={eventosPorTipo.data?.salidas ?? 0}
              label="Salidas de hoy"
              accentColor={vigiaColors.warning ?? '#F2851F'}
              onClick={() => navigate('/guardia/cola', { state: { filtroMov: 'SALIDA' } })}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {eventosCount.isLoading ? (
            <LoadingSkeleton variant="cards" rows={1} />
          ) : (
            <KpiCard
              value={eventosCount.data ?? 0}
              label="Eventos de hoy (total)"
              accentColor={vigiaColors.primary}
              onClick={() => navigate('/guardia/cola', { state: { filtroMov: 'TODOS' } })}
            />
          )}
        </Grid>
      </Grid>

      <Typography variant="overline" sx={{ fontWeight: 700, color: vigiaColors.textTertiary, letterSpacing: 1 }}>
        Requiere tu atención
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3, mt: 0.25 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          {invitadosCount.isLoading ? (
            <LoadingSkeleton variant="cards" rows={1} />
          ) : (
            <KpiCard
              value={invitadosCount.data ?? 0}
              label="Invitados en campus"
              accentColor={vigiaColors.gold}
              onClick={() => navigate('/guardia/cola')}
              indicator={
                invitadosActivos.data?.some((i) => i.estaExcedido)
                  ? '⚠️ Hay invitados con tiempo excedido'
                  : undefined
              }
              indicatorColor={vigiaColors.error}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {alertasCount.isLoading ? (
            <LoadingSkeleton variant="cards" rows={1} />
          ) : (
            <KpiCard
              value={alertasCount.data ?? 0}
              label="Alertas no atendidas"
              accentColor={vigiaColors.error}
              onClick={() => navigate('/guardia/alertas')}
              indicator={(alertasCount.data ?? 0) > 0 ? 'Requieren atención' : undefined}
              indicatorColor={vigiaColors.error}
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: vigiaColors.textHeading }}>
                  Eventos recientes
                </Typography>
                <Button size="small" onClick={() => navigate('/guardia/cola')}>
                  Ver todos
                </Button>
              </Box>
              <Divider sx={{ mb: 1 }} />
              {eventosRecientes.isLoading ? (
                <LoadingSkeleton variant="table" rows={3} />
              ) : eventosRecientes.isError ? (
                <Typography variant="body2" color="error">
                  No se pudieron cargar los eventos recientes.
                </Typography>
              ) : (eventosRecientes.data ?? []).length === 0 ? (
                <EmptyState titulo="Sin eventos" descripcion="No hay eventos registrados todavía." />
              ) : (
                <Box>
                  {(eventosRecientes.data ?? []).map((evento) => (
                    <EventQueueItem
                      key={evento.eventoAccesoId}
                      placa={evento.placaObservada}
                      timeAgo={tiempoRelativo(evento.capturadoEn)}
                      timeAgoColor={decisionColor(evento.decisionOperativa)}
                      motivo={evento.motivoCodigo ?? evento.tipoMovimiento}
                      onReview={() => navigate('/guardia/revision', { state: { placa: evento.placaObservada } })}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: vigiaColors.textHeading }}>
                  Invitados activos
                </Typography>
                <Button size="small" onClick={() => navigate('/guardia/cola')}>
                  Gestionar
                </Button>
              </Box>
              <Divider sx={{ mb: 1 }} />
              {invitadosActivos.isLoading ? (
                <LoadingSkeleton variant="table" rows={3} />
              ) : invitadosActivos.isError ? (
                <Typography variant="body2" color="error">
                  No se pudieron cargar los invitados activos.
                </Typography>
              ) : (invitadosActivos.data ?? []).length === 0 ? (
                <EmptyState titulo="Sin invitados" descripcion="No hay invitados activos en el campus." />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {(invitadosActivos.data ?? []).map((invitado) => (
                    <Box
                      key={invitado.eventoId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: invitado.estaExcedido ? 'error.light' : 'divider',
                        backgroundColor: invitado.estaExcedido ? 'rgba(198, 40, 40, 0.06)' : 'background.paper',
                      }}
                    >
                      <PersonOutlineIcon sx={{ color: invitado.estaExcedido ? 'error.main' : 'text.secondary' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: vigiaColors.textHeading }}>
                          {invitado.placaObservada}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {invitado.motivoDetalle || 'Sin detalle'} · Ingresó {tiempoRelativo(invitado.capturadoEn)}
                          {invitado.duracionAutorizadaMin ? ` · Autorizado ${invitado.duracionAutorizadaMin} min` : ''}
                        </Typography>
                      </Box>
                      {invitado.estaExcedido && (
                        <Chip
                          icon={<WarningAmberIcon />}
                          label="Excedido"
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardTemplate>
  );
}
