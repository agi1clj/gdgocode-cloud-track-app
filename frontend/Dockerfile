# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS build
WORKDIR /app

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/config.template.json /usr/share/nginx/html/config.template.json
COPY docker/40-env-config.sh /docker-entrypoint.d/40-env-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.d/40-env-config.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
