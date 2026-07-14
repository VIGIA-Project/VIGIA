// src/pages/propietario/Historial.tsx
import React, { useMemo, useState } from 'react';
import { Box, Button, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { LoadingSkeleton, ErrorState } from '../../components/atoms';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows, vigiaSpacing } from '../../theme/vigia-theme';
import { useAuth } from '../../context';
import { useVehiculosDelPropietario } from '../../hooks/useRegistry';
import * as guardService from '../../services/guard.service';
import { EventoAcceso } from '../../services/types/guard.types';

type ResultadoEvento = 'ENTRADA_PERMITIDA' | 'SALIDA_PERMITIDA' | 'DENEGADO' | 'REVISION_MANUAL';

const RESULTADO_BADGE: Record<ResultadoEvento, { label: string; bg: string; color: string }> = {
  ENTRADA_PERMITIDA: { label: 'Entrada permitida', bg: '#DCFCE7', color: '#166534' },
  SALIDA_PERMITIDA: { label: 'Salida permitida', bg: '#DCFCE7', color: '#166534' },
  DENEGADO: { label: 'Acceso denegado', bg: '#FEE2E2', color: '#991B1B' },
  REVISION_MANUAL: { label: 'Revisión manual', bg: '#FEF3C7', color: '#92400E' },
};

const resolverResultado = (evento: EventoAcceso): ResultadoEvento => {
  if (evento.decisionOperativa === 'DENIED') return 'DENEGADO';
  if (evento.decisionOperativa === 'PENDING_VERIFY') return 'REVISION_MANUAL';
  return evento.tipoMovimiento === 'SALIDA' ? 'SALIDA_PERMITIDA' : 'ENTRADA_PERMITIDA';
};

const RESULTADO_OPTIONS: { key: 'TODOS' | ResultadoEvento; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'ENTRADA_PERMITIDA', label: 'Entrada permitida' },
  { key: 'SALIDA_PERMITIDA', label: 'Salida permitida' },
  { key: 'DENEGADO', label: 'Denegado' },
  { key: 'REVISION_MANUAL', label: 'Revisión manual' },
];
const RANGO_OPTIONS = [
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: 'todo', label: 'Todo el historial' },
];

const formatFecha = (iso: string) => {
  const fecha = new Date(iso);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const esMismoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (esMismoDia(fecha, hoy)) return 'hoy';
  if (esMismoDia(fecha, ayer)) return 'ayer';
  return 'anterior';
};

const formatHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false });

const GRUPO_LABEL: Record<'hoy' | 'ayer' | 'anterior', string> = { hoy: 'Hoy', ayer: 'Ayer', anterior: 'Fechas anteriores' };

const HistorialPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const [rango, setRango] = useState('7');
  const [vehiculo, setVehiculo] = useState('Todos');
  const [resultado, setResultado] = useState<'TODOS' | ResultadoEvento>('TODOS');
  const [busqueda, setBusqueda] = useState('');

  const vehiculosQuery = useVehiculosDelPropietario(user?.personaId);
  const vehiculos = vehiculosQuery.data ?? [];

  const eventosQueries = useQueries({
    queries: vehiculos.map((v) => ({
      queryKey: ['guard', 'eventos', 'vehiculo', v.vehiculoId, 50] as const,
      queryFn: () => guardService.listarEventosPorVehiculo(v.vehiculoId, 50),
      enabled: !!v.vehiculoId,
    })),
  });

  const isLoading = vehiculosQuery.isLoading || eventosQueries.some((q) => q.isLoading);
  const isError = vehiculosQuery.isError || eventosQueries.some((q) => q.isError);

  const todosLosEventos = useMemo(
    () => eventosQueries.flatMap((q) => q.data ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventosQueries.map((q) => q.dataUpdatedAt).join(',')]
  );

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    const ahora = Date.now();
    const rangoMs = rango === '7' ? 7 * 86400000 : rango === '30' ? 30 * 86400000 : Infinity;

    return todosLosEventos
      .filter((e) => {
        const matchVehiculo = vehiculo === 'Todos' || e.placaObservada === vehiculo;
        const resultadoEvento = resolverResultado(e);
        const matchResultado = resultado === 'TODOS' || resultadoEvento === resultado;
        const matchBusqueda =
          !term ||
          e.placaObservada.toLowerCase().includes(term) ||
          (e.motivoDetalle ?? '').toLowerCase().includes(term);
        const matchRango = ahora - new Date(e.capturadoEn).getTime() <= rangoMs;
        return matchVehiculo && matchResultado && matchBusqueda && matchRango;
      })
      .sort((a, b) => new Date(b.capturadoEn).getTime() - new Date(a.capturadoEn).getTime());
  }, [todosLosEventos, vehiculo, resultado, busqueda, rango]);

  const grupos: Array<'hoy' | 'ayer' | 'anterior'> = ['hoy', 'ayer', 'anterior'];

  const limpiarFiltros = () => {
    setRango('7');
    setVehiculo('Todos');
    setResultado('TODOS');
    setBusqueda('');
  };

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Historial">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Typography component="h1" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' }, color: '#0F172A' }}>
            Historial
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: '#64748B', mt: 0.5 }}>
            Consulta accesos y eventos vinculados a tus vehículos
          </Typography>
        </motion.div>

        {/* Filtros */}
        <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 2.25, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
            <TextField select label="Rango" size="small" value={rango} onChange={(e) => setRango(e.target.value)}>
              {RANGO_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Vehículo" size="small" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}>
              <MenuItem value="Todos">Todos</MenuItem>
              {vehiculos.map((v) => (
                <MenuItem key={v.vehiculoId} value={v.placa}>{v.placa}</MenuItem>
              ))}
            </TextField>
            <TextField
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por placa o motivo..."
              size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: vigiaColors.textTertiary }} /></InputAdornment> }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {RESULTADO_OPTIONS.map((o) => {
              const active = resultado === o.key;
              return (
                <Box
                  key={o.key}
                  component="button"
                  onClick={() => setResultado(o.key)}
                  sx={{
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: vigiaRadius.full,
                    px: 1.5,
                    py: 0.6,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    backgroundColor: active ? '#0D5CCF' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#475569',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {o.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Listado */}
        {isLoading ? (
          <LoadingSkeleton variant="cards" rows={4} />
        ) : isError ? (
          <ErrorState mensaje="No se pudo cargar tu historial de accesos." onRetry={() => vehiculosQuery.refetch()} />
        ) : filtrados.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
            <HistoryOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.textTertiary, mb: 2 }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary, mb: 2 }}>
              No hay eventos para los filtros seleccionados
            </Typography>
            <Button
              variant="outlined"
              onClick={limpiarFiltros}
              sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}
            >
              Limpiar filtros
            </Button>
          </Box>
        ) : (
          <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {grupos.map((grupo) => {
                const eventos = filtrados.filter((e) => formatFecha(e.capturadoEn) === grupo);
                if (eventos.length === 0) return null;
                return (
                  <Box key={grupo}>
                    <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A', mb: 1 }}>
                      {GRUPO_LABEL[grupo]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {eventos.map((evento) => {
                        const badge = RESULTADO_BADGE[resolverResultado(evento)];
                        return (
                          <Box
                            key={evento.eventoAccesoId}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              flexWrap: 'wrap',
                              borderRadius: vigiaRadius.md,
                              border: '1px solid #E2E8F0',
                              p: 1.75,
                              backgroundColor: vigiaColors.bgCard,
                              transition: 'box-shadow 0.15s ease',
                              '&:hover': { boxShadow: vigiaShadows.sm },
                            }}
                          >
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#0F172A', width: 56 }}>
                              {formatHora(evento.capturadoEn)}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0A2F86', backgroundColor: 'rgba(13,92,207,0.06)', px: 1, py: 0.25, borderRadius: '4px' }}>
                              {evento.placaObservada}
                            </Typography>
                            <Box sx={{ px: 1.25, py: 0.3, borderRadius: vigiaRadius.full, backgroundColor: badge.bg, color: badge.color, fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', fontWeight: 700 }}>
                              {badge.label}
                            </Box>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', flex: 1 }}>
                              {evento.motivoDetalle || evento.motivoCodigo || '—'}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </motion.div>
        )}
      </Box>
    </DashboardTemplate>
  );
};

export { HistorialPage };
export default HistorialPage;
