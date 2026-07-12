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
  {
    email: 'nuevo@uce.edu.ec',
    password: 'Nuevo123!',
    role: 'OWNER',
    mustChangePassword: true,
    biometricRegistered: false,
    vehicleRegistered: false,
  },
  {
    email: 'propietario2@uce.edu.ec',
    password: 'Owner123!',
    role: 'OWNER',
    mustChangePassword: false,
    biometricRegistered: true,
    vehicleRegistered: true,
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
    if (this.configService.get<string>('NODE_ENV') !== 'development' && this.configService.get<string>('VIGIA_SEED_DEMO') !== 'true') {
      return;
    }

    const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);

    for (let i = 0; i < SEED_USERS.length; i++) {
      const seed = SEED_USERS[i];
      
      const resPersona = await this.userRepo.manager.query(
        `SELECT persona_id FROM registry.personas WHERE correo_institucional = $1`,
        [seed.email]
      );
      
      let actualPersonaId = resPersona.length > 0 ? resPersona[0].persona_id : null;
      
      if (!actualPersonaId) {
         actualPersonaId = uuidv4();
         const cedula = `1799999${i.toString().padStart(3, '0')}`;
         await this.userRepo.manager.query(`
           INSERT INTO registry.personas (persona_id, identificacion_tipo, identificacion_numero, nombres, apellidos, correo_institucional, estado_registro)
           VALUES ($1, 'CEDULA', $2, 'Seed', $3, $4, 'ACTIVO')
           ON CONFLICT (identificacion_tipo, identificacion_numero) DO NOTHING
         `, [actualPersonaId, cedula, seed.role, seed.email]);
         
         // In case it conflicted but we didn't find it by email (shouldn't happen)
         const checkAgain = await this.userRepo.manager.query(
           `SELECT persona_id FROM registry.personas WHERE correo_institucional = $1`,
           [seed.email]
         );
         if (checkAgain.length > 0) {
             actualPersonaId = checkAgain[0].persona_id;
         }
      }

      const alreadyExists = await this.userRepo.findOne({ where: { email: seed.email } });
      const passwordHash = await bcrypt.hash(seed.password, rounds);
      
      if (alreadyExists) {
        await this.userRepo.update({ id: alreadyExists.id }, {
          passwordHash,
          role: seed.role,
          mustChangePassword: seed.mustChangePassword,
          biometricRegistered: seed.biometricRegistered,
          vehicleRegistered: seed.vehicleRegistered,
          personaId: actualPersonaId,
        });
        continue;
      }

      const user = this.userRepo.create({
        id: uuidv4(),
        email: seed.email,
        passwordHash,
        role: seed.role,
        status: 'ACTIVE',
        mustChangePassword: seed.mustChangePassword,
        biometricRegistered: seed.biometricRegistered,
        vehicleRegistered: seed.vehicleRegistered,
        personaId: actualPersonaId,
      });
      await this.userRepo.save(user);
    }

    this.logger.log('🌱 Usuarios de prueba insertados (development)');
  }
}
