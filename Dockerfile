# 使用官方Node.js 18镜像FROM node:18

FROM node:18-alpine

WORKDIR /app

# 设置工作目录

WORKDIR /app# Install dependencies

COPY backend/package*.json ./

# 复制package.json和package-lock.jsonRUN npm install

COPY package*.json ./

# Copy source code

# 安装依赖COPY backend/ ./

RUN npm install --production

# Expose port

# 复制整个项目EXPOSE 8080

COPY . .

# Start command

# 构建前端CMD ["node", "dist/simple-test-server.js"]
RUN cd frontend && npm install && npm run build

# 暴露端口
EXPOSE 10000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=10000

# 启动应用
CMD ["node", "start-railway-simple.js"]