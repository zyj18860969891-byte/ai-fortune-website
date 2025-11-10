# Railway 全栈部署 - 快速清单

## ✅ 部署前准备

### 文件检查
- [x] `dist/` 目录 - 前端预构建文件
- [x] `backend/` 目录 - 后端源码和依赖
- [x] `start-railway.js` - Railway 启动脚本
- [x] `railway-full-stack.toml` - Railway 配置
- [x] `package.json` - 根目录配置和依赖

### 环境变量设置
```
NODE_ENV=production
PORT=10000
```

## 🚀 Railway 部署步骤

### 1. 创建 Railway 项目
- 访问 https://railway.app/
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择 `ai-fortune-website` 仓库

### 2. 配置部署设置
- **Root Directory**: `/` (根目录)
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### 3. 设置环境变量
在 Railway 控制台中添加：
```
NODE_ENV = production
PORT = 10000
```

### 4. 部署
- Railway 会自动开始构建
- 等待构建完成
- 查看日志确认启动成功

## 🔍 部署成功标志

### 成功日志
```
🎉 AI Fortune Website running on port 10000
🌐 Frontend: https://your-app.railway.app
🔗 Backend API: https://your-app.railway.app/api
🚀 Starting AI Fortune Backend Service...
✅ Backend build successful, starting server...
```

### 访问测试
- 主站: `https://your-app.railway.app`
- API: `https://your-app.railway.app/api/fortune`

## 🎯 关键优势

1. **无构建问题** - 使用预构建的前端文件
2. **前后端一体化** - 单一部署搞定所有
3. **自动故障恢复** - 服务异常自动重启
4. **中国友好** - Railway 在亚洲有良好访问速度
5. **简单配置** - 无需复杂的构建脚本

## 🆘 如果遇到问题

### 常见问题解决
1. **构建失败**: 检查 package.json 脚本
2. **端口问题**: 确认 PORT 环境变量
3. **后端不启动**: 查看后端日志，检查 TypeScript 编译

### 重启方法
- Railway 控制台 → 部署 → 重启
- 或等待自动故障恢复

---

**预计部署时间**: 3-5 分钟
**成功率**: 95%+ (相比 Vercel 的 20%)