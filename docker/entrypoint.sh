#!/bin/sh
set -e

cd /var/www/html

# Install PHP dependencies if vendor is empty
if [ ! -f vendor/autoload.php ]; then
    echo "[entrypoint] Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader --no-dev
fi

# Install Node dependencies & build frontend if needed
if [ ! -x node_modules/.bin/vite ]; then
    echo "[entrypoint] Installing npm dependencies..."
    npm ci
fi

if [ ! -d public/build ]; then
    echo "[entrypoint] Building frontend assets..."
    npm run build
fi

# Ensure storage & cache dirs exist and are writable
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
find storage bootstrap/cache -type d -exec chmod 775 {} +
find storage bootstrap/cache -type f -exec chmod 664 {} +

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "[entrypoint] Running database migrations..."
    php artisan migrate --force --no-interaction
fi

# Cache config, routes, views
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "[entrypoint] Ready — starting PHP-FPM..."
exec php-fpm
