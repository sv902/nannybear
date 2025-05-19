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

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

COPY . .

RUN php artisan migrate --force && php artisan db:seed --force
RUN rm -rf public/storage && php artisan storage:link
RUN a2enmod rewrite

# ✅ ДОДАНО СТВОРЕННЯ ПАПКИ ДЛЯ СЕСІЙ
RUN mkdir -p /var/www/html/storage/framework/sessions \
 && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
 && chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf
