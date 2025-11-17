FROM node:18-alpine

WORKDIR /app

# 复制所有文件（包括backend目录）
COPY . .

# 复制 package.json 和 package-lock.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# 安装生产依赖
RUN npm install --production --omit=dev

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 启动应用
CMD ["node", "start-railway-js-only.js"]