import { Module } from '@nestjs/common';

/**
 * Módulo del Bounded Context: BiometricModule
 *
 * Capas:
 *   - domain/          → Entidades, Value Objects, contratos de repositorio, servicios de dominio
 *   - application/     → Use Cases, Commands, Queries, DTOs de aplicación
 *   - infrastructure/  → Implementaciones de repositorios, mappers, servicios externos
 *   - presentation/    → Este módulo NestJS + controladores HTTP
 *
 * Comunicación entre BCs: exclusivamente por contratos de @shared/interfaces/contracts
 */
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class BiometricModule {}
