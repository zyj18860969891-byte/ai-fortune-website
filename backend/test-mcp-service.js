// 测试MsAgentStyleMcpService是否能成功调用MCP服务
const { MsAgentStyleMcpService } = require('./src/services/msAgentStyleMcpService');

async function testMcpService() {
  console.log('🔮 测试MsAgentStyleMcpService调用MCP服务...');
  
  try {
    // 获取MCP服务实例
    const mcpService = MsAgentStyleMcpService.getInstance();
    
    console.log('✅ MsAgentStyleMcpService实例获取成功');
    
    // 测试健康检查
    console.log('\n🔍 测试MCP服务健康检查...');
    const healthResult = await mcpService.healthCheck();
    console.log('📊 健康检查结果:', healthResult);
    
    if (healthResult.healthy) {
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
      
      const baziResult = await mcpService.calculateBazi(testBirthData);
      console.log('📊 八字计算结果:', baziResult);
      
      if (baziResult.success) {
        console.log('\n🎉 @cantian-ai/Bazi-MCP服务集成成功！');
        console.log('✅ MCP服务完全正常工作');
        return { success: true, health: healthResult, bazi: baziResult };
      } else {
        console.log('\n❌ 八字计算失败');
        return { success: false, health: healthResult, bazi: baziResult };
      }
    } else {
      console.log('\n❌ MCP服务健康检查失败');
      return { success: false, health: healthResult };
    }
    
  } catch (error) {
    console.error('❌ 测试过程出现异常:', error.message);
    return { success: false, error: error.message };
  }
}

// 运行测试
testMcpService().then(result => {
  console.log('\n🎯 最终测试结果:');
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log('\n✅ MCP服务测试完全成功！');
    console.log('💡 现在可以测试集成接口了');
  } else {
    console.log('\n❌ MCP服务测试失败');
    console.log('💡 需要检查MCP服务配置');
  }
}).catch(console.error);