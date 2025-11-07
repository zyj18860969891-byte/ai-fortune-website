const app = require('./app-simple');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 AI算命服务已启动 (简化版本)`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
  console.log(`🌐 根路径: http://localhost:${PORT}/`);
});

module.exports = app;