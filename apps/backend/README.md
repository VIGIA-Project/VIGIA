# 🚨 VIGIA - Sistema de Control de Acceso Vehicular

Sistema modular de control de acceso vehicular construido con **NestJS**, **TypeScript** y **Clean Architecture** con principios de **Domain-Driven Design (DDD)**.

> **Nota:** Este es un **monorepo** con pnpm workspaces. Asegúrate de usar `pnpm` en lugar de `npm`.

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
apps/backend/src/
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

- **Node.js** >= 18.x
- **pnpm** >= 9.x (gestor de paquetes del monorepo)
- **PostgreSQL** >= 14 con extensión `pgvector`
- **Docker** (opcional, para PostgreSQL en contenedor)

### Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd vigia

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Configurar variables de entorno
cp .env.example apps/backend/.env.local
# Editar apps/backend/.env.local con tus valores

# 4. Inicializar base de datos (opción A: Docker)
docker-compose up -d postgres

# O (opción B: PostgreSQL local)
psql -U postgres -c "CREATE DATABASE vigia_db;"
psql -U postgres -d vigia_db -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 5. Ejecutar migraciones
pnpm --filter @vigia/backend run build
pnpm --filter @vigia/backend run migration:run

# 6. Poblar datos iniciales (seeds)
pnpm --filter @vigia/backend run seed

# 7. Iniciar en desarrollo
pnpm dev:backend
```

### Verificación desde Cero (Clean DB)

```bash
# 1. Resetear la base de datos
docker-compose down -v
docker-compose up -d postgres

# Esperar 5 segundos a que PostgreSQL esté listo
sleep 5

# 2. Compilar el proyecto
pnpm --filter @vigia/backend run build

# 3. Ejecutar migraciones
pnpm --filter @vigia/backend run migration:run

# 4. Poblar datos iniciales
pnpm --filter @vigia/backend run seed

# 5. Iniciar servidor
pnpm dev:backend
```

Si todo está correcto, deberías ver:
```
✅ Conexión a base de datos establecida
🌱 Ejecutando seeds iniciales...
✅ Seeds completados.
🚨 VIGIA arrancado en: http://localhost:3000/api/v1
🏥 Health check en: http://localhost:3000/health
```

---

## 📜 Scripts Disponibles

### Backend

```bash
# Desarrollo
pnpm dev:backend              # Servidor en modo watch
pnpm --filter @vigia/backend run start:dev

# Compilación y producción
pnpm build:backend            # Compilar TypeScript
pnpm --filter @vigia/backend run start:prod

# Testing
pnpm test                      # Tests unitarios de todos los apps
pnpm test:e2e                 # E2E tests

# Base de datos
pnpm migration:run            # Ejecutar migraciones pendientes
pnpm migration:revert         # Revertir última migración
pnpm seed                      # Poblar datos iniciales

# Calidad de código
pnpm lint                      # ESLint en todos los apps
pnpm format                    # Prettier en todos los apps
```

### Disponibles a Nivel de Monorepo

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Inicia backend + frontend en paralelo |
| `pnpm dev:backend` | Solo backend |
| `pnpm dev:frontend` | Solo frontend |
| `pnpm build` | Build de todos los apps |
| `pnpm lint` | Lint de todos los apps |
| `pnpm test` | Tests de todos los apps |
| `pnpm clean` | Limpia node_modules y dist de todos los apps |

---

## 🏥 Health Check Endpoints

Los endpoints de health **no llevan el prefijo** `api/v1`:

| Endpoint | Propósito | Uso típico |
|----------|-----------|------------|
| `GET /health` | Estado completo con todos los checks | Monitoreo general |
| `GET /health/liveness` | ¿Está vivo el proceso? | Kubernetes liveness probe |
| `GET /health/readiness` | ¿Listo para recibir tráfico? | Kubernetes readiness probe |

### Ejemplo de respuesta `/health`

```bash
curl http://localhost:3000/health
```

```json
{
  "status": "ok",
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "0.1.0",
  "checks": {
    "database": { 
      "status": "up", 
      "responseTime": 5 
    },
    "memory": { 
      "status": "up", 
      "details": { 
        "heapUsedMB": 45, 
        "heapTotalMB": 120,
        "heapUsagePercent": 37
      } 
    },
    "uptime": { 
      "status": "up", 
      "details": { 
        "uptimeSeconds": 3600,
        "startedAt": "2024-01-15T10:00:00.000Z"
      }
    }
  }
}
```

---

## 🗄️ Base de Datos

### Opción 1: PostgreSQL con Docker (Recomendado)

```bash
# Iniciar PostgreSQL + servicios IA (OCR, Biometric)
docker-compose up -d

# Ver logs
docker-compose logs -f postgres

# Detener
docker-compose down

# Limpiar volúmenes (resetear BD)
docker-compose down -v
```

### Opción 2: PostgreSQL Local

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE vigia_db;"

# Crear extensión pgvector
psql -U postgres -d vigia_db -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Ejecutar migraciones
pnpm --filter @vigia/backend run migration:run
```

### Credenciales de Desarrollo

| Email | Contraseña | Rol | Nota |
|---|---|---|---|
| admin@uce.edu.ec | password | ADMIN | ⚠️ Cambio obligatorio en primer login |

### Esquema de Base de Datos

| Esquema | Tablas | Descripción |
|---|---|---|
| auth | 1 | Usuarios y autenticación |
| registry | 4 | Personas, vehículos, asignaciones de rol |
| authorization | 3 | Permisos permanentes, temporales, pases rápidos |
| biometric | 3 | Perfiles, representaciones, validaciones |
| access_control | 4 | Eventos, revisiones humanas, contingencias, invitados |
| alerting | 2 | Alertas, notificaciones |

**Total:** 6 esquemas, 17 tablas, 26 enums, 0 FKs cross-schema.

---

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests con cobertura
pnpm test:cov

# E2E tests
pnpm test:e2e

# Watch mode
pnpm test:watch
```

---

## 📡 Alerting (MVP)

- **Canales soportados:** In-App (por defecto)
- **Opcional:** Telegram (`TELEGRAM_ENABLED=true` en `.env`)

---

## 🚀 Deployment

### Compilación para Producción

```bash
# Build de todos los servicios
pnpm build

# Build solo del backend
pnpm build:backend

# Ver output compilado
ls -la apps/backend/dist
```

### Variables de Entorno en Producción

Copia `.env.example` a `.env` y ajusta:

```env
NODE_ENV=production
APP_PORT=3000
JWT_SECRET=your_production_secret_here
DB_HOST=production-db-host
DB_PASSWORD=production_db_password
DB_SSL=true
```

**⚠️ NUNCA committear `.env` en producción.**

---

## 🤝 Contribución

### Reglas de Arquitectura

1. ✅ Cada BC es independiente — no romper contratos de `@shared/interfaces/contracts`
2. ✅ El dominio (`domain/`) no debe importar nada de NestJS ni TypeORM
3. ✅ Los casos de uso (`application/use-cases/`) solo dependen de interfaces de dominio
4. ✅ Toda lógica de base de datos va en `infrastructure/repositories/`

### Workflow de Desarrollo

```bash
# 1. Crear rama desde dev
git checkout dev
git pull origin dev
git checkout -b feature/VIG-XXX-descripcion

# 2. Desarrollar con watch mode
pnpm dev:backend

# 3. Tests antes de push
pnpm test
pnpm lint

# 4. Commit y push
git push origin feature/VIG-XXX-descripcion

# 5. Crear Pull Request contra 'dev'
```

---

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

## 🐛 Troubleshooting

### "Cannot find module @vigia/shared-types"

```bash
# Reinstalar workspace
pnpm install
```

### "Database connection refused"

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Ver logs
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres
```

### "Port 3000 already in use"

```bash
# Cambiar puerto en .env
APP_PORT=3001

# O liberar puerto
lsof -i :3000
kill -9 <PID>
```

### "pnpm: command not found"

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar versión
pnpm --version
```

---

## 📧 Soporte

Para preguntas o problemas, abre un issue en el repositorio.
