FROM node:18.16.0-alpine3.18 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install --no-audit --silent

COPY . ./

RUN npm run build


FROM node:18.16.0-alpine3.18 AS production-stage
WORKDIR /app
COPY --from=build-stage /app/build ./

