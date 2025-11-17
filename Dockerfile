FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装生产依赖
RUN npm install --production

# 复制应用文件
COPY . .

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 启动应用
CMD ["node", "start-railway-js-only.js"]