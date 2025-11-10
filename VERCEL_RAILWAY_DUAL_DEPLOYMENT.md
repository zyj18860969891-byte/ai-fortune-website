# Vercel + Railway 双部署配置指南

## 🎯 部署架构

```
🌐 用户访问
    ↓
🚀 Vercel (前端) ←→ Railway (后端API)
    ↓              ↓
⚡ 全球CDN       🎯 AI算命服务
   快速加载        智能推理
```

## 📋 配置文件更新

### 1. vercel.json (前端配置)
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. railway.toml (后端配置)
```toml
[build]
builder = "DOCKERFILE"

[deploy]
startCommand = "node start-railway-simple.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

[build.docker]
buildContext = "."
dockerfilePath = "Dockerfile"

[environments.production]
NODE_ENV = "production"
PORT = 10000
```

### 3. package.json (构建脚本)
```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "start": "node start-railway-simple.js",
    "dev": "node start-railway-simple.js",
    "docker-build": "docker build -t ai-fortune-website .",
    "vercel-build": "cd frontend && npm install && npm run build"
  }
}
```

## 🚀 部署步骤

### 第一步：Vercel前端部署

1. **登录Vercel Dashboard**
   - 访问 https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择 `ai-fortune-website` 仓库

3. **配置项目设置**
   - **Framework**: Vite
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

4. **环境变量配置**
   ```bash
   VITE_RAILWAY_API_URL=https://your-railway-app.railway.app/api
   ```

5. **部署项目**
   - 点击 "Deploy"
   - 等待构建完成

### 第二步：Railway后端部署

1. **登录Railway Dashboard**
   - 访问 https://railway.app
   - 使用GitHub账号登录

2. **连接仓库**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择 `ai-fortune-website` 仓库

3. **配置环境变量**
   ```bash
   MODELSCOPE_API_KEY=your_modelscope_api_key
   MODELSCOPE_MODEL=AI-ModelHub/fortune-telling-model
   MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
   NODE_ENV=production
   PORT=10000
   ```

4. **Dockerfile配置**
   - 确保 "Dockerfile Path": `Dockerfile`
   - Railway会自动检测并使用Docker构建

5. **部署项目**
   - Railway会自动检测到推送的代码
   - 等待Docker构建完成

## 🔗 环境变量配置

### Vercel环境变量
```bash
# 前端调用后端的API地址
VITE_RAILWAY_API_URL=https://your-railway-app.railway.app/api
```

### Railway环境变量
```bash
# ModelScope API配置
MODELSCOPE_API_KEY=ms-xxxxxxxxxxxxxxxx
MODELSCOPE_MODEL=AI-ModelHub/fortune-telling-model
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1

# 服务器配置
NODE_ENV=production
PORT=10000
```

## 🌐 域名配置

### 1. 自定义域名（可选）
- **Vercel**: 在项目设置中添加自定义域名
- **Railway**: 在项目设置中添加自定义域名

### 2. 智能DNS解析
```
# 域名解析配置
api.yourdomain.com  → Railway后端
www.yourdomain.com  → Vercel前端
yourdomain.com      → Vercel前端（重定向到www）
```

## 📊 性能优化

### 前端优化（Vercel）
- ✅ **全球CDN加速** - 静态资源全球分发
- ✅ **边缘计算** - 更快的响应速度
- ✅ **自动压缩** - Gzip/Brotli压缩
- ✅ **HTTP/2** - 多路复用

### 后端优化（Railway）
- ✅ **自动扩缩容** - 根据流量调整资源
- ✅ **负载均衡** - 高可用性
- ✅ **自动HTTPS** - 免费SSL证书
- ✅ **实时监控** - 性能指标

## 🧪 测试验证

### 1. 前端测试
- 访问 Vercel 部署的URL
- 确认页面加载正常
- 检查网络请求是否正确调用Railway API

### 2. 后端测试
- 访问 Railway 部署的URL
- 测试 `/health` 端点
- 验证API响应正常

### 3. 端到端测试
- 在Vercel前端输入问题
- 确认能正确调用Railway后端
- 验证AI推理结果返回

## 📈 监控维护

### Vercel监控
- 构建日志
- 性能指标
- 错误追踪
- 访问统计

### Railway监控
- 实时日志
- 资源使用
- 健康检查
- 自动重启

## 💰 成本估算

### Vercel（前端）
- 免费额度：每月100GB带宽
- 超出：$5/100GB

### Railway（后端）
- 免费额度：每月500小时运行时间
- 超出：$5/500小时

**总成本**：在免费额度内几乎为零！

## 🎯 总结

### 优势
- 🚀 **最佳性能** - 前端CDN加速 + 后端智能部署
- 💰 **成本最低** - 两个平台都有免费额度
- 🔧 **维护简单** - 独立部署，互不影响
- 🌍 **全球访问** - 用户体验最佳

### 下一步
1. 按照指南配置Vercel前端
2. 配置Railway后端
3. 测试端到端功能
4. 配置自定义域名（可选）

现在开始部署吧！🎉