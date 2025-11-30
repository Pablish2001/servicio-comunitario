FROM php:8.2-fpm

# Extensiones necesarias para Laravel + Filament + PostgreSQL
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    zip unzip \
    && docker-php-ext-install pdo pdo_pgsql zip intl

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["php-fpm"]
