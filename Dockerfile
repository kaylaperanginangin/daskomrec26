###############################################################################
# Stage 1 — Build frontend assets with Node
###############################################################################
FROM node:20-alpine AS frontend

WORKDIR /app

# Install JS deps first (layer cache)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source needed for Vite build
COPY vite.config.js ./
COPY resources/ ./resources/
COPY public/ ./public/

RUN npm run build

###############################################################################
# Stage 2 — Production PHP image (no nginx, uses artisan serve)
###############################################################################
FROM php:8.4-cli

ENV DEBIAN_FRONTEND=noninteractive \
    APP_ENV=production \
    APP_DEBUG=false

# Install system libs + PHP extensions in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
        git curl ca-certificates unzip \
        libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
        libonig-dev libxml2-dev libzip-dev libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# OPcache production settings
RUN { \
        echo 'opcache.memory_consumption=256'; \
        echo 'opcache.interned_strings_buffer=64'; \
        echo 'opcache.max_accelerated_files=30000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-prod.ini

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps (copy manifests first for layer cache)
COPY composer.json composer.lock ./
RUN composer install --no-interaction --optimize-autoloader --no-dev --no-scripts

# Copy the rest of the application
COPY . .

# Re-run post-autoload-dump scripts now that all files are present
RUN composer dump-autoload --optimize --no-dev

# Bring in compiled frontend assets from Stage 1
COPY --from=frontend /app/public/build ./public/build

# Ensure storage & cache dirs exist and are writable
RUN mkdir -p storage/logs storage/framework/{cache,sessions,views} bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Cache config, routes, views for production
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

EXPOSE 8000

# Run via artisan serve (no nginx needed)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
