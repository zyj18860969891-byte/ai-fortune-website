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
        console.log('🎯 收到八字MCP + ModelScope AI分析请求:', {
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
                            bazi: baziData.bazi,
                            wuxing: baziData.wuxing?.elements,
                            dayMasterStrength: baziData.dayMasterStrength
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
        // 初始化真正的ModelScope服务
        const realModelService = new realModelScopeOnlineService_1.RealModelScopeOnlineService({
            apiKey: process.env.MODELSCOPE_API_KEY || '',
            modelId: process.env.MODELSCOPE_MODEL || 'qwen/Qwen2.5-Coder-32B-Instruct',
            baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
        });
        // 构建包含八字数据的增强提示词
        let enhancedQuestion = requestData.question;
        if (baziData) {
            enhancedQuestion = `${requestData.question}\n\n=== 基于以下八字专业分析 ===\n八字：${baziData.bazi.year.stem}${baziData.bazi.year.branch} ${baziData.bazi.month.stem}${baziData.bazi.month.branch} ${baziData.bazi.day.stem}${baziData.bazi.day.branch} ${baziData.bazi.hour.stem}${baziData.bazi.hour.branch}\n日主：${baziData.dayMasterStrength.dayMaster}（${baziData.dayMasterStrength.strength}）\n喜用神：${baziData.favorableElements.favorable?.join('、') || '未确定'}\n五行：${JSON.stringify(baziData.wuxing.elements)}\n\n请基于以上八字数据进行专业分析。`;
        }
        // 使用真正的ModelScope AI生成算命结果
        const fortuneResult = await realModelService.generateFortune(enhancedQuestion, requestData.context);
        console.log('✅ 八字MCP + ModelScope AI分析完成:', {
            success: fortuneResult.success,
            source: fortuneResult.source,
            hasBaziData: !!baziData,
            mcpProtocol: 'ms-agent-style-bazi-mcp'
        });
        const response = {
            id: (0, uuid_1.v4)(),
            question: requestData.question,
            type: requestData.type,
            result: {
                ...fortuneResult,
                // 添加八字MCP数据到结果中
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
        console.log('🔮 接收专业八字分析请求（ms-agent风格）:', birthData);
        // 调用@cantian-ai/Bazi-MCP进行全面八字分析
        const baziResult = await mcpService.calculateBazi(birthData);
        if (!baziResult.success) {
            return res.status(500).json({
                success: false,
                error: baziResult.error || '八字分析服务不可用',
                timestamp: new Date().toISOString()
            });
        }
        console.log('✅ 专业八字分析完成（ms-agent风格）');
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
            mcpProtocol: 'bazi-professional-analysis-ms-agent',
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
// 八字MCP服务健康检查（ms-agent风格）
router.get('/bazi/health', async (req, res) => {
    try {
        console.log('🔍 检查@cantian-ai/Bazi-MCP服务健康状态（ms-agent风格）...');
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
// 聊天接口 - 使用@cantian-ai/Bazi-MCP + ModelScope AI
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
        console.log('💬 收到八字MCP + ModelScope AI聊天请求:', {
            question: requestData.question,
            type: requestData.type || 'auto-detect',
            hasBirthData: !!requestData.birthData
        });
        let baziData = null;
        // 如果用户提供了生辰八字，先通过@cantian-ai/Bazi-MCP获取分析
        if (requestData.birthData || (requestData.type === 'bazi' && requestData.context?.includes('birth'))) {
            try {
                console.log('🔮 调用@cantian-ai/Bazi-MCP服务（聊天模式）...');
                // 提取或使用提供的生辰数据
                const birthData = requestData.birthData || extractBirthDataFromContext(requestData.context);
                if (birthData) {
                    const baziResult = await mcpService.calculateBazi(birthData);
                    if (baziResult.success) {
                        baziData = baziResult.data;
                        console.log('✅ 聊天模式八字MCP计算成功');
                    }
                }
            }
            catch (error) {
                console.warn('⚠️ 聊天模式八字MCP调用失败:', error);
            }
        }
        // 初始化真正的ModelScope服务
        const realModelService = new realModelScopeOnlineService_1.RealModelScopeOnlineService({
            apiKey: process.env.MODELSCOPE_API_KEY || '',
            modelId: process.env.MODELSCOPE_MODEL || 'qwen/Qwen2.5-Coder-32B-Instruct',
            baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
        });
        // 构建增强的问题提示
        let enhancedQuestion = requestData.question;
        if (baziData) {
            enhancedQuestion = `${requestData.question}\n\n请参考以下八字分析数据：\n日主：${baziData.dayMasterStrength.dayMaster}（${baziData.dayMasterStrength.strength}）\n喜用神：${baziData.favorableElements.favorable.join('、')}\n五行分析：${JSON.stringify(baziData.wuxing.elements)}`;
        }
        // 使用真正的ModelScope AI进行分析
        const result = await realModelService.generateFortune(enhancedQuestion, requestData.context);
        console.log('✅ 八字MCP + ModelScope AI聊天分析完成:', {
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
// 获取算命类型列表
router.get('/types', (req, res) => {
    res.json({
        types: [
            { id: 'tarot', name: '塔罗占卜', description: '通过塔罗牌洞察未来' },
            { id: 'bazi', name: '八字命理', description: '传统命理学分析' },
            { id: 'astrology', name: '星座占星', description: '星象能量解读' },
            { id: 'numerology', name: '数字命理', description: '数字能量分析' }
        ]
    });
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
exports.default = router;
//# sourceMappingURL=fortune_backup.js.map