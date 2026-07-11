# VIGIA — Backend

REST API built with **NestJS 10**, **TypeORM 0.3**, and **PostgreSQL**, following **Clean Architecture** with **Domain-Driven Design (DDD)** principles.

> For quick-start instructions covering the whole monorepo (frontend + backend + DB), see the [root README](../../README.md). This document covers backend internals.

---

## Architecture

### Layers (per Bounded Context)

```
┌─────────────────────────────────────────────────────────┐
│  presentation/     Controllers, input DTOs, module         │
├─────────────────────────────────────────────────────────┤
│  application/       Use cases / Services                   │
├─────────────────────────────────────────────────────────┤
│  domain/            Domain entities, repository interfaces  │
│                      — NO external dependencies              │
├─────────────────────────────────────────────────────────┤
│  infrastructure/     TypeORM repositories, *.orm-entity.ts  │
└─────────────────────────────────────────────────────────┘
```

Dependency rule: `domain` imports nothing from NestJS or TypeORM. `application` only depends on `domain` interfaces. All database access lives in `infrastructure/repositories/`.

### Actual directory structure

```
src/
├── main.ts                        # Bootstrap: global prefix, ValidationPipe, CORS, interceptors
├── app.module.ts                  # Root module — imports config, DB, auth, health, and the 5 BCs
│
├── core/
│   ├── auth/                      # Authentication module (NOT a business Bounded Context)
│   │   ├── application/           # AuthController, AuthService
│   │   ├── domain/                # User entity, roles, UserRepository (interface)
│   │   ├── infrastructure/        # UserOrmEntity, TypeOrmUserRepository
│   │   └── presentation/          # JwtAuthGuard, RolesGuard, @Roles/@Public decorators
│   ├── config/                    # app.config.ts, database.config.ts, env.validation.ts (Joi)
│   ├── database/
│   │   ├── database.module.ts     # TypeORM.forRootAsync + ensureSchemas()
│   │   ├── database.service.ts
│   │   ├── init-schemas.ts        # Creates the "auth" and "registry" schemas + uuid-ossp extension
│   │   ├── seed.service.ts        # Inserts test users when NODE_ENV=development
│   │   ├── migrations/            # TypeORM migrations (optional use, see below)
│   │   └── seeds/                 # Alternative manual seed script (pnpm run seed)
│   ├── decorators/                # Shared decorators
│   ├── exceptions/                # AllExceptionsFilter + base DomainException
│   ├── guards/                    # Generic JwtAuthGuard
│   └── interceptors/               # ResponseInterceptor, LoggingInterceptor
│
├── shared/                        # Code shared BETWEEN Bounded Contexts, no business logic
│   ├── constants/                 # Injection tokens (e.g. USER_REPOSITORY), business limits
│   ├── dto/                       # PaginationDto and generic responses
│   ├── enums/                     # Shared domain enums
│   ├── interfaces/contracts/      # Contracts between BCs (anti-corruption layer, see below)
│   ├── logger/                    # LoggerModule + VigiaLogger (Winston)
│   └── utils/                     # Pure utilities (date, string)
│
├── modules/                       # The 5 business Bounded Contexts
│   ├── registry/                  # ✅ Implemented — People, vehicles, role assignments
│   ├── authorization/              # ✅ Implemented — Family group, temporary permits, quick-access passes
│   ├── biometric/                  # 🚧 Scaffolded — biometric profiles (pgvector, future)
│   ├── access-control/             # 🚧 Scaffolded — entry/exit events
│   └── alerting/                   # 🚧 Scaffolded — alerts and notifications
│
└── presentation/
    └── health/                    # Health checks (Terminus)
```

Every module under `modules/` follows the same `application/ domain/ infrastructure/ presentation/` sub-structure. The ones marked **🚧 Scaffolded** already have a NestJS module registered in `app.module.ts` and, in some cases, domain/infrastructure entities, but **don't expose a `*.controller.ts` yet** — there's no HTTP endpoint to hit. The frontend covers those features with mocks until they're implemented.

### Bounded Contexts

| BC | Status | Responsibility | Entities |
|----|:---:|-----------------|-----------|
| `registry` | ✅ | Catalog of vehicles, people, and their role assignment (owner/family/etc.) | `Persona`, `Vehiculo`, `AsignacionRol` |
| `authorization` | ✅ | Family group (global per owner), temporary permits, quick-access passes | `MiembroGrupoFamiliar`, `PermisoTemporal`, `PaseAccesoRapido` |
| `biometric` | 🚧 | Biometric profiles and verification (pgvector, future) | — |
| `access_control` | 🚧 | Entry/exit events at checkpoints | — |
| `alerting` | 🚧 | Alert/notification emission and management | — |

`core/auth` is not a domain Bounded Context — it's cross-cutting authentication infrastructure (users, roles, JWT), which is why it lives in `core/` rather than `modules/`.

### Communication between Bounded Contexts

BCs **never import each other directly**. They communicate exclusively through contracts defined in `src/shared/interfaces/contracts/` (one per BC: `registry.contract.ts`, `authorization.contract.ts`, `biometric.contract.ts`, `access-control.contract.ts`, `alerting.contract.ts`):

```typescript
// ✅ Correct: use the contract
import { IAlertingContract } from '@shared/interfaces/contracts';

// ❌ Incorrect: import another BC's module directly
import { AlertingModule } from '@modules/alerting/presentation/alerting.module';
```

### Entity and TypeORM rules

- **Never** use glob patterns in TypeORM's `entities` config (breaks under Node 22's strip-only mode) — always `autoLoadEntities: true` (already configured in `database.module.ts`).
- TypeScript enums in entities are valid as long as they're loaded via `autoLoadEntities` (not via glob).
- Each entity belongs to a single schema: `@Entity({ schema: 'registry' })`, etc.

---

## Setup and startup

### Prerequisites

- Node.js **22.x**
- pnpm **11.x**
- PostgreSQL 16/17 running (local, or via `docker-compose up -d postgres` from the repo root)

### Setup

```bash
# From the monorepo root
pnpm install

# Configure backend environment variables
cp apps/backend/.env.example apps/backend/.env
# Adjust credentials if you're not using local Postgres with postgres/admin

# Create the database (empty, no schemas — the backend creates them on boot)
psql -U postgres -c "CREATE DATABASE vigia_db;"

# Start in watch mode
pnpm --filter @vigia/backend run start:dev
```

On boot, the backend automatically:
1. Creates the `auth` and `registry` schemas if missing, plus the `uuid-ossp` extension (`ensureSchemas`, see `core/database/init-schemas.ts`).
2. Syncs tables from TypeORM entities if `DB_SYNCHRONIZE=true` — **no need to run migrations in development**.
3. Inserts the 3 test users (`admin@uce.edu.ec`, `guardia@uce.edu.ec`, `propietario@uce.edu.ec`) if `NODE_ENV=development` and `auth.users` is empty (`SeedService.onModuleInit`).

### Migrations (optional — only if `DB_SYNCHRONIZE=false`)

Three migrations already exist under `src/core/database/migrations/` (`InitialSchema`, `RegistryVIG75`, `GrupoFamiliarGlobal`), meant for production, where you don't want to depend on `synchronize`:

```bash
pnpm --filter @vigia/backend run build
pnpm --filter @vigia/backend run migration:run
pnpm --filter @vigia/backend run migration:generate -- src/core/database/migrations/MigrationName
pnpm --filter @vigia/backend run migration:revert
```

### Manual seed (alternative to the automatic `SeedService`)

```bash
pnpm --filter @vigia/backend run seed
```

Runs `src/core/database/seeds/run-seed.ts` directly with `ts-node`. Useful to re-seed data without restarting the Nest process.

---

## Environment variables

Validated at boot with Joi (`src/core/config/env.validation.ts`) — the process refuses to start if a **required** variable is missing.

| Variable | Required | Default | Description |
|----------|:---:|---------|-------------|
| `DB_HOST` | ✅ | — | PostgreSQL host |
| `DB_PORT` | ✅ | `5432` | Port |
| `DB_USERNAME` | ✅ | — | Database user |
| `DB_PASSWORD` | ✅ | — | Database password |
| `DB_NAME` | ✅ | — | Database name |
| `DB_SYNCHRONIZE` | — | `false` | `true` in dev — TypeORM creates/updates tables from entities |
| `DB_LOGGING` | — | `false` | Logs executed SQL queries |
| `JWT_SECRET` | ✅ | — | JWT signing secret |
| `JWT_EXPIRATION` | — | `1d` | Access token expiration |
| `BCRYPT_ROUNDS` | — | `10` | Password hashing rounds |
| `NODE_ENV` | — | `development` | `development` enables `SeedService` |
| `APP_PORT` | — | `3000` | HTTP port |
| `CORS_ORIGIN` | — | `*` | Allowed CORS origin (monorepo dev setup expects `http://localhost:5173`) |

`envFilePath` in `app.module.ts` only resolves `.env`/`.env.local` **inside `apps/backend/`** — it never reads the repo-root `.env` (that one is only for `docker-compose.yml`).

---

## Available scripts

| Script | Description |
|--------|-------------|
| `start:dev` | Watch-mode server (Webpack + `nest start --watch`) |
| `build` | Compiles with `nest build` → `dist/` |
| `start:prod` | Starts from `dist/main.js` |
| `test` / `test:watch` / `test:cov` | Unit tests (Jest) |
| `test:e2e` | End-to-end tests |
| `migration:generate` / `migration:run` / `migration:revert` | TypeORM migration management |
| `seed` | Runs the manual seed script |
| `format` | Prettier over `src/` and `test/` |
| `lint` | ESLint with `--fix` |

---

## API

### Prefix and versioning

- Global prefix: **`api/v1`** (`app.setGlobalPrefix`), except `health` endpoints.
- URI versioning enabled (`VersioningType.URI`) — ready for future versions, not actively used yet.
- CORS enabled per `CORS_ORIGIN` (default `*`; the monorepo dev setup expects `http://localhost:5173`).
- Global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform` — any property not declared in a DTO is rejected.
- Responses wrapped by `ResponseInterceptor` and logged by `LoggingInterceptor`; errors centralized in `AllExceptionsFilter`.

### Endpoints implemented today

#### `auth` (`/api/v1/auth`)

| Method | Route | Required role | Description |
|--------|------|----------------|-------------|
| `POST` | `/auth/login` | public | Login. Only accepts `@uce.edu.ec` emails. |
| `POST` | `/auth/change-password` | authenticated | Changes the current user's password |
| `PATCH` | `/auth/users/me/onboarding-status` | authenticated | Persists `biometric_registered` / `vehicle_registered` for the current user |
| `POST` | `/auth/users` | ADMIN | Creates a user |
| `GET` | `/auth/users` | ADMIN | Lists users (paginated, filterable by role/status) |
| `GET` | `/auth/users/:id` | ADMIN | User detail |
| `PATCH` | `/auth/users/:id/activate` | ADMIN | Activates a user |
| `PATCH` | `/auth/users/:id/deactivate` | ADMIN | Deactivates a user |
| `PATCH` | `/auth/users/:id/reset-password` | ADMIN | Generates a temporary password |

**`POST /auth/login` response:**

```json
{
  "access_token": "eyJhbGciOi...",
  "must_change_password": false,
  "role": "OWNER",
  "biometric_registered": false,
  "vehicle_registered": true
}
```

`biometric_registered` and `vehicle_registered` are persisted on the `User` entity and updated through `PATCH /auth/users/me/onboarding-status` when the owner completes each onboarding step (`AuthContext.completeBiometricOnboarding()` / `completeVehicleOnboarding()` on the frontend). Note the response is a flat object — it doesn't nest a `user` field, and doesn't include `email` (the frontend fills it in from the login form).

Valid roles: `ADMIN`, `GUARD`, `OWNER` (exact values in the DB and JWT payload). `isActive()` on the `User` entity accepts `ACTIVE` and `PENDING_PASSWORD_CHANGE`; only `INACTIVE` blocks login.

#### `registry` (`/api/v1/registry`)

| Method | Route | Description |
|--------|------|-------------|
| `POST` / `GET` | `/registry/personas` | Create / list people |
| `GET` / `PATCH` / `DELETE` | `/registry/personas/:id` | Detail / update / delete |
| `PATCH` | `/registry/personas/:id/enrollment-completo` | Marks a person's biometric enrollment as completed |
| `POST` / `GET` | `/registry/vehiculos` | Create / list vehicles |
| `GET` | `/registry/vehiculos/placa/:placa` | Find by plate |
| `GET` | `/registry/vehiculos/:id` | Detail |
| `GET` | `/registry/vehiculos/propietario/:propietarioId` | Vehicles belonging to an owner |
| `PATCH` / `DELETE` | `/registry/vehiculos/:id` | Update / delete |
| `POST` | `/registry/asignaciones` | Create a role assignment (person ↔ vehicle) |
| `GET` | `/registry/asignaciones/vehiculo/:vehiculoId` | Assignments for a vehicle |
| `GET` | `/registry/asignaciones/persona/:personaId` | Assignments for a person |
| `GET` | `/registry/asignaciones/vehiculo/:vehiculoId/grupo-familiar` | Authorized family group for a vehicle |
| `PATCH` | `/registry/asignaciones/:id/desactivar` | Deactivates an assignment |

#### `authorization` (`/api/v1/authorization`)

Family group membership is **global per owner** — a `MiembroGrupoFamiliar` links a `personaId` to a `propietarioId` and grants access to every vehicle that owner has, not to a single vehicle.

| Method | Route | Required role | Description |
|--------|------|----------------|-------------|
| `POST` | `/authorization/grupo-familiar` | OWNER | Adds a family group member for the authenticated owner |
| `GET` | `/authorization/grupo-familiar/propietario/:propietarioId` | OWNER, ADMIN | Lists all family group members of an owner |
| `GET` | `/authorization/grupo-familiar/propietario/:propietarioId/activos` | OWNER, ADMIN, GUARD | Lists only active family group members of an owner |
| `PATCH` | `/authorization/grupo-familiar/:id/revocar` | OWNER | Revokes a family group member |
| `POST` | `/authorization/temporales` | OWNER | Creates a temporary permit (validity ≤ 30 days from `vigenciaInicio`) |
| `GET` | `/authorization/temporales/vehiculo/:vehiculoId` | OWNER, ADMIN, GUARD | Lists currently valid permits for a vehicle |
| `GET` | `/authorization/temporales/persona/:personaId` | OWNER, ADMIN | Lists permits for a person |
| `PATCH` | `/authorization/temporales/:id/revocar` | OWNER | Revokes a temporary permit |
| `POST` | `/authorization/pases` | OWNER | Generates a quick-access pass; returns the plain code once |
| `GET` | `/authorization/pases/mis-pases` | OWNER | Lists the authenticated owner's passes |
| `GET` | `/authorization/pases/placa/:placa` | GUARD, ADMIN | Lists active passes for a plate |
| `POST` | `/authorization/pases/validar` | GUARD | Validates a pass code against a plate |
| `PATCH` | `/authorization/pases/:id/revocar` | OWNER | Revokes a pass |
| `PATCH` | `/authorization/pases/:id/consumir` | GUARD, ADMIN | Marks a pass as consumed, linked to an access event |
| `GET` | `/authorization/conjunto-autorizado/vehiculo/:vehiculoId` | GUARD, ADMIN | Full set of people currently authorized for a vehicle (family group + valid permits) |

**Legacy `/permanentes` aliases:** `POST /authorization/permanentes`, `GET /authorization/permanentes/vehiculo/:vehiculoId`, `GET /authorization/permanentes/vehiculo/:vehiculoId/activas`, and `PATCH /authorization/permanentes/:id/revocar` remain temporarily. They resolve the vehicle's owner and delegate to the same family-group use cases, so the current frontend keeps working while it migrates to the `/grupo-familiar` routes directly.

> ⚠️ **Domain note:** there is no `PROGRAMADO` (scheduled) state for temporary permits. A permit is created directly with an active status; whether it currently applies is determined by comparing `vigenciaInicio`/`vigenciaFin` against the current time, not by a separate lifecycle state.

The remaining Bounded Contexts (`biometric`, `access_control`, `alerting`) don't expose controllers yet — confirm with `find apps/backend/src/modules -name "*.controller.ts"` before assuming an endpoint exists.

### Health checks

Without the `api/v1` prefix:

| Endpoint | Purpose |
|----------|-----------|
| `GET /health` | Full status (DB, memory, uptime) |
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

## Database

| Schema | Tables | Status |
|--------|:---:|--------|
| `auth` | 1 | ✅ In use |
| `registry` | 3 | ✅ In use |
| `authorization` | 3 | ✅ In use |
| `biometric` | 3 | 🚧 Defined, no endpoints (pgvector not enabled yet — `installExtensions: false`) |
| `access_control` | 4 | 🚧 Defined, no endpoints |
| `alerting` | 2 | 🚧 Defined, no endpoints |

`auth` and `registry` are created explicitly by `ensureSchemas()` since they were the first with real data; the remaining schemas are generated by `synchronize: true` as entities get mapped to them.

---

## Key technical decisions

- **Password hashing:** bcrypt with `BCRYPT_ROUNDS` from `.env` (default `10`).
- **JWT payload:** `{ sub, email, role, name, mustChangePassword, personaId }` — `personaId` is backfilled on login for users created before the `Persona` ↔ `User` link existed, so it doesn't need to be looked up again on future logins.
- **pgvector:** reserved for the `biometric` BC's future face-embedding storage; the Docker Compose Postgres image already ships with the extension, but it isn't installed/used by any entity yet (`installExtensions: false`).
- **Quick-access passes:** the plain access code is only returned once, at creation time (`GenerarPaseResult.codigoPlano`); the entity persists a bcrypt hash, not the plain code.
- **Family group is global per owner:** `MiembroGrupoFamiliar` links to `propietarioId`, not `vehiculoId` — a member is authorized for every active vehicle the owner has, not a single one.
- **5-member cap on the family group is enforced by the frontend only** (`FAMILIA_MAX_MIEMBROS` in `apps/frontend/src/config/propietario-personas.config.ts`). `MAX_ACTIVE_AUTHORIZATIONS_PER_VEHICLE` exists as a constant in `src/shared/constants/index.ts` but isn't referenced anywhere in the authorization use cases yet — don't rely on the backend to reject a 6th member today.

---

## Contribution

1. Each Bounded Context is independent — don't break the contracts in `@shared/interfaces/contracts`.
2. `domain/` must not import anything from NestJS or TypeORM.
3. `application/` (use cases / services) only depends on `domain/` interfaces.
4. All database access lives in `infrastructure/repositories/`.
5. Before assuming a BC "already exists," check whether it has a `presentation/*.controller.ts` — several are scaffolded but have no endpoints.
6. `pnpm --filter frontend build` must pass before pushing if you touched contracts the frontend consumes.
