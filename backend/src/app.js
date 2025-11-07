const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fortuneRoutes = require('./routes/fortune');

// 确保在导入其他模块之前加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(helmet()); // 安全头
app.use(cors({
  origin: function (origin, callback) {
    // 允许所有来源（开发环境）
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      process.env.FRONTEND_URL,
      'https://ai-fortune-website.railway.internal',
      'https://ai-fortune-website-production-*.railway.app'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('combined')); // 请求日志
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 路由配置
app.use('/api/fortune', fortuneRoutes);

// 健康检查接口 - 最简单的版本
app.get('/health', (req, res) => {
  console.log('🔍 Health check requested');
  res.status(200).send('OK');
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: '服务器内部错误'
  });
});

module.exports = app;