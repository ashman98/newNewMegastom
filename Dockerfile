FROM richarvey/nginx-php-fpm:latest

# Копируем файлы приложения
COPY . .

# Устанавливаем Composer и Yarn
RUN composer install --no-dev --optimize-autoloader
RUN apk add --no-cache nodejs npm bash
RUN npm install -g yarn

# Устанавливаем зависимости и собираем приложение через Vite
RUN yarn install --frozen-lockfile
RUN yarn build  # Команда для продакшен-сборки через Vite

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

# Запуск стартового скрипта
CMD ["/start.sh"]
