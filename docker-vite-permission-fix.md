# Docker Vite权限问题修复报告

## 问题分析
**错误信息**: `sh: vite: Permission denied`
**根本原因**: Alpine Linux镜像中vite命令没有执行权限
**构建步骤**: `RUN cd frontend && npm install && npm run build`

## 解决方案

### 方法1: 安装开发依赖（当前采用）
```dockerfile
# 安装根目录依赖和开发依赖（包括vite）
RUN npm install

# 在前端目录安装依赖并构建
RUN cd frontend && npm install && npm run build
```

**优点**:
- 确保vite有正确的执行权限
- 包含所有构建所需的依赖

### 方法2: 使用npx运行vite（备用方案）
如果方法1仍然失败，可以修改为:
```dockerfile
RUN cd frontend && npm install && npx vite build
```

### 方法3: 设置执行权限
```dockerfile
RUN cd frontend && npm install && chmod +x node_modules/.bin/vite && npm run build
```

## 当前Dockerfile配置
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install  # 包含开发依赖
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build
EXPOSE 10000
ENV NODE_ENV=production
ENV PORT=10000
CMD ["node", "start-railway-simple.js"]
```

## 预期结果
- ✅ 成功安装所有依赖（包括开发依赖）
- ✅ vite命令获得执行权限
- ✅ 前端构建成功完成
- ✅ Docker镜像构建成功

## 验证步骤
1. 检查Railway构建日志
2. 确认没有权限错误
3. 验证前端构建成功
4. 测试应用启动

## 故障排除
如果仍然遇到权限问题：
1. 检查node_modules/.bin/vite的权限
2. 尝试使用npx vite build
3. 确保Alpine Linux版本兼容性

## 推荐的最终解决方案
如果当前方法无效，建议使用预构建的dist文件夹，避免在Docker中构建前端。