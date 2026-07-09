// src/components/organisms/propietario/VehiculoPermisosTab.tsx
import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { staggerContainer } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { PermisoCard } from '../../molecules';
import { PropietarioVehiculo } from '../../../config/propietario-vehiculos.config';
import { MOCK_PERMISOS_DETALLE, PERMISOS_TAB_COPY, PermisoEstado } from '../../../config/propietario-vehiculo-detalle.config';

type FilterKey = 'TODOS' | PermisoEstado;

export interface VehiculoPermisosTabProps {
  vehiculo: PropietarioVehiculo;
}

export const VehiculoPermisosTab: React.FC<VehiculoPermisosTabProps> = ({ vehiculo }) => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterKey>('TODOS');

  const counts = useMemo(
    () => ({
      TODOS: MOCK_PERMISOS_DETALLE.length,
      ACTIVO: MOCK_PERMISOS_DETALLE.filter((p) => p.estado === 'ACTIVO').length,
      EXPIRADO: MOCK_PERMISOS_DETALLE.filter((p) => p.estado === 'EXPIRADO').length,
      REVOCADO: MOCK_PERMISOS_DETALLE.filter((p) => p.estado === 'REVOCADO').length,
    }),
    []
  );

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'TODOS', label: `Todos ${counts.TODOS}` },
    { key: 'ACTIVO', label: `${PERMISOS_TAB_COPY.filters.activos} ${counts.ACTIVO}` },
    { key: 'EXPIRADO', label: `${PERMISOS_TAB_COPY.filters.expirados} ${counts.EXPIRADO}` },
    { key: 'REVOCADO', label: `${PERMISOS_TAB_COPY.filters.revocados} ${counts.REVOCADO}` },
  ];

  const permisos = useMemo(
    () => (filter === 'TODOS' ? MOCK_PERMISOS_DETALLE : MOCK_PERMISOS_DETALLE.filter((p) => p.estado === filter)),
    [filter]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {filters.map((f) => {
          const isActive = filter === f.key;
          return (
            <Box
              key={f.key}
              component="button"
              onClick={() => setFilter(f.key)}
              sx={{
                border: 'none',
                cursor: 'pointer',
                borderRadius: vigiaRadius.sm,
                px: 1.5,
                py: 0.7,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.78rem',
                backgroundColor: isActive ? '#0D5CCF' : '#F1F5F9',
                color: isActive ? vigiaColors.white : '#475569',
              }}
            >
              {f.label}
            </Box>
          );
        })}
      </Box>

      {permisos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <FactCheckOutlinedIcon sx={{ fontSize: 40, color: vigiaColors.textTertiary, mb: 1.5 }} />
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary, mb: 2 }}>
            {PERMISOS_TAB_COPY.empty}
          </Typography>
          <Box
            component="button"
            onClick={() => navigate(`/propietario/permisos-temporales?placa=${vehiculo.placa}`)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
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
            {PERMISOS_TAB_COPY.createCta}
          </Box>
        </Box>
      ) : (
        <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
            {permisos.map((permiso) => (
              <PermisoCard key={permiso.id} permiso={permiso} onViewDetail={() => {}} onRevoke={() => {}} />
            ))}
          </Box>
        </motion.div>
      )}

      {permisos.length > 0 && (
        <Box
          component="button"
          onClick={() => navigate(`/propietario/permisos-temporales?placa=${vehiculo.placa}`)}
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
          {PERMISOS_TAB_COPY.createCta}
        </Box>
      )}
    </Box>
  );
};

export default VehiculoPermisosTab;
