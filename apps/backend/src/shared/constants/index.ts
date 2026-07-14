// ============================================================
// Constantes compartidas de VIGIA
// ============================================================

export * from './injection-tokens';

export const VIGIA_CONSTANTS = {
  // Paginación por defecto
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Tokens de inyección
  TOKENS: {
    // Repositorios - Access Control
    ACCESS_EVENT_REPOSITORY: 'ACCESS_EVENT_REPOSITORY',
    ACCESS_POINT_REPOSITORY: 'ACCESS_POINT_REPOSITORY',

    // Repositorios - Authorization
    AUTHORIZATION_REPOSITORY: 'AUTHORIZATION_REPOSITORY',
    PERMISSION_REPOSITORY: 'PERMISSION_REPOSITORY',

    // Repositorios - Registry
    VEHICLE_REPOSITORY: 'VEHICLE_REPOSITORY',
    PERSON_REPOSITORY: 'PERSON_REPOSITORY',

    // Repositorios - Biometric
    BIOMETRIC_PROFILE_REPOSITORY: 'BIOMETRIC_PROFILE_REPOSITORY',

    // Repositorios - Alerting
    ALERT_REPOSITORY: 'ALERT_REPOSITORY',
    NOTIFICATION_REPOSITORY: 'NOTIFICATION_REPOSITORY',
  },

  // Límites de negocio
  BUSINESS: {
    MAX_FAILED_ACCESS_ATTEMPTS: 3,
    ALERT_RETENTION_DAYS: 30,
    BIOMETRIC_MATCH_THRESHOLD: 0.85,
    MAX_ACTIVE_AUTHORIZATIONS_PER_VEHICLE: 5,
  },
} as const;
