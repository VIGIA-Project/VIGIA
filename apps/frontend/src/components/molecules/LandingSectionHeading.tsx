// src/components/molecules/LandingSectionHeading.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { vigiaColors } from '../../theme/vigia-theme';

interface LandingSectionHeadingProps {
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export const LandingSectionHeading: React.FC<LandingSectionHeadingProps> = ({
  eyebrow,
  title,
  align = 'center',
  light = false,
}) => (
  <Box sx={{ textAlign: align, mb: { xs: 4, md: 5 } }}>
    <Typography
      component="p"
      sx={{
        fontFamily: '"Inter", sans-serif',
        fontWeight: 700,
        fontSize: { xs: '0.85rem', md: '0.9rem' },
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: light ? vigiaColors.greenIA : vigiaColors.primary,
        mb: 1.5,
      }}
    >
      {eyebrow}
    </Typography>
    <Typography
      component="h2"
      sx={{
        fontFamily: '"Exo 2", sans-serif',
        fontWeight: 600,
        fontSize: { xs: '1.5rem', md: '1.75rem' },
        color: light ? vigiaColors.white : vigiaColors.textHeading,
        lineHeight: 1.25,
      }}
    >
      {title}
    </Typography>
  </Box>
);

export default LandingSectionHeading;
