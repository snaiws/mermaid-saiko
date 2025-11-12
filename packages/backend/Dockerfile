# Stage 1: Build
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /workspace

# Copy monorepo root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all packages
COPY packages ./packages

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm --filter @mermaid-saiko/shared build

# Build backend
RUN pnpm --filter @mermaid-saiko/backend build

# Stage 2: Production
FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /workspace

# Install Chromium and dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-cjk

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy monorepo root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy packages
COPY packages/shared ./packages/shared
COPY packages/backend/package.json ./packages/backend/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Build shared in production
WORKDIR /workspace/packages/shared
RUN pnpm build

# Copy backend built files from builder stage
WORKDIR /workspace/packages/backend
COPY --from=builder /workspace/packages/backend/dist ./dist

# Copy public files (fonts)
COPY packages/backend/public ./public

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/main.js"]
