// 使用我们的MsAgentStyleMcpService直接测试
// 不依赖node-fetch，直接使用TypeScript模块

async function testMsAgentMcpService() {
  console.log('🔮 测试MsAgentStyleMcpService...');
  
  try {
    // 导入我们的服务类
    const { MsAgentStyleMcpService } = require('./src/services/msAgentStyleMcpService');
    
    const mcpService = MsAgentStyleMcpService.getInstance();
    
    console.log('📋 MCP配置:', JSON.stringify(mcpService.getMcpConfig(), null, 2));
    
    console.log('\n🔍 第一步：健康检查...');
    const healthResult = await mcpService.healthCheck();
    console.log('💊 健康检查结果:', JSON.stringify(healthResult, null, 2));
    
    if (healthResult.healthy) {
      console.log('\n🔮 第二步：八字计算测试...');
      
      const testBirthData = {
        year: 1990,
        month: 5,
        day: 15,
        hour: 10,
        minute: 30,
        gender: 'male',
        timezone: 'Asia/Shanghai'
      };
      
      const baziResult = await mcpService.calculateBazi(testBirthData);
      console.log('🔮 八字计算结果:', JSON.stringify(baziResult, null, 2));
      
      return {
        success: true,
        health: healthResult,
        bazi: baziResult,
        message: '✅ MsAgentStyleMcpService集成成功！'
      };
    } else {
      return {
        success: false,
        health: healthResult,
        message: '❌ MCP服务健康检查失败'
      };
    }
    
  } catch (error) {
    console.error('❌ MsAgentStyleMcpService测试失败:', error);
    return {
      success: false,
      error: error.message,
      message: '❌ MsAgentStyleMcpService测试失败'
    };
  }
}

// 运行测试
testMsAgentMcpService().then(result => {
  console.log('\n🎯 最终测试结果:');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log('\n🎉 恭喜！MCP服务集成成功！');
    console.log('💡 现在可以重启Node.js服务测试完整功能');
  } else {
    console.log('\n⚠️ MCP服务集成失败，需要调试');
  }
}).catch(console.error);