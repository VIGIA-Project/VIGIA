import { InvalidValueObjectException } from '@core/exceptions/domain-exception';

const MS_POR_DIA = 1000 * 60 * 60 * 24;

/**
 * Value Object inmutable que representa una ventana temporal [inicio, fin].
 * Si necesitas cambiar el rango, crea una nueva instancia con `Vigencia.crear()`.
 */
export class Vigencia {
  private constructor(
    public readonly inicio: Date,
    public readonly fin: Date,
  ) {}

  static crear(inicio: Date, fin: Date): Vigencia {
    if (fin <= inicio) {
      throw new InvalidValueObjectException(
        'Vigencia',
        `${inicio.toISOString()} - ${fin.toISOString()}`,
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }
    return new Vigencia(inicio, fin);
  }

  estaVigente(instante: Date = new Date()): boolean {
    return instante >= this.inicio && instante <= this.fin;
  }

  diasRestantes(desde: Date = new Date()): number {
    const msRestantes = this.fin.getTime() - desde.getTime();
    return Math.max(0, Math.ceil(msRestantes / MS_POR_DIA));
  }

  duracionEnDias(): number {
    return Math.ceil((this.fin.getTime() - this.inicio.getTime()) / MS_POR_DIA);
  }
}
