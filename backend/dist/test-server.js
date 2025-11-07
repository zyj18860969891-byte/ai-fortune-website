const http = require('http');

console.log('🚀 FRESH AI Fortune Server - Testing...');

const PORT = process.env.PORT || 8080;
console.log('📍 PORT:', PORT);

const server = http.createServer((req, res) => {
  console.log('🔍 Request for:', req.url);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/' || req.url === '/health') {
    const response = {
      status: 'ok',
      message: 'AI Fortune Backend is running',
      timestamp: new Date().toISOString(),
      port: PORT,
      fresh: true
    };
    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  } else {
    const response = {
      error: 'Not Found',
      message: 'Try / or /health'
    };
    res.writeHead(404);
    res.end(JSON.stringify(response, null, 2));
  }
});

server.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
  console.log('🌐 Test: https://ai-fortune-website-production.up.railway.app/');
});

server.on('error', (err) => {
  console.error('❌ Error:', err.message);
});