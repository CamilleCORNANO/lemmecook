# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN pnpm install

COPY --from=builder /app/dist ./dist
COPY public ./public
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./

EXPOSE 5173

CMD ["pnpm", "preview"]
