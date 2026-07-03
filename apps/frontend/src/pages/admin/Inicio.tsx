// src/pages/admin/Inicio.tsx
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { DashboardTemplate } from '../../components/templates';

export const AdminInicioPage: React.FC = () => (
  <DashboardTemplate rol="ADMIN" pageTitle="Panel Administrativo">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 3 }}>
      <AdminPanelSettingsIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h5" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
        Panel Administrativo
      </Typography>
      <Typography variant="body1" sx={{ color: '#6B7280', textAlign: 'center', maxWidth: 500 }}>
        Gestión centralizada del ecosistema VIGIA: usuarios, reportes, configuración del sistema y auditoría.
      </Typography>
      <Card sx={{ mt: 2, backgroundColor: 'rgba(13,92,207,0.04)', border: '1px solid rgba(13,92,207,0.12)', borderRadius: '8px', maxWidth: 500 }}>
        <CardContent>
          <Typography variant="body2" sx={{ color: '#0A2F86' }}>
            <strong>Funcionalidades planificadas:</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }} component="ul">
            <li>Gestión de usuarios y roles</li>
            <li>Reportes de acceso y auditoría</li>
            <li>Configuración de puntos de acceso</li>
            <li>Parámetros del sistema</li>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  </DashboardTemplate>
);

export default AdminInicioPage;
