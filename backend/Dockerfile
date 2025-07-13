# Build stage
FROM node:22 AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile 
COPY . .
RUN pnpm run build

# Production stage
FROM node:22-slim AS production

WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/database.sqlite ./database.sqlite
RUN pnpm install bindings@^1.5.0 prebuild-install@^7.1.1
RUN pnpm install better-sqlite3@11.10.0
RUN cd node_modules/better-sqlite3 && pnpm install && cd /app
CMD ["pnpm", "start"]