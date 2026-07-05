// src/pages/guardia/AlertasGuardia.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { DashboardTemplate } from '../../components/templates';

export const AlertasGuardiaPage: React.FC = () => (
  <DashboardTemplate rol="GUARD" pageTitle="Alertas">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <NotificationsOutlinedIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Alertas del Guardia — Próximamente
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center', maxWidth: 400 }}>
        Alertas de seguridad y eventos críticos en tiempo real.
      </Typography>
    </Box>
  </DashboardTemplate>
);

export default AlertasGuardiaPage;
