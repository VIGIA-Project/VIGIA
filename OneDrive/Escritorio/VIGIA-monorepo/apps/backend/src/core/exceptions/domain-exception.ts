/**
 * Clase base para excepciones de dominio.
 * Las excepciones de dominio no dependen de ningún framework.
 */
export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly statusCode = 404;

  constructor(entity: string, identifier: string | number) {
    super(`${entity} con identificador '${identifier}' no encontrado`, {
      entity,
      identifier,
    });
  }
}

export class EntityAlreadyExistsException extends DomainException {
  readonly code = 'ENTITY_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor(entity: string, identifier: string | number) {
    super(`${entity} con identificador '${identifier}' ya existe`, {
      entity,
      identifier,
    });
  }
}

export class InvalidValueObjectException extends DomainException {
  readonly code = 'INVALID_VALUE_OBJECT';
  readonly statusCode = 422;

  constructor(valueObject: string, value: unknown, reason?: string) {
    super(
      `Valor inválido para ${valueObject}: ${String(value)}${reason ? ` - ${reason}` : ''}`,
      { valueObject, value, reason },
    );
  }
}

export class AccessDeniedException extends DomainException {
  readonly code = 'ACCESS_DENIED';
  readonly statusCode = 403;

  constructor(resource: string, action: string) {
    super(`Acceso denegado: no se puede realizar '${action}' en '${resource}'`, {
      resource,
      action,
    });
  }
}

export class BusinessRuleViolationException extends DomainException {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  readonly statusCode = 422;

  constructor(rule: string, details?: string) {
    super(
      `Violación de regla de negocio: ${rule}${details ? ` - ${details}` : ''}`,
      { rule, details },
    );
  }
}
