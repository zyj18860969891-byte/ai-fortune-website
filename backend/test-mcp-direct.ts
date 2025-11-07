import { spawn } from 'child_process';

async function testMCPServer() {
  console.log('🧪 开始直接测试MCP服务...');
  
  return new Promise((resolve, reject) => {
    // 启动MCP服务器
    const mcpProcess = spawn('npx', ['bazi-mcp'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    console.log('🚀 MCP进程已启动');

    let serverReady = false;
    let testCompleted = false;

    // 监听输出
    mcpProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      console.log('📤 MCP输出:', output.trim());
      
      // 检测服务器就绪
      if (output.includes('running on stdio') || output.includes('Bazi MCP')) {
        if (!serverReady) {
          serverReady = true;
          console.log('✅ MCP服务器就绪，开始测试...');
          
          // 发送测试请求
          const testRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/call",
            params: {
              name: "analyze_bazi",
              arguments: {
                question: "本月运势如何？",
                context: "测试上下文"
              }
            }
          };
          
          console.log('📡 发送测试请求:', JSON.stringify(testRequest, null, 2));
          mcpProcess.stdin.write(JSON.stringify(testRequest) + '\n');
        }
      }
    });

    mcpProcess.stderr.on('data', (data: Buffer) => {
      console.log('⚠️ MCP错误:', data.toString());
    });

    // 超时处理
    setTimeout(() => {
      if (!testCompleted) {
        testCompleted = true;
        console.log('⏰ 测试超时，终止进程');
        mcpProcess.kill();
        resolve(false);
      }
    }, 10000);

    // 监听响应
    mcpProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      
      // 尝试解析响应
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line.trim());
            if (response.id === 1) {
              if (!testCompleted) {
                testCompleted = true;
                console.log('🎉 收到MCP响应:', JSON.stringify(response, null, 2));
                mcpProcess.kill();
                resolve(true);
              }
            }
          } catch (e) {
            // 不是JSON，继续
          }
        }
      }
    });
  });
}

// 运行测试
testMCPServer().then(result => {
  console.log('🧪 测试完成，结果:', result);
  process.exit(0);
}).catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});