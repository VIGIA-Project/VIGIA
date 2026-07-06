import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInLeft } from '../../config/animations.config';
import { vigiaRadius, vigiaColors } from '../../theme/vigia-theme';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface EventQueueItemProps {
  placa: string;
  timeAgo: string;
  timeAgoColor?: 'error' | 'warning' | 'default';
  motivo: string;
  buttonType?: 'primary' | 'outline';
  onReview: () => void;
}

export const EventQueueItem: React.FC<EventQueueItemProps> = ({
  placa,
  timeAgo,
  timeAgoColor = 'default',
  motivo,
  buttonType = 'outline',
  onReview,
}) => {
  const getColor = () => {
    if (timeAgoColor === 'error') return vigiaColors.error;
    if (timeAgoColor === 'warning') return vigiaColors.warning;
    return vigiaColors.textSecondary;
  };

  return (
    <motion.div variants={fadeInLeft}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          '&:last-child': { borderBottom: 'none' },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                backgroundColor: 'rgba(0,0,0,0.05)',
                px: 1.5,
                py: 0.5,
                borderRadius: vigiaRadius.sm,
                fontWeight: 600,
                fontFamily: '"Exo 2", sans-serif',
                color: vigiaColors.textHeading,
              }}
            >
              {placa}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: getColor() }}>
              <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', fontWeight: 600 }}>
                {timeAgo}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: vigiaColors.textTertiary }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary }}>
              Motivo: <Box component="span" sx={{ fontWeight: 600, color: vigiaColors.textBody }}>{motivo}</Box>
            </Typography>
          </Box>
        </Box>

        <Button
          variant={buttonType === 'primary' ? 'contained' : 'outlined'}
          onClick={onReview}
          endIcon={buttonType === 'primary' ? <ArrowForwardIcon /> : undefined}
          sx={{
            fontFamily: '"Inter", sans-serif',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: vigiaRadius.sm,
            px: 2,
            ...(buttonType === 'primary'
              ? {
                backgroundColor: '#0A2F86',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#08256B' },
              }
              : {
                borderColor: 'rgba(0,0,0,0.15)',
                color: vigiaColors.textBody,
                backgroundColor: 'rgba(0,0,0,0.02)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)', borderColor: 'rgba(0,0,0,0.2)' },
              }),
          }}
        >
          Revisar
        </Button>
      </Box>
    </motion.div>
  );
};

export default EventQueueItem;
