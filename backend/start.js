const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Fortune Backend...');

// 检查是否已经构建了 TypeScript 代码
const fs = require('fs');
const distPath = path.join(__dirname, 'dist', 'server.js');

if (fs.existsSync(distPath)) {
  console.log('✅ Using compiled JavaScript server');
  // 启动编译后的服务器
  const serverProcess = spawn('node', ['dist/server.js'], {
    cwd: path.join(__dirname),
    stdio: 'inherit',
    shell: true
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
  });

  serverProcess.on('close', (code) => {
    console.log(`🛑 Server exited with code ${code}`);
    process.exit(code);
  });
} else {
  console.log('⚠️  No compiled server found, trying to build first...');
  
  // 先构建 TypeScript 代码
  const buildProcess = spawn('npx', ['tsc'], {
    cwd: path.join(__dirname),
    stdio: 'inherit',
    shell: true
  });

  buildProcess.on('close', (buildCode) => {
    if (buildCode === 0) {
      console.log('✅ Build successful, starting server...');
      // 启动编译后的服务器
      const serverProcess = spawn('node', ['dist/server.js'], {
        cwd: path.join(__dirname),
        stdio: 'inherit',
        shell: true
      });

      serverProcess.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
      });

      serverProcess.on('close', (code) => {
        console.log(`🛑 Server exited with code ${code}`);
        process.exit(code);
      });
    } else {
      console.error('❌ Build failed');
      process.exit(1);
    }
  });
}