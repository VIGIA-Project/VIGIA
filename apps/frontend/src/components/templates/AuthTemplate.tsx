import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInLeft, fadeInUp, staggerContainer, staggerItem } from '../../config/animations.config';
import { getFeatureIcon } from '../../config/auth.config';

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
    { icon: '🔒', text: 'Validación biométrica segura' },
    { icon: '🚗', text: 'Control de accesos en tiempo real' },
    { icon: '👨‍👩‍👧', text: 'Gestión de autorizaciones y grupo familiar' },
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
      {/* ═══ PANEL IZQUIERDO ═══ */}
      {isMobile ? (
        // Mobile: Header compacto con gradiente
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 50%, #19D6C4 100%)',
              py: 3,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Logo real */}
            <Box
              component="img"
              src="/assets/vigia-logo.png"
              alt="VIGIA"
              sx={{
                width: 36,
                height: 36,
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                }}
              >
                VIGIA
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Control de Acceso Vehicular Inteligente
              </Typography>
            </Box>
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
              background: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 50%, #19D6C4 100%)',
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
            {/* Fondo difuminado con logo real */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/vigia-logo.png)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center right',
                backgroundSize: '120%',
                opacity: 0.06,
                filter: 'blur(3px)',
                pointerEvents: 'none',
              }}
            />
            {/* Contenido */}
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 400, textAlign: 'left', width: '100%' }}>
              {/* Logo */}
              <Box
                component="img"
                src="/assets/vigia-logo.png"
                alt="VIGIA"
                sx={{
                  width: 52,
                  height: 52,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
                  mb: 4,
                }}
              />
              {/* Título */}
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  fontSize: isTablet ? '1.6rem' : '2rem',
                  color: '#FFFFFF',
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
