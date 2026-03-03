FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN bun install

FROM deps AS build
COPY . .
RUN bun run --filter @app/api build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
# COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
EXPOSE 3001
CMD ["bun", "run", "dist/index.js"]
