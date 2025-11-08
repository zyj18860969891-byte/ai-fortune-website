console.log('🚀 ULTIMATE TEST SERVER - This should be visible!');

const http = require('http');

const server = http.createServer((req, res) => {
  console.log('🔍 Request received for:', req.url);
  console.log('🔍 Request method:', req.method);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 总是返回 200 和成功响应（用于测试）
  const response = {
    status: 'ok',
    message: 'ULTIMATE TEST SERVER IS WORKING!',
    timestamp: new Date().toISOString(),
    test: true,
    success: true,
    url: req.url,
    method: req.method,
    server: 'Railway Test Server v1.0',
    port: process.env.PORT || 'unknown'
  };
  
  console.log('✅ Sending success response for:', req.url);
  res.writeHead(200);
  res.end(JSON.stringify(response, null, 2));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log('✅ ULTIMATE TEST SERVER running on port', PORT);
  console.log('🌐 Test URL: https://ai-fortune-website-production.up.railway.app/');
  console.log('🔍 Ready to receive requests!');
});

server.on('error', (err) => {
  console.error('❌ Error:', err.message);
});