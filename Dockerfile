FROM richarvey/nginx-php-fpm:1.7.2

COPY . .

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV DB_CONNECTION pgsql
ENV DB_HOST dpg-cslh3i3v2p9s7385rq80-a
ENV DB_PORT 5432
ENV DB_DATABASE megastom
ENV DB_USERNAME megastom_user
ENV DB_PASSWORD OVqgpi1yhzMC527JGbGqwlNu2UlFyD7v


# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]
