// src/pages/admin/Reportes.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { DashboardTemplate } from '../../components/templates';

export const ReportesPage: React.FC = () => (
  <DashboardTemplate rol="ADMIN" pageTitle="Reportes">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <BarChartIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Reportes — Próximamente
      </Typography>
    </Box>
  </DashboardTemplate>
);

export default ReportesPage;
