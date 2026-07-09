import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInLeft } from '../../config/animations.config';
import { vigiaRadius } from '../../theme/vigia-theme';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export type RecentAlertSeverity = 'alta' | 'media';

export interface RecentAlertItemProps {
  severity: RecentAlertSeverity;
  title: string;
  subtitle: string;
}

const severityConfig = {
  alta: {
    color: '#C62828', // Red
    bg: 'rgba(198, 40, 40, 0.05)',
    icon: <ErrorOutlineIcon sx={{ fontSize: '1rem', mr: 0.5 }} />,
    label: 'SEVERIDAD ALTA',
  },
  media: {
    color: '#B28200', // Yellow/Orange tint
    bg: 'rgba(237, 178, 0, 0.05)',
    icon: <WarningAmberIcon sx={{ fontSize: '1rem', mr: 0.5 }} />,
    label: 'SEVERIDAD MEDIA',
  },
};

export const RecentAlertItem: React.FC<RecentAlertItemProps> = ({
  severity,
  title,
  subtitle,
}) => {
  const config = severityConfig[severity];

  return (
    <motion.div variants={fadeInLeft}>
      <Box
        sx={{
          backgroundColor: config.bg,
          borderLeft: `3px solid ${config.color}`,
          borderRadius: `0 ${vigiaRadius.sm} ${vigiaRadius.sm} 0`,
          p: 2,
          mb: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', color: config.color, fontWeight: 700, fontSize: '0.75rem', mb: 0.5 }}>
          {config.icon}
          {config.label}
        </Box>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: config.color }}>
          {title}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: config.color, opacity: 0.8 }}>
          {subtitle}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default RecentAlertItem;
