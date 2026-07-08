// src/components/organisms/landing/ConfianzaCtaSection.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaShadows, vigiaRadius } from '../../../theme/vigia-theme';
import { AUTH_ROUTES } from '../../../config/auth.config';
import { LANDING_CONFIANZA, getLandingIcon } from '../../../config/landing.config';

export const ConfianzaCtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      aria-labelledby="confianza-title"
      sx={{
        px: { xs: 3, md: 6 },
        py: { xs: 6, md: 10 },
        textAlign: 'center',
        background: vigiaColors.gradientRoleCard,
      }}
    >
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
        <Typography
          component="h2"
          id="confianza-title"
          sx={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: { xs: '1.5rem', md: '1.9rem' },
            color: vigiaColors.white,
            mb: 4,
          }}
        >
          {LANDING_CONFIANZA.title}
        </Typography>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 5 }}>
            {LANDING_CONFIANZA.badges.map((badge) => (
              <motion.div key={badge.icon} variants={staggerItem}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: vigiaRadius.full,
                    px: 2.5,
                    py: 1,
                  }}
                >
                  <Box sx={{ color: vigiaColors.greenIA, display: 'flex' }}>{getLandingIcon(badge.icon, { fontSize: 18 })}</Box>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      color: vigiaColors.white,
                    }}
                  >
                    {badge.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        <Button
          variant="contained"
          onClick={() => navigate(AUTH_ROUTES.login)}
          sx={{
            background: vigiaColors.gradientIA,
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: vigiaRadius.md,
            px: 4,
            minHeight: 48,
            boxShadow: vigiaShadows.lg,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { boxShadow: vigiaShadows.glow.ia, transform: 'translateY(-2px)' },
            '&:focus-visible': { outline: `2px solid ${vigiaColors.greenIA}`, outlineOffset: '2px' },
          }}
        >
          {LANDING_CONFIANZA.cta}
        </Button>
      </motion.div>
    </Box>
  );
};

export default ConfianzaCtaSection;
