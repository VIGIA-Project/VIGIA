// src/config/navigation.config.tsx
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import QueueIcon from '@mui/icons-material/Queue';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

export interface NavRoute {
  label: string;
  path: string;
  icon: React.ReactNode;
}

// ══════════════════════════════════════════════════════════════
// NAVEGACIÓN DEL OWNER
// ══════════════════════════════════════════════════════════════
// REGLAS:
// - El icono de "Pases de Acceso Rápido" es VpnKey (NO QrCode2)
// - El label es "Pases de Acceso Rápido" (NO "Pase Rápido")
// - "Mis Alertas" (NO "Notificaciones")
// - El orden es: Inicio → Vehículos → Personas → Permisos → Pases → Alertas
// ══════════════════════════════════════════════════════════════

export const OWNER_NAV_ROUTES: NavRoute[] = [
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
    label: 'Personas Autorizadas',
    path: '/propietario/personas',
    icon: <GroupOutlinedIcon />,
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

export const OWNER_CONFIG = {
  rol: 'Propietario',
  userInitials: 'AC',
  notificationCount: 2,
} as const;

// ══════════════════════════════════════════════════════════════
// NAVEGACIÓN DEL GUARD DE SEGURIDAD
// ══════════════════════════════════════════════════════════════

export const GUARD_NAV_ROUTES: NavRoute[] = [
  {
    label: 'Inicio',
    path: '/guardia/inicio',
    icon: <DashboardIcon />,
  },
  {
    label: 'Cola de Eventos',
    path: '/guardia/cola-eventos',
    icon: <QueueIcon />,
  },
  {
    label: 'Revisión Manual',
    path: '/guardia/revision-manual',
    icon: <FactCheckIcon />,
  },
  {
    label: 'Contingencia',
    path: '/guardia/contingencia',
    icon: <ReportProblemIcon />,
  },
  {
    label: 'Alertas',
    path: '/guardia/alertas',
    icon: <NotificationsOutlinedIcon />,
  },
];

export const GUARD_CONFIG = {
  rol: 'Guardia',
  userInitials: 'GS',
  notificationCount: 0,
} as const;

// ══════════════════════════════════════════════════════════════
// NAVEGACIÓN DEL ADMINISTRADOR OPERATIVO
// ══════════════════════════════════════════════════════════════

export const ADMIN_NAV_ROUTES: NavRoute[] = [
  {
    label: 'Dashboard',
    path: '/admin/inicio',
    icon: <DashboardIcon />,
  },
  {
    label: 'Gestión de Usuarios',
    path: '/admin/usuarios',
    icon: <PeopleIcon />,
  },
  {
    label: 'Reportes',
    path: '/admin/reportes',
    icon: <BarChartIcon />,
  },
  {
    label: 'Configuración',
    path: '/admin/configuracion',
    icon: <SettingsIcon />,
  },
];

export const ADMIN_CONFIG = {
  rol: 'Administrador',
  userInitials: 'AD',
  notificationCount: 0,
} as const;

// Íconos no usados en rutas pero disponibles para referencia futura
export { SecurityIcon, AdminPanelSettingsIcon };
