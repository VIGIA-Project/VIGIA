export enum UserRole {
    ADMIN = 'ADMIN',
    GUARD = 'GUARD',
    OWNER = 'OWNER',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING_PASSWORD_CHANGE = 'PENDING_PASSWORD_CHANGE',
}

export class User {
    private constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly passwordHash: string,
        public readonly role: UserRole,
        public readonly status: UserStatus,
        public readonly mustChangePassword: boolean,
        public readonly personaId: string | undefined,
        public readonly biometricRegistered: boolean,
        public readonly vehicleRegistered: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    static create(props: {
        id: string;
        email: string;
        passwordHash: string;
        role: UserRole;
        status?: UserStatus;
        mustChangePassword?: boolean;
        personaId?: string;
        biometricRegistered?: boolean;
        vehicleRegistered?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): User {
        if (!props.email.endsWith('@uce.edu.ec')) {
            throw new Error('Solo se permiten correos institucionales @uce.edu.ec');
        }
        return new User(
            props.id,
            props.email,
            props.passwordHash,
            props.role,
            props.status ?? UserStatus.PENDING_PASSWORD_CHANGE,
            props.mustChangePassword ?? true,
            props.personaId,
            props.biometricRegistered ?? false,
            props.vehicleRegistered ?? false,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }

    isActive(): boolean {
        return (
            this.status === UserStatus.ACTIVE ||
            this.status === UserStatus.PENDING_PASSWORD_CHANGE
        );
    }

    needsPasswordChange(): boolean {
        return this.mustChangePassword;
    }
}