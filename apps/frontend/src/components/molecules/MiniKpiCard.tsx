// src/components/molecules/MiniKpiCard.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerItem } from '../../config/animations.config';
import { vigiaRadius } from '../../theme/vigia-theme';

export interface MiniKpiCardProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

export const MiniKpiCard: React.FC<MiniKpiCardProps> = ({ icon, label, children }) => (
  <motion.div variants={staggerItem} style={{ height: '100%' }}>
    <Box
      sx={{
        height: '100%',
        p: 2,
        borderRadius: vigiaRadius.sm,
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748B' }}>
        <Box sx={{ display: 'flex', fontSize: 18 }}>{icon}</Box>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  </motion.div>
);

export default MiniKpiCard;
