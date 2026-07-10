import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../domain/user.entity';
import {
    IUserRepository,
    UserFilters,
    PaginatedUsers,
} from '../domain/user.repository';
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

    async findAll(filters?: UserFilters): Promise<PaginatedUsers> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 20;
        const skip = (page - 1) * limit;

        const qb = this.repo.createQueryBuilder('u');

        if (filters?.role) {
            qb.andWhere('u.role = :role', { role: filters.role });
        }
        if (filters?.status) {
            qb.andWhere('u.status = :status', { status: filters.status });
        }

        qb.orderBy('u.created_at', 'DESC');
        qb.skip(skip).take(limit);

        const [orms, total] = await qb.getManyAndCount();

        return {
            data: orms.map((orm) => this.toDomain(orm)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
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
            biometricRegistered: user.biometricRegistered,
            vehicleRegistered: user.vehicleRegistered,
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
            biometricRegistered: boolean;
            vehicleRegistered: boolean;
            updatedBy: string;
        }>,
    ): Promise<User> {
        const updateData: any = {};
        if (data.passwordHash !== undefined) updateData.passwordHash = data.passwordHash;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.mustChangePassword !== undefined) updateData.mustChangePassword = data.mustChangePassword;
        if (data.biometricRegistered !== undefined) updateData.biometricRegistered = data.biometricRegistered;
        if (data.vehicleRegistered !== undefined) updateData.vehicleRegistered = data.vehicleRegistered;
        if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

        await this.repo
            .createQueryBuilder()
            .update(UserOrmEntity)
            .set(updateData)
            .where('user_id = :id', { id })
            .execute();

        const updated = await this.findById(id);
        if (!updated) throw new Error('Usuario no encontrado después de update');
        return updated;
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
            biometricRegistered: orm.biometricRegistered,
            vehicleRegistered: orm.vehicleRegistered,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }
}