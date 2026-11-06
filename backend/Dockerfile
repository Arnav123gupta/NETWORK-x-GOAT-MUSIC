FROM node:22-bookworm-slim
WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 8787

CMD ["npm", "start"]
