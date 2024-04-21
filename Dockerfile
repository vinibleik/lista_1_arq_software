ARG NODE_VERSION=20.12.2-alpine3.19
FROM node:${NODE_VERSION} as build

WORKDIR /app

COPY package*.json .

RUN npm install --dev

COPY . .

RUN npm run build

FROM node:${NODE_VERSION}

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json .

RUN npm install --production

COPY --from=build /app/dist/ ./dist/

COPY src/data/data.json ./src/data/data.json

ENTRYPOINT [ "node", "dist/main.js" ]
