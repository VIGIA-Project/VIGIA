# 🚨 VIGIA — Control de Acceso Vehicular Inteligente

**Sistema de control de acceso vehicular** para la Universidad Central del Ecuador, construido como monorepo con **NestJS** (backend), **React + Vite** (frontend) y **PostgreSQL** (multi-schema), siguiendo **Clean Architecture** y **Domain-Driven Design (DDD)**.

> 📦 Este es un **monorepo con pnpm workspaces**. Usa siempre **`pnpm`**, nunca `npm` o `yarn` — el lockfile y los `workspace:*` de `package.json` dependen de él.

---

## 📌 Estado actual del proyecto

Antes de reproducir el proyecto, es importante entender qué está realmente implementado hoy:

| Capa | Estado |
|------|--------|
| **Frontend — Propietario** | Completo e iterado: onboarding, vehículos, personas autorizadas (con biometría presencial), permisos temporales, pases rápidos, historial, perfil, alertas. Usa datos **mock en memoria/localStorage** donde el backend aún no expone endpoints. |
| **Frontend — Guardia / Admin** | Implementado con datos mock; no se ha tocado en las últimas iteraciones (ver reglas de aislamiento por rol más abajo). |
| **Backend — `auth`** | Real: login JWT, cambio de contraseña, gestión de usuarios (CRUD, activar/desactivar, reset password). Seeder automático en desarrollo. |
| **Backend — `registry`** | Real: CRUD de `Persona`, `Vehiculo` y `AsignacionRol` contra PostgreSQL. |
| **Backend — `authorization`, `biometric`, `access_control`, `alerting`** | Módulos y schemas de base de datos **scaffolded** (entidades/tablas existen), pero **sin controllers ni endpoints expuestos todavía**. El frontend cubre estas features con mocks. |
| **Onboarding biométrico / vehicular** | El flujo de UI está completo, pero `POST /api/v1/auth/login` **no persiste ni devuelve** `biometric_registered` / `vehicle_registered` todavía — esos dos flags se resuelven hoy en el cliente (`AuthContext`) y se pierden al cerrar sesión. Es una limitación conocida, no un bug de esta rama. |

Si vas a extender el backend, revisa primero `apps/backend/src/modules/<bc>/` para confirmar si el Bounded Context ya tiene `presentation/*.controller.ts` o solo `domain/`+`infrastructure/`.

---

## 🧱 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite 6, MUI 6, React Router 7, TanStack Query, React Hook Form + Zod, Framer Motion |
| Backend | NestJS 10, TypeORM 0.3, PostgreSQL 17 (multi-schema), Passport JWT, bcrypt |
| Monorepo | pnpm workspaces, Webpack (bundle del backend vía `nest build`) |
| Runtime | **Node.js 22.x** (requerido — ver nota sobre enums de TypeScript más abajo) |

> ⚠️ **Por qué Node 22.x y no solo "≥18"**: el backend usa `@PrimaryGeneratedColumn` y enums de TypeScript que TypeORM carga en runtime vía `autoLoadEntities`. En versiones de Node con soporte experimental de "type stripping" distinto, esto puede romperse. El `engines` de `package.json` dice `>=18.0.0` por compatibilidad histórica, pero el entorno de desarrollo real y probado es **Node 22.x**.

---

## 📚 Estructura del Monorepo

```
VIGIA/
├── apps/
│   ├── backend/                  # API REST NestJS — Clean Architecture + DDD
│   │   ├── src/
│   │   │   ├── core/             # Config, database, auth, guards, interceptores
│   │   │   ├── modules/          # 5 Bounded Contexts (ver apps/backend/README.md)
│   │   │   ├── shared/           # Contratos entre BCs, DTOs, enums, utils
│   │   │   └── presentation/     # Health checks
│   │   ├── .env                  # Config local (NO versionado)
│   │   ├── .env.example
│   │   └── README.md             # ← Documentación detallada del backend
│   │
│   └── frontend/                 # SPA React + Vite
│       ├── src/
│       │   ├── pages/            # propietario/ · guardia/ · admin/ · auth/
│       │   ├── components/       # Atomic Design: atoms/molecules/organisms/templates
│       │   ├── config/           # Mocks, copy en español, navegación, tema
│       │   ├── context/          # AuthContext (JWT, roles, onboarding)
│       │   └── services/         # Cliente Axios
│       ├── .env.example
│       └── README.md             # ← Documentación detallada del frontend
│
├── packages/
│   └── shared-types/              # Enums y DTOs TS compartidos (uso parcial hoy)
│
├── .claude/                       # Reglas y skills del asistente Claude Code
├── CLAUDE.md                      # Contexto e instrucciones para el asistente
├── docker-compose.yml             # Postgres + stubs mock de OCR/biometría
├── .env.example                   # Plantilla de referencia para docker-compose
├── pnpm-workspace.yaml
└── README.md                      # ← Estás aquí
```

---

## 🚀 Inicio Rápido

### 1️⃣ Prerequisitos

- **Node.js 22.x**
- **pnpm 11.x** (`packageManager` fijado en `package.json`)
- **PostgreSQL 16/17** local, o Docker para levantar el de `docker-compose.yml`

### 2️⃣ Clonar e instalar

```bash
git clone https://github.com/VIGIA-Project/VIGIA.git
cd VIGIA
pnpm install
```

### 3️⃣ Configurar la base de datos

Elige **una** de las dos opciones. El backend real (`apps/backend/.env`) está preparado para la opción A.

**Opción A — PostgreSQL local (recomendado, coincide con el `.env` de desarrollo):**

```bash
psql -U postgres -c "CREATE DATABASE vigia_db;"
```

Credenciales esperadas: `postgres` / `admin` en `localhost:5432`, base `vigia_db`.

**Opción B — Docker Compose:**

```bash
docker-compose up -d postgres
```

⚠️ El Postgres de `docker-compose.yml` expone el puerto **5434** (no 5432, para no chocar con una instalación local) y usa las credenciales de `docker-compose.yml` (`DB_USERNAME`/`DB_PASSWORD`, default `vigia_user`/`vigia_secret`). Si usas esta opción, ajusta `DB_PORT=5434` y las credenciales en `apps/backend/.env`.

### 4️⃣ Configurar variables de entorno

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Los valores por defecto de `apps/backend/.env.example` ya apuntan a la Opción A. Ver la sección [Variables de entorno](#-variables-de-entorno) para el detalle completo.

### 5️⃣ Levantar el backend

```bash
pnpm dev:backend
```

**No hace falta ejecutar migraciones ni seeds manualmente en desarrollo.** Al arrancar, el backend:
1. Crea los schemas `auth` y `registry` si no existen (`ensureSchemas`, ver `apps/backend/src/core/database/init-schemas.ts`).
2. Sincroniza las tablas automáticamente porque `DB_SYNCHRONIZE=true` (TypeORM `synchronize`).
3. Inserta los 3 usuarios de prueba si la tabla `auth.users` está vacía y `NODE_ENV=development` (`SeedService`).

API disponible en `http://localhost:3000/api/v1` · Health check en `http://localhost:3000/health`.

### 6️⃣ Levantar el frontend

```bash
pnpm dev:frontend
```

Disponible en `http://localhost:5173`.

### 7️⃣ O ambos en paralelo

```bash
pnpm dev
```

---

## 🔑 Credenciales de desarrollo (seed automático)

Solo se insertan cuando `NODE_ENV=development` y la tabla de usuarios está vacía.

| Email | Password | Rol |
|-------|----------|-----|
| `admin@uce.edu.ec` | `Admin123!` | ADMIN |
| `guardia@uce.edu.ec` | `Guard123!` | GUARD |
| `propietario@uce.edu.ec` | `Owner123!` | OWNER |

El login solo acepta correos con dominio `@uce.edu.ec`.

---

## 🔧 Variables de entorno

### Backend (`apps/backend/.env`)

| Variable | Requerida | Default | Descripción |
|----------|:---:|---------|-------------|
| `DB_HOST` | ✅ | — | Host de PostgreSQL |
| `DB_PORT` | ✅ | 5432 | Puerto |
| `DB_USERNAME` | ✅ | — | Usuario de la BD |
| `DB_PASSWORD` | ✅ | — | Password de la BD |
| `DB_NAME` | ✅ | — | Nombre de la base de datos |
| `DB_SYNCHRONIZE` | — | `false` | `true` en dev para que TypeORM cree/actualice tablas automáticamente |
| `DB_LOGGING` | — | `false` | Log de queries SQL en consola |
| `JWT_SECRET` | ✅ | — | Secreto de firma de tokens JWT |
| `JWT_EXPIRATION` | — | `1d` | Expiración del token (ej. `8h`) |
| `BCRYPT_ROUNDS` | — | `10` | Rondas de hashing de contraseñas |
| `NODE_ENV` | — | `development` | `development` habilita el seeder automático |
| `APP_PORT` | — | `3000` | Puerto HTTP del backend |

Validadas al arrancar con Joi (`apps/backend/src/core/config/env.validation.ts`) — si falta una variable requerida, el backend no levanta.

> `envFilePath` solo resuelve dentro de `apps/backend/` (`.env` / `.env.local`). El `.env` de la raíz **no** lo usa el backend, es solo referencia para `docker-compose.yml`.

### Frontend (`apps/frontend/.env.local`)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | URL base del backend. También se acepta `VITE_API_URL` como alias. |
| `VITE_APP_ENV` | `development` | Entorno lógico de la app |
| `VITE_APP_NAME` | `VIGIA` | Usado en títulos/meta tags |
| `VITE_APP_VERSION` | `0.1.0` | Versión mostrada en la UI |

---

## 📦 Scripts disponibles

### Monorepo (raíz)

| Comando | Descripción |
|---------|------------|
| `pnpm dev` | Backend + frontend en paralelo |
| `pnpm dev:backend` | Solo backend (`nest start --watch`) |
| `pnpm dev:frontend` | Solo frontend (Vite dev server) |
| `pnpm build` | Build de todos los workspaces |
| `pnpm build:backend` | Build solo del backend → `apps/backend/dist` |
| `pnpm build:frontend` | Build solo del frontend → `apps/frontend/dist` |
| `pnpm lint` | ESLint en todos los workspaces |
| `pnpm test` | Tests (Jest) en todos los workspaces |
| `pnpm clean` | Borra `node_modules` y `dist` de todos los workspaces |

### Backend (`apps/backend`)

```bash
pnpm --filter @vigia/backend run start:dev   # watch mode
pnpm --filter @vigia/backend run build
pnpm --filter @vigia/backend run test
pnpm --filter @vigia/backend run test:e2e
pnpm --filter @vigia/backend run test:cov
pnpm --filter @vigia/backend run migration:run     # solo si DB_SYNCHRONIZE=false
pnpm --filter @vigia/backend run migration:generate -- src/core/database/migrations/NombreMigracion
pnpm --filter @vigia/backend run seed               # inserción manual alternativa al SeedService
```

> Las migraciones (`apps/backend/src/core/database/migrations/`) existen para escenarios donde `DB_SYNCHRONIZE=false` (p. ej. producción). En desarrollo normal no se ejecutan — `synchronize: true` + el seeder automático son suficientes.

### Frontend (`apps/frontend`)

```bash
pnpm --filter frontend run dev
pnpm --filter frontend run build   # ejecuta tsc + vite build — obligatorio antes de push
pnpm --filter frontend run lint
pnpm --filter frontend run preview
```

---

## 🐳 Docker Compose

`docker-compose.yml` levanta:

| Servicio | Puerto host | Notas |
|----------|-------------|-------|
| `postgres` | `5434→5432` | Imagen `pgvector/pgvector:pg16` (pgvector reservado para biometría futura, aún no se usa) |
| `ocr` | `8001` | **Stub** FastAPI que responde datos aleatorios mock (`/detect-plate`) — no es un servicio de OCR real |
| `bio` | `8002` | **Stub** FastAPI que responde datos aleatorios mock (`/compare-face`) — no es un servicio biométrico real |

```bash
docker-compose up -d        # levantar todo
docker-compose logs -f      # ver logs
docker-compose down         # detener
docker-compose down -v      # detener y borrar el volumen de datos
```

Estos dos servicios OCR/Bio son placeholders para integrar los servicios de IA reales más adelante; hoy el frontend no los consume.

---

## 🗄️ Esquema de base de datos

```
6 schemas
├── auth            (1 tabla)   → usuarios, roles, políticas de contraseña
├── registry        (3 tablas)  → personas, vehículos, asignaciones_rol   [único con endpoints reales]
├── authorization    (3 tablas) → permisos permanentes/temporales, pases rápidos
├── biometric        (3 tablas) → perfiles biométricos (pgvector futuro)
├── access_control   (4 tablas) → eventos de entrada/salida
└── alerting         (2 tablas) → alertas y notificaciones
```

`auth` y `registry` se crean automáticamente al arrancar el backend; el resto de schemas los crea `synchronize: true` a partir de las entidades TypeORM cuando existan.

---

## 🏥 Health Check

```bash
curl http://localhost:3000/health             # estado completo (DB, memoria, uptime)
curl http://localhost:3000/health/liveness     # liveness probe
curl http://localhost:3000/health/readiness    # readiness probe
```

---

## 🔐 Flujo de autenticación (frontend)

```
Login (/login)
  └─ must_change_password? ──► /cambiar-password
  └─ OWNER + !biometric_registered? ──► /propietario/onboarding/biometria
  └─ OWNER + !vehicle_registered? ──► /propietario/onboarding/primer-vehiculo
  └─ Dashboard según rol (OWNER → /propietario/inicio, GUARD → /guardia/inicio, ADMIN → /admin)
```

- El backend envía `role: 'OWNER' | 'GUARD' | 'ADMIN'`. El frontend normaliza y expone tanto `role` como `rol` (alias legado `PROPIETARIO`/`GUARDIA`) — compara siempre contra el valor del backend en código nuevo.
- `isActive()` en el backend acepta `ACTIVE` y `PENDING_PASSWORD_CHANGE`; solo `INACTIVE` bloquea el login.
- Como se explicó en [Estado actual](#-estado-actual-del-proyecto), `biometric_registered`/`vehicle_registered` no vienen del backend todavía — el frontend los completa por `AuthContext` y no persisten entre sesiones.

---

## 🌿 Convenciones de Git

- **Branch base:** `dev` (no `main`/`develop`).
- **Commits:** convencionales, atómicos, en inglés (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
- Comandos git **siempre separados**, nunca encadenados con `&&`.
- No hacer merge sin `pnpm --filter frontend build` exitoso y aprobación explícita.
- No modificar rutas/componentes de un rol (OWNER/GUARD/ADMIN) al trabajar en otro.

```bash
git fetch origin
git checkout dev
git pull origin dev
git checkout -b feat/descripcion-corta
```

---

## 🚀 Build de producción

```bash
pnpm build                  # ambos apps
pnpm build:backend          # → apps/backend/dist
pnpm build:frontend         # → apps/frontend/dist
```

Variables mínimas en producción:

```bash
# Backend
NODE_ENV=production
DB_SYNCHRONIZE=false        # usar migraciones en vez de synchronize en prod
JWT_SECRET=<valor-seguro>
APP_PORT=3000

# Frontend
VITE_API_BASE_URL=https://api.tu-dominio.com/api/v1
```

---

## 🐛 Troubleshooting

**`pnpm: command not found`**
```bash
npm install -g pnpm@11.9.0
```

**`Error de conexión. Intente nuevamente.` en el login**
El backend no está corriendo o no es alcanzable desde el frontend. Verifica `pnpm dev:backend` y que `VITE_API_BASE_URL` apunte al puerto correcto (3000 por defecto).

**`ECONNREFUSED` / `PostgreSQL connection refused`**
```bash
# Local: verifica que el servicio de Postgres esté activo
# Docker:
docker-compose ps
docker-compose logs postgres
docker-compose restart postgres
```

**Backend arranca pero las tablas no existen**
Confirma `DB_SYNCHRONIZE=true` en `apps/backend/.env` para desarrollo, o ejecuta las migraciones manualmente si trabajas con `DB_SYNCHRONIZE=false`.

**No aparecen los usuarios de prueba**
El `SeedService` solo inserta si `NODE_ENV=development` **y** la tabla `auth.users` está vacía. Si ya insertaste usuarios manualmente, no se re-insertan.

**El onboarding biométrico/vehicular vuelve a pedirse tras cerrar sesión**
Comportamiento esperado hoy — ver [Estado actual del proyecto](#-estado-actual-del-proyecto).

**Puerto 3000 o 5173 en uso**
```bash
# Backend: cambia APP_PORT en apps/backend/.env
# Frontend: Vite pedirá otro puerto automáticamente, o usa --port
```

---

## 📚 Documentación por app

- [`apps/backend/README.md`](./apps/backend/README.md) — arquitectura Clean Architecture + DDD, Bounded Contexts, endpoints reales, health checks.
- [`apps/frontend/README.md`](./apps/frontend/README.md) — estructura Atomic Design, inventario de páginas por rol, sistema de diseño, estrategia de mocks.

---

## 📄 Licencia

MIT

---

**Última actualización:** 2026-07-09
**Versión:** 0.1.0
