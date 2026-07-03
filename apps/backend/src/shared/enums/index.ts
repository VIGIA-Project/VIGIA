// ============================================================
// Enums compartidos entre Bounded Contexts
// ============================================================

export enum VehicleType {
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  BUS = 'BUS',
  BICYCLE = 'BICYCLE',
  OTHER = 'OTHER',
}

export enum AccessEventType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  DENIED = 'DENIED',
  FORCED = 'FORCED',
}

export enum AccessStatus {
  GRANTED = 'GRANTED',
  DENIED = 'DENIED',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
}

export enum AuthorizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

export enum BiometricType {
  FACE = 'FACE',
  FINGERPRINT = 'FINGERPRINT',
  IRIS = 'IRIS',
  LICENSE_PLATE = 'LICENSE_PLATE',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  PENDING = 'PENDING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum AlertChannel {
  IN_APP = 'IN_APP',
  TELEGRAM = 'TELEGRAM',
  EMAIL = 'EMAIL',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}
