// src/components/organisms/propietario/VehiculoPasesTab.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { staggerContainer } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { PaseCard } from '../../molecules';
import { MOCK_PASES_DETALLE, PASES_TAB_COPY } from '../../../config/propietario-vehiculo-detalle.config';

export const VehiculoPasesTab: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const pases = MOCK_PASES_DETALLE;

  const activo = pases.find((p) => p.estado === 'ACTIVO');
  const historial = pases.filter((p) => p.estado !== 'ACTIVO');

  if (pases.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
        <VpnKeyOutlinedIcon sx={{ fontSize: 40, color: vigiaColors.textTertiary, mb: 1.5 }} />
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary, mb: 2, maxWidth: 360, mx: 'auto' }}>
          {PASES_TAB_COPY.emptyTitle}
        </Typography>
        <Box
          component="button"
          onClick={() => navigate('/propietario/pases-rapidos')}
          sx={{ background: vigiaColors.gradientIA, border: 'none', borderRadius: vigiaRadius.sm, color: vigiaColors.white, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', px: 2.5, py: 1, cursor: 'pointer' }}
        >
          {PASES_TAB_COPY.emptyCta}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {activo && <PaseCard pase={activo} onCopy={() => {}} onRevoke={() => {}} />}

      {historial.length > 0 && (
        <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            {historial.map((pase) => (
              <PaseCard key={pase.id} pase={pase} />
            ))}
          </Box>
        </motion.div>
      )}

      <Box
        component="button"
        onClick={() => navigate('/propietario/pases-rapidos')}
        sx={{
          alignSelf: 'flex-start',
          background: vigiaColors.gradientIA,
          border: 'none',
          borderRadius: vigiaRadius.sm,
          color: vigiaColors.white,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          fontSize: '0.82rem',
          px: 2.5,
          py: 1,
          cursor: 'pointer',
        }}
      >
        {PASES_TAB_COPY.createCta}
      </Box>
    </Box>
  );
};

export default VehiculoPasesTab;
