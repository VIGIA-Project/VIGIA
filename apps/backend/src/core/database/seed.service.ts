import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserOrmEntity } from '../auth/infrastructure/user.orm-entity';

interface SeedUser {
  email: string;
  password: string;
  role: 'ADMIN' | 'GUARD' | 'OWNER';
  mustChangePassword: boolean;
  biometricRegistered: boolean;
  vehicleRegistered: boolean;
}

// Usuarios de TESTING — bypass completo de onboarding para poder probar
// Authorization sin quedar atascado en /cambiar-password o el onboarding.
const SEED_USERS: SeedUser[] = [
  {
    email: 'admin@uce.edu.ec',
    password: 'Admin123!',
    role: 'ADMIN',
    mustChangePassword: false,
    biometricRegistered: true,
    vehicleRegistered: true,
  },
  {
    email: 'guardia@uce.edu.ec',
    password: 'Guard123!',
    role: 'GUARD',
    mustChangePassword: false,
    biometricRegistered: true,
    vehicleRegistered: true,
  },
  {
    email: 'propietario@uce.edu.ec',
    password: 'Owner123!',
    role: 'OWNER',
    mustChangePassword: false,
    biometricRegistered: true,
    vehicleRegistered: true,
  },
  // Usuario para probar el flujo completo de onboarding (cambio de
  // contraseña → biometría → vehículo → dashboard).
  {
    email: 'nuevo@uce.edu.ec',
    password: 'Nuevo123!',
    role: 'OWNER',
    mustChangePassword: true,
    biometricRegistered: false,
    vehicleRegistered: false,
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      return;
    }

    const existingCount = await this.userRepo.count();
    if (existingCount > 0) {
      return;
    }

    const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);

    for (const seed of SEED_USERS) {
      const alreadyExists = await this.userRepo.findOne({ where: { email: seed.email } });
      if (alreadyExists) continue;

      const passwordHash = await bcrypt.hash(seed.password, rounds);
      const user = this.userRepo.create({
        id: uuidv4(),
        email: seed.email,
        passwordHash,
        role: seed.role,
        status: 'ACTIVE',
        mustChangePassword: seed.mustChangePassword,
        biometricRegistered: seed.biometricRegistered,
        vehicleRegistered: seed.vehicleRegistered,
      });
      await this.userRepo.save(user);
    }

    this.logger.log('🌱 Usuarios de prueba insertados (development)');
  }
}
