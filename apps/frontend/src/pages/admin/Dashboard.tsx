import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import KpiCard from '../../components/admin-legacy/KpiCard';
import StatusChip from '../../components/admin-legacy/StatusChip';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GroupsIcon from '@mui/icons-material/Groups';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import {
  usePersonasCountAdmin,
  useVehiculosCountAdmin,
  useTemporalesCountAdmin,
  usePasesCountAdmin,
  useGrupoFamiliarCountAdmin,
  usePerfilesCountAdmin,
  useAlertasCountAdmin,
  useEventosCountAdmin,
  usePermisosProximosAExpirar,
  useAlertasRecientesAdmin,
  useEventosRecientesAdmin,
  usePersonasSinBiometria,
} from '../../hooks/useAdmin';

const tiempoRelativo = (iso: string) => {
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
  const personasCount = usePersonasCountAdmin();
  const vehiculosCount = useVehiculosCountAdmin();
  const temporalesCount = useTemporalesCountAdmin();
  const pasesCount = usePasesCountAdmin();
  const grupoFamiliarCount = useGrupoFamiliarCountAdmin();
  const perfilesCount = usePerfilesCountAdmin();
  const alertasCount = useAlertasCountAdmin();
  const eventosCount = useEventosCountAdmin();
  const permisosProximos = usePermisosProximosAExpirar(7);
  const alertasRecientes = useAlertasRecientesAdmin(5);
  const eventosRecientes = useEventosRecientesAdmin(7);
  const personasSinBiometria = usePersonasSinBiometria();
  const navigate = useNavigate();

  const kpis = [
    { title: 'Personas Registradas', query: personasCount, icon: <PeopleIcon />, accent: 'primary' as const, path: '/admin/registry/personas' },
    { title: 'Vehículos Registrados', query: vehiculosCount, icon: <DirectionsCarIcon />, accent: 'secondary' as const, path: '/admin/registry/vehiculos' },
    { title: 'Permisos Temporales Activos', query: temporalesCount, icon: <VpnKeyIcon />, accent: 'warning' as const, path: '/admin/authorization/temporales' },
    { title: 'Pases Activos', query: pasesCount, icon: <DirectionsCarFilledIcon />, accent: 'info' as const, path: '/admin/authorization/por-vehiculo' },
    { title: 'Miembros Grupo Familiar', query: grupoFamiliarCount, icon: <GroupsIcon />, accent: 'secondary' as const, path: '/admin/registry/personas' },
    { title: 'Perfiles Biométricos', query: perfilesCount, icon: <FaceRetouchingNaturalIcon />, accent: 'success' as const, path: '/admin/biometric/perfiles' },
    { title: 'Alertas No Atendidas', query: alertasCount, icon: <WarningAmberIcon />, accent: 'error' as const, path: '/admin/alerting/alertas' },
    { title: 'Eventos de Acceso Hoy', query: eventosCount, icon: <VerifiedUserIcon />, accent: 'primary' as const, path: '/admin/auditoria/eventos' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Panel de Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resumen general del sistema VIGIA · {new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {kpis.map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            {kpi.query.isLoading ? (
              <Skeleton variant="rounded" height={120} />
            ) : kpi.query.isError ? (
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{kpi.title}</Typography>
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>Error al cargar</Typography>
                </CardContent>
              </Card>
            ) : (
              <KpiCard title={kpi.title} value={kpi.query.data ?? 0} icon={kpi.icon} accent={kpi.accent} path={kpi.path} />
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningAmberIcon color="error" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Alertas Recientes
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin/alerting/alertas')}>
                  Ver todas
                </Button>
              </Box>
              {alertasRecientes.isLoading ? (
                <Skeleton variant="rounded" height={180} />
              ) : alertasRecientes.isError ? (
                <Alert severity="error">No se pudieron cargar las alertas recientes.</Alert>
              ) : alertasRecientes.data && alertasRecientes.data.length > 0 ? (
                <List disablePadding>
                  {alertasRecientes.data.map((alerta: any, i: any) => (
                    <Box key={alerta.alertaId}>
                      <ListItem sx={{ px: 0, py: 1.25, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 36, mt: 0.3 }}>
                          {severityIcon(alerta.severidad)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', flex: 1 }}>
                                {alerta.mensajeResumen}
                              </Typography>
                              <Box sx={{ flexShrink: 0 }}>
                                <StatusChip kind="severity" value={alerta.severidad} />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {alerta.referenciaOrigenId}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                <AccessTimeIcon sx={{ fontSize: 14 }} /> {tiempoRelativo(alerta.generadaEn)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {i < alertasRecientes.data.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No hay alertas institucionales recientes.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Eventos de Acceso Recientes
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin/auditoria/eventos')}>
                  Ver historial
                </Button>
              </Box>
              {eventosRecientes.isLoading ? (
                <Skeleton variant="rounded" height={180} />
              ) : eventosRecientes.isError ? (
                <Alert severity="error">No se pudieron cargar los eventos recientes.</Alert>
              ) : eventosRecientes.data && eventosRecientes.data.length > 0 ? (
                <Box sx={{ overflow: 'hidden' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr', gap: 1, px: 1, py: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                    <Typography variant="overline" sx={{ fontWeight: 700 }}>Hora</Typography>
                    <Typography variant="overline" sx={{ fontWeight: 700 }}>Placa</Typography>
                    <Typography variant="overline" sx={{ fontWeight: 700 }}>Decisión</Typography>
                    <Typography variant="overline" sx={{ fontWeight: 700 }}>Origen</Typography>
                  </Box>
                  {eventosRecientes.data.map((evento: any, i: any) => (
                    <Box
                      key={evento.eventoAccesoId}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 1fr 1fr',
                        gap: 1,
                        px: 1,
                        py: 1.25,
                        alignItems: 'center',
                        borderBottom: i < eventosRecientes.data.length - 1 ? '1px solid' : 'none',
                        borderColor: 'rgba(13, 92, 207, 0.06)',
                        '&:hover': { backgroundColor: 'rgba(13, 92, 207, 0.02)' },
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {new Date(evento.capturadoEn).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {evento.placaObservada}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {decisionIcon(evento.decisionOperativa)}
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {evento.decisionOperativa}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {evento.origenResolucion}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No hay eventos de acceso recientes.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Sin Perfil Biométrico
                </Typography>
                {personasSinBiometria.data && (
                  <Tooltip title={`${personasSinBiometria.data.length} personas pendientes`}>
                    <Box sx={{ bgcolor: 'warning.main', color: '#0A2F86', borderRadius: 10, px: 1, fontSize: '0.7rem', fontWeight: 700 }}>
                      {personasSinBiometria.data.length}
                    </Box>
                  </Tooltip>
                )}
              </Box>
              {personasSinBiometria.isLoading ? (
                <Skeleton variant="rounded" height={160} />
              ) : personasSinBiometria.isError ? (
                <Alert severity="error">No se pudo cargar la lista.</Alert>
              ) : personasSinBiometria.data && personasSinBiometria.data.length > 0 ? (
                <List disablePadding>
                  {personasSinBiometria.data.slice(0, 5).map((persona: any, i: any, arr: any) => (
                    <Box key={persona.personaId}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'rgba(242, 181, 31, 0.15)', color: 'warning.dark' }}>
                            {persona.nombreCompleto.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{persona.nombreCompleto}</Typography>}
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">{persona.identificacionNumero}</Typography>
                              <StatusChip kind="disponibilidad" value="PENDIENTE" />
                            </Box>
                          }
                        />
                      </ListItem>
                      {i < arr.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  Todas las personas tienen su perfil biométrico completo.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Permisos por Expirar (7 días)
                </Typography>
                {permisosProximos.data && (
                  <Tooltip title={`${permisosProximos.data.length} permisos próximos`}>
                    <Box sx={{ bgcolor: 'warning.main', color: '#0A2F86', borderRadius: 10, px: 1, fontSize: '0.7rem', fontWeight: 700 }}>
                      {permisosProximos.data.length}
                    </Box>
                  </Tooltip>
                )}
              </Box>
              {permisosProximos.isLoading ? (
                <Skeleton variant="rounded" height={160} />
              ) : permisosProximos.isError ? (
                <Alert severity="error">No se pudo cargar la lista.</Alert>
              ) : permisosProximos.data && permisosProximos.data.length > 0 ? (
                <List disablePadding>
                  {permisosProximos.data.map((permiso: any, i: any, arr: any) => (
                    <Box key={permiso.id}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ScheduleIcon sx={{ color: 'warning.main' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>Persona {permiso.personaId.slice(0, 8)}</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                                {new Date(permiso.vigenciaFin).toLocaleDateString('es-EC')}
                              </Typography>
                            </Box>
                          }
                          secondary={<Typography variant="caption" color="text.secondary">Vehículo: {permiso.vehiculoId.slice(0, 8)}</Typography>}
                        />
                      </ListItem>
                      {i < arr.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No hay permisos próximos a expirar en los siguientes 7 días.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
