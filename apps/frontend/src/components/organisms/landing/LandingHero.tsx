// src/components/organisms/landing/LandingHero.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fadeInUp, pulseGlow } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { AUTH_ROUTES } from '../../../config/auth.config';
import { LANDING_HERO } from '../../../config/landing.config';
import logoFull from '../../../assets/logo/vigia-full.png';

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box
      component="section"
      aria-labelledby="hero-title"
      sx={{
        position: 'relative',
        minHeight: { xs: '100svh', md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        background: vigiaColors.gradientHero,
        px: { xs: 3, md: 6 },
        pt: { xs: 12, md: 10 },
        pb: { xs: 8, md: 6 },
      }}
    >
      {/* Watermark decorativo — logo VIGIA completo, opacity 0.04-0.06 */}
      <Box
        component="img"
        src={logoFull}
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '160%', md: '85%' },
          maxWidth: 1100,
          opacity: 0.05,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      />

      <motion.div variants={fadeInUp} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge "Sistema activo" */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: vigiaRadius.full,
            px: 2,
            py: 0.75,
            mb: 3,
          }}
        >
          <motion.span
            variants={shouldReduceMotion ? undefined : pulseGlow}
            animate={shouldReduceMotion ? undefined : 'animate'}
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: vigiaColors.greenIA,
            }}
          />
          <Typography
            component="span"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: '0.8rem',
              color: vigiaColors.white,
            }}
          >
            {LANDING_HERO.badge}
          </Typography>
        </Box>

        {/* H1 */}
        <Typography
          component="h1"
          id="hero-title"
          sx={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.9rem', sm: '2.2rem', md: '3rem' },
            color: vigiaColors.white,
            lineHeight: 1.15,
            mb: 3,
            maxWidth: 760,
            mx: 'auto',
          }}
        >
          {LANDING_HERO.titlePrefix}
          <Box component="span" sx={{ color: vigiaColors.greenIA }}>
            {LANDING_HERO.titleHighlight}
          </Box>
        </Typography>

        {/* Subtítulo */}
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.6,
            maxWidth: 620,
            mx: 'auto',
            mb: 5,
          }}
        >
          {LANDING_HERO.subtitle}
        </Typography>

        {/* CTAs */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              '&:hover': {
                boxShadow: vigiaShadows.glow.ia,
                transform: shouldReduceMotion ? 'none' : 'translateY(-2px)',
              },
              '&:focus-visible': {
                outline: `2px solid ${vigiaColors.greenIA}`,
                outlineOffset: '2px',
              },
            }}
          >
            {LANDING_HERO.ctaPrimary}
          </Button>
          <Button
            variant="outlined"
            onClick={() => document.getElementById('problema')?.scrollIntoView({ behavior: 'smooth' })}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              color: vigiaColors.white,
              borderColor: 'rgba(255,255,255,0.4)',
              borderRadius: vigiaRadius.md,
              px: 3,
              minHeight: 48,
              '&:hover': {
                borderColor: vigiaColors.white,
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
              '&:focus-visible': {
                outline: `2px solid ${vigiaColors.greenIA}`,
                outlineOffset: '2px',
              },
            }}
          >
            {LANDING_HERO.ctaSecondary}
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LandingHero;
