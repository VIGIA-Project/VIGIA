// src/pages/guardia/Inicio.tsx
// Placeholder — Dashboard del Guardia de Seguridad
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { DashboardTemplate } from '../../components/templates';

export const GuardiaInicioPage: React.FC = () => (
  <DashboardTemplate rol="GUARD" pageTitle="Panel del Guardia">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 3 }}>
      <SecurityIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h5" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
        Dashboard del Guardia
      </Typography>
      <Typography variant="body1" sx={{ color: '#6B7280', textAlign: 'center', maxWidth: 500 }}>
        Aquí se mostrará la cola de eventos en tiempo real, validación de códigos de Pase de Acceso Rápido,
        revisión manual de accesos y gestión de contingencias.
      </Typography>
      <Card sx={{ mt: 2, backgroundColor: 'rgba(13,92,207,0.04)', border: '1px solid rgba(13,92,207,0.12)', borderRadius: '8px', maxWidth: 500 }}>
        <CardContent>
          <Typography variant="body2" sx={{ color: '#0A2F86' }}>
            <strong>Funcionalidades planificadas:</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }} component="ul">
            <li>Cola de eventos de acceso en tiempo real</li>
            <li>Validación de código alfanumérico + cédula del conductor</li>
            <li>Revisión manual de accesos pendientes</li>
            <li>Modo contingencia (sin conectividad)</li>
            <li>Alertas de seguridad</li>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  </DashboardTemplate>
);

export default GuardiaInicioPage;
