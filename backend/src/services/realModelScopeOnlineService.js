"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealModelScopeOnlineService = void 0;
const axios_1 = require("axios");
class RealModelScopeOnlineService {
    constructor(config) {
        this.conversationHistory = [];
        this.config = config;
        console.log('🎯 RealModelScopeOnlineService 初始化完成');
    }
    async generateFortune(question, context, type, systemPrompt) {
        const startTime = Date.now();
        try {
            console.log('🎯 开始生成命理分析');
            const prompt = this.buildIntelligentPrompt(question, context, systemPrompt);
            const apiResult = await this.callModelScopeAPI(prompt);
            const processingTime = Date.now() - startTime;
            const formattedResponse = this.formatHumanLikeResponse(apiResult, question);
            this.conversationHistory.push({ question, response: formattedResponse.prediction });
            return {
                success: true,
                prediction: formattedResponse.prediction,
                advice: formattedResponse.advice,
                luckyElements: formattedResponse.luckyElements,
                confidence: 0.92,
                source: 'real-modelscope-ai-human-like',
                apiStatus: 'success',
                processingTime,
                personality: { name: '慧心老师' }
            };
        }
        catch (error) {
            console.error('❌ 分析失败:', error.message);
            return this.generateFallbackResponse(question, type, Date.now() - startTime);
        }
    }
    formatHumanLikeResponse(aiResponse, question) {
        let cleanResponse = aiResponse.trim().replace(/^["']|["']$/g, '');
        
        // 移除思考过程标记
        const thinkingPatterns = [
            /\*\*拆解请求\*\*[\s\S]*?(?=\*\*|$)/g,
            /\*\*分析用户输入\*\*[\s\S]*?(?=\*\*|$)/g,
            /\*\*核心要求\*\*[\s\S]*?(?=\*\*|$)/g,
            /思考过程：[\s\S]*?(?=分析结果|$)/g,
            /分析思路：[\s\S]*?(?=最终答案|$)/g
        ];
        for (const pattern of thinkingPatterns) {
            cleanResponse = cleanResponse.replace(pattern, '');
        }
        
        // 清理多余的空行和重复内容
        cleanResponse = this.removeDuplicates(cleanResponse);
        
        // 确保有专业的开头
        if (!cleanResponse.match(/^(👋|😊|您好|朋友)/)) {
            cleanResponse = '👋 您好，朋友！很高兴为您分析。\n\n' + cleanResponse;
        }
        
        // 确保有自然的结尾
        if (!cleanResponse.match(/(🌟|💕|💪|🙏|祝您|希望)/)) {
            cleanResponse += '\n\n🌟 愿您的生活充满阳光和喜悦！';
        }
        
        return {
            prediction: cleanResponse,
            advice: '保持积极心态，顺势而为',
            luckyElements: ['绿色', '蓝色', '3', '8']
        };
    }
    /**
     * 清理重复的内容
     */
    removeDuplicates(text) {
        console.log('🧹 开始清理重复内容，原始长度:', text.length);
        // 智能分割文本，识别重复段落
        const lines = text.split('\n');
        const result = [];
        const seenContent = new Set();
        for (const line of lines) {
            const trimmedLine = line.trim();
            // 跳过空行
            if (!trimmedLine) {
                continue;
            }
            // 特殊处理：检查是否与已见内容重复或相似
            if (this.isDuplicateContent(trimmedLine, seenContent)) {
                console.log('🗑️ 跳过重复内容:', trimmedLine.substring(0, 50) + '...');
                continue;
            }
            // 将内容添加到结果中
            seenContent.add(trimmedLine);
            result.push(trimmedLine);
        }
        // 重新组织段落结构
        let cleaned = this.reorganizeParagraphs(result);
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
        console.log('🧹 清理完成，新长度:', cleaned.length);
        return cleaned;
    }
    /**
     * 检查内容是否重复（基于相似性）
     */
    isDuplicateContent(content, seenContent) {
        // 直接匹配
        if (seenContent.has(content)) {
            return true;
        }
        // 检查相似性（模糊匹配）
        for (const seen of seenContent) {
            if (this.calculateSimilarity(content, seen) > 0.8) {
                return true;
            }
        }
        return false;
    }
    /**
     * 计算两个字符串的相似度
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        if (longer.length === 0) {
            return 1.0;
        }
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }
    /**
     * 计算Levenshtein距离
     */
    levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i++) {
            matrix[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j++) {
            matrix[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
                    matrix[j][i] = matrix[j - 1][i - 1];
                }
                else {
                    matrix[j][i] = Math.min(matrix[j - 1][i - 1] + 1, matrix[j][i - 1] + 1, matrix[j - 1][i] + 1);
                }
            }
        }
        return matrix[str2.length][str1.length];
    }
    /**
     * 重新组织段落结构
     */
    reorganizeParagraphs(lines) {
        const paragraphs = [];
        let currentParagraph = [];
        for (const line of lines) {
            // 如果是新的内容标题或特殊标记，开始新段落
            if (line.startsWith('🌟') || line.startsWith('💪') ||
                line.startsWith('⚠️') || line.startsWith('💡') ||
                line.startsWith('🌸') || line.startsWith('👋') ||
                line.startsWith('😊')) {
                // 保存当前段落
                if (currentParagraph.length > 0) {
                    paragraphs.push(currentParagraph.join('\n\n'));
                    currentParagraph = [];
                }
                currentParagraph.push(line);
            }
            else {
                // 继续当前段落
                currentParagraph.push(line);
            }
        }
        // 添加最后一个段落
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join('\n\n'));
        }
        return paragraphs.join('\n\n');
    }
    generateFallbackResponse(question, type, processingTime) {
        const responses = {
            wealth: '朋友，关于财运，我看出您的命盘中确实有机会，但要耐心等待时机。😊',
            love: '小伙伴，感情方面需要您主动一些，有时候缘分就在您身边。💕',
            career: '关于事业，我相信您有很好的能力，只是需要找对方向。💪',
            health: '健康是最重要的，建议您多注意作息规律。🌿',
            general: '朋友，让我根据您的问题来给出一些建议吧。✨'
        };
        const response = responses[type] || responses.general;
        return {
            success: false,
            prediction: `${response}\n\n请相信我的直觉，虽然这次分析可能不够详细，但核心的建议是准确的。`,
            advice: '保持积极心态，随时准备把握机会。',
            luckyElements: ['绿色', '蓝色', '3', '8'],
            confidence: 0.75,
            source: 'real-modelscope-error',
            apiStatus: 'API调用失败，使用降级响应',
            processingTime: processingTime || 0
        };
    }
    async callModelScopeAPI(prompt) {
        const requestPayload = {
            model: this.config.modelId,
            messages: [
                {
                    role: 'system',
                    content: '你是一位专业的AI算命师，精通塔罗牌、八字命理、星座占星和数字命理。请直接给出专业、自然、流畅的分析结果，不要显示思考过程。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 1200
        };
        const response = await axios_1.default.post(`${this.config.baseUrl}/chat/completions`, requestPayload, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 90000  // 增加到90秒
        });
        const choice = response.data.choices?.[0]?.message;
        const generatedText = choice?.content || choice?.reasoning_content || response.data.output?.text || '';
        if (!generatedText) {
            throw new Error('ModelScope API返回空响应');
        }
        return generatedText;
    }
    buildIntelligentPrompt(question, context, customSystemPrompt) {
        // 只保留必要的上下文，避免重复历史
        const cleanContext = this.cleanContext(context);
        
        let basePrompt = customSystemPrompt || `你是一位专业的命理师，名字叫"慧心"。请直接给出专业、自然、流畅的分析结果，不要显示思考过程。`;
        
        if (cleanContext) {
            basePrompt += `\n\n相关背景信息：${cleanContext}`;
        }
        
        return `${basePrompt}

用户问题：${question}

请直接输出专业、自然、流畅的分析结果，不要显示任何思考过程。`;
    }
    
    cleanContext(context) {
        if (!context) return '';
        
        // 移除重复的system prompt和占卜师回复
        const lines = context.split('\n');
        const userMessages = [];
        let inUserMessage = false;
        
        for (const line of lines) {
            if (line.startsWith('用户:')) {
                inUserMessage = true;
                userMessages.push(line.substring(3).trim());
            } else if (line.startsWith('占卜师:')) {
                inUserMessage = false;
            } else if (inUserMessage) {
                userMessages.push(line.trim());
            }
        }
        
        // 只保留最近的2-3条用户消息
        const recentMessages = userMessages.slice(-3);
        return recentMessages.length > 0 ? recentMessages.join('。') : '';
    }
    async healthCheck() {
        try {
            const testPrompt = '你好';
            await this.callModelScopeAPI(testPrompt);
            return {
                healthy: true,
                service: 'RealModelScopeOnlineService',
                timestamp: new Date().toISOString(),
                apiStatus: 'connected'
            };
        }
        catch (error) {
            return {
                healthy: false,
                service: 'RealModelScopeOnlineService',
                timestamp: new Date().toISOString(),
                apiStatus: `disconnected: ${error.message}`
            };
        }
    }
    getConversationHistory() {
        return [...this.conversationHistory];
    }
    clearHistory() {
        this.conversationHistory = [];
    }
}
exports.RealModelScopeOnlineService = RealModelScopeOnlineService;
exports.default = RealModelScopeOnlineService;
