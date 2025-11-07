
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
   - 推送到 GitHub：`git push -u origin master`
   
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
   - 如果出现 "Error creating build plan with railpack" 错误，请等待 Railway 自动重试或手动点击 "Redeploy"

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
     Root Directory: ./backend/
     Build Command: npm install
     Start Command: node start.js
     ```
   - **重要**：Root Directory 必须设置为 `./backend/`，这样 Railway 只构建后端部分
   - Start Command 改为 `node start.js` 使用专门的启动脚本
   - 如果设置不正确，点击编辑

2. **新的解决方案**
   - 我已经创建了一个专门的启动脚本 `backend/start.js`
   - 这个脚本会正确启动 TypeScript 开发服务器
   - railway.toml 已更新为使用 `node start.js` 作为启动命令

3. **关键配置要点**
   - Root Directory 设置为 `./backend/` 让 Railway 只处理后端代码
   - Start Command 使用 `node start.js` 而不是 `npm start`
   - 这样 Railway 就能找到明确的启动文件

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

### 如果出现 "Error creating build plan with railpack" 错误：
1. **等待自动重试**
   - Railway 通常会在几分钟后自动重试
   - 刷新页面查看状态变化

2. **手动重新部署**
   - 在项目页面点击 "Redeploy" 按钮
   - 或删除 Railway 项目后重新创建（不是删除 GitHub 项目）

3. **检查项目配置**
   - 确认 railway.toml 文件存在且配置正确
   - 检查 package.json 中的脚本命令
   - **特别注意**：如果出现 "⚠ Script start.sh not found" 错误，说明 railway.toml 配置不正确

4. **清理缓存后重试**
   - 在 Railway 项目设置中清理构建缓存
   - 重新触发部署

### 如果出现 "⚠ Script start.sh not found" 错误：
1. **检查 railway.toml 配置**
   - 确保 railway.toml 文件在项目根目录
   - 配置应该指向后端目录：`startCommand = "cd backend && npm start"`
   - 确保后端 package.json 中有正确的 start 脚本

2. **重新提交配置**
   - 修改 railway.toml 后重新提交到 GitHub
   - 推送到 GitHub 后 Railway 会自动检测配置变化

3. **重新连接仓库**
   - 删除 Railway 项目
   - 重新创建 Railway 项目连接 GitHub 仓库

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