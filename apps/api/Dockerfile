FROM oven/bun:1-alpine AS builder

COPY package.json bun.lock tsconfig.json settings.toml ./
COPY apps/api/package.json ./apps/api/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/shared/package.json ./packages/shared/
RUN bun install

COPY apps/api ./apps/api
COPY packages ./packages
RUN bun run --filter @app/api build

FROM oven/bun:1-alpine AS runner
ENV NODE_ENV=production

COPY --chown=bun:bun --from=builder /home/bun/app/apps/api/dist ./dist
USER bun

EXPOSE 3001
CMD ["bun", "run", "dist/server.js"]
