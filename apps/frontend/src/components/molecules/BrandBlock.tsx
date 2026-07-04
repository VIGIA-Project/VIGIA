// src/components/molecules/BrandBlock.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

// Logo completo con isotipo + wordmark "VIGIA" + eslogan
import vigiaFullLogo from '../../assets/logo/vigia-full.png';

interface BrandBlockProps {
  rol: string;
}

export const BrandBlock: React.FC<BrandBlockProps> = ({ rol }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* Logo completo — responsive, centrado, con contenedor blanco redondeado */}
    <Box
      sx={{
        px: 2,
        pt: 2.5,
        pb: 1.5,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src={vigiaFullLogo}
        alt="VIGIA — Ecosistema Inteligente de Seguridad y Control de Acceso Vehicular Biométrico"
        sx={{
          width: '90%',
          maxWidth: 220,
          height: 'auto',
          objectFit: 'contain',
          // Opción B: el PNG tiene fondo blanco, se presenta con bordes suaves
          borderRadius: '10px',
          backgroundColor: 'rgba(255,255,255,0.96)',
          padding: '8px 10px 6px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
          filter: 'drop-shadow(0 2px 12px rgba(25, 214, 196, 0.10))',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 4px 24px rgba(25, 214, 196, 0.25)',
          },
        }}
      />
    </Box>

    {/* Rol badge — debajo del logo */}
    <Box sx={{ textAlign: 'center', pb: 2 }}>
      <Typography
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '2.5px',
          mt: 0.5,
        }}
      >
        {rol}
      </Typography>
    </Box>
  </Box>
);

export default BrandBlock;
