# Railway 部署指南

## 📋 部署状态

✅ **配置已完成** - 所有环境变量已正确配置，系统可以正常部署到 Railway。

## 🔧 配置文件

### railway.toml
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "node start-railway-js-only.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 5

[build.nixpacks]
buildCommand = "npm install"
installCommand = "npm install"
startCommand = "node start-railway-js-only.js"

[environments.production]
NODE_ENV = "production"
PORT = "3001"
# ModelScope配置
MODELSCOPE_API_KEY = "ms-bf1291c1-c1ed-464c-b8d8-162fdee96180"
MODELSCOPE_MODEL = "Qwen/Qwen3-235B-A22B-Instruct-2507"
MODELSCOPE_BASE_URL = "https://api-inference.modelscope.cn/v1"
# MCP服务配置
BAZI_MCP_URL = "https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp"
BAZI_MCP_TIMEOUT = "15000"

# 强制使用 Node.js 18 和指定端口
[build.environment]
NIXPACKS_NODE = "18"
PORT = "3001"
```

### railway.env
```env
# Railway 生产环境配置
NODE_ENV=production
PORT=3001
RAILWAY_ENVIRONMENT=production

# ModelScope API配置
MODELSCOPE_API_KEY=ms-bf1291c1-c1ed-464c-b8d8-162fdee96180
MODELSCOPE_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1

# MCP服务配置（八字命理专业服务）
BAZI_MCP_URL=https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp
BAZI_MCP_TIMEOUT=15000

# 服务器配置
HOST=0.0.0.0
NODE_OPTIONS=--max-old-space-size=4096

# 缓存配置
CACHE_TTL=3600
MAX_CACHE_SIZE=1000

# 限流配置
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=50

# 日志配置
LOG_LEVEL=info
LOG_FORMAT=json
```

## 🚀 部署步骤

### 1. 推送代码到 Railway
```bash
git add .
git commit -m "更新 Railway 配置"
git push railway main
```

### 2. 验证部署
部署完成后，访问以下端点验证系统状态：

- **健康检查**: `https://your-app.railway.app/health`
- **环境检查**: `https://your-app.railway.app/api/env`
- **前端访问**: `https://your-app.railway.app`

## 🔍 功能验证

### 八字命理分析
1. 访问前端界面
2. 选择"八字命理"分析类型
3. 输入出生日期（格式：1990.05.15 或 1990年5月15日）
4. 输入问题（如："我的事业运势如何？"）
5. 查看分析结果

### 关键特性
- ✅ 出生信息缓存（跨请求保存）
- ✅ MCP 服务集成（八字计算）
- ✅ ModelScope AI 分析
- ✅ 智能本地回退机制
- ✅ 环境变量配置验证

## 📊 环境变量验证

所有必要的环境变量已正确配置：

| 变量名 | 状态 | 值 |
|--------|------|-----|
| NODE_ENV | ✅ | production |
| PORT | ✅ | 3001 |
| MODELSCOPE_API_KEY | ✅ | ms-bf1291c1-c1ed-464c-b8d8-162fdee96180 |
| MODELSCOPE_MODEL | ✅ | Qwen/Qwen3-235B-A22B-Instruct-2507 |
| MODELSCOPE_BASE_URL | ✅ | https://api-inference.modelscope.cn/v1 |
| BAZI_MCP_URL | ✅ | https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp |
| BAZI_MCP_TIMEOUT | ✅ | 15000 |

## 🔧 故障排除

### 常见问题

1. **端口冲突**
   - 确保 railway.toml 和 railway.env 中的 PORT 一致
   - 当前配置使用端口 3001

2. **API 密钥问题**
   - 验证 MODELSCOPE_API_KEY 格式正确
   - 确保 API 密钥有效且未过期

3. **MCP 服务连接**
   - 检查 BAZI_MCP_URL 是否可访问
   - 验证 BAZI_MCP_TIMEOUT 设置合理

### 日志查看
在 Railway 控制台中查看应用日志，监控：
- 启动日志
- API 调用日志
- 错误信息
- 性能指标

## 🎯 部署成功标志

当看到以下日志时，表示部署成功：
```
🎉 AI Fortune Website running on port 3001
🌐 Frontend: https://your-app.railway.app
🔍 Health Check: https://your-app.railway.app/health
🔧 Environment Check: https://your-app.railway.app/api/env
🤖 Using ModelScope: Qwen/Qwen3-235B-A22B-Instruct-2507
📝 纯JavaScript版本，智能本地分析
```

## 📈 性能优化

- 使用 Node.js 18 以获得最佳性能
- 内存限制设置为 4GB
- 启用缓存机制
- 配置了合理的限流策略

---

**🎉 配置完成！系统已准备好部署到 Railway。**