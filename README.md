# VIGIA — Vehicle Access & Exit Control System

> Universidad Central del Ecuador · Monorepo (pnpm workspaces)

## What is VIGIA

VIGIA is a vehicle access control system for the university campus. It combines a vehicle/people registry, biometric enrollment (UI-complete, verification service not yet connected), and three authorization mechanisms to decide who may bring a vehicle in or out: a global family group per owner, time-bound temporary permits, and single-use quick-access passes.

---

## Current state of the project

Before reproducing this locally, it matters to know what's actually wired to a real database today:

| Layer | Status |
|-------|--------|
| **Frontend — Propietario (Owner)** | Most complete and iterated dashboard: onboarding, vehicles, authorized people (with in-person biometric capture), temporary permits, quick passes, history, profile, alerts. Connected to the real API where the backend exposes it; falls back to in-memory/localStorage mocks where it doesn't yet. |
| **Frontend — Guardia / Admin** | Implemented with mock data; not touched in recent iterations (see role-isolation rules below). |
| **Backend — `core/auth`** | Real: JWT login, forced password change, user management (CRUD, activate/deactivate, reset password). Automatic dev seeder. |
| **Backend — `registry`** | Real: CRUD for `Persona`, `Vehiculo`, and `AsignacionRol` against PostgreSQL. |
| **Backend — `authorization`** | Real: family group membership (global per owner), temporary permits, and quick-access passes — all with live endpoints and PostgreSQL persistence. |
| **Backend — `biometric`, `access_control`, `alerting`** | Modules and database schemas scaffolded (entities/tables exist), but **no controllers/endpoints exposed yet**. The frontend covers these features with mocks. |
| **Biometric / vehicle onboarding** | Real: `POST /api/v1/auth/login` returns `biometric_registered` / `vehicle_registered`, persisted on the `User` entity and updated via `PATCH /api/v1/auth/users/me/onboarding-status` when the owner completes each step. |

Before extending the backend, check `apps/backend/src/modules/<bc>/` first to confirm whether that Bounded Context already has a `presentation/*.controller.ts` or only `domain/` + `infrastructure/`.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, MUI 6, React Router 7, TanStack Query, React Hook Form + Zod, Framer Motion |
| Backend | NestJS 10, TypeORM 0.3, PostgreSQL 17 (multi-schema), Passport JWT, bcrypt |
| Monorepo | pnpm workspaces, Webpack (backend bundle via `nest build`) |
| Runtime | **Node.js 22.x** (required — see the TypeScript enum note below) |

> ⚠️ **Why Node 22.x and not just "≥18"**: the backend uses `@PrimaryGeneratedColumn` and TypeScript enums that TypeORM loads at runtime via `autoLoadEntities`. Different Node versions' experimental type-stripping support can break this. Root `package.json` `engines` says `>=18.0.0` for historical compatibility, but the tested development environment is **Node 22.x**.

---

## Architecture

- **Modular monolith** with a hexagonal / Clean Architecture approach (ports & adapters)
- **Domain-Driven Design** — 5 Bounded Contexts, each with its own isolated PostgreSQL schema: `registry`, `authorization`, `biometric`, `access_control`, `alerting` (plus `auth`, cross-cutting infrastructure rather than a business BC)
- **Inter-BC communication** — exclusively through contracts in `src/shared/interfaces/contracts/`; Bounded Contexts never import each other's modules directly

## Implemented modules (MVP)

| Module | Status | Description |
|--------|:---:|-------------|
| `core/auth` | ✅ Complete | JWT, bcrypt, roles, guards, forced password change |
| `registry` | ✅ Complete | People, vehicles, biometric enrollment (structure) |
| `authorization` | ✅ Complete | Family group (global per owner), temporary permits, quick-access passes |
| `access-control` | 🔲 Scaffolded | Gate/checkpoint evaluation (post-MVP) |
| `biometric` | 🔲 Scaffolded | Face embeddings (post-MVP) |
| `alerting` | 🔲 Scaffolded | Notifications and alerts (post-MVP) |

## Authorization model

```
Owner (1) ──→ (N) Vehicles [status: ACTIVE | INACTIVE]
Owner (1) ──→ (up to 5) Family Group Members [access to ALL of the owner's active vehicles]
Vehicle (1) ──→ (N) Temporary Permits [validity ≤ 30 days from start]
Vehicle (1) ──→ (N) Quick-Access Passes [single use, no biometric check]
```

---

## Quick start

```bash
# Clone and install
git clone https://github.com/VIGIA-Project/VIGIA.git
cd VIGIA
pnpm install
```

### Database

Pick **one** of the two options. The real backend config (`apps/backend/.env`) is set up for option A.

**Option A — local PostgreSQL (recommended, matches the dev `.env`):**

```bash
psql -U postgres -c "CREATE DATABASE vigia_db;"
```

Expected credentials: `postgres` / `admin` on `localhost:5432`, database `vigia_db`.

**Option B — Docker Compose:**

```bash
docker-compose up -d postgres
```

⚠️ The `docker-compose.yml` Postgres service exposes host port **5434** (not 5432, to avoid clashing with a local install) and uses `docker-compose.yml`'s own credentials (`DB_USERNAME`/`DB_PASSWORD`, default `vigia_user`/`vigia_secret`). If you use this option, adjust `DB_PORT=5434` and the credentials in `apps/backend/.env`.

### Environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

`apps/backend/.env.example` defaults already point to Option A. See [Environment variables](#environment-variables) below for the full list.

### Backend

```bash
pnpm dev:backend
```

**No manual migrations or seeds needed in development.** On boot, the backend:
1. Creates the `auth` and `registry` schemas if missing (`ensureSchemas`, see `apps/backend/src/core/database/init-schemas.ts`).
2. Syncs tables automatically because `DB_SYNCHRONIZE=true` (TypeORM `synchronize`).
3. Inserts the 3 test users if `auth.users` is empty and `NODE_ENV=development` (`SeedService`).

API available at `http://localhost:3000/api/v1` · Health check at `http://localhost:3000/health`.

### Frontend

```bash
pnpm dev:frontend
```

Available at `http://localhost:5173`.

### Both in parallel

```bash
pnpm dev
```

---

## Development credentials (automatic seed)

Only inserted when `NODE_ENV=development` and the users table is empty.

| Email | Password | Role |
|-------|----------|------|
| `admin@uce.edu.ec` | `Admin123!` | ADMIN |
| `guardia@uce.edu.ec` | `Guard123!` | GUARD |
| `propietario@uce.edu.ec` | `Owner123!` | OWNER |

Login only accepts `@uce.edu.ec` email addresses.

---

## Environment variables

### Backend (`apps/backend/.env`)

| Variable | Required | Default | Description |
|----------|:---:|---------|-------------|
| `DB_HOST` | ✅ | — | PostgreSQL host |
| `DB_PORT` | ✅ | 5432 | Port |
| `DB_USERNAME` | ✅ | — | Database user |
| `DB_PASSWORD` | ✅ | — | Database password |
| `DB_NAME` | ✅ | — | Database name |
| `DB_SYNCHRONIZE` | — | `false` | `true` in dev so TypeORM creates/updates tables automatically |
| `DB_LOGGING` | — | `false` | Log SQL queries to console |
| `JWT_SECRET` | ✅ | — | JWT signing secret |
| `JWT_EXPIRATION` | — | `1d` | Token expiration (e.g. `8h`) |
| `BCRYPT_ROUNDS` | — | `10` | Password hashing rounds |
| `NODE_ENV` | — | `development` | `development` enables the automatic seeder |
| `APP_PORT` | — | `3000` | Backend HTTP port |

Validated at boot with Joi (`apps/backend/src/core/config/env.validation.ts`) — the backend refuses to start if a required variable is missing.

> `envFilePath` only resolves inside `apps/backend/` (`.env` / `.env.local`). The backend never reads the repo-root `.env` — that one is only a reference for `docker-compose.yml`.

### Frontend (`apps/frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | Backend base URL (also accepts `VITE_API_URL` as an alias) |
| `VITE_APP_ENV` | `development` | Logical app environment |
| `VITE_APP_NAME` | `VIGIA` | Used in titles/meta tags |
| `VITE_APP_VERSION` | `0.1.0` | Version shown in the UI |

---

## Available scripts

### Monorepo (root)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Backend + frontend in parallel |
| `pnpm dev:backend` | Backend only (`nest start --watch`) |
| `pnpm dev:frontend` | Frontend only (Vite dev server) |
| `pnpm build` | Build every workspace |
| `pnpm build:backend` | Build backend only → `apps/backend/dist` |
| `pnpm build:frontend` | Build frontend only → `apps/frontend/dist` |
| `pnpm lint` | ESLint across every workspace |
| `pnpm test` | Tests (Jest) across every workspace |
| `pnpm clean` | Removes `node_modules` and `dist` from every workspace |

### Backend (`apps/backend`)

```bash
pnpm --filter @vigia/backend run start:dev   # watch mode
pnpm --filter @vigia/backend run build
pnpm --filter @vigia/backend run test
pnpm --filter @vigia/backend run test:e2e
pnpm --filter @vigia/backend run test:cov
pnpm --filter @vigia/backend run migration:run     # only if DB_SYNCHRONIZE=false
pnpm --filter @vigia/backend run migration:generate -- src/core/database/migrations/MigrationName
pnpm --filter @vigia/backend run seed               # manual alternative to SeedService
```

> Migrations (`apps/backend/src/core/database/migrations/`) exist for scenarios where `DB_SYNCHRONIZE=false` (e.g. production). In normal development they don't run — `synchronize: true` plus the automatic seeder are enough.

### Frontend (`apps/frontend`)

```bash
pnpm --filter frontend run dev
pnpm --filter frontend run build   # runs tsc + vite build — required before push
pnpm --filter frontend run lint
pnpm --filter frontend run preview
```

---

## Docker Compose

`docker-compose.yml` permite levantar y orquestar todo el entorno local (incluyendo base de datos, servicios mock de IA, backend y frontend compilados en producción):

| Service | Host port | Description / Notes |
|---------|-----------|---------------------|
| `postgres` | `5434→5432` | Base de datos usando la imagen `pgvector/pgvector:pg16` |
| `ocr` | `8001` | **Stub** de FastAPI para lectura de placas (`/detect-plate`) |
| `bio` | `8002` | **Stub** de FastAPI para reconocimiento facial (`/compare-face`) |
| `backend` | `3000→3000` | Servidor backend NestJS compilado en producción y conectado a postgres |
| `frontend` | `80→80` | Aplicación React de producción servida de manera óptima con **Nginx** |

Comandos de Docker:
```bash
docker-compose up -d --build  # Construye y levanta toda la demo en paralelo
docker-compose logs -f        # Visualizar los logs de todos los servicios
docker-compose down           # Detener los contenedores
docker-compose down -v        # Detener contenedores y limpiar volumen de base de datos
```

---

## Database schema

```
6 schemas
├── auth            (1 table)   → users, roles, password policies
├── registry        (3 tables)  → personas, vehiculos, asignaciones_rol
├── authorization    (3 tables) → family group, temporary permits, quick-access passes
├── biometric        (3 tables) → biometric profiles (pgvector, future)
├── access_control   (4 tables) → entry/exit events
└── alerting         (2 tables) → alerts and notifications
```

`auth` and `registry` are created explicitly on boot; the rest are created by `synchronize: true` from TypeORM entities as they get mapped to those schemas.

---

## Health check

```bash
curl http://localhost:3000/health             # full status (DB, memory, uptime)
curl http://localhost:3000/health/liveness     # liveness probe
curl http://localhost:3000/health/readiness    # readiness probe
```

---

## Authentication flow (frontend)

```
Login (/login)
  └─ must_change_password? ──► /cambiar-password
  └─ OWNER + !biometric_registered? ──► /propietario/onboarding/biometria
  └─ OWNER + !vehicle_registered? ──► /propietario/onboarding/primer-vehiculo
  └─ Dashboard for the role (OWNER → /propietario/inicio, GUARD → /guardia/inicio, ADMIN → /admin)
```

- The backend sends `role: 'OWNER' | 'GUARD' | 'ADMIN'`. The frontend normalizes and exposes both `role` and `rol` (legacy alias `PROPIETARIO`/`GUARDIA`) — new code always compares against the backend value.
- `isActive()` on the backend accepts `ACTIVE` and `PENDING_PASSWORD_CHANGE`; only `INACTIVE` blocks login.
- `biometric_registered`/`vehicle_registered` come from the backend on login and are persisted server-side; `AuthContext.completeBiometricOnboarding()` / `completeVehicleOnboarding()` call `PATCH /auth/users/me/onboarding-status` to update them.

---

## Key architectural decisions

1. **The family group is global per owner**, not per vehicle — a member gets access to every active vehicle the owner has.
2. **No `PROGRAMADO` (scheduled) state** — a permit is created directly as active; its applicability is determined by its validity window (`vigenciaInicio`/`vigenciaFin`).
3. **Quick-access passes store a bcrypt hash of the code** — the plain code is shown to the owner exactly once.
4. **JWT payload carries onboarding claims** — `must_change_password`, `biometric_registered`, `vehicle_registered`.
5. **Vehicle access is bidirectional** — entry and exit are evaluated under the same authorization logic.
6. **Legacy `/permanentes` endpoints remain as aliases** of the new `/grupo-familiar` endpoints during the frontend migration (`apps/backend/src/modules/authorization/presentation/authorization.controller.ts`), to avoid breaking existing frontend calls while both are updated in lockstep.

---

## Git conventions

- **Base branch:** `dev` (not `main`/`develop`).
- **Commits:** conventional, atomic, in English (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
- Git commands **always run separately**, never chained with `&&`.
- No merges without a passing `pnpm --filter frontend build` and explicit approval.
- Never modify another role's routes/components (OWNER/GUARD/ADMIN) while working on a different one.

```bash
git fetch origin
git checkout dev
git pull origin dev
git checkout -b feat/short-description
```

---

## Production build

```bash
pnpm build                  # both apps
pnpm build:backend          # → apps/backend/dist
pnpm build:frontend         # → apps/frontend/dist
```

Minimum production variables:

```bash
# Backend
NODE_ENV=production
DB_SYNCHRONIZE=false        # use migrations instead of synchronize in prod
JWT_SECRET=<secure-value>
APP_PORT=3000

# Frontend
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
```

---

## Known limitations (MVP)

| Limitation | Reason | Post-MVP resolution |
|-----------|--------|----------------------|
| Temporary permits / quick passes operate on `vehiculos[0]` | No active-vehicle selector yet | Implement a `<VehiculoSelector>` |
| No real biometric verification | Face-matching service not connected | Connect the Bio service |
| No real-time plate OCR | Detection/OCR service not connected | Connect the OCR service |
| Guard dashboard has no real data | Access Control BC not implemented | Implement Access Control |
| No push notifications | Alerting BC scaffolded | Implement Alerting |

## Post-MVP roadmap

1. Active-vehicle selector in the owner dashboard
2. ACTIVE/INACTIVE vehicle status (groundwork for payments)
3. "Authorize for all my vehicles" checkbox on temporary permits
4. Access Control BC — checkpoint evaluation with OCR + face recognition
5. University parking payment integration
6. Real-time push notifications and alerts

---

## Documentation per app

- [`apps/backend/README.md`](./apps/backend/README.md) — Clean Architecture + DDD, Bounded Contexts, real endpoints, health checks.
- [`apps/frontend/README.md`](./apps/frontend/README.md) — Atomic Design structure, page inventory per role, design system, mock strategy.

<!-- TODO: verify — link the canonical business/architecture docs (Confluence or equivalent) once confirmed accessible from this repo -->

---

## Swagger / OpenAPI Documentación

El backend de VIGIA cuenta con especificación OpenAPI auto-generada e interactiva para explorar los contratos de endpoints reales expuestos:

- **Swagger UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Soporte de Autenticación**: Admite la autorización por token JWT usando el flujo Bearer Token haciendo clic en "Authorize" arriba a la derecha.

---

## Pruebas Automatizadas (Unitarias y E2E)

VIGIA cuenta con pruebas unitarias y suites de pruebas de integración E2E para flujos críticos (autenticación, políticas de seguridad RBAC, métricas):

- **Pruebas unitarias (global)**:
  ```bash
  pnpm test
  ```
- **Pruebas de integración E2E (backend)**:
  - Corren de forma secuencial y limpia para evitar conflictos de conexiones concurrentes en base de datos:
  ```bash
  pnpm --filter @vigia/backend run test:e2e
  ```

---

## Pipeline de CI/CD (GitHub Actions)

La integración continua del proyecto está automatizada mediante **GitHub Actions** (`.github/workflows/ci.yml`). Cada `push` o `pull_request` enviado a las ramas `main` o `develop` desencadena un pipeline no intrusivo que:
1. Levanta un entorno Ubuntu limpio.
2. Inicia un servicio PostgreSQL Dockerizado con la extensión `pgvector`.
3. Instala dependencias con `pnpm` usando almacenamiento en caché para optimizar la velocidad.
4. Ejecuta el linter/formateador (`pnpm lint`).
5. Compila todo el monorrepósito (`pnpm build`).
6. Corre las pruebas unitarias y suites E2E contra la base de datos temporal del CI.

---

## License

MIT
