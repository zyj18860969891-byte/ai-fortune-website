const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 AI算命服务已启动 (使用真正的ModelScope AI)`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
  console.log(`🎯 算命接口: http://localhost:${PORT}/api/fortune/generate`);
  console.log(`💬 聊天接口: http://localhost:${PORT}/api/fortune/chat`);
  console.log(`📊 服务状态: http://localhost:${PORT}/api/fortune/status`);
  console.log(`🌐 使用ModelScope官方AI: ${process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507'}`);
});

module.exports = app;