import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '../atoms';
import { vigiaShadows, vigiaRadius, vigiaColors } from '../../theme/vigia-theme';
import { staggerItem } from '../../config/animations.config';

interface KpiCardProps {
  value: number;
  label: string;
  indicator?: string;
  indicatorColor?: string;
  accentColor?: string;
  onClick?: () => void;
  suffix?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  value,
  label,
  indicator,
  indicatorColor = vigiaColors.textSecondary,
  accentColor = vigiaColors.primary,
  onClick,
  suffix,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div variants={staggerItem}>
      <Box
        onClick={onClick}
        sx={{
          p: 2.5,
          borderRadius: vigiaRadius.md,
          backgroundColor: vigiaColors.bgCard,
          boxShadow: vigiaShadows.sm,
          borderTop: `3px solid ${accentColor}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': onClick ? {
            transform: shouldReduceMotion ? 'none' : 'translateY(-3px)',
            boxShadow: vigiaShadows.md,
            backgroundColor: vigiaColors.bgCardHover,
          } : {},
          '&:focus-visible': {
            outline: `2px solid ${vigiaColors.greenIA}`,
            outlineOffset: '2px',
          },
        }}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : undefined}
      >
        <AnimatedCounter value={value} suffix={suffix} />
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            color: vigiaColors.textTertiary,
            letterSpacing: '0.5px',
            mt: 0.5,
          }}
        >
          {label}
        </Typography>
        {indicator && (
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              color: indicatorColor,
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {indicator}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default KpiCard;
