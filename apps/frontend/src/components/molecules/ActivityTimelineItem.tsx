import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInLeft } from '../../config/animations.config';
import { vigiaRadius, vigiaColors } from '../../theme/vigia-theme';

export type ActivitySeverity = 'success' | 'warning' | 'error' | 'info';

interface ActivityTimelineItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  timestamp: string;
  severity: ActivitySeverity;
  onClick?: () => void;
}

const severityColors: Record<ActivitySeverity, string> = {
  success: vigiaColors.success,
  warning: vigiaColors.warning,
  error: vigiaColors.error,
  info: vigiaColors.primary,
};

export const ActivityTimelineItem: React.FC<ActivityTimelineItemProps> = ({
  icon,
  title,
  subtitle,
  timestamp,
  severity,
  onClick,
}) => (
  <motion.div variants={fadeInLeft}>
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderLeft: `2px solid ${severityColors[severity]}`,
        borderRadius: `0 ${vigiaRadius.sm} ${vigiaRadius.sm} 0`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(13, 92, 207, 0.03)',
        },
      }}
    >
      <Box sx={{ fontSize: '1.25rem', lineHeight: 1, mt: '2px' }}>{icon}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize: '0.85rem',
            color: vigiaColors.textBody,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textSecondary }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Typography
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.7rem',
          color: vigiaColors.textTertiary,
          whiteSpace: 'nowrap',
          mt: '2px',
        }}
      >
        {timestamp}
      </Typography>
    </Box>
  </motion.div>
);

export default ActivityTimelineItem;
