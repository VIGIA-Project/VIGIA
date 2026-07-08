// src/components/organisms/onboarding/OnboardingProgressPanel.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInLeft, staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { ONBOARDING_PROGRESS_LIST, ONBOARDING_WHY_MANDATORY, getOnboardingIcon } from '../../../config/onboarding.config';

export interface OnboardingProgressPanelProps {
  currentStep: 1 | 2 | 3;
  /** Progreso dentro del paso actual (0 a 1) — ej. capturas/3 en biometría, campos válidos/5 en vehículo */
  internalProgress?: number;
  /** Texto bajo la barra, ej. "2 de 3 capturas" o "5 de 5 campos — ¡Listo para registrar!" */
  progressLabel?: string;
  /** Card "¿Por qué es obligatorio?" — varía el copy según el paso activo */
  whyMandatory?: { title: string; bullets: readonly string[] };
}

const TOTAL_STEPS = 3;
const PROGRESS_COMPLETE_COLOR = '#22C55E';

export const OnboardingProgressPanel: React.FC<OnboardingProgressPanelProps> = ({
  currentStep,
  internalProgress = 0,
  progressLabel,
  whyMandatory = ONBOARDING_WHY_MANDATORY,
}) => {
  // La barra refleja SOLO el avance dentro del paso activo — se reinicia en 0% al cambiar de paso
  const clampedProgress = Math.min(1, Math.max(0, internalProgress));
  const progressPct = Math.round(clampedProgress * 100);
  const isInternalComplete = clampedProgress >= 1;
  const barColor = isInternalComplete ? PROGRESS_COMPLETE_COLOR : vigiaColors.gradientIA;
  const progressText = progressLabel ?? `Paso ${currentStep} de ${TOTAL_STEPS}`;

  return (
    <motion.div variants={fadeInLeft} initial="hidden" animate="visible">
      <Box
        sx={{
          width: { xs: '100%', md: 320 },
          flexShrink: 0,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Card: Tu progreso */}
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2.5, boxShadow: vigiaShadows.sm }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ color: vigiaColors.greenIA, display: 'flex' }}>{getOnboardingIcon('sparkles', { fontSize: 20 })}</Box>
            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: vigiaColors.textHeading }}>
              Tu progreso
            </Typography>
          </Box>
          <Box sx={{ height: 8, borderRadius: vigiaRadius.full, backgroundColor: 'rgba(10,47,134,0.08)', overflow: 'hidden', mb: 1 }}>
            <Box
              component={motion.div as React.ElementType}
              animate={{ width: `${progressPct}%`, background: barColor }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              sx={{ height: '100%' }}
            />
          </Box>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textSecondary }}>
            {progressText}
          </Typography>
        </Box>

        {/* Lista vertical de pasos */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {ONBOARDING_PROGRESS_LIST.map((step, i) => {
              const stepNumber = i + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep || (stepNumber === currentStep && isInternalComplete);
              const badgeText = isCompleted ? 'Completado' : isActive ? 'En curso' : 'Pendiente';
              const badgeBg = isCompleted
                ? PROGRESS_COMPLETE_COLOR
                : isActive ? 'rgba(13,92,207,0.1)' : 'rgba(107,114,128,0.1)';
              const badgeColor = isCompleted ? vigiaColors.white : isActive ? vigiaColors.primary : vigiaColors.textTertiary;

              return (
                <motion.div key={step.title} variants={staggerItem}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: vigiaRadius.md,
                      border: `1px solid ${isActive ? vigiaColors.primary : '#E2E8F0'}`,
                      backgroundColor: isActive ? 'rgba(13,92,207,0.03)' : 'transparent',
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: vigiaRadius.sm,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isCompleted
                          ? 'rgba(34,197,94,0.1)'
                          : isActive ? 'rgba(13,92,207,0.08)' : 'rgba(107,114,128,0.08)',
                        color: isCompleted ? PROGRESS_COMPLETE_COLOR : isActive ? vigiaColors.primary : vigiaColors.textTertiary,
                        flexShrink: 0,
                        transition: 'background-color 0.4s ease, color 0.4s ease',
                      }}
                    >
                      {getOnboardingIcon(step.icon, { fontSize: 18 })}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', color: vigiaColors.textBody }}>
                        {step.title}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.7rem', color: vigiaColors.textSecondary }}>
                        {step.subtitle}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: vigiaRadius.full,
                        backgroundColor: badgeBg,
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: badgeColor,
                        flexShrink: 0,
                      }}
                    >
                      {badgeText}
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>

        {/* Card informativa: por qué es obligatorio */}
        <Box
          sx={{
            borderRadius: vigiaRadius.lg,
            p: 2.5,
            background: vigiaColors.gradientRoleCard,
            color: vigiaColors.white,
          }}
        >
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.9rem', mb: 1.5 }}>
            {whyMandatory.title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {whyMandatory.bullets.map((bullet) => (
              <Box key={bullet} sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', color: vigiaColors.greenIA, lineHeight: 1.6 }}>•</Typography>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {bullet}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default OnboardingProgressPanel;
