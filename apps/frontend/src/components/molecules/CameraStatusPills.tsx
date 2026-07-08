// src/components/molecules/CameraStatusPills.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { pulseGlow } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';

export interface CameraStatusPillsProps {
  pills: { label: string; color: 'green' | 'orange' }[];
}

const DOT_COLOR: Record<'green' | 'orange', string> = {
  green: vigiaColors.success,
  orange: '#F2994A',
};

export const CameraStatusPills: React.FC<CameraStatusPillsProps> = ({ pills }) => (
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
    {pills.map((pill) => (
      <Box
        key={pill.label}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.6,
          borderRadius: vigiaRadius.full,
          backgroundColor: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <motion.span
          variants={pulseGlow}
          animate="animate"
          style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: DOT_COLOR[pill.color],
          }}
        />
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.7rem', fontWeight: 500, color: vigiaColors.white }}>
          {pill.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default CameraStatusPills;
