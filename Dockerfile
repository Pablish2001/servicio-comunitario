# 1️⃣ Imagen base PHP 8.3 FPM
FROM php:8.3-fpm

# 2️⃣ Instalar dependencias del sistema y extensiones PHP
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    curl \
    ca-certificates \
    gnupg \
    lsb-release \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        zip \
        bcmath \
        mbstring \
        fileinfo \
        intl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3️⃣ Instalar Node.js 20 + npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 4️⃣ Instalar Composer global
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 5️⃣ Crear directorio de la app
WORKDIR /var/www

# 6️⃣ Copiar archivos de dependencias para cachear la build
COPY composer.json composer.lock ./
COPY package.json package-lock.json* ./
COPY . .

# 7️⃣ Instalar dependencias
RUN php -d memory_limit=-1 /usr/bin/composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

COPY . .

# 9️⃣ Cache de Laravel
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache
RUN php artisan optimize

# 10️⃣ Exponer puerto de la app
EXPOSE 9000

# 11️⃣ CMD seguro en formato JSON
CMD ["sh", "-c", "./entrypoint.sh"]
