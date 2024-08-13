FROM node:20.15.1-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN chmod +x graphql/schema.graphql

COPY . .

RUN npm run build
RUN npm run build:migrations

FROM node:20.15.1-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist dist
COPY --from=build /app/graphql dist/graphql



EXPOSE 4000

CMD ["node", "dist/src/main/index.js"]