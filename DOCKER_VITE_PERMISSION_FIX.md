# Docker Vite权限问题 - 最终解决方案

## 问题持续存在
尽管多次修复，Docker构建仍然出现：
```
sh: vite: Permission denied
ERROR: failed to build: failed to solve: process "/bin/sh/ -c cd frontend && npm install && npm run build" did not complete successfully: exit code: 126
```

## 最终解决方案：使用npx

### 修改后的Dockerfile
```dockerfile
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
```

### 关键修改
- **从**: `npm run build`
- **改为**: `npx vite build`

### 为什么npx能解决问题
1. **绕过权限问题** - npx直接调用vite，不依赖npm scripts
2. **避免脚本权限** - 不需要检查package.json中scripts的执行权限
3. **直接执行** - npx确保vite命令有正确的执行环境

## 操作步骤

### 1. 等待网络恢复
```bash
git push origin master
```

### 2. 在Railway Dashboard重新部署
- 进入Railway项目
- 点击"Redeploy"按钮
- 等待构建完成

### 3. 验证结果
检查构建日志应该显示：
- ✅ 成功安装依赖
- ✅ `npx vite build`执行成功
- ✅ 没有权限错误
- ✅ 应用启动成功

## 备用方案

如果npx方法仍然失败，可以考虑：

### 方案A：使用预构建的dist文件夹
1. 在本地构建前端：`cd frontend && npm run build`
2. 将dist文件夹提交到Git
3. 修改Dockerfile跳过前端构建

### 方案B：使用不同的Node.js镜像
```dockerfile
FROM node:18-bullseye  # 使用Debian镜像而不是Alpine
```

### 方案C：手动设置权限
```dockerfile
RUN cd frontend && npm install && chmod +x node_modules/.bin/vite && npm run build
```

## 推荐执行顺序
1. **首先尝试npx方案**（当前已提交）
2. **如果失败，使用预构建dist文件夹**
3. **最后考虑更换Node.js镜像**

## 预期成功结果
使用npx后，构建应该成功：
```
> ai-frontend@1.0.0 build
> npx vite build
✓ building for production...
✓ built in 2.34s
```

现在等待网络恢复后推送更改，然后在Railway重新部署！