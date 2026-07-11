// src/pages/guardia/AlertasGuardia.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { DashboardTemplate } from '../../components/templates';

<<<<<<< Updated upstream
export const AlertasGuardiaPage: React.FC = () => (
  <DashboardTemplate rol="GUARDIA" pageTitle="Alertas">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <NotificationsOutlinedIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Alertas del Guardia — Próximamente
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center', maxWidth: 400 }}>
        Alertas de seguridad y eventos críticos en tiempo real.
      </Typography>
    </Box>
  </DashboardTemplate>
);
=======
// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            key={`tab-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ pt: 3 }}>
              {children}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { getRecentEvents, AccessEvent } from '../../services/access-control.service';
import { getActiveAlerts, Alert } from '../../services/alerting.service';

// Función para mapear un evento de acceso real a la estructura de la tabla
const mapEventToTable = (event: AccessEvent) => {
  const date = new Date(event.createdAt);
  return {
    id: event.id,
    hora: date.toLocaleTimeString(),
    placa: event.licensePlate || 'SIN PLACA',
    movimiento: event.direction === 'ENTRADA' ? 'Entrada' : 'Salida',
    decision: event.decision === 'GRANTED' ? 'SUCCESSFUL' : 'DENIED',
    origen: 'AUTOMATICA', // Simplificación por ahora
    motivoTitle: 'Sistema', // Simplificación
    motivoSub: event.reason || (event.decision === 'GRANTED' ? 'Acceso autorizado' : 'Acceso denegado'),
    resolucion: '—',
  };
};

export const AlertasGuardiaPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const { data: alerts = [], isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['activeAlerts'],
    queryFn: getActiveAlerts,
    refetchInterval: 5000,
  });

  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['recentEvents'],
    queryFn: () => getRecentEvents(20),
    refetchInterval: 5000,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const mappedHistory = events.map(mapEventToTable);
  const criticalAlertsCount = alerts.filter(a => a.alertType === 'error').length;

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Monitoreo">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="alertas y historial tabs"
            sx={{
              '& .MuiTab-root': {
                fontFamily: '"Exo 2", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.05rem',
                minWidth: 120,
              },
              '& .Mui-selected': {
                color: '#0D5CCF', // Azul Principal
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#0D5CCF', // Azul Principal
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }
            }}
          >
            <Tab label="Alertas Activas" />
            <Tab label="Historial de Eventos" />
          </Tabs>
        </Box>

        {/* TAB 0: ALERTAS */}
        <CustomTabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Header Alertas */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" sx={{ color: '#0A2F86', mb: 0.5, fontWeight: 800, fontFamily: '"Exo 2", sans-serif' }}>
                  Alertas del Turno Activas
                </Typography>
                <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>
                  Monitoreo en tiempo real de anomalías operativas.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: criticalAlertsCount > 0 ? '#FEE2E2' : '#E0F2FE', px: 2, py: 0.8, borderRadius: vigiaRadius.full }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: criticalAlertsCount > 0 ? '#DC2626' : '#0284C7' }} />
                <Typography sx={{ color: criticalAlertsCount > 0 ? '#B91C1C' : '#0369A1', fontWeight: 700, fontSize: '0.85rem' }}>{criticalAlertsCount} Críticas</Typography>
              </Box>
            </Box>

            {isLoadingAlerts ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: vigiaColors.textSecondary }}>Cargando alertas...</Typography>
              </Box>
            ) : alerts.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#FAFBFC', borderRadius: vigiaRadius.md, border: '1px dashed rgba(0,0,0,0.1)' }}>
                <Typography sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>No hay alertas activas en este momento.</Typography>
              </Box>
            ) : (
              alerts.map((alert, index) => (
                <motion.div key={alert.id} variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: index * 0.1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 3,
                      borderRadius: vigiaRadius.md,
                      border: `1px solid ${alert.alertType === 'error' ? '#FCA5A5' : '#FDE68A'}`,
                      backgroundColor: alert.alertType === 'error' ? '#FEF2F2' : '#FFFBEB',
                      borderLeft: `6px solid ${alert.alertType === 'error' ? '#DC2626' : '#F2B51F'}`,
                      justifyContent: 'space-between',
                      boxShadow: vigiaShadows.sm,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ backgroundColor: alert.alertType === 'error' ? '#FEE2E2' : '#FEF3C7', p: 1.5, borderRadius: vigiaRadius.sm }}>
                        {alert.alertType === 'error' ? <ErrorOutlineIcon sx={{ color: '#DC2626', fontSize: '2rem' }} /> : <WarningAmberIcon sx={{ color: '#F2B51F', fontSize: '2rem' }} />}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: alert.alertType === 'error' ? '#DC2626' : '#B45309', letterSpacing: 1, backgroundColor: alert.alertType === 'error' ? '#FEE2E2' : '#FEF3C7', px: 1, py: 0.2, borderRadius: vigiaRadius.sm }}>
                            {alert.alertType === 'error' ? 'SEVERIDAD ALTA' : 'SEVERIDAD MEDIA'}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: alert.alertType === 'error' ? '#991B1B' : '#92400E', fontFamily: '"Exo 2", sans-serif', mb: 0.5 }}>
                          {alert.alertTitle}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: alert.alertType === 'error' ? '#B91C1C' : '#B45309', fontSize: '0.85rem' }}>
                          <Typography>Detalle: {alert.alertDescription}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <HistoryIcon sx={{ fontSize: '1rem' }} />
                            <Typography>{new Date(alert.createdAt).toLocaleTimeString()}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Button
                      variant={alert.alertType === 'error' ? "contained" : "outlined"}
                      sx={{
                        ...(alert.alertType === 'error' ? {
                          backgroundColor: '#DC2626',
                          color: 'white',
                          '&:hover': { backgroundColor: '#B91C1C' }
                        } : {
                          borderColor: '#F2B51F',
                          color: '#B45309',
                          backgroundColor: 'rgba(255,255,255,0.5)',
                          '&:hover': { backgroundColor: '#FEF3C7', borderColor: '#B45309' }
                        }),
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: vigiaRadius.sm,
                        px: 3,
                        py: 1,
                      }}
                    >
                      {alert.alertType === 'error' ? 'Atender Protocolo' : 'Revisar'}
                    </Button>
                  </Paper>
                </motion.div>
              ))
            )}

            {/* Accordion Historial Atendidas */}
            <Accordion elevation={0} sx={{ mt: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: `${vigiaRadius.md} !important`, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: vigiaColors.textSecondary }}>
                  <HistoryIcon />
                  <Typography sx={{ fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                    Historial de Alertas Atendidas
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#FAFBFC' }}>
                <Typography sx={{ color: vigiaColors.textTertiary, textAlign: 'center' }}>
                  No hay alertas resueltas recientemente.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </CustomTabPanel>

        {/* TAB 1: HISTORIAL DE EVENTOS */}
        <CustomTabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Header Historial */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ color: '#0A2F86', mb: 0.5, fontWeight: 800, fontFamily: '"Exo 2", sans-serif' }}>
                  Historial de Eventos
                </Typography>
                <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>
                  Registro de movimientos y decisiones operativas.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TextField
                  placeholder="Buscar por placa..."
                  size="small"
                  sx={{
                    width: 250,
                    backgroundColor: vigiaColors.white,
                    '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, fontFamily: '"Inter", sans-serif' }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: vigiaColors.textTertiary }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="outlined"
                  startIcon={<CalendarTodayIcon sx={{ fontSize: '1.1rem !important' }} />}
                  endIcon={<ExpandMoreIcon />}
                  sx={{ borderColor: 'rgba(0,0,0,0.15)', color: vigiaColors.textBody, textTransform: 'none', backgroundColor: vigiaColors.white }}
                >
                  Hoy
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  sx={{ borderColor: 'rgba(0,0,0,0.15)', color: vigiaColors.textBody, textTransform: 'none', backgroundColor: vigiaColors.white }}
                >
                  Filtros
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  sx={{ borderColor: 'rgba(0,0,0,0.15)', color: vigiaColors.textBody, textTransform: 'none', backgroundColor: '#F3F4F6' }}
                >
                  Exportar
                </Button>
              </Box>
            </Box>

            {/* Table */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: vigiaRadius.md, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead sx={{ backgroundColor: '#FAFBFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: vigiaColors.textSecondary, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Hora</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: vigiaColors.textSecondary, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Placa</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: vigiaColors.textSecondary, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Movimiento</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: vigiaColors.textSecondary, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Decisión</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: vigiaColors.textSecondary, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Origen</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: vigiaColors.textSecondary, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Motivo / Actor</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: vigiaColors.textSecondary, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>Resolución</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoadingEvents ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography sx={{ color: vigiaColors.textSecondary, py: 2 }}>Cargando eventos...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : mappedHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography sx={{ color: vigiaColors.textSecondary, py: 2 }}>No hay eventos recientes.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : mappedHistory.map((row) => (
                      <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontFamily: '"Inter", sans-serif', color: vigiaColors.textBody }}>{row.hora}</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontFamily: '"Exo 2", sans-serif', color: row.decision === 'DENIED' ? '#DC2626' : vigiaColors.textBody }}>{row.placa}</TableCell>
                        <TableCell sx={{ fontFamily: '"Inter", sans-serif' }}>{row.movimiento}</TableCell>
                        <TableCell>
                          {row.decision === 'SUCCESSFUL' ? (
                            <Chip
                              icon={<CheckCircleOutlineIcon style={{ color: '#19D6C4', fontSize: '1rem' }} />} // Verde IA
                              label="SUCCESSFUL"
                              size="small"
                              sx={{ backgroundColor: 'rgba(25,214,196,0.1)', color: '#0F766C', fontWeight: 800, borderRadius: 1 }}
                            />
                          ) : (
                            <Chip
                              icon={<CancelOutlinedIcon style={{ color: '#DC2626', fontSize: '1rem' }} />}
                              label="DENIED"
                              size="small"
                              sx={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: 600, borderRadius: 1 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.origen}
                            size="small"
                            variant="outlined"
                            sx={{
                              color: row.origen === 'AUTOMATICA' ? vigiaColors.textSecondary : '#0D5CCF', // Azul Principal
                              borderColor: row.origen === 'AUTOMATICA' ? 'rgba(0,0,0,0.15)' : 'rgba(13,92,207,0.4)',
                              backgroundColor: row.origen === 'MANUAL' ? 'rgba(13,92,207,0.05)' : 'transparent',
                              fontWeight: 800,
                              borderRadius: 1,
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: vigiaColors.textBody }}>{row.motivoTitle}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: row.decision === 'DENIED' ? '#DC2626' : vigiaColors.textSecondary }}>{row.motivoSub}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontFamily: '"Inter", sans-serif', color: vigiaColors.textSecondary, fontSize: '0.85rem' }}>
                          {row.resolucion}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#FAFBFC' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: vigiaColors.textSecondary }}>
                    Mostrando 1 - 5 de 1,204
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" sx={{ minWidth: 32, p: 0, color: vigiaColors.textSecondary }}>{'<'}</Button>
                    <Button size="small" variant="contained" sx={{ minWidth: 32, p: 0, backgroundColor: '#0D5CCF', color: 'white' }}>1</Button>
                    <Button size="small" sx={{ minWidth: 32, p: 0, color: '#0A2F86' }}>2</Button>
                    <Button size="small" sx={{ minWidth: 32, p: 0, color: vigiaColors.textBody }}>3</Button>
                    <Typography sx={{ mx: 1, color: vigiaColors.textSecondary }}>...</Typography>
                    <Button size="small" sx={{ minWidth: 32, p: 0, color: vigiaColors.textSecondary }}>{'>'}</Button>
                  </Box>
                </Box>
              </TableContainer>
            </motion.div>

          </Box>
        </CustomTabPanel>

      </Box>
    </DashboardTemplate>
  );
};
>>>>>>> Stashed changes

export default AlertasGuardiaPage;
