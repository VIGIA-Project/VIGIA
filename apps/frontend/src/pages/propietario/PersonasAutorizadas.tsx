import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { PersonasGrid, AddPersonaDrawer, RevokePersonaModal } from '../../components/organisms/propietario';
import { ErrorState, LoadingSkeleton, PerfilIncompletoState } from '../../components/atoms';
import { fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';
import { usePropietarioVehiculo, useCrearPersona, usePersonasDelPropietario as usePersonasResolver } from '../../hooks/useRegistry';
import { useMiembrosGrupoFamiliar, useCrearMiembroGrupoFamiliar, useRevocarMiembroGrupoFamiliar } from '../../hooks/useAuthorization';
import { useAuth } from '../../context';
import {
  PersonaAutorizada,
  FAMILIA_MAX_MIEMBROS,
  PERSONAS_HEADER_COPY,
  ADD_PERSONA_DRAWER_COPY,
  REVOKE_PERSONA_MODAL_COPY,
  mapAutorizacionAPersona,
} from '../../config/propietario-personas.config';

const PersonasAutorizadasPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { vehiculo, isLoading: isLoadingVehiculo, isError: isErrorVehiculo, refetch: refetchVehiculo, perfilIncompleto } = usePropietarioVehiculo();
  const tieneVehiculos = !!vehiculo;

  const autorizacionesQuery = useMiembrosGrupoFamiliar(user?.personaId);
  const crearPersonaMutation = useCrearPersona();
  const crearAutorizacionMutation = useCrearMiembroGrupoFamiliar();
  const revocarAutorizacionMutation = useRevocarMiembroGrupoFamiliar(user?.personaId);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<PersonaAutorizada | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const autorizaciones = autorizacionesQuery.data ?? [];
  const personaIds = useMemo(() => autorizaciones.map((a) => a.personaId), [autorizaciones]);
  const { personasById, isLoading: isLoadingPersonas } = usePersonasResolver(personaIds);

  // Adaptación de contratos forzando el tipado nativo para el compilador de producción
  const personas: PersonaAutorizada[] = useMemo(
      () => autorizaciones.map((a) => mapAutorizacionAPersona(a, personasById.get(a.personaId))) as PersonaAutorizada[],
      [autorizaciones, personasById]
  );

  useEffect(() => {
    if ((location.state as { openDrawer?: boolean } | null)?.openDrawer && tieneVehiculos) {
      setDrawerOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, tieneVehiculos, navigate, location.pathname]);

  const activas = personas.filter((p) => p.estado === 'ACTIVA').length;
  const limitReached = activas >= FAMILIA_MAX_MIEMBROS;

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    const axiosErr = err as AxiosError<{ message?: string | string[] }>;
    const message = axiosErr.response?.data?.message;
    return (Array.isArray(message) ? message[0] : message) || fallback;
  };

  const handleConfirmed = async (
      nueva: Omit<PersonaAutorizada, 'id' | 'personaId' | 'estado' | 'autorizadoDesde'>,
      biometriaPresencial: boolean
  ) => {
    if (!vehiculo) return;
    const [nombres, ...resto] = nueva.nombre.trim().split(/\s+/);
    const apellidos = resto.join(' ') || nombres;

    try {
      const persona = await crearPersonaMutation.mutateAsync({
        identificacionTipo: 'CEDULA',
        identificacionNumero: nueva.cedula,
        nombres,
        apellidos,
        telefonoContacto: nueva.telefono,
      });

      const autorizacion = await crearAutorizacionMutation.mutateAsync({
        personaId: persona.personaId,
        relacion: nueva.relacion,
      });

      setDrawerOpen(false);

      if (biometriaPresencial) {
        setToastMessage(ADD_PERSONA_DRAWER_COPY.successToastPresencial);
        setTimeout(() => navigate(`/propietario/personas/${autorizacion.id}/biometria`), 1200);
      } else {
        setToastMessage(ADD_PERSONA_DRAWER_COPY.successToastPendiente);
      }
    } catch (err) {
      setToastMessage(extractErrorMessage(err, 'No se pudo autorizar a la persona. Intente nuevamente.'));
    }
  };

  const handleRevoke = async (id: string, _motivo: string) => {
    try {
      await revocarAutorizacionMutation.mutateAsync(id);
      setRevokeTarget(null);
      setToastMessage(REVOKE_PERSONA_MODAL_COPY.successToast);
    } catch (err) {
      setToastMessage(extractErrorMessage(err, 'No se pudo revocar la autorización.'));
    }
  };

  if (isLoadingVehiculo) {
    return (
        <DashboardTemplate rol="OWNER" pageTitle="Personas autorizadas">
          <LoadingSkeleton variant="cards" rows={3} />
        </DashboardTemplate>
    );
  }

  if (isErrorVehiculo) {
    return (
        <DashboardTemplate rol="OWNER" pageTitle="Personas autorizadas">
          <ErrorState mensaje="No se pudo cargar tu información de vehículo." onRetry={() => refetchVehiculo()} />
        </DashboardTemplate>
    );
  }

  if (perfilIncompleto) {
    return (
        <DashboardTemplate rol="OWNER" pageTitle="Personas autorizadas">
          <PerfilIncompletoState />
        </DashboardTemplate>
    );
  }

  if (!tieneVehiculos) {
    return (
        <DashboardTemplate rol="OWNER" pageTitle="Personas autorizadas">
          <Box sx={{ textAlign: 'center', py: 8, px: 3, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
            <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.primary, mb: 2 }} />
            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', mb: 1 }}>
              {PERSONAS_HEADER_COPY.requiresVehicleTitle}
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary, mb: 3 }}>
              {PERSONAS_HEADER_COPY.requiresVehicleDescription}
            </Typography>
            <Button
                variant="contained"
                onClick={() => navigate('/propietario/vehiculos')}
                sx={{ background: vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, px: 3, minHeight: 44 }}
            >
              {PERSONAS_HEADER_COPY.requiresVehicleCta}
            </Button>
          </Box>
        </DashboardTemplate>
    );
  }

  return (
      <DashboardTemplate rol="OWNER" pageTitle="Personas autorizadas">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
          {/* Header de sección */}
          <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
              <Box>
                <Box component="h1" sx={{ m: 0, fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' }, color: '#0F172A' }}>
                  {PERSONAS_HEADER_COPY.title}
                </Box>
                <Box sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', mt: 0.5 }}>
                  {PERSONAS_HEADER_COPY.subtitle(activas)}
                </Box>
              </Box>
              <Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAddAlt1Icon />}
                    onClick={() => setDrawerOpen(true)}
                    disabled={limitReached}
                    fullWidth={isMobile}
                    sx={{
                      background: limitReached ? 'rgba(13,92,207,0.3)' : vigiaColors.gradientIA,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'none',
                      borderRadius: vigiaRadius.sm,
                      px: 3,
                      minHeight: 48,
                      boxShadow: limitReached ? 'none' : vigiaShadows.sm,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { boxShadow: limitReached ? 'none' : vigiaShadows.md, transform: shouldReduceMotion || limitReached ? 'none' : 'translateY(-1px)' },
                    }}
                >
                  {PERSONAS_HEADER_COPY.addCta}
                </Button>
                {limitReached && (
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', color: vigiaColors.textTertiary, mt: 0.5, maxWidth: 220, textAlign: { xs: 'left', sm: 'right' } }}>
                      {PERSONAS_HEADER_COPY.limitHelper}
                    </Typography>
                )}
              </Box>
            </Box>
          </motion.div>

          {autorizacionesQuery.isLoading || isLoadingPersonas ? (
              <LoadingSkeleton variant="cards" rows={3} />
          ) : autorizacionesQuery.isError ? (
              <ErrorState mensaje="No se pudieron cargar las personas autorizadas." onRetry={() => autorizacionesQuery.refetch()} />
          ) : (
              <PersonasGrid
                  personas={personas}
                  onAdd={() => setDrawerOpen(true)}
                  onViewDetail={(id) => navigate(`/propietario/personas/${id}`)}
                  onRegisterBio={(id) => navigate(`/propietario/personas/${id}/biometria`)}
                  onRevoke={(persona) => setRevokeTarget(persona)}
              />
          )}
        </Box>

        <AddPersonaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onConfirmed={handleConfirmed} cuposUsados={activas} />
        <RevokePersonaModal persona={revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke} />

        <Snackbar open={!!toastMessage} autoHideDuration={4000} onClose={() => setToastMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={toastMessage?.includes('No se pudo') ? 'error' : 'success'} variant="filled" onClose={() => setToastMessage(null)} sx={{ borderRadius: vigiaRadius.sm }}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </DashboardTemplate>
  );
};

export { PersonasAutorizadasPage };
export default PersonasAutorizadasPage;