# 🚀 Vercel前端部署完整指南

## 📋 部署前准备

### 1. 后端服务状态
- ✅ **Railway后端**: https://ai-fortune-website-production.up.railway.app
- ✅ **完整AI算命功能**: ModelScope AI + 八字MCP服务
- ✅ **API接口**: `/api/fortune/chat`, `/api/fortune/status`, `/api/fortune/types`
- ⏳ **等待部署**: 需要等待GitHub推送后Railway更新

### 2. 前端项目结构
```
ai-fortune-website/
├── frontend/                 # React + Vite项目
│   ├── dist/                # 构建输出目录
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── pages/          # 页面
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js后端
└── railway.toml            # Railway配置
```

## 🛠️ Vercel部署步骤

### 步骤1: 更新前端配置

#### 1.1 修改Vite配置
更新 `frontend/vite.config.ts` 以适应生产环境：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ai-fortune-website-production.up.railway.app',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
```

#### 1.2 创建环境变量文件
创建 `frontend/.env.production`：

```env
VITE_API_BASE_URL=https://ai-fortune-website-production.up.railway.app
VITE_API_TIMEOUT=30000
VITE_APP_NAME=AI智慧占卜
VITE_APP_VERSION=1.0.0
```

#### 1.3 更新API调用配置
在 `frontend/src/components/WeChatChatInterface.tsx` 中更新API基础URL：

```typescript
// 在文件顶部添加
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-fortune-website-production.up.railway.app';

// 修改fetch调用
const response = await fetch(`${API_BASE_URL}/api/fortune/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: inputText.trim(),
    type: fortuneType,
    context: messages.slice(-6).map(m => `${m.type === 'user' ? '用户' : '占卜师'}: ${m.content}`).join('\n')
  }),
});
```

### 步骤2: 构建前端项目

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 构建项目
npm run build

# 检查构建结果
ls -la dist/
```

### 步骤3: 部署到Vercel

#### 方式A: 通过Vercel CLI（推荐）

1. **安装Vercel CLI**
```bash
npm install -g vercel
```

2. **登录Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
# 在项目根目录执行
vercel --prod

# 或者指定前端目录
vercel --prod frontend
```

4. **配置部署**
- 选择账户
- 选择项目名称: `ai-fortune-website` 或 `ai-fortune-frontend`
- 设置构建命令: `cd frontend && npm install && npm run build`
- 设置输出目录: `frontend/dist`
- 设置安装命令: `cd frontend && npm install`

#### 方式B: 通过GitHub集成

1. **连接GitHub仓库**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择GitHub仓库 `ai-fortune-website`

2. **配置项目**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

3. **配置环境变量**
   - 在Vercel项目设置中添加环境变量：
   - `VITE_API_BASE_URL`: `https://ai-fortune-website-production.up.railway.app`
   - `VITE_API_TIMEOUT`: `30000`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 步骤4: 域名配置（可选）

1. **自定义域名**
   - 在Vercel项目设置中添加域名
   - 配置DNS记录指向Vercel

2. **HTTPS**
   - Vercel自动提供免费SSL证书

## 🔧 后端配置更新

### 4.1 Railway配置确认
确保 `railway.toml` 使用完整服务器：

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "node dist/complete-server.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[build.nixpacks]
buildCommand = "cd backend && npm install && echo 'Build completed'"

[environments.production]
NODE_ENV = "production"
```

### 4.2 环境变量
Railway环境变量配置：
- `MODELSCOPE_API_KEY`: 你的API密钥
- `MODELSCOPE_MODEL`: `ZhipuAI/GLM-4.6`
- `MODELSCOPE_BASE_URL`: `https://api-inference.modelscope.cn/v1`
- `BAZI_MCP_URL`: `https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp`
- `PORT`: `3001`

## 🎯 部署后的测试

### 前端测试
1. 访问Vercel部署的URL
2. 测试各种算命类型切换
3. 测试聊天功能
4. 检查API调用是否正常

### 后端测试
```bash
# 健康检查
curl https://ai-fortune-website-production.up.railway.app/health

# 状态检查
curl https://ai-fortune-website-production.up.railway.app/api/fortune/status

# 测试聊天
curl -X POST https://ai-fortune-website-production.up.railway.app/api/fortune/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "今天的运势", "type": "tarot"}'
```

## 🚨 常见问题解决

### 1. CORS问题
- 确保后端设置正确的CORS策略
- 检查前端API调用URL是否正确

### 2. 构建失败
- 检查Node.js版本兼容性
- 确保所有依赖已正确安装
- 查看构建日志定位具体错误

### 3. API调用失败
- 检查后端服务是否正常运行
- 确认环境变量配置正确
- 验证网络连接和防火墙设置

### 4. 页面空白
- 检查控制台错误信息
- 确认静态资源路径正确
- 验证React应用初始化

## 📊 性能优化

### 前端优化
1. **代码分割**: 使用React.lazy实现懒加载
2. **资源压缩**: 启用Gzip/Brotli压缩
3. **图片优化**: 使用WebP格式
4. **CDN加速**: Vercel全球CDN

### 后端优化
1. **缓存机制**: 实现Redis缓存
2. **API限流**: 防止恶意请求
3. **错误处理**: 完善的错误日志
4. **性能监控**: 添加响应时间统计

## 🎉 部署完成

部署成功后，你将获得：
- **前端URL**: `https://your-project.vercel.app`
- **后端API**: `https://ai-fortune-website-production.up.railway.app`
- **功能特性**: 完整的AI算命功能，支持八字、塔罗、星座、数字命理
- **全球CDN**: Vercel提供快速访问体验

## 📞 技术支持

如遇问题，请检查：
1. Railway后端部署日志
2. Vercel前端构建日志
3. 浏览器控制台错误信息
4. 网络连接状态

---

💡 **提示**: 部署完成后，建议进行完整的端到端测试，确保前后端集成正常工作。