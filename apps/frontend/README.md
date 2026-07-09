# VIGIA — Frontend Web

> Ecosistema Inteligente de Seguridad y Control de Acceso Vehicular Biométrico
> Universidad Central del Ecuador · 2026

SPA en React 19 + Vite, con tres experiencias por rol (Propietario, Guardia, Administrador) sobre un mismo shell de autenticación. El dashboard de **Propietario** es hoy el más completo e iterado; Guardia y Admin están implementados pero congelados (ver reglas de aislamiento por rol).

> Para instrucciones de arranque del monorepo completo (incluye backend y DB), ver el [README de la raíz](../../README.md).

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19 | UI Library |
| TypeScript | 5.8 | Tipado estático |
| Vite | 6.x | Build tool y dev server |
| Material UI | 6.x | Componentes de UI |
| React Router | 7.x | Enrutamiento SPA |
| TanStack Query | 5.x | Estado del servidor y caché (instalado; la mayoría de páginas hoy usan `useState` + mocks, no queries reales) |
| React Hook Form + Zod | — | Formularios y validación |
| Framer Motion | — | Animaciones y transiciones de página |
| Axios | 1.x | Cliente HTTP (`src/services/api.ts`) |

---

## Requisitos previos

- Node.js **22.x**
- pnpm **11.x**
- Backend corriendo en `http://localhost:3000` (ver [`apps/backend/README.md`](../backend/README.md)) — el login real requiere el backend arriba.

## Instalación

```bash
# Desde la raíz del monorepo
pnpm install
```

## Variables de entorno

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del backend (también acepta `VITE_API_URL` como alias) | `http://localhost:3000/api/v1` |
| `VITE_APP_ENV` | Entorno lógico de la app | `development` |
| `VITE_APP_NAME` | Nombre mostrado en títulos/meta tags | `VIGIA` |
| `VITE_APP_VERSION` | Versión mostrada en la UI | `0.1.0` |

## Arranque local

```bash
pnpm dev:frontend        # desde la raíz
# o
cd apps/frontend && pnpm dev
```

Disponible en **http://localhost:5173**.

## Build de producción

```bash
pnpm build:frontend      # ejecuta `tsc && vite build` — obligatorio antes de push
```

Salida en `apps/frontend/dist/`.

---

## Estructura de carpetas (Atomic Design + Feature-based)

```
src/
├── assets/                # Imágenes, logos
├── components/
│   ├── atoms/              # SkipToContent, PageTransition, SessionExpiredAlert...
│   ├── molecules/          # PersonaCard, PaseRapidoCard, PermisoTemporalCard, NotificationBell, UserAvatar...
│   ├── organisms/           # Header, Sidebar, drawers y grids por feature (organisms/propietario/, organisms/onboarding/)
│   ├── guards/              # ProtectedRoute, PublicRoute
│   └── templates/           # DashboardTemplate (OWNER/GUARD), LegacyAdminLayout (ADMIN)
├── config/                 # navigation.config.tsx + un *.config.ts por feature (mocks + copy + tipos)
├── context/                # AuthContext (login, JWT, normalización de rol, onboarding)
├── pages/
│   ├── auth/                # Login, CambiarPassword
│   ├── propietario/         # Ver inventario completo abajo
│   ├── guardia/              # Inicio, ColaEventos, RevisionManual, Contingencia, AlertasGuardia
│   └── admin/                # Dashboard + registry/ authorization/ biometric/ alerting/ auditoria/
├── services/                # api.ts — instancia Axios con interceptor de JWT
├── theme/                   # vigia-theme.ts — paleta, radios, sombras, spacing
├── App.tsx                  # Definición de rutas
└── main.tsx                 # Entry point
```

### Patrón de `config/*.config.ts`

Cada feature de Propietario sigue el mismo patrón: **un único archivo `config` que exporta a la vez** el/los `interface` TypeScript, constantes de dominio, arrays `MOCK_*`, y objetos de copy en español (`*_COPY`). Ejemplos: `propietario-personas.config.ts`, `propietario-pases.config.ts`, `propietario-permisos.config.ts`, `propietario-vehiculos.config.ts`, `propietario-vehiculo-detalle.config.ts`. Al agregar una feature nueva, sigue este mismo patrón en vez de crear tipos sueltos.

⚠️ Existen **dos definiciones distintas de `PersonaAutorizada`**: la completa en `propietario-personas.config.ts` (con `cedula`, `tipo`, `telefono`) y una reducida en `propietario-vehiculo-detalle.config.ts` (solo para el tab "Personas" del detalle de vehículo), con mocks independientes no sincronizados entre sí. Ten esto en cuenta si tocas ambas pantallas.

---

## Roles, normalización y guards

El backend envía `role: 'OWNER' | 'GUARD' | 'ADMIN'`. `AuthContext.normalizeUser()` siempre expone **ambos** `role` y `rol` (alias legado `PROPIETARIO`/`GUARDIA`/`ADMIN`); en código nuevo compara siempre contra el valor del backend (`'OWNER'`, no `'PROPIETARIO'`).

| Rol backend | Rutas | Layout |
|-------------|-------|--------|
| `OWNER` | `/propietario/*` | `DashboardTemplate` |
| `GUARD` | `/guardia/*` | `DashboardTemplate` |
| `ADMIN` | `/admin/*` | `LegacyAdminLayout` |

### Flujo de autenticación y onboarding (`ProtectedRoute`)

```
Login
  └─ must_change_password? ──────────────► /cambiar-password
  └─ rol no permitido en la ruta? ────────► redirect
  └─ OWNER + !biometric_registered? ──────► /propietario/onboarding/biometria
  └─ OWNER + !vehicle_registered? ────────► /propietario/onboarding/primer-vehiculo
  └─ Dashboard según rol
```

`ProtectedRoute` (`components/guards/ProtectedRoute.tsx`) implementa esta cadena de gates en orden: loading → no autenticado → `must_change_password` → `allowedRoles` → biometría pendiente (solo OWNER) → vehículo pendiente (solo OWNER).

> ⚠️ **Limitación conocida:** `biometric_registered` y `vehicle_registered` no vienen persistidos desde el backend (`POST /auth/login` no los devuelve todavía). El frontend los resuelve en `AuthContext` (`completeBiometricOnboarding()` / `completeVehicleOnboarding()`) y solo viven en `localStorage` del lado del cliente — se pierden si el backend no los persiste, por lo que el onboarding puede repetirse tras cada login real. No es un bug de UI, es un gap de backend documentado en su README.

---

## Inventario de páginas — Propietario (`/propietario/*`)

Es el dashboard más completo. Todas usan `DashboardTemplate rol="OWNER"`.

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/propietario/onboarding/biometria` | `BiometricOnboardingPage` | Captura de 3 fotos (frontal/perfil izq/perfil der), obligatorio si `!biometric_registered` |
| `/propietario/onboarding/primer-vehiculo` | `VehicleOnboardingPage` | Registro del primer vehículo, obligatorio si `!vehicle_registered` |
| `/propietario/inicio` | `InicioPage` | Saludo dinámico, 5 KPIs, actividad reciente, mini-vehículos, mini-familia, 4 acciones rápidas |
| `/propietario/vehiculos` | `MisVehiculosPage` | Grid de vehículos, registro (drawer) |
| `/propietario/vehiculos/:placa` | `VehiculoDetallePage` | Detalle con tabs (resumen/personas/permisos/pases/actividad) + edición (placa bloqueada) |
| `/propietario/personas` | `PersonasAutorizadasPage` | Grupo familiar y personas frecuentes, alta con biometría presencial opcional |
| `/propietario/personas/:id` | `PersonaDetallePage` | Detalle de persona: info, estado biométrico, actividad, revocar |
| `/propietario/personas/:id/biometria` | `BiometricCapturePersonaPage` | Captura biométrica presencial de un tercero (reutiliza el organism de onboarding) |
| `/propietario/permisos-temporales` | `PermisosTemporalesPage` | Permisos con vigencia auto-calculada (máx. 30 días desde el inicio) |
| `/propietario/pases-rapidos` | `PasesRapidosPage` | Generación de pases de acceso puntual sin biometría (overlay premium) |
| `/propietario/alertas` | `AlertasPage` | Alertas + resumen de atención + acciones recomendadas |
| `/propietario/historial` | `HistorialPage` | Eventos de acceso agrupados por Hoy/Ayer/Anteriores, con filtros |
| `/propietario/perfil` | `PerfilPage` | Info de cuenta, resumen, seguridad, cerrar sesión (solo accesible desde el menú del avatar, no está en el sidebar) |

Todas las rutas de auto-apertura de drawers usan `location.state` (`{ openGenerarPase, openCrearPermiso, openRegistrar, openDrawer }`) disparado desde las acciones rápidas de `Inicio`.

## Inventario de páginas — Guardia (`/guardia/*`)

`Inicio`, `ColaEventos`, `RevisionManual`, `Contingencia`, `AlertasGuardia`. Datos mock, sin cambios recientes — **no modificar sin que lo pida explícitamente el ticket**.

## Inventario de páginas — Admin (`/admin/*`)

Usa `LegacyAdminLayout` (no `DashboardTemplate`). Incluye `Dashboard` y submódulos `registry/` (vehículos, personas, roles institucionales), `authorization/` (permanentes, temporales, vista por vehículo), `biometric/` (perfiles, registro), `alerting/` (alertas, notificaciones), `auditoria/` (historial de eventos) y `auth/CuentasList`. Datos mock, sin cambios recientes — **no modificar sin que lo pida explícitamente el ticket**.

---

## Persistencia mock (localStorage)

Mientras el backend no expone todos los endpoints, algunas features simulan persistencia entre navegaciones con `localStorage` (se pierde al limpiar el storage del navegador, no es una base de datos real):

| Key | Usado por | Contenido |
|-----|-----------|-----------|
| `vigia_auth_user` | `AuthContext` | Usuario normalizado (email, role, rol, flags de onboarding) |
| `vigia_access_token` | `AuthContext`, `services/api.ts` | JWT devuelto por el backend, inyectado en cada request |
| `vigia_personas_autorizadas` | `propietario-personas.config.ts` (`loadPersonas`/`savePersonas`) | Lista completa de personas autorizadas — permite que altas/revocaciones/biometría sobrevivan la navegación entre `PersonasAutorizadas`, `PersonaDetallePage` y `BiometricCapturePersonaPage` |
| `vigia_first_vehicle` | `VehicleRegistrationForm` / `propietario-vehiculos.config.ts` | Vehículo registrado durante el onboarding obligatorio |

Si agregas una feature nueva que necesite sobrevivir la navegación entre páginas sin backend real, sigue este mismo patrón (`load*`/`save*` con `try/catch` silencioso) en vez de introducir un store global.

---

## Sistema de diseño

Definido en `src/theme/vigia-theme.ts`, expone:

- `vigiaColors` — paleta institucional (`primary #0D5CCF`, `deep #0A2F86`, `greenIA`, `gold`, `success/warning/error`, gradientes `gradientIA`/`gradientHero`).
- `vigiaRadius` — `sm 6px · md 8px · lg 12px · xl 16px · full 9999px`.
- `vigiaShadows` — `sm/md/lg/xl` + glows temáticos.
- `vigiaSpacing` — `page/section/card/cardGap/element`.

Tipografía: **Exo 2** para headings/marca/números, **Inter** para texto funcional/UI. Reglas de color de estado:

- Badge de biometría pendiente: **amarillo** (`#FEF3C7` fondo / `#F59E0B` borde / `#92400E` texto) — nunca azul/celeste.
- Botón de acción principal: gradiente IA (`linear-gradient(135deg, #19D6C4, #0D5CCF)`).
- Touch targets mínimo 44px de alto en botones interactivos.

Ver también las skills `vigia-design-system` y `vigia-domain` del repo (`.claude/`) para las reglas completas de negocio y visuales que debe respetar cualquier cambio de UI.

---

## Convenciones

- **Idioma:** UI visible en español; código (variables, funciones, tipos, commits) en inglés.
- **Aislamiento por rol:** nunca modificar componentes/rutas de un rol al trabajar en otro. Si un componente se necesita en 2+ roles, va a `components/` compartido (no a `pages/<rol>/`).
- **Sin jerga técnica en UI:** nunca mostrar "JWT", "pgvector", "E2E", "OCR", "512D" al usuario.
- **Sin "Olvidé mi contraseña" ni auto-registro público** — está fuera del dominio.
- **Formularios:** siempre React Hook Form + Zod, nunca `useState` por campo.
- **Mocks:** deben quedar fácilmente removibles (comentario `// TODO: replace with API call` donde aplique) y nunca hardcodear credenciales fuera del seeder del backend.
- **Imports:** el proyecto tiene configurado el alias `@/` → `src/` (`vite.config.ts` y `tsconfig.json`), pero el código existente usa consistentemente **imports relativos** (`../../theme/vigia-theme`) — sigue ese patrón salvo que el equipo decida migrar.
- **Proxy de dev:** `vite.config.ts` proxea `/api` → `http://localhost:3000`, pero el cliente Axios (`services/api.ts`) usa `VITE_API_BASE_URL` directamente y no depende de ese proxy.

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | `tsc && vite build` — build de producción |
| `pnpm preview` | Sirve el build de producción localmente |
| `pnpm lint` | ESLint |

## Verificación pre-commit

```bash
pnpm --filter frontend build   # obligatorio antes de push — tsc debe pasar sin errores
```
