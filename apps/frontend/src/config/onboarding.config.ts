// src/config/onboarding.config.ts
// Contenido textual del onboarding obligatorio del PROPIETARIO — registro biométrico propio
import React from 'react';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

export const ONBOARDING_HEADER = {
  title: 'Configuración inicial de cuenta',
} as const;

export const ONBOARDING_STEPPER_LABELS = ['Registro biométrico', 'Registrar vehículo', 'Dashboard completo'] as const;

export const ONBOARDING_PROGRESS_LIST = [
  { icon: 'biometric', title: 'Registro biométrico', subtitle: '3 capturas faciales' },
  { icon: 'vehicle', title: 'Registrar vehículo', subtitle: 'Mínimo 1 vehículo' },
  { icon: 'dashboard', title: 'Dashboard completo', subtitle: 'Acceso total al sistema' },
] as const;

export const ONBOARDING_WHY_MANDATORY = {
  title: '¿Por qué es obligatorio?',
  bullets: [
    'Tu biometría confirma tu identidad en cada acceso vehicular.',
    'Sin registro biométrico el sistema no puede validarte automáticamente.',
    'Los datos se almacenan de forma protegida y solo se usan dentro de VIGIA.',
  ],
} as const;

export const BIOMETRIC_MAIN_COPY = {
  eyebrow: 'PASO 1 DE 3 — OBLIGATORIO',
  title: 'Registro biométrico propio',
  description:
    'Necesitamos capturar 3 imágenes de tu rostro para validarte automáticamente en los puntos de acceso vehicular. Asegúrate de estar en un lugar bien iluminado.',
} as const;

export const CAPTURE_STEPS = [
  {
    key: 'frontal',
    badge: 1,
    title: 'Frontal',
    subtitle: 'Mira directo a la cámara',
    ctaLabel: 'Capturar frontal',
    instructionsTitle: 'Instrucciones para captura frontal',
    instructions: [
      'Ubica tu rostro dentro del óvalo guía',
      'Mira directamente a la cámara',
      'Evita gorra, lentes oscuros o fondo muy oscuro',
      'Asegúrate de tener buena iluminación frontal',
    ],
  },
  {
    key: 'perfil_izquierdo',
    badge: 2,
    title: 'Perfil izquierdo',
    subtitle: 'Gira levemente a la izquierda',
    ctaLabel: 'Capturar perfil izquierdo',
    instructionsTitle: 'Instrucciones para captura de perfil izquierdo',
    instructions: [
      'Gira levemente tu rostro a la izquierda manteniendo los ojos visibles',
      'Mantén el rostro dentro del óvalo guía',
      'Evita gorra, lentes oscuros o fondo muy oscuro',
      'Asegúrate de tener buena iluminación frontal',
    ],
  },
  {
    key: 'perfil_derecho',
    badge: 3,
    title: 'Perfil derecho',
    subtitle: 'Gira levemente a la derecha',
    ctaLabel: 'Capturar perfil derecho',
    instructionsTitle: 'Instrucciones para captura de perfil derecho',
    instructions: [
      'Gira levemente tu rostro a la derecha manteniendo los ojos visibles',
      'Mantén el rostro dentro del óvalo guía',
      'Evita gorra, lentes oscuros o fondo muy oscuro',
      'Asegúrate de tener buena iluminación frontal',
    ],
  },
] as const;

export const CAMERA_STATUS_PILLS = [
  { label: 'Rostro detectado', color: 'green' as const },
  { label: 'Iluminación correcta', color: 'green' as const },
  { label: 'Centra el rostro', color: 'orange' as const },
];

export const QUALITY_MOCK = { value: 85, label: 'Buena' } as const;

export const PRIVACY_NOTE =
  'Tus datos biométricos se almacenan de forma protegida y se usan únicamente para validación de acceso vehicular en VIGIA.';

export const NO_CAMERA_MODAL = {
  title: 'Sin cámara disponible',
  body: 'Sin registro biométrico no podrás acceder al dashboard completo. Puedes completarlo más adelante desde un dispositivo con cámara.',
  confirmLater: 'Entendido, lo haré después',
  cancel: 'Tengo cámara, continuar',
} as const;

export const LOGIN_NOTICE_INCOMPLETE_BIOMETRIA = 'Completa tu registro biométrico para acceder al sistema.';

export const SUCCESS_COPY = {
  title: '¡Registro biométrico completo!',
  subtitle: 'Ya puedes continuar con el registro de tu primer vehículo.',
  cta: 'Continuar al registro de vehículo',
} as const;

// Helper para renderizar iconos por key
export const getOnboardingIcon = (key: string, sx?: object): React.ReactNode => {
  const defaultSx = { fontSize: 22, ...sx };
  switch (key) {
    case 'sparkles': return React.createElement(AutoAwesomeOutlinedIcon, { sx: defaultSx });
    case 'biometric': return React.createElement(FingerprintOutlinedIcon, { sx: defaultSx });
    case 'vehicle': return React.createElement(DirectionsCarFilledOutlinedIcon, { sx: defaultSx });
    case 'dashboard': return React.createElement(DashboardOutlinedIcon, { sx: defaultSx });
    case 'shield': return React.createElement(ShieldOutlinedIcon, { sx: defaultSx });
    case 'camera': return React.createElement(CameraAltOutlinedIcon, { sx: defaultSx });
    default: return null;
  }
};
