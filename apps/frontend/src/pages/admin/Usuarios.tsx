// src/pages/admin/Usuarios.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { DashboardTemplate } from '../../components/templates';

export const UsuariosPage: React.FC = () => (
  <DashboardTemplate rol="ADMIN" pageTitle="Gestión de Usuarios">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <PeopleIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Gestión de Usuarios — Próximamente
      </Typography>
    </Box>
  </DashboardTemplate>
);

export default UsuariosPage;
