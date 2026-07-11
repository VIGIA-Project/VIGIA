// src/components/organisms/propietario/PermisosGrid.tsx
import React, { useMemo, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { staggerContainer, fadeInUp } from '../../../config/animations.config';
import { vigiaRadius } from '../../../theme/vigia-theme';
import { PermisoTemporalCard } from '../../molecules/PermisoTemporalCard';
import { PermisoTemporal } from '../../../config/propietario-permisos.config';

type FiltroKey = 'TODOS' | 'ACTIVO' | 'EXPIRADO' | 'REVOCADO';

const FILTER_LABELS: Record<FiltroKey, string> = {
  TODOS: 'Todos',
  ACTIVO: 'Activos',
  EXPIRADO: 'Expirados',
  REVOCADO: 'Revocados',
};

export interface PermisosGridProps {
  permisos: PermisoTemporal[];
  onViewDetail: (id: string) => void;
  onRevoke: (id: string) => void;
  onCreateClick?: () => void;
}

export const PermisosGrid: React.FC<PermisosGridProps> = ({ permisos, onViewDetail, onRevoke, onCreateClick }) => {
  const shouldReduceMotion = useReducedMotion();
  const [filtro, setFiltro] = useState<FiltroKey>('TODOS');
  const [busqueda, setBusqueda] = useState('');

  const counts = useMemo(
    () => ({
      TODOS: permisos.length,
      ACTIVO: permisos.filter((p) => p.estado === 'ACTIVO').length,
      EXPIRADO: permisos.filter((p) => p.estado === 'EXPIRADO').length,
      REVOCADO: permisos.filter((p) => p.estado === 'REVOCADO').length,
    }),
    [permisos],
  );

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return permisos.filter((p) => {
      const matchEstado = filtro === 'TODOS' || p.estado === filtro;
      const matchBusqueda =
        !term || p.persona.toLowerCase().includes(term) || p.vehiculo.placa.toLowerCase().includes(term);
      return matchEstado && matchBusqueda;
    });
  }, [permisos, filtro, busqueda]);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1.5, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
        <TextField
          size="small"
          placeholder="Buscar por nombre o placa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 260 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filtrados.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
          <CalendarMonthOutlinedIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#0F172A', mb: 0.5 }}>
            No tienes permisos temporales
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#64748B', mb: 3 }}>
            Crea un permiso para autorizar acceso temporal a personas externas.
          </Typography>
          {onCreateClick && (
            <Box
              component="button"
              onClick={onCreateClick}
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
              Crear permiso
            </Box>
          )}
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
            {filtrados.map((permiso) => (
              <motion.div key={permiso.id} variants={shouldReduceMotion ? undefined : fadeInUp}>
                <PermisoTemporalCard permiso={permiso} onViewDetail={onViewDetail} onRevoke={onRevoke} />
              </motion.div>
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default PermisosGrid;
