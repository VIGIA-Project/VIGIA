import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserOrmEntity } from '../auth/infrastructure/user.orm-entity';
import { PersonaOrmEntity } from '../../modules/registry/infrastructure/repositories/persona.orm-entity';
import { VehiculoOrmEntity } from '../../modules/registry/infrastructure/repositories/vehiculo.orm-entity';

interface SeedVehiculo {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  anio: number;
}

interface SeedUser {
  email: string;
  password: string;
  role: 'ADMIN' | 'GUARD' | 'OWNER';
  mustChangePassword: boolean;
  biometricRegistered: boolean;
  vehicleRegistered: boolean;
  persona: {
    identificacionNumero: string;
    nombres: string;
    apellidos: string;
  };
  vehiculo?: SeedVehiculo;
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
    persona: {
      identificacionNumero: '1700000011',
      nombres: 'Admin',
      apellidos: 'Sistema',
    },
  },
  {
    email: 'guardia@uce.edu.ec',
    password: 'Guard123!',
    role: 'GUARD',
    mustChangePassword: false,
    biometricRegistered: true,
    vehicleRegistered: true,
    persona: {
      identificacionNumero: '1700000022',
      nombres: 'Guardia',
      apellidos: 'Principal',
    },
  },
  {
    email: 'propietario@uce.edu.ec',
    password: 'Owner123!',
    role: 'OWNER',
    mustChangePassword: false,
    biometricRegistered: true,
    vehicleRegistered: true,
    persona: {
      identificacionNumero: '1700000033',
      nombres: 'Propietario',
      apellidos: 'Uno',
    },
    vehiculo: {
      placa: 'PBX1001',
      marca: 'Chevrolet',
      modelo: 'Aveo',
      color: 'Blanco',
      anio: 2020,
    },
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
    persona: {
      identificacionNumero: '1700000044',
      nombres: 'Nuevo',
      apellidos: 'Usuario',
    },
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    @InjectRepository(PersonaOrmEntity)
    private readonly personaRepo: Repository<PersonaOrmEntity>,
    @InjectRepository(VehiculoOrmEntity)
    private readonly vehiculoRepo: Repository<VehiculoOrmEntity>,
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

      const personaId = await this.ensurePersona(seed);

      const passwordHash = await bcrypt.hash(seed.password, rounds);
      const user = this.userRepo.create({
        id: uuidv4(),
        personaId,
        email: seed.email,
        passwordHash,
        role: seed.role,
        status: 'ACTIVE',
        mustChangePassword: seed.mustChangePassword,
        biometricRegistered: seed.biometricRegistered,
        vehicleRegistered: seed.vehicleRegistered,
      });
      await this.userRepo.save(user);

      if (seed.vehiculo) {
        await this.ensureVehiculo(personaId, seed.vehiculo);
      }
    }

    this.logger.log('🌱 Usuarios, personas y vehículo de prueba insertados (development)');
  }

  private async ensurePersona(seed: SeedUser): Promise<string> {
    const existente = await this.personaRepo.findOne({
      where: { identificacionNumero: seed.persona.identificacionNumero },
    });
    if (existente) return existente.personaId;

    const persona = this.personaRepo.create({
      personaId: uuidv4(),
      identificacionTipo: 'CEDULA',
      identificacionNumero: seed.persona.identificacionNumero,
      nombres: seed.persona.nombres,
      apellidos: seed.persona.apellidos,
      correoInstitucional: seed.email,
      estadoRegistro: 'ACTIVO',
    });
    const saved = await this.personaRepo.save(persona);
    return saved.personaId;
  }

  private async ensureVehiculo(propietarioPersonaId: string, vehiculo: SeedVehiculo): Promise<void> {
    const existente = await this.vehiculoRepo.findOne({ where: { placa: vehiculo.placa } });
    if (existente) return;

    const entity = this.vehiculoRepo.create({
      vehiculoId: uuidv4(),
      propietarioPersonaId,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
      anio: vehiculo.anio,
      estadoRegistro: 'ACTIVO',
    });
    await this.vehiculoRepo.save(entity);
  }
}
