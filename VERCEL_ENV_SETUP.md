# Vercel 环境变量配置指南

## 🔍 问题分析

前端页面能打开，但API调用失败，显示"抱歉，网络连接有问题"。这是因为前端不知道Railway后端的API地址。

## 🛠️ 解决方案

### 在Vercel Dashboard中设置环境变量

1. **访问Vercel Dashboard**
   - 打开 https://vercel.com/dashboard
   - 选择你的项目 `ai-fortune-website`

2. **进入环境变量设置**
   - 点击 "Settings" 标签
   - 点击 "Environment Variables" 部分

3. **添加环境变量**
   ```
   Name: VITE_API_BASE_URL
   Value: https://ai-fortune-website-production.up.railway.app
   ```

4. **保存并重新部署**
   - 点击 "Save" 保存环境变量
   - 点击 "Redeploy" 重新部署项目

## 📋 环境变量说明

### VITE_API_BASE_URL
- **作用**: 告诉前端后端API的地址
- **值**: `https://ai-fortune-website-production.up.railway.app`
- **用途**: 前端调用AI占卜API时使用

## 🔗 API调用流程

```
前端(Vercel) → Railway后端
   ↓              ↓
VITE_API_BASE_URL  AI推理
```

## 🧪 验证步骤

### 1. 设置环境变量后
- 在Vercel Dashboard中添加环境变量
- 重新部署项目

### 2. 测试API调用
- 访问Vercel前端页面
- 输入测试问题
- 确认AI推理正常工作

### 3. 验证结果
- 不再出现"网络连接有问题"
- AI推理结果正常返回
- 用户体验改善

## 💡 注意事项

1. **环境变量名称**: 必须是 `VITE_API_BASE_URL`（前端代码中使用的名称）
2. **API地址**: 确保使用正确的Railway后端地址
3. **重新部署**: 添加环境变量后必须重新部署
4. **HTTPS**: 确保API地址使用HTTPS协议

## 🎉 预期效果

配置完成后：
- ✅ 前端能正确找到后端API
- ✅ AI推理请求正常发送
- ✅ 不再出现网络连接错误
- ✅ 中国大陆用户访问快速

## 📊 性能提升

| 部署方式 | 前端访问 | API调用 | 用户体验 |
|---------|---------|---------|----------|
| **Railway alone** | 慢 | 慢 | 差 |
| **Vercel + Railway** | 快 | 稳定 | 优秀 |

现在就去Vercel Dashboard设置环境变量吧！🚀