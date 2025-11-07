const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting AI Fortune Server...');
console.log('📍 PORT:', PORT);

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 根路径 - 必须在前面
app.get('/', (req, res) => {
  console.log('🌐 Root path requested');
  res.json({
    message: 'AI Fortune Backend is running',
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      fortune: '/api/fortune/generate',
      chat: '/api/fortune/chat'
    }
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  console.log('🔍 Health check requested');
  res.status(200).json({
    status: 'ok',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    service: 'ai-fortune-backend'
  });
});

// 404 处理 - 必须在最后
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/', '/health']
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