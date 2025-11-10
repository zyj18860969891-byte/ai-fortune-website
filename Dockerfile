# 使用官方Node.js 18镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制根目录的package.json
COPY package*.json ./

# 安装根目录依赖（生产环境）
RUN npm install --production

# 复制前端文件
COPY frontend/ ./frontend/

# 在前端目录安装依赖并使用npx构建
RUN cd frontend && npm install && npx vite build

# 暴露端口
EXPOSE 10000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=10000

# 启动应用
CMD ["node", "start-railway-simple.js"]