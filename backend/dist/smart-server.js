#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting AI Fortune Server...');

// 查找 app-simple.js 文件的多个可能位置
const possiblePaths = [
  './dist/app-simple.js',
  './backend/dist/app-simple.js',
  './app-simple.js',
  './backend/app-simple.js'
];

let appPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    appPath = p;
    console.log(`✅ Found app file at: ${p}`);
    break;
  }
}

if (!appPath) {
  console.error('❌ Could not find app-simple.js file');
  console.log('🔍 Available files:');
  const files = fs.readdirSync('./', { recursive: true });
  files.forEach(file => {
    if (file.toString().includes('app-simple')) {
      console.log(`   - ${file}`);
    }
  });
  process.exit(1);
}

// 动态加载应用
const app = require(appPath);

const PORT = process.env.PORT || 3001;

console.log('📍 PORT:', PORT);

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

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'AI Fortune Backend is running',
    status: 'ok',
    timestamp: new Date().toISOString()
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