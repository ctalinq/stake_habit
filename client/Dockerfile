FROM node:23-alpine AS build-env
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY blockchain/package*.json ./blockchain/
RUN echo sss
RUN npm install
COPY . .
RUN npm run compile
RUN npm run build
