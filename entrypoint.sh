#!/bin/sh
set -e

# Migrar y seedear la base de datos
#php artisan migrate --force
#php artisan db:seed

# Limpiar y cachear Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec php artisan serve --host=0.0.0.0 --port=${PORT:-9000}