import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repo: Repository<UserOrmEntity>,
    ) {}

    async findById(id: string): Promise<User | null> {
        const orm = await this.repo
            .createQueryBuilder('u')
            .where('u.user_id = :id', { id })
            .getOne();
        return orm ? this.toDomain(orm) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const orm = await this.repo.findOne({ where: { email } });
        return orm ? this.toDomain(orm) : null;
    }

    async save(user: User): Promise<User> {
        const orm = this.repo.create({
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            role: user.role,
            status: user.status,
            mustChangePassword: user.mustChangePassword,
            personaId: user.personaId ?? null,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async update(
        id: string,
        data: Partial<{
            passwordHash: string;
            status: string;
            mustChangePassword: boolean;
        }>,
    ): Promise<User> {
        await this.repo.update(id, data);
        const updated = await this.repo.findOneOrFail({ where: { id } });
        return this.toDomain(updated);
    }

    private toDomain(orm: UserOrmEntity): User {
        return User.create({
            id: orm.id,
            email: orm.email,
            passwordHash: orm.passwordHash,
            role: orm.role as UserRole,
            status: orm.status as UserStatus,
            mustChangePassword: orm.mustChangePassword,
            personaId: orm.personaId ?? undefined,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }
}