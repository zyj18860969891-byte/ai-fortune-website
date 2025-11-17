// 检查 Railway 部署状态
const https = require('https');

console.log('🔍 检查 Railway 部署状态...');

// 检查健康状态
function checkHealth() {
  return new Promise((resolve, reject) => {
    const req = https.request('https://ai-fortune-website-production.up.railway.app/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 检查环境变量
function checkEnvironment() {
  return new Promise((resolve, reject) => {
    const req = https.request('https://ai-fortune-website-production.up.railway.app/api/env', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 测试 API 端点
async function testAPI() {
  try {
    console.log('🏥 检查健康状态...');
    const health = await checkHealth();
    console.log('健康状态:', health);
    
    console.log('🔧 检查环境变量...');
    const env = await checkEnvironment();
    console.log('环境变量:', env);
    
    console.log('✅ 所有检查完成');
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  }
}

testAPI();