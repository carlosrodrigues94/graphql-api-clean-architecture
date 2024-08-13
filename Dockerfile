FROM node:20.15.1-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm run build:migrations

FROM node:20.15.1-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist dist

EXPOSE 4000

CMD ["npm","run", "start:prod"]