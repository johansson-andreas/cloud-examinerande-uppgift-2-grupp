# ---------- Build stage ----------
FROM node:22-alpine AS builder

# Create and set working directory
WORKDIR /app

# Copy only package files first (better layer caching)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy all source code
COPY . .

# Build the Next.js app
RUN npm run build
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy built app and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["npm", "start"]
