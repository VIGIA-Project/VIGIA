// src/pages/propietario/BiometricCapturePersonaPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { BiometricCapture } from '../../components/organisms/onboarding';
import { LoadingSkeleton } from '../../components/atoms';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { usePersona, useMarcarEnrollmentCompleto } from '../../hooks/useRegistry';
import { useMiembrosGrupoFamiliar } from '../../hooks/useAuthorization';
import { useAuth } from '../../context';
import { PERSONA_BIOMETRIC_CAPTURE_COPY as COPY } from '../../config/propietario-personas.config';

const BiometricCapturePersonaPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();
  const autorizacionesQuery = useMiembrosGrupoFamiliar(user?.personaId);
  const autorizacion = autorizacionesQuery.data?.find((a) => a.id === id);
  const personaQuery = usePersona(autorizacion?.personaId);
  const marcarEnrollmentMutation = useMarcarEnrollmentCompleto();

  const isLoading = autorizacionesQuery.isLoading || personaQuery.isLoading;
  const persona = personaQuery.data;

  const backToPersonas = () => navigate('/propietario/personas');

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAllCaptured = async (files: File[]) => {
    if (!autorizacion) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      files.forEach(f => formData.append('archivos', f));
      
      const { enrolarPerfilBiometrico } = await import('../../services/admin.service');
      await enrolarPerfilBiometrico(autorizacion.personaId, formData);

      await marcarEnrollmentMutation.mutateAsync(autorizacion.personaId);
      navigate(`/propietario/personas/${autorizacion.id}`);
    } catch (err) {
      console.error('No se pudo marcar el enrollment biométrico:', err);
      alert('Ocurrió un problema al guardar los datos biométricos. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Captura biométrica">
        <LoadingSkeleton variant="detail" />
      </DashboardTemplate>
    );
  }

  if (!autorizacion || !persona) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Captura biométrica">
        <Box
          component="button"
          onClick={backToPersonas}
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

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Captura biométrica">
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>
        <Box
          component="button"
          onClick={backToPersonas}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', mb: 3, '&:hover': { textDecoration: 'underline' } }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          {COPY.backLabel}
        </Box>

        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: vigiaColors.textTertiary,
              mb: 1,
            }}
          >
            {COPY.eyebrow}
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: vigiaColors.textHeading,
              mb: 1.5,
            }}
          >
            {COPY.headerTitle(persona.nombreCompleto)}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.9rem',
              color: vigiaColors.textSecondary,
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            {COPY.description}
          </Typography>

          <BiometricCapture
            onAllCaptured={handleAllCaptured}
            onSkipForNow={backToPersonas}
            successCopy={{ title: COPY.successTitle, subtitle: COPY.successSubtitle, cta: COPY.successCta }}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </Box>
    </DashboardTemplate>
  );
};

export { BiometricCapturePersonaPage };
export default BiometricCapturePersonaPage;
