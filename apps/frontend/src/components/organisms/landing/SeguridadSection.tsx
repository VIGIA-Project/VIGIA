// src/components/organisms/landing/SeguridadSection.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaShadows, vigiaRadius } from '../../../theme/vigia-theme';
import { LANDING_SEGURIDAD, getLandingIcon } from '../../../config/landing.config';
import { LandingSectionHeading } from '../../molecules/LandingSectionHeading';

export const SeguridadSection: React.FC = () => (
  <Box
    id="seguridad"
    component="section"
    aria-labelledby="seguridad-title"
    sx={{
      position: 'relative',
      px: { xs: 3, md: 6 },
      py: { xs: 5, md: 10 },
      background: 'linear-gradient(180deg, #EAF3FF 0%, #F8FAFC 100%)',
    }}
  >
    <LandingSectionHeading eyebrow={LANDING_SEGURIDAD.eyebrow} title={LANDING_SEGURIDAD.title} />

    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
          gap: 2.5,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {LANDING_SEGURIDAD.cards.map((card) => (
          <motion.div key={card.title} variants={staggerItem}>
            <Box
              sx={{
                height: '100%',
                p: 3,
                borderRadius: vigiaRadius.lg,
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: vigiaShadows.sm,
                transition: 'all 0.2s ease',
                '&:hover': { boxShadow: vigiaShadows.md, transform: 'translateY(-2px)' },
              }}
            >
              <Box sx={{ color: vigiaColors.primary, mb: 1.5 }}>{getLandingIcon(card.icon, { fontSize: 26 })}</Box>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: vigiaColors.textHeading,
                  mb: 1,
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.85rem',
                  color: vigiaColors.textSecondary,
                  lineHeight: 1.6,
                }}
              >
                {card.description}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  </Box>
);

export default SeguridadSection;
