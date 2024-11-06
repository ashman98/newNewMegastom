#!/usr/bin/env bash

echo "Running composer"
composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

# Run migrations
php artisan migrate --force
php artisan db:seed PatientSeeder
echo 'Migrate success';

# Clear and cache configuration
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Generate new application key (if needed)
#php artisan key:generate

# If you're using queues, make sure they are set up
php artisan queue:restart

# Set permissions for storage and cache folders
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Create a symbolic link for storage
php artisan storage:link

# Set permissions for public and other necessary directories (if needed)
chmod -R 775 public
chmod -R 775 resources

# Install and build frontend assets
npm install
yarn install --frozen-lockfile
yarn build
