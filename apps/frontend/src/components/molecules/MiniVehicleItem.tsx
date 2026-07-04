import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';

interface MiniVehicleItemProps {
  placa: string;
  marca: string;
  modelo: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'REVOCADO';
  permisosActivos?: number;
  onClick?: () => void;
}

const estadoColors: Record<string, string> = {
  ACTIVO: vigiaColors.success,
  INACTIVO: vigiaColors.textTertiary,
  REVOCADO: vigiaColors.error,
};

export const MiniVehicleItem: React.FC<MiniVehicleItemProps> = ({
  placa,
  marca,
  modelo,
  estado,
  permisosActivos = 0,
  onClick,
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 1.5,
      borderRadius: vigiaRadius.sm,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background-color 0.2s ease',
      '&:hover': onClick ? { backgroundColor: 'rgba(13, 92, 207, 0.03)' } : {},
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography
        sx={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 700,
          fontSize: '0.9rem',
          color: vigiaColors.textHeading,
          backgroundColor: 'rgba(13, 92, 207, 0.06)',
          px: 1,
          py: 0.25,
          borderRadius: '4px',
        }}
      >
        {placa}
      </Typography>
      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary }}>
        {marca} {modelo}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {permisosActivos > 0 && (
        <Chip label={`${permisosActivos} perm.`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
      )}
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: estadoColors[estado] }} />
    </Box>
  </Box>
);

export default MiniVehicleItem;
