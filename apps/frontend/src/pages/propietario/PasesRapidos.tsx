// src/pages/propietario/PasesRapidos.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Alert, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { addHours } from 'date-fns';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { PasesGrid } from '../../components/organisms/propietario/PasesGrid';
import { GenerarPaseDrawer, GenerarPaseData } from '../../components/organisms/propietario/GenerarPaseDrawer';
import { RevokePaseModal } from '../../components/organisms/propietario/RevokePaseModal';
import { ErrorState, LoadingSkeleton } from '../../components/atoms';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { PaseRapido, mapPaseAViewModel } from '../../config/propietario-pases.config';
import { usePropietarioVehiculo } from '../../hooks/useRegistry';
import { useMisPases, useGenerarPase, useRevocarPase } from '../../hooks/useAuthorization';
import { GenerarPaseResult } from '../../services/types/authorization.types';

const PasesRapidosPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  const { vehiculo, isLoading: isLoadingVehiculo } = usePropietarioVehiculo();
  const pasesQuery = useMisPases();
  const generarPaseMutation = useGenerarPase();
  const revocarPaseMutation = useRevocarPase();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<PaseRapido | null>(null);
  const [detailTarget, setDetailTarget] = useState<PaseRapido | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [ultimoCodigoGenerado, setUltimoCodigoGenerado] = useState<{ paseId: string; codigo: string } | null>(null);

  const pasesApi = pasesQuery.data ?? [];
  const pases: PaseRapido[] = useMemo(
    () =>
      pasesApi.map((p) =>
        mapPaseAViewModel(p, vehiculo, ultimoCodigoGenerado?.paseId === p.id ? ultimoCodigoGenerado.codigo : undefined)
      ),
    [pasesApi, vehiculo, ultimoCodigoGenerado]
  );

  useEffect(() => {
    if ((location.state as { openGenerarPase?: boolean } | null)?.openGenerarPase && vehiculo) {
      setDrawerOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, vehiculo]);

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    const axiosErr = err as AxiosError<{ message?: string | string[] }>;
    const message = axiosErr.response?.data?.message;
    return (Array.isArray(message) ? message[0] : message) || fallback;
  };

  const handleConfirmed = async (data: GenerarPaseData): Promise<GenerarPaseResult> => {
    const vigenciaInicio = new Date();
    const vigenciaFin = addHours(vigenciaInicio, data.duracionHoras);

    const result = await generarPaseMutation.mutateAsync({
      vehiculoId: data.vehiculoId,
      placa: data.placa,
      nombreVisitante: data.nombre,
      cedulaVisitante: data.cedula,
      vigenciaInicio: vigenciaInicio.toISOString(),
      vigenciaFin: vigenciaFin.toISOString(),
      motivo: data.motivo,
    });

    setUltimoCodigoGenerado({ paseId: result.pase.id, codigo: result.codigoPlano });
    return result;
  };

  const handleCopy = (codigo: string) => {
    navigator.clipboard?.writeText(codigo);
    setSnackbarMessage('Código copiado');
    setSnackbarOpen(true);
  };

  const handleRevoke = async (id: string, _motivoRevocacion: string) => {
    try {
      await revocarPaseMutation.mutateAsync(id);
      setRevokeTarget(null);
      setSnackbarMessage('Pase revocado');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(extractErrorMessage(err, 'No se pudo revocar el pase.'));
      setSnackbarOpen(true);
    }
  };

  if (isLoadingVehiculo) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Pases de acceso rápido">
        <LoadingSkeleton variant="cards" rows={3} />
      </DashboardTemplate>
    );
  }

  if (!vehiculo) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Pases de acceso rápido">
        <Box sx={{ textAlign: 'center', py: 8, px: 3, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <BoltOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.primary, mb: 2 }} />
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', mb: 1 }}>
            Necesitas al menos un vehículo registrado
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary, mb: 3 }}>
            Registra tu primer vehículo para poder generar pases de acceso rápido.
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
    <DashboardTemplate rol="OWNER" pageTitle="Pases de acceso rápido">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem' }, color: '#0F172A' }}>
                Pases de acceso rápido
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#64748B', mt: 0.5 }}>
                Genera códigos temporales para acceso puntual sin biometría
              </Typography>
            </Box>
            <Button
              onClick={() => setDrawerOpen(true)}
              fullWidth={isMobile}
              startIcon={<BoltOutlinedIcon />}
              sx={{
                background: 'linear-gradient(135deg, #19D6C4, #0D5CCF)',
                color: '#FFFFFF',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '12px',
                height: 48,
                px: 3,
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(13, 92, 207, 0.3)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #19D6C4, #0D5CCF)',
                  boxShadow: '0 8px 22px rgba(13, 92, 207, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Generar pase
            </Button>
          </Box>
        </motion.div>

        {pasesQuery.isLoading ? (
          <LoadingSkeleton variant="cards" rows={3} />
        ) : pasesQuery.isError ? (
          <ErrorState mensaje="No se pudieron cargar los pases de acceso rápido." onRetry={() => pasesQuery.refetch()} />
        ) : (
          <PasesGrid
            pases={pases}
            onCopy={handleCopy}
            onRevoke={(id) => setRevokeTarget(pases.find((p) => p.id === id) || null)}
            onViewDetail={(id) => setDetailTarget(pases.find((p) => p.id === id) || null)}
            onGenerateClick={() => setDrawerOpen(true)}
          />
        )}
      </Box>

      <GenerarPaseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} vehiculo={vehiculo} onConfirmed={handleConfirmed} />
      <RevokePaseModal pase={revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke} />

      <Dialog open={!!detailTarget} onClose={() => setDetailTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: '#0F172A' }}>
          Detalle del pase
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
                ['Motivo', detailTarget.motivo],
                ...(detailTarget.usadoEn ? [['Usado en', `${detailTarget.usadoEn} · ${detailTarget.puntoAcceso || '—'}`]] : []),
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

export { PasesRapidosPage };
export default PasesRapidosPage;
