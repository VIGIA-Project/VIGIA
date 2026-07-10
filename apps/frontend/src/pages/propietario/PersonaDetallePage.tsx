// src/pages/propietario/PersonaDetallePage.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { RevokePersonaModal } from '../../components/organisms/propietario';
import { ErrorState, LoadingSkeleton } from '../../components/atoms';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../theme/vigia-theme';
import { usePropietarioVehiculo, usePersona } from '../../hooks/useRegistry';
import { useAutorizacionesPorVehiculo, useRevocarAutorizacion } from '../../hooks/useAuthorization';
import {
  PersonaAutorizada,
  PERSONA_DETALLE_COPY as COPY,
  buildMockActividadPersona,
  mapAutorizacionAPersona,
} from '../../config/propietario-personas.config';

const maskCedula = (cedula: string) => cedula.replace(/X/g, '*');

const getIniciales = (nombre: string) => {
  const partes = nombre.trim().split(/\s+/);
  const first = partes[0]?.[0] ?? '';
  const last = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

const PersonaDetallePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const shouldReduceMotion = useReducedMotion();

  const { vehiculo, isLoading: isLoadingVehiculo } = usePropietarioVehiculo();
  const autorizacionesQuery = useAutorizacionesPorVehiculo(vehiculo?.vehiculoId);
  const revocarMutation = useRevocarAutorizacion(vehiculo?.vehiculoId);

  const autorizacion = autorizacionesQuery.data?.find((a) => a.id === id);
  const personaQuery = usePersona(autorizacion?.personaId);

  const [revokeTarget, setRevokeTarget] = useState<PersonaAutorizada | null>(null);

  const isLoading = isLoadingVehiculo || autorizacionesQuery.isLoading || personaQuery.isLoading;
  const isError = autorizacionesQuery.isError || personaQuery.isError;

  const persona: PersonaAutorizada | undefined = autorizacion
    ? mapAutorizacionAPersona(autorizacion, personaQuery.data)
    : undefined;

  const handleRevoke = async (revokeId: string) => {
    try {
      await revocarMutation.mutateAsync(revokeId);
      setRevokeTarget(null);
    } catch {
      // El modal permanece abierto; el usuario puede reintentar.
    }
  };

  if (isLoading) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Detalle de persona">
        <LoadingSkeleton variant="detail" />
      </DashboardTemplate>
    );
  }

  if (isError) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Detalle de persona">
        <ErrorState mensaje="No se pudo cargar la información de esta persona." onRetry={() => autorizacionesQuery.refetch()} />
      </DashboardTemplate>
    );
  }

  if (!persona) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Detalle de persona">
        <Box
          component="button"
          onClick={() => navigate('/propietario/personas')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', mb: 3, '&:hover': { textDecoration: 'underline' } }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          {COPY.backLabel}
        </Box>
        <Box sx={{ textAlign: 'center', py: 8, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <SearchOffOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.textTertiary, mb: 2 }} />
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', mb: 1 }}>
            {COPY.notFoundTitle}
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary }}>
            {COPY.notFoundDescription}
          </Typography>
        </Box>
      </DashboardTemplate>
    );
  }

  const isRevocada = persona.estado === 'REVOCADA';
  const bioCompleta = persona.biometria === 'COMPLETADA';
  const actividad = buildMockActividadPersona(persona);

  const estadoBadge = isRevocada
    ? { bg: '#FEE2E2', color: '#991B1B', label: COPY.estadoRevocada }
    : { bg: '#DCFCE7', color: '#166534', label: COPY.estadoActiva };

  const bioBadge = bioCompleta
    ? { bg: '#DCFCE7', color: '#166534', label: COPY.bioCompleta }
    : { bg: '#FEF3C7', color: '#92400E', label: COPY.bioPendiente };

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Detalle de persona">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          component="button"
          onClick={() => navigate('/propietario/personas')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', '&:hover': { textDecoration: 'underline' } }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          {COPY.backLabel}
        </Box>

        {/* Header */}
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3, backgroundColor: vigiaColors.bgCard }}>
            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0D5CCF, #19D6C4)',
                  color: vigiaColors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                }}
              >
                {getIniciales(persona.nombre)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
                  <Typography component="h1" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.4rem', md: '1.6rem' }, color: '#0F172A' }}>
                    {persona.nombre}
                  </Typography>
                  <Box sx={{ px: 1.1, py: 0.3, borderRadius: vigiaRadius.full, backgroundColor: '#EFF6FF', color: '#0D5CCF', fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', fontWeight: 700 }}>
                    {persona.relacion}
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#64748B', mt: 0.5 }}>
                  {maskCedula(persona.cedula)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1.25, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.35, borderRadius: vigiaRadius.full, backgroundColor: estadoBadge.bg, color: estadoBadge.color, fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', fontWeight: 700 }}>
                    {estadoBadge.label}
                  </Box>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.35, borderRadius: vigiaRadius.full, backgroundColor: bioBadge.bg, color: bioBadge.color, fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', fontWeight: 700 }}>
                    {bioCompleta ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />}
                    {bioBadge.label}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Información */}
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3, backgroundColor: vigiaColors.bgCard }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
            {COPY.sectionInfo}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {[
              { icon: <ShieldOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />, label: COPY.nombreLabel, value: persona.nombre },
              { icon: <FingerprintOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />, label: COPY.cedulaLabel, value: maskCedula(persona.cedula) },
              { icon: <ShieldOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />, label: COPY.relacionLabel, value: persona.relacion },
              { icon: <PhoneOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />, label: COPY.telefonoLabel, value: persona.telefono || COPY.telefonoVacio },
              { icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />, label: COPY.autorizadoDesdeLabel, value: persona.autorizadoDesde },
              { icon: <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />, label: COPY.alcanceLabel, value: COPY.alcanceValue },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <Box sx={{ mt: 0.25 }}>{item.icon}</Box>
                <Box>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>{item.label}</Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{item.value}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Estado biométrico */}
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3, backgroundColor: vigiaColors.bgCard }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
            {COPY.sectionBiometria}
          </Typography>

          {bioCompleta ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: vigiaRadius.md, backgroundColor: '#DCFCE7', border: '1px solid #86EFAC' }}>
              <CheckCircleIcon sx={{ fontSize: 22, color: '#16A34A' }} />
              <Box>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#166534' }}>
                  {COPY.bioCompletaHelper}
                </Typography>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#166534' }}>
                  {COPY.autorizadoDesdeLabel}: {persona.autorizadoDesde}
                </Typography>
              </Box>
            </Box>
          ) : (
            !isRevocada && (
              <Box sx={{ p: 2.25, borderRadius: vigiaRadius.md, backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 22, color: '#F59E0B', mt: 0.25 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#92400E' }}>
                      {COPY.bioPendienteTitle}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#92400E', mt: 0.25, mb: 1.5 }}>
                      {COPY.bioPendienteDescription}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/propietario/personas/${persona.id}/biometria`)}
                      startIcon={<FingerprintOutlinedIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        minHeight: 44,
                        backgroundColor: '#F59E0B',
                        color: '#1F2937',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        borderRadius: vigiaRadius.sm,
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#D97706', boxShadow: 'none' },
                      }}
                    >
                      {COPY.bioPendienteCta}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )
          )}
        </Box>

        {/* Actividad reciente — TODO: Replace with real data when Access Control BC is implemented */}
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3, backgroundColor: vigiaColors.bgCard }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
            {COPY.sectionActividad}
          </Typography>
          {actividad.length === 0 ? (
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: '#64748B' }}>
              {COPY.actividadEmpty}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {actividad.map((evento) => (
                <Box key={evento.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, pb: 1.5, borderBottom: '1px solid #F1F5F9', '&:last-of-type': { borderBottom: 'none', pb: 0 } }}>
                  <HistoryOutlinedIcon sx={{ fontSize: 18, color: '#94A3B8', mt: 0.25 }} />
                  <Box>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>{evento.title}</Typography>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B' }}>{evento.subtitle}</Typography>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#94A3B8', mt: 0.25 }}>{evento.timestamp}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Acciones */}
        {!isRevocada && (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {!bioCompleta && (
              <Button
                variant="contained"
                onClick={() => navigate(`/propietario/personas/${persona.id}/biometria`)}
                startIcon={<FingerprintOutlinedIcon />}
                sx={{
                  minHeight: 44,
                  backgroundColor: '#F59E0B',
                  color: '#1F2937',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: vigiaRadius.sm,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#D97706', boxShadow: 'none' },
                }}
              >
                {COPY.registerBioCta}
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => setRevokeTarget(persona)}
              sx={{ minHeight: 44, borderColor: '#DC2626', color: '#DC2626', fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, '&:hover': { borderColor: '#B91C1C', backgroundColor: 'rgba(220,38,38,0.06)' } }}
            >
              {COPY.revokeCta}
            </Button>
          </Box>
        )}
      </Box>

      <RevokePersonaModal persona={revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke} />
    </DashboardTemplate>
  );
};

export { PersonaDetallePage };
export default PersonaDetallePage;
