#!/bin/bash

# Применение миграций и запуск сидера
php artisan migrate --force
php artisan db:seed --class=PatientSeeder

# Очистка и кеширование конфигураций, маршрутов и представлений
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Генерация нового ключа приложения (если необходимо)
php artisan key:generate --force

# Перезапуск очередей
#php artisan queue:restart

# Установка разрешений для хранения и кеша
#chmod -R 775 storage
#chmod -R 775 bootstrap/cache

# Создание символической ссылки для хранения
php artisan storage:link

# Установка разрешений для других необходимых директорий
#chmod -R 775 public
#chmod -R 775 resources
