const express = require('express');
const dotenv = require('dotenv');

// 确保在导入其他模块之前加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting AI Fortune Server...');
console.log('📍 PORT:', PORT);

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查接口 - 最简单的版本
app.get('/health', (req, res) => {
  console.log('🔍 Health check requested');
  res.status(200).json({
    status: 'ok',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    service: 'ai-fortune-backend'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'AI Fortune Backend is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Server error occurred'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 AI Fortune Server started successfully!`);
  console.log(`📍 Server running on port: ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Root endpoint: http://localhost:${PORT}/`);
});

module.exports = app;