FROM richarvey/nginx-php-fpm:1.7.2
COPY . .

# Install Composer and Yarn
RUN composer install --no-dev --optimize-autoloader
RUN npm install -g yarn
# Run Composer install to get Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Run Yarn install to get JavaScript dependencies
RUN yarn install --production
RUN yarn build

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
