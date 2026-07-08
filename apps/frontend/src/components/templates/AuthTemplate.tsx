import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInLeft, fadeInUp, staggerContainer, staggerItem } from '../../config/animations.config';
import { getFeatureIcon } from '../../config/auth.config';
import { vigiaColors } from '../../theme/vigia-theme';

const VIGIA_ISOTIPO = '/assets/vigia-logo.png';

interface AuthFeature {
  icon: string;
  text: string;
}

interface AuthTemplateProps {
  children: React.ReactNode;
  features?: AuthFeature[];
  leftTitle?: string;
  leftSubtitle?: string;
  leftMessage?: string;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  features = [
    { icon: 'lock', text: 'Validación biométrica segura' },
    { icon: 'car', text: 'Control de accesos en tiempo real' },
    { icon: 'family', text: 'Gestión de autorizaciones y grupo familiar' },
  ],
  leftTitle = 'Control de Acceso Vehicular Inteligente',
  leftSubtitle,
  leftMessage,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {/* ═══ PANEL IZQUIERDO — puerta institucional protegida ═══ */}
      {isMobile ? (
        // Mobile: header compacto con gradiente, NO desaparece
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              background: vigiaColors.gradientHero,
              py: 3,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={VIGIA_ISOTIPO}
              alt="VIGIA"
              sx={{ height: 40, objectFit: 'contain', flexShrink: 0 }}
            />
            <Typography
              sx={{
                fontFamily: '"Exo 2", sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: 1.2,
                color: vigiaColors.white,
              }}
            >
              {leftTitle}
            </Typography>
          </Box>
        </motion.div>
      ) : (
        // Desktop/Tablet: Panel completo
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          animate="visible"
          style={{
            width: isTablet ? '40%' : '50%',
            minHeight: '100vh',
          }}
        >
          <Box
            sx={{
              width: '100%',
              minHeight: '100vh',
              background: vigiaColors.gradientHero,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              px: 6,
              py: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Watermark decorativo — logo VIGIA enorme, casi invisible, detrás de todo */}
            <Box
              component="img"
              src={VIGIA_ISOTIPO}
              alt=""
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '65%',
                opacity: 0.05,
                filter: 'blur(2px)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
            {/* Contenido */}
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 400, textAlign: 'left', width: '100%' }}>
              {/* Logo principal — nítido, sin contenedor blanco, directamente sobre el gradiente */}
              <Box
                component="img"
                src={VIGIA_ISOTIPO}
                alt="VIGIA"
                sx={{
                  width: 200,
                  objectFit: 'contain',
                  display: 'block',
                  mb: 4,
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.2))',
                }}
              />
              {/* Título */}
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  fontSize: isTablet ? '1.6rem' : '2rem',
                  color: vigiaColors.white,
                  lineHeight: 1.2,
                  mb: 1.5,
                }}
              >
                {leftTitle}
              </Typography>
              {/* Subtítulo o mensaje */}
              {(leftSubtitle || leftMessage) && (
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.6,
                    mb: 4,
                  }}
                >
                  {leftSubtitle || leftMessage}
                </Typography>
              )}
              {/* Features */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {features.map((feature, i) => (
                    <motion.div key={i} variants={staggerItem}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center' }}>
                          {getFeatureIcon(feature.icon, { fontSize: 22, color: 'inherit' })}
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: 400,
                          }}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
              {/* Footer */}
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.4)',
                  mt: 6,
                }}
              >
                Universidad Central del Ecuador · 2026
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* ═══ PANEL DERECHO ═══ */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: isMobile ? 'auto' : '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 4, md: 0 },
          }}
        >
          {/* Glassmorphism card */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 420,
              p: { xs: 3, sm: 4 },
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 8px 32px rgba(10, 47, 134, 0.08)',
            }}
          >
            {children}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AuthTemplate;
