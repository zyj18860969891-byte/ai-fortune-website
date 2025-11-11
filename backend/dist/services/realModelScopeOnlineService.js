"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealModelScopeOnlineService = void 0;
const axios_1 = __importDefault(require("axios"));
const EnhancePromptService_1 = require("./EnhancePromptService");
class RealModelScopeOnlineService {
    constructor(config) {
        this.conversationHistory = [];
        this.lastApiCallTime = 0;
        this.MIN_API_INTERVAL = 3000; // 最小API调用间隔3秒
        this.config = config;
        this.enhancePromptService = EnhancePromptService_1.EnhancePromptService.getInstance();
        console.log('🎯 RealModelScopeOnlineService 初始化完成');
    }
    async generateFortune(question, context, type, systemPrompt) {
        const startTime = Date.now();
        try {
            console.log('🎯 开始生成命理分析');
            // 直接使用路由传递的完整提示词，不重新构建
            console.log('🔧 使用完整提示词（包含八字数据）');
            const apiResult = await this.callModelScopeAPI(question);
            const processingTime = Date.now() - startTime;
            // 简化响应处理，只做基本清理
            const cleanResponse = this.simplifyResponse(apiResult);
            this.conversationHistory.push({ question, response: cleanResponse });
            return {
                success: true,
                prediction: cleanResponse,
                advice: '保持积极心态，顺势而为',
                luckyElements: ['绿色', '蓝色', '3', '8'],
                confidence: 0.92,
                source: 'real-modelscope-ai-natural',
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
        // 强化思考过程过滤 - 更精确的模式
        const thinkingPatterns = [
            // 只过滤明显的思考过程标记，保留实际内容
            // 数字编号的思考过程标题行
            /^\d+\.\s*\*\*拆解用户请求[^*]*\*\*$/gm,
            /^\d+\.\s*\*\*分析用户输入[^*]*\*\*$/gm,
            /^\d+\.\s*\*\*核心要求[^*]*\*\*$/gm,
            // 星号+内容类型的思考过程
            /^\s*\*\s*\*\*人设[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*名字[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*专长[^*]*\*\*$/gm,
            // 只过滤纯人设描述，不包含实际分析内容
            /^.*\*.*\*\*.*\*\*.*专业的AI算命师.*$/gm,
            /^.*人设.*专业AI命理师.*$/gm,
            // 内部标记
            /^[^*]*（内部，不展示）[^*]*$/gm,
            /^[^*]*心算或快速查询[^*]*$/gm,
            /^[^*]*我需要[^*]*$/gm,
            /^[^*]*快速查询显示[^*]*$/gm,
            /^[^*]*快速查询[^*]*$/gm,
            /^[^*]*拆解请求[^*]*$/gm,
            /^[^*]*分析用户输入[^*]*$/gm,
            /^[^*]*我是一位[^*]*$/gm
        ];
        for (const pattern of thinkingPatterns) {
            cleanResponse = cleanResponse.replace(pattern, '');
        }
        // 清理重复的问候语和祝福语
        cleanResponse = this.removeDuplicates(cleanResponse);
        // 确保以问候语开头
        if (!cleanResponse.startsWith('👋') && !cleanResponse.startsWith('😊')) {
            cleanResponse = '👋 您好，朋友！让我来为您详细分析一下...\n\n' + cleanResponse;
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
        // 等待以避免API频率限制
        const now = Date.now();
        const timeSinceLastCall = now - this.lastApiCallTime;
        if (timeSinceLastCall < this.MIN_API_INTERVAL) {
            const waitTime = this.MIN_API_INTERVAL - timeSinceLastCall;
            console.log(`⏳ 等待 ${waitTime}ms 以避免API频率限制`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastApiCallTime = Date.now();
        const requestPayload = {
            model: this.config.modelId,
            messages: [
                {
                    role: 'system',
                    content: '你是一位专业的AI算命师，精通塔罗牌、八字命理、星座占星和数字命理。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000 // 增加到2000，避免截断
        };
        const response = await axios_1.default.post(`${this.config.baseUrl}/chat/completions`, requestPayload, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 60000 // 增加到60秒，给AI更多处理时间
        });
        const choice = response.data.choices?.[0]?.message;
        const generatedText = choice?.content || choice?.reasoning_content || response.data.output?.text || '';
        if (!generatedText) {
            throw new Error('ModelScope API返回空响应');
        }
        return generatedText;
    }
    /**
     * 直接使用原始提示词，不进行任何增强
     */
    async enhancePromptWithService(question, context, systemPrompt) {
        try {
            console.log('🎯 使用原始提示词，不进行增强');
            // 直接使用原始提示词，不进行任何增强
            return this.buildEnhancedPrompt(question, context, systemPrompt);
        }
        catch (error) {
            console.log('❌ 提示词构建失败，使用简单提示词');
            return `你是一位专业的八字命理师。

${question}

请为用户进行详细的命理分析。`;
        }
    }
    /**
     * 构建最原始的提示词，完全模仿原生MCP服务
     */
    buildRawPrompt(question, context, systemPrompt) {
        // 完全模仿原生MCP服务的简单提示词
        // 原生MCP使用 "You are a helpful assistant"
        // 我们使用最简单的提示词，让AI自由发挥
        return `你是一位专业的八字命理师。

用户问：${question}
请基于八字命理知识直接回答用户的问题，不要泛泛而谈性格分析。`;
    }
    /**
     * 构建最简单的提示词，完全模仿原生MCP服务
     */
    buildEnhancedPrompt(question, context, systemPrompt) {
        // 增强提示词，让AI生成更通俗易懂、排版更好的内容
        return `你是一位资深的专业八字命理师，拥有20年经验，善于用通俗易懂的语言解释复杂的命理知识。

用户问：${question}

请基于提供的八字信息，为用户进行详细、专业且易于理解的命理分析。要求：

1. **语言通俗易懂**：用生活化的语言解释专业术语，避免过于学术化的表达
2. **结构清晰**：使用明确的标题和段落，让用户容易跟随
3. **重点突出**：对重要的命理特征用简单明了的方式说明
4. **实用建议**：提供具体、可操作的建议，而不是泛泛而谈
5. **积极正面**：以积极、建设性的态度分析，避免过于负面的预测
6. **自然流畅**：保持对话的自然感，像朋友聊天一样亲切

请确保内容完整、专业且易于理解。`;
    }
    simplifyResponse(aiResponse) {
        let cleanResponse = aiResponse.trim().replace(/^["']|["']$/g, '');
        // 移除技术性思考标记，但保留实际分析内容
        const technicalPatterns = [
            // 移除系统提示相关的行
            /^.*系统提示.*$/gm,
            /^.*角色设定.*$/gm,
            /^.*人设.*$/gm,
            // 移除纯技术性的思考标记
            /^\s*\*\s*\*\*拆解[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*分析[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*角色[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*输入[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*任务[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*要求[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*人设[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*名字[^*]*\*\*$/gm,
            /^\s*\*\s*\*\*专长[^*]*\*\*$/gm,
            // 移除内部标记和心算过程
            /^[^*]*（内部，不展示）[^*]*$/gm,
            /^[^*]*心算或快速查询[^*]*$/gm,
            /^[^*]*快速查询显示[^*]*$/gm,
            /^[^*]*快速查询[^*]*$/gm,
            /^[^*]*拆解请求[^*]*$/gm,
            /^[^*]*分析用户输入[^*]*$/gm,
            /^[^*]*我需要[^*]*$/gm,
            /^.*直接开始.*$/gm,
            /^.*自然.*流畅.*专业.*$/gm,
            /^.*无列表.*编号.*项目符号.*$/gm,
            /^.*具体.*实用.*建议.*$/gm,
            /^.*深入.*详细.*分析.*$/gm,
            /^.*亲切.*易懂.*语言.*$/gm,
            /^[^*]*我是一位.*$/gm
        ];
        for (const pattern of technicalPatterns) {
            cleanResponse = cleanResponse.replace(pattern, '');
        }
        // 优化排版：移除多余的符号，但保留有意义的格式
        cleanResponse = cleanResponse.replace(/^#{1,4}\s+/gm, ''); // 移除多余的#号
        cleanResponse = cleanResponse.replace(/^\s*[-*]\s+/gm, ''); // 移除多余的-和*号
        cleanResponse = cleanResponse.replace(/^\s*\*\s+/gm, ''); // 移除多余的星号
        cleanResponse = cleanResponse.replace(/^#{1,4}/gm, ''); // 移除行首的#号
        // 保留有意义的格式，如：### 标题格式，并转换为更友好的格式
        cleanResponse = cleanResponse.replace(/^###\s+(.+)$/gm, '\n\n📌 $1\n'); // 保留标题内容，添加emoji
        cleanResponse = cleanResponse.replace(/^##\s+(.+)$/gm, '\n\n🔍 $1\n'); // 保留标题内容，添加emoji
        cleanResponse = cleanResponse.replace(/^#\s+(.+)$/gm, '\n\n⭐ $1\n'); // 保留标题内容，添加emoji
        // 将代码块转换为更易读的格式
        cleanResponse = cleanResponse.replace(/```/g, '');
        cleanResponse = cleanResponse.replace(/^年柱：(.+)$/gm, '📅 年柱：$1');
        cleanResponse = cleanResponse.replace(/^月柱：(.+)$/gm, '📅 月柱：$1');
        cleanResponse = cleanResponse.replace(/^日柱：(.+)$/gm, '📅 日柱：$1');
        cleanResponse = cleanResponse.replace(/^时柱：(.+)$/gm, '📅 时柱：$1');
        // 将重点内容转换为更易读的格式
        cleanResponse = cleanResponse.replace(/\*\*(.+?)\*\*/g, '🌟 $1 🌟'); // 将加粗内容用emoji包围
        cleanResponse = cleanResponse.replace(/>([^<]*)/gm, '💡 $1'); // 将引用内容用emoji包围
        // 清理多余的空行，但保留段落结构
        cleanResponse = cleanResponse.replace(/\n{3,}/g, '\n\n').trim();
        // 添加友好的开头和结尾
        if (!cleanResponse.startsWith('👋')) {
            cleanResponse = '👋 您好！我是您的专业八字命理师，很高兴为您分析。\n\n' + cleanResponse;
        }
        // 添加友好的结尾
        if (!cleanResponse.includes('祝您')) {
            cleanResponse += '\n\n\n🙏 感谢您的信任！希望这次分析能为您的生活和未来提供一些有价值的参考。祝您身体健康，万事如意！';
        }
        // 如果清理后为空或内容太少，返回更详细的默认响应
        if (!cleanResponse || cleanResponse.length < 30) {
            return '👋 您好！我是您的专业八字命理师。根据您提供的出生信息，我会为您进行详细的命理分析，包括性格特征、事业运势、感情婚姻和健康建议。';
        }
        return cleanResponse;
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
//# sourceMappingURL=realModelScopeOnlineService.js.map