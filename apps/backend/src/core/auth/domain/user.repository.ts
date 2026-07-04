import { User } from './user.entity';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    update(
        id: string,
        data: Partial<{
            passwordHash: string;
            status: string;
            mustChangePassword: boolean;
        }>,
    ): Promise<User>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';