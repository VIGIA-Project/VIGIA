import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { VehicleGrid, RegisterVehicleDrawer } from '../../components/organisms/propietario';
import { ActivityTimelineItem, ActivitySeverity } from '../../components/molecules/ActivityTimelineItem';
import { fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';
import {
  PropietarioVehiculo,
  buildInitialVehiculos,
  MIS_VEHICULOS_COPY,
  REGISTER_VEHICLE_DRAWER_COPY,
  HISTORIAL_ACCESOS_COPY,
  MOCK_ACCESOS_RECIENTES,
} from '../../config/propietario-vehiculos.config';

const LAST_UPDATED_MOCK_MINUTES = 4;

const SEVERITY_ICON: Record<ActivitySeverity, React.ReactNode> = {
  success: <CheckCircleIcon sx={{ color: vigiaColors.success, fontSize: 20 }} />,
  warning: <WarningAmberIcon sx={{ color: vigiaColors.warning, fontSize: 20 }} />,
  error: <ErrorIcon sx={{ color: vigiaColors.error, fontSize: 20 }} />,
  info: <InfoIcon sx={{ color: vigiaColors.primary, fontSize: 20 }} />,
};

const MisVehiculosPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState<PropietarioVehiculo[]>(buildInitialVehiculos);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const activos = vehiculos.filter((v) => v.estado === 'ACTIVO').length;

  const handleViewDetail = (placa: string) => {
    navigate(`/propietario/vehiculos/${placa}`);
  };

  const handleCreatePermiso = () => {
    navigate('/propietario/permisos-temporales');
  };

  const handleRegistered = (vehiculo: PropietarioVehiculo) => {
    setVehiculos((prev) => [vehiculo, ...prev]);
    setDrawerOpen(false);
    setToastOpen(true);
  };

  return (
    <DashboardTemplate rol="PROPIETARIO" pageTitle="Mis Vehículos">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
        {/* Header de sección */}
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box>
              <Box
                component="h1"
                sx={{
                  m: 0,
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  color: '#0F172A',
                }}
              >
                {MIS_VEHICULOS_COPY.title}
              </Box>
              <Box
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.8rem',
                  color: '#64748B',
                  mt: 0.5,
                }}
              >
                {activos} activos de {vehiculos.length} registrados · Última actualización: hace {LAST_UPDATED_MOCK_MINUTES} min
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDrawerOpen(true)}
              fullWidth={isMobile}
              sx={{
                background: vigiaColors.gradientIA,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                borderRadius: vigiaRadius.sm,
                px: 3,
                minHeight: 48,
                boxShadow: vigiaShadows.sm,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: vigiaShadows.md,
                  transform: shouldReduceMotion ? 'none' : 'translateY(-1px)',
                },
              }}
            >
              {MIS_VEHICULOS_COPY.registerCta}
            </Button>
          </Box>
        </motion.div>

        {/* Filtros + grid */}
        <VehicleGrid
          vehiculos={vehiculos}
          onViewDetail={handleViewDetail}
          onCreatePermiso={handleCreatePermiso}
          onRegisterClick={() => setDrawerOpen(true)}
        />

        {/* Historial reciente de accesos */}
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 2.5 }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', mb: 1.5 }}>
            {HISTORIAL_ACCESOS_COPY.title}
          </Typography>
          {MOCK_ACCESOS_RECIENTES.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
              <HistoryOutlinedIcon sx={{ color: vigiaColors.textTertiary, fontSize: 28 }} />
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: '#64748B' }}>
                {HISTORIAL_ACCESOS_COPY.empty}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {MOCK_ACCESOS_RECIENTES.map((evento) => (
                <ActivityTimelineItem
                  key={evento.id}
                  icon={SEVERITY_ICON[evento.severity]}
                  title={`${evento.placa} · ${evento.title}`}
                  subtitle={evento.subtitle}
                  timestamp={evento.timestamp}
                  severity={evento.severity}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <RegisterVehicleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onRegistered={handleRegistered} />

      <Snackbar
        open={toastOpen}
        autoHideDuration={3500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToastOpen(false)} sx={{ borderRadius: vigiaRadius.sm }}>
          {REGISTER_VEHICLE_DRAWER_COPY.successToast}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { MisVehiculosPage };
export default MisVehiculosPage;
