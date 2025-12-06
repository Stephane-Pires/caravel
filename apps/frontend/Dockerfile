# 1️⃣ Builder stage
# FROM node:22.21.1-alpine@sha256:9632533eda8061fc1e9960cfb3f8762781c07a00ee7317f5dc0e13c05e15166f AS builder
FROM node:24.11.1-alpine@sha256:682368d8253e0c3364b803956085c456a612d738bd635926d73fa24db3ce53d7 AS builder

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
# FROM node:22.21.1-alpine@sha256:9632533eda8061fc1e9960cfb3f8762781c07a00ee7317f5dc0e13c05e15166f AS runner
FROM node:24.11.1-alpine@sha256:682368d8253e0c3364b803956085c456a612d738bd635926d73fa24db3ce53d7 AS runner

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