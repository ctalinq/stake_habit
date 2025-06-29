FROM node:20-alpine AS build-env
COPY . /app/
WORKDIR /app
RUN npm i
RUN npm run build
