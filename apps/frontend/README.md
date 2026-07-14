# VIGIA — Frontend Web

> Intelligent Vehicle Access and Biometric Security System
> Universidad Central del Ecuador · 2026

SPA built with React 19 + Vite, with three role-based experiences (Owner, Guard, Administrator) on top of a shared authentication shell. The **Owner (Propietario)** dashboard is the most complete and iterated today; Guard and Admin are implemented but frozen (see the role-isolation rules below).

> For instructions to run the whole monorepo (backend + DB included), see the [root README](../../README.md).

---

## Tech stack

| Technology | Version | Purpose |
|-----------|---------|-----------|
| React | 19 | UI library |
| TypeScript | 5.8 | Static typing |
| Vite | 6.x | Build tool and dev server |
| Material UI | 6.x | UI components |
| React Router | 7.x | SPA routing |
| TanStack Query | 5.x | Server state and caching (installed; Owner's authorization/registry pages use real queries, other roles still use `useState` + mocks) |
| React Hook Form + Zod | — | Forms and validation |
| Framer Motion | — | Animations and page transitions |
| Axios | 1.x | HTTP client (`src/services/api.ts`) |

---

## Prerequisites

- Node.js **22.x**
- pnpm **11.x**
- Backend running on `http://localhost:3000` (see [`apps/backend/README.md`](../backend/README.md)) — real login and the Owner dashboard's authorization data require the backend to be up.

## Install

```bash
# From the monorepo root
pnpm install
```

## Environment variables

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend base URL (also accepts `VITE_API_URL` as an alias) | `http://localhost:3000/api/v1` |
| `VITE_APP_ENV` | Logical app environment | `development` |
| `VITE_APP_NAME` | Shown in titles/meta tags | `VIGIA` |
| `VITE_APP_VERSION` | Version shown in the UI | `0.1.0` |

## Run locally

```bash
pnpm dev:frontend        # from the root
# or
cd apps/frontend && pnpm dev
```

Available at **http://localhost:5173**.

## Production build

```bash
pnpm build:frontend      # runs `tsc && vite build` — required before push
```

Output in `apps/frontend/dist/`.

---

## Folder structure (Atomic Design + feature-based)

```
src/
├── assets/                # Images, logos
├── components/
│   ├── atoms/              # SkipToContent, PageTransition, SessionExpiredAlert...
│   ├── molecules/          # PersonaCard, PaseRapidoCard, PermisoTemporalCard, NotificationBell, UserAvatar...
│   ├── organisms/           # Header, Sidebar, feature drawers/grids (organisms/propietario/, organisms/onboarding/)
│   ├── guards/              # ProtectedRoute, PublicRoute
│   └── templates/           # DashboardTemplate (OWNER/GUARD), LegacyAdminLayout (ADMIN)
├── config/                 # navigation.config.tsx + one *.config.ts per feature (mocks + copy + types)
├── context/                # AuthContext (login, JWT, role normalization, onboarding)
├── hooks/                  # TanStack Query hooks per service (useAuthorization, useRegistry, ...)
├── pages/
│   ├── auth/                # Login, CambiarPassword
│   ├── propietario/         # See full inventory below
│   ├── guardia/              # Inicio, ColaEventos, RevisionManual, Contingencia, AlertasGuardia
│   └── admin/                # Dashboard + registry/ authorization/ biometric/ alerting/ auditoria/
├── services/                # api.ts (Axios instance with JWT interceptor) + one *.service.ts per backend BC
├── theme/                   # vigia-theme.ts — palette, radii, shadows, spacing
├── App.tsx                  # Route definitions
└── main.tsx                 # Entry point
```

### Service layer pattern

Each connected feature follows the same chain: **Axios instance (`services/api.ts`) → typed service functions (`services/<bc>.service.ts` + `services/types/<bc>.types.ts`) → TanStack Query hooks (`hooks/use<Bc>.ts`) → pages**. Example for authorization: `services/authorization.service.ts` wraps every `/api/v1/authorization/*` call, `services/types/authorization.types.ts` mirrors the backend aggregates' `toJSON()` shape, and `hooks/useAuthorization.ts` exposes `useMiembrosGrupoFamiliar`, `useCrearMiembroGrupoFamiliar`, `usePermisosVigentesPorVehiculo`, `useMisPases`, etc., with query-key based cache invalidation on every mutation.

### `config/*.config.ts` pattern

Every Owner feature follows the same pattern: **a single config file that exports** the TypeScript `interface`(s), domain constants, any remaining `MOCK_*` arrays, and Spanish copy objects (`*_COPY`). Examples: `propietario-personas.config.ts`, `propietario-pases.config.ts`, `propietario-permisos.config.ts`, `propietario-vehiculos.config.ts`, `propietario-vehiculo-detalle.config.ts`. When adding a new feature, follow this same pattern instead of scattering loose types.

⚠️ There are **two separate definitions of `PersonaAutorizada`**: the full one in `propietario-personas.config.ts` (with `cedula`, `tipo`, `telefono`, built from real API data via `mapAutorizacionAPersona`) and a reduced one in `propietario-vehiculo-detalle.config.ts` (only for the "Personas" tab of the vehicle detail screen, still mock-backed and not synced with the other one). Keep this in mind if you touch both screens.

---

## Roles, normalization, and guards

The backend sends `role: 'OWNER' | 'GUARD' | 'ADMIN'`. `AuthContext.normalizeUser()` always exposes **both** `role` and `rol` (legacy alias `PROPIETARIO`/`GUARDIA`/`ADMIN`); new code always compares against the backend value (`'OWNER'`, not `'PROPIETARIO'`).

| Backend role | Routes | Layout |
|-------------|-------|--------|
| `OWNER` | `/propietario/*` | `DashboardTemplate` |
| `GUARD` | `/guardia/*` | `DashboardTemplate` |
| `ADMIN` | `/admin/*` | `LegacyAdminLayout` |

### Authentication and onboarding flow (`ProtectedRoute`)

```
Login
  └─ must_change_password? ──────────────► /cambiar-password
  └─ role not allowed on this route? ─────► redirect
  └─ OWNER + !biometric_registered? ──────► /propietario/onboarding/biometria
  └─ OWNER + !vehicle_registered? ────────► /propietario/onboarding/primer-vehiculo
  └─ Dashboard for the role
```

`ProtectedRoute` (`components/guards/ProtectedRoute.tsx`) implements this gate chain in order: loading → not authenticated → `must_change_password` → `allowedRoles` → pending biometrics (OWNER only) → pending vehicle (OWNER only).

`biometric_registered` and `vehicle_registered` come from the backend on login (`POST /auth/login`) and are persisted server-side on the `User` entity. `AuthContext.completeBiometricOnboarding()` / `completeVehicleOnboarding()` update local state immediately and call `PATCH /auth/users/me/onboarding-status` to persist the change — see [`apps/backend/README.md`](../backend/README.md#auth-apiv1auth) for the endpoint contract.

---

## Page inventory — Owner (`/propietario/*`)

The most complete dashboard. All pages use `DashboardTemplate rol="OWNER"`.

| Route | Page | Description |
|------|--------|-------------|
| `/propietario/onboarding/biometria` | `BiometricOnboardingPage` | Captures 3 photos (front/left profile/right profile), required if `!biometric_registered` |
| `/propietario/onboarding/primer-vehiculo` | `VehicleOnboardingPage` | Registers the first vehicle, required if `!vehicle_registered` |
| `/propietario/inicio` | `InicioPage` | Dynamic greeting, 5 KPIs, recent activity, mini vehicle/family lists, 4 quick actions |
| `/propietario/vehiculos` | `MisVehiculosPage` | Vehicle grid, registration (drawer) |
| `/propietario/vehiculos/:placa` | `VehiculoDetallePage` | Detail with tabs (summary/people/permits/passes/activity) + edit (plate locked) |
| `/propietario/personas` | `PersonasAutorizadasPage` | Family group and frequent visitors, connected to the real Authorization + Registry APIs, optional in-person biometric enrollment on add |
| `/propietario/personas/:id` | `PersonaDetallePage` | Person detail: info, biometric status, activity, revoke |
| `/propietario/personas/:id/biometria` | `BiometricCapturePersonaPage` | In-person biometric capture for a third party (reuses the onboarding organism) |
| `/propietario/permisos-temporales` | `PermisosTemporalesPage` | Permits with auto-calculated validity (max. 30 days from start), connected to the real API |
| `/propietario/pases-rapidos` | `PasesRapidosPage` | Generates one-time access passes without biometrics (premium overlay), connected to the real API |
| `/propietario/alertas` | `AlertasPage` | Alerts + attention summary + recommended actions (mock) |
| `/propietario/historial` | `HistorialPage` | Access events grouped by Today/Yesterday/Earlier, with filters (mock) |
| `/propietario/perfil` | `PerfilPage` | Account info, summary, security, logout (only reachable from the avatar menu, not in the sidebar) |

All drawer auto-open routes use `location.state` (`{ openGenerarPase, openCrearPermiso, openRegistrar, openDrawer }`) triggered from `Inicio`'s quick actions.

## Page inventory — Guard (`/guardia/*`)

`Inicio`, `ColaEventos`, `RevisionManual`, `Contingencia`, `AlertasGuardia`. Mock data, no recent changes — **do not modify unless the ticket explicitly asks for it**.

## Page inventory — Admin (`/admin/*`)

Uses `LegacyAdminLayout` (not `DashboardTemplate`). Includes `Dashboard` and the submodules `registry/` (vehicles, people, institutional roles), `authorization/` (family group, temporary, per-vehicle view), `biometric/` (profiles, enrollment), `alerting/` (alerts, notifications), `auditoria/` (event history), and `auth/CuentasList`. Mock data, no recent changes — **do not modify unless the ticket explicitly asks for it**.

---

## Connection status by dashboard

| Dashboard | Status |
|-----------|--------|
| Propietario (Owner) | Real API for auth, registry (vehicles/people), and authorization (family group, temporary permits, quick-access passes). Alerts and history still mock. |
| Guardia (Guard) | Mock data end to end. |
| Admin | Mock data end to end. |

---

## Mock persistence (localStorage)

While the backend doesn't expose every endpoint, some features still simulate persistence across navigations with `localStorage` (lost when the browser storage is cleared, not a real database):

| Key | Used by | Content |
|-----|-----------|---------|
| `vigia_auth_user` | `AuthContext` | Normalized user (email, role, rol, onboarding flags) |
| `vigia_access_token` | `AuthContext`, `services/api.ts` | JWT returned by the backend, injected into every request |
| `vigia_first_vehicle` | `VehicleRegistrationForm` / `propietario-vehiculos.config.ts` | Vehicle registered during mandatory onboarding |

`vigia_personas_autorizadas` (formerly used by `propietario-personas.config.ts`) is no longer needed — Personas Autorizadas now reads and writes through `useAuthorization`/`useRegistry` against the real backend.

If you add a new feature that needs to survive navigation without a real backend endpoint yet, follow the same pattern (`load*`/`save*` with a silent `try/catch`) instead of introducing a global store.

---

## Design system

Defined in `src/theme/vigia-theme.ts`, exposing:

- `vigiaColors` — institutional palette (`primary #0D5CCF`, `deep #0A2F86`, `greenIA`, `gold`, `success/warning/error`, gradients `gradientIA`/`gradientHero`).
- `vigiaRadius` — `sm 6px · md 8px · lg 12px · xl 16px · full 9999px`.
- `vigiaShadows` — `sm/md/lg/xl` + themed glows.
- `vigiaSpacing` — `page/section/card/cardGap/element`.

Typography: **Exo 2** for headings/brand/numbers, **Inter** for functional/UI text. State color rules:

- Pending-biometrics badge: **yellow** (`#FEF3C7` background / `#F59E0B` border / `#92400E` text) — never blue/cyan.
- Primary action button: AI gradient (`linear-gradient(135deg, #19D6C4, #0D5CCF)`).
- Interactive touch targets at least 44px tall.

Also see the `vigia-design-system` and `vigia-domain` skills in the repo (`.claude/`) for the full business and visual rules any UI change must respect.

---

## Conventions

- **Language:** visible UI in Spanish; code (variables, functions, types, commits) in English.
- **Role isolation:** never modify one role's components/routes while working on another. If a component is needed by 2+ roles, it goes in shared `components/` (not `pages/<role>/`).
- **No technical jargon in the UI:** never show "JWT", "pgvector", "E2E", "OCR", "512D" to the user.
- **No "forgot password" and no public self-registration** — out of scope for this domain.
- **Forms:** always React Hook Form + Zod, never per-field `useState`.
- **Mocks:** must stay easy to remove (`// TODO: replace with API call` comment where applicable) and never hardcode credentials outside the backend seeder.
- **Imports:** the project has the `@/` → `src/` alias configured (`vite.config.ts` and `tsconfig.json`), but existing code consistently uses **relative imports** (`../../theme/vigia-theme`) — follow that pattern unless the team decides to migrate.
- **Dev proxy:** `vite.config.ts` proxies `/api` → `http://localhost:3000`, but the Axios client (`services/api.ts`) uses `VITE_API_BASE_URL` directly and doesn't rely on that proxy.

## Available commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | `tsc && vite build` — production build |
| `pnpm preview` | Serves the production build locally |
| `pnpm lint` | ESLint |

## Pre-commit check

```bash
pnpm --filter frontend build   # required before push — tsc must pass with no errors
```
