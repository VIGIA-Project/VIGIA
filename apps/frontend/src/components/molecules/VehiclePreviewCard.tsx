// src/components/molecules/VehiclePreviewCard.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../theme/vigia-theme';

export interface VehiclePreviewCardProps {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  anio: string;
  visible: boolean;
}

export const VehiclePreviewCard: React.FC<VehiclePreviewCardProps> = ({ placa, marca, modelo, color, anio, visible }) => {
  const details = [marca, modelo, color, anio].filter(Boolean).join(' · ');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2.5,
              borderRadius: vigiaRadius.lg,
              border: '1px solid rgba(13,92,207,0.15)',
              backgroundColor: 'rgba(13,92,207,0.03)',
              boxShadow: vigiaShadows.sm,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'rgba(13,92,207,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <DirectionsCarFilledOutlinedIcon sx={{ color: vigiaColors.primary, fontSize: 26 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: vigiaColors.textHeading,
                  letterSpacing: '0.5px',
                }}
              >
                {placa}
              </Typography>
              {details && (
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary }}>
                  {details}
                </Typography>
              )}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehiclePreviewCard;
