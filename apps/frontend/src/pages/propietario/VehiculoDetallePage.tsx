import React, { useMemo, useState } from 'react';
import { Box, Snackbar, Alert, Tab, Tabs, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import {
  VehiculoResumenTab,
  VehiculoPersonasTab,
  VehiculoPermisosTab,
  VehiculoPasesTab,
  VehiculoActividadTab,
  RegisterVehicleDrawer,
} from '../../components/organisms/propietario';
import { LoadingSkeleton, ErrorState } from '../../components/atoms';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { PropietarioVehiculo, REGISTER_VEHICLE_DRAWER_COPY } from '../../config/propietario-vehiculos.config';
import { VEHICULO_DETALLE_TABS, VEHICULO_DETALLE_COPY, ESTADO_VEHICULO_STYLES, TabKey } from '../../config/propietario-vehiculo-detalle.config';
import { useAuth } from '../../context';
import { useActualizarVehiculo, useVehiculosDelPropietario } from '../../hooks/useRegistry';

const VehiculoDetallePage: React.FC = () => {
  const navigate = useNavigate();
  const { placa } = useParams<{ placa: string }>();
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editToast, setEditToast] = useState(false);

  const vehiculosQuery = useVehiculosDelPropietario(user?.personaId);
  const actualizarVehiculoMutation = useActualizarVehiculo();

  const vehiculoApi = useMemo(
    () => (vehiculosQuery.data ?? []).find((v) => v.placa === placa),
    [vehiculosQuery.data, placa]
  );

  const vehiculo: PropietarioVehiculo | undefined = useMemo(() => {
    if (!vehiculoApi) return undefined;
    return {
      id: vehiculoApi.vehiculoId,
      vehiculoId: vehiculoApi.vehiculoId,
      placa: vehiculoApi.placa,
      marca: vehiculoApi.marca ?? 'Sin marca',
      modelo: vehiculoApi.modelo ?? 'Sin modelo',
      color: vehiculoApi.color ?? 'N/D',
      anio: vehiculoApi.anio ?? 0,
      estado: vehiculoApi.estadoRegistro === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO',
      tipo: 'Particular',
      permisosActivos: 0,
      alertas: 0,
      personasAsignadas: 0,
      personasSinBiometria: 0,
    };
  }, [vehiculoApi]);

  const handleUpdated = async (actualizado: PropietarioVehiculo) => {
    if (!vehiculo) return;
    await actualizarVehiculoMutation.mutateAsync({
      vehiculoId: vehiculo.vehiculoId,
      dto: {
        marca: actualizado.marca,
        modelo: actualizado.modelo,
        color: actualizado.color,
        anio: actualizado.anio,
      },
    });
    setEditDrawerOpen(false);
    setEditToast(true);
  };

  if (vehiculosQuery.isLoading) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Detalle de vehículo">
        <LoadingSkeleton variant="detail" />
      </DashboardTemplate>
    );
  }

  if (vehiculosQuery.isError) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Detalle de vehículo">
        <ErrorState mensaje="No se pudo cargar tu información de vehículo." onRetry={() => vehiculosQuery.refetch()} />
      </DashboardTemplate>
    );
  }

  if (!vehiculo) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Detalle de vehículo">
        <Box
          component="button"
          onClick={() => navigate('/propietario/vehiculos')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', mb: 3, transition: 'color 0.15s ease', '&:hover': { textDecoration: 'underline' } }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          {VEHICULO_DETALLE_COPY.backLabel}
        </Box>
        <Box sx={{ textAlign: 'center', py: 8, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <SearchOffOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.textTertiary, mb: 2 }} />
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', mb: 1 }}>
            {VEHICULO_DETALLE_COPY.notFoundTitle}
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary }}>
            {VEHICULO_DETALLE_COPY.notFoundDescription}
          </Typography>
        </Box>
      </DashboardTemplate>
    );
  }

  const estadoStyle = ESTADO_VEHICULO_STYLES[vehiculo.estado];

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Detalle de vehículo">
      <Box sx={{ mx: -4, mt: -4 }}>
        {/* Header de página */}
        <Box sx={{ backgroundColor: vigiaColors.bgCard, borderBottom: '1px solid #E2E8F0', px: 4, py: 3 }}>
          <Box
            component="button"
            onClick={() => navigate('/propietario/vehiculos')}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', mb: 2, transition: 'color 0.15s ease', '&:hover': { textDecoration: 'underline' } }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            {VEHICULO_DETALLE_COPY.backLabel}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography component="h1" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.75rem', md: '2rem' }, color: '#0F172A', letterSpacing: '0.5px' }}>
                  {vehiculo.placa}
                </Typography>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.35,
                    borderRadius: vigiaRadius.full,
                    backgroundColor: estadoStyle.bg,
                    color: estadoStyle.color,
                    border: `1px solid ${estadoStyle.border}`,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {vehiculo.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                </Box>
              </Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#64748B', mt: 0.5 }}>
                {vehiculo.marca} {vehiculo.modelo} · {vehiculo.color} · {vehiculo.anio || '—'} · {vehiculo.tipo}
              </Typography>
            </Box>

            <Box
              component="button"
              onClick={() => setEditDrawerOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                border: `1px solid ${vigiaColors.primary}`,
                borderRadius: vigiaRadius.sm,
                backgroundColor: 'transparent',
                color: vigiaColors.primary,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                px: 2.5,
                py: 1.2,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                '&:hover': { backgroundColor: 'rgba(13,92,207,0.06)' },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
              {VEHICULO_DETALLE_COPY.editCta}
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: vigiaColors.bgCard, borderBottom: '1px solid #E2E8F0' }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              px: 4,
              minHeight: 48,
              '& .MuiTabs-indicator': { backgroundColor: '#0D5CCF', height: 3 },
            }}
          >
            {VEHICULO_DETALLE_TABS.map((tab) => (
              <Tab
                key={tab.key}
                value={tab.key}
                label={tab.label}
                sx={{
                  textTransform: 'none',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  minHeight: 48,
                  color: '#64748B',
                  '&:hover': { color: '#0F172A' },
                  '&.Mui-selected': { color: '#0D5CCF' },
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Contenido de la tab activa */}
      <Box sx={{ pt: 3 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'resumen' && <VehiculoResumenTab vehiculo={vehiculo} onNavigateTab={setActiveTab} />}
            {activeTab === 'personas' && <VehiculoPersonasTab />}
            {activeTab === 'permisos' && <VehiculoPermisosTab vehiculo={vehiculo} />}
            {activeTab === 'pases' && <VehiculoPasesTab vehiculoId={vehiculo.vehiculoId} />}
            {activeTab === 'actividad' && <VehiculoActividadTab vehiculoId={vehiculo.vehiculoId} />}
          </motion.div>
        </AnimatePresence>
      </Box>

      <RegisterVehicleDrawer
        mode="edit"
        vehiculo={vehiculo}
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onUpdated={handleUpdated}
      />

      <Snackbar open={editToast} autoHideDuration={3500} onClose={() => setEditToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" variant="filled" onClose={() => setEditToast(false)} sx={{ borderRadius: vigiaRadius.sm }}>
          {REGISTER_VEHICLE_DRAWER_COPY.successToastEdit}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { VehiculoDetallePage };
export default VehiculoDetallePage;
