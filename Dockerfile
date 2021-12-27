FROM node:16-alpine as dev

WORKDIR /home/node/app

RUN yarn
