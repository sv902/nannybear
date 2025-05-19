FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql zip

# Встановлюємо Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Переходимо в робочу директорію
WORKDIR /var/www/html

# Копіюємо composer-файли для кешу
COPY composer.json composer.lock ./

    RUN php -m

# Встановлюємо залежності
RUN composer clear-cache && \
    rm -f composer.lock && \
    composer install --no-interaction --prefer-dist --optimize-autoloader


# Копіюємо решту файлів
COPY . .

# Увімкнення модулів Apache
RUN a2enmod rewrite

# Налаштування Laravel
RUN php artisan config:clear && \
    php artisan cache:clear && \
    php artisan migrate --force && \
    php artisan db:seed --force && \
    rm -rf public/storage && php artisan storage:link

# Створення директорій
RUN mkdir -p storage/framework/sessions \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Apache конфіг
COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf
