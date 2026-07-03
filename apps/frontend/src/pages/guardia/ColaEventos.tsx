// src/pages/guardia/ColaEventos.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import QueueIcon from '@mui/icons-material/Queue';
import { DashboardTemplate } from '../../components/templates';

export const ColaEventosPage: React.FC = () => (
  <DashboardTemplate rol="GUARDIA" pageTitle="Cola de Eventos">
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <QueueIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
      <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}>
        Cola de Eventos — Próximamente
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center', maxWidth: 400 }}>
        Eventos de acceso vehicular en tiempo real vía WebSocket.
      </Typography>
    </Box>
  </DashboardTemplate>
);

export default ColaEventosPage;
