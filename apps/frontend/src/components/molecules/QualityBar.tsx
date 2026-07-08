// src/components/molecules/QualityBar.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';

export interface QualityBarProps {
  value: number;
  label: string;
}

export const QualityBar: React.FC<QualityBarProps> = ({ value, label }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box
      sx={{
        border: '1px solid #E2E8F0',
        borderRadius: vigiaRadius.sm,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: vigiaColors.textBody, flexShrink: 0 }}>
        Calidad de imagen:
      </Typography>
      <Box sx={{ flex: 1, minWidth: 120, height: 8, borderRadius: vigiaRadius.full, backgroundColor: 'rgba(10,47,134,0.08)', overflow: 'hidden' }}>
        <motion.div
          initial={shouldReduceMotion ? { width: `${value}%` } : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ height: '100%', borderRadius: 'inherit', background: vigiaColors.gradientIA }}
        />
      </Box>
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', fontWeight: 600, color: vigiaColors.success, flexShrink: 0 }}>
        {value}% — {label}
      </Typography>
    </Box>
  );
};

export default QualityBar;
