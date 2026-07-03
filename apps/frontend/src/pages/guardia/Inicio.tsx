// src/pages/guardia/Inicio.tsx
// Placeholder dashboard Guardia — se implementará en EP02
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

export const GuardiaInicioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 100%)',
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
        <SecurityIcon sx={{ fontSize: 64, color: '#0D5CCF', mb: 2 }} />

        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 700,
            color: '#0A2F86',
            mb: 1,
          }}
        >
          Dashboard — Guardia de Seguridad
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
          Funcionalidades: verificación de pases, validación biométrica, registro de accesos.
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

export default GuardiaInicioPage;
