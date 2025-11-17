const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 基本中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'simple-server'
  });
});

// 简单的 fortune 接口
app.get('/api/fortune/status', (req, res) => {
  res.json({
    success: true,
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// SPA 路由支持
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📍 服务地址: http://0.0.0.0:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;