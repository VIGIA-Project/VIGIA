// src/components/organisms/landing/RolesSection.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaShadows, vigiaRadius } from '../../../theme/vigia-theme';
import { LANDING_ROLES, getLandingIcon } from '../../../config/landing.config';
import { LandingSectionHeading } from '../../molecules/LandingSectionHeading';

export const RolesSection: React.FC = () => (
  <Box
    id="roles"
    component="section"
    aria-labelledby="roles-title"
    sx={{ px: { xs: 3, md: 6 }, py: { xs: 5, md: 10 }, backgroundColor: vigiaColors.bgPage }}
  >
    <LandingSectionHeading eyebrow={LANDING_ROLES.eyebrow} title={LANDING_ROLES.title} />

    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          maxWidth: 1100,
          mx: 'auto',
        }}
      >
        {LANDING_ROLES.cards.map((card) => (
          <motion.div key={card.title} variants={staggerItem}>
            <Box
              sx={{
                height: '100%',
                p: 3.5,
                borderRadius: vigiaRadius.lg,
                background: vigiaColors.gradientRoleCard,
                boxShadow: vigiaShadows.md,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: vigiaShadows.lg },
              }}
            >
              <Box sx={{ color: vigiaColors.greenIA, mb: 2 }}>{getLandingIcon(card.icon)}</Box>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.15rem',
                  color: vigiaColors.white,
                  mb: 1,
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.85)',
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

export default RolesSection;
