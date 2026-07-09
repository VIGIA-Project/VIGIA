// src/components/organisms/propietario/PasesGrid.tsx
import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { staggerContainer, fadeInUp } from '../../../config/animations.config';
import { vigiaRadius } from '../../../theme/vigia-theme';
import { PaseRapidoCard } from '../../molecules/PaseRapidoCard';
import { PaseRapido } from '../../../config/propietario-pases.config';

type FiltroKey = 'TODOS' | 'ACTIVO' | 'CONSUMIDO' | 'EXPIRADO' | 'REVOCADO';

const FILTER_LABELS: Record<FiltroKey, string> = {
  TODOS: 'Todos',
  ACTIVO: 'Activos',
  CONSUMIDO: 'Consumidos',
  EXPIRADO: 'Expirados',
  REVOCADO: 'Revocados',
};

export interface PasesGridProps {
  pases: PaseRapido[];
  onCopy: (codigo: string) => void;
  onRevoke: (id: string) => void;
  onViewDetail: (id: string) => void;
  onGenerateClick: () => void;
}

export const PasesGrid: React.FC<PasesGridProps> = ({ pases, onCopy, onRevoke, onViewDetail, onGenerateClick }) => {
  const shouldReduceMotion = useReducedMotion();
  const [filtro, setFiltro] = useState<FiltroKey>('TODOS');

  const counts = useMemo(
    () => ({
      TODOS: pases.length,
      ACTIVO: pases.filter((p) => p.estado === 'ACTIVO').length,
      CONSUMIDO: pases.filter((p) => p.estado === 'CONSUMIDO').length,
      EXPIRADO: pases.filter((p) => p.estado === 'EXPIRADO').length,
      REVOCADO: pases.filter((p) => p.estado === 'REVOCADO').length,
    }),
    [pases],
  );

  const filtrados = useMemo(
    () => (filtro === 'TODOS' ? pases : pases.filter((p) => p.estado === filtro)),
    [pases, filtro],
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
        {(Object.keys(FILTER_LABELS) as FiltroKey[]).map((key) => {
          const active = filtro === key;
          return (
            <Box
              key={key}
              component="button"
              onClick={() => setFiltro(key)}
              sx={{
                border: 'none',
                cursor: 'pointer',
                borderRadius: vigiaRadius.full,
                px: 1.75,
                py: 0.75,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.8rem',
                backgroundColor: active ? '#0D5CCF' : '#F1F5F9',
                color: active ? '#FFFFFF' : '#475569',
                transition: 'background-color 180ms ease',
                '&:hover': { backgroundColor: active ? '#0D5CCF' : '#E2E8F0' },
              }}
            >
              {FILTER_LABELS[key]} {counts[key]}
            </Box>
          );
        })}
      </Box>

      {filtrados.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
          <BoltOutlinedIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
            No tienes pases de acceso rápido
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#64748B', mb: 3 }}>
            Genera un pase cuando necesites autorizar un acceso puntual sin biometría.
          </Typography>
          <Box
            component="button"
            onClick={onGenerateClick}
            sx={{
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #0D5CCF, #19D6C4)',
              color: '#FFFFFF',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: vigiaRadius.md,
              px: 3,
              py: 1.5,
            }}
          >
            Generar pase
          </Box>
        </Box>
      ) : (
        <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {filtrados.map((pase) => (
              <motion.div key={pase.id} variants={shouldReduceMotion ? undefined : fadeInUp}>
                <PaseRapidoCard pase={pase} onCopy={onCopy} onRevoke={onRevoke} onViewDetail={onViewDetail} />
              </motion.div>
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default PasesGrid;
