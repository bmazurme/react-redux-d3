FROM node:16-alpine AS base
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash
WORKDIR /usr/src/app
RUN npm config set cache /usr/src/app/.npm-cache --global
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
LABEL version="1.0"
LABEL description="tmp"

FROM base AS dev-deps
ENV NODE_ENV development
COPY package*.json ./
RUN npm install

FROM base AS prod-deps
COPY --from=dev-deps /usr/src/app/.npm-cache/ /usr/src/app/.npm-cache/
COPY package*.json ./
RUN npm install --production --prefer-offline
RUN rm -rf /usr/src/app/.npm-caches

FROM base AS builder
COPY --from=dev-deps /usr/src/app/ .
COPY . .
RUN npm run build
RUN find . -name node_modules | xargs rm -rf

FROM base AS runner
COPY --from=prod-deps /usr/src/app/ .
COPY --from=builder /usr/src/app/ .
CMD ["node", "dist/server"]
