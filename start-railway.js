const express = require('express');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 10000;

// 启用 CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// 解析 JSON 请求体
app.use(express.json());

// 记录请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ==================== 启动后端服务 ====================
function startBackendService() {
  console.log('� Starting AI Fortune Backend Service...');
  
  // 先构建后端 TypeScript
  console.log('� Building backend...');
  const buildProcess = spawn('npx', ['tsc'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'pipe',
    shell: true
  });

  buildProcess.on('close', (buildCode) => {
    if (buildCode === 0) {
      console.log('✅ Backend build successful, starting server...');
      
      const backendProcess = spawn('node', ['backend/dist/server.js'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'pipe',
        shell: true
      });

      backendProcess.stdout.on('data', (data) => {
        console.log(`[Backend] ${data.toString().trim()}`);
      });

      backendProcess.stderr.on('data', (data) => {
        console.error(`[Backend Error] ${data.toString().trim()}`);
      });

      backendProcess.on('close', (code) => {
        console.log(`[Backend] Process exited with code ${code}`);
        if (code !== 0) {
          console.log('🔄 Restarting backend service...');
          setTimeout(startBackendService, 5000);
        }
      });
    } else {
      console.error('❌ Backend build failed');
      setTimeout(startBackendService, 5000);
    }
  });
}

// ==================== 静态前端文件服务 ====================
app.use(express.static(path.join(__dirname, 'dist')));

// SPA 路由支持 - 所有非 API 路由都返回 index.html
app.get('*', (req, res) => {
  console.log(`📄 Serving frontend: ${req.url}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ==================== 启动服务器 ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 AI Fortune Website running on port ${PORT}`);
  console.log(`🌐 Frontend: https://ai-fortune-website-production.up.railway.app`);
  console.log(`🔗 Backend API: https://ai-fortune-website-production.up.railway.app/api`);
  
  // 启动后端服务
  startBackendService();
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});