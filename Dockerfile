# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source code and build the app
COPY . .
RUN pnpm run build

# Run stage
FROM node:20-alpine
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app ./

# Expose the port
EXPOSE 3000

# Enable pnpm
RUN corepack enable pnpm

# Correct start command
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["pnpm", "start"]
