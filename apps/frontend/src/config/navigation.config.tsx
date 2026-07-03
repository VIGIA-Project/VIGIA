import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

export interface NavRoute {
  label: string;
  path: string;
  icon: React.ReactNode;
}

// ══════════════════════════════════════════════════════════════
// NAVEGACIÓN DEL PROPIETARIO
// ══════════════════════════════════════════════════════════════
// REGLAS:
// - El icono de "Pases de Acceso Rápido" es VpnKey (NO QrCode2)
// - El label es "Pases de Acceso Rápido" (NO "Pase Rápido")
// - "Mis Alertas" (NO "Notificaciones")
// - El orden es: Inicio → Vehículos → Permisos → Pases → Alertas
// ══════════════════════════════════════════════════════════════

export const PROPIETARIO_NAV_ROUTES: NavRoute[] = [
  {
    label: 'Inicio',
    path: '/propietario/inicio',
    icon: <DashboardIcon />,
  },
  {
    label: 'Mis Vehículos',
    path: '/propietario/vehiculos',
    icon: <DirectionsCarIcon />,
  },
  {
    label: 'Permisos Temporales',
    path: '/propietario/permisos-temporales',
    icon: <AccessTimeIcon />,
  },
  {
    label: 'Pases de Acceso Rápido',
    path: '/propietario/pases-rapidos',
    icon: <VpnKeyIcon />,
  },
  {
    label: 'Mis Alertas',
    path: '/propietario/alertas',
    icon: <NotificationsOutlinedIcon />,
  },
];

// Constantes del rol (para el sidebar)
export const PROPIETARIO_CONFIG = {
  rol: 'Propietario',
  userInitials: 'AC',
  notificationCount: 2,
} as const;
