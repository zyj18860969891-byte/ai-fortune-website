// 测试backend模块加载
console.log('🔍 测试backend模块加载...');

try {
  console.log('📦 尝试加载RealModelScopeOnlineService...');
  const RealModelScopeModule = require('./backend/dist/services/realModelScopeOnlineService');
  console.log('✅ RealModelScopeOnlineService模块加载成功');
  
  console.log('📦 尝试加载MsAgentStyleMcpService...');
  const MsAgentMcpModule = require('./backend/dist/services/msAgentStyleMcpService');
  console.log('✅ MsAgentStyleMcpService模块加载成功');
  
  console.log('📦 尝试加载fortune路由...');
  const fortuneRouterModule = require('./backend/dist/routes/fortune');
  console.log('✅ fortune路由模块加载成功');
  
  console.log('🎉 所有backend模块加载测试通过！');
} catch (error) {
  console.error('❌ backend模块加载失败:', error.message);
  console.error('🔍 错误详情:', error.stack);
}