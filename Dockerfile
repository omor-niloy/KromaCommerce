# ==============================================================================
# Multi-stage Dockerfile for KromaCommerce Microservices / Consolidated Gateway
# ==============================================================================

FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS dependencies
COPY package*.json ./
COPY packages/common/package*.json ./packages/common/
COPY packages/database/package*.json ./packages/database/
COPY apps/gateway/package*.json ./apps/gateway/
COPY apps/auth-service/package*.json ./apps/auth-service/
COPY apps/catalog-service/package*.json ./apps/catalog-service/
COPY apps/order-service/package*.json ./apps/order-service/
COPY apps/scraper-service/package*.json ./apps/scraper-service/
COPY apps/web/package*.json ./apps/web/
RUN npm ci

FROM dependencies AS builder
COPY . .
RUN npm run db:generate --workspace=packages/database
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000
ENV CONSOLIDATED_MODE=true

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps ./apps

EXPOSE 8000
CMD ["npm", "run", "start", "--workspace=apps/gateway"]
