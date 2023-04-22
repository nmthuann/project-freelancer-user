# Sử dụng image chính thức của NodeJS làm base image
FROM node:14
# Thiết lập thư mục làm việc
# WORKDIR /app

# # Sao chép các file package.json và package-lock.json vào thư mục hiện tại của Docker
# COPY package*.json ./


# # Sao chép tất cả các file trong thư mục hiện tại của bạn vào thư mục /app trên Docker
# COPY . .

# # Mở cổng 3000 để truy cập ứng dụng của bạn
# EXPOSE 3000

# # Chạy NestJS với MySQL và MongoDB
# CMD ["npm", "run", "start:dev"]