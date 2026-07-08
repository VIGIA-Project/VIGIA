// src/components/molecules/VehicleCard.tsx
import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { PropietarioVehiculo, VEHICLE_CARD_COPY } from '../../config/propietario-vehiculos.config';

export interface VehicleCardProps {
  vehiculo: PropietarioVehiculo;
  onViewDetail: (id: string) => void;
  onCreatePermiso: (id: string) => void;
}

const ESTADO_STYLES = {
  ACTIVO: { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0', borderLeft: '#16A34A' },
  INACTIVO: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', borderLeft: '#94A3B8' },
} as const;

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehiculo, onViewDetail, onCreatePermiso }) => {
  const isActivo = vehiculo.estado === 'ACTIVO';
  const styles = ESTADO_STYLES[vehiculo.estado];

  return (
    <Box
      onClick={() => onViewDetail(vehiculo.placa)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onViewDetail(vehiculo.placa);
      }}
      sx={{
        borderRadius: vigiaRadius.lg,
        border: '1px solid #E2E8F0',
        borderLeft: `4px solid ${styles.borderLeft}`,
        boxShadow: '0 1px 3px rgba(10,47,134,0.06)',
        backgroundColor: vigiaColors.bgCard,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 18px rgba(10,47,134,0.14)',
        },
        '&:focus-visible': {
          outline: `2px solid ${vigiaColors.greenIA}`,
          outlineOffset: '2px',
        },
      }}
    >
      <Box sx={{ p: 2.5, flex: 1 }}>
        {/* Header: placa + badge + ícono decorativo */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                fontFamily: '"Exo 2", sans-serif',
                fontWeight: 700,
                fontSize: '1.375rem',
                color: '#0F172A',
                letterSpacing: '0.5px',
              }}
            >
              {vehiculo.placa}
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: vigiaRadius.full,
                backgroundColor: styles.bg,
                color: styles.color,
                border: `1px solid ${styles.border}`,
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {isActivo ? 'Activo' : 'Inactivo'}
            </Box>
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 24, color: vigiaColors.primary }} />
          </Box>
        </Box>

        {/* Body */}
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#64748B' }}>
          {vehiculo.marca} {vehiculo.modelo} · {vehiculo.anio}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#94A3B8', mt: 0.25 }}>
          {vehiculo.color} · {vehiculo.tipo}
        </Typography>

        <Box sx={{ borderTop: '1px solid #F1F5F9', my: 1.5 }} />

        {/* Indicadores inline */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ShieldOutlinedIcon sx={{ fontSize: 16, color: vehiculo.permisosActivos > 0 ? vigiaColors.greenIA : vigiaColors.textTertiary }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B' }}>
              {VEHICLE_CARD_COPY.permisosSuffix(vehiculo.permisosActivos)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 16, color: vehiculo.alertas > 0 ? '#F2994A' : vigiaColors.textTertiary }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B' }}>
              {VEHICLE_CARD_COPY.alertasSuffix(vehiculo.alertas)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GroupOutlinedIcon sx={{ fontSize: 16, color: vehiculo.personasAsignadas > 0 ? vigiaColors.primary : vigiaColors.textTertiary }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B' }}>
              {VEHICLE_CARD_COPY.personasLabel(vehiculo.personasAsignadas)}
            </Typography>
            {vehiculo.personasSinBiometria > 0 && (
              <Tooltip title={VEHICLE_CARD_COPY.personasSinBiometriaTooltip(vehiculo.personasSinBiometria)}>
                <WarningRoundedIcon sx={{ fontSize: 14, color: '#EDB200' }} />
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid #F1F5F9',
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(vehiculo.placa);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: vigiaColors.primary,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: '0.8125rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {VEHICLE_CARD_COPY.viewDetail}
          <ArrowForwardIcon sx={{ fontSize: 15 }} />
        </Box>

        {isActivo ? (
          <Box
            component="button"
            onClick={(e) => {
              e.stopPropagation();
              onCreatePermiso(vehiculo.placa);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: vigiaColors.greenIA,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: '0.8125rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 15 }} />
            {VEHICLE_CARD_COPY.createPermiso}
          </Box>
        ) : (
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textTertiary }}>
            {VEHICLE_CARD_COPY.notAvailable}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VehicleCard;
