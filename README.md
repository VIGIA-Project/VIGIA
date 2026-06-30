# 🚨 VIGIA - Sistema de Control de Acceso Vehicular

Sistema modular de control de acceso vehicular construido con **NestJS**, **TypeScript** y **Clean Architecture** con principios de **Domain-Driven Design (DDD)**.

---

## 📐 Arquitectura

### Patrón General

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Controllers, NestJS Modules)               │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                      │
│           (Use Cases, Commands, Queries, DTOs)           │
├─────────────────────────────────────────────────────────┤
│                     Domain Layer                         │
│      (Entities, Value Objects, Domain Services,         │
│       Repository Contracts — SIN dependencias externas)  │
├─────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                     │
│     (TypeORM Repositories, Mappers, Services externos)   │
└─────────────────────────────────────────────────────────┘
```

### Estructura de Directorios

```
src/
├── main.ts                        # Bootstrap con ValidationPipe, filtros, interceptores
├── app.module.ts                  # Módulo raíz
│
├── core/                          # Infraestructura central compartida
│   ├── config/                    # Configuración tipada (app, database)
│   ├── database/                  # TypeORM: módulo, servicio, data-source, migrations/
│   ├── exceptions/                # Filtro global + excepciones de dominio base
│   ├── guards/                    # JwtAuthGuard (esqueleto)
│   └── interceptors/              # ResponseInterceptor, LoggingInterceptor
│
├── shared/                        # Código compartido entre BCs (sin lógica de negocio)
│   ├── constants/                 # Tokens de inyección, límites de negocio
│   ├── dto/                       # PaginationDto, respuestas genéricas
│   ├── enums/                     # Enums de dominio compartidos
│   ├── interfaces/
│   │   └── contracts/             # Contratos entre Bounded Contexts (anti-corruption layer)
│   ├── logger/                    # LoggerModule + VigiaLogger (Winston)
│   └── utils/                     # Utilidades puras (fecha, string)
│
├── modules/                       # Los 5 Bounded Contexts
│   ├── access-control/            # BC: Control de Acceso
│   ├── authorization/             # BC: Autorización
│   ├── registry/                  # BC: Registro de Vehículos y Personas
│   ├── biometric/                 # BC: Biometría (pgvector)
│   └── alerting/                  # BC: Alertas y Notificaciones
│
└── presentation/
    └── health/                    # Health Check endpoints
```

### Bounded Contexts

| BC | Responsabilidad | Entidades clave |
|----|-----------------|-----------------|
| **access-control** | Registro de eventos de entrada/salida en puntos de control | `AccessEvent`, `AccessPoint` |
| **authorization** | Gestión de permisos y reglas de acceso | `Authorization` |
| **registry** | Catálogo de vehículos y personas | `Vehicle`, `Person` |
| **biometric** | Perfiles biométricos y verificación (pgvector) | `BiometricProfile` |
| **alerting** | Emisión y gestión de alertas/notificaciones | `Alert` |

### Comunicación entre BCs

Los BCs **nunca se importan directamente**. Se comunican exclusivamente a través de contratos definidos en `src/shared/interfaces/contracts/`:

```typescript
// ✅ Correcto: usar contrato
import { ALERTING_CONTRACT, IAlertingContract } from '@shared/interfaces/contracts';

// ❌ Incorrecto: importar directamente
import { AlertingModule } from '@modules/alerting/presentation/alerting.module';
```

### Regla de Dependencias (Clean Architecture)

```
Domain ← Application ← Infrastructure
   ↑           ↑              ↑
   └───────────┴──────────────┘
         Presentation (NestJS)
```

El **dominio no depende de nada** externo (ni TypeORM, ni NestJS).

---

## 🛠️ Instalación y Configuración

### Prerequisitos

- Node.js >= 18.x
- PostgreSQL >= 14 con extensión `pgvector`
- npm >= 9.x

### Pasos

```bash
# 1. Clonar e instalar
git clone <repo-url>
cd vigia
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Inicializar base de datos (PostgreSQL debe estar corriendo)
# Crear la BD manualmente:
psql -U postgres -c "CREATE DATABASE vigia_db;"
psql -U vigia_user -d vigia_db -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 4. Ejecutar migraciones
npm run build
npm run migration:run

# 5. Iniciar en desarrollo
npm run start:dev
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start:dev` | Servidor en modo watch (desarrollo) |
| `npm run build` | Compilar TypeScript a `dist/` |
| `npm run start:prod` | Iniciar desde `dist/` (producción) |
| `npm run test` | Tests unitarios |
| `npm run test:e2e` | Tests end-to-end |
| `npm run test:cov` | Cobertura de tests |
| `npm run migration:generate -- src/core/database/migrations/NombreMigracion` | Generar migración |
| `npm run migration:run` | Ejecutar migraciones pendientes |
| `npm run migration:revert` | Revertir última migración |
| `npm run seed` | Poblar datos iniciales |
| `npm run format` | Formatear código (Prettier) |
| `npm run lint` | Lint con ESLint |

---

## 🏥 Health Check Endpoints

Los endpoints de health **no llevan el prefijo** `api/v1`:

| Endpoint | Propósito | Uso típico |
|----------|-----------|------------|
| `GET /health` | Estado completo con todos los checks | Monitoreo general |
| `GET /health/liveness` | ¿Está vivo el proceso? | Kubernetes liveness probe |
| `GET /health/readiness` | ¿Listo para recibir tráfico? | Kubernetes readiness probe |

### Ejemplo de respuesta `/health`

```json
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "0.1.0",
  "checks": {
    "database": { "status": "up", "responseTime": 5 },
    "memory": { "status": "up", "details": { "heapUsedMB": 45, "heapTotalMB": 120 } },
    "uptime": { "status": "up", "details": { "uptimeSeconds": 3600 } }
  }
}
```

---

## 🗄️ Base de Datos

- **Motor**: PostgreSQL + extensión `pgvector` (para embeddings biométricos)
- **ORM**: TypeORM
- **Migraciones**: gestionadas con TypeORM CLI usando `data-source.ts`
- `DB_SYNCHRONIZE=false` siempre en producción

---

## 📡 Alerting

- **MVP**: Notificaciones in-app (`AlertChannel.IN_APP`)
- **Opcional**: Telegram (`TELEGRAM_ENABLED=true` en `.env`)

---

## 🤝 Contribución

1. Cada BC es independiente — no romper contratos de `@shared/interfaces/contracts`
2. El dominio (`domain/`) no debe importar nada de NestJS ni TypeORM
3. Los casos de uso (`application/use-cases/`) solo dependen de interfaces de dominio
4. Toda lógica de base de datos va en `infrastructure/repositories/`
