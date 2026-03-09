FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock tsconfig.json settings.toml ./
COPY apps/api/package.json ./apps/api/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/shared/package.json ./packages/shared/
RUN bun install

COPY apps/api ./apps/api
COPY packages ./packages

# WORKDIR /app/apps/api
# RUN bun run build
RUN bun run --filter @app/api build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
# COPY --from=deps /app/packages/schemas/node_modules ./packages/schemas/node_modules

EXPOSE 3001
CMD ["bun", "run", "dist/index.js"]
