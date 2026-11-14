FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS dependencies
COPY package*.json ./
COPY packages/common/package*.json ./packages/common/
COPY packages/database/package*.json ./packages/database/
COPY apps/web/package*.json ./apps/web/
RUN npm ci

FROM dependencies AS builder
COPY . .
RUN npm run build --workspace=apps/web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package*.json ./apps/web/

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=apps/web"]
