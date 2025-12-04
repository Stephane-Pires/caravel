# 1️⃣ Builder stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# 2️⃣ Production stage
FROM node:22-alpine AS runner

RUN curl -sfS https://dotenvx.sh/install.sh | sh -s -- -b /usr/local/bin

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts


# Copy build artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.contentlayer ./.contentlayer
COPY --from=builder /app/.env.production ./.env.production

# Start the app
EXPOSE 3000
CMD ["dotenvx", "run", "--env-file=.env.production", "--", "npm", "run", "start"]