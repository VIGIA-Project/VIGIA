// Configuración centralizada para las pantallas de autenticación
export const AUTH_ROUTES = {
  home: '/',
  login: '/login',
  changePassword: '/cambiar-password',
} as const;

export const DASHBOARD_ROUTES: Record<string, string> = {
  PROPIETARIO: '/propietario/inicio',
  GUARDIA: '/guardia/inicio',
  ADMIN: '/admin/inicio',
};

export const getDashboardByRole = (rol: string): string => {
  return DASHBOARD_ROUTES[rol] || DASHBOARD_ROUTES.PROPIETARIO;
};

export const PASSWORD_RULES = [
  { key: 'length', label: 'Mínimo 8 caracteres', test: (v: string) => v.length >= 8 },
  { key: 'uppercase', label: 'Al menos 1 mayúscula', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'number', label: 'Al menos 1 número', test: (v: string) => /[0-9]/.test(v) },
  { key: 'special', label: 'Al menos 1 carácter especial', test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
] as const;

export const AUTH_FEATURES = [
  { icon: '🔒', text: 'Validación biométrica segura' },
  { icon: '🚗', text: 'Control de accesos en tiempo real' },
  { icon: '👨‍👩‍👧', text: 'Gestión de autorizaciones y grupo familiar' },
] as const;

export const AUTH_TRUST_SIGNALS = [
  { icon: '🔐', text: 'Conexión segura' },
  { icon: '🛡️', text: 'Datos cifrados E2E' },
] as const;
