FROM richarvey/nginx-php-fpm:latest
COPY . .

# Install Composer and Yarn
RUN composer clear-cache
RUN composer install --no-dev --optimize-autoloader

RUN apk add --no-cache nodejs npm bash

RUN npm install -g yarn
# Установка Vite локально
RUN yarn add vite

# Установка всех зависимостей JavaScript
RUN yarn install --production --frozen-lockfile



# Run Yarn install to get JavaScript dependencies
RUN yarn install --production
RUN vite build

#COPY scripts/00-laravel-deploy.sh /scripts/00-laravel-deploy.sh
#RUN chmod +x /scripts/00-laravel-deploy.sh
#RUN /scripts/00-laravel-deploy.sh

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
