const express = require('express');
const { RealModelScopeOnlineService } = require('./backend/src/services/realModelScopeOnlineService');

const app = express();
const PORT = 3001;

// 初始化 ModelScope 服务
const modelScopeService = new RealModelScopeOnlineService({
    modelId: process.env.MODELSCOPE_MODEL_ID || 'Qwen/Qwen3-235B-A22B-Instruct-2507',
    apiKey: process.env.MODELSCOPE_TOKEN,
    baseUrl: 'https://api.modelscope.cn'
});

// 测试接口
app.get('/test', async (req, res) => {
    try {
        console.log('🧪 开始测试 ModelScope API...');
        
        // 测试基本 AI 调用
        const testResult = await modelScopeService.generateFortune(
            '请帮我分析一下我的八字命理',
            [],
            'bazi',
            '你是一位专业的八字命理师。'
        );
        
        console.log('✅ 测试成功:', testResult);
        
        res.json({
            success: true,
            message: 'ModelScope API 测试成功',
            data: testResult,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ 测试失败:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 环境变量检查
app.get('/env', (req, res) => {
    const envInfo = {
        node_env: process.env.NODE_ENV,
        port: process.env.PORT,
        modelscope_token: process.env.MODELSCOPE_TOKEN ? '已配置' : '未配置',
        modelscope_model_id: process.env.MODELSCOPE_MODEL_ID || '未配置',
        timestamp: new Date().toISOString()
    };
    
    res.json({
        success: true,
        data: envInfo,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧪 测试服务器运行在端口 ${PORT}`);
    console.log(`🔍 测试接口: http://localhost:${PORT}/test`);
    console.log(`🔧 环境检查: http://localhost:${PORT}/env`);
});