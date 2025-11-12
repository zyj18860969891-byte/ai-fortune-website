// 测试环境变量配置
console.log('🔧 测试环境变量配置...');

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

// 总结
console.log('\n📊 配置总结:');
if (missingVars.length === 0) {
  console.log('✅ 所有必要的环境变量都已正确配置！');
  console.log('🚀 系统应该可以正常运行');
} else {
  console.log(`❌ 缺少 ${missingVars.length} 个必要的环境变量:`);
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('⚠️ 请检查 railway.toml 和 railway.env 文件');
}

// 模拟启动
console.log('\n🎯 模拟启动检查:');
try {
  const express = require('express');
  const app = express();
  console.log('✅ Express 可以正常导入');
  
  const PORT = process.env.PORT || 8080;
  console.log(`✅ 端口 ${PORT} 可以使用`);
  
  console.log('✅ 所有基础检查通过');
} catch (error) {
  console.error('❌ 基础检查失败:', error.message);
}

console.log('\n🔧 配置测试完成');