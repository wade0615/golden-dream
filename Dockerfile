#!/bin/bash
FROM node:18-alpine as builder
WORKDIR /home/node
COPY . .
ARG ClientBuildEnv
RUN apk add --update --no-cache make g++ libpng-dev cairo-dev pango-dev libtool
# RUN cd /home/node/client && npm install && npm run build:${ClientBuildEnv}
RUN cd /home/node/client && npm install && npm run build -- ${ClientBuildEnv}
RUN cd /home/node/server && npm install && npm run build
# Runtime image
FROM node:18-alpine
COPY server/package*.json ./home/node/server/
COPY server/env ./home/node/server/env
ARG NODE_CONFIG=config.js
ARG ServerBuildEnv
ENV ServerBuildEnv=${ServerBuildEnv}
RUN apk add --update --no-cache make g++ libpng-dev cairo-dev pango-dev libtool
RUN cd /home/node/server && npm install
#  --production && npm install -g @nestjs/cli
# 複製build 結果
COPY --from=builder ./home/node/client/build ./home/node/client/build
COPY --from=builder ./home/node/client/.env.* ./home/node/client/
COPY --from=builder ./home/node/server/dist ./home/node/server/dist
COPY --from=builder ./home/node/server/tsconfig.build.json ./home/node/server/tsconfig.build.json
COPY --from=builder ./home/node/server/tsconfig.json ./home/node/server/tsconfig.json

WORKDIR /home/node/server

EXPOSE 8080

ENTRYPOINT npm run start:${ServerBuildEnv}