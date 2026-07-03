// src/pages/admin/Inicio.tsx
// Placeholder dashboard Admin — se implementará en EP02
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';

export const AdminInicioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A2F86 0%, #19D6C4 100%)',
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: '16px',
          p: 5,
          textAlign: 'center',
          boxShadow: '0 16px 48px rgba(10,47,134,0.25)',
        }}
      >
        <AdminPanelSettingsIcon sx={{ fontSize: 64, color: '#0D5CCF', mb: 2 }} />

        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            color: '#0A2F86',
            mb: 1,
          }}
        >
          Dashboard — Administrador Operativo
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#6B7280', fontFamily: '"Inter", sans-serif', mb: 1 }}
        >
          Este módulo se implementará en EP02.
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: '#9CA3AF',
            fontStyle: 'italic',
            mb: 4,
          }}
        >
          Funcionalidades: gestión de usuarios, vehículos, puntos de acceso y reportes.
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigate('/login')}
          sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}
        >
          Volver al Login
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminInicioPage;
