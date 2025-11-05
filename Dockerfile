FROM node:22-alpine AS builder

WORKDIR /app

# Kopiera package files
COPY package*.json ./

# Installera dependencies
RUN npm ci

# Kopiera all kod
COPY . .

# Bygg applikationen
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app 

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]