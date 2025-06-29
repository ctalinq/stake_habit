FROM node:23-alpine AS build-env
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
RUN npm install
COPY . .
RUN npm run build
