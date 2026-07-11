import React from 'react';
import { Box, Typography, Card, CardContent, Button, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { KpiCard, EventQueueItem, RecentAlertItem } from '../../components/molecules';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { useQuery } from '@tanstack/react-query';
import { accessControlService } from '../../services/access-control.service';
import { alertingService } from '../../services/alerting.service';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';

// Icons
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CampaignIcon from '@mui/icons-material/Campaign';



export const GuardiaInicioPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: alertasRaw = [] } = useQuery({
    queryKey: ['alertas', 'recientes', 'guardia'],
    queryFn: () => alertingService.obtenerAlertasRecientes(5)
  });

  const { data: eventosRaw = [] } = useQuery({
    queryKey: ['eventos', 'recientes', 'guardia'],
    queryFn: () => accessControlService.obtenerEventosRecientes(10)
  });

  const alertas = alertasRaw.map((a: any) => ({
    severity: (a.severidad?.toLowerCase() as 'alta' | 'media' | 'informativa') || 'informativa',
    title: a.mensajeResumen || a.titulo || 'Alerta',
    subtitle: `${a.causaOrigen || 'Sistema'} • ${new Date(a.generadaEn || a.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }));

  const cola = eventosRaw.filter((e: any) => e.decision !== 'SUCCESSFUL').map((e: any) => ({
    placa: e.placaCapturada || 'S/N',
    timeAgo: new Date(e.timestampEvento || e.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timeAgoColor: e.decision === 'DENIED' ? 'error' as const : 'warning' as const,
    motivo: e.origenResolucion || 'REVISIÓN MANUAL',
    buttonType: 'outline' as const
  }));

  const kpis = [
    { value: cola.length, label: 'Eventos Pendientes', indicator: cola.length > 0 ? 'ATENCIÓN REQ.' : '— Estable', indicatorColor: cola.length > 0 ? vigiaColors.warning : vigiaColors.textSecondary, accentColor: vigiaColors.warning },
    { value: eventosRaw.length, label: 'Eventos Recientes', accentColor: vigiaColors.primary },
    { value: alertas.filter((a: any) => a.severity === 'alta').length, label: 'Alertas Activas', indicator: alertas.filter((a: any) => a.severity === 'alta').length > 0 ? 'SEVERIDAD ALTA' : 'Sin alertas graves', indicatorColor: alertas.filter((a: any) => a.severity === 'alta').length > 0 ? vigiaColors.error : vigiaColors.textSecondary, accentColor: vigiaColors.error },
  ];

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Inicio">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
        {/* BLOQUE 1: Título y subtítulo */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box>
            <Typography
              sx={{
                fontFamily: '"Exo 2", sans-serif',
                fontWeight: 600,
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                color: '#0A2F86', // Matches the image's dark blue header
              }}
            >
              Panel Operativo - Inicio
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                color: vigiaColors.textSecondary,
                mt: 0.5,
              }}
            >
              Resumen de actividad y tareas pendientes para el turno actual.
            </Typography>
          </Box>
        </motion.div>

        {/* BLOQUE 2: KPIs */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
              gap: `${vigiaSpacing.cardGap}px`,
            }}
          >
            {kpis.map((kpi) => (
              <KpiCard
                key={kpi.label}
                value={kpi.value}
                label={kpi.label}
                indicator={kpi.indicator}
                indicatorColor={kpi.indicatorColor}
                accentColor={kpi.accentColor}
              />
            ))}
          </Box>
        </motion.div>

        {/* BLOQUE 3: Cola y Alertas (Side by side en desktop) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1.2fr' },
            gap: `${vigiaSpacing.cardGap}px`,
          }}
        >
          {/* Columna Izquierda: Cola de Pendientes */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card sx={{ borderRadius: vigiaRadius.md, boxShadow: vigiaShadows.sm, height: '100%' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HourglassTopIcon sx={{ color: '#8B4513' }} />
                    <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#0A2F86' }}>
                      Cola de Pendientes
                    </Typography>
                  </Box>
                  <Typography
                    onClick={() => {}}
                    sx={{ fontSize: '0.75rem', color: vigiaColors.primary, cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  >
                    VER TODOS (3)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {cola.length === 0 ? (
                    <Typography sx={{ p: 3, textAlign: 'center', color: vigiaColors.textSecondary, fontSize: '0.85rem' }}>
                      No hay eventos pendientes de revisión.
                    </Typography>
                  ) : (
                    cola.map((item: any, idx: number) => (
                      <EventQueueItem
                        key={idx}
                        {...item}
                        onReview={() => navigate('/guardia/revision-manual')}
                      />
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Columna Derecha: Alertas Recientes */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card sx={{ borderRadius: vigiaRadius.md, boxShadow: vigiaShadows.sm, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CampaignIcon sx={{ color: '#C62828' }} />
                  <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#0A2F86' }}>
                    Alertas Recientes
                  </Typography>
                </Box>
                <Box sx={{ p: 2, flex: 1 }}>
                  {alertas.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', color: vigiaColors.textSecondary, fontSize: '0.85rem', mt: 2 }}>
                      No hay alertas recientes.
                    </Typography>
                  ) : (
                    alertas.map((alerta: any, i: number) => (
                      <RecentAlertItem key={i} {...alerta} />
                    ))
                  )}
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/guardia/alertas')}
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#0A2F86',
                      borderColor: 'rgba(10, 47, 134, 0.3)',
                      borderRadius: vigiaRadius.sm,
                      '&:hover': { backgroundColor: 'rgba(10, 47, 134, 0.05)' }
                    }}
                  >
                    Ver Historial de Alertas
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </DashboardTemplate>
  );
};

export default GuardiaInicioPage;
