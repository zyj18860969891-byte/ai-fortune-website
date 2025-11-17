// 测试脚本：验证出生数据持久化修复
const http = require('http');

// 测试函数
function testBirthDataFix() {
  console.log('🧪 开始测试出生数据持久化修复...');
  
  const testCases = [
    {
      name: '单人生成测试',
      request: {
        type: 'bazi',
        question: '我是1996.02.10出生的，请分析我的八字',
        sessionId: 'test-session-1',
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
      name: '兼容性请求测试',
      request: {
        type: 'bazi',
        question: '如果我喜欢一个1989.07.18的女生，我们俩合适吗？？？',
        sessionId: 'test-session-1',
        birthInfo: null
      }
    },
    {
      name: '第二个兼容性请求测试',
      request: {
        type: 'bazi',
        question: '我和1995.03.20的男生合适吗？',
        sessionId: 'test-session-1',
        birthInfo: null
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
          console.log(`🔢 是否有八字数据: ${response.hasBaziData}`);
          if (response.hasBaziData2) {
            console.log(`🔢 是否有第二个人八字数据: ${response.hasBaziData2}`);
          }
          if (response.isCompatibility) {
            console.log(`💕 是否为兼容性分析: ${response.isCompatibility}`);
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
  testBirthDataFix();
}

module.exports = { testBirthDataFix };