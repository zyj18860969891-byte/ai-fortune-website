const http = require('http');

const server = http.createServer((req, res) => {
  console.log('🔍 Request received:', req.method, req.url);
  
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'AI Fortune Backend is running',
      timestamp: new Date().toISOString(),
      service: 'ai-fortune-backend',
      url: req.url
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `Route ${req.url} not found`,
      availableRoutes: ['/', '/health']
    }));
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 AI Fortune Server started on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Root endpoint: http://localhost:${PORT}/`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});