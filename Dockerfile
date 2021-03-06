FROM node:0.10.36
MAINTAINER Roman Shtylman <shtylman@gmail.com>

RUN npm i -g npm@2.2.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json /usr/src/app/package.json
ADD models /usr/src/app/models

RUN npm install --production

ADD . /usr/src/app
