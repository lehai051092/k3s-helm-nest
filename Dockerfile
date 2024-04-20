# Bước 1: Xây dựng container từ Node.js
FROM node:18-alpine as builder

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (hoặc yarn.lock nếu bạn sử dụng yarn)
COPY package*.json ./

# Cài đặt tất cả các dependencies
RUN npm install

# Sao chép mã nguồn của ứng dụng vào trong container
COPY . .

# Biên dịch ứng dụng TypeScript thành JavaScript
RUN npm run build

# Bước 2: Tạo container nhỏ gọn cho production
FROM node:18-alpine as production

WORKDIR /usr/src/app

# Sao chép các dependencies cần thiết và built code từ bước builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Sao chép file .env.prod vào trong container và đổi tên thành .env
COPY .env.prod ./.env

# Mở port mà ứng dụng sẽ chạy trên đó
EXPOSE 7777

# Chạy ứng dụng
CMD ["node", "dist/main"]
