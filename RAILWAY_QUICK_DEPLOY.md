# 🚀 Railway 快速部署指南

## ⚡ 5分钟完成公网部署

### 步骤1：准备GitHub仓库
1. 登录GitHub：https://github.com
2. 创建新仓库：`ai-fortune-website`
3. 上传您的项目文件
4. 确保仓库是**公开的**

### 步骤2：注册Railway账号
1. 访问：https://railway.app
2. 点击 "Login" → "Login with GitHub"
3. 授权GitHub访问

### 步骤3：创建Railway项目
1. 在Railway Dashboard点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择您的 `ai-fortune-website` 仓库
4. 点击 "Deploy Now"

### 步骤4：配置部署设置
Railway会自动配置，您需要确认或修改：

**项目设置：**
- Project Name: `ai-fortune-website`
- Root Directory: `./`
- Build Command: `npm install && npm run build:backend`
- Start Command: `cd backend && npm start`

### 步骤5：配置环境变量
在Railway项目 → "Variables" 中添加：

```bash
# 必需的环境变量
MODELSCOPE_API_KEY=ms-xxxxxxxxxxxxxxxxxxxx
MODELSCOPE_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
NODE_ENV=production
PORT=3001

# 可选的环境变量
FRONTEND_URL=https://localhost:5173
```

### 步骤6：等待部署完成
- 部署时间：3-5分钟
- 部署状态显示为 "Deployed"
- 获得 `.railway.app` 域名

### 步骤7：获取访问地址
Railway会提供类似以下的域名：
```
https://ai-fortune-website-production-xxxx.railway.app
```

这就是您可以分享给其他人的公网地址！

## 🧪 测试部署结果

### 1. 健康检查
访问：`https://your-app.railway.app/health`
应该返回：
```json
{
  "status": "healthy",
  "timestamp": "2025-11-07Txx:xx:xx.xxxZ",
  "service": "ai-fortune-backend"
}
```

### 2. 测试前端
访问：`https://your-app.railway.app`
应该显示八字命理主页

### 3. 测试API
访问：`https://your-app.railway.app/api/fortune/status`
应该返回服务状态

## 🔧 常见问题解决

### 问题1：部署失败
**解决方案：**
- 检查构建日志
- 确认package.json脚本正确
- 验证所有依赖已安装

### 问题2：API调用失败
**解决方案：**
- 确认MODELSCOPE_API_KEY有效
- 检查环境变量是否正确设置
- 查看后端日志

### 问题3：前端无法访问
**解决方案：**
- 前端需要额外配置
- 建议先使用Railway测试后端API
- 后续可以部署前端到Vercel

## 📱 分享给朋友

部署成功后，您可以分享：
- 网站地址：`https://your-app.railway.app`
- 让朋友测试八字命理功能
- 体验AI智能对话分析

## 💡 优化建议

### 为获得最佳效果，建议：
1. **购买域名**（可选）：更专业的访问地址
2. **配置自定义域名**（在Railway设置中）
3. **监控使用情况**（Railway提供实时监控）

## 🎉 成功标志

部署成功标志：
- ✅ Railway显示"Deployed"状态
- ✅ 可以通过公网域名访问
- ✅ API健康检查通过
- ✅ 朋友可以正常访问和使用

---

**恭喜！** 您的AI占卜网站现在已经可以在公网访问，让所有人都能体验智能命理分析服务了！