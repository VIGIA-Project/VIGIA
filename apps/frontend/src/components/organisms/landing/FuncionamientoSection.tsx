// src/components/organisms/landing/FuncionamientoSection.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaShadows, vigiaRadius } from '../../../theme/vigia-theme';
import { LANDING_FUNCIONAMIENTO } from '../../../config/landing.config';
import { LandingSectionHeading } from '../../molecules/LandingSectionHeading';

export const FuncionamientoSection: React.FC = () => (
  <Box
    id="funcionamiento"
    component="section"
    aria-labelledby="funcionamiento-title"
    sx={{ px: { xs: 3, md: 6 }, py: { xs: 5, md: 10 } }}
  >
    <LandingSectionHeading eyebrow={LANDING_FUNCIONAMIENTO.eyebrow} title={LANDING_FUNCIONAMIENTO.title} />

    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          maxWidth: 1100,
          mx: 'auto',
        }}
      >
        {LANDING_FUNCIONAMIENTO.steps.map((step) => (
          <motion.div key={step.number} variants={staggerItem}>
            <Box
              sx={{
                height: '100%',
                p: 3,
                borderRadius: vigiaRadius.lg,
                backgroundColor: vigiaColors.bgCard,
                boxShadow: vigiaShadows.sm,
                transition: 'all 0.2s ease',
                '&:hover': { boxShadow: vigiaShadows.md, transform: 'translateY(-2px)' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.75rem',
                  color: vigiaColors.greenIA,
                  mb: 1,
                }}
              >
                {step.number}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: vigiaColors.textHeading,
                  mb: 1,
                }}
              >
                {step.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.9rem',
                  color: vigiaColors.textSecondary,
                  lineHeight: 1.6,
                }}
              >
                {step.description}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  </Box>
);

export default FuncionamientoSection;
