# Используем официальный образ PHP 8.2 с поддержкой FPM
FROM php:8.2-fpm

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    git \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_pgsql

# Устанавливаем Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Устанавливаем Node.js и Yarn для сборки фронтенда
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn

# Устанавливаем рабочий каталог
WORKDIR /var/www/html

# Копируем проект в контейнер
COPY . .

# Устанавливаем зависимости PHP с Composer
RUN composer install --no-dev --optimize-autoloader

# Устанавливаем зависимости фронтенда с Yarn
RUN yarn install --production

# Запускаем процесс PHP-FPM
CMD ["php-fpm"]

# Указываем порт, на котором будет работать контейнер
EXPOSE 9000

# Устанавливаем переменные окружения для Laravel
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV DB_CONNECTION=pgsql
ENV DB_HOST=dpg-cslh3i3v2p9s7385rq80-a
ENV DB_PORT=5432
ENV DB_DATABASE=megastom
ENV DB_USERNAME=megastom_user
ENV DB_PASSWORD=OVqgpi1yhzMC527JGbGqwlNu2UlFyD7v
ENV LOG_CHANNEL=stderr
