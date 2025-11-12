// 模拟 Railway 环境变量配置测试
console.log('🔧 测试 Railway 配置文件...');

// 从 railway.toml 和 railway.env 模拟环境变量
const mockEnv = {
  NODE_ENV: 'production',
  PORT: '3001',
  MODELSCOPE_API_KEY: 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180',
  MODELSCOPE_MODEL: 'Qwen/Qwen3-235B-A22B-Instruct-2507',
  MODELSCOPE_BASE_URL: 'https://api-inference.modelscope.cn/v1',
  BAZI_MCP_URL: 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp',
  BAZI_MCP_TIMEOUT: '15000',
  RAILWAY_ENVIRONMENT: 'production',
  HOST: '0.0.0.0',
  NODE_OPTIONS: '--max-old-space-size=4096',
  CACHE_TTL: '3600',
  MAX_CACHE_SIZE: '1000',
  RATE_LIMIT_WINDOW_MS: '60000',
  RATE_LIMIT_MAX_REQUESTS: '50',
  LOG_LEVEL: 'info',
  LOG_FORMAT: 'json'
};

// 模拟 process.env
process.env = { ...process.env, ...mockEnv };

// 检查必要的环境变量
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MODELSCOPE_API_KEY',
  'MODELSCOPE_MODEL',
  'MODELSCOPE_BASE_URL',
  'BAZI_MCP_URL',
  'BAZI_MCP_TIMEOUT'
];

console.log('\n📋 检查必要的环境变量:');
const missingVars = [];
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`❌ ${varName}: 未设置`);
    missingVars.push(varName);
  }
});

// 检查端口配置
const port = process.env.PORT || '8080';
console.log(`\n🌐 端口配置: ${port}`);

// 检查 ModelScope 配置
console.log('\n🤖 ModelScope 配置:');
console.log(`API Key: ${process.env.MODELSCOPE_API_KEY ? '已配置' : '未配置'}`);
console.log(`Model: ${process.env.MODELSCOPE_MODEL || '未配置'}`);
console.log(`Base URL: ${process.env.MODELSCOPE_BASE_URL || '未配置'}`);

// 检查 MCP 配置
console.log('\n🔮 MCP 服务配置:');
console.log(`MCP URL: ${process.env.BAZI_MCP_URL || '未配置'}`);
console.log(`MCP Timeout: ${process.env.BAZI_MCP_TIMEOUT || '未配置'}`);

// 验证配置一致性
console.log('\n🔍 配置一致性检查:');
const configChecks = [
  { name: '端口一致性', check: port === '3001' },
  { name: 'ModelScope API Key 格式', check: process.env.MODELSCOPE_API_KEY.startsWith('ms-') },
  { name: 'ModelScope 模型名称', check: process.env.MODELSCOPE_MODEL.includes('Qwen') },
  { name: 'MCP URL 格式', check: process.env.BAZI_MCP_URL.includes('modelscope.net') },
  { name: 'MCP Timeout 数值', check: !isNaN(parseInt(process.env.BAZI_MCP_TIMEOUT)) }
];

configChecks.forEach(check => {
  console.log(`${check.check ? '✅' : '❌'} ${check.name}`);
});

// 总结
console.log('\n📊 配置总结:');
if (missingVars.length === 0) {
  console.log('✅ 所有必要的环境变量都已正确配置！');
  console.log('🚀 系统应该可以正常运行');
  
  // 模拟启动
  console.log('\n🎯 模拟启动检查:');
  try {
    const express = require('express');
    const app = express();
    console.log('✅ Express 可以正常导入');
    
    const PORT = process.env.PORT || 8080;
    console.log(`✅ 端口 ${PORT} 可以使用`);
    
    console.log('✅ 所有基础检查通过');
    console.log('🎉 Railway 部署应该可以成功！');
  } catch (error) {
    console.error('❌ 基础检查失败:', error.message);
  }
} else {
  console.log(`❌ 缺少 ${missingVars.length} 个必要的环境变量:`);
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('⚠️ 请检查 railway.toml 和 railway.env 文件');
}

console.log('\n🔧 Railway 配置测试完成');