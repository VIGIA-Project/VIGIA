// src/components/molecules/PermisoCard.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerItem } from '../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../theme/vigia-theme';
import { StatusChip } from '../atoms';
import { PermisoDetalle, PERMISOS_TAB_COPY } from '../../config/propietario-vehiculo-detalle.config';

export interface PermisoCardProps {
  permiso: PermisoDetalle;
  onViewDetail?: (id: string) => void;
  onRevoke?: (id: string) => void;
}

export const PermisoCard: React.FC<PermisoCardProps> = ({ permiso, onViewDetail, onRevoke }) => {
  const canRevoke = permiso.estado === 'ACTIVO';

  return (
    <motion.div variants={staggerItem}>
      <Box sx={{ p: 2.25, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, backgroundColor: vigiaColors.bgCard }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A' }}>
              {permiso.persona}
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textTertiary }}>
              {permiso.cedulaParcial}
            </Typography>
          </Box>
          <StatusChip estado={permiso.estado} />
        </Box>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B', mb: 0.5 }}>
          {permiso.vigenciaLabel}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.8rem',
            color: vigiaColors.textTertiary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {permiso.motivo}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 1.5, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
          <Box
            component="button"
            onClick={() => onViewDetail?.(permiso.id)}
            sx={{ background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', '&:hover': { textDecoration: 'underline' } }}
          >
            {PERMISOS_TAB_COPY.viewDetail}
          </Box>
          {canRevoke && (
            <Box
              component="button"
              onClick={() => onRevoke?.(permiso.id)}
              sx={{ background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.error, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', '&:hover': { textDecoration: 'underline' } }}
            >
              {PERMISOS_TAB_COPY.revoke}
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PermisoCard;
