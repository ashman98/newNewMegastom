FROM richarvey/nginx-php-fpm:1.7.2

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_pgsql

# Установка переменных окружения
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV DB_CONNECTION pgsql
ENV DB_HOST dpg-cslh3i3v2p9s7385rq80-a
ENV DB_PORT 5432
ENV DB_DATABASE megastom
ENV DB_USERNAME megastom_user
ENV DB_PASSWORD OVqgpi1yhzMC527JGbGqwlNu2UlFyD7v
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# Запуск стартового скрипта (включая деплой)
CMD ["/start.sh"]
