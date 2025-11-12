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

# Build frontend
RUN pnpm --filter @mermaid-saiko/frontend build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /workspace/packages/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
