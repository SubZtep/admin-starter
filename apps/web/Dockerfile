FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock tsconfig.json settings.toml ./
COPY apps/web/package.json apps/web/package.json
COPY packages ./packages
RUN bun install

COPY apps/web ./apps/web
COPY packages ./packages
RUN bun run --filter @app/web build

# WORKDIR /app/apps/web
# RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --chown=bun:bun --from=builder /app/apps/web/.output ./
USER bun

EXPOSE 3000
ENTRYPOINT ["bun", "run", "server/index.mjs"]
