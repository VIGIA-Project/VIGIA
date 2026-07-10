import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

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

import { registryService } from '../../services/registry.service';
import { authorizationService } from '../../services/authorization.service';
import { biometricService } from '../../services/biometric.service';
import { alertingService } from '../../services/alerting.service';
import { accessControlService } from '../../services/access-control.service';

const accionesRapidas = [
  { label: 'Nueva Persona', icon: <PersonAddIcon />, color: '#0D5CCF', href: '#/admin/registro/personas' },
  { label: 'Nueva Autorización', icon: <AssignmentIndIcon />, color: '#11A9D6', href: '#/admin/authorization/permanentes' },
  { label: 'Permiso Temporal', icon: <ScheduleIcon />, color: '#E0A82E', href: '#/admin/authorization/temporales' },
  { label: 'Ver Alertas', icon: <NotificationsActiveIcon />, color: '#C0524A', href: '#/admin/alerting/alertas' },
];

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
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    personas: 0,
    vehiculos: 0,
    permanentes: 0,
    temporales: 0,
    biometricos: 0,
    alertas: 0,
  });
  const [alertas, setAlertas] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [sinBiometria, setSinBiometria] = useState<any[]>([]);
  const [permisosExpirar, setPermisosExpirar] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          cntPersonas,
          cntVehiculos,
          cntPermanentes,
          cntTemporales,
          cntBiometricos,
          cntAlertas,
          dataAlertas,
          dataEventos,
          dataSinBiometria,
          dataPermisosExpirar,
        ] = await Promise.all([
          registryService.countPersonas().catch(() => 0),
          registryService.countVehiculos().catch(() => 0),
          authorizationService.countPermanentes().catch(() => 0),
          authorizationService.countTemporales().catch(() => 0),
          biometricService.contarPerfiles().catch(() => 0),
          alertingService.contarAlertas().catch(() => 0),
          alertingService.obtenerAlertasRecientes(6).catch(() => []),
          accessControlService.obtenerEventosRecientes(7).catch(() => []),
          registryService.getPersonasSinBiometria().catch(() => []),
          authorizationService.getTemporalesProximosAExpirar().catch(() => []),
        ]);

        setCounts({
          personas: cntPersonas,
          vehiculos: cntVehiculos,
          permanentes: cntPermanentes,
          temporales: cntTemporales,
          biometricos: cntBiometricos,
          alertas: cntAlertas,
        });
        setAlertas(dataAlertas || []);
        setEventos(dataEventos || []);
        setSinBiometria(dataSinBiometria || []);
        setPermisosExpirar(dataPermisosExpirar || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const kpis = [
    { title: 'Personas Registradas', value: counts.personas.toString(), subtitle: 'En el sistema', icon: <PeopleIcon />, accent: 'primary' as const },
    { title: 'Vehículos Registrados', value: counts.vehiculos.toString(), subtitle: 'En el sistema', icon: <DirectionsCarIcon />, accent: 'secondary' as const },
    { title: 'Autorizaciones Activas', value: counts.permanentes.toString(), subtitle: 'Permanentes', icon: <VerifiedUserIcon />, accent: 'info' as const },
    { title: 'Permisos Vigentes', value: counts.temporales.toString(), subtitle: 'Temporales', icon: <VpnKeyIcon />, accent: 'warning' as const },
    { title: 'Perfiles Biométricos', value: counts.biometricos.toString(), subtitle: 'Activos', icon: <FaceRetouchingNaturalIcon />, accent: 'success' as const },
    { title: 'Alertas Generadas', value: counts.alertas.toString(), subtitle: 'Totales históricas', icon: <WarningAmberIcon />, accent: 'error' as const },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
              href={accion.href}
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
                <Button size="small" endIcon={<ArrowForwardIcon />} href="#/admin/alerting/alertas">
                  Ver todas
                </Button>
              </Box>
              <List disablePadding>
                {alertas.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No hay alertas recientes.</Typography>
                )}
                {alertas.map((alerta: any, i: number) => (
                  <Box key={alerta.id}>
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
                              {alerta.causaOrigen}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                              <AccessTimeIcon sx={{ fontSize: 14 }} /> {new Date(alerta.generadaEn).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {i < alertas.length - 1 && <Divider />}
                  </Box>
                ))}
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
                <Button size="small" endIcon={<ArrowForwardIcon />} href="#/admin/auditoria/eventos">
                  Ver historial
                </Button>
              </Box>
              <Box sx={{ overflow: 'hidden' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 1, px: 1, py: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Hora</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Placa</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Decisión</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Origen</Typography>
                </Box>
                {eventos.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, px: 1 }}>No hay eventos recientes.</Typography>
                )}
                {eventos.map((evento: any, i: number) => (
                  <Box
                    key={evento.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 1fr 1fr',
                      gap: 1,
                      px: 1,
                      py: 1.25,
                      alignItems: 'center',
                      borderBottom: i < eventos.length - 1 ? '1px solid' : 'none',
                      borderColor: 'rgba(13, 92, 207, 0.06)',
                      '&:hover': { backgroundColor: 'rgba(13, 92, 207, 0.02)' },
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {new Date(evento.timestampEvento).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {evento.placaCapturada || 'S/N'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {decisionIcon(evento.decision)}
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {evento.decision}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {evento.origenResolucion}
                    </Typography>
                  </Box>
                ))}
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
                <Tooltip title={`${sinBiometria.length} personas pendientes`}>
                  <Box sx={{ bgcolor: 'warning.main', color: '#0A2F86', borderRadius: 10, px: 1, fontSize: '0.7rem', fontWeight: 700 }}>
                    {sinBiometria.length}
                  </Box>
                </Tooltip>
              </Box>
              <List disablePadding>
                {sinBiometria.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>Todas las personas tienen biometría.</Typography>
                )}
                {sinBiometria.slice(0, 5).map((persona: any, i: number) => (
                  <Box key={persona.personaId}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'rgba(242, 181, 31, 0.15)', color: 'warning.dark' }}>
                          {persona.nombres?.charAt(0) || persona.nombreCompleto?.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{persona.nombreCompleto || `${persona.nombres} ${persona.apellidos}`}</Typography>}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">{persona.identificacionNumero}</Typography>
                            <StatusChip kind="disponibilidad" value="PENDIENTE" />
                          </Box>
                        }
                      />
                    </ListItem>
                    {i < Math.min(sinBiometria.length, 5) - 1 && <Divider />}
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
                  Permisos por Expirar (48h)
                </Typography>
                <Tooltip title={`${permisosExpirar.length} permisos próximos`}>
                  <Box sx={{ bgcolor: 'warning.main', color: '#0A2F86', borderRadius: 10, px: 1, fontSize: '0.7rem', fontWeight: 700 }}>
                    {permisosExpirar.length}
                  </Box>
                </Tooltip>
              </Box>
              <List disablePadding>
                {permisosExpirar.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No hay permisos próximos a expirar.</Typography>
                )}
                {permisosExpirar.map((permiso: any, i: number) => (
                  <Box key={permiso.id}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ScheduleIcon sx={{ color: 'warning.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{permiso.motivo}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                              {new Date(permiso.vigencia?.fin || permiso.vigenciaFin).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                        secondary={<Typography variant="caption" color="text.secondary">ID Permiso: {permiso.id.slice(0, 8)}</Typography>}
                      />
                    </ListItem>
                    {i < permisosExpirar.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
