const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Fortune Backend...');

// 启动 TypeScript 开发服务器
const devProcess = spawn('npx', ['ts-node-dev', '--respawn', '--transpile-only', 'src/server.ts'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true
});

devProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
});

devProcess.on('close', (code) => {
  console.log(`🛑 Development server exited with code ${code}`);
  process.exit(code);
});