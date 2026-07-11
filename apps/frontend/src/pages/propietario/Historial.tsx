// src/pages/propietario/Historial.tsx
import React, { useMemo, useState } from 'react';
import { Box, Button, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { useQuery } from '@tanstack/react-query';
import { accessControlService } from '../../services/access-control.service';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows, vigiaSpacing } from '../../theme/vigia-theme';

type ResultadoEvento = 'ENTRADA_PERMITIDA' | 'SALIDA_PERMITIDA' | 'DENEGADO' | 'REVISION_MANUAL' | 'PASE_CONSUMIDO' | 'PERMISO_EXPIRADO';

interface HistorialEvento {
  id: string;
  fecha: string; // ISO
  hora: string;
  placa: string;
  resultado: ResultadoEvento;
  puntoAcceso: string;
  persona: string;
  grupo: 'hoy' | 'ayer' | 'anterior';
}

const RESULTADO_BADGE: Record<ResultadoEvento, { label: string; bg: string; color: string }> = {
  ENTRADA_PERMITIDA: { label: 'Entrada permitida', bg: '#DCFCE7', color: '#166534' },
  SALIDA_PERMITIDA: { label: 'Salida permitida', bg: '#DCFCE7', color: '#166534' },
  DENEGADO: { label: 'Acceso denegado', bg: '#FEE2E2', color: '#991B1B' },
  REVISION_MANUAL: { label: 'Revisión manual', bg: '#FEF3C7', color: '#92400E' },
  PASE_CONSUMIDO: { label: 'Pase consumido', bg: '#DBEAFE', color: '#1E40AF' },
  PERMISO_EXPIRADO: { label: 'Permiso expirado', bg: '#F1F5F9', color: '#64748B' },
};

// MOCK_EVENTOS eliminado

const VEHICULO_OPTIONS = ['Todos', 'ABC-1234', 'XYZ-5678'];
const RESULTADO_OPTIONS: { key: 'TODOS' | ResultadoEvento; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'ENTRADA_PERMITIDA', label: 'Entrada permitida' },
  { key: 'SALIDA_PERMITIDA', label: 'Salida permitida' },
  { key: 'DENEGADO', label: 'Denegado' },
  { key: 'REVISION_MANUAL', label: 'Revisión manual' },
  { key: 'PASE_CONSUMIDO', label: 'Pase consumido' },
  { key: 'PERMISO_EXPIRADO', label: 'Permiso expirado' },
];
const RANGO_OPTIONS = [
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: 'todo', label: 'Todo el historial' },
];

const GRUPO_LABEL: Record<HistorialEvento['grupo'], string> = { hoy: 'Hoy', ayer: 'Ayer', anterior: 'Fechas anteriores' };

const HistorialPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [rango, setRango] = useState('7');
  const [vehiculo, setVehiculo] = useState('Todos');
  const [resultado, setResultado] = useState<'TODOS' | ResultadoEvento>('TODOS');
  const [busqueda, setBusqueda] = useState('');

  const { data: rawEventos = [] } = useQuery({
    queryKey: ['historial', 'recientes'],
    queryFn: () => accessControlService.obtenerEventosRecientes(50)
  });

  const eventosMapped: HistorialEvento[] = useMemo(() => {
    return rawEventos.map((e: any) => {
      const fechaObj = new Date(e.fechaCreacion || e.fecha || new Date());
      return {
        id: e.id || e.evento_id || Math.random().toString(),
        fecha: fechaObj.toISOString().split('T')[0],
        hora: fechaObj.toLocaleTimeString().slice(0, 5),
        placa: e.placa || e.vehiculo_placa || 'N/A',
        resultado: (e.tipoEvento === 'ACCESO_DENEGADO' || e.resultado === 'DENEGADO') ? 'DENEGADO' : 'ENTRADA_PERMITIDA',
        puntoAcceso: e.puntoAcceso || e.garita || 'Garita Principal',
        persona: e.persona || 'Desconocido',
        grupo: 'hoy' as const
      };
    });
  }, [rawEventos]);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return eventosMapped.filter((e) => {
      const matchVehiculo = vehiculo === 'Todos' || e.placa === vehiculo;
      const matchResultado = resultado === 'TODOS' || e.resultado === resultado;
      const matchBusqueda = !term || e.persona.toLowerCase().includes(term) || e.placa.toLowerCase().includes(term) || e.puntoAcceso.toLowerCase().includes(term);
      return matchVehiculo && matchResultado && matchBusqueda;
    });
  }, [eventosMapped, vehiculo, resultado, busqueda]);

  const grupos: HistorialEvento['grupo'][] = ['hoy', 'ayer', 'anterior'];

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
              {VEHICULO_OPTIONS.map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </TextField>
            <TextField
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar persona, placa o punto de acceso..."
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
        {filtrados.length === 0 ? (
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
                const eventos = filtrados.filter((e) => e.grupo === grupo);
                if (eventos.length === 0) return null;
                return (
                  <Box key={grupo}>
                    <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A', mb: 1 }}>
                      {GRUPO_LABEL[grupo]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {eventos.map((evento) => {
                        const badge = RESULTADO_BADGE[evento.resultado];
                        return (
                          <Box
                            key={evento.id}
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
                              {evento.hora}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0A2F86', backgroundColor: 'rgba(13,92,207,0.06)', px: 1, py: 0.25, borderRadius: '4px' }}>
                              {evento.placa}
                            </Typography>
                            <Box sx={{ px: 1.25, py: 0.3, borderRadius: vigiaRadius.full, backgroundColor: badge.bg, color: badge.color, fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', fontWeight: 700 }}>
                              {badge.label}
                            </Box>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B' }}>
                              {evento.puntoAcceso}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', flex: 1 }}>
                              {evento.persona}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
                              sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', color: vigiaColors.primary }}
                            >
                              Ver
                            </Button>
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
