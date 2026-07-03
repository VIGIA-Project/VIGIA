import { InvalidValueObjectException } from '@core/exceptions/domain-exception';

/**
 * Value Object: LicensePlate
 * Representa una matrícula vehicular validada y normalizada.
 */
export class LicensePlate {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): LicensePlate {
    const normalized = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!LicensePlate.isValid(normalized)) {
      throw new InvalidValueObjectException('LicensePlate', raw, 'Formato inválido');
    }
    return new LicensePlate(normalized);
  }

  private static isValid(plate: string): boolean {
    // Patrón base: 3 letras + 3 números (Colombia) o variantes
    return /^[A-Z]{2,4}[0-9]{2,4}$/.test(plate) || plate.length >= 5;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: LicensePlate): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
