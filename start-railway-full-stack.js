const express = require('express');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

console.log('🔧 启动端口:', PORT);
console.log('🔧 部署环境:', process.env.NODE_ENV || 'production');

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

// 静态前端文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'full-stack-app',
    hasBackend: true 
  });
});

// API 代理到后端服务
app.all('/api/*', async (req, res) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  const apiPath = req.url.replace('/api', '');
  const targetUrl = `${backendUrl}${apiPath}`;
  
  try {
    console.log(`🔗 代理API请求: ${req.method} ${req.url} -> ${targetUrl}`);
    
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
    });
    
    const data = await response.text();
    res.status(response.status).send(data);
    
  } catch (error) {
    console.error('❌ API代理失败:', error.message);
    res.status(500).json({
      success: false,
      error: '后端服务不可用',
      message: '请稍后重试'
    });
  }
});

// SPA 路由支持
app.get('*', (req, res) => {
  console.log(`📄 Serving frontend: ${req.url}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动后端服务
function startBackendService() {
  console.log('🚀 启动AI算命后端服务...');
  
  // 设置环境变量
  const backendEnv = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '3001'
  };
  
  // 先构建后端 TypeScript
  console.log('🔨 构建后端服务...');
  const buildProcess = spawn('cd', ['backend', '&&', 'npm', 'run', 'build'], {
    stdio: 'pipe',
    shell: true,
    env: backendEnv
  });

  buildProcess.stdout.on('data', (data) => {
    console.log(`[Backend Build] ${data.toString().trim()}`);
  });

  buildProcess.stderr.on('data', (data) => {
    console.error(`[Backend Build Error] ${data.toString().trim()}`);
  });

  buildProcess.on('close', (buildCode) => {
    if (buildCode === 0) {
      console.log('✅ 后端构建成功，启动服务器...');
      
      const backendProcess = spawn('npm', ['start'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'pipe',
        shell: true,
        env: backendEnv
      });

      backendProcess.stdout.on('data', (data) => {
        console.log(`[Backend] ${data.toString().trim()}`);
      });

      backendProcess.stderr.on('data', (data) => {
        console.error(`[Backend Error] ${data.toString().trim()}`);
      });

      backendProcess.on('close', (code) => {
        console.log(`[Backend] 进程退出，代码: ${code}`);
        if (code !== 0) {
          console.log('🔄 重启后端服务...');
          setTimeout(startBackendService, 5000);
        }
      });
    } else {
      console.error('❌ 后端构建失败');
      setTimeout(startBackendService, 5000);
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  const hostname = process.env.RAILWAY_DEPLOYMENT_ID || 'your-app.railway.app';
  const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN || `https://${hostname}.railway.app`;
  
  console.log(`🎉 AI Fortune Website running on port ${PORT}`);
  console.log(`🌐 Frontend: ${baseUrl}`);
  console.log(`🔍 Health Check: ${baseUrl}/health`);
  console.log(`🔧 Backend API: ${baseUrl}/api/fortune/chat`);
  console.log(`🤖 Using ModelScope: ${process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507'}`);
  
  // 延迟启动后端服务，确保前端服务先启动
  setTimeout(() => {
    startBackendService();
  }, 3000);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，优雅关闭...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，优雅关闭...');
  process.exit(0);
});