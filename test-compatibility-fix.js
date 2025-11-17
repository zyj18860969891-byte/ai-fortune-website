// 测试脚本：验证兼容性分析修复
const http = require('http');

// 测试函数
function testCompatibilityFix() {
  console.log('🧪 开始测试兼容性分析修复...');
  
  const testCases = [
    {
      name: '第一步：设置用户生辰',
      request: {
        type: 'bazi',
        question: '1996.02.10',
        sessionId: 'compatibility-test-session',
        birthInfo: {
          year: 1996,
          month: 2,
          day: 10,
          hour: 0,
          minute: 0,
          gender: 'male',
          timezone: 'Asia/Shanghai'
        }
      }
    },
    {
      name: '第二步：兼容性询问（应记住用户数据）',
      request: {
        type: 'bazi',
        question: '如果我喜欢一个1989.07.18的女生，我们俩合适吗？？？',
        sessionId: 'compatibility-test-session'
      }
    },
    {
      name: '第三步：重申用户生辰（验证数据是否还在）',
      request: {
        type: 'bazi',
        question: '1996.02.10',
        sessionId: 'compatibility-test-session'
      }
    }
  ];
  
  let testCaseIndex = 0;
  
  function runNextTest() {
    if (testCaseIndex >= testCases.length) {
      console.log('✅ 所有测试完成！');
      return;
    }
    
    const testCase = testCases[testCaseIndex];
    console.log(`\n🔍 运行测试: ${testCase.name}`);
    
    const postData = JSON.stringify(testCase.request);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/fortune/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ ${testCase.name} - 状态: ${response.success}`);
          console.log(`📝 响应来源: ${response.source}`);
          
          // 检查响应内容
          if (response.prediction) {
            const content = response.prediction;
            
            if (testCase.name.includes('用户生辰')) {
              // 检查是否包含用户八字信息
              const hasBaziInfo = content.includes('1996年') || content.includes('丁火') || content.includes('丙子');
              console.log(`🔢 是否包含用户八字信息: ${hasBaziInfo}`);
            } else if (testCase.name.includes('兼容性')) {
              // 检查是否包含兼容性分析
              const hasCompatibility = content.includes('合适吗') || content.includes('般配') || content.includes('合婚');
              const hasBothBazi = content.includes('1996年') && content.includes('1989年');
              console.log(`💕 是否包含兼容性分析: ${hasCompatibility}`);
              console.log(`🔢 是否包含双方八字信息: ${hasBothBazi}`);
            }
          }
          
          testCaseIndex++;
          runNextTest();
        } catch (error) {
          console.error(`❌ ${testCase.name} - 解析响应失败:`, error.message);
          testCaseIndex++;
          runNextTest();
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ ${testCase.name} - 请求失败:`, error.message);
      testCaseIndex++;
      runNextTest();
    });
    
    req.write(postData);
    req.end();
  }
  
  runNextTest();
}

// 运行测试
if (require.main === module) {
  testCompatibilityFix();
}

module.exports = { testCompatibilityFix };