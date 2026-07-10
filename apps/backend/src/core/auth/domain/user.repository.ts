import { User, UserRole, UserStatus } from './user.entity';

export interface UserFilters {
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
}

export interface PaginatedUsers {
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(filters?: UserFilters): Promise<PaginatedUsers>;
    save(user: User): Promise<User>;
    update(
        id: string,
        data: Partial<{
            passwordHash: string;
            status: string;
            mustChangePassword: boolean;
            biometricRegistered: boolean;
            vehicleRegistered: boolean;
            updatedBy: string;
        }>,
    ): Promise<User>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';