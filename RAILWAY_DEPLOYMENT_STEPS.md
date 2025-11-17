# Railway 部署步骤指南

## 🚀 快速部署

### 方法一：使用 Railway CLI（推荐）

1. **安装 Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **登录 Railway**
   ```bash
   railway login
   ```

3. **初始化项目**
   ```bash
   railway init
   ```

4. **链接项目**
   ```bash
   railway link
   ```

5. **部署**
   ```bash
   git push railway master
   ```

6. **打开应用**
   ```bash
   railway open
   ```

### 方法二：使用部署脚本

**Windows 用户：**
```bash
deploy-to-railway.bat
```

**Mac/Linux 用户：**
```bash
chmod +x deploy-to-railway.sh
./deploy-to-railway.sh
```

## 🔧 手动部署步骤

### 1. 安装 Railway CLI
```bash
npm install -g @railway/cli
```

### 2. 登录 Railway
```bash
railway login
```
这会打开浏览器让你登录 Railway 账户。

### 3. 初始化 Railway 项目
```bash
railway init
```
这会在当前目录创建 Railway 配置。

### 4. 链接项目
```bash
railway link
```
这会创建 Railway 远程仓库。

### 5. 推送代码
```bash
git add .
git commit -m "部署到 Railway"
git push railway master
```

### 6. 打开应用
```bash
railway open
```

## 📋 部署前检查清单

- [ ] Railway CLI 已安装
- [ ] 已登录 Railway 账户
- [ ] 所有配置文件已更新（railway.toml, railway.env）
- [ ] 代码已提交到本地仓库
- [ ] 环境变量已正确配置

## 🔍 常见问题解决

### 问题1：Railway CLI 未安装
```bash
npm install -g @railway/cli
```

### 问题2：登录失败
- 确保 Railway 账户正常
- 检查网络连接
- 尝试重新登录：`railway login`

### 问题3：远程仓库不存在
```bash
railway init
railway link
```

### 问题4：部署失败
- 检查 railway.toml 配置
- 确认所有依赖已安装
- 查看 Railway 控制台错误信息

## 🎯 部署成功标志

部署成功后，你会看到：
- Railway 控制台显示 "Deploy successful"
- 应用 URL 生成
- 健康检查通过：`https://your-app.railway.app/health`

## 📊 验证部署

1. **访问应用**
   ```bash
   railway open
   ```

2. **检查健康状态**
   访问：`https://your-app.railway.app/health`

3. **检查环境变量**
   访问：`https://your-app.railway.app/api/env`

4. **测试八字分析**
   - 访问前端
   - 选择八字命理
   - 输入出生日期和问题

## 🔄 更新部署

要更新已部署的应用：
```bash
git add .
git commit -m "更新内容"
git push railway master
```

## 📞 获取帮助

如果遇到问题：
1. 查看 Railway 控制台日志
2. 运行 `railway logs` 查看详细日志
3. 访问 Railway 文档：https://docs.railway.app/

---

🎉 **现在你可以开始部署了！**