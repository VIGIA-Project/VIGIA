import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import {
  useAlertasRecientesAdmin,
  useAlertasCountAdmin,
  useNotificacionesAdmin,
  useMarcarNotificacionLeidaAdmin,
  useMarcarAlertaAtendidaAdmin,
  useEventosRecientesAdmin,
  useMetricasAccesosHoyAdmin
} from '../../hooks/useAdmin';

import StatusChip from '../../components/admin-legacy/StatusChip';

const tiempoRelativo = (iso?: string) => {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutos = Math.round(diffMs / 60000);
  if (minutos < 1) return 'ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  return `hace ${Math.round(horas / 24)} d`;
};

const severityIcon = (sev: string) => {
  if (sev === 'ALTA') return <ErrorIcon sx={{ color: '#C0524A' }} />;
  if (sev === 'MEDIA') return <WarningAmberIcon sx={{ color: '#E0A82E' }} />;
  return <InfoIcon sx={{ color: '#4A8EC0' }} />;
};

const decisionIcon = (decision: string) => {
  if (decision === 'SUCCESSFUL') return <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />;
  if (decision === 'DENIED') return <CancelIcon sx={{ fontSize: 16, color: 'error.main' }} />;
  return <HourglassEmptyIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
};

export default function Dashboard() {
  const [decisionFilter, setDecisionFilter] = useState<string>('ALL');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Queries reales
  const metricasQuery = useMetricasAccesosHoyAdmin();
  const alertasQuery = useAlertasRecientesAdmin(15);
  const countAlertasQuery = useAlertasCountAdmin();
  const notificacionesQuery = useNotificacionesAdmin();
  const eventosQuery = useEventosRecientesAdmin(20);

  // Mutations
  const atenderAlertaMutation = useMarcarAlertaAtendidaAdmin();
  const leerNotificacionMutation = useMarcarNotificacionLeidaAdmin();

  const handleAtenderAlerta = async (alertaId: string) => {
    try {
      await atenderAlertaMutation.mutateAsync(alertaId);
      setSuccessMessage('Alerta marcada como ATENDIDA con éxito.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeerNotificacion = async (notifId: string) => {
    try {
      await leerNotificacionMutation.mutateAsync(notifId);
      setSuccessMessage('Notificación in-app leída.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecisionFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: string,
  ) => {
    if (newFilter !== null) {
      setDecisionFilter(newFilter);
    }
  };

  const handleRefresh = () => {
    metricasQuery.refetch();
    alertasQuery.refetch();
    countAlertasQuery.refetch();
    notificacionesQuery.refetch();
    eventosQuery.refetch();
    setSuccessMessage('Datos actualizados.');
  };

  // Filtrar eventos locales de hoy
  const filteredEventos = eventosQuery.data
    ? eventosQuery.data.filter((e) => {
        if (decisionFilter === 'ALL') return true;
        return e.decisionOperativa === decisionFilter;
      })
    : [];

  return (
    <Box sx={{ pb: 5 }}>
      {/* Cabecera del Panel */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.025em' }}>
            Panel de Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supervisión institucional, atención operativa de alertas y eventos del MVP · {new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ borderRadius: 2 }}
        >
          Sincronizar
        </Button>
      </Box>

      {/* Tarjetas de Métricas Operativas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* KPI: Accesos Exitosos */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          {metricasQuery.isLoading ? (
            <Skeleton variant="rounded" height={130} />
          ) : metricasQuery.isError ? (
            <Card sx={{ borderLeft: '5px solid', borderColor: 'error.main' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>ACCESOS EXITOSOS HOY</Typography>
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>Error al cargar métricas</Typography>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{
              borderLeft: '5px solid',
              borderColor: 'success.main',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                    ACCESOS EXITOSOS
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: 'success.main' }}>
                    {metricasQuery.data?.exitosos ?? 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(46, 125, 50, 0.15)', color: 'success.main', width: 56, height: 56 }}>
                  <CheckCircleIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* KPI: Accesos Pendientes de Verificar */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          {metricasQuery.isLoading ? (
            <Skeleton variant="rounded" height={130} />
          ) : metricasQuery.isError ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <Card sx={{
              borderLeft: '5px solid',
              borderColor: 'warning.main',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                    PENDIENTES VERIFICACIÓN
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: 'warning.main' }}>
                    {metricasQuery.data?.pendientes ?? 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(237, 108, 2, 0.15)', color: 'warning.main', width: 56, height: 56 }}>
                  <HourglassEmptyIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* KPI: Accesos Denegados */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          {metricasQuery.isLoading ? (
            <Skeleton variant="rounded" height={130} />
          ) : metricasQuery.isError ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <Card sx={{
              borderLeft: '5px solid',
              borderColor: 'error.main',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                    ACCESOS DENEGADOS
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: 'error.main' }}>
                    {metricasQuery.data?.denegados ?? 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(211, 47, 47, 0.15)', color: 'error.main', width: 56, height: 56 }}>
                  <CancelIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* KPI: Alertas sin Atender */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          {countAlertasQuery.isLoading ? (
            <Skeleton variant="rounded" height={130} />
          ) : countAlertasQuery.isError ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <Card sx={{
              borderLeft: '5px solid',
              borderColor: '#0D5CCF',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                    ALERTAS SIN ATENDER
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: 'primary.main' }}>
                    {countAlertasQuery.data ?? 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(13, 92, 207, 0.15)', color: 'primary.main', width: 56, height: 56 }}>
                  <WarningAmberIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Sección del Panel de Alertas e In-App Notifications */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Panel de Alertas */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.02)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <WarningAmberIcon color="error" />
                  <Typography variant="h6" sx={{ fontWeight: 750 }}>
                    Panel de Alertas Operativas
                  </Typography>
                </Box>
                <Chip
                  label={`${alertasQuery.data ? alertasQuery.data.filter((a) => a.estadoAtencion !== 'ATENDIDA').length : 0} pendientes`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                />
              </Box>

              {alertasQuery.isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Skeleton variant="rounded" height={80} />
                  <Skeleton variant="rounded" height={80} />
                  <Skeleton variant="rounded" height={80} />
                </Box>
              ) : alertasQuery.isError ? (
                <Alert severity="error">Error al conectar con la API de Alerting. No se pudieron cargar las alertas.</Alert>
              ) : alertasQuery.data && alertasQuery.data.length > 0 ? (
                <List disablePadding>
                  {alertasQuery.data.map((alerta, i) => {
                    const esAtendida = alerta.estadoAtencion === 'ATENDIDA';

                    return (
                      <Box key={alerta.alertaId}>
                        <ListItem
                          sx={{
                            px: 0.5,
                            py: 2,
                            alignItems: 'flex-start',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            opacity: esAtendida ? 0.6 : 1,
                            backgroundColor: esAtendida ? 'rgba(0,0,0,0.01)' : 'transparent',
                            borderRadius: 1
                          }}
                        >
                          {/* Icono de severidad */}
                          <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                            {severityIcon(alerta.severidad)}
                          </Box>

                          {/* Cuerpo de Alerta */}
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mr: 1 }}>
                                  {alerta.mensajeResumen}
                                </Typography>
                                <Chip
                                  label={alerta.causaOrigen}
                                  size="small"
                                  variant="outlined"
                                  sx={{ textTransform: 'capitalize', fontSize: '0.7rem', height: 20 }}
                                />
                                <StatusChip kind="severity" value={alerta.severidad} />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Origen ID:</strong> {alerta.referenciaOrigenId}
                                  {alerta.vehiculoId && (
                                    <> · <strong>Vehículo ID:</strong> {alerta.vehiculoId}</>
                                  )}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTimeIcon sx={{ fontSize: 13 }} /> {tiempoRelativo(alerta.generadaEn)}
                                  </Typography>
                                  <Chip
                                    label={alerta.estadoAtencion}
                                    size="small"
                                    color={esAtendida ? 'success' : 'warning'}
                                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                                  />
                                </Box>
                              </Box>
                            }
                          />

                          {/* Acción de atención */}
                          {!esAtendida && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleAtenderAlerta(alerta.alertaId)}
                              disabled={atenderAlertaMutation.isPending}
                              startIcon={atenderAlertaMutation.isPending && atenderAlertaMutation.variables === alerta.alertaId ? (
                                <CircularProgress size={14} color="inherit" />
                              ) : (
                                <DoneAllIcon />
                              )}
                              sx={{
                                alignSelf: { xs: 'flex-start', sm: 'center' },
                                borderRadius: 2,
                                px: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                flexShrink: 0
                              }}
                            >
                              Atender
                            </Button>
                          )}
                        </ListItem>
                        {i < alertasQuery.data.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
                      </Box>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se registran alertas operativas activas.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notificaciones In-App del Sistema */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.02)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <NotificationsIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 750 }}>
                    Notificaciones In-App
                  </Typography>
                </Box>
                {notificacionesQuery.data && (
                  <Chip
                    label={`${notificacionesQuery.data.filter((n) => !n.leida).length} nuevas`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  />
                )}
              </Box>

              {notificacionesQuery.isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Skeleton variant="rounded" height={60} />
                  <Skeleton variant="rounded" height={60} />
                </Box>
              ) : notificacionesQuery.isError ? (
                <Alert severity="error">Error al cargar la bandeja de notificaciones.</Alert>
              ) : notificacionesQuery.data && notificacionesQuery.data.length > 0 ? (
                <List disablePadding>
                  {notificacionesQuery.data.map((notif, i) => {
                    const esLeida = notif.leida;

                    return (
                      <Box key={notif.notificacionId}>
                        <ListItem
                          sx={{
                            px: 0.5,
                            py: 1.5,
                            alignItems: 'flex-start',
                            backgroundColor: esLeida ? 'transparent' : 'rgba(13, 92, 207, 0.02)',
                            borderRadius: 2,
                            mb: 1
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32, mt: 0.3 }}>
                            <NotificationsIcon sx={{ fontSize: 18, color: esLeida ? 'text.disabled' : 'primary.main' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: esLeida ? 600 : 700, color: esLeida ? 'text.secondary' : 'text.primary' }}>
                                {notif.titulo}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                  {notif.contenidoResumen}
                                </Typography>
                                <Typography variant="overline" color="text.disabled" sx={{ fontSize: '0.6rem' }}>
                                  {tiempoRelativo(notif.enviadaEn)}
                                </Typography>
                              </Box>
                            }
                          />

                          {!esLeida && (
                            <Tooltip title="Marcar como leída">
                              <IconButton
                                size="small"
                                onClick={() => handleLeerNotificacion(notif.notificacionId)}
                                disabled={leerNotificacionMutation.isPending}
                                sx={{ color: 'primary.main' }}
                              >
                                <MarkEmailReadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </ListItem>
                        {i < notificacionesQuery.data.length - 1 && <Divider sx={{ opacity: 0.4, my: 0.5 }} />}
                      </Box>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Bandeja de notificaciones vacía.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sección de Eventos de Acceso Recientes y Filtros de Operación */}
      <Card sx={{ boxShadow: '0 4px 20px 0 rgba(0,0,0,0.02)', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 3,
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 750 }}>
                Registro de Eventos de Acceso (Hoy)
              </Typography>
            </Box>

            {/* Selector de filtro por decisión operativa */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', md: 'auto' }, overflowX: 'auto' }}>
              <FilterListIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
                Decisión Operativa:
              </Typography>
              <ToggleButtonGroup
                value={decisionFilter}
                exclusive
                onChange={handleDecisionFilterChange}
                aria-label="filtro decisión operativa"
                size="small"
                sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
              >
                <ToggleButton value="ALL" aria-label="todos" sx={{ px: 2, py: 0.5 }}>
                  Todos
                </ToggleButton>
                <ToggleButton value="SUCCESSFUL" aria-label="exitosos" sx={{ px: 2, py: 0.5, color: 'success.main', '&.Mui-selected': { bgcolor: 'rgba(46,125,50,0.1)' } }}>
                  Exitosos
                </ToggleButton>
                <ToggleButton value="PENDING_VERIFY" aria-label="pendientes" sx={{ px: 2, py: 0.5, color: 'warning.main', '&.Mui-selected': { bgcolor: 'rgba(237,108,2,0.1)' } }}>
                  Pendientes
                </ToggleButton>
                <ToggleButton value="DENIED" aria-label="denegados" sx={{ px: 2, py: 0.5, color: 'error.main', '&.Mui-selected': { bgcolor: 'rgba(211,47,47,0.1)' } }}>
                  Denegados
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Tabla de Eventos */}
          {eventosQuery.isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Skeleton variant="text" width="100%" height={30} />
              <Skeleton variant="rounded" width="100%" height={50} />
              <Skeleton variant="rounded" width="100%" height={50} />
              <Skeleton variant="rounded" width="100%" height={50} />
            </Box>
          ) : eventosQuery.isError ? (
            <Alert severity="error">Error al recuperar el historial de eventos de acceso.</Alert>
          ) : filteredEventos.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 650 }}>
                {/* Cabecera de Tabla */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: '80px 100px 90px 180px 140px 1fr',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderRadius: 1
                }}>
                  <Typography variant="overline" sx={{ fontWeight: 800 }}>Hora</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 800 }}>Placa</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 800 }}>Dirección</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 800 }}>Decisión Operativa</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 800 }}>Origen Resolución</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 800 }}>Motivo / Detalle</Typography>
                </Box>

                {/* Filas */}
                {filteredEventos.map((evento, i) => (
                  <Box
                    key={evento.eventoAccesoId}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '80px 100px 90px 180px 140px 1fr',
                      gap: 2,
                      px: 2,
                      py: 2,
                      alignItems: 'center',
                      borderBottom: i < filteredEventos.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      transition: 'background-color 0.15s',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.015)' },
                    }}
                  >
                    {/* Hora */}
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {new Date(evento.capturadoEn).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>

                    {/* Placa */}
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: '"Exo 2", sans-serif' }}>
                      {evento.placaObservada}
                    </Typography>

                    {/* Dirección */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {evento.tipoMovimiento === 'ENTRADA' ? (
                        <Chip
                          icon={<ArrowUpwardIcon sx={{ fontSize: '12px !important', color: 'success.main' }} />}
                          label="Entrada"
                          size="small"
                          sx={{ height: 20, bgcolor: 'rgba(46,125,50,0.06)', color: 'success.dark', fontWeight: 700 }}
                        />
                      ) : (
                        <Chip
                          icon={<ArrowDownwardIcon sx={{ fontSize: '12px !important', color: 'info.main' }} />}
                          label="Salida"
                          size="small"
                          sx={{ height: 20, bgcolor: 'rgba(13,92,207,0.06)', color: 'info.dark', fontWeight: 700 }}
                        />
                      )}
                    </Box>

                    {/* Decisión Operativa */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      {decisionIcon(evento.decisionOperativa)}
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {evento.decisionOperativa === 'SUCCESSFUL' && 'EXITOSO'}
                        {evento.decisionOperativa === 'PENDING_VERIFY' && 'PENDIENTE VERIFICACIÓN'}
                        {evento.decisionOperativa === 'DENIED' && 'DENEGADO'}
                      </Typography>
                    </Box>

                    {/* Origen Resolución */}
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {evento.origenResolucion}
                    </Typography>

                    {/* Motivo / Detalle */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {evento.motivoCodigo}
                      </Typography>
                      {evento.motivoDetalle && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                          {evento.motivoDetalle}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                No se registran eventos de acceso hoy.
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Los eventos aparecerán conforme los vehículos ingresen o salgan por las garitas.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar de Éxito */}
      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'success.dark',
            color: 'white',
            fontWeight: 700,
            borderRadius: 2
          }
        }}
      />
    </Box>
  );
}
