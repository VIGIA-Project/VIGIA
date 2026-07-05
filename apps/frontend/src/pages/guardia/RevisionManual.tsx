// src/pages/guardia/RevisionManual.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { DashboardTemplate } from '../../components/templates';

export const RevisionManualPage: React.FC = () => (
  <DashboardTemplate rol="GUARD" pageTitle="Revisión Manual">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <FactCheckIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Revisión Manual — Próximamente
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center', maxWidth: 400 }}>
        Validación manual de accesos: digitación de código alfanumérico + verificación de cédula.
      </Typography>
    </Box>
  </DashboardTemplate>
);

export default RevisionManualPage;
