FROM node:14.15-alpine3.12

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --silent; exit 0

COPY . /usr/src/app

ENV INTROSPECT_ENDPOINT=http://hydra-example:4445/oauth2/introspect

ENTRYPOINT npm run serve

EXPOSE 3000