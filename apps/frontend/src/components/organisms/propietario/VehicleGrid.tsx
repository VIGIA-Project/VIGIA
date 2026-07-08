// src/components/organisms/propietario/VehicleGrid.tsx
import React, { useMemo, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import AddIcon from '@mui/icons-material/Add';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { VehicleCard } from '../../molecules/VehicleCard';
import { PropietarioVehiculo, MIS_VEHICULOS_COPY } from '../../../config/propietario-vehiculos.config';

type FilterKey = 'todos' | 'activos' | 'inactivos';

export interface VehicleGridProps {
  vehiculos: PropietarioVehiculo[];
  onViewDetail: (id: string) => void;
  onCreatePermiso: (id: string) => void;
  onRegisterClick: () => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehiculos, onViewDetail, onCreatePermiso, onRegisterClick }) => {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [search, setSearch] = useState('');

  const counts = useMemo(
    () => ({
      todos: vehiculos.length,
      activos: vehiculos.filter((v) => v.estado === 'ACTIVO').length,
      inactivos: vehiculos.filter((v) => v.estado === 'INACTIVO').length,
    }),
    [vehiculos]
  );

  const filterOptions: { key: FilterKey; label: string }[] = [
    { key: 'todos', label: `${MIS_VEHICULOS_COPY.filters.todos} ${counts.todos}` },
    { key: 'activos', label: `${MIS_VEHICULOS_COPY.filters.activos} ${counts.activos}` },
    { key: 'inactivos', label: `${MIS_VEHICULOS_COPY.filters.inactivos} ${counts.inactivos}` },
  ];

  const filtered = useMemo(() => {
    const bySearch = vehiculos.filter((v) => v.placa.toLowerCase().includes(search.trim().toLowerCase()));
    if (filter === 'activos') return bySearch.filter((v) => v.estado === 'ACTIVO');
    if (filter === 'inactivos') return bySearch.filter((v) => v.estado === 'INACTIVO');
    return bySearch;
  }, [vehiculos, filter, search]);

  if (vehiculos.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          borderRadius: vigiaRadius.lg,
          border: '1px solid #E2E8F0',
          background: 'linear-gradient(180deg, rgba(13,92,207,0.04) 0%, rgba(255,255,255,0) 100%)',
        }}
      >
        <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.primary, mb: 2 }} />
        <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1.1rem', color: vigiaColors.textHeading, mb: 1 }}>
          {MIS_VEHICULOS_COPY.emptyState.title}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary, mb: 3, maxWidth: 380, mx: 'auto' }}>
          {MIS_VEHICULOS_COPY.emptyState.description}
        </Typography>
        <Box
          component="button"
          onClick={onRegisterClick}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            background: vigiaColors.gradientIA,
            border: 'none',
            borderRadius: vigiaRadius.md,
            color: vigiaColors.white,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            px: 3,
            py: 1.4,
          }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          {MIS_VEHICULOS_COPY.registerCta}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtros */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: { xs: 0.5, sm: 0 } }}>
          {filterOptions.map((option) => {
            const isActive = filter === option.key;
            return (
              <Box
                key={option.key}
                component="button"
                onClick={() => setFilter(option.key)}
                sx={{
                  flexShrink: 0,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: vigiaRadius.sm,
                  px: 1.75,
                  py: 0.75,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  backgroundColor: isActive ? '#0D5CCF' : '#F1F5F9',
                  color: isActive ? vigiaColors.white : '#475569',
                }}
              >
                {option.label}
              </Box>
            );
          })}
        </Box>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={MIS_VEHICULOS_COPY.searchPlaceholder}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: vigiaColors.textTertiary }} />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: { xs: '100%', sm: 220 },
            '& .MuiOutlinedInput-root': {
              height: 44,
              borderRadius: vigiaRadius.sm,
              backgroundColor: vigiaColors.bgCard,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.85rem',
              '&.Mui-focused fieldset': { borderColor: vigiaColors.greenIA, borderWidth: '2px' },
            },
          }}
        />
      </Box>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary }}>
            {MIS_VEHICULOS_COPY.emptySearch}
          </Typography>
        </Box>
      ) : (
        <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 2.5,
            }}
          >
            {filtered.map((vehiculo) => (
              <motion.div key={vehiculo.id} variants={shouldReduceMotion ? undefined : staggerItem}>
                <VehicleCard vehiculo={vehiculo} onViewDetail={onViewDetail} onCreatePermiso={onCreatePermiso} />
              </motion.div>
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default VehicleGrid;
