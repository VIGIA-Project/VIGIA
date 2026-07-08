// src/pages/propietario/onboarding/VehicleOnboardingPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDashboardByRole } from '../../../config/auth.config';
import { useAuth } from '../../../context/AuthContext';
import { vigiaColors } from '../../../theme/vigia-theme';
import { UserAvatar } from '../../../components/molecules';
import { OnboardingStepper, OnboardingProgressPanel, VehicleRegistrationForm } from '../../../components/organisms/onboarding';
import { ONBOARDING_HEADER, VEHICLE_MAIN_COPY, VEHICLE_WHY_MANDATORY } from '../../../config/onboarding.config';

const VehicleOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeVehicleOnboarding } = useAuth();

  const initials = (user?.email || 'U').split('@')[0].slice(0, 2).toUpperCase();

  const handleComplete = () => {
    completeVehicleOnboarding();
    navigate(getDashboardByRole(user?.rol || 'PROPIETARIO'));
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
      <OnboardingStepper currentStep={2} />

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
          <OnboardingProgressPanel currentStep={2} whyMandatory={VEHICLE_WHY_MANDATORY} />
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
            {VEHICLE_MAIN_COPY.eyebrow}
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
            {VEHICLE_MAIN_COPY.title}
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
            {VEHICLE_MAIN_COPY.description}
          </Typography>

          <VehicleRegistrationForm onComplete={handleComplete} />
        </Box>
      </Box>
    </Box>
  );
};

export default VehicleOnboardingPage;
