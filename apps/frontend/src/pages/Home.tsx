import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, staggerContainer, staggerItem } from '../config/animations.config';
import { vigiaColors, vigiaShadows, vigiaRadius } from '../theme/vigia-theme';
import { AUTH_ROUTES, AUTH_FEATURES } from '../config/auth.config';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '-5%',
          transform: 'translateY(-50%)',
          opacity: 0.03,
          fontSize: '20rem',
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 900,
          color: vigiaColors.deep,
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        VIGIA
      </Box>

      {/* ═══ HEADER ═══ */}
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 3, md: 6 },
          py: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: vigiaColors.gradientIA,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
              V
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: vigiaColors.textHeading,
            }}
          >
            VIGIA
          </Typography>
        </Box>

        {/* CTA Header */}
        <Button
          variant="outlined"
          onClick={() => navigate(AUTH_ROUTES.login)}
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'none',
            borderColor: 'rgba(13, 92, 207, 0.2)',
            color: vigiaColors.primary,
            borderRadius: vigiaRadius.sm,
            px: 2.5,
            py: 0.8,
            '&:hover': {
              borderColor: vigiaColors.primary,
              backgroundColor: 'rgba(13, 92, 207, 0.04)',
            },
            '&:focus-visible': {
              outline: `2px solid ${vigiaColors.greenIA}`,
              outlineOffset: '2px',
            },
          }}
        >
          Acceder al sistema
        </Button>
      </Box>

      {/* ═══ HERO ═══ */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 0 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          {/* Título principal */}
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3rem' },
              color: vigiaColors.textHeading,
              lineHeight: 1.15,
              mb: 2,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Control de Acceso Vehicular Inteligente
          </Typography>

          {/* Subtexto */}
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: '0.9rem', md: '1.05rem' },
              color: vigiaColors.textSecondary,
              lineHeight: 1.6,
              maxWidth: 560,
              mx: 'auto',
              mb: 4,
            }}
          >
            Seguridad biométrica, validación en tiempo real y gestión centralizada de accesos para propietarios, guardias y administradores.
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
                py: 1.5,
                minHeight: 48,
                boxShadow: vigiaShadows.md,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(25, 214, 196, 0.3)',
                  transform: shouldReduceMotion ? 'none' : 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${vigiaColors.greenIA}`,
                  outlineOffset: '2px',
                },
              }}
            >
              Acceder al sistema
            </Button>
            <Button
              variant="text"
              onClick={() => {
                document.getElementById('pilares')?.scrollIntoView({ behavior: 'smooth' });
              }}
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: vigiaColors.textSecondary,
                px: 3,
                py: 1.5,
                '&:hover': { color: vigiaColors.primary, backgroundColor: 'rgba(13, 92, 207, 0.04)' },
              }}
            >
              Conocer el sistema ↓
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* ═══ PILARES ═══ */}
      <Box
        id="pilares"
        sx={{
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 8 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 3,
              maxWidth: 900,
              mx: 'auto',
            }}
          >
            {AUTH_FEATURES.map((feature, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: vigiaRadius.md,
                    backgroundColor: '#FFFFFF',
                    boxShadow: vigiaShadows.sm,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: vigiaShadows.md,
                      transform: shouldReduceMotion ? 'none' : 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>{feature.icon}</Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: vigiaColors.textBody,
                    }}
                  >
                    {feature.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* ═══ FOOTER ═══ */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 3,
          px: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem',
            color: vigiaColors.textTertiary,
          }}
        >
          Universidad Central del Ecuador · Ecosistema seguro · 2026
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
