FROM oven/bun:1-alpine AS builder

COPY package.json bun.lock tsconfig.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages ./packages
RUN bun install

COPY apps/web ./apps/web
COPY packages ./packages

ARG VITE_APP_URL
ENV VITE_APP_URL=$VITE_APP_URL
RUN bun run --filter @app/web build

FROM oven/bun:1-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --chown=root:root --chmod=755 --from=builder /home/bun/app/apps/web/.output ./
USER bun

EXPOSE 3000
CMD ["bun", "run", "server/index.mjs"]
