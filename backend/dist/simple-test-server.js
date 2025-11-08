console.log('🚀 TEST SERVER - This should be visible!');

const http = require('http');

const server = http.createServer((req, res) => {
  console.log('🔍 Request received for:', req.url);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/' || req.url === '/health' || req.url.includes('health')) {
    const response = {
      status: 'ok',
      message: 'TEST SERVER IS WORKING!',
      timestamp: new Date().toISOString(),
      test: true,
      success: true
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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log('✅ TEST SERVER running on port', PORT);
  console.log('🌐 Test URL: https://ai-fortune-website-production.up.railway.app/');
});

server.on('error', (err) => {
  console.error('❌ Error:', err.message);
});