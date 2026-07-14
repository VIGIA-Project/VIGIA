import { PerfilBiometrico } from '../../domain/entities/perfil-biometrico.entity';
import { EstadoDisponibilidad } from '../../domain/value-objects/estado-disponibilidad.vo';
import { PerfilBiometricoOrmEntity } from '../entities/perfil-biometrico.orm-entity';

export class PerfilBiometricoMapper {
  static toDomain(orm: PerfilBiometricoOrmEntity): PerfilBiometrico {
    return PerfilBiometrico.crear({
      id: orm.perfilBiometricoId,
      personaId: orm.personaId,
      estadoDisponibilidad: orm.estadoDisponibilidad as EstadoDisponibilidad,
      ultimaActualizacionBiometrica: orm.ultimaActualizacionBiometrica ?? undefined,
      fechaCreacion: orm.createdAt,
      fechaActualizacion: orm.updatedAt,
    });
  }

  static toOrm(domain: PerfilBiometrico): PerfilBiometricoOrmEntity {
    const orm = new PerfilBiometricoOrmEntity();
    orm.perfilBiometricoId = domain.id;
    orm.personaId = domain.personaId;
    orm.estadoDisponibilidad = domain.estadoDisponibilidad;
    orm.ultimaActualizacionBiometrica = domain.ultimaActualizacionBiometrica ?? null;
    return orm;
  }
}
