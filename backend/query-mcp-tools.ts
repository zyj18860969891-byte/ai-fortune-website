import { spawn } from 'child_process';

async function queryMCPTools() {
  console.log('🔍 查询MCP支持的工具...');
  
  return new Promise((resolve, reject) => {
    const mcpProcess = spawn('npx', ['bazi-mcp'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    console.log('🚀 MCP进程已启动');

    let serverReady = false;
    let queryCompleted = false;

    mcpProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      console.log('📤 MCP输出:', output.trim());
      
      if (output.includes('running on stdio') || output.includes('Bazi MCP')) {
        if (!serverReady) {
          serverReady = true;
          console.log('✅ MCP服务器就绪，查询工具列表...');
          
          // 发送工具列表查询请求
          const toolsRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/list",
            params: {}
          };
          
          console.log('📡 发送工具查询请求:', JSON.stringify(toolsRequest, null, 2));
          mcpProcess.stdin.write(JSON.stringify(toolsRequest) + '\n');
        }
      }
    });

    mcpProcess.stderr.on('data', (data: Buffer) => {
      console.log('⚠️ MCP错误:', data.toString());
    });

    // 超时处理
    setTimeout(() => {
      if (!queryCompleted) {
        queryCompleted = true;
        console.log('⏰ 查询超时，终止进程');
        mcpProcess.kill();
        resolve(null);
      }
    }, 10000);

    // 监听响应
    mcpProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line.trim());
            if (response.id === 1) {
              if (!queryCompleted) {
                queryCompleted = true;
                console.log('🎉 收到工具列表响应:', JSON.stringify(response, null, 2));
                mcpProcess.kill();
                resolve(response);
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

// 运行查询
queryMCPTools().then(result => {
  console.log('🔍 工具查询完成');
  process.exit(0);
}).catch(error => {
  console.error('❌ 查询失败:', error);
  process.exit(1);
});
