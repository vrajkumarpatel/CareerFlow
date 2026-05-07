# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Build-time API URL (optional — leave empty when Nginx proxies /api)
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.25-alpine

# envsubst is included in nginx:alpine; gettext provides it on other images
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

# nginx docker image auto-runs envsubst on /etc/nginx/templates/*.template
# BACKEND_HOST defaults to "backend" (docker-compose service name)
ENV BACKEND_HOST=backend

CMD ["nginx", "-g", "daemon off;"]
