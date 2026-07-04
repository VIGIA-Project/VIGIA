# VIGIA — Frontend Web
> Ecosistema Inteligente de Seguridad y Control de Acceso Vehicular Biométrico  
> Universidad Central del Ecuador · 2026

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19 | UI Library |
| TypeScript | 5.8 | Tipado estático |
| Vite | 6.3 | Build tool y dev server |
| Material UI | 6.5 | Componentes de UI |
| React Router | 7.x | Enrutamiento SPA |
| TanStack Query | 5.x | Estado del servidor y caché |
| Axios | 1.x | Cliente HTTP |

## Requisitos Previos

- Node.js >= 20
- pnpm >= 9

## Instalación

```bash
# Desde la raíz del monorepo
pnpm install
```

## Variables de Entorno

Copiar el archivo de ejemplo y ajustar valores:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Variables disponibles:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del API Backend | `http://localhost:3000/api/v1` |
| `VITE_APP_ENV` | Entorno de ejecución | `development` |
| `VITE_APP_NAME` | Nombre de la aplicación | `VIGIA` |
| `VITE_APP_VERSION` | Versión de la aplicación | `0.1.0` |

## Arranque Local

```bash
# Desde la raíz del monorepo
pnpm dev:frontend

# O directamente desde el directorio del frontend
cd apps/frontend
pnpm dev
```

El servidor de desarrollo estará disponible en: **http://localhost:5173**

## Build de Producción

```bash
pnpm build:frontend
```

Los archivos generados estarán en `apps/frontend/dist/`.

## Estructura de Carpetas (Atomic Design)

```
src/
├── assets/              # Imágenes, logos, fuentes
│   └── logo/
├── components/
│   ├── atoms/           # Componentes mínimos sin lógica de negocio
│   ├── molecules/       # Combinan 2-3 átomos con lógica mínima
│   ├── organisms/       # Secciones completas de UI
│   └── templates/       # Estructura de página (sin datos)
├── config/              # Configuración centralizada (navegación, constantes)
├── pages/               # Páginas por rol (conectan datos + template)
│   ├── propietario/
│   ├── guardia/
│   └── admin/
├── services/            # Cliente HTTP y servicios de API
├── theme/               # Tema MUI con paleta VIGIA
├── App.tsx              # Enrutamiento principal
└── main.tsx             # Entry point
```

## Roles y Rutas

| Rol | Ruta base | Descripción |
|-----|-----------|-------------|
| Propietario | `/propietario/*` | Gestión de vehículos, permisos y alertas |
| Guardia | `/guardia/*` | Cola de eventos, validación y contingencia |
| Admin | `/admin/*` | Gestión de usuarios, reportes y configuración |

## Convenciones

- **Lenguaje ubicuo**: Los nombres visibles en UI usan terminología del dominio DDD (Permiso Temporal, Pase de Acceso Rápido, Persona Autorizada, etc.)
- **Responsive**: Todas las páginas son mobile-first
- **Tipografía**: Exo 2 para headings/marca, Inter para body/UI
- **Paleta**: Definida en `src/theme/vigia-theme.ts` según Manual de Identidad Visual

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build de producción |
| `pnpm lint` | Ejecutar ESLint |
| `pnpm type-check` | Verificar tipos TypeScript |
