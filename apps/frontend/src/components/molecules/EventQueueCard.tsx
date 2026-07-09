import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../config/animations.config';
import { vigiaRadius, vigiaColors, vigiaShadows } from '../../theme/vigia-theme';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export interface EventQueueCardProps {
  placa: string;
  timeAgo: string;
  timeAgoUrgent?: boolean;
  direction: 'ENTRADA' | 'SALIDA';
  timestamp: string;
  alertTitle: string;
  alertDescription: string;
  alertType?: 'error' | 'warning';
  vehiculo?: string;
  propietario?: string;
  onReview: () => void;
  onClickDetails?: () => void;
}

export const EventQueueCard: React.FC<EventQueueCardProps> = ({
  placa,
  timeAgo,
  timeAgoUrgent = false,
  direction,
  timestamp,
  alertTitle,
  alertDescription,
  alertType = 'error',
  vehiculo = 'Datos de vehículo no disponibles',
  propietario = 'Sistema Automático',
  onReview,
  onClickDetails,
}) => {
  return (
    <motion.div variants={fadeInUp}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: vigiaRadius.md,
          border: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: vigiaColors.white,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: vigiaShadows.sm,
          position: 'relative',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: vigiaShadows.md,
            transform: 'translateY(-2px)',
            borderColor: 'rgba(242,181,31,0.5)', // Dorado Premium hover
          },
          // Línea superior indicadora PENDING_VERIFY (Amarillo)
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: '#F2B51F', // Dorado Premium
          }
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Top Row: Placa and Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, color: '#0A2F86', fontSize: '1.5rem', letterSpacing: 1 }}>
                {placa}
              </Typography>
              {/* Lozenge: PENDING_VERIFY */}
              <Box sx={{ display: 'inline-flex', mt: 0.5, px: 1, py: 0.2, backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: vigiaRadius.sm }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#D97706', letterSpacing: 0.5 }}>
                  PENDING_VERIFY
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: vigiaRadius.full,
                backgroundColor: timeAgoUrgent ? '#FEE2E2' : '#F8FAFC',
                border: `1px solid ${timeAgoUrgent ? '#FCA5A5' : 'rgba(0,0,0,0.08)'}`,
                color: timeAgoUrgent ? '#DC2626' : '#0A2F86',
              }}
            >
              <AccessTimeIcon sx={{ fontSize: '1rem' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>
                {timeAgo}
              </Typography>
            </Box>
          </Box>

          {/* Context Data instead of Image */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, backgroundColor: '#F8FAFC', p: 1.5, borderRadius: vigiaRadius.sm, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5 }}>
                VEHÍCULO IDENTIFICADO
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: '"Inter", sans-serif', color: '#0A2F86' }}>
                {timestamp}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: vigiaColors.textBody, fontFamily: '"Inter", sans-serif' }}>
              {vehiculo}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <PersonOutlineIcon sx={{ fontSize: '1rem', color: '#11A9D6' }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>
                {propietario}
              </Typography>
            </Box>
          </Box>

          {/* Direction */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: vigiaRadius.sm,
                backgroundColor: direction === 'ENTRADA' ? 'rgba(17,169,214,0.1)' : '#F3F4F6', // Azul Intermedio para Entrada
                color: direction === 'ENTRADA' ? '#11A9D6' : '#6B7280',
              }}
            >
              {direction === 'ENTRADA' ? (
                <ArrowRightAltIcon sx={{ fontSize: '1rem' }} />
              ) : (
                <KeyboardBackspaceIcon sx={{ fontSize: '1rem' }} />
              )}
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>
                {direction}
              </Typography>
            </Box>
          </Box>

          {/* Alert Banner / Motivo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              p: 1.5,
              borderRadius: vigiaRadius.sm,
              backgroundColor: alertType === 'error' ? '#FEF2F2' : '#FFFBEB',
              borderLeft: `4px solid ${alertType === 'error' ? '#DC2626' : '#F2B51F'}`, // Dorado Premium para warnings
            }}
          >
            {alertType === 'error' ? (
              <ErrorOutlineIcon sx={{ color: '#DC2626', fontSize: '1.2rem', mt: 0.1 }} />
            ) : (
              <WarningAmberIcon sx={{ color: '#F2B51F', fontSize: '1.2rem', mt: 0.1 }} />
            )}
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: alertType === 'error' ? '#991B1B' : '#B45309', fontFamily: '"Inter", sans-serif' }}>
                {alertTitle}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: alertType === 'error' ? '#B91C1C' : '#D97706', fontFamily: '"Inter", sans-serif', mt: 0.2, lineHeight: 1.3 }}>
                {alertDescription}
              </Typography>
            </Box>
          </Box>

          {/* Action Button */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={onClickDetails}
              sx={{
                flex: 1,
                py: 1,
                color: '#0D5CCF',
                borderColor: 'rgba(13,92,207,0.3)',
                borderRadius: vigiaRadius.sm,
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'none',
                fontFamily: '"Inter", sans-serif',
                '&:hover': {
                  backgroundColor: 'rgba(13,92,207,0.05)',
                  borderColor: '#0D5CCF',
                }
              }}
            >
              Ver Detalles
            </Button>
            <Button
              variant="contained"
              onClick={onReview}
              sx={{
                flex: 1,
                py: 1,
                backgroundColor: '#0D5CCF', // Azul Principal
                color: vigiaColors.white,
                borderRadius: vigiaRadius.sm,
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'none',
                fontFamily: '"Inter", sans-serif',
                boxShadow: '0 2px 4px rgba(13,92,207,0.3)',
                '&:hover': {
                  backgroundColor: '#0A2F86', // Azul Profundo
                  boxShadow: '0 4px 6px rgba(10,47,134,0.4)',
                }
              }}
            >
              Resolver
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default EventQueueCard;
