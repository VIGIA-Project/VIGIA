// src/components/organisms/propietario/VehiculoActividadTab.tsx
import React, { useMemo, useState } from 'react';
import { Box, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { EventoTimeline } from '../../molecules';
import {
  mapEventoAEventoDetalle,
  ACTIVIDAD_TAB_COPY,
  RESULTADO_LABEL,
  EventoResultado,
} from '../../../config/propietario-vehiculo-detalle.config';
import { useEventosPorVehiculo } from '../../../hooks/useGuard';
import { LoadingSkeleton, ErrorState } from '../../atoms';

const RESULTADO_OPTIONS: { value: EventoResultado | 'TODOS'; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'PERMITIDO', label: RESULTADO_LABEL.PERMITIDO },
  { value: 'DENEGADO', label: RESULTADO_LABEL.DENEGADO },
  { value: 'REVISION', label: RESULTADO_LABEL.REVISION },
];

export interface VehiculoActividadTabProps {
  vehiculoId: string;
}

export const VehiculoActividadTab: React.FC<VehiculoActividadTabProps> = ({ vehiculoId }) => {
  const [resultado, setResultado] = useState<EventoResultado | 'TODOS'>('TODOS');
  const [search, setSearch] = useState('');

  const eventosQuery = useEventosPorVehiculo(vehiculoId, 50);
  const eventosDetalle = useMemo(
    () => (eventosQuery.data ?? []).map(mapEventoAEventoDetalle),
    [eventosQuery.data]
  );

  const eventos = useMemo(() => {
    const term = search.trim().toLowerCase();
    return eventosDetalle.filter((e) => {
      const matchesResultado = resultado === 'TODOS' || e.resultado === resultado;
      const matchesSearch = !term || e.persona.toLowerCase().includes(term) || e.punto.toLowerCase().includes(term);
      return matchesResultado && matchesSearch;
    });
  }, [eventosDetalle, resultado, search]);

  if (eventosQuery.isLoading) {
    return <LoadingSkeleton variant="cards" rows={3} />;
  }

  if (eventosQuery.isError) {
    return <ErrorState mensaje="No se pudo cargar la actividad de este vehículo." onRetry={() => eventosQuery.refetch()} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        <TextField
          select
          size="small"
          value="7dias"
          label="Rango"
          disabled
          sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, fontFamily: '"Inter", sans-serif', fontSize: '0.85rem' } }}
        >
          <MenuItem value="7dias">{ACTIVIDAD_TAB_COPY.rangeLabel}</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Resultado"
          value={resultado}
          onChange={(e) => setResultado(e.target.value as EventoResultado | 'TODOS')}
          sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, fontFamily: '"Inter", sans-serif', fontSize: '0.85rem' } }}
        >
          {RESULTADO_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ACTIVIDAD_TAB_COPY.searchPlaceholder}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: vigiaColors.textTertiary }} /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, fontFamily: '"Inter", sans-serif', fontSize: '0.85rem' } }}
        />
      </Box>

      {eventos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <HistoryOutlinedIcon sx={{ fontSize: 40, color: vigiaColors.textTertiary, mb: 1.5 }} />
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textSecondary }}>
            {ACTIVIDAD_TAB_COPY.empty}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2.5 }}>
          <EventoTimeline eventos={eventos} />
        </Box>
      )}
    </Box>
  );
};

export default VehiculoActividadTab;
