// ModelScope API 测试脚本
async function testModelScopeAPI() {
    const token = process.env.MODELSCOPE_TOKEN || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180';
    const modelId = 'Qwen/Qwen3-235B-A22B-Instruct-2507';
    
    console.log('🧪 测试 ModelScope API 端点...');
    console.log('🤖 模型:', modelId);
    console.log('🔑 Token:', token ? token.substring(0, 20) + '...' : '未设置');
    
    // 可能的 ModelScope API 端点
    const endpoints = [
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        'https://api.modelscope.cn/api/v1/chat/completions',
        'https://api-inference.modelscope.cn/v1/chat/completions',
        'https://dashscope.aliyuncs.com/api/v1/chat/completions'
    ];
    
    const requestBody = {
        model: modelId,
        messages: [
            {
                role: 'user',
                content: '请简单介绍一下你自己'
            }
        ],
        max_tokens: 100,
        temperature: 0.7
    };
    
    for (const endpoint of endpoints) {
        console.log(`\n🔗 测试端点: ${endpoint}`);
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; BaziBot/1.0)'
                },
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(10000) // 10秒超时
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 成功!', {
                    status: response.status,
                    result: data.choices?.[0]?.message?.content?.substring(0, 100) + '...'
                });
                return { endpoint, success: true, data };
            } else {
                const errorText = await response.text();
                console.log('❌ HTTP错误:', response.status, errorText.substring(0, 100));
            }
            
        } catch (error) {
            console.log('❌ 连接失败:', error.message);
        }
    }
    
    console.log('\n❌ 所有端点都失败了');
    return { endpoint: null, success: false };
}

// 如果直接运行此脚本
if (require.main === module) {
    testModelScopeAPI().then(result => {
        console.log('\n🎯 测试结果:', result);
        process.exit(0);
    }).catch(error => {
        console.error('❌ 测试失败:', error);
        process.exit(1);
    });
}

module.exports = { testModelScopeAPI };