# VIGIA Frontend

> Módulo frontend del **Ecosistema Inteligente de Seguridad y Control de Acceso Vehicular Biométrico**  
> Universidad Central del Ecuador · 2026 · VIG-50

---

## Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 6.3 | Build tool / Dev server |
| TypeScript | 5.8 | Tipado estático |
| Material UI | 6.5 | Componentes y sistema de diseño |
| React Router | 6 | Enrutamiento SPA |
| Axios | 1.9 | Cliente HTTP |
| TanStack Query | 5 | State management / caché de server state |
| `@vigia/shared-types` | workspace | Enums y tipos compartidos con backend |

---

## Arquitectura — Atomic Design

```
src/
├── assets/logo/          ← Assets estáticos (logo PNG, SVG)
├── components/
│   ├── atoms/            ← Piezas mínimas sin lógica de negocio
│   │   ├── VigiaLogo.tsx
│   │   ├── VigiaWordmark.tsx
│   │   ├── GradientBar.tsx
│   │   ├── StatusChip.tsx
│   │   ├── SeverityDot.tsx
│   │   └── RolBadge.tsx
│   ├── molecules/        ← Composición de 2+ átomos
│   │   ├── BrandBlock.tsx
│   │   ├── NavItem.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationItem.tsx
│   │   ├── UserAvatar.tsx
│   │   └── VehicleCard.tsx
│   ├── organisms/        ← Secciones completas de UI
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── VehicleGrid.tsx
│   │   ├── PermisosTable.tsx
│   │   └── NotificationList.tsx
│   └── templates/        ← Layouts reutilizables
│       └── DashboardTemplate.tsx
├── config/
│   └── navigation.config.tsx   ← ÚNICA fuente de verdad para rutas de nav
├── pages/
│   ├── Login.tsx               ← Placeholder — auth real en EP01
│   ├── propietario/            ← Dashboard Propietario (5 páginas)
│   ├── guardia/                ← Placeholder EP02
│   └── admin/                  ← Placeholder EP02
├── services/
│   ├── api.ts                  ← Cliente Axios + interceptores JWT
│   └── index.ts
├── theme/
│   └── vigia-theme.ts          ← Tema MUI con colores del Manual de Identidad Visual
├── App.tsx                     ← Enrutador principal
└── main.tsx
```

---

## Variables de Entorno

Copiar `.env.example` como `.env.local` y ajustar valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del backend | `http://localhost:8080/api/v1` |
| `VITE_APP_ENV` | Entorno de ejecución | `development` |
| `VITE_APP_NAME` | Nombre de la aplicación | `VIGIA` |
| `VITE_APP_VERSION` | Versión actual | `0.1.0` |

> ⚠️ **Nunca** commitear `.env.local` con credenciales reales.

---

## Comandos de Desarrollo

Ejecutar desde la **raíz del monorepo**:

```bash
# Instalar dependencias (primera vez)
pnpm install

# Iniciar frontend en modo desarrollo
pnpm dev:frontend

# Build de producción del frontend
pnpm build:frontend

# Instalar dependencias en apps/frontend específicamente
cd apps/frontend && pnpm install
```

El servidor de desarrollo corre en **http://localhost:5173** por defecto.

---

## Paleta de Colores — Manual de Identidad Visual VIGIA

| Token | Valor | Uso |
|---|---|---|
| Azul Profundo | `#0A2F86` | Fondo sidebar, títulos principales |
| Azul Principal | `#0D5CCF` | Botones, acentos, links |
| Verde IA | `#19D6C4` | Ítem activo en nav, gradiente superior |
| Dorado Premium | `#F2B51F` | A del wordmark, estados premium |
| Fondo contenido | `#F8FAFC` | Background de páginas |
| Gradiente IA | `linear-gradient(90deg, #19D6C4 0%, #11A9D6 40%, #0D5CCF 100%)` | GradientBar, CTAs |

---

## Terminología del Dominio (DDD)

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| Permiso Temporal | Permiso de visita / Invitación |
| Pase de Acceso Rápido | Pase rápido / QR |
| Persona Autorizada | Invitado / Visitante |
| Conductor | Visitante (en contexto de Pases) |
| Mis Alertas | Notificaciones (en nav del Propietario) |

---

## Estado de Desarrollo

| Sprint | Estado | Descripción |
|---|---|---|
| VIG-50 | ✅ Completado | Setup inicial + maqueta dashboard Propietario |
| VIG-51 | ✅ Completado | Monorepo pnpm + estructura de carpetas |
| VIG-52 | ✅ Completado | Variables de entorno configuradas |
| VIG-53 | ✅ Completado | Cliente HTTP base + login placeholder + rutas |
| VIG-54 | ✅ Completado | README documentado |
| EP01-AUTH-FE | 🔲 Pendiente | Autenticación real con JWT |
| EP02 | 🔲 Pendiente | Dashboard Guardia + Dashboard Admin |

---

## Convenciones

- **Commits:** `tipo(scope): descripción en español` — ej: `feat(frontend): agregar página de alertas`
- **Ramas:** `feat/`, `fix/`, `refactor/` — base siempre `dev`
- **Componentes:** PascalCase, exportación nombrada + `export default`
- **Imports de navegación:** SIEMPRE desde `src/config/navigation.config.tsx`, nunca inline
- **Imágenes:** Importar como módulo ES (`import logo from '...'`), no rutas de string

---

*VIGIA — La inteligencia que protege cada acceso.*
