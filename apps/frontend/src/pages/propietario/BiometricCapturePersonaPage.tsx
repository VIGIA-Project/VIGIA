// src/pages/propietario/BiometricCapturePersonaPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { BiometricCapture } from '../../components/organisms/onboarding';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import {
  loadPersonas,
  savePersonas,
  PERSONA_BIOMETRIC_CAPTURE_COPY as COPY,
} from '../../config/propietario-personas.config';

const BiometricCapturePersonaPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { id } = useParams<{ id: string }>();

  const personas = loadPersonas();
  const persona = personas.find((p) => p.id === id);

  const backToPersonas = () => navigate('/propietario/personas');

  const handleAllCaptured = () => {
    if (!persona) return;
    const next = personas.map((p) => (p.id === persona.id ? { ...p, biometria: 'COMPLETADA' as const } : p));
    savePersonas(next);
    navigate(`/propietario/personas/${persona.id}`);
  };

  if (!persona) {
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
            {COPY.headerTitle(persona.nombre)}
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
          />
        </motion.div>
      </Box>
    </DashboardTemplate>
  );
};

export { BiometricCapturePersonaPage };
export default BiometricCapturePersonaPage;
