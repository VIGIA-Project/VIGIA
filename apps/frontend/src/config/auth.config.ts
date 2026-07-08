import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

// Configuración centralizada para las pantallas de autenticación
export const AUTH_ROUTES = {
  home: '/',
  login: '/login',
  changePassword: '/cambiar-password',
  onboardingBiometria: '/propietario/onboarding/biometria',
  onboardingVehiculo: '/propietario/onboarding/primer-vehiculo',
} as const;

export const DASHBOARD_ROUTES: Record<string, string> = {
  OWNER: '/propietario/inicio',
  GUARD: '/guardia/inicio',
  ADMIN: '/admin',
};

export const getDashboardByRole = (rol: string): string => {
  return DASHBOARD_ROUTES[rol] || DASHBOARD_ROUTES.OWNER;
};

export const PASSWORD_RULES = [
  { key: 'length', label: 'Mínimo 8 caracteres', test: (v: string) => v.length >= 8 },
  { key: 'uppercase', label: 'Al menos 1 mayúscula', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'number', label: 'Al menos 1 número', test: (v: string) => /[0-9]/.test(v) },
  { key: 'special', label: 'Al menos 1 carácter especial', test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
] as const;

export const AUTH_FEATURES = [
  { icon: 'lock', text: 'Validación biométrica segura' },
  { icon: 'car', text: 'Control de accesos en tiempo real' },
  { icon: 'family', text: 'Gestión de autorizaciones y grupo familiar' },
] as const;

export const AUTH_TRUST_SIGNALS = [
  { icon: 'https', text: 'Conexión segura' },
  { icon: 'shield', text: 'Datos protegidos' },
] as const;

// Helper para renderizar iconos por key
export const getFeatureIcon = (key: string, sx?: object): React.ReactNode => {
  const defaultSx = { fontSize: 22, ...sx };
  switch (key) {
    case 'lock': return React.createElement(LockOutlinedIcon, { sx: defaultSx });
    case 'car': return React.createElement(DirectionsCarOutlinedIcon, { sx: defaultSx });
    case 'family': return React.createElement(FamilyRestroomOutlinedIcon, { sx: defaultSx });
    case 'https': return React.createElement(HttpsOutlinedIcon, { sx: defaultSx });
    case 'shield': return React.createElement(ShieldOutlinedIcon, { sx: defaultSx });
    default: return null;
  }
};
