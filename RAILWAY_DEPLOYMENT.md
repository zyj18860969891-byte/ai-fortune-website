# Railway 部署快速指南

## 🎯 目标
将AI占卜项目部署到公网，让其他人可以访问您的网站。

## 📋 准备工作

### 1. 准备GitHub仓库
1. 登录GitHub：https://github.com
2. 创建新仓库：`ai-fortune-website`
3. 上传项目代码到仓库
4. 确保仓库是公开的（或已在GitHub中配置访问权限）

### 2. 准备部署文件
项目已自动生成以下文件：
- ✅ `railway.toml` - Railway部署配置
- ✅ 更新的 `package.json` - 包含部署脚本
- ✅ `DEPLOYMENT_GUIDE.md` - 部署说明

## 🚀 Railway部署步骤

### 第1步：注册Railway
1. 访问：https://railway.app
2. 点击 "Login" 
3. 选择 "Login with GitHub" 
4. 授权GitHub访问

### 第2步：创建新项目
1. 在Railway Dashboard中点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择您的 `ai-fortune-website` 仓库
4. 点击 "Deploy Now"

### 第3步：配置部署设置
Railway会自动检测项目类型，您需要确认以下设置：

**基础配置：**
```
Root Directory: ./
Build Command: npm run install:all
Start Command: npm start
```

### 第4步：配置环境变量
在Railway项目中：
1. 点击 "Variables" 标签
2. 添加以下环境变量：

```bash
MODELSCOPE_API_KEY=ms-xxxxxxxxxxxxxxxxxxxx
MODELSCOPE_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
NODE_ENV=production
PORT=3000
```

### 第5步：等待部署完成
- 部署通常需要3-5分钟
- 在 "Deployments" 标签查看进度
- 成功后状态显示为 "Deployed"

## 🌐 访问您的网站

### 方式1：使用Railway提供的域名
- 部署成功后，Railway会提供类似以下的域名：
- `https://ai-fortune-website-production-xxxx.railway.app`

### 方式2：配置自定义域名（可选）
1. 在Railway项目设置中
2. 选择 "Domains" 标签
3. 点击 "Add Domain"
4. 输入您的域名（如：`myfortune.com`）
5. 根据提示配置DNS记录

## 🔍 测试部署

### 检查网站是否正常运行：
1. 访问您的Railway域名
2. 测试主页是否正常显示八字占卜界面
3. 点击"开始占卜"测试跳转
4. 尝试输入出生日期测试后端API

### 预期结果：
- ✅ 主页显示八字命理界面
- ✅ 按钮点击跳转到占卜页面
- ✅ 聊天界面可以发送消息
- ✅ 后端正确返回AI分析结果

## 📊 监控和维护

### 查看日志：
- 在Railway项目中的 "Logs" 标签
- 实时查看应用运行状态
- 调试错误和问题

### 监控资源使用：
- "Settings" > "Usage" 查看资源消耗
- Railway提供免费额度足够小规模使用

## 🔄 部署更新

### 更新代码后：
1. 推送到GitHub主分支
2. Railway会自动触发重新部署
3. 或者在Railway中手动点击 "Redeploy"

### 回滚到之前版本：
1. 在 "Deployments" 标签
2. 找到之前的成功部署
3. 点击 "Revert"

## 💡 常见问题解决

### 问题1：部署失败
- 检查构建日志
- 确保package.json中的脚本正确
- 检查环境变量是否设置

### 问题2：API调用失败
- 确认MODELSCOPE_API_KEY有效
- 检查网络连接
- 查看后端日志

### 问题3：网站无法访问
- 确认部署状态为"Deployed"
- 检查域名配置
- 清除浏览器缓存

## 🎉 成功标准

部署成功后，您应该能够：
1. 通过公网域名访问网站
2. 正常使用所有功能
3. 其他用户也可以正常访问

## 📞 技术支持

如果遇到问题：
1. 查看Railway官方文档：https://docs.railway.app
2. 检查项目仓库的Issues
3. 确认所有环境变量正确配置

---

**恭喜！** 部署成功后，您的AI占卜网站就可以在公网访问，让所有人都能体验智能命理分析服务了！