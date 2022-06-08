FROM "node:16-alpine" as builder
ARG NODE_ENV
ARG BUILD_FLAG
RUN npm install -g pnpm
WORKDIR /app/builder
COPY . .
RUN pnpm i
