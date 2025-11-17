"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const realModelScopeOnlineService_1 = require("../services/realModelScopeOnlineService");
const msAgentStyleMcpService_1 = require("../services/msAgentStyleMcpService");
const router = (0, express_1.Router)();
const mcpService = msAgentStyleMcpService_1.MsAgentStyleMcpService.getInstance();
// 全局出生日期缓存，用于跨请求保存出生信息
// 支持单人和双人八字分析：sessionId -> { self: birthData, other: birthData }
const birthDataCache = new Map();
// 聊天接口
router.post('/chat', async (req, res) => {
    const startTime = Date.now();
    try {
        const requestData = req.body;
        if (!requestData.question || !requestData.type) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数：question 和 type',
                timestamp: new Date().toISOString()
            });
        }
        console.log('💬 收到八字MCP + ModelScope AI聊天请求:', {
            question: requestData.question,
            type: requestData.type,
            context: requestData.context,
            hasBirthInfo: !!requestData.birthInfo,
            body: req.body
        });
        let baziData = null;
        let selfBirthData = null;
        let otherBirthData = null;
        let analysisType = 'general';
        console.log('🔍 开始提取出生数据，检查是否为双人分析请求...');
        // 检查是否为双人八字分析请求
        const isRelationshipAnalysis = checkIfRelationshipAnalysis(requestData.question || '', requestData.context || '');
        // 检查是否在询问关系但没有明确关键词（如"我们之间合适吗？"）
        const isImplicitRelationship = checkIfImplicitRelationship(requestData.question || '', requestData.context || '');
        console.log('🔍 是否为关系分析请求:', isRelationshipAnalysis);
        console.log('🔍 是否为隐式关系分析请求:', isImplicitRelationship);
        const shouldDoRelationshipAnalysis = isRelationshipAnalysis || isImplicitRelationship;
        if (shouldDoRelationshipAnalysis || requestData.birthInfos) {
            // 双人八字分析逻辑
            console.log('💑 检测到双人关系分析请求或显式birthInfos');
            // 优先级：当前请求birthInfos > 当前请求birthInfo > 从问题中提取 > 缓存数据
            // 1. 首先检查是否有显式的birthInfos
            if (requestData.birthInfos?.self) {
                selfBirthData = requestData.birthInfos.self;
                console.log('✅ 使用birthInfos.self（最高优先级）:', selfBirthData);
            }
            else if (requestData.birthInfos?.other) {
                otherBirthData = requestData.birthInfos.other;
                console.log('✅ 使用birthInfos.other（最高优先级）:', otherBirthData);
            }
            else if (requestData.birthInfo) {
                // 2. 如果是关系分析且没有self数据，将birthInfo作为self
                if (!selfBirthData) {
                    selfBirthData = requestData.birthInfo;
                    console.log('✅ 使用当前请求的birthInfo作为self:', selfBirthData);
                }
            }
            else {
                // 3. 从问题中提取自己的出生数据
                selfBirthData = extractBirthDataFromQuestion(requestData.question || '');
                if (selfBirthData) {
                    console.log('✅ 从问题中提取自己的出生数据:', selfBirthData);
                }
            }
            // 提取对方的出生数据（如果还没有）
            if (!otherBirthData) {
                otherBirthData = extractOtherBirthData(requestData.question || '', requestData.context || '');
                if (otherBirthData) {
                    console.log('✅ 提取对方的出生数据:', otherBirthData);
                }
            }
            // 从缓存中获取历史数据（不覆盖已有的数据）
            if (requestData.sessionId) {
                const cachedData = birthDataCache.get(requestData.sessionId);
                if (cachedData) {
                    console.log('🔧 从缓存获取历史出生数据:', {
                        hasSelf: !!cachedData.self,
                        hasOther: !!cachedData.other,
                        sessionId: requestData.sessionId
                    });
                    // 如果当前没有提供自己的数据，使用缓存的
                    if (!selfBirthData && cachedData.self) {
                        selfBirthData = cachedData.self;
                        console.log('✅ 使用缓存中的自己出生数据');
                    }
                    // 如果当前没有提供对方数据，使用缓存的
                    if (!otherBirthData && cachedData.other) {
                        otherBirthData = cachedData.other;
                        console.log('✅ 使用缓存中的对方出生数据');
                    }
                }
            }
            // 保存到缓存（只保存新的数据，不覆盖现有的）
            if (requestData.sessionId && (selfBirthData || otherBirthData)) {
                const cachedData = birthDataCache.get(requestData.sessionId) || {};
                // 只在有新数据且缓存中没有时才更新
                if (selfBirthData && !cachedData.self) {
                    cachedData.self = selfBirthData;
                    console.log('✅ 保存新的自己出生数据到缓存');
                }
                if (otherBirthData && !cachedData.other) {
                    cachedData.other = otherBirthData;
                    console.log('✅ 保存新的对方出生数据到缓存');
                }
                birthDataCache.set(requestData.sessionId, cachedData);
                console.log('💾 更新出生数据到缓存:', {
                    sessionId: requestData.sessionId,
                    hasSelf: !!cachedData.self,
                    hasOther: !!cachedData.other
                });
            }
            console.log('💑 双人分析数据汇总:', {
                hasSelf: !!selfBirthData,
                hasOther: !!otherBirthData,
                selfData: selfBirthData,
                otherData: otherBirthData
            });
        }
        else {
            // 单人八字分析逻辑
            let birthData = requestData.birthInfo || extractBirthDataFromQuestion(requestData.question || '');
            console.log('🔍 初始birthData提取结果:', birthData);
            console.log('🔧 birthData类型检查:', {
                hasBirthData: !!birthData,
                birthDataKeys: birthData ? Object.keys(birthData) : null,
                hasYear: !!birthData?.year,
                hasMonth: !!birthData?.month,
                hasDay: !!birthData?.day
            });
            // 优先级：当前请求birthInfo > 从问题中提取 > 缓存数据
            // 绝对优先使用当前请求的birthInfo
            if (requestData.birthInfo) {
                birthData = requestData.birthInfo;
                console.log('✅ 使用当前请求的birthInfo（最高优先级）:', birthData);
                // 检查是否为关系分析请求，如果是则不应该清除缓存
                const isRelationshipAnalysis = checkIfRelationshipAnalysis(requestData.question || '', requestData.context || '');
                if (!isRelationshipAnalysis) {
                    // 只有非关系分析时才清除缓存，避免丢失用户的原始出生信息
                    if (requestData.sessionId) {
                        birthDataCache.delete(requestData.sessionId);
                        console.log('🗑️ 已清除缓存中的旧出生数据（非关系分析）');
                    }
                }
                else {
                    console.log('💖 保留缓存中的出生数据（关系分析场景）');
                }
            }
            else if (!birthData && requestData.sessionId) {
                // 仅在没有birthInfo时，才从缓存获取
                const cachedBirthData = birthDataCache.get(requestData.sessionId);
                if (cachedBirthData) {
                    birthData = cachedBirthData.self || cachedBirthData;
                    console.log('🔧 从缓存获取出生数据:', { sessionId: requestData.sessionId, birthData });
                }
            }
            selfBirthData = birthData;
        }
        // 只要用户请求八字分析（type: 'bazi'），就调用八字MCP服务
        if (requestData.type === 'bazi') {
            try {
                console.log('🔮 调用@cantian-ai/Bazi-MCP服务（聊天模式）...');
                // 双人分析逻辑
                if (isRelationshipAnalysis && selfBirthData && otherBirthData) {
                    console.log('💑 双人八字分析：同时计算两个人的八字');
                    analysisType = 'bazi-relationship';
                    try {
                        // 计算自己的八字
                        const selfBaziResult = await mcpService.calculateBazi(selfBirthData);
                        console.log('📊 自己的八字MCP计算结果:', {
                            success: selfBaziResult.success,
                            hasData: !!selfBaziResult.data
                        });
                        // 计算对方的八字
                        const otherBaziResult = await mcpService.calculateBazi(otherBirthData);
                        console.log('📊 对方的八字MCP计算结果:', {
                            success: otherBaziResult.success,
                            hasData: !!otherBaziResult.data
                        });
                        // 解析两个人的八字数据
                        let selfBaziData = null;
                        let otherBaziData = null;
                        if (selfBaziResult.success && selfBaziResult.data) {
                            selfBaziData = parseBaziData(selfBaziResult);
                            console.log('✅ 自己的八字数据解析成功');
                        }
                        if (otherBaziResult.success && otherBaziResult.data) {
                            otherBaziData = parseBaziData(otherBaziResult);
                            console.log('✅ 对方的八字数据解析成功');
                        }
                        // 构建双人八字分析数据
                        if (selfBaziData && otherBaziData) {
                            baziData = {
                                self: selfBaziData,
                                other: otherBaziData,
                                relationship: {
                                    selfBirthData,
                                    otherBirthData
                                }
                            };
                            console.log('💑 双人八字分析数据构建完成');
                        }
                        else {
                            console.log('⚠️ 双人八字数据不完整，回退到单人分析');
                            if (selfBaziData) {
                                baziData = selfBaziData;
                                analysisType = 'bazi-enhanced';
                            }
                        }
                    }
                    catch (relationshipError) {
                        console.log('⚠️ 双人八字分析失败，回退到单人分析:', relationshipError);
                        // 回退到单人分析
                        analysisType = 'bazi-enhanced';
                    }
                }
                // 单人分析逻辑
                if (!baziData && selfBirthData) {
                    console.log('👤 单人八字分析：计算自己的八字');
                    analysisType = 'bazi-enhanced';
                    try {
                        const baziResult = await mcpService.calculateBazi(selfBirthData);
                        console.log('� 单人八字MCP计算结果:', {
                            success: baziResult.success,
                            hasData: !!baziResult.data
                        });
                        if (baziResult.success && baziResult.data) {
                            baziData = parseBaziData(baziResult);
                            console.log('✅ 单人八字数据解析成功');
                        }
                    }
                    catch (singleError) {
                        console.log('⚠️ 单人八字分析失败:', singleError);
                    }
                }
                // 如果没有找到出生信息
                if (!selfBirthData && !otherBirthData) {
                    console.log('⚠️ 用户请求八字分析但未提供出生信息，需要用户提供出生日期');
                    analysisType = 'bazi-requested-no-birthdata';
                }
            }
            catch (error) {
                console.warn('⚠️ 聊天模式八字MCP调用失败:', error);
            }
        }
        else {
            console.log('⚠️ 非八字分析请求，使用通用分析');
            analysisType = 'general';
        }
        const modelConfig = {
            apiKey: process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180',
            modelId: process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507',
            baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
        };
        console.log('🔧 模型配置:', {
            '环境变量 MODELSCOPE_MODEL': process.env.MODELSCOPE_MODEL,
            '实际使用的模型': modelConfig.modelId,
            'API Key前缀': modelConfig.apiKey.substring(0, 10) + '...',
            '基础URL': modelConfig.baseUrl
        });
        const realModelService = new realModelScopeOnlineService_1.RealModelScopeOnlineService(modelConfig);
        let enhancedQuestion = requestData.question;
        let systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。';
        if (!selfBirthData && requestData.type === 'bazi') {
            // 用户请求八字分析但未提供出生信息 - 明确要求用户提供
            enhancedQuestion = requestData.question;
            systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（如：1990.05.15 或 1990年5月15日），然后再告诉我您想了解什么问题。';
        }
        else if (baziData) {
            // 构建精简但完整的八字分析数据给AI
            const completeBaziInfo = `
=== 八字专业分析数据 ===
八字：${baziData.八字 || '未知'}
日主：${baziData.日主 || '未知'}（${baziData.日柱?.天干?.五行 || '未知'}）
生肖：${baziData.生肖 || '未知'}
阳历：${baziData.阳历 || '未知'}
农历：${baziData.农历 || '未知'}
纳音：${baziData.年柱?.纳音 || '未知'}

=== 核心柱信息 ===
年柱：${baziData.年柱?.天干?.天干}${baziData.年柱?.地支?.地支}（${baziData.年柱?.天干?.五行}）${baziData.年柱?.天干?.十神}
月柱：${baziData.月柱?.天干?.天干}${baziData.月柱?.地支?.地支}（${baziData.月柱?.天干?.五行}）${baziData.月柱?.天干?.十神}
日柱：${baziData.日柱?.天干?.天干}${baziData.日柱?.地支?.地支}（${baziData.日柱?.天干?.五行}）${baziData.日柱?.天干?.十神}
时柱：${baziData.时柱?.天干?.天干}${baziData.时柱?.地支?.地支}（${baziData.时柱?.天干?.五行}）${baziData.时柱?.天干?.十神}

=== 重要大运（当前及未来） ===
${baziData.大运?.大运?.slice(0, 3).map((d) => `${d.干支}（${d.开始年龄}-${d.结束年龄}岁）：${d.天干十神}`).join('\n') || '暂无大运信息'}

=== 刑冲合会要点 ===
${Object.entries(baziData.刑冲合会 || {}).map(([key, value]) => {
                const issues = [];
                if (value?.地支?.冲)
                    issues.push(`${key}柱冲`);
                if (value?.地支?.刑)
                    issues.push(`${key}柱刑`);
                if (value?.地支?.半合)
                    issues.push(`${key}柱半合`);
                if (value?.伏吟)
                    issues.push(`${key}柱伏吟`);
                return issues.length > 0 ? `${key}柱：${issues.join('、')}` : '';
            }).filter(Boolean).join('\n') || '暂无刑冲合会信息'}

=== 神煞要点 ===
${Object.entries(baziData.神煞 || {}).map(([key, value]) => `${key}：${Array.isArray(value) ? value.slice(0, 3).join('、') : value}`).join('\n') || '暂无神煞信息'}

=== 命宫身宫 ===
胎元：${baziData.胎元 || '未知'} | 胎息：${baziData.胎息 || '未知'}
命宫：${baziData.命宫 || '未知'} | 身宫：${baziData.身宫 || '未知'}
`;
            // 修改策略：平衡简化与完整性，让AI自然发挥但提供足够信息
            enhancedQuestion = `${requestData.question}\n\n八字：${baziData.八字 || '未知'}\n日主：${baziData.日主 || '未知'}\n生肖：${baziData.生肖 || '未知'}\n农历：${baziData.农历 || '未知'}\n阳历：${baziData.阳历 || '未知'}\n\n请基于以上八字信息，给出自然流畅的命理分析。`;
            systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。请基于八字数据给出自然流畅的命理分析。';
        }
        else if (requestData.type === 'bazi') {
            // 智能判断：确实没有出生信息时的处理
            const hasAnyBirthInfo = extractBirthDataFromQuestion(requestData.question);
            if (!hasAnyBirthInfo && !selfBirthData) {
                // 明确没有出生信息时，要求用户提供
                enhancedQuestion = requestData.question;
                systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。\n\n要进行准确的八字分析，需要您的出生信息。请提供：\n1. 出生日期（如：1996年2月10日 或 1996.02.10）\n2. 出生时间（如：上午10点 或 下午2点，如不知道可默认子时）\n3. 性别（男/女）\n\n提供这些信息后，我会为您进行专业的命理分析。';
            }
            else {
                // 有部分信息或不确定时，提供通用建议
                enhancedQuestion = `${requestData.question}\n\n注意：您请求的是八字分析，但可能未提供完整的出生信息。我将为您提供一般性的占卜分析，建议您提供完整的出生日期、时间以获得更精准的八字分析。`;
                systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。您请求的是八字分析，但可能未提供完整出生信息。我将为您提供一般性的占卜分析，建议您提供完整出生信息以获得更精准的八字分析。';
            }
        }
        console.log('🔍 调试信息:', {
            enhancedQuestion,
            context: requestData.context?.substring(0, 200) + '...',
            type: requestData.type,
            systemPrompt,
            baziData: !!baziData
        });
        // 限制上下文长度，避免超长请求
        const limitedContext = requestData.context ?
            requestData.context.substring(0, 2000) : '';
        const result = await realModelService.generateFortune(enhancedQuestion, limitedContext, requestData.type, systemPrompt);
        const endTime = Date.now();
        console.log('🎯 AI分析结果详情:', {
            'success': result.success,
            'prediction长度': result.prediction?.length || 0,
            'prediction预览': result.prediction?.substring(0, 100) + '...',
            'source': result.source,
            'confidence': result.confidence,
            'processingTime': `${endTime - startTime}ms`
        });
        console.log('✅ 八字MCP + ModelScope AI聊天分析完成:', {
            success: result.success,
            source: result.source,
            hasBaziData: !!baziData,
            processingTime: `${endTime - startTime}ms`
        });
        const responseData = {
            success: true,
            response: result.prediction,
            source: result.source,
            hasBaziData: !!(baziData && (baziData.八字 ||
                baziData['八字'] ||
                baziData.生肖 ||
                baziData.日主 ||
                baziData.阳历 ||
                baziData.农历 ||
                (baziData.data && (baziData.data.八字 || baziData.data.生肖 || baziData.data.日主)) ||
                (typeof baziData === 'object' && Object.keys(baziData).length > 0) // 只要baziData是包含内容的对象就为true
            )), // 只要包含八字相关信息就为true
            timestamp: new Date().toISOString()
        };
        console.log('📤 返回给前端的响应数据:', {
            'response长度': responseData.response?.length || 0,
            'response预览': responseData.response?.substring(0, 100) + '...'
        });
        res.json(responseData);
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
// 状态接口
router.get('/status', (req, res) => {
    const config = mcpService.getMcpConfig();
    res.json({
        success: true,
        status: 'active',
        services: {
            baziAnalysis: {
                enabled: true,
                service: '@cantian-ai/Bazi-MCP (ms-agent风格)',
                endpoint: 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp',
                protocol: 'ModelContextProtocol'
            },
            modelScope: {
                enabled: true,
                model: 'ZhipuAI/GLM-4.6'
            }
        },
        capabilities: [
            '八字命理分析',
            'MCP协议集成',
            '实时聊天',
            '生辰数据提取'
        ],
        timestamp: new Date().toISOString()
    });
});
// 获取算命类型
router.get('/types', (req, res) => {
    res.json({
        success: true,
        types: [
            {
                id: 'bazi',
                name: '八字命理',
                description: '基于传统八字命理学，分析您的命运走向和人生运势',
                icon: '🔮',
                color: 'purple'
            },
            {
                id: 'tarot',
                name: '塔罗占卜',
                description: '使用神秘塔罗牌，揭示您当前的状况和未来指引',
                icon: '📜',
                color: 'gold'
            },
            {
                id: 'zodiac',
                name: '星座运势',
                description: '根据您的星座，分析今日、本周、本月运势变化',
                icon: '⭐',
                color: 'blue'
            },
            {
                id: 'numerology',
                name: '数字命理',
                description: '通过数字能量，解读您的性格特点和命运密码',
                icon: '🔢',
                color: 'green'
            }
        ],
        timestamp: new Date().toISOString()
    });
});
// 健康检查
router.get('/health', (req, res) => {
    res.json({
        healthy: true,
        service: 'AI算命服务 (MCP + ModelScope)',
        version: '2.0.0',
        features: ['八字MCP', 'ModelScope AI', '实时分析'],
        timestamp: new Date().toISOString()
    });
});
// 检查是否为隐式关系分析请求（如"我们之间合适吗？"）
function checkIfImplicitRelationship(question, context) {
    const implicitRelationshipKeywords = [
        '我们', '你们', '他们', '彼此', '双方', '两人', '两个人',
        '合适', '配', '般配', '匹配', '缘分', '情缘', '感情',
        '恋爱', '婚姻', '婚配', '合婚', '配对'
    ];
    const fullText = (question + ' ' + context).toLowerCase();
    const foundKeywords = implicitRelationshipKeywords.filter(keyword => fullText.includes(keyword.toLowerCase()));
    console.log('🔍 隐式关系分析关键词检测:', {
        foundKeywords,
        isImplicitRelationship: foundKeywords.length > 0,
        question: question.substring(0, 100),
        contextPreview: context.substring(0, 100)
    });
    // 检查是否有"我们" + 关系相关词的组合
    const hasWeRelationship = fullText.includes('我们') && foundKeywords.length >= 2;
    // 检查是否有明显的配对询问
    const hasPairingInquiry = fullText.includes('合适') ||
        fullText.includes('配吗') ||
        fullText.includes('般配') ||
        fullText.includes('匹配') ||
        fullText.includes('缘分');
    return hasWeRelationship || hasPairingInquiry;
}
// 检查是否为关系分析请求
function checkIfRelationshipAnalysis(question, context) {
    const relationshipKeywords = [
        '喜欢', '爱', '感情', '恋爱', '婚姻', '配偶', '对象', '男朋友', '女朋友',
        '结婚', '缘分', '合婚', '配对', '两个人', '你们', '我和他', '我和她',
        '对方', '恋人', '情侣', '交往', '追求', '暗恋', '心动', 'crush'
    ];
    const fullText = (question + ' ' + context).toLowerCase();
    const foundKeywords = relationshipKeywords.filter(keyword => fullText.includes(keyword.toLowerCase()));
    console.log('🔍 关系分析关键词检测:', {
        foundKeywords,
        isRelationship: foundKeywords.length > 0,
        question: question.substring(0, 100),
        contextPreview: context.substring(0, 100)
    });
    return foundKeywords.length > 0;
}
// 提取对方的出生数据
function extractOtherBirthData(question, context) {
    console.log('🔍 开始提取对方出生数据...');
    // 在问题中查找对方的出生信息
    const otherPatterns = [
        // "我喜欢一个1989.07.18的女人" -> 提取1989.07.18
        /喜欢.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        /爱.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        /一个.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2}).*?的.*?人/g,
        /(\d{4})年(\d{1,2})月(\d{1,2})日.*?的.*?人/g,
        // "1989.07.18的女人" -> 提取1989.07.18
        /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2}).*?(女人|男人|女孩|男孩|女生|男生)/g,
        /(女人|男人|女孩|男孩|女生|男生).*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        // "她/他出生于1989.07.18" -> 提取1989.07.18
        /(她|他|对方|那个他|那个她).*?出生.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        /(她|他|对方|那个他|那个她).*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        // "1989年7月18日出生" -> 提取1989.07.18
        /(\d{4})年(\d{1,2})月(\d{1,2})日.*?出生/g,
        /出生于.*?(\d{4})年(\d{1,2})月(\d{1,2})日/g
    ];
    for (const pattern of otherPatterns) {
        const match = pattern.exec(question);
        if (match) {
            let year, month, day;
            if (pattern.source.includes('年') && pattern.source.includes('月') && pattern.source.includes('日')) {
                // 中文格式：1989年7月18日
                year = parseInt(match[1]);
                month = parseInt(match[2]);
                day = parseInt(match[3]);
            }
            else {
                // 标准格式：1989.07.18
                year = parseInt(match[1]);
                month = parseInt(match[2]);
                day = parseInt(match[3]);
            }
            // 验证日期的合理性
            if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                console.log('✅ 从问题中提取对方出生日期:', { year, month, day });
                return {
                    year,
                    month,
                    day,
                    hour: 0,
                    minute: 0,
                    gender: 'female', // 默认女性，可根据上下文调整
                    timezone: 'Asia/Shanghai'
                };
            }
        }
    }
    // 从上下文中查找对方的出生信息
    const lines = context.split('\n');
    for (const line of lines) {
        if (line.includes('用户:') && line.includes('1989') || line.includes('1990') || line.includes('1988') || line.includes('1987')) {
            const birthData = extractBirthDataFromQuestion(line.replace(/^用户:\s*/, ''));
            if (birthData) {
                console.log('✅ 从上下文中提取对方出生数据:', birthData);
                return birthData;
            }
        }
    }
    console.log('⚠️ 未找到对方的出生数据');
    return null;
}
// 解析八字数据的工具函数
function parseBaziData(baziResult) {
    console.log('📄 MCP原始响应:', baziResult);
    console.log('🔍 检查baziResult.data:', baziResult.data);
    console.log('🔍 检查baziResult.content:', baziResult.content);
    // MCP服务返回的数据结构：{ success: true, data: { 八字, 生肖, 日主, ... } }
    console.log('🔍 详细检查baziResult.data:', {
        '存在': !!baziResult.data,
        '类型': typeof baziResult.data,
        '是否为对象': typeof baziResult.data === 'object',
        '是否为数组': Array.isArray(baziResult.data),
        '是否为null': baziResult.data === null,
        '是否为undefined': baziResult.data === undefined,
        '是否有八字属性': baziResult.data && ('八字' in baziResult.data || baziResult.data.八字 || baziResult.data['八字']),
        '是否有生肖属性': baziResult.data && '生肖' in baziResult.data,
        '是否有日主属性': baziResult.data && '日主' in baziResult.data
    });
    // 增强的条件检查 - 处理格式异常情况
    if (baziResult.data &&
        typeof baziResult.data === 'object' &&
        !Array.isArray(baziResult.data)) {
        // 检查是否有八字相关数据（支持多种格式）- 修复检查逻辑
        const hasBaziData = (baziResult.data && ('八字' in baziResult.data || baziResult.data.八字 || baziResult.data['八字']) ||
            (baziResult.data && baziResult.data.八卦) ||
            (baziResult.data && baziResult.data.data && ('八字' in baziResult.data.data || baziResult.data.data.八卦)) ||
            (baziResult.data && baziResult.data.content && typeof baziResult.data.content === 'string' && (baziResult.data.content.includes('八字') || baziResult.data.content.includes('生肖') || baziResult.data.content.includes('日主'))));
        if (hasBaziData) {
            // 处理嵌套数据结构
            if (baziResult.data.data && baziResult.data.data.八字) {
                return baziResult.data.data;
            }
            else if (baziResult.data.content && typeof baziResult.data.content === 'string') {
                try {
                    // 尝试解析content中的JSON
                    const parsedContent = JSON.parse(baziResult.data.content);
                    return parsedContent;
                }
                catch {
                    // 如果解析失败，直接使用原始data
                    return baziResult.data;
                }
            }
            else {
                return baziResult.data;
            }
        }
        else {
            console.log('⚠️ MCP返回数据中没有找到八字相关信息');
            return null;
        }
    }
    else if (baziResult.content) {
        // 如果content字段存在，尝试解析为JSON
        try {
            const parsedContent = JSON.parse(baziResult.content);
            console.log('✅ 从content字段解析成功');
            console.log('🔍 解析后的baziData:', parsedContent);
            return parsedContent;
        }
        catch (contentError) {
            console.log('⚠️ content字段JSON解析失败:', contentError);
            return null;
        }
    }
    else {
        console.log('⚠️ MCP返回数据格式异常，尝试直接使用data字段:', baziResult);
        // 备用逻辑：如果检查失败，直接尝试使用data字段
        if (baziResult.data && typeof baziResult.data === 'object') {
            console.log('✅ 使用备用逻辑成功设置八字数据');
            console.log('📊 备用八字数据:', {
                '八字': baziResult.data.八字,
                '生肖': baziResult.data.生肖,
                '日主': baziResult.data.日主,
                '阳历': baziResult.data.阳历
            });
            return baziResult.data;
        }
        else {
            return null;
        }
    }
}
// 工具函数
function extractBirthDataFromContext(context) {
    if (!context)
        return null;
    console.log('🔍 智能解析上下文，查找真实用户出生数据...');
    // 智能策略：优先从最新的用户消息中提取，排除AI格式说明中的示例
    const lines = context.split('\n');
    // 方法1：从明确标记的"用户:"消息中提取
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        // 只处理明确标记的用户消息行
        if (line.startsWith('用户:') && !line.includes('占卜师:')) {
            const match = line.match(/用户:\s*(.+)/);
            if (match) {
                const question = match[1].trim();
                // 排除明显的非真实出生信息 - 增强过滤逻辑
                const excludePatterns = [
                    '出生日期（格式', '格式：', '格式:', '示例', '例子', '举例',
                    '1990.05.15', '1990年5月15日', '1990-05-15', '1990/05/15',
                    '提供您的', '先提供', '请提供', '需要提供',
                    '要进行准确的', '确认后会为', '确认后',
                    '八字命理AI占卜师', '您好', '我是', '请先',
                    '占卜师:', '您好！', '我是八字', '命理AI'
                ];
                const isExcluded = excludePatterns.some(pattern => line.includes(pattern) || question.includes(pattern));
                // 额外检查：如果整条消息看起来像AI的格式说明，则排除
                const aiFormatIndicators = [
                    '格式：', '格式:', '（格式', '）', '或', '和',
                    '出生日期', '八字分析', '专业分析', '准确分析'
                ];
                const isAIFormat = aiFormatIndicators.filter(indicator => line.includes(indicator) || question.includes(indicator)).length >= 2; // 至少包含2个AI格式指示词
                if (!isExcluded && !isAIFormat && question.length < 50) { // 真实生辰信息通常较短
                    const birthData = extractBirthDataFromQuestion(question);
                    if (birthData) {
                        console.log('✅ 从用户消息智能提取出生数据:', birthData);
                        return birthData;
                    }
                }
            }
        }
    }
    // 方法2：从AI回复中提取（当用户明确回复了出生信息时）
    const aiMessages = context.split('\n').filter(line => line.startsWith('占卜师:') && (line.includes('确认出生日期') ||
        line.includes('已确认') ||
        line.includes('好的，') ||
        line.includes('明白了，') ||
        line.includes('收到') ||
        line.includes('了解')));
    for (const message of aiMessages) {
        // 尝试从AI确认消息中提取后续的真实出生数据
        const nextLines = lines.slice(lines.indexOf(message) + 1);
        for (const nextLine of nextLines) {
            if (nextLine.trim().startsWith('用户:')) {
                const birthData = extractBirthDataFromQuestion(nextLine.replace(/^用户:\s*/, ''));
                if (birthData) {
                    console.log('✅ 从AI确认对话中智能提取出生数据:', birthData);
                    return birthData;
                }
            }
        }
    }
    // 方法3：从整个context中搜索，但排除AI格式说明
    console.log('🔍 从整个context搜索出生数据，排除AI格式示例...');
    // 排除包含AI格式说明的行
    const filteredLines = lines.filter(line => {
        const aiFormatWords = ['格式', '示例', '例子', '举例', '出生日期（格式', '八字命理AI占卜师'];
        return !aiFormatWords.some(word => line.includes(word));
    });
    for (const line of filteredLines) {
        if (line.includes('用户:') || line.includes('1996') || line.includes('1995') || line.includes('1994') || line.includes('1993') || line.includes('1992') || line.includes('1991') || line.includes('1990') || line.includes('1989') || line.includes('1988')) {
            const birthData = extractBirthDataFromQuestion(line);
            if (birthData) {
                console.log('✅ 从过滤后的context提取出生数据:', birthData);
                return birthData;
            }
        }
    }
    console.log('⚠️ 上下文智能解析未找到有效用户出生数据');
    return null;
}
function extractBirthDataFromQuestion(question) {
    if (!question)
        return null;
    console.log('🔍 开始从问题中提取出生日期:', question);
    // 过滤掉明显不是出生信息的输入 - 修复过于严格的过滤
    const invalidInputs = ['', ' ', '测试', '随便', '随便看看', '算命', '占卜', '你好', '您好', 'hi', 'hello'];
    const trimmedQuestion = question.trim();
    if (invalidInputs.includes(trimmedQuestion)) {
        console.log('⚠️ 输入内容不是有效的出生信息:', trimmedQuestion);
        return null;
    }
    const patterns = [
        // 标准格式：1996.02.10 或 1996-02-10 或 1996/02/10
        /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        // 中文格式：1996年2月10日
        /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
        // 紧凑格式：19960210 (8位数字)
        /(\d{4})(\d{2})(\d{2})/g,
        // 出生于格式
        /出生于.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
        // 其他可能的格式
        /(\d{4})年(\d{1,2})月(\d{1,2})/g,
        /(\d{4})年(\d{1,2})月(\d{1,2})时/g,
        /(\d{4})年(\d{1,2})月(\d{1,2})分/g,
    ];
    for (const pattern of patterns) {
        const match = pattern.exec(question);
        if (match) {
            let year, month, day;
            if (pattern.source.includes('出生于')) {
                // 出生于格式的处理
                year = parseInt(match[1]);
                month = parseInt(match[2]);
                day = parseInt(match[3]);
            }
            else if (pattern.source.includes('(\d{4})(\d{2})(\d{2})')) {
                // 紧凑格式的处理：19960210
                year = parseInt(match[1]);
                month = parseInt(match[2]);
                day = parseInt(match[3]);
            }
            else {
                // 标准格式的处理
                year = parseInt(match[1]);
                month = parseInt(match[2]);
                day = parseInt(match[3]);
            }
            // 验证日期的合理性
            if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                console.log('✅ 成功提取出生日期:', { year, month, day });
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
    console.log('⚠️ 未从问题中找到有效的出生日期');
    return null;
}
exports.default = router;
//# sourceMappingURL=fortune.js.map