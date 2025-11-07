const fetch = require('node-fetch');

async function testMsAgentMcpStandard() {
  console.log('🔮 测试@cantian-ai/Bazi-MCP (ms-agent标准)...');
  
  const mcpUrl = 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp';
  const apiKey = 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180';
  
  try {
    console.log('📡 测试JSON-RPC tools/list方法...');
    
    const toolsResponse = await fetch(mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-ModelScope-Token': apiKey
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      }),
      timeout: 10000
    });
    
    console.log('📊 tools/list状态:', toolsResponse.status);
    
    if (toolsResponse.ok) {
      const toolsData = await toolsResponse.json();
      console.log('✅ 获取工具列表成功:', {
        toolsCount: toolsData.result?.tools?.length || 0,
        tools: toolsData.result?.tools?.map(t => t.name) || []
      });
      
      // 测试八字计算
      console.log('\n🔮 测试JSON-RPC tools/call方法...');
      
      const testBirthData = {
        year: 1990,
        month: 5,
        day: 15,
        hour: 10,
        minute: 30,
        gender: 'male',
        timezone: 'Asia/Shanghai'
      };
      
      const calcResponse = await fetch(mcpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-ModelScope-Token': apiKey
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: {
            name: 'calculate_bazi',
            arguments: {
              birth_data: testBirthData,
              analysis_type: 'complete'
            }
          }
        }),
        timeout: 15000
      });
      
      if (calcResponse.ok) {
        const calcData = await calcResponse.json();
        console.log('✅ 八字计算成功:', {
          success: calcData.result?.success,
          hasBazi: !!calcData.result?.data?.bazi,
          hasWuxing: !!calcData.result?.data?.wuxing,
          hasTenGods: !!calcData.result?.data?.tenGods
        });
        
        console.log('\n🎉 @cantian-ai/Bazi-MCP (ms-agent标准) 测试成功！');
        return { 
          available: true, 
          tools: toolsData.result?.tools || [],
          result: calcData.result
        };
      } else {
        console.error('❌ 八字计算失败:', calcResponse.status, await calcResponse.text());
        return { available: false, error: 'calculation-failed', status: calcResponse.status };
      }
      
    } else {
      const errorText = await toolsResponse.text();
      console.error('❌ tools/list失败:', toolsResponse.status, errorText);
      return { available: false, error: errorText, status: toolsResponse.status };
    }
    
  } catch (error) {
    console.error('❌ ms-agent标准MCP服务连接失败:', error.message);
    return { available: false, error: error.message };
  }
}

testMsAgentMcpStandard().then(result => {
  console.log('\n🎯 最终测试结果:', result);
  if (result.available) {
    console.log('✅ ms-agent标准MCP服务可用！现在重启应用测试集成功能');
    console.log('💡 可用的工具:', result.tools.map(t => t.name));
  } else {
    console.log('❌ ms-agent标准MCP服务不可用');
  }
}).catch(console.error);
