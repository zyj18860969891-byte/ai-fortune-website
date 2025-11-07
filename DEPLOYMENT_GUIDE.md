# AI占卜项目部署指南

## 🚀 部署方案选择

### 推荐方案：Railway 部署（一站式解决方案）

Railway 是最适合您项目的部署平台，支持前后端一体化部署。

#### 优势：
- ✅ 前后端统一部署
- ✅ 自动HTTPS证书
- ✅ 自动扩缩容
- ✅ 环境变量管理
- ✅ 一键回滚
- ✅ 简单易用的Web界面

#### 部署步骤：

1. **注册Railway账号**
   - 访问 https://railway.app
   - 使用GitHub账号登录

2. **准备代码仓库**
   - 将项目上传到GitHub
   - 确保项目结构正确

3. **连接GitHub仓库**
   - 在Railway中点击"New Project"
   - 选择"Deploy from GitHub repo"
   - 选择您的仓库

4. **配置环境变量**
   ```
   MODELSCOPE_API_KEY=您的API密钥
   MODELSCOPE_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
   MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
   ```

5. **部署配置**
   - Root Directory: `./` (项目根目录)
   - Build Command: `npm run install:all`
   - Start Command: `npm start`

6. **访问地址**
   - 部署完成后，Railway会提供 `.railway.app` 域名
   - 例如：`https://your-project.railway.app`

## 🔄 备选方案：Vercel + Railway

### 前端部署到Vercel：
1. 访问 https://vercel.com
2. 导入GitHub项目
3. 选择 `frontend` 目录作为根目录
4. 设置构建命令：`npm run build`
5. 设置输出目录：`dist`

### 后端部署到Railway：
按照上面的Railway步骤执行

## 📁 项目结构优化

确保您的项目根目录有以下文件：

```
ai-fortune-website/
├── backend/              # 后端代码
├── frontend/             # 前端代码
├── package.json          # 根目录包管理
├── railway.toml         # Railway部署配置
├── README.md            # 项目说明
└── DEPLOYMENT_GUIDE.md  # 部署指南
```

## 🔧 环境变量配置

### 后端环境变量：
```bash
MODELSCOPE_API_KEY=ms-xxxxxxxxxxxxxxxx
MODELSCOPE_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
PORT=3000
```

### 前端环境变量（如需要）：
```bash
VITE_API_BASE_URL=https://your-railway-app.railway.app/api
```

## 🌐 自定义域名

部署成功后，您可以：
1. 购买域名
2. 在部署平台添加自定义域名
3. 启用HTTPS

## 📊 监控和维护

- Railway提供实时日志
- 自动扩缩容，无需担心流量激增
- 支持一键回滚到之前的版本

## ⚡ 性能优化

- 前端：自动代码分割和压缩
- 后端：Node.js原生性能
- CDN：静态资源全球加速

## 💰 费用估算

- **Railway**: 每月500小时免费额度
- **Vercel**: 每月100GB带宽免费额度
- 超出部分按使用量付费，成本较低

## 🔒 安全考虑

- 所有连接自动启用HTTPS
- 环境变量加密存储
- 支持私有仓库部署

## 🎯 总结

推荐使用 **Railway单一平台部署**，因为：
1. 部署最简单
2. 成本最低
3. 维护最方便
4. 功能最完整

这样您就可以让其他人通过公网访问您的AI占卜网站了！