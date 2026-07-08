// src/pages/propietario/onboarding/BiometricOnboardingPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp } from '../../../config/animations.config';
import { vigiaColors } from '../../../theme/vigia-theme';
import { AUTH_ROUTES } from '../../../config/auth.config';
import { useAuth } from '../../../context/AuthContext';
import { UserAvatar } from '../../../components/molecules';
import { OnboardingStepper, OnboardingProgressPanel, BiometricCapture } from '../../../components/organisms/onboarding';
import {
  ONBOARDING_HEADER,
  BIOMETRIC_MAIN_COPY,
  LOGIN_NOTICE_INCOMPLETE_BIOMETRIA,
  getBiometricProgressLabel,
} from '../../../config/onboarding.config';

const BiometricOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { user, logout, completeBiometricOnboarding, setAuthNotice } = useAuth();

  const [capturesDone, setCapturesDone] = React.useState(0);

  const initials = (user?.email || 'U').split('@')[0].slice(0, 2).toUpperCase();

  const handleAllCaptured = () => {
    completeBiometricOnboarding();
    navigate(AUTH_ROUTES.onboardingVehiculo);
  };

  const handleSkipForNow = () => {
    logout();
    setAuthNotice(LOGIN_NOTICE_INCOMPLETE_BIOMETRIA);
    navigate(AUTH_ROUTES.login);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: vigiaColors.bgPage }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 3, md: 6 },
          py: 2,
          backgroundColor: vigiaColors.bgCard,
          borderBottom: '1px solid rgba(10,47,134,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src="/assets/vigia-logo.png" alt="VIGIA" sx={{ height: 32, objectFit: 'contain' }} />
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: vigiaColors.textHeading }}>
            {ONBOARDING_HEADER.title}
          </Typography>
        </Box>
        <UserAvatar initials={initials} />
      </Box>

      {/* Stepper */}
      <OnboardingStepper currentStep={1} />

      {/* Layout: sidebar progreso + área principal */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          maxWidth: 1280,
          mx: 'auto',
        }}
      >
        <Box sx={{ order: { xs: 2, md: 1 }, width: { xs: '100%', md: 'auto' } }}>
          <OnboardingProgressPanel
            currentStep={1}
            internalProgress={capturesDone / 3}
            progressLabel={getBiometricProgressLabel(capturesDone)}
          />
        </Box>

        <Box
          component="main"
          sx={{
            order: { xs: 1, md: 2 },
            flex: 1,
            minWidth: 0,
            p: { xs: 3, md: 4 },
          }}
        >
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
              {BIOMETRIC_MAIN_COPY.eyebrow}
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
              {BIOMETRIC_MAIN_COPY.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.9rem',
                color: vigiaColors.textSecondary,
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 640,
              }}
            >
              {BIOMETRIC_MAIN_COPY.description}
            </Typography>

            <BiometricCapture
              onAllCaptured={handleAllCaptured}
              onSkipForNow={handleSkipForNow}
              onCaptureProgress={(done) => setCapturesDone(done)}
            />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default BiometricOnboardingPage;
