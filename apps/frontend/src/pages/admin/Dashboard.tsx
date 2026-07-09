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

const kpis = [
  { title: 'Personas Activas', value: '1,248', subtitle: '+12 esta semana', icon: <PeopleIcon />, accent: 'primary' as const },
  { title: 'Vehículos Activos', value: '386', subtitle: '342 con autorización vigente', icon: <DirectionsCarIcon />, accent: 'secondary' as const },
  { title: 'Autorizaciones Activas', value: '421', subtitle: '9 revocadas hoy', icon: <VerifiedUserIcon />, accent: 'info' as const },
  { title: 'Permisos Vigentes', value: '57', subtitle: '3 próximos a expirar', icon: <VpnKeyIcon />, accent: 'warning' as const },
  { title: 'Perfiles Biométricos', value: '1,102', subtitle: '146 sin registrar', icon: <FaceRetouchingNaturalIcon />, accent: 'success' as const },
  { title: 'Alertas Generadas', value: '23', subtitle: '5 ALTA severidad', icon: <WarningAmberIcon />, accent: 'error' as const },
];

const alertas = [
  { id: 1, severidad: 'ALTA', descripcion: 'Acceso denegado: persona no autorizada en portón norte', referencia: 'Vehículo PBC-1231', tiempo: 'hace 5 min' },
  { id: 2, severidad: 'ALTA', descripcion: 'Intento de acceso con biometría sin coincidencia suficiente', referencia: 'Persona ID 4521', tiempo: 'hace 12 min' },
  { id: 3, severidad: 'MEDIA', descripcion: 'Permiso temporal próximo a expirar en menos de 1 hora', referencia: 'Vehículo GTR-8832', tiempo: 'hace 28 min' },
  { id: 4, severidad: 'MEDIA', descripcion: 'Cuenta de usuario con cambio de contraseña pendiente', referencia: 'jperez@uce.edu.ec', tiempo: 'hace 1 h' },
  { id: 5, severidad: 'INFORMATIVA', descripcion: 'Nueva autorización permanente registrada', referencia: 'Vehículo ABC-0123', tiempo: 'hace 2 h' },
  { id: 6, severidad: 'INFORMATIVA', descripcion: 'Perfil biométrico actualizado correctamente', referencia: 'Persona ID 3389', tiempo: 'hace 3 h' },
];

const eventos = [
  { id: 1, hora: '14:32', placa: 'PBC-1231', decision: 'DENIED', origen: 'AUTOMATICA' },
  { id: 2, hora: '14:28', placa: 'ABC-0123', decision: 'SUCCESSFUL', origen: 'AUTOMATICA' },
  { id: 3, hora: '14:15', placa: 'GTR-8832', decision: 'PENDING_VERIFY', origen: 'MANUAL' },
  { id: 4, hora: '14:02', placa: 'XYZ-4567', decision: 'SUCCESSFUL', origen: 'AUTOMATICA' },
  { id: 5, hora: '13:48', placa: 'MNL-7788', decision: 'DENIED', origen: 'CONTINGENCIA' },
  { id: 6, hora: '13:35', placa: 'UCE-0001', decision: 'SUCCESSFUL', origen: 'AUTOMATICA' },
  { id: 7, hora: '13:20', placa: 'TST-9921', decision: 'PENDING_VERIFY', origen: 'MANUAL' },
];

const sinBiometria = [
  { id: 1, nombre: 'María Fernanda López', identificacion: '1712345678', rol: 'Docente' },
  { id: 2, nombre: 'Carlos Andrés Mendoza', identificacion: '1718901234', rol: 'Estudiante' },
  { id: 3, nombre: 'Patricia Salazar Naranjo', identificacion: '1709876543', rol: 'Administrativo' },
  { id: 4, nombre: 'Jorge Luis Velasteguí', identificacion: '1714567890', rol: 'Docente' },
];

const permisosExpirar = [
  { id: 1, persona: 'Diego Ramírez', vehiculo: 'KJH-3344', expira: 'En 2 horas' },
  { id: 2, persona: 'Ana Lucía Paredes', vehiculo: 'LPM-5566', expira: 'En 5 horas' },
  { id: 3, persona: 'Fernando Cevallos', vehiculo: 'QWE-7788', expira: 'En 1 día' },
];

const accionesRapidas = [
  { label: 'Nueva Persona', icon: <PersonAddIcon />, color: '#0D5CCF' },
  { label: 'Nueva Autorización', icon: <AssignmentIndIcon />, color: '#11A9D6' },
  { label: 'Permiso Temporal', icon: <ScheduleIcon />, color: '#E0A82E' },
  { label: 'Ver Alertas', icon: <NotificationsActiveIcon />, color: '#C0524A' },
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
                {alertas.map((alerta, i) => (
                  <Box key={alerta.id}>
                    <ListItem sx={{ px: 0, py: 1.25, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 36, mt: 0.3 }}>
                        {severityIcon(alerta.severidad)}
                      </ListItemIcon>
                      <ListItemText
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
                            <Typography variant="body2" color="text.secondary">
                              {alerta.referencia}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                              <AccessTimeIcon sx={{ fontSize: 14 }} /> {alerta.tiempo}
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
                <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr', gap: 1, px: 1, py: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Hora</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Placa</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Decisión</Typography>
                  <Typography variant="overline" sx={{ fontWeight: 700 }}>Origen</Typography>
                </Box>
                {eventos.map((evento, i) => (
                  <Box
                    key={evento.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 1fr 1fr',
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
                        primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{persona.nombre}</Typography>}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">{persona.identificacion}</Typography>
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
                  Permisos por Expirar
                </Typography>
                <Tooltip title="3 permisos próximos">
                  <Box sx={{ bgcolor: 'warning.main', color: '#0A2F86', borderRadius: 10, px: 1, fontSize: '0.7rem', fontWeight: 700 }}>
                    3
                  </Box>
                </Tooltip>
              </Box>
              <List disablePadding>
                {permisosExpirar.map((permiso, i) => (
                  <Box key={permiso.id}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ScheduleIcon sx={{ color: 'warning.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{permiso.persona}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark' }}>{permiso.expira}</Typography>
                          </Box>
                        }
                        secondary={<Typography variant="caption" color="text.secondary">Vehículo: {permiso.vehiculo}</Typography>}
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
