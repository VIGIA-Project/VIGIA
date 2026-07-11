// src/components/organisms/propietario/VehiculoResumenTab.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { staggerContainer } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { MiniKpiCard, EventoTimeline } from '../../molecules';
import { PropietarioVehiculo } from '../../../config/propietario-vehiculos.config';
import { RESUMEN_TAB_COPY, ESTADO_VEHICULO_STYLES, FAMILIA_MAX_MIEMBROS, TabKey } from '../../../config/propietario-vehiculo-detalle.config';

export interface VehiculoResumenTabProps {
  vehiculo: PropietarioVehiculo;
  onNavigateTab: (tab: TabKey) => void;
}

export const VehiculoResumenTab: React.FC<VehiculoResumenTabProps> = ({ vehiculo, onNavigateTab }) => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const estadoStyle = ESTADO_VEHICULO_STYLES[vehiculo.estado];

  const acciones = [
    {
      icon: <FactCheckOutlinedIcon sx={{ fontSize: 24, color: vigiaColors.primary }} />,
      label: RESUMEN_TAB_COPY.accionCrearPermiso,
      onClick: () => navigate(`/propietario/permisos-temporales?placa=${vehiculo.placa}`),
    },
    {
      icon: <VpnKeyOutlinedIcon sx={{ fontSize: 24, color: vigiaColors.primary }} />,
      label: RESUMEN_TAB_COPY.accionGenerarPase,
      onClick: () => navigate('/propietario/pases-rapidos'),
    },
    {
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 24, color: vigiaColors.primary }} />,
      label: RESUMEN_TAB_COPY.accionVerPersonas,
      onClick: () => onNavigateTab('personas'),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Mini-KPIs 2x2 */}
      <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          <MiniKpiCard icon={<ShieldOutlinedIcon sx={{ fontSize: 18 }} />} label={RESUMEN_TAB_COPY.kpiEstado}>
            <Box
              sx={{
                display: 'inline-block',
                px: 1.25,
                py: 0.35,
                borderRadius: vigiaRadius.full,
                backgroundColor: estadoStyle.bg,
                color: estadoStyle.color,
                border: `1px solid ${estadoStyle.border}`,
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {vehiculo.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
            </Box>
          </MiniKpiCard>

          <MiniKpiCard icon={<ShieldOutlinedIcon sx={{ fontSize: 18 }} />} label={RESUMEN_TAB_COPY.kpiPermisos}>
            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#0F172A' }}>
              {vehiculo.permisosActivos}
            </Typography>
          </MiniKpiCard>

          <MiniKpiCard icon={<GroupOutlinedIcon sx={{ fontSize: 18 }} />} label={RESUMEN_TAB_COPY.kpiPersonas}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#0F172A' }}>
              <Box component="span" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>
                {vehiculo.personasAsignadas}
              </Box>{' '}
              /{FAMILIA_MAX_MIEMBROS} cupos
            </Typography>
          </MiniKpiCard>

          <MiniKpiCard icon={<AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />} label={RESUMEN_TAB_COPY.kpiUltimoEvento}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textBody, lineHeight: 1.4 }}>
              {RESUMEN_TAB_COPY.ultimoEventoLabel}
            </Typography>
          </MiniKpiCard>
        </Box>
      </motion.div>

      {/* Acciones sugeridas */}
      <Box>
        <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', mb: 1.5 }}>
          {RESUMEN_TAB_COPY.accionesTitle}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
          {acciones.map((accion) => (
            <Box
              key={accion.label}
              component="button"
              onClick={accion.onClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: vigiaRadius.lg,
                border: '1px solid #E2E8F0',
                backgroundColor: vigiaColors.bgCard,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(10,47,134,0.10)' },
              }}
            >
              {accion.icon}
              <Typography sx={{ flex: 1, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', color: vigiaColors.textBody }}>
                {accion.label}
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 18, color: vigiaColors.textTertiary }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Actividad reciente */}
      <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>
            {RESUMEN_TAB_COPY.actividadTitle}
          </Typography>
          <Box
            component="button"
            onClick={() => onNavigateTab('actividad')}
            sx={{ background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', '&:hover': { textDecoration: 'underline' } }}
          >
            {RESUMEN_TAB_COPY.verHistorialCompleto}
          </Box>
        </Box>
        <Typography sx={{ p: 2, fontSize: '0.9rem', color: vigiaColors.textSecondary, textAlign: 'center', bgcolor: '#fff', borderRadius: 2, border: '1px dashed #e0e0e0' }}>
          No hay actividad reciente registrada para este vehículo
        </Typography>
      </Box>
    </Box>
  );
};

export default VehiculoResumenTab;
