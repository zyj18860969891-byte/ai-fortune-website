"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const realModelScopeOnlineService_1 = require("../services/realModelScopeOnlineService");
const msAgentStyleMcpService_1 = require("../services/msAgentStyleMcpService");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// 初始化MsAgentStyleMcpService
const mcpService = msAgentStyleMcpService_1.MsAgentStyleMcpService.getInstance();
// 算命接口 - 使用@cantian-ai/Bazi-MCP + ModelScope AI
router.post('/generate', async (req, res) => {
    const startTime = Date.now();
    try {
        const requestData = req.body;
        // 验证输入
        if (!requestData.question || !requestData.type) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数：question 和 type',
                timestamp: new Date().toISOString()
            });
        }
        console.log('🎯 收到八字MCP + AI分析请求:', {
            question: requestData.question,
            type: requestData.type,
            hasBirthInfo: !!requestData.birthInfo
        });
        let baziData = null;
        // 如果是八字类型的分析，先通过@cantian-ai/Bazi-MCP获取八字数据
        if (requestData.type === 'bazi' || requestData.birthInfo) {
            try {
                console.log('🔮 调用@cantian-ai/Bazi-MCP服务（ms-agent风格）...');
                // 准备八字计算参数
                const birthData = requestData.birthInfo ? {
                    year: requestData.birthInfo.year,
                    month: requestData.birthInfo.month,
                    day: requestData.birthInfo.day,
                    hour: requestData.birthInfo.hour,
                    minute: requestData.birthInfo.minute,
                    gender: 'male',
                    timezone: 'Asia/Shanghai'
                } : extractBirthDataFromRequest(requestData);
                if (birthData) {
                    // 调用基于ms-agent风格的八字MCP服务
                    const baziResult = await mcpService.calculateBazi(birthData);
                    if (baziResult.success) {
                        baziData = baziResult.data;
                        console.log('✅ @cantian-ai/Bazi-MCP计算成功:', {
                            hasBazi: !!baziData?.bazi,
                            hasWuxing: !!baziData?.wuxing,
                            dayMaster: baziData?.dayMasterStrength?.dayMaster
                        });
                    }
                    else {
                        console.warn('⚠️ @cantian-ai/Bazi-MCP计算失败:', baziResult.error);
                    }
                }
                else {
                    console.log('⚠️ 未提供有效的出生数据，跳过八字MCP计算');
                }
            }
            catch (error) {
                console.error('❌ @cantian-ai/Bazi-MCP服务调用失败:', error);
                // 继续使用纯AI分析
            }
        }
        // 初始化AI服务（支持多模型）
        const modelConfig = getModelConfig();
        if (!modelConfig) {
            return res.status(500).json({
                success: false,
                error: 'AI服务配置错误',
                timestamp: new Date().toISOString()
            });
        }
        const realModelService = new realModelScopeOnlineService_1.RealModelScopeOnlineService(modelConfig);
        // 构建包含八字数据的增强提示词
        let enhancedQuestion = requestData.question;
        if (baziData) {
            enhancedQuestion = `${requestData.question}\n\n=== 基于以下八字专业分析 ===\n八字：${baziData.bazi.year.stem}${baziData.bazi.year.branch} ${baziData.bazi.month.stem}${baziData.bazi.month.branch} ${baziData.bazi.day.stem}${baziData.bazi.day.branch} ${baziData.bazi.hour.stem}${baziData.bazi.hour.branch}\n日主：${baziData.dayMasterStrength.dayMaster}（${baziData.dayMasterStrength.strength}）\n喜用神：${baziData.favorableElements.favorable?.join('、') || '未确定'}\n五行：${JSON.stringify(baziData.wuxing.elements)}\n\n请基于以上八字数据进行专业分析。`;
        }
        // 使用AI服务生成算命结果
        const fortuneResult = await realModelService.generateFortune(enhancedQuestion, requestData.context);
        console.log('✅ 八字MCP + AI分析完成:', {
            success: fortuneResult.success,
            source: fortuneResult.source,
            hasBaziData: !!baziData,
            mcpProtocol: 'bazi-mcp-ms-agent-style'
        });
        const response = {
            id: (0, uuid_1.v4)(),
            question: requestData.question,
            type: requestData.type,
            result: {
                ...fortuneResult,
                baziMcpData: baziData
            },
            timestamp: new Date().toISOString(),
            processingTime: Date.now() - startTime
        };
        res.json(response);
    }
    catch (error) {
        console.error('❌ 八字MCP + ModelScope AI分析失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '算命服务暂时不可用，请稍后再试',
            timestamp: new Date().toISOString()
        });
    }
});
// 聊天界面 - 使用@cantian-ai/Bazi-MCP + ModelScope AI
router.post('/chat', async (req, res) => {
    const startTime = Date.now();
    try {
        const requestData = req.body;
        if (!requestData.question) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数：question',
                timestamp: new Date().toISOString()
            });
        }
        console.log('💬 收到八字MCP + AI聊天请求:', {
            question: requestData.question,
            type: requestData.type,
            context: requestData.context?.substring(0, 100) + '...',
            hasBirthInfo: !!requestData.birthInfo,
            body: req.body
        });
        let baziData = null;
        let analysisType = 'general'; // 默认为普通分析
        // 如果用户提供了生辰八字，先通过@cantian-ai/Bazi-MCP获取分析
        if (requestData.birthInfo || requestData.type === 'bazi' ||
            extractBirthDataFromContext(requestData.context) || extractBirthDataFromQuestion(requestData.question)) {
            try {
                console.log('🔮 调用@cantian-ai/Bazi-MCP服务（聊天模式）...');
                // 提取或使用提供的生辰数据
                const birthData = requestData.birthInfo ||
                    extractBirthDataFromContext(requestData.context) ||
                    extractBirthDataFromQuestion(requestData.question);
                if (birthData) {
                    const baziResult = await mcpService.calculateBazi(birthData);
                    if (baziResult.success) {
                        baziData = baziResult.data;
                        analysisType = 'bazi-enhanced';
                        console.log('✅ 聊天模式八字MCP计算成功');
                    }
                    else {
                        console.log('⚠️ 八字MCP计算失败:', baziResult.message);
                    }
                }
                else {
                    console.log('⚠️ 未找到有效的生辰数据');
                }
            }
            catch (error) {
                console.warn('⚠️ 聊天模式八字MCP调用失败:', error);
            }
        }
        else if (requestData.type === 'bazi') {
            // 如果是八字类型但没有出生信息，提示用户
            console.log('⚠️ 用户请求八字分析但未提供出生信息，使用通用分析');
            analysisType = 'bazi-requested';
        }
        // 初始化AI服务（支持多模型）
        const modelConfig = getModelConfig();
        if (!modelConfig) {
            return res.status(500).json({
                success: false,
                error: 'AI服务配置错误',
                timestamp: new Date().toISOString()
            });
        }
        const realModelService = new realModelScopeOnlineService_1.RealModelScopeOnlineService(modelConfig);
        // 构建增强的问题提示
        let enhancedQuestion = requestData.question;
        let systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。';
        if (baziData) {
            enhancedQuestion = `${requestData.question}\n\n请参考以下八字分析数据：\n日主：${baziData.日主 || '未知'}\n八字：${baziData.八字 || '未知'}\n生肖：${baziData.生肖 || '未知'}\n阳历：${baziData.阳历 || '未知'}`;
            systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。我已经为您进行了专业的八字分析，现在基于您的八字数据为您提供精准的占卜建议。';
        }
        else if (requestData.type === 'bazi') {
            enhancedQuestion = `${requestData.question}\n\n注意：您请求的是八字分析，但未提供出生信息。我将为您提供一般性的占卜分析，建议您提供出生信息以获得更精准的八字分析。`;
            systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。您请求的是八字分析，但未提供出生信息。我将为您提供一般性的占卜分析，建议您提供出生信息以获得更精准的八字分析。';
        }
        // 调试输出
        console.log('🔍 调试信息:', {
            enhancedQuestion,
            context: requestData.context,
            type: requestData.type,
            systemPrompt,
            baziData: !!baziData
        });
        // 使用AI服务进行分析
        const result = await realModelService.generateFortune(enhancedQuestion, requestData.context, requestData.type, systemPrompt);
        console.log('✅ 八字MCP + AI聊天分析完成:', {
            success: result.success,
            source: result.source,
            hasBaziData: !!baziData
        });
        const response = {
            id: (0, uuid_1.v4)(),
            question: requestData.question,
            type: requestData.type || 'general',
            result: {
                ...result,
                baziMcpData: baziData
            },
            timestamp: new Date().toISOString(),
            processingTime: Date.now() - startTime
        };
        res.json(response);
    }
    catch (error) {
        console.error('❌ 八字MCP + ModelScope AI聊天失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '聊天服务暂时不可用，请稍后再试',
            timestamp: new Date().toISOString()
        });
    }
});
// 专门的八字分析接口
router.post('/bazi/analyze', async (req, res) => {
    try {
        const birthData = req.body.birthData;
        if (!birthData || !birthData.year || !birthData.month || !birthData.day) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数：出生年月日',
                timestamp: new Date().toISOString()
            });
        }
        console.log('🔮 接收专业八字分析请求:', birthData);
        const baziResult = await mcpService.calculateBazi(birthData);
        if (!baziResult.success) {
            return res.status(500).json({
                success: false,
                error: baziResult.error || '八字分析服务不可用',
                timestamp: new Date().toISOString()
            });
        }
        console.log('✅ 专业八字分析完成');
        res.json({
            success: true,
            data: {
                bazi: baziResult.data.bazi,
                analysis: {
                    wuxing: baziResult.data.wuxing,
                    tenGods: baziResult.data.tenGods,
                    dayMasterStrength: baziResult.data.dayMasterStrength,
                    favorableElements: baziResult.data.favorableElements
                }
            },
            mcpProtocol: 'bazi-professional-analysis-ms-agent-style',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ 专业八字分析失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '八字分析服务暂时不可用',
            timestamp: new Date().toISOString()
        });
    }
});
// 服务状态检查
router.get('/status', async (req, res) => {
    try {
        console.log('📊 检查服务状态...');
        // 检查MCP服务健康状态
        const mcpHealth = await mcpService.healthCheck();
        // 获取当前AI服务配置
        const modelConfig = getModelConfig();
        const modelService = modelConfig ? new realModelScopeOnlineService_1.RealModelScopeOnlineService(modelConfig) : null;
        const modelHealth = modelService ? await modelService.healthCheck() : null;
        res.json({
            healthy: true,
            service: 'ai-fortune-backend',
            version: '2.0.0-multi-model',
            features: {
                mcpService: {
                    healthy: mcpHealth.healthy,
                    service: mcpHealth.service,
                    endpoint: mcpHealth.endpoint
                },
                aiService: {
                    healthy: modelHealth?.healthy || false,
                    service: modelHealth?.service || 'unknown',
                    modelId: modelConfig?.modelId,
                    serviceType: modelConfig?.serviceType,
                    apiStatus: modelHealth?.apiStatus || 'unavailable'
                },
                baziAnalysis: {
                    enabled: true,
                    mcpProtocol: 'ms-agent-style'
                },
                multiModel: {
                    enabled: true,
                    supported: ['modelscope', 'openai']
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ 服务状态检查失败:', error);
        res.status(500).json({
            healthy: false,
            service: 'ai-fortune-backend',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// 八字MCP服务健康检查
router.get('/bazi/health', async (req, res) => {
    try {
        console.log('🔍 检查@cantian-ai/Bazi-MCP服务健康状态...');
        const health = await mcpService.healthCheck();
        res.json({
            ...health,
            service: '@cantian-ai/Bazi-MCP (ms-agent风格)',
            config: mcpService.getMcpConfig(),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ 八字MCP健康检查失败:', error);
        res.status(500).json({
            healthy: false,
            service: '@cantian-ai/Bazi-MCP (ms-agent风格)',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// 从请求中提取出生数据
function extractBirthDataFromRequest(requestData) {
    if (requestData.birthData) {
        return requestData.birthData;
    }
    if (requestData.birthYear && requestData.birthMonth && requestData.birthDay) {
        return {
            year: requestData.birthYear,
            month: requestData.birthMonth,
            day: requestData.birthDay,
            hour: requestData.birthHour || 0,
            minute: requestData.birthMinute || 0,
            gender: requestData.gender || 'male',
            timezone: 'Asia/Shanghai'
        };
    }
    return null;
}
// 从上下文提取生辰数据
function extractBirthDataFromContext(context) {
    if (!context)
        return null;
    const yearMatch = context.match(/(19|20)\d{2}/);
    const monthMatch = context.match(/(\d{1,2})月/);
    const dayMatch = context.match(/(\d{1,2})日/);
    const hourMatch = context.match(/(\d{1,2})时/);
    if (yearMatch && monthMatch && dayMatch) {
        return {
            year: parseInt(yearMatch[0]),
            month: parseInt(monthMatch[1]),
            day: parseInt(dayMatch[1]),
            hour: hourMatch ? parseInt(hourMatch[1]) : 0,
            minute: 0,
            gender: 'male',
            timezone: 'Asia/Shanghai'
        };
    }
    return null;
}
// 从问题中提取生辰数据
function extractBirthDataFromQuestion(question) {
    if (!question)
        return null;
    // 尝试匹配常见的日期格式
    const datePatterns = [
        /(\d{4})\.(\d{1,2})\.(\d{1,2})/, // 1996.02.10
        /(\d{4})-(\d{1,2})-(\d{1,2})/, // 1996-02-10
        /(\d{4})年(\d{1,2})月(\d{1,2})日?/, // 1996年02月10日
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // 02/10/1996
        /(\d{1,2})-(\d{1,2})-(\d{4})/ // 02-10-1996
    ];
    for (const pattern of datePatterns) {
        const match = question.match(pattern);
        if (match) {
            let year, month, day;
            // 根据匹配的模式判断日期格式
            if (pattern.source.includes('\\d{4}')) {
                // 年-月-日 格式 (第一个捕获组是年)
                year = parseInt(match[1]);
                month = parseInt(match[2]);
                day = parseInt(match[3]);
            }
            else {
                // 月-日-年 格式 (第三个捕获组是年)
                month = parseInt(match[1]);
                day = parseInt(match[2]);
                year = parseInt(match[3]);
            }
            // 验证日期的合理性
            if (year && month && day && year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                console.log('✅ 成功提取出生信息:', { year, month, day, question });
                return {
                    year,
                    month,
                    day,
                    hour: 0,
                    minute: 0,
                    gender: 'male',
                    timezone: 'Asia/Shanghai'
                };
            }
        }
    }
    return null;
}
exports.default = router;
// 多模型支持相关路由
// 获取服务状态 (兼容前端请求)
router.get('/service-status', async (req, res) => {
    try {
        console.log('📊 检查服务状态...');
        // 检查MCP服务健康状态
        const mcpHealth = await mcpService.healthCheck();
        // 获取当前AI服务配置
        const modelConfig = getModelConfig();
        const modelService = modelConfig ? new realModelScopeOnlineService_1.RealModelScopeOnlineService(modelConfig) : null;
        const modelHealth = modelService ? await modelService.healthCheck() : null;
        res.json({
            healthy: true,
            service: 'ai-fortune-backend',
            version: '2.0.0-multi-model',
            features: {
                mcpService: {
                    healthy: mcpHealth.healthy,
                    service: mcpHealth.service,
                    endpoint: mcpHealth.endpoint
                },
                aiService: {
                    healthy: modelHealth?.healthy || false,
                    service: modelHealth?.service || 'unknown',
                    modelId: modelConfig?.modelId,
                    serviceType: modelConfig?.serviceType,
                    apiStatus: modelHealth?.apiStatus || 'unavailable'
                },
                baziAnalysis: {
                    enabled: true,
                    mcpProtocol: 'ms-agent-style'
                },
                multiModel: {
                    enabled: true,
                    supported: ['modelscope', 'openai']
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ 服务状态检查失败:', error);
        res.status(500).json({
            healthy: false,
            service: 'ai-fortune-backend',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// 获取模型配置
router.get('/model-config', async (req, res) => {
    try {
        const modelConfig = getModelConfig();
        if (!modelConfig) {
            return res.status(500).json({
                success: false,
                error: '无法获取模型配置',
                timestamp: new Date().toISOString()
            });
        }
        res.json({
            success: true,
            config: modelConfig,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// 切换AI服务
router.post('/switch-service', async (req, res) => {
    try {
        const { serviceType } = req.body;
        if (!serviceType || !['modelscope', 'openai'].includes(serviceType)) {
            return res.status(400).json({
                success: false,
                error: '无效的服务类型，必须是 modelscope 或 openai',
                timestamp: new Date().toISOString()
            });
        }
        // 这里可以添加服务切换逻辑
        // 目前只是返回成功响应
        res.json({
            success: true,
            message: `已切换到 ${serviceType} 服务`,
            currentService: serviceType,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// 获取算命类型
router.get('/types', async (req, res) => {
    try {
        const types = [
            {
                id: 'tarot',
                name: '塔罗占卜',
                description: '使用塔罗牌进行占卜分析',
                icon: '🔮',
                color: 'purple'
            },
            {
                id: 'bazi',
                name: '八字命理',
                description: '基于生辰八字的命理分析',
                icon: '📜',
                color: 'gold'
            },
            {
                id: 'astrology',
                name: '星座占星',
                description: '基于星座的占星分析',
                icon: '⭐',
                color: 'blue'
            },
            {
                id: 'numerology',
                name: '数字命理',
                description: '基于数字的命理分析',
                icon: '🔢',
                color: 'green'
            }
        ];
        res.json({
            success: true,
            types,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// 验证模型配置
router.post('/ai/validate', async (req, res) => {
    try {
        const { serviceType } = req.body;
        if (!serviceType || !['modelscope', 'openai'].includes(serviceType)) {
            return res.status(400).json({
                success: false,
                error: '无效的服务类型，必须是 modelscope 或 openai',
                timestamp: new Date().toISOString()
            });
        }
        const modelConfig = getModelConfig(serviceType);
        if (!modelConfig) {
            return res.status(500).json({
                success: false,
                error: '无法获取指定服务的配置',
                timestamp: new Date().toISOString()
            });
        }
        // 简单的配置验证
        const errors = [];
        if (!modelConfig.apiKey) {
            errors.push('API密钥未配置');
        }
        if (!modelConfig.modelId) {
            errors.push('模型ID未配置');
        }
        if (!modelConfig.baseUrl) {
            errors.push('基础URL未配置');
        }
        if (serviceType === 'openai' && !modelConfig.openaiApiKey) {
            errors.push('OpenAI API密钥未配置');
        }
        res.json({
            success: true,
            valid: errors.length === 0,
            errors,
            serviceType,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
//# sourceMappingURL=fortune-old.js.map