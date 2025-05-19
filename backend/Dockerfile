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
# Копіюємо composer.json і composer.lock — лише для залежностей
COPY composer.json composer.lock ./

# Встановлюємо лише залежності без виконання скриптів
RUN composer update --no-scripts --no-interaction --prefer-dist --optimize-autoloader

# Копіюємо решту проєкту
COPY . .

# Після цього — проганяємо скрипти вручну
RUN composer run-script post-autoload-dump

# Увімкнення модулів Apache
RUN a2enmod rewrite

# Налаштування Laravel
RUN php artisan config:clear && \
    php artisan cache:clear && \
    # php artisan migrate --force && \
    # php artisan db:seed --force && \
    rm -rf public/storage && php artisan storage:link

# Створення директорій
RUN mkdir -p storage/framework/sessions \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Apache конфіг
COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf
