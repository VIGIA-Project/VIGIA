// src/components/molecules/PaseCard.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { staggerItem } from '../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../theme/vigia-theme';
import { StatusChip } from '../atoms';
import { PaseDetalle, PASES_TAB_COPY } from '../../config/propietario-vehiculo-detalle.config';

export interface PaseCardProps {
  pase: PaseDetalle;
  onCopy?: (codigo: string) => void;
  onRevoke?: (id: string) => void;
}

export const PaseCard: React.FC<PaseCardProps> = ({ pase, onCopy, onRevoke }) => {
  const shouldReduceMotion = useReducedMotion();
  const isActive = pase.estado === 'ACTIVO';

  if (isActive) {
    return (
      <motion.div
        variants={staggerItem}
        animate={shouldReduceMotion ? undefined : { boxShadow: ['0 0 0px rgba(242,181,31,0)', '0 0 8px rgba(242,181,31,0.3)', '0 0 0px rgba(242,181,31,0)'] }}
        transition={shouldReduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ borderRadius: 12 }}
      >
        <Box
          sx={{
            p: 2.5,
            borderRadius: vigiaRadius.lg,
            border: '2px solid #F2B51F',
            background: 'linear-gradient(135deg, #FFFBEB, #FFFFFF)',
          }}
        >
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.75rem', letterSpacing: '4px', color: '#0F172A' }}>
            {pase.codigo}
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', color: vigiaColors.gold, mt: 0.5 }}>
            {PASES_TAB_COPY.activeLabel(pase.expiraLabel ?? '')}
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B', mt: 1 }}>
            {pase.visitante} {pase.usoUnico && '· Uso único'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Box
              component="button"
              onClick={() => pase.codigo && onCopy?.(pase.codigo)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                border: `1px solid ${vigiaColors.gold}`,
                borderRadius: vigiaRadius.sm,
                backgroundColor: 'transparent',
                color: '#92400E',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.78rem',
                px: 1.5,
                py: 0.6,
                cursor: 'pointer',
              }}
            >
              <ContentCopyIcon sx={{ fontSize: 14 }} />
              {PASES_TAB_COPY.copyCta}
            </Box>
            <Box
              component="button"
              onClick={() => onRevoke?.(pase.id)}
              sx={{
                border: `1px solid ${vigiaColors.error}`,
                borderRadius: vigiaRadius.sm,
                backgroundColor: 'transparent',
                color: vigiaColors.error,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.78rem',
                px: 1.5,
                py: 0.6,
                cursor: 'pointer',
              }}
            >
              {PASES_TAB_COPY.revokeCta}
            </Box>
          </Box>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerItem}>
      <Box sx={{ p: 2.25, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, backgroundColor: vigiaColors.bgCard }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '3px', color: '#94A3B8' }}>
            {PASES_TAB_COPY.maskedCode}
          </Typography>
          <StatusChip estado={pase.estado} />
        </Box>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: '#0F172A', fontWeight: 500 }}>
          {pase.visitante}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', mt: 0.25 }}>
          {[pase.punto, pase.fecha].filter(Boolean).join(' · ')}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default PaseCard;
