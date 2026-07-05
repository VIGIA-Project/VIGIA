import { InvalidValueObjectException } from '@core/exceptions/domain-exception';

export class Placa {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(raw: string): Placa {
        const normalizada = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();

        if (!normalizada || normalizada.length < 4 || normalizada.length > 10) {
            throw new InvalidValueObjectException(
                'Placa',
                raw,
                'Debe tener entre 4 y 10 caracteres alfanuméricos',
            );
        }

        return new Placa(normalizada);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Placa): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}