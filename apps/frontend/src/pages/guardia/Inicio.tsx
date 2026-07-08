import React from 'react';
import { Box, Typography, Card, CardContent, Button, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { SectionHeader } from '../../components/atoms';
import { KpiCard, EventQueueItem, RecentAlertItem } from '../../components/molecules';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';

// Icons
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import TimerIcon from '@mui/icons-material/Timer';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CampaignIcon from '@mui/icons-material/Campaign';

// === MOCK DATA ===
const MOCK_KPIS = [
  { value: 3, label: 'Eventos Pendientes', indicator: 'ATENCIÓN REQ.', indicatorColor: vigiaColors.warning, accentColor: vigiaColors.warning },
  { value: 2, label: 'Tiempo Promedio', indicator: '— Estable', indicatorColor: vigiaColors.textSecondary, accentColor: vigiaColors.textSecondary, suffix: 'm' },
  { value: 14, label: 'Eventos del Turno', accentColor: vigiaColors.primary },
  { value: 1, label: 'Alertas Activas', indicator: 'SEVERIDAD ALTA', indicatorColor: vigiaColors.error, accentColor: vigiaColors.error },
];

const MOCK_COLA = [
  { placa: 'XYZ-8888', timeAgo: 'hace 4m', timeAgoColor: 'error' as const, motivo: 'FALLO_OCR', buttonType: 'primary' as const },
  { placa: 'ABC-1234', timeAgo: 'hace 2m', timeAgoColor: 'warning' as const, motivo: 'SIN_PERFILES', buttonType: 'outline' as const },
  { placa: 'LMN-9012', timeAgo: 'hace 1m', timeAgoColor: 'default' as const, motivo: 'CONFIRMACION_VISUAL', buttonType: 'outline' as const },
];

const MOCK_ALERTAS = [
  { severity: 'alta' as const, title: 'Intento de salida no autorizado', subtitle: 'Puerta Norte • 06:12 AM' },
  { severity: 'media' as const, title: 'Puerta abierta demasiado tiempo', subtitle: 'Acceso Peatonal B • 06:05 AM' },
];

export const GuardiaInicioPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            {MOCK_KPIS.map((kpi) => (
              <KpiCard
                key={kpi.label}
                value={kpi.value}
                label={kpi.label}
                indicator={kpi.indicator}
                indicatorColor={kpi.indicatorColor}
                accentColor={kpi.accentColor}
                suffix={kpi.suffix}
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
                  {MOCK_COLA.map((item) => (
                    <EventQueueItem
                      key={item.placa}
                      {...item}
                      onReview={() => navigate('/guardia/revision-manual')}
                    />
                  ))}
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
                  {MOCK_ALERTAS.map((alerta, i) => (
                    <RecentAlertItem key={i} {...alerta} />
                  ))}
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
