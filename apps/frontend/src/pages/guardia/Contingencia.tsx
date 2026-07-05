// src/pages/guardia/Contingencia.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { DashboardTemplate } from '../../components/templates';

export const ContingenciaPage: React.FC = () => (
  <DashboardTemplate rol="GUARD" pageTitle="Contingencia">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <ReportProblemIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Modo Contingencia — Próximamente
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center', maxWidth: 400 }}>
        Operación sin conectividad con sincronización posterior.
      </Typography>
    </Box>
  </DashboardTemplate>
);

export default ContingenciaPage;
