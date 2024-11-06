FROM richarvey/nginx-php-fpm:latest

# Копируем файлы приложения
COPY . .

# Устанавливаем Composer и Yarn
#RUN composer install --no-dev --optimize-autoloader
RUN apk add --no-cache nodejs npm bash
RUN npm install -g yarn

# Устанавливаем зависимости и собираем приложение через Vite
#RUN yarn install --frozen-lockfile
#RUN yarn build  # Команда для продакшен-сборки через Vite

# Установка переменных окружения
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# Запуск стартового скрипта
CMD ["/start.sh"]
