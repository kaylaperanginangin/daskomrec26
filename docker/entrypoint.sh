#!/bin/sh
set -e

cd /var/www/html

# Install PHP dependencies if vendor is empty
if [ ! -f vendor/autoload.php ]; then
    echo "[entrypoint] Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader --no-dev
fi

# Install Node dependencies & build frontend if needed
if [ ! -d node_modules ]; then
    echo "[entrypoint] Installing npm dependencies..."
    npm ci
fi

if [ ! -d public/build ]; then
    echo "[entrypoint] Building frontend assets..."
    npm run build
fi

# Ensure storage & cache dirs exist and are writable
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Cache config, routes, views
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "[entrypoint] Ready — starting PHP-FPM..."
exec php-fpm
