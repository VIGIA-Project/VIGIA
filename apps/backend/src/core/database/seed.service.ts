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
}

const SEED_USERS: SeedUser[] = [
  { email: 'admin@uce.edu.ec', password: 'Admin123!', role: 'ADMIN' },
  { email: 'guardia@uce.edu.ec', password: 'Guard123!', role: 'GUARD' },
  { email: 'propietario@uce.edu.ec', password: 'Owner123!', role: 'OWNER' },
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
        mustChangePassword: false,
        biometricRegistered: false,
        vehicleRegistered: false,
      });
      await this.userRepo.save(user);
    }

    this.logger.log('🌱 Usuarios de prueba insertados (development)');
  }
}
