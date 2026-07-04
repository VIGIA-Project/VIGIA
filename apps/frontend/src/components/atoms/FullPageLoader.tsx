import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { vigiaColors } from '../../theme/vigia-theme';

export const FullPageLoader: React.FC = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FAFC',
      gap: 2,
    }}
    role="status"
    aria-label="Verificando sesión"
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '12px',
        background: vigiaColors.gradientIA,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#FFFFFF' }}>
        V
      </Typography>
    </Box>
    <CircularProgress size={24} sx={{ color: vigiaColors.primary }} />
    <Typography
      sx={{
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.8rem',
        color: vigiaColors.textTertiary,
      }}
    >
      Verificando sesión...
    </Typography>
  </Box>
);

export default FullPageLoader;
