# 🔮 AI八字命理占卜网站

基于ModelScope AI推理和MCP服务的智能八字命理分析平台

## ✨ 项目特色

- 🤖 **AI智能分析**：结合传统八字理论与现代AI技术
- 📜 **专业八字推算**：提供性格、事业、感情、健康等全方位分析  
- 💬 **智能对话**：支持多轮对话，上下文理解
- 🔗 **MCP服务集成**：集成ModelScope的MCP八字服务
- � **现代UI设计**：响应式设计，支持深色模式
- 📱 **移动端优化**：完美适配手机和平板设备

## 🏗️ 技术架构

### 前端技术栈
- **React 18** + **TypeScript**
- **Vite** - 快速构建工具
- **Tailwind CSS** - 现代化样式框架
- **Framer Motion** - 流畅动画效果
- **React Router** - 单页应用路由

### 后端技术栈
- **Node.js** + **Express.js**
- **TypeScript** - 类型安全
- **ModelScope MCP SDK** - AI模型集成
- **CORS** - 跨域资源共享
- **Helmet** - 安全中间件

### AI服务集成
- **ModelScope API** - Qwen大语言模型
- **Bazi-MCP服务** - 专业八字计算
- **上下文分析** - 智能对话管理

## 🚀 快速开始

### 开发环境搭建

1. **克隆项目**
```bash
git clone <your-repo-url>
cd ai-fortune-website
```

2. **安装依赖**
```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd backend && npm install

# 安装前端依赖
cd ../frontend && npm install
```

3. **配置环境变量**
```bash
cd backend
cp .env.example .env
# 编辑.env文件，配置您的API密钥
```

4. **启动开发服务**
```bash
# 在项目根目录启动
npm run dev
```

### 环境变量配置

在 `backend/.env` 文件中配置：

```bash
# ModelScope API配置
MODELSCOPE_API_KEY=ms-xxxxxxxxxxxxxxxx
MODELSCOPE_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507
MODELSCOPE_BASE_URL=https://api-inference.modelscope.cn/v1

# 服务器配置
PORT=3000
NODE_ENV=development
```

## 🌍 公网部署

### Railway部署（推荐）

**一键部署，前后端统一管理**

1. Fork此项目到您的GitHub
2. 访问 [Railway.app](https://railway.app)
3. 连接GitHub仓库
4. 配置环境变量
5. 等待自动部署完成

详细部署指南请查看：[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### Vercel + Railway组合

- **前端**：Vercel部署（自动HTTPS + CDN）
- **后端**：Railway部署（API服务）

## API文档

### 算命接口

**POST** `/api/fortune/generate`

请求体:
```json
{
  "question": "我的事业发展如何？",
  "type": "tarot",
  "birthInfo": {
    "year": 1990,
    "month": 1,
    "day": 1,
    "hour": 12,
    "minute": 0
  }
}
```

响应:
```json
{
  "id": "uuid",
  "question": "我的事业发展如何？",
  "type": "tarot",
  "result": {
    "prediction": "...",
    "advice": "...", 
    "luckyElements": ["红色", "7", "东方"],
    "confidence": 0.85
  },
  "timestamp": "2023-01-01T00:00:00.000Z",
  "processingTime": 1200
}
```

### 获取算命类型

**GET** `/api/fortune/types`

响应:
```json
{
  "types": [
    {
      "id": "tarot",
      "name": "塔罗占卜",
      "description": "通过塔罗牌洞察未来"
    }
  ]
}
```

## 部署

### Docker部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 手动部署
```bash
# 构建前端
cd frontend && npm run build

# 构建后端
cd backend && npm run build

# 使用PM2启动后端
pm2 start dist/server.js --name fortune-backend
```

## 开发指南

### 项目结构
```
ai-fortune-website/
├── backend/          # 后端服务
├── frontend/         # 前端应用  
├── data/            # 数据文件
├── config/          # 配置文件
├── tests/           # 测试文件
└── docs/            # 文档
```

### 核心组件
- **ModelScopeService**: ModelScope模型集成
- **FortuneCard**: 算命结果展示组件
- **HomePage**: 首页和算命类型选择
- **FortunePage**: 算命交互页面

### 添加新的算命类型
1. 在`backend/src/services/modelscope.ts`中添加新的提示词
2. 在`data/fortune_templates.json`中添加模板配置
3. 在前端组件中添加相应的UI

## 性能优化

- 使用Redis缓存算命结果
- 前端代码分割和懒加载
- 图片资源压缩和CDN加速
- API响应时间监控

## 安全考虑

- 输入验证和过滤
- 请求频率限制
- 错误处理和日志记录
- 环境变量安全管理

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请创建GitHub Issue。