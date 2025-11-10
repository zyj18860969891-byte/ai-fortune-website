const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// 启用 CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// 解析 JSON 请求体
app.use(express.json());

// 记录请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 静态前端文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SPA 路由支持
app.get('*', (req, res) => {
  console.log(`📄 Serving frontend: ${req.url}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 AI Fortune Website running on port ${PORT}`);
  console.log(`🌐 Frontend: https://your-app.railway.app`);
  console.log(`🔍 Health Check: https://your-app.railway.app/health`);
});