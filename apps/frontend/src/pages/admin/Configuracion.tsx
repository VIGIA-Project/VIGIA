// src/pages/admin/Configuracion.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { DashboardTemplate } from '../../components/templates';

export const ConfiguracionPage: React.FC = () => (
  <DashboardTemplate rol="ADMIN" pageTitle="Configuración">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <SettingsIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Configuración del Sistema — Próximamente
      </Typography>
    </Box>
  </DashboardTemplate>
);

export default ConfiguracionPage;
