// src/pages/Login.tsx
// Pantalla de login placeholder — NO implementa autenticación real
// Permite seleccionar un rol para navegar al dashboard correspondiente
// Referencia: VIG-53 — "Crear pantalla o flujo mínimo de login placeholder"

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Imagen del logo completo
import vigiaLogo from '../assets/logo/vigia-full.png';

type RolUsuario = 'PROPIETARIO' | 'GUARDIA' | 'ADMIN';

interface RolOption {
  value: RolUsuario;
  label: string;
  redirectTo: string;
}

const ROLES: RolOption[] = [
  { value: 'PROPIETARIO', label: 'Propietario de Vehículo', redirectTo: '/propietario/inicio' },
  { value: 'GUARDIA', label: 'Guardia de Seguridad', redirectTo: '/guardia/inicio' },
  { value: 'ADMIN', label: 'Administrador Operativo', redirectTo: '/admin/inicio' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<RolUsuario>('PROPIETARIO');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar autenticación real con JWT cuando el backend esté listo
    // Por ahora, redirige según el rol seleccionado
    const selectedRole = ROLES.find((r) => r.value === rol);
    if (selectedRole) {
      localStorage.setItem('vigia_mock_rol', rol);
      navigate(selectedRole.redirectTo);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 50%, #19D6C4 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(10, 47, 134, 0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box
              component="img"
              src={vigiaLogo}
              alt="VIGIA"
              sx={{ width: '70%', maxWidth: 240, height: 'auto' }}
            />
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 700,
              color: '#0A2F86',
              textAlign: 'center',
              mb: 0.5,
            }}
          >
            Iniciar Sesión
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              textAlign: 'center',
              mb: 3,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Ecosistema Inteligente de Seguridad
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <TextField
              label="Correo Institucional"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@uce.edu.ec"
              size="medium"
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="medium"
            />
            <TextField
              select
              label="Rol de Acceso"
              fullWidth
              required
              value={rol}
              onChange={(e) => setRol(e.target.value as RolUsuario)}
              helperText="Seleccione su rol para acceder al dashboard correspondiente"
              size="medium"
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 1,
                py: 1.5,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                background: 'linear-gradient(90deg, #0A2F86 0%, #0D5CCF 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0D5CCF 0%, #0A2F86 100%)',
                },
              }}
            >
              Acceder
            </Button>
          </Box>

          {/* Nota de desarrollo */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3,
              color: '#9CA3AF',
              fontStyle: 'italic',
            }}
          >
            Entorno de desarrollo — Autenticación placeholder
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
