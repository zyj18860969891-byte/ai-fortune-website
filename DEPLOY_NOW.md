# ⚡ 立即开始公网部署

## 🎯 目标：5分钟内让网站在公网可访问

### 🚀 部署步骤（按顺序执行）

#### 第1步：上传到GitHub ⏰ 2分钟
1. 登录 https://github.com
2. 点击 "New repository"
3. 仓库名：`ai-fortune-website`
4. 选择 "Public"
5. 点击 "Create repository"
6. 上传您的项目文件夹中的所有文件
7. 完成仓库创建

#### 第2步：注册Railway ⏰ 1分钟  
1. 访问 https://railway.app
2. 点击 "Login"
3. 选择 "Login with GitHub"
4. 授权登录

#### 第3步：连接GitHub ⏰ 1分钟
1. 在Railway Dashboard点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择您的 `ai-fortune-website` 仓库
4. 点击 "Deploy Now"

#### 第4步：配置环境 ⏰ 1分钟
Railway会自动开始部署，您需要设置环境变量：

1. 等待项目创建完成
2. 点击 "Variables" 标签
3. 添加以下变量：

```
MODELSCOPE_API_KEY=您的API密钥
MODELSCOPE_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1
NODE_ENV=production
PORT=3001
```

#### 第5步：等待部署 ⏰ 3分钟
- 观察部署进度
- 状态会从 "Building" 变为 "Deployed"
- 获得免费的 `.railway.app` 域名

## 🎉 获得公网地址

部署成功后，Railway会提供类似：
```
https://ai-fortune-website-production-xxxx.railway.app
```

**这就是您可以分享给其他人的网站地址！**

## 🧪 立即测试

### 1. 访问网站首页
```
https://您的域名.railway.app
```
应该看到：八字命理主页

### 2. 测试API
```
https://您的域名.railway.app/health  
```
应该返回：健康状态JSON

### 3. 分享给朋友
- 直接发送网站链接
- 朋友可以立即使用
- 体验AI八字分析

## 📋 需要准备的信息

- ✅ GitHub账号
- ✅ Railway账号（免费）
- ✅ ModelScope API密钥

## 💰 成本

**完全免费：**
- Railway免费额度：500小时/月
- 足够小规模使用
- 超出部分按需付费，成本很低

## 🎯 成功标准

部署成功标志：
- ✅ Railway显示绿色 "Deployed" 状态
- ✅ 可以通过网址访问网站
- ✅ 朋友可以正常打开和使用
- ✅ API接口正常响应

## ⚠️ 如果遇到问题

1. **部署失败**：检查构建日志，确保所有文件已上传
2. **API错误**：确认环境变量正确设置
3. **网站打不开**：清除浏览器缓存或使用无痕模式

---

**准备好开始了吗？按照上面的步骤，5分钟后您就有公网地址了！** 🚀