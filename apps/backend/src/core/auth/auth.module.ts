import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './application/auth.service';
import { AuthController } from './application/auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { JwtAuthGuard } from './presentation/jwt-auth.guard';
import { RolesGuard } from './presentation/roles.guard';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { USER_REPOSITORY } from './domain/user.repository';
import { SeedService } from '../database/seed.service';
import { RegistryModule } from '../../modules/registry/presentation/registry.module';

@Module({
  imports: [
    RegistryModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInStr = configService.get<string>('JWT_EXPIRATION', '8h');
        const expiresIn = /^\d+$/.test(expiresInStr) ? parseInt(expiresInStr, 10) : expiresInStr;
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    SeedService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}