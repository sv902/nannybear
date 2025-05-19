FROM php:8.2-apache

# Встановлення системних залежностей
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql zip

# Встановлення Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Робоча директорія
WORKDIR /var/www/html/backend

# Копіюємо тільки composer-файли для кешу
COPY composer.json composer.lock ./

# Встановлюємо залежності
RUN composer install --no-scripts --no-interaction --prefer-dist --optimize-autoloader

# Копіюємо весь проєкт
COPY . .

# Увімкнення модулів Apache
RUN a2enmod rewrite

# Створення директорій з правами
RUN mkdir -p storage/framework/sessions storage/app/public && \
    chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Artisan-команди
RUN php artisan config:clear && \
    php artisan cache:clear && \
    php artisan storage:link

# Apache конфіг
COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf
