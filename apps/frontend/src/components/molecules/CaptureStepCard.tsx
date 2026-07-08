// src/components/molecules/CaptureStepCard.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';

export type CaptureStepState = 'active' | 'pending' | 'completed';

export interface CaptureStepCardProps {
  badge: number;
  title: string;
  subtitle: string;
  state: CaptureStepState;
}

const STATE_STYLES: Record<CaptureStepState, { border: string; borderWidth: number; badgeBg: string; badgeColor: string; iconColor: string }> = {
  active: { border: vigiaColors.primary, borderWidth: 2, badgeBg: vigiaColors.greenIA, badgeColor: vigiaColors.deep, iconColor: vigiaColors.primary },
  pending: { border: '#E2E8F0', borderWidth: 1, badgeBg: 'transparent', badgeColor: vigiaColors.textTertiary, iconColor: vigiaColors.textTertiary },
  completed: { border: vigiaColors.success, borderWidth: 1, badgeBg: vigiaColors.success, badgeColor: vigiaColors.white, iconColor: vigiaColors.success },
};

export const CaptureStepCard: React.FC<CaptureStepCardProps> = ({ badge, title, subtitle, state }) => {
  const styles = STATE_STYLES[state];

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: vigiaRadius.lg,
        border: `${styles.borderWidth}px solid ${styles.border}`,
        p: 2.5,
        textAlign: 'center',
        transition: 'border-color 0.3s ease',
        backgroundColor: vigiaColors.bgCard,
      }}
    >
      {/* Badge numérico */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 22,
          height: 22,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: styles.badgeBg,
          border: state === 'pending' ? `1.5px solid ${vigiaColors.textTertiary}` : 'none',
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: styles.badgeColor,
        }}
      >
        {badge}
      </Box>

      {/* Ícono persona dentro de círculo dashed */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `2px dashed ${state === 'active' ? vigiaColors.primary : '#CBD5E1'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 1.5,
        }}
      >
        {state === 'completed' ? (
          <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 350, damping: 14 }}>
            <CheckCircleIcon sx={{ fontSize: 30, color: vigiaColors.success }} />
          </motion.div>
        ) : (
          <PersonOutlineOutlinedIcon sx={{ fontSize: 30, color: styles.iconColor }} />
        )}
      </Box>

      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: vigiaColors.textHeading }}>
        {state === 'completed' ? 'Completada' : title}
      </Typography>
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textSecondary, mt: 0.3 }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default CaptureStepCard;
