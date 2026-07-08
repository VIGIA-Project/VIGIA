import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../theme/vigia-theme';
import { VEHICLE_DETAIL_COPY } from '../../config/propietario-vehiculos.config';

const VehicleDetailPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const { placa } = useParams<{ placa: string }>();

  return (
    <DashboardTemplate rol="PROPIETARIO" pageTitle="Detalle de vehículo">
      <Box
        component="button"
        onClick={() => navigate('/propietario/vehiculos')}
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
          fontSize: '0.85rem',
          mb: 3,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        {VEHICLE_DETAIL_COPY.backLabel}
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          borderRadius: vigiaRadius.lg,
          border: '1px solid #E2E8F0',
          boxShadow: vigiaShadows.sm,
        }}
      >
        <ConstructionOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.primary, mb: 2 }} />
        <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.3rem', color: vigiaColors.textHeading, mb: 1 }}>
          {VEHICLE_DETAIL_COPY.title(placa ?? '')}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary }}>
          {VEHICLE_DETAIL_COPY.underConstruction}
        </Typography>
      </Box>
    </DashboardTemplate>
  );
};

export { VehicleDetailPlaceholderPage };
export default VehicleDetailPlaceholderPage;
