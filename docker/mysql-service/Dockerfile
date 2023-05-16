FROM php:8.1.2-apache

# Install required PHP extensions
RUN docker-php-ext-install mysqli curl mbstring

# Install and configure Apache
RUN a2enmod rewrite

# Install MySQL client
RUN apt-get update && \
    apt-get install -y default-mysql-client

# Copy the application files to the container
COPY . /var/www/html/

# Set the working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]