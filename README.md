# 🚨 VIGIA - Monorepo

**Sistema modular de control de acceso vehicular** construido con **NestJS**, **React**, **TypeScript** y arquitectura **Clean Architecture** + **Domain-Driven Design (DDD)**.

> 📦 Este es un **monorepo con pnpm workspaces**. Asegúrate de usar **`pnpm`** en lugar de `npm` o `yarn`.

---

## 📚 Estructura del Proyecto

```
vigia/
├── apps/
│   ├── backend/                 # 🚀 API REST (NestJS)
│   │   ├── src/
│   │   ├── test/
│   │   ├── README.md           # ← Backend documentation
│   │   └── package.json
│   │
│   └── frontend/                # 🎨 UI (React + Vite)
│       ├── src/
│       ├── README.md           # ← Frontend documentation
│       └── package.json
│
├── packages/
│   └── shared-types/            # 🔗 Tipos compartidos
│       ├── src/
│       ├── README.md           # ← Shared types documentation
│       └── package.json
│
├── services/                    # 🤖 Servicios IA (externos)
│   ├── ocr/                     # Reconocimiento de placas
│   └── bio/                     # Biometría y validación
│
├── docs/                        # 📖 Documentación general
├── docker-compose.yml           # 🐳 Servicios en contenedores
├── pnpm-workspace.yaml          # 📦 Configuración del monorepo
└── README.md                    # ← Estás aquí
```

---

## 🚀 Inicio Rápido

### 1️⃣ Prerequisitos

- **Node.js** >= 20.x
- **pnpm** >= 9.x (gestor de paquetes del monorepo)
- **PostgreSQL** >= 14 con extensión `pgvector` (u opcional Docker)

### 2️⃣ Instalación

```bash
# Clonar repositorio
git clone https://github.com/VIGIA-Project/VIGIA.git
cd vigia

# Instalar dependencias de todos los apps
pnpm install

# Verificar estructura
pnpm list --depth=0
```

### 3️⃣ Configurar Ambiente

```bash
# Copiar archivo de ejemplo
cp .env.example apps/backend/.env.local

# Editar con tus valores
nano apps/backend/.env.local
```

### 4️⃣ Base de Datos

**Opción A: Docker (Recomendado)**
```bash
docker-compose up -d postgres
```

**Opción B: PostgreSQL Local**
```bash
psql -U postgres -c "CREATE DATABASE vigia_db;"
psql -U postgres -d vigia_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 5️⃣ Inicializar Base de Datos

```bash
# Compilar backend
pnpm build:backend

# Ejecutar migraciones
pnpm migration:run

# Poblar datos iniciales
pnpm seed
```

### 6️⃣ Iniciar en Desarrollo

**Opción A: Frontend + Backend en paralelo**
```bash
pnpm dev
```

**Opción B: Solo backend**
```bash
pnpm dev:backend
# Accesible en: http://localhost:3000/api/v1 (o el puerto definido en APP_PORT)
# Health check: http://localhost:3000/health
```

**Opción C: Solo frontend**
```bash
pnpm dev:frontend
# Accesible en: http://localhost:5173
```

---

## 📦 Scripts Disponibles

### Nivel de Monorepo

| Comando | Descripción |
|---------|------------|
| `pnpm dev` | Inicia backend + frontend en paralelo |
| `pnpm dev:backend` | Solo servidor backend (watch mode) |
| `pnpm dev:frontend` | Solo servidor frontend (Vite dev server) |
| `pnpm build` | Build de todos los apps |
| `pnpm build:backend` | Build solo del backend |
| `pnpm build:frontend` | Build solo del frontend |
| `pnpm lint` | ESLint en todos los apps |
| `pnpm test` | Jest tests en todos los apps |
| `pnpm migration:run` | Ejecutar migraciones pendientes |
| `pnpm seed` | Poblar datos iniciales de desarrollo |
| `pnpm clean` | Limpiar node_modules y dist globalmente |

### Backend Específico

```bash
pnpm --filter @vigia/backend run start:dev
pnpm --filter @vigia/backend run build
pnpm --filter @vigia/backend run test
pnpm --filter @vigia/backend run test:e2e
```

### Frontend Específico

```bash
pnpm --filter @vigia/frontend run dev
pnpm --filter @vigia/frontend run build
pnpm --filter @vigia/frontend run lint
```

---

## 📋 Documentación por App

### 🚀 Backend

Consulta [`apps/backend/README.md`](./apps/backend/README.md) para:
- Arquitectura (Clean Architecture + DDD)
- 5 Bounded Contexts
- Migraciones y seeds
- Health checks
- API endpoints

### 🎨 Frontend

Consulta [`apps/frontend/README.md`](./apps/frontend/README.md) para:
- Setup del proyecto React
- Variables de entorno
- Build y deployment
- Componentes compartidos

### 🔗 Tipos Compartidos

Consulta [`packages/shared-types/README.md`](./packages/shared-types/README.md) para:
- Cómo usar tipos compartidos
- DTOs disponibles
- Enums comunes

---

## 🗄️ Base de Datos

### Credenciales de Desarrollo

| Campo | Valor |
|-------|-------|
| Host | localhost |
| Puerto | 5432 |
| Usuario | vigia_user |
| Contraseña | vigia_secret |
| BD | vigia_db |

### Admin por Defecto (Seeds)

| Email | Contraseña | Rol | Nota |
|-------|-----------|-----|------|
| admin@uce.edu.ec | password | ADMIN | ⚠️ Cambio obligatorio en primer login |

### Esquema de BD

```
6 esquemas
├── auth (1 tabla)
├── registry (3 tablas)
├── authorization (3 tablas)
├── biometric (3 tablas)
├── access_control (4 tablas)
└── alerting (2 tablas)

Total: 16 tablas, 26 enums, 0 FKs cross-schema
```

---

## 🐳 Docker Compose

El archivo `docker-compose.yml` incluye:

- **PostgreSQL 16 + pgvector** - Base de datos principal
- **OCR Service** - Reconocimiento óptico de caracteres (placas)
- **Bio Service** - Validación biométrica

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Resetear datos
docker-compose down -v
```

---

## 🏥 Health Check

```bash
# Estado completo del sistema
curl http://localhost:3000/health

# Liveness probe (¿vivo?)
curl http://localhost:3000/health/liveness

# Readiness probe (¿listo para tráfico?)
curl http://localhost:3000/health/readiness
```

---

## 📝 Convenciones de Desarrollo

### Nombres de Ramas
```
feature/VIG-123-descripcion
bugfix/VIG-456-descripcion
hotfix/VIG-789-descripcion
```

### Commits
```
feat: agregar login de usuarios
fix: corregir error en validación
docs: actualizar README
refactor: limpiar código
test: agregar tests unitarios
```

### Pull Requests
- Base: `develop` (o `main`)
- Descripción clara
- Linked al issue correspondiente
- Tests pasando

---

## 🤝 Contribución

### 1. Setup Local

```bash
git checkout develop
git pull origin develop
git checkout -b feature/VIG-XXX-descripcion
pnpm install
```

### 2. Desarrollo

```bash
# Iniciar en watch mode
pnpm dev:backend

# En otra terminal
pnpm dev:frontend
```

### 3. Testing

```bash
# Tests unitarios
pnpm test

# E2E
pnpm test:e2e

# Cobertura
pnpm test:cov
```

### 4. Verificación Pre-Commit

```bash
# Lint
pnpm lint

# Format
pnpm format
```

### 5. Push y PR

```bash
git add .
git commit -m "feat: descripción clara"
git push origin feature/VIG-XXX-descripcion
# Crear PR en GitHub
```

---

## 🔐 Seguridad

### Variables Sensibles

Nunca committear:
- `.env` o `.env.local`
- `pnpm-lock.yaml` (en algunas circunstancias)
- Credenciales de BD
- Claves JWT

Usa `.env.example` como referencia.

### Contraseñas de Desarrollo

⚠️ Las contraseñas en seeds son **SOLO para desarrollo local**. En producción:
- Generar contraseñas seguras
- Usar variables de entorno
- Implementar rotación de credenciales

---

## 🚀 Deployment

### Build para Producción

```bash
# Build de ambos apps
pnpm build

# Backend
pnpm build:backend
# Output: apps/backend/dist

# Frontend
pnpm build:frontend
# Output: apps/frontend/dist
```

### Variables de Producción

```bash
# Backend (.env)
NODE_ENV=production
DB_HOST=prod-db.example.com
DB_SSL=true
JWT_SECRET=cambiar-a-valor-seguro
APP_PORT=3000

# Frontend (.env)
VITE_API_URL=https://api.vigia.example.com/api/v1
```

---

## 📚 Recursos

- [NestJS Docs](https://docs.nestjs.com/)
- [React Docs](https://react.dev/)
- [TypeORM Docs](https://typeorm.io/)
- [pnpm Docs](https://pnpm.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD](https://www.domainlanguage.com/ddd/)

---

## 🐛 Troubleshooting

### "pnpm: command not found"

```bash
npm install -g pnpm@11.9.0
pnpm --version
```

### "Cannot find module @vigia/shared-types"

```bash
pnpm install
pnpm clean
pnpm install
```

### "PostgreSQL connection refused"

```bash
docker-compose ps          # Ver estado
docker-compose logs postgres  # Ver logs
docker-compose restart postgres
```

### "Port 3000 already in use"

```bash
# Cambiar en .env
APP_PORT=3001

# O liberar puerto
lsof -i :3000
kill -9 <PID>
```

### "Migraciones no se ejecutaron"

```bash
pnpm build:backend
pnpm migration:run
pnpm seed
```

---

## 📧 Soporte

- 📖 Documentación: Consulta los READMEs de cada app
- 🐛 Issues: Abre un issue en GitHub
- 💬 Discussiones: Usa GitHub Discussions

---

## 📄 Licencia

MIT

---

**Última actualización:** 2026-07-04  
**Versión:** 0.1.0  
**Mantenedor:** VIGIA Team
