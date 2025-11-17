
import app from './app';

const PORT = parseInt(process.env.PORT || '8080');

console.log('🔧 [启动前检查] 环境变量:');
console.log('  - PORT:', process.env.PORT);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - MODELSCOPE_MODEL:', process.env.MODELSCOPE_MODEL);
console.log('  - BAZI_MCP_URL:', process.env.BAZI_MCP_URL);
console.log('  - MODELSCOPE_API_KEY:', process.env.MODELSCOPE_API_KEY ? '已设置' : '未设置');

const server = app.listen(PORT, () => {
  console.log(`🚀 AI算命服务已启动 (使用真正的ModelScope AI)`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
  console.log(`🎯 算命接口: http://localhost:${PORT}/api/fortune/generate`);
  console.log(`💬 聊天接口: http://localhost:${PORT}/api/fortune/chat`);
  console.log(`📊 服务状态: http://localhost:${PORT}/api/fortune/status`);
  console.log(`🌐 使用ModelScope官方AI: ${process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507'}`);
  
  // 测试MCP服务连接
  console.log('🧪 [启动测试] 测试MCP服务连接...');
  setTimeout(async () => {
    try {
      const MsAgentStyleMcpService = require('./services/msAgentStyleMcpService').MsAgentStyleMcpService;
      const mcpService = MsAgentStyleMcpService.getInstance();
      console.log('✅ MCP服务实例创建成功');
      
      // 测试连接
      const toolsResult = await mcpService.listTools('Bazi-MCP');
      console.log('📋 MCP工具列表测试结果:', toolsResult);
    } catch (error: any) {
      console.error('❌ MCP服务连接测试失败:', error.message);
      console.error('🔍 错误详情:', error);
    }
  }, 3000);
});

// 保持进程运行
server.on('error', (error) => {
  console.error('❌ 服务器启动失败:', error);
  process.exit(1);
});

// 处理优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

export default app;