import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Alert, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { PermisosGrid } from '../../components/organisms/propietario/PermisosGrid';
import { CreatePermisoDrawer, CreatePermisoData } from '../../components/organisms/propietario/CreatePermisoDrawer';
import { RevokePermisoModal } from '../../components/organisms/propietario/RevokePermisoModal';
import { ErrorState, LoadingSkeleton, PerfilIncompletoState } from '../../components/atoms';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { PermisoTemporal, mapPermisoAViewModel } from '../../config/propietario-permisos.config';
import { usePropietarioVehiculo, useCrearPersona, usePersonasDelPropietario as usePersonasResolver } from '../../hooks/useRegistry';
import { usePermisosVigentesPorVehiculo, useCrearPermiso, useRevocarPermiso } from '../../hooks/useAuthorization';

const PermisosTemporalesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  const { vehiculo, isLoading: isLoadingVehiculo, isError: isErrorVehiculo, refetch: refetchVehiculo, perfilIncompleto } = usePropietarioVehiculo();
  const permisosQuery = usePermisosVigentesPorVehiculo(vehiculo?.vehiculoId);
  const crearPersonaMutation = useCrearPersona();
  const crearPermisoMutation = useCrearPermiso();
  const revocarPermisoMutation = useRevocarPermiso(vehiculo?.vehiculoId);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<PermisoTemporal | null>(null);
  const [detailTarget, setDetailTarget] = useState<PermisoTemporal | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const permisosApi = permisosQuery.data ?? [];
  const personaIds = useMemo(() => permisosApi.map((p) => p.personaId), [permisosApi]);
  const { personasById, isLoading: isLoadingPersonas } = usePersonasResolver(personaIds);

  const permisos: PermisoTemporal[] = useMemo(
    () => permisosApi.map((p) => mapPermisoAViewModel(p, personasById.get(p.personaId), vehiculo)),
    [permisosApi, personasById, vehiculo]
  );

  useEffect(() => {
    if ((location.state as { openCrearPermiso?: boolean } | null)?.openCrearPermiso && vehiculo) {
      setDrawerOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, vehiculo]);

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    const axiosErr = err as AxiosError<{ message?: string | string[] }>;
    const message = axiosErr.response?.data?.message;
    return (Array.isArray(message) ? message[0] : message) || fallback;
  };

  const handleConfirmed = async (data: CreatePermisoData) => {
    const [nombres, ...resto] = data.nombre.trim().split(/\s+/);
    const apellidos = resto.join(' ') || nombres;

    try {
      const persona = await crearPersonaMutation.mutateAsync({
        identificacionTipo: 'CEDULA',
        identificacionNumero: data.cedula,
        nombres,
        apellidos,
        telefonoContacto: data.telefono,
      });

      await crearPermisoMutation.mutateAsync({
        personaId: persona.personaId,
        vehiculoId: data.vehiculoId,
        vigenciaInicio: data.fechaInicio,
        vigenciaFin: data.fechaFin,
        motivo: data.motivo,
      });

      setDrawerOpen(false);
      setSnackbarMessage('Permiso temporal creado correctamente');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(extractErrorMessage(err, 'No se pudo crear el permiso temporal.'));
      setSnackbarOpen(true);
    }
  };

  const handleRevoke = async (id: string, _motivoRevocacion: string) => {
    try {
      await revocarPermisoMutation.mutateAsync(id);
      setRevokeTarget(null);
      setSnackbarMessage('Permiso revocado');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(extractErrorMessage(err, 'No se pudo revocar el permiso.'));
      setSnackbarOpen(true);
    }
  };

  if (isLoadingVehiculo) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Permisos temporales">
        <LoadingSkeleton variant="cards" rows={3} />
      </DashboardTemplate>
    );
  }

  if (isErrorVehiculo) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Permisos temporales">
        <ErrorState mensaje="No se pudo cargar tu información de vehículo." onRetry={() => refetchVehiculo()} />
      </DashboardTemplate>
    );
  }

  if (perfilIncompleto) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Permisos temporales">
        <PerfilIncompletoState />
      </DashboardTemplate>
    );
  }

  if (!vehiculo) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Permisos temporales">
        <Box sx={{ textAlign: 'center', py: 8, px: 3, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <CalendarMonthOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.primary, mb: 2 }} />
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', mb: 1 }}>
            Necesitas al menos un vehículo registrado
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary, mb: 3 }}>
            Registra tu primer vehículo para poder crear permisos temporales.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/propietario/vehiculos')}
            sx={{ background: vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, px: 3, minHeight: 44 }}
          >
            Registrar vehículo
          </Button>
        </Box>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Permisos temporales">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem' }, color: '#0F172A' }}>
                Permisos temporales
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#64748B', mt: 0.5 }}>
                Autoriza acceso temporal a personas externas a tu grupo familiar
              </Typography>
            </Box>
            <Button
              onClick={() => setDrawerOpen(true)}
              fullWidth={isMobile}
              startIcon={<CalendarMonthOutlinedIcon />}
              sx={{
                background: vigiaColors.gradientIA,
                color: '#FFFFFF',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: vigiaRadius.md,
                height: 48,
                px: 3,
                flexShrink: 0,
                '&:hover': { background: vigiaColors.gradientIA },
              }}
            >
              Crear permiso
            </Button>
          </Box>
        </motion.div>

        {permisosQuery.isLoading || isLoadingPersonas ? (
          <LoadingSkeleton variant="cards" rows={3} />
        ) : permisosQuery.isError ? (
          <ErrorState mensaje="No se pudieron cargar los permisos temporales." onRetry={() => permisosQuery.refetch()} />
        ) : (
          <PermisosGrid
            permisos={permisos}
            onViewDetail={(id) => setDetailTarget(permisos.find((p) => p.id === id) || null)}
            onRevoke={(id) => setRevokeTarget(permisos.find((p) => p.id === id) || null)}
            onCreateClick={() => setDrawerOpen(true)}
          />
        )}
      </Box>

      <CreatePermisoDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} vehiculo={vehiculo} onConfirmed={handleConfirmed} />
      <RevokePermisoModal permiso={revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke} />

      <Dialog open={!!detailTarget} onClose={() => setDetailTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: '#0F172A' }}>
          Detalle del permiso
          <IconButton onClick={() => setDetailTarget(null)} size="small" aria-label="Cerrar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          {detailTarget && (
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2 }}>
              {[
                ['Persona', detailTarget.persona],
                ['Cédula', detailTarget.cedula],
                ['Vehículo', `${detailTarget.vehiculo.marca} ${detailTarget.vehiculo.modelo} · ${detailTarget.vehiculo.placa}`],
                ['Vigencia', `${detailTarget.fechaInicio} → ${detailTarget.fechaFin}`],
                ['Motivo', detailTarget.motivo],
                ...(detailTarget.motivoRevocacion ? [['Motivo de revocación', detailTarget.motivoRevocacion]] : []),
              ].map(([label, value], idx) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75, borderTop: idx === 0 ? 'none' : '1px solid #F1F5F9' }}>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B', flexShrink: 0 }}>{label}</Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A', textAlign: 'right' }}>{value}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3500} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { PermisosTemporalesPage };
export default PermisosTemporalesPage;
