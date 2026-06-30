/**
 * Entidad de dominio: Person
 */
export class Person {
  private constructor(
    public readonly id: string,
    public readonly documentNumber: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string | undefined,
    public readonly phone: string | undefined,
    public readonly active: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    active?: boolean;
    createdAt?: Date;
  }): Person {
    return new Person(
      props.id,
      props.documentNumber,
      props.firstName,
      props.lastName,
      props.email,
      props.phone,
      props.active ?? true,
      props.createdAt ?? new Date(),
    );
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.active;
  }
}
