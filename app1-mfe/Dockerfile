# ──────────────────────────────────────────────────────────────
# 1) BUILDER: webpack (Node LTS) → outputs dist/
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Precompress text assets (skip images/media that are already compressed)
# Keep .zst, .br and .gz for max compatibility; nginx will pick best.
RUN apk add --no-cache brotli zstd gzip \
 && find dist -type f \( \
     -name '*.js' -o -name '*.mjs' -o -name '*.css' -o -name '*.html' \
     -o -name '*.json' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' \
     -o -name '*.wasm' -o -name '*.ico' -o -name '*.map' -o -name '*.woff' -o -name '*.woff2' \
   \) -exec sh -c 'for f; do \
       zstd -19 -f -o "$f.zst" "$f"; \
       brotli -Z -f "$f" -o "$f.br"; \
       gzip -9 -c "$f" > "$f.gz"; \
   done' sh {} +

# ──────────────────────────────────────────────────────────────
# 2) RUNTIME: NGINX (Alpine) with zstd/brotli static modules
# ──────────────────────────────────────────────────────────────
FROM alpine:3.20 AS runtime

# NGINX + compression modules
RUN apk add --no-cache \
      nginx \
      nginx-mod-http-brotli \
      nginx-mod-http-zstd \
      ca-certificates wget

# Create required dirs and set permissions for non-root run
RUN adduser -D -H -s /sbin/nologin nginx || true \
 && mkdir -p /var/cache/nginx /var/run/nginx /etc/nginx/conf.d /usr/share/nginx/html \
 && chown -R nginx:nginx /var/cache/nginx /var/run/nginx /usr/share/nginx/html

# Copy site content and nginx config
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

USER nginx

EXPOSE 8080

# Healthcheck hits /healthz (defined in nginx.conf)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx","-g","daemon off;"]