import { BiometricType } from '@shared/enums';

/**
 * Entidad de dominio: BiometricProfile
 * Perfil biométrico asociado a un sujeto (persona o vehículo).
 * El vector de embedding se almacena en pgvector.
 */
export class BiometricProfile {
  private constructor(
    public readonly id: string,
    public readonly subjectId: string,
    public readonly type: BiometricType,
    public readonly embedding: number[],  // Vector para pgvector
    public readonly active: boolean,
    public readonly enrolledAt: Date,
    public readonly lastVerifiedAt: Date | undefined,
  ) {}

  static create(props: {
    id: string;
    subjectId: string;
    type: BiometricType;
    embedding: number[];
    active?: boolean;
    enrolledAt?: Date;
  }): BiometricProfile {
    return new BiometricProfile(
      props.id,
      props.subjectId,
      props.type,
      props.embedding,
      props.active ?? true,
      props.enrolledAt ?? new Date(),
      undefined,
    );
  }

  isActive(): boolean {
    return this.active;
  }
}
