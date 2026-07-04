import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerItem } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors } from '../../theme/vigia-theme';

type AlertSeverity = 'alta' | 'media' | 'informativa';

interface AlertCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  isRead?: boolean;
  actions?: { label: string; onClick: () => void }[];
}

const severityBorderColors: Record<AlertSeverity, string> = {
  alta: vigiaColors.error,
  media: vigiaColors.warning,
  informativa: vigiaColors.primary,
};

export const AlertCard: React.FC<AlertCardProps> = ({
  icon,
  title,
  description,
  timestamp,
  severity,
  isRead = false,
  actions = [],
}) => (
  <motion.div variants={staggerItem}>
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        borderLeft: `4px solid ${severityBorderColors[severity]}`,
        borderRadius: `0 ${vigiaRadius.md} ${vigiaRadius.md} 0`,
        backgroundColor: isRead ? vigiaColors.bgCard : 'rgba(13, 92, 207, 0.03)',
        boxShadow: vigiaShadows.sm,
        transition: 'all 0.2s ease',
        position: 'relative',
        '&:hover': {
          boxShadow: vigiaShadows.md,
          backgroundColor: vigiaColors.bgCardHover,
        },
      }}
    >
      {!isRead && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: vigiaColors.primary,
          }}
        />
      )}
      <Box sx={{ fontSize: '1.25rem', color: severityBorderColors[severity], mt: '2px' }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: vigiaColors.textBody }}>
          {title}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, mt: 0.5 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.7rem', color: vigiaColors.textTertiary }}>
            {timestamp}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {actions.map((action) => (
              <Button
                key={action.label}
                size="small"
                onClick={action.onClick}
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  color: vigiaColors.primary,
                  '&:hover': { backgroundColor: 'rgba(13, 92, 207, 0.06)' },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  </motion.div>
);

export default AlertCard;
