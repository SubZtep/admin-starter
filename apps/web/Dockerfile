FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Install dependencies for the web app from the monorepo root
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY packages ./packages
# RUN bun install --frozen-lockfile
# RUN tree
# COPY . .
RUN bun install

# Copy source code needed for the web build
COPY apps/web ./apps/web
COPY packages ./packages

WORKDIR /app/apps/web
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --chown=bun:bun --from=builder /app/apps/web/.output ./
USER bun

EXPOSE 3000
ENTRYPOINT ["bun", "run", "server/index.mjs"]
