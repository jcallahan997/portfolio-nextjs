FROM --platform=linux/amd64 python:3.11-slim AS base

# ── System deps ──
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        nginx \
        supervisor \
        && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Frontend build ──
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci --production=false

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Copy static files to standalone directory for Next.js standalone mode
RUN cp -r frontend/public frontend/.next/standalone/public && \
    cp -r frontend/.next/static frontend/.next/standalone/.next/static

# ── Backend deps ──
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/

# ── Nginx config ──
RUN rm -f /etc/nginx/sites-enabled/default
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# ── Supervisord config ──
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ── Health check ──
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl --fail http://localhost/api/health || exit 1

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
