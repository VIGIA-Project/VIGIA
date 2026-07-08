// src/components/organisms/landing/LandingHeader.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { LANDING_NAV_LINKS } from '../../../config/landing.config';
import { AUTH_ROUTES } from '../../../config/auth.config';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import logoFull from '../../../assets/logo/vigia-full.png';

const SCROLL_THRESHOLD = 24;

const scrollToAnchor = (href: string) => {
  const id = href.replace('#', '');
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkColor = isScrolled ? vigiaColors.textBody : 'rgba(255,255,255,0.92)';

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 3, md: 6 },
        py: isScrolled ? 1.25 : 2,
        backgroundColor: isScrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        boxShadow: isScrolled ? '0 2px 12px rgba(10,47,134,0.08)' : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Logo — pastilla blanca sutil para legibilidad sobre el gradiente del hero */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: vigiaRadius.sm,
          px: 1.5,
          py: 0.5,
        }}
      >
        <Box component="img" src={logoFull} alt="VIGIA" sx={{ height: 32, objectFit: 'contain' }} />
      </Box>

      {/* Nav anchors — desktop */}
      <Stack
        component="nav"
        direction="row"
        spacing={4}
        sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
      >
        {LANDING_NAV_LINKS.map((link) => (
          <Box
            key={link.href}
            component="button"
            onClick={() => scrollToAnchor(link.href)}
            sx={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: linkColor,
              transition: 'color 0.2s ease',
              '&:hover': { color: vigiaColors.greenIA },
              '&:focus-visible': {
                outline: `2px solid ${vigiaColors.greenIA}`,
                outlineOffset: '2px',
              },
            }}
          >
            {link.label}
          </Box>
        ))}
      </Stack>

      {/* CTA — desktop */}
      <Button
        variant="outlined"
        onClick={() => navigate(AUTH_ROUTES.login)}
        sx={{
          display: { xs: 'none', sm: 'inline-flex' },
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          fontSize: '0.85rem',
          textTransform: 'none',
          borderColor: isScrolled ? 'rgba(13, 92, 207, 0.3)' : 'rgba(255,255,255,0.6)',
          color: isScrolled ? vigiaColors.primary : vigiaColors.white,
          borderRadius: vigiaRadius.sm,
          px: 2.5,
          py: 0.8,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: isScrolled ? vigiaColors.primary : vigiaColors.white,
            backgroundColor: isScrolled ? 'rgba(13, 92, 207, 0.04)' : 'rgba(255,255,255,0.12)',
          },
          '&:focus-visible': {
            outline: `2px solid ${vigiaColors.greenIA}`,
            outlineOffset: '2px',
          },
        }}
      >
        Acceder al sistema
      </Button>

      {/* Hamburger — mobile */}
      <IconButton
        aria-label="Abrir menú de navegación"
        onClick={() => setMobileOpen(true)}
        sx={{ display: { xs: 'inline-flex', md: 'none' }, color: linkColor }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Stack spacing={2.5} component="nav">
            {LANDING_NAV_LINKS.map((link) => (
              <Box
                key={link.href}
                component="button"
                onClick={() => {
                  setMobileOpen(false);
                  setTimeout(() => scrollToAnchor(link.href), 200);
                }}
                sx={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: vigiaColors.textBody,
                }}
              >
                {link.label}
              </Box>
            ))}
          </Stack>
          <Button
            variant="contained"
            onClick={() => navigate(AUTH_ROUTES.login)}
            sx={{
              background: vigiaColors.gradientIA,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.sm,
              minHeight: 48,
            }}
          >
            Acceder al sistema
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default LandingHeader;
