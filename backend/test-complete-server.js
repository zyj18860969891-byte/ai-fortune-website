// 完整服务器测试文件
const { spawn } = require('child_process');

console.log('🧪 开始测试完整AI算命服务器...');

const serverProcess = spawn('node', ['dist/complete-server.js'], {
  cwd: 'e:\\MultiModel\\ai-fortune-website\\backend',
  env: {
    ...process.env,
    PORT: '3002'
  }
});

serverProcess.stdout.on('data', (data) => {
  console.log('📤 服务器输出:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error('❌ 服务器错误:', data.toString());
});

serverProcess.on('close', (code) => {
  console.log(`🔚 服务器进程结束，退出码: ${code}`);
});

// 等待5秒后测试API
setTimeout(async () => {
  try {
    const fetch = require('node-fetch');
    
    console.log('🔍 测试健康检查接口...');
    const healthResponse = await fetch('http://localhost:3002/health');
    const healthData = await healthResponse.json();
    console.log('✅ 健康检查结果:', healthData);
    
    console.log('🔍 测试状态接口...');
    const statusResponse = await fetch('http://localhost:3002/api/fortune/status');
    const statusData = await statusResponse.json();
    console.log('✅ 状态检查结果:', statusData);
    
    console.log('🔍 测试聊天接口（无八字）...');
    const chatResponse = await fetch('http://localhost:3002/api/fortune/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: '今天的运势怎么样？',
        type: 'tarot'
      })
    });
    const chatData = await chatResponse.json();
    console.log('✅ 聊天测试结果:', chatData);
    
    console.log('🔍 测试八字聊天接口（有出生信息）...');
    const baziResponse = await fetch('http://localhost:3002/api/fortune/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: '我的运势如何？我出生于1990.05.15',
        type: 'bazi',
        sessionId: 'test-session-123'
      })
    });
    const baziData = await baziResponse.json();
    console.log('✅ 八字测试结果:', baziData);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    // 关闭服务器
    serverProcess.kill('SIGTERM');
    setTimeout(() => {
      serverProcess.kill('SIGKILL');
    }, 2000);
  }
}, 5000);