# Sử dụng image chính thức của NodeJS làm base image
FROM node:18-alpine

ENV NODE_ENV=development

# Thiết lập thư mục làm việcproject-freelancer-user
WORKDIR /app

# # Sao chép các file package.json và package-lock.json vào thư mục hiện tại của Docker
COPY package*.json yarn.lock ./
COPY ./src ./src

# # Sao chép tất cả các file trong thư mục hiện tại của bạn vào thư mục /app trên Docker
COPY . .

# # # Mở cổng 3000 để truy cập ứng dụng của bạn
# EXPOSE 8080

# # Chạy NestJS với MySQL và MongoDB
CMD ["yarn", "start:dev"]

RUN yarn install

# Install NestJS globally
RUN yarn global add @nestjs/cli

# Set the path to the NestJS binary
ENV PATH="/app/node_modules/.bin:$PATH"