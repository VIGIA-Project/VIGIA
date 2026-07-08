// src/components/organisms/landing/LandingFooter.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { vigiaColors } from '../../../theme/vigia-theme';
import { LANDING_FOOTER } from '../../../config/landing.config';
import logoIsotipo from '../../../assets/logo/vigia-isotipo.svg';

export const LandingFooter: React.FC = () => (
  <Box
    component="footer"
    sx={{
      textAlign: 'center',
      px: 3,
      py: 3,
      backgroundColor: vigiaColors.deep,
    }}
  >
    <Box
      component="img"
      src={logoIsotipo}
      alt=""
      aria-hidden="true"
      sx={{ height: 24, mb: 1, opacity: 0.85 }}
    />
    <Typography
      sx={{
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.6)',
      }}
    >
      {LANDING_FOOTER.text}
    </Typography>
  </Box>
);

export default LandingFooter;
