import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getActiveAlerts } from '../../services/alerting.service';
import { getRecentEvents } from '../../services/access-control.service';
import { listarTodasPermanentes, listarTodosTemporales } from '../../services/authorization.service';
import { listarTodasPersonas, listarTodosVehiculos } from '../../services/registry.service';

const sinBiometria = [
  { id: 1, nombre: 'María Fernanda López', identificacion: '1712345678', rol: 'Docente' },
  { id: 2, nombre: 'Carlos Andrés Mendoza', identificacion: '1718901234', rol: 'Estudiante' },
  { id: 3, nombre: 'Patricia Salazar Naranjo', identificacion: '1709876543', rol: 'Administrativo' },
  { id: 4, nombre: 'Jorge Luis Velasteguí', identificacion: '1714567890', rol: 'Docente' },
];

const accionesRapidas = [
  { label: 'Nueva Persona', icon: <PersonAddIcon />, color: '#0D5CCF', route: '/admin/registry/personas' },
  { label: 'Nueva Autorización', icon: <AssignmentIndIcon />, color: '#11A9D6', route: '/admin/authorization/permanentes' },
  { label: 'Permiso Temporal', icon: <ScheduleIcon />, color: '#E0A82E', route: '/admin/authorization/temporales' },
  { label: 'Ver Alertas', icon: <NotificationsActiveIcon />, color: '#C0524A', route: '/admin/alerting/alertas' },
];

const severityIcon = (sev: string) => {
  if (sev === 'error' || sev === 'ALTA') return <ErrorIcon sx={{ color: '#C0524A' }} />;
  if (sev === 'warning' || sev === 'MEDIA') return <WarningAmberIcon sx={{ color: '#E0A82E' }} />;
  return <InfoIcon sx={{ color: '#4A8EC0' }} />;
};

const decisionIcon = (decision: string) => {
  if (decision === 'GRANTED' || decision === 'SUCCESSFUL') return <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />;
  if (decision === 'DENIED') return <CancelIcon sx={{ fontSize: 16, color: 'error.main' }} />;
  return <HourglassEmptyIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Queries locales de la BD real
  const { data: realAlerts = [] } = useQuery({
    queryKey: ['activeAlertsDashboard'],
    queryFn: getActiveAlerts,
    refetchInterval: 10000,
  });

  const { data: realEvents = [] } = useQuery({
    queryKey: ['recentEventsDashboard'],
    queryFn: () => getRecentEvents(7),
    refetchInterval: 5000,
  });

  const { data: realTemporales = [] } = useQuery({
    queryKey: ['temporalesDashboard'],
    queryFn: listarTodosTemporales,
    refetchInterval: 15000,
  });

  const { data: realPersonas = [] } = useQuery({
    queryKey: ['personasDashboard'],
    queryFn: listarTodasPersonas,
    refetchInterval: 15000,
  });

  const { data: realVehiculos = [] } = useQuery({
    queryKey: ['vehiculosDashboard'],
    queryFn: listarTodosVehiculos,
    refetchInterval: 15000,
  });

  const { data: realPermanentes = [] } = useQuery({
    queryKey: ['permanentesDashboard'],
    queryFn: listarTodasPermanentes,
    refetchInterval: 15000,
  });

  const activeAlertsCount = realAlerts.length;
  const activeAlertsAltaCount = realAlerts.filter(a => a.alertType === 'error').length;
  
  const activeTemporalesCount = realTemporales.filter(p => p.estado === 'ACTIVO').length;

  const activePersonasCount = realPersonas.filter(p => p.estadoRegistro === 'ACTIVO').length;
  const activeVehiculosCount = realVehiculos.filter(v => v.estadoRegistro === 'ACTIVO').length;
  const activePermanentesCount = realPermanentes.filter(p => p.estado === 'ACTIVA').length;

  const kpis = [
    { title: 'Personas Activas', value: String(activePersonasCount), subtitle: 'Registradas en el sistema', icon: <PeopleIcon />, accent: 'primary' as const },
    { title: 'Vehículos Activos', value: String(activeVehiculosCount), subtitle: 'Vehículos habilitados', icon: <DirectionsCarIcon />, accent: 'secondary' as const },
    { title: 'Autorizaciones Activas', value: String(activePermanentesCount), subtitle: 'Permanentes', icon: <VerifiedUserIcon />, accent: 'info' as const },
    { title: 'Permisos Vigentes', value: String(activeTemporalesCount), subtitle: 'Conexión BD en vivo', icon: <VpnKeyIcon />, accent: 'warning' as const },
    { title: 'Perfiles Biométricos', value: String(activePersonasCount), subtitle: '146 sin registrar', icon: <FaceRetouchingNaturalIcon />, accent: 'success' as const },
    { title: 'Alertas Generadas', value: String(activeAlertsCount), subtitle: `${activeAlertsAltaCount} ALTA severidad`, icon: <WarningAmberIcon />, accent: 'error' as const },
  ];

  // Mapeo local para el UI
  const mappedAlerts = realAlerts.slice(0, 6).map(alerta => ({
    id: alerta.id,
    severidad: alerta.alertType === 'error' ? 'ALTA' : (alerta.alertType === 'warning' ? 'MEDIA' : 'INFORMATIVA'),
    descripcion: alerta.alertTitle + ': ' + alerta.alertDescription,
    referencia: alerta.referenceEventId ? `Evento: ${alerta.referenceEventId.substring(0, 8)}` : 'Sistema',
    tiempo: new Date(alerta.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  const mappedEvents = realEvents.slice(0, 7).map(evento => ({
    id: evento.id,
    hora: new Date(evento.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    placa: evento.licensePlate || 'SIN_PLACA',
    decision: evento.decision,
    origen: 'AUTOMATICA'
  }));

  const permisosExpirar = realTemporales
    .filter(p => p.estado === 'ACTIVO')
    .slice(0, 3)
    .map(p => {
      const expDate = new Date(p.vigenciaFin);
      const diffMs = expDate.getTime() - Date.now();
      const diffHrs = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
      return {
        id: p.id,
        persona: `ID Persona: ${p.personaId.substring(0, 8)}`,
        vehiculo: p.vehiculoId ? `ID Vehículo: ${p.vehiculoId.substring(0, 8)}` : 'Cualquiera',
        expira: diffHrs <= 24 ? `En ${diffHrs} horas` : `En ${Math.round(diffHrs/24)} días`
      };
    });

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
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {accionesRapidas.map((accion) => (
            <Button
              key={accion.label}
              variant="outlined"
              startIcon={accion.icon}
              size="small"
              onClick={() => navigate(accion.route)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: `${accion.color}40`,
                color: accion.color,
                '&:hover': { backgroundColor: `${accion.color}10`, borderColor: accion.color }
              }}
            >
              {accion.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {kpis.map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
            <KpiCard {...kpi} />
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
                <Button size="small" endIcon={<ArrowForwardIcon />} component={Link} to="/admin/alerting/alertas">
                  Ver todas
                </Button>
              </Box>
              <List disablePadding>
                {mappedAlerts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No hay alertas activas en el sistema
                  </Typography>
                ) : (
                  mappedAlerts.map((alerta, i) => (
                    <Box key={alerta.id}>
                      <ListItem sx={{ px: 0, py: 1.25, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 36, mt: 0.3 }}>
                          {severityIcon(alerta.severidad)}
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ component: 'div' }}
                          secondaryTypographyProps={{ component: 'div' }}
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', flex: 1 }}>
                                {alerta.descripcion}
                              </Typography>
                              <Box sx={{ flexShrink: 0 }}>
                                <StatusChip kind="severity" value={alerta.severidad} />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary" component="span">
                                {alerta.referencia}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                <AccessTimeIcon sx={{ fontSize: 14 }} /> {alerta.tiempo}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {i < mappedAlerts.length - 1 && <Divider />}
                    </Box>
                  ))
                )}
              </List>
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
                <Button size="small" endIcon={<ArrowForwardIcon />} component={Link} to="/admin/auditoria/eventos">
                  Ver historial
                </Button>
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr', gap: 1, px: 1, py: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Hora</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Placa</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Decisión</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Origen</Typography>
                </Box>
                {mappedEvents.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No hay eventos registrados
                  </Typography>
                ) : (
                  mappedEvents.map((evento, i) => (
                    <Box
                      key={evento.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 1fr 1fr',
                        gap: 1,
                        px: 1,
                        py: 1.25,
                        alignItems: 'center',
                        borderBottom: i < mappedEvents.length - 1 ? '1px solid' : 'none',
                        borderColor: 'rgba(13, 92, 207, 0.06)',
                        '&:hover': { backgroundColor: 'rgba(13, 92, 207, 0.02)' },
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {evento.hora}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {evento.placa}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {decisionIcon(evento.decision)}
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {evento.decision}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {evento.origen}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
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
                <Tooltip title="146 personas pendientes">
                  <Box sx={{ bgcolor: 'warning.main', color: '#0A2F86', borderRadius: 10, px: 1, fontSize: '0.7rem', fontWeight: 700 }}>
                    146
                  </Box>
                </Tooltip>
              </Box>
              <List disablePadding>
                {sinBiometria.map((persona, i) => (
                  <Box key={persona.id}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'rgba(242, 181, 31, 0.15)', color: 'warning.dark' }}>
                          {persona.nombre.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ component: 'div' }}
                        secondaryTypographyProps={{ component: 'div' }}
                        primary={<Typography variant="body2" sx={{ fontWeight: 600 }} component="div">{persona.nombre}</Typography>}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary" component="span">{persona.identificacion}</Typography>
                            <StatusChip kind="disponibilidad" value="PENDIENTE" />
                          </Box>
                        }
                      />
                    </ListItem>
                    {i < sinBiometria.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Permisos por Expirar (Temporales)
                </Typography>
                <Tooltip title={`${realTemporales.length} permisos en total`}>
                  <Box sx={{ bgcolor: 'warning.main', color: '#0A2F86', borderRadius: 10, px: 1, fontSize: '0.7rem', fontWeight: 700 }}>
                    {realTemporales.length}
                  </Box>
                </Tooltip>
              </Box>
              <List disablePadding>
                {permisosExpirar.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No hay permisos temporales vigentes
                  </Typography>
                ) : (
                  permisosExpirar.map((permiso, i) => (
                    <Box key={permiso.id}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ScheduleIcon sx={{ color: 'warning.main' }} />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ component: 'div' }}
                          secondaryTypographyProps={{ component: 'div' }}
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }} component="span">{permiso.persona}</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark' }} component="span">{permiso.expira}</Typography>
                            </Box>
                          }
                          secondary={<Typography variant="caption" color="text.secondary" component="span">Vehículo: {permiso.vehiculo}</Typography>}
                        />
                      </ListItem>
                      {i < permisosExpirar.length - 1 && <Divider />}
                    </Box>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

