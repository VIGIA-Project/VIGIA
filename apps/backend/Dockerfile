# Etapa 1: Construcción (Builder)
FROM node:22 AS builder

# Instalar pnpm globalmente con la versión del workspace
RUN npm install -g pnpm@11.9.0

WORKDIR /app

# Copiar archivos de configuración de dependencias de la raíz
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Instalar dependencias del monorrepósito
RUN pnpm install --frozen-lockfile

# Copiar el código fuente completo del monorrepósito
COPY packages/shared-types ./packages/shared-types/
COPY apps/backend ./apps/backend/

# Compilar backend
RUN pnpm --filter @vigia/backend build

# Desplegar de forma aislada las dependencias de producción del backend
# Este comando crea un directorio autónomo de producción con su node_modules ya resuelto
RUN pnpm --filter @vigia/backend --prod deploy /prod/backend --legacy

# Copiar la carpeta compilada 'dist' al directorio de deploy
RUN cp -r apps/backend/dist /prod/backend/dist

# Etapa 2: Ejecución en Producción (Runner)
FROM node:22-alpine AS runner

WORKDIR /app

# Copiar los artefactos de producción y dependencias resueltas de la etapa builder
COPY --from=builder /prod/backend /app

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación NestJS
CMD ["node", "dist/main.js"]
