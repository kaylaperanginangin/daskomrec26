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
# Stage 2 — Production PHP-FPM image (served by Nginx reverse-proxy)
###############################################################################
FROM php:8.4-fpm-alpine

ENV APP_ENV=production \
    APP_DEBUG=false

# Install system libs + PHP extensions in one layer
RUN apk add --no-cache \
        git curl ca-certificates unzip \
        freetype-dev libjpeg-turbo-dev libpng-dev \
        oniguruma-dev libxml2-dev libzip-dev icu-dev linux-headers \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache \
    && apk del --no-cache linux-headers \
    && rm -rf /tmp/* /var/cache/apk/*

# OPcache production settings
RUN { \
        echo 'opcache.memory_consumption=256'; \
        echo 'opcache.interned_strings_buffer=64'; \
        echo 'opcache.max_accelerated_files=30000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-prod.ini

# PHP-FPM pool tuning
RUN { \
        echo '[www]'; \
        echo 'pm = dynamic'; \
        echo 'pm.max_children = 20'; \
        echo 'pm.start_servers = 4'; \
        echo 'pm.min_spare_servers = 2'; \
        echo 'pm.max_spare_servers = 6'; \
        echo 'pm.max_requests = 500'; \
    } > /usr/local/etc/php-fpm.d/zz-tuning.conf

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

# Clean up build-only tools
RUN rm -f /usr/bin/composer \
    && apk del --no-cache git \
    && rm -rf tests docs .github .git node_modules /tmp/* /var/cache/apk/*

# PHP-FPM runs on port 9000 by default
CMD ["php-fpm"]
