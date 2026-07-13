# Etapa 1: Construcción (Builder)
FROM node:22 AS builder

RUN npm install -g pnpm@11.9.0

WORKDIR /app

# Copiar archivos del workspace de pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Instalar dependencias del workspace
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY packages/shared-types ./packages/shared-types/
COPY apps/frontend ./apps/frontend/

# Compilar frontend para producción
RUN pnpm --filter @vigia/frontend build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:1.25-alpine AS runner

# Copiar configuración personalizada de Nginx
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los recursos compilados estáticos del frontend
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
