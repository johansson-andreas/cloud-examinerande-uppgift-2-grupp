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

# Build arguments for environment variables (optional - can be set at build time)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables for build time
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build the Next.js app
RUN npm run build

# ---------- Production stage ----------
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build output
# This includes server.js and only the necessary node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files that Next.js needs to serve
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder (images, fonts, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Set hostname to listen on all interfaces
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Run the standalone server
CMD ["node", "server.js"]
