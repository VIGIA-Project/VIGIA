# 🚨 VIGIA — Backend

API REST construida con **NestJS 10**, **TypeORM 0.3** y **PostgreSQL**, siguiendo **Clean Architecture** con principios de **Domain-Driven Design (DDD)**.

> Para instrucciones de arranque rápido del monorepo completo (frontend + backend + DB), ver el [README de la raíz](../../README.md). Este documento cubre el detalle interno del backend.

---

## 📐 Arquitectura

### Capas (por Bounded Context)

```
┌─────────────────────────────────────────────────────────┐
│  presentation/     Controllers, DTOs de entrada, Módulo   │
├─────────────────────────────────────────────────────────┤
│  application/       Casos de uso / Services                │
├─────────────────────────────────────────────────────────┤
│  domain/            Entidades de dominio, interfaces de     │
│                      repositorio — SIN dependencias externas│
├─────────────────────────────────────────────────────────┤
│  infrastructure/     Repositorios TypeORM, *.orm-entity.ts  │
└─────────────────────────────────────────────────────────┘
```

Regla de dependencias: `domain` no importa nada de NestJS ni de TypeORM. `application` solo depende de interfaces de `domain`. Todo acceso a base de datos vive en `infrastructure/repositories/`.

### Estructura real de directorios

```
src/
├── main.ts                        # Bootstrap: prefijo global, ValidationPipe, CORS, interceptores
├── app.module.ts                  # Módulo raíz — importa config, DB, auth, health y los 5 BCs
│
├── core/
│   ├── auth/                      # Módulo de autenticación (NO es un Bounded Context de negocio)
│   │   ├── application/           # AuthController, AuthService
│   │   ├── domain/                # User entity, roles, UserRepository (interfaz)
│   │   ├── infrastructure/        # UserOrmEntity, TypeOrmUserRepository
│   │   └── presentation/          # JwtAuthGuard, RolesGuard, decoradores @Roles/@Public
│   ├── config/                    # app.config.ts, database.config.ts, env.validation.ts (Joi)
│   ├── database/
│   │   ├── database.module.ts     # TypeORM.forRootAsync + ensureSchemas()
│   │   ├── database.service.ts
│   │   ├── init-schemas.ts        # Crea schemas "auth" y "registry" + extensión uuid-ossp
│   │   ├── seed.service.ts        # Inserta usuarios de prueba en NODE_ENV=development
│   │   ├── migrations/            # Migraciones TypeORM (uso opcional, ver más abajo)
│   │   └── seeds/                 # Script de seed manual alternativo (pnpm run seed)
│   ├── decorators/                # Decoradores compartidos
│   ├── exceptions/                # AllExceptionsFilter + DomainException base
│   ├── guards/                    # JwtAuthGuard genérico
│   └── interceptors/               # ResponseInterceptor, LoggingInterceptor
│
├── shared/                        # Código compartido ENTRE Bounded Contexts, sin lógica de negocio
│   ├── constants/                 # Tokens de inyección (ej. USER_REPOSITORY), límites de negocio
│   ├── dto/                       # PaginationDto y respuestas genéricas
│   ├── enums/                     # Enums de dominio compartidos
│   ├── interfaces/contracts/      # Contratos entre BCs (anti-corruption layer, ver abajo)
│   ├── logger/                    # LoggerModule + VigiaLogger (Winston)
│   └── utils/                     # Utilidades puras (fecha, string)
│
├── modules/                       # Los 5 Bounded Contexts de negocio
│   ├── registry/                  # ✅ Implementado — Personas, Vehículos, Asignaciones de rol
│   ├── authorization/              # 🚧 Scaffolded — permisos permanentes/temporales, pases rápidos
│   ├── biometric/                  # 🚧 Scaffolded — perfiles biométricos (pgvector futuro)
│   ├── access-control/             # 🚧 Scaffolded — eventos de entrada/salida
│   └── alerting/                   # 🚧 Scaffolded — alertas y notificaciones
│
└── presentation/
    └── health/                    # Health checks (Terminus)
```

Cada módulo de `modules/` sigue la misma subestructura `application/ domain/ infrastructure/ presentation/`. Los que están **🚧 Scaffolded** ya tienen su módulo NestJS registrado en `app.module.ts` y (en algunos casos) entidades de dominio/infraestructura, pero **todavía no exponen un `*.controller.ts`** — no hay endpoint HTTP que golpear. El frontend cubre esas features con mocks hasta que se implementen.

### Bounded Contexts

| BC | Estado | Responsabilidad | Entidades |
|----|:---:|-----------------|-----------|
| `registry` | ✅ | Catálogo de vehículos, personas y su asignación de rol (dueño/familiar/etc.) | `Persona`, `Vehiculo`, `AsignacionRol` |
| `authorization` | 🚧 | Permisos permanentes, temporales y pases rápidos | — |
| `biometric` | 🚧 | Perfiles biométricos y verificación (pgvector, futuro) | — |
| `access_control` | 🚧 | Eventos de entrada/salida en puntos de control | — |
| `alerting` | 🚧 | Emisión y gestión de alertas/notificaciones | — |

`core/auth` no es un Bounded Context de dominio — es infraestructura transversal de autenticación (usuarios, roles, JWT), por eso vive en `core/` y no en `modules/`.

### Comunicación entre Bounded Contexts

Los BCs **nunca se importan directamente entre sí**. Se comunican exclusivamente a través de contratos definidos en `src/shared/interfaces/contracts/` (uno por BC: `registry.contract.ts`, `authorization.contract.ts`, `biometric.contract.ts`, `access-control.contract.ts`, `alerting.contract.ts`):

```typescript
// ✅ Correcto: usar el contrato
import { IAlertingContract } from '@shared/interfaces/contracts';

// ❌ Incorrecto: importar el módulo de otro BC directamente
import { AlertingModule } from '@modules/alerting/presentation/alerting.module';
```

### Regla de entidades y TypeORM

- **Nunca** usar glob patterns en `entities` de la configuración TypeORM (rompe con el modo strip-only de Node 22) — siempre `autoLoadEntities: true` (ya configurado en `database.module.ts`).
- Los enums de TypeScript en entidades son válidos siempre que se carguen vía `autoLoadEntities` (no vía glob).
- Cada entidad pertenece a un único schema: `@Entity({ schema: 'registry' })`, etc.

---

## 🛠️ Instalación y arranque

### Prerequisitos

- Node.js **22.x**
- pnpm **11.x**
- PostgreSQL 16/17 corriendo (local o vía `docker-compose up -d postgres` desde la raíz)

### Setup

```bash
# Desde la raíz del monorepo
pnpm install

# Configurar variables de entorno del backend
cp apps/backend/.env.example apps/backend/.env
# Ajustar credenciales si no usas Postgres local con postgres/admin

# Crear la base de datos (vacía, sin schemas — el backend los crea al arrancar)
psql -U postgres -c "CREATE DATABASE vigia_db;"

# Arrancar en modo watch
pnpm --filter @vigia/backend run start:dev
```

Al arrancar, el backend automáticamente:
1. Crea los schemas `auth` y `registry` si no existen, más la extensión `uuid-ossp` (`ensureSchemas`, ver `core/database/init-schemas.ts`).
2. Sincroniza las tablas desde las entidades TypeORM si `DB_SYNCHRONIZE=true` — **no hace falta correr migraciones en desarrollo**.
3. Inserta los 3 usuarios de prueba (`admin@uce.edu.ec`, `guardia@uce.edu.ec`, `propietario@uce.edu.ec`) si `NODE_ENV=development` y la tabla `auth.users` está vacía (`SeedService.onModuleInit`).

### Migraciones (opcional — solo si `DB_SYNCHRONIZE=false`)

Existen dos migraciones ya generadas en `src/core/database/migrations/` (`InitialSchema`, `RegistryVIG75`) pensadas para producción, donde no se quiere depender de `synchronize`:

```bash
pnpm --filter @vigia/backend run build
pnpm --filter @vigia/backend run migration:run
pnpm --filter @vigia/backend run migration:generate -- src/core/database/migrations/NombreMigracion
pnpm --filter @vigia/backend run migration:revert
```

### Seed manual (alternativa al `SeedService` automático)

```bash
pnpm --filter @vigia/backend run seed
```

Ejecuta `src/core/database/seeds/run-seed.ts` directamente con `ts-node`. Útil si necesitas re-sembrar datos sin reiniciar el proceso Nest.

---

## 🔧 Variables de entorno

Validadas al arrancar con Joi (`src/core/config/env.validation.ts`) — si falta una variable **requerida**, el proceso no levanta.

| Variable | Requerida | Default | Descripción |
|----------|:---:|---------|-------------|
| `DB_HOST` | ✅ | — | Host de PostgreSQL |
| `DB_PORT` | ✅ | `5432` | Puerto |
| `DB_USERNAME` | ✅ | — | Usuario de la BD |
| `DB_PASSWORD` | ✅ | — | Password de la BD |
| `DB_NAME` | ✅ | — | Nombre de la base de datos |
| `DB_SYNCHRONIZE` | — | `false` | `true` en dev — TypeORM crea/actualiza tablas desde las entidades |
| `DB_LOGGING` | — | `false` | Loguea las queries SQL ejecutadas |
| `JWT_SECRET` | ✅ | — | Secreto de firma de los JWT |
| `JWT_EXPIRATION` | — | `1d` | Expiración del access token |
| `BCRYPT_ROUNDS` | — | `10` | Rondas de hashing de contraseñas |
| `NODE_ENV` | — | `development` | `development` habilita `SeedService` |
| `APP_PORT` | — | `3000` | Puerto HTTP |

`envFilePath` en `app.module.ts` solo resuelve `.env`/`.env.local` **dentro de `apps/backend/`** — nunca lee el `.env` de la raíz del repo (ese es solo para `docker-compose.yml`).

---

## 📜 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `start:dev` | Servidor en modo watch (Webpack + `nest start --watch`) |
| `build` | Compila con `nest build` → `dist/` |
| `start:prod` | Inicia desde `dist/main.js` |
| `test` / `test:watch` / `test:cov` | Tests unitarios (Jest) |
| `test:e2e` | Tests end-to-end |
| `migration:generate` / `migration:run` / `migration:revert` | Gestión de migraciones TypeORM |
| `seed` | Ejecuta el script de seed manual |
| `format` | Prettier sobre `src/` y `test/` |
| `lint` | ESLint con `--fix` |

---

## 🌐 API

### Prefijo y versión

- Prefijo global: **`api/v1`** (`app.setGlobalPrefix`), excepto los endpoints de `health`.
- Versionado por URI habilitado (`VersioningType.URI`) — preparado para futuras versiones, no usado activamente aún.
- CORS habilitado según `CORS_ORIGIN` (default `*`; en desarrollo del monorepo se espera `http://localhost:5173`).
- `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted` y `transform` activados — cualquier propiedad no declarada en el DTO es rechazada.
- Respuestas envueltas por `ResponseInterceptor` y logueadas por `LoggingInterceptor`; errores centralizados en `AllExceptionsFilter`.

### Endpoints implementados hoy

#### `auth` (`/api/v1/auth`)

| Método | Ruta | Rol requerido | Descripción |
|--------|------|----------------|-------------|
| `POST` | `/auth/login` | público | Login. Solo acepta emails `@uce.edu.ec`. |
| `POST` | `/auth/change-password` | autenticado | Cambia la contraseña del usuario actual |
| `POST` | `/auth/users` | ADMIN | Crea un usuario |
| `GET` | `/auth/users` | ADMIN | Lista usuarios (paginado, filtros por rol/estado) |
| `GET` | `/auth/users/:id` | ADMIN | Detalle de usuario |
| `PATCH` | `/auth/users/:id/activate` | ADMIN | Activa un usuario |
| `PATCH` | `/auth/users/:id/deactivate` | ADMIN | Desactiva un usuario |
| `PATCH` | `/auth/users/:id/reset-password` | ADMIN | Genera contraseña temporal |

**Respuesta de `POST /auth/login`** (nota: hoy es un objeto plano, no anida `user`):

```json
{
  "access_token": "eyJhbGciOi...",
  "must_change_password": false,
  "role": "OWNER"
}
```

> ⚠️ **Gap conocido:** esta respuesta **no incluye** `email`, `biometric_registered` ni `vehicle_registered`. El frontend rellena `email` con el valor tipeado en el formulario de login y asume `biometric_registered`/`vehicle_registered` en `false` si el backend no los envía — por eso el onboarding se vuelve a pedir después de cada login. Si implementas estos flags en el backend, actualiza `LoginResult` en `auth.service.ts` y el consumo en `apps/frontend/src/pages/auth/Login.tsx`.

Roles válidos: `ADMIN`, `GUARD`, `OWNER` (valores exactos en BD y payload JWT). `isActive()` en la entidad `User` acepta `ACTIVE` y `PENDING_PASSWORD_CHANGE`; solo `INACTIVE` bloquea el login.

#### `registry` (`/api/v1/registry`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` / `GET` | `/registry/personas` | Crear / listar personas |
| `GET` / `PATCH` / `DELETE` | `/registry/personas/:id` | Detalle / actualizar / eliminar |
| `PATCH` | `/registry/personas/:id/enrollment-completo` | Marca completado el enrollment biométrico de una persona |
| `POST` / `GET` | `/registry/vehiculos` | Crear / listar vehículos |
| `GET` | `/registry/vehiculos/placa/:placa` | Buscar por placa |
| `GET` | `/registry/vehiculos/:id` | Detalle |
| `GET` | `/registry/vehiculos/propietario/:propietarioId` | Vehículos de un propietario |
| `PATCH` / `DELETE` | `/registry/vehiculos/:id` | Actualizar / eliminar |
| `POST` | `/registry/asignaciones` | Crear asignación de rol (persona ↔ vehículo) |
| `GET` | `/registry/asignaciones/vehiculo/:vehiculoId` | Asignaciones de un vehículo |
| `GET` | `/registry/asignaciones/persona/:personaId` | Asignaciones de una persona |
| `GET` | `/registry/asignaciones/vehiculo/:vehiculoId/grupo-familiar` | Grupo familiar autorizado de un vehículo |
| `PATCH` | `/registry/asignaciones/:id/desactivar` | Desactiva una asignación |

Los demás Bounded Contexts (`authorization`, `biometric`, `access_control`, `alerting`) no exponen controllers todavía — confirmarlo con `find apps/backend/src/modules -name "*.controller.ts"` antes de asumir que un endpoint existe.

### Health checks

Sin el prefijo `api/v1`:

| Endpoint | Propósito |
|----------|-----------|
| `GET /health` | Estado completo (DB, memoria, uptime) |
| `GET /health/liveness` | Liveness probe |
| `GET /health/readiness` | Readiness probe |

```json
{
  "status": "healthy",
  "uptime": 3600,
  "checks": {
    "database": { "status": "up", "responseTime": 5 },
    "memory": { "status": "up", "details": { "heapUsedMB": 45, "heapTotalMB": 120 } },
    "uptime": { "status": "up", "details": { "uptimeSeconds": 3600 } }
  }
}
```

---

## 🗄️ Base de datos

| Schema | Tablas | Estado |
|--------|:---:|--------|
| `auth` | 1 | ✅ En uso |
| `registry` | 3 | ✅ En uso |
| `authorization` | 3 | 🚧 Definido, sin endpoints |
| `biometric` | 3 | 🚧 Definido, sin endpoints (pgvector aún no habilitado — `installExtensions: false`) |
| `access_control` | 4 | 🚧 Definido, sin endpoints |
| `alerting` | 2 | 🚧 Definido, sin endpoints |

`auth` y `registry` se crean explícitamente por `ensureSchemas()` porque son los únicos con datos reales al día de hoy; el resto de schemas los generará `synchronize: true` en cuanto existan entidades mapeadas a ellos.

---

## 🤝 Contribución

1. Cada Bounded Context es independiente — no romper los contratos de `@shared/interfaces/contracts`.
2. `domain/` no debe importar nada de NestJS ni de TypeORM.
3. `application/` (casos de uso / services) solo depende de interfaces de `domain/`.
4. Toda lógica de acceso a base de datos va en `infrastructure/repositories/`.
5. Antes de dar por hecho que un BC "ya existe", verifica si tiene `presentation/*.controller.ts` — varios están scaffolded pero sin endpoints.
6. `pnpm --filter frontend build` debe pasar antes de hacer push si tocaste contratos que el frontend consume.
