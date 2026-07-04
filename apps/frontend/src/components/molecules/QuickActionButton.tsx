import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { vigiaShadows, vigiaRadius, vigiaColors } from '../../theme/vigia-theme';
import { staggerItem } from '../../config/animations.config';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, sublabel, onClick }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div variants={staggerItem}>
      <Box
        onClick={onClick}
        tabIndex={0}
        role="button"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 2.5,
          minHeight: '56px',
          borderRadius: vigiaRadius.md,
          backgroundColor: vigiaColors.bgCard,
          border: `1px solid rgba(13, 92, 207, 0.12)`,
          boxShadow: vigiaShadows.sm,
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: vigiaColors.gradientIA,
            color: vigiaColors.white,
            transform: shouldReduceMotion ? 'none' : 'translateY(-2px)',
            boxShadow: vigiaShadows.md,
            border: '1px solid transparent',
            '& .qa-icon, & .qa-label, & .qa-sublabel': { color: vigiaColors.white },
          },
          '&:focus-visible': {
            outline: `2px solid ${vigiaColors.greenIA}`,
            outlineOffset: '2px',
          },
        }}
      >
        <Box className="qa-icon" sx={{ fontSize: '1.5rem', color: vigiaColors.primary, transition: 'color 0.2s' }}>
          {icon}
        </Box>
        <Typography
          className="qa-label"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: vigiaColors.textBody,
            textAlign: 'center',
            transition: 'color 0.2s',
          }}
        >
          {label}
        </Typography>
        {sublabel && (
          <Typography
            className="qa-sublabel"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.7rem',
              color: vigiaColors.textSecondary,
              textAlign: 'center',
              transition: 'color 0.2s',
            }}
          >
            {sublabel}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default QuickActionButton;
