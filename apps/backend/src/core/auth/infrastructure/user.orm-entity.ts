import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users', schema: 'auth' })
export class UserOrmEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
    id: string;

    @Column({ nullable: true, type: 'uuid', name: 'persona_id' })
    personaId: string | null;

    @Column({ unique: true, length: 160 })
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({
        type: 'enum',
        enum: ['ADMIN', 'GUARD', 'OWNER'],
        enumName: 'auth_role_enum',
    })
    role: string;

    @Column({
        type: 'enum',
        enum: ['ACTIVE', 'INACTIVE', 'PENDING_PASSWORD_CHANGE'],
        enumName: 'auth_user_status_enum',
        default: 'PENDING_PASSWORD_CHANGE',
    })
    status: string;

    @Column({ name: 'must_change_password', default: true })
    mustChangePassword: boolean;

    @Column({ name: 'last_login_at', nullable: true, type: 'timestamptz' })
    lastLoginAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: 'created_by', nullable: true, type: 'uuid' })
    createdBy: string | null;

    @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
    updatedBy: string | null;
}