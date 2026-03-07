###############################################################################
# Runtime-only PHP-FPM image (app code is bind-mounted via docker-compose)
###############################################################################
FROM php:8.4-fpm-alpine

ENV APP_ENV=production \
    APP_DEBUG=false

# Install system libs + PHP extensions in one layer
RUN apk add --no-cache \
        git curl ca-certificates unzip npm nodejs \
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

# Composer (kept for runtime use: install/update after mount)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Entrypoint: installs deps & builds frontend on first run
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
