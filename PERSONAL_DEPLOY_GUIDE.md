
# 🎯 您的个人部署指南

**账户信息：**
- 邮箱：zyj18860969891@gmail.com
- GitHub：zyj18860969891@gmail.com
- 部署平台：Railway.app

## ⚡ 立即开始部署（按顺序执行）

### 🚀 第1步：创建GitHub仓库（2分钟）

1. **打开GitHub**
   - 访问：https://github.com
   - 点击 "Sign in" 
   - 使用邮箱：zyj18860969891@gmail.com 登录

2. **创建新仓库**
   - 点击右上角 "New" 按钮
   - Repository name: `ai-fortune-website`
   - Description: `基于ModelScope的AI八字命理占卜网站`
   - 选择 "Public"
   - ✅ 勾选 "Add a README file"
   - 点击 "Create repository"

3. **通过 Git 命令上传项目文件**
   - 打开命令行终端
   - **配置 Git 用户信息**（如果之前没有配置过）：
     ```
     git config --global user.email "zyj18860969891@gmail.com"
     git config --global user.name "zyj18860969891"
     ```
   - 进入您的项目目录：`cd E:\MultiModel\ai-fortune-website`
   - 初始化 Git 仓库：`git init`
   - 添加远程仓库：`git remote add origin https://github.com/zyj18860969891-byte/ai-fortune-website.git`
   - 添加所有文件：`git add .`
   - 提交更改：`git commit -m "Initial commit - AI fortune telling website"`
   - 推送到 GitHub：`git push -u origin main`
   
   **或者使用 GitHub Desktop：**
   - 打开 GitHub Desktop
   - 选择 "Repository" > "Add local repository"
   - 选择您的项目文件夹：`E:\MultiModel\ai-fortune-website`
   - 在左下角写提交信息："Initial commit - AI fortune telling website"
   - 点击 "Commit to main"
   - 点击 "Push origin" 推送到 GitHub

**✅ 第1步完成标志：**
- GitHub仓库显示完整文件结构
- 可以看到所有文件和文件夹
- 包括 `backend/`、`frontend/`、`package.json`、`railway.toml` 等所有项目文件

---

### 🚀 第2步：注册Railway（1分钟）

1. **打开Railway**
   - 访问：https://railway.app
   - 点击 "Login"
   - 选择 "Login with GitHub"
   - 使用相同邮箱：zyj18860969891@gmail.com 授权

2. **确认授权**
   - Railway会要求GitHub授权
   - 点击 "Authorize railwayapp"
   - 成功跳转到Railway Dashboard

**✅ 第2步完成标志：**
- 看到Railway的Dashboard界面
- 没有登录或授权错误

---

### 🚀 第3步：连接GitHub仓库（1分钟）

1. **创建新项目**
   - 在Railway Dashboard点击 "New Project"
   - 选择 "Deploy from GitHub repo"

2. **选择仓库**
   - 在列表中找到您的 `ai-fortune-website` 仓库
   - 点击 "Deploy Now" 按钮

3. **等待项目创建**
   - Railway会自动拉取代码
   - 看到 "Creating project..." 进度

**✅ 第3步完成标志：**
- 进入项目详情页面
- 看到自动生成的 "ai-fortune-website" 项目
- 可以看到文件结构

---

### 🚀 第4步：配置部署（1分钟）

1. **设置项目配置**
   - 在项目页面，点击 "Settings" 标签
   - 确认以下设置：
     ```
     Root Directory: ./
     Build Command: npm install && npm run build:backend
     Start Command: cd backend && npm start
     ```
   - 如果设置不正确，点击编辑

2. **配置环境变量**
   - 点击 "Variables" 标签
   - 依次添加以下变量（点击 "New Variable"）：

   **变量1：**
   ```
   Name: MODELSCOPE_API_KEY
   Value: ms-xxxxxxxxxxxxxxxxxxxx（您需要替换为真实API密钥）
   ```

   **变量2：**
   ```
   Name: MODELSCOPE_MODEL
   Value: Qwen/Qwen3-235B-A22B-Instruct-2507
   ```

   **变量3：**
   ```
   Name: MODELSCOPE_BASE_URL
   Value: https://api-inference.modelscope.cn/v1
   ```

   **变量4：**
   ```
   Name: NODE_ENV
   Value: production
   ```

   **变量5：**
   ```
   Name: PORT
   Value: 3001
   ```

**✅ 第4步完成标志：**
- 所有环境变量已添加
- 变量状态显示为绿色 "OK"

---

### 🚀 第5步：等待部署（3分钟）

1. **监控部署进度**
   - 切换到 "Deployments" 标签
   - 看到新的部署任务
   - 状态会从 "Building" → "Ready" → "Deployed"

2. **查看构建日志**（可选）
   - 点击部署任务查看详细日志
   - 确认没有错误

3. **获取访问地址**
   - 部署成功后，找到 "Domains" 部分
   - 会显示类似：`ai-fortune-website-production-xxxx.railway.app`

**✅ 第5步完成标志：**
- 状态显示为 "Deployed" （绿色）
- 有一个可点击的域名链接
- 可以正常访问

---

## 🎉 部署成功！立即测试

### 1. 访问您的网站
打开浏览器，访问：
```
https://ai-fortune-website-production-xxxx.railway.app
```

**期望结果：**
- ✅ 显示八字命理主页
- ✅ 界面设计美观
- ✅ "开始占卜" 按钮可以点击

### 2. 测试API接口
访问健康检查：
```
https://ai-fortune-website-production-xxxx.railway.app/health
```

**期望结果：**
- ✅ 返回JSON格式的健康状态
- ```json
  {
    "status": "healthy",
    "timestamp": "2025-11-07Txx:xx:xx.xxxZ",
    "service": "ai-fortune-backend"
  }
  ```

### 3. 分享给朋友
- 复制网站地址
- 发送给你的朋友
- 他们可以立即体验AI八字分析

---

## 🔧 故障排除

### 如果部署失败：
1. **检查构建日志**
   - 在 "Deployments" 标签查看错误信息
   - 常见问题：文件缺失、脚本错误

2. **检查环境变量**
   - 确认所有5个变量都已正确设置
   - MODELSCOPE_API_KEY 必须有真实值

3. **重新部署**
   - 在项目页面点击 "Redeploy"
   - 或推送新的代码更改自动触发部署

### 如果API调用失败：
1. **检查环境变量**
   - MODELSCOPE_API_KEY 是否有效
   - 网络连接是否正常

2. **查看后端日志**
   - 在Railway项目页面点击 "Logs"
   - 查看具体的错误信息

---

## 📋 部署检查清单

- [ ] GitHub仓库创建成功
- [ ] Railway项目创建成功  
- [ ] GitHub仓库连接成功
- [ ] 所有5个环境变量已设置
- [ ] 部署状态显示 "Deployed"
- [ ] 可以通过域名访问网站
- [ ] 健康检查接口正常响应
- [ ] 朋友可以正常访问网站

---

## 🎊 恭喜！

如果以上所有检查项目都通过，那么您的AI八字命理网站就已经成功部署到公网了！

**您的网站地址：** `https://ai-fortune-website-production-xxxx.railway.app`

现在其他人可以通过这个地址访问您的网站，体验AI智能八字分析服务了！

---

## 💡 后续优化建议

1. **自定义域名**（可选）
   - 在Railway的 "Settings" > "Domains" 中添加自己的域名

2. **性能监控**
   - Railway提供实时监控和使用统计

3. **功能扩展**
   - 可以继续开发新功能并推送到GitHub
   - Railway会自动更新部署

**祝您部署成功！** 🚀