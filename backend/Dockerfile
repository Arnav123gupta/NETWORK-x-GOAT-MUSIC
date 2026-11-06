FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN corepack enable && pnpm install --no-frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN corepack enable && pnpm install --prod --no-frozen-lockfile
COPY --from=build /app/dist ./dist
RUN mkdir -p /data
ENV DATABASE_PATH=/data/music-bot.sqlite
ENV WHATSAPP_SESSION_DIR=/data/whatsapp-sessions
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:8787/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server.js"]
