// 正确的MCP服务调用方式：需要支持text/event-stream格式
async function testNewBaziMcpService() {
  console.log('🔮 测试新的@cantian-ai/Bazi-MCP服务...');
  
  const baseUrl = 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp';
  
  try {
    console.log('📡 尝试连接新的在线服务:', baseUrl);
    
    // 第一步：MCP初始化（需要同时支持JSON和SSE）
    const initResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: {
            name: 'test-client',
            version: '1.0.0'
          }
        }
      }),
      timeout: 10000
    });
    
    console.log('📊 MCP初始化响应状态:', initResponse.status);
    
    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error('❌ MCP初始化失败:', initResponse.status, errorText);
      
      // 尝试只使用text/event-stream
      if (initResponse.status === 406) {
        console.log('🔄 尝试使用text/event-stream格式...');
        
        const sseResponse = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'initialize',
            params: {
              protocolVersion: '2024-11-05',
              capabilities: {},
              clientInfo: {
                name: 'test-client',
                version: '1.0.0'
              }
            }
          })
        });
        
        if (sseResponse.ok) {
          console.log('✅ 使用SSE格式初始化成功');
          
          // 解析SSE响应
          const responseText = await sseResponse.text();
          console.log('📄 SSE响应内容:', responseText);
          
          // 提取session ID（如果有的话）
          const sessionMatch = responseText.match(/session["\s:]*([a-zA-Z0-9-]+)/);
          const mcpSessionId = sessionMatch ? sessionMatch[1] : 'default-session';
          
          console.log('🔑 获取MCP会话ID:', mcpSessionId);
          
          // 测试八字计算
          return await testBaziCalculation(baseUrl, mcpSessionId);
        }
      }
      
      return { available: false, error: 'init-failed', status: initResponse.status };
    }
    
    const initData = await initResponse.json();
    console.log('✅ MCP初始化成功:', initData);
    
    // 获取mcp-session-id
    const mcpSessionId = initData.result?.serverInfo?.id || 'mcp-session-' + Date.now();
    console.log('🔑 获取MCP会话ID:', mcpSessionId);
    
    // 第二步：使用MCP会话调用工具
    return await testBaziCalculation(baseUrl, mcpSessionId);
    
  } catch (error) {
    console.error('❌ 新在线服务连接失败:', error.message);
    return { available: false, error: error.message };
  }
}

async function testBaziCalculation(baseUrl, mcpSessionId) {
  console.log('\n🔮 测试八字计算功能...');
  
  const testBirthData = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    gender: 'male',
    timezone: 'Asia/Shanghai'
  };
  
  try {
    // 使用JSON格式
    const jsonResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'mcp-session-id': mcpSessionId
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'calculate_bazi',
          arguments: {
            birth_data: testBirthData,
            analysis_type: 'complete'
          }
        }
      })
    });
    
    if (jsonResponse.ok) {
      const jsonData = await jsonResponse.json();
      console.log('✅ JSON格式八字计算成功:', JSON.stringify(jsonData, null, 2));
      
      return { available: true, result: jsonData, sessionId: mcpSessionId };
    } else {
      const errorText = await jsonResponse.text();
      console.warn('⚠️ JSON格式失败:', jsonResponse.status, errorText);
    }
    
    // 尝试SSE格式
    console.log('🔄 尝试SSE格式...');
    
    const sseResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'mcp-session-id': mcpSessionId
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'calculate_bazi',
          arguments: {
            birth_data: testBirthData,
            analysis_type: 'complete'
          }
        }
      })
    });
    
    if (sseResponse.ok) {
      const sseResponseText = await sseResponse.text();
      console.log('✅ SSE格式八字计算成功:', sseResponseText);
      
      return { available: true, result: sseResponseText, sessionId: mcpSessionId };
    } else {
      const errorText = await sseResponse.text();
      console.error('❌ SSE格式也失败:', sseResponse.status, errorText);
      return { available: false, error: 'both-formats-failed' };
    }
    
  } catch (error) {
    console.error('❌ 八字计算过程出错:', error.message);
    return { available: false, error: error.message };
  }
}

async function runTest() {
  try {
    const result = await testNewBaziMcpService();
    if (result.available) {
      console.log('\n🎉 新的@cantian-ai/Bazi-MCP服务可用！');
      console.log('✅ MCP会话ID:', result.sessionId);
      console.log('✅ 现在可以集成到fortune.ts中了');
      
      console.log('\n💡 MCP集成要点:');
      console.log('1. 需要同时支持JSON和SSE格式');
      console.log('2. 必须先调用initialize方法');
      console.log('3. 使用返回的sessionId进行后续调用');
      console.log('4. 每次调用都要带上mcp-session-id头部');
      console.log('5. 使用tools/call方法调用具体功能');
      
    } else {
      console.log('\n❌ 新的@cantian-ai/Bazi-MCP服务仍然不可用');
      console.log('💡 请检查服务配置或联系服务提供商');
    }
  } catch (error) {
    console.error('❌ 测试过程出现错误:', error.message);
  }
}

runTest();