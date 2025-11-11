// 测试 ModelScope API 连接 (使用原生 fetch)

async function testModelScopeAPI() {
  const token = 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180';
  const modelId = 'Qwen/Qwen3-235B-A22B-Instruct-2507';
  
  console.log('🧪 开始测试 ModelScope API...');
  console.log('🔑 Token:', token);
  console.log('🤖 模型:', modelId);
  
  const url = 'https://api-inference.modelscope.cn/v1/chat/completions';
  
  const requestBody = {
    model: modelId,
    messages: [
      {
        role: 'system',
        content: '你是一位专业的八字命理师，擅长根据出生日期进行详细的八字分析。'
      },
      {
        role: 'user',
        content: '请分析1990年5月15日出生的人的性格特质'
      }
    ],
    max_tokens: 500,
    temperature: 0.7,
    stream: false
  };
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; BaziBot/1.0)'
  };
  
  try {
    console.log('🔗 请求URL:', url);
    console.log('📤 请求体:', JSON.stringify(requestBody, null, 2));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📊 响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 响应错误:', errorText);
      return { success: false, error: errorText };
    }
    
    const responseData = await response.json();
    const aiResponse = responseData.choices[0].message.content;
    
    console.log('✅ API 调用成功!');
    console.log('🔑 响应长度:', aiResponse.length);
    console.log('📝 AI回复:', aiResponse.substring(0, 200) + '...');
    
    return { 
      success: true, 
      response: aiResponse.substring(0, 200) + '...',
      fullResponse: aiResponse 
    };
    
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
    console.log('❌ 错误类型:', error.constructor.name);
    
    if (error.name === 'AbortError') {
      console.log('⏰ 请求超时');
    }
    
    return { success: false, error: error.message };
  }
}

// 运行测试
testModelScopeAPI()
  .then(result => {
    console.log('\n🎯 测试结果:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 测试异常:', error);
    process.exit(1);
  });