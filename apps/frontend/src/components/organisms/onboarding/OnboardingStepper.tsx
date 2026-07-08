// src/components/organisms/onboarding/OnboardingStepper.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import { fadeInDown } from '../../../config/animations.config';
import { vigiaColors } from '../../../theme/vigia-theme';
import { ONBOARDING_STEPPER_LABELS } from '../../../config/onboarding.config';

export interface OnboardingStepperProps {
  currentStep: 1 | 2 | 3;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ currentStep }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : fadeInDown}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: { xs: 1, md: 2 },
          px: { xs: 2, md: 6 },
          py: 3,
          backgroundColor: vigiaColors.bgCard,
          borderBottom: '1px solid rgba(10,47,134,0.06)',
        }}
      >
        {ONBOARDING_STEPPER_LABELS.map((label, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isLast = i === ONBOARDING_STEPPER_LABELS.length - 1;

          const circleBg = isCompleted ? vigiaColors.success : isActive ? vigiaColors.primary : 'transparent';
          const circleBorder = isCompleted ? vigiaColors.success : isActive ? vigiaColors.primary : '#CBD5E1';
          const circleColor = isCompleted || isActive ? vigiaColors.white : vigiaColors.textTertiary;

          const stepLabel = isCompleted ? 'COMPLETADO' : isActive ? `PASO ${stepNumber} DE 3` : 'PENDIENTE';

          return (
            <React.Fragment key={label}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: circleBg,
                    border: `2px solid ${circleBorder}`,
                    color: circleColor,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isCompleted ? <CheckIcon sx={{ fontSize: 18 }} /> : stepNumber}
                </Box>
                <Typography
                  sx={{
                    mt: 1,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: vigiaColors.textBody,
                    textAlign: 'center',
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.5px',
                    color: isActive ? vigiaColors.primary : vigiaColors.textTertiary,
                    fontWeight: 600,
                  }}
                >
                  {stepLabel}
                </Typography>
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    width: { xs: 24, md: 64 },
                    height: 2,
                    mt: 2,
                    backgroundColor: isCompleted ? vigiaColors.success : '#E2E8F0',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </motion.div>
  );
};

export default OnboardingStepper;
