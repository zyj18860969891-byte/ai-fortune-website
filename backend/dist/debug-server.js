const http = require('http');

console.log('🚀 Starting AI Fortune Server with enhanced logging...');

// 获取端口
const PORT = process.env.PORT || 8080;
console.log('📍 Environment PORT:', process.env.PORT);
console.log('📍 Using PORT:', PORT);

const server = http.createServer((req, res) => {
  console.log('🔍 Request received:');
  console.log('   Method:', req.method);
  console.log('   URL:', req.url);
  console.log('   Headers:', JSON.stringify(req.headers, null, 2));
  
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    console.log('🔄 OPTIONS request handled');
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/' || req.url === '/health') {
    console.log('✅ Serving root/health endpoint');
    const response = {
      status: 'ok',
      message: 'AI Fortune Backend is running',
      timestamp: new Date().toISOString(),
      service: 'ai-fortune-backend',
      url: req.url,
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(response))
    });
    res.end(JSON.stringify(response, null, 2));
    console.log('✅ Response sent successfully');
  } else {
    console.log('❌ 404 - Unknown URL:', req.url);
    const response = {
      error: 'Not Found',
      message: `Route ${req.url} not found`,
      availableRoutes: ['/', '/health'],
      timestamp: new Date().toISOString()
    };
    
    res.writeHead(404, { 
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(response))
    });
    res.end(JSON.stringify(response, null, 2));
  }
});

server.listen(PORT, () => {
  console.log('🎉 AI Fortune Server started successfully!');
  console.log(`📍 Server running on port: ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Root endpoint: http://localhost:${PORT}/`);
  console.log(`🌍 External endpoint: https://ai-fortune-website-production.up.railway.app/`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  console.error('Error code:', err.code);
  console.error('Error syscall:', err.syscall);
});

server.on('connection', (socket) => {
  console.log('🔗 New connection established');
  socket.on('close', () => {
    console.log('🔌 Connection closed');
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});