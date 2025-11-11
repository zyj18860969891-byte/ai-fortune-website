import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fortuneRoutes from './routes/fortune';

// 确保在导入其他模块之前加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(helmet()); // 安全头
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined')); // 请求日志

// 修复中文字符编码问题
app.use(express.json({ 
  limit: '10mb',
  verify: (req: any, res, buf) => {
    // 确保中文字符正确解析
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ 
  extended: true,
  verify: (req: any, res, buf) => {
    // 确保中文字符正确解析
    req.rawBody = buf;
  }
}));

// 静态文件服务 - 提供前端页面
// 从 backend/dist 指向根目录的 dist
const frontendDistPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendDistPath));

// SPA路由支持 - 所有非API路由返回index.html
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 路由配置
app.use('/api/fortune', fortuneRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ai-fortune-backend'
  });
});

// 错误处理中间件
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    error: '内部服务器错误',
    message: process.env.NODE_ENV === 'development' ? error.message : '请稍后再试'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl
  });
});

export default app;