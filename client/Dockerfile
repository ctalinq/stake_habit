FROM node:23-alpine AS build-env
ARG VITE_COMMITER_CONTRACT_ADDRESS
ARG VITE_TON_NETWORK
ENV VITE_COMMITER_CONTRACT_ADDRESS $VITE_COMMITER_CONTRACT_ADDRESS
ENV VITE_TON_NETWORK $VITE_TON_NETWORK
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY blockchain/package*.json ./blockchain/
RUN npm install
COPY . .
RUN npm run compile
RUN npm run build
