import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography
      variant="h6"
      sx={{
        fontFamily: '"Exo 2", sans-serif',
        fontWeight: 600,
        fontSize: '1.1rem',
        color: '#0A2F86',
      }}
    >
      {title}
    </Typography>
    {action}
  </Box>
);

export default SectionHeader;
