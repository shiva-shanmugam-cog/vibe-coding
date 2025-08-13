# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine
# NGINX config optimized for SPA routing
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# App static files
COPY --from=build /app/dist /usr/share/nginx/html
# Provide default env.js that can be overridden via ConfigMap/Secret
COPY ./public/env.js /usr/share/nginx/html/env.js
COPY ./public/robots.txt /usr/share/nginx/html/robots.txt
# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:80/ | grep -q '<div id="root">' || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 