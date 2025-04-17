# === Build Stage ===
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# === Production Stage ===
FROM node:23-alpine

WORKDIR /app

# Copy only what's needed to run the app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules


# Optional: prune development dependencies just in case
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["npx", "next", "start"]
