// src/config/landing.config.ts
// Contenido textual y datos de la Landing Page — fuente: Confluence "Landing Page y Login v2.4" §8
import React from 'react';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

export const LANDING_NAV_LINKS = [
  { label: '¿Qué es?', href: '#problema' },
  { label: 'Funcionamiento', href: '#funcionamiento' },
  { label: 'Roles', href: '#roles' },
  { label: 'Seguridad', href: '#seguridad' },
] as const;

export const LANDING_HERO = {
  badge: 'Sistema activo · Universidad Central del Ecuador',
  titlePrefix: 'Control de Acceso Vehicular ',
  titleHighlight: 'Inteligente',
  subtitle:
    'VIGIA protege el ingreso y salida de vehículos del campus mediante validación biométrica, autorización de conductores y trazabilidad en tiempo real.',
  ctaPrimary: 'Acceder al sistema',
  ctaSecondary: 'Conocer el sistema',
} as const;

export const LANDING_PROBLEMA = {
  eyebrow: 'EL PROBLEMA',
  title: 'No basta con reconocer una placa',
  paragraph: 'VIGIA verifica que la persona que conduce esté autorizada para entrar o salir con ese vehículo.',
  pills: ['Entrada segura', 'Salida protegida', 'Conductor verificado'],
} as const;

export const LANDING_FUNCIONAMIENTO = {
  eyebrow: 'FUNCIONAMIENTO',
  title: 'Cuatro pasos para cada acceso',
  steps: [
    { number: '01', title: 'Detecta', description: 'Identifica el vehículo por su placa al aproximarse al punto de control.' },
    { number: '02', title: 'Valida', description: 'Confirma que el conductor está autorizado mediante verificación biométrica.' },
    { number: '03', title: 'Decide', description: 'Emite una decisión operativa: aprobado, pendiente de revisión o denegado.' },
    { number: '04', title: 'Registra', description: 'Conserva evidencia completa del evento para auditoría institucional.' },
  ],
} as const;

export const LANDING_ROLES = {
  eyebrow: 'ROLES DEL SISTEMA',
  title: 'Diseñado para cada actor',
  cards: [
    {
      icon: 'propietario',
      title: 'Propietarios',
      description: 'Gestione sus vehículos, autorice conductores y supervise accesos relevantes desde un espacio seguro.',
    },
    {
      icon: 'guardia',
      title: 'Guardias',
      description: 'Resuelva eventos en tiempo real desde su punto de control, con evidencia y decisiones trazables.',
    },
    {
      icon: 'admin',
      title: 'Administradores',
      description: 'Administre personas, vehículos, cuentas, auditoría y seguridad institucional del ecosistema.',
    },
  ],
} as const;

export const LANDING_SEGURIDAD = {
  eyebrow: 'TECNOLOGÍA',
  title: 'Innovación al servicio de la seguridad',
  cards: [
    { icon: 'biometric', title: 'Validación biométrica', description: 'Ayuda a confirmar que el conductor esté autorizado.' },
    { icon: 'access', title: 'Control de entrada y salida', description: 'Registra eventos vehiculares en ambos sentidos.' },
    { icon: 'alert', title: 'Alertas operativas', description: 'Informa situaciones que requieren atención.' },
    { icon: 'audit', title: 'Auditoría trazable', description: 'Conserva evidencia de decisiones y acciones.' },
    {
      icon: 'manage',
      title: 'Gestión segura',
      description: 'Separa responsabilidades entre propietarios, guardias y administradores.',
    },
  ],
} as const;

export const LANDING_CONFIANZA = {
  title: 'Seguridad de nivel institucional',
  badges: [
    { icon: 'auth', text: 'Autenticación robusta' },
    { icon: 'trace', text: 'Trazabilidad total' },
    { icon: 'data', text: 'Datos protegidos' },
  ],
  cta: 'Acceder al sistema',
} as const;

export const LANDING_FOOTER = {
  text: 'VIGIA · La inteligencia que protege cada acceso · UCE · 2026',
} as const;

// Helper para renderizar iconos por key (roles, pilares tecnológicos, trust badges)
export const getLandingIcon = (key: string, sx?: object): React.ReactNode => {
  const defaultSx = { fontSize: 28, ...sx };
  switch (key) {
    case 'propietario': return React.createElement(DirectionsCarFilledOutlinedIcon, { sx: defaultSx });
    case 'guardia': return React.createElement(SecurityOutlinedIcon, { sx: defaultSx });
    case 'admin': return React.createElement(AdminPanelSettingsOutlinedIcon, { sx: defaultSx });
    case 'biometric': return React.createElement(FingerprintOutlinedIcon, { sx: defaultSx });
    case 'access': return React.createElement(SyncAltOutlinedIcon, { sx: defaultSx });
    case 'alert': return React.createElement(NotificationsActiveOutlinedIcon, { sx: defaultSx });
    case 'audit': return React.createElement(FactCheckOutlinedIcon, { sx: defaultSx });
    case 'manage': return React.createElement(ManageAccountsOutlinedIcon, { sx: defaultSx });
    case 'auth': return React.createElement(VerifiedUserOutlinedIcon, { sx: defaultSx });
    case 'trace': return React.createElement(HistoryOutlinedIcon, { sx: defaultSx });
    case 'data': return React.createElement(ShieldOutlinedIcon, { sx: defaultSx });
    default: return null;
  }
};
