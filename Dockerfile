# 使用Node.js 18 Alpine镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制所有文件
COPY . .

# 安装依赖（完全禁用脚本）
RUN npm install --production --omit=dev --ignore-scripts --no-optional

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 启动应用
CMD ["node", "start-railway-js-only.js"]