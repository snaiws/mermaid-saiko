# Stage 1: Build
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /workspace

# Copy dependency files first for better caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile --prefer-offline

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

# Build shared first, then backend
RUN pnpm --filter @mermaid-saiko/shared build && \
    pnpm --filter @mermaid-saiko/backend build

# Stage 2: Production
FROM node:22-alpine

# Install pnpm and Chromium
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-cjk

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

WORKDIR /workspace

# Copy dependency files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --prefer-offline

# Copy built files from builder
COPY --from=builder /workspace/packages/shared/dist ./packages/shared/dist
COPY --from=builder /workspace/packages/backend/dist ./packages/backend/dist

# Copy source files for shared (needed for type definitions)
COPY packages/shared/src ./packages/shared/src

# Copy public files
COPY packages/backend/public ./packages/backend/public

WORKDIR /workspace/packages/backend

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/main.js"]
