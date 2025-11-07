"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelScopeService = void 0;
const axios_1 = __importDefault(require("axios"));
const datasetService_1 = require("./datasetService");
const modelscopeMcpService_1 = __importDefault(require("./modelscopeMcpService"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ModelScopeService {
    constructor(config) {
        this.conversationHistory = [];
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;
        this.modelId = config.modelId;
        // 初始化数据集服务
        this.datasetService = new datasetService_1.DatasetService(this.apiKey);
        // 初始化ModelScope官方MCP服务
        this.modelscopeMcpService = new modelscopeMcpService_1.default();
        // 加载提示词配置
        this.loadPromptsConfig();
        // 预加载数据集
        this.preloadDatasets();
    }
    loadPromptsConfig() {
        try {
            const configPath = path.join(__dirname, '../../config/prompts.yaml');
            const configContent = fs.readFileSync(configPath, 'utf8');
            const yaml = require('js-yaml');
            this.promptsConfig = yaml.load(configContent);
            console.log('提示词配置加载成功');
        }
        catch (error) {
            console.error('提示词配置加载失败:', error);
            // 使用默认配置
            this.promptsConfig = this.getDefaultPromptsConfig();
        }
    }
    getDefaultPromptsConfig() {
        return {
            system_roles: {
                tarot: '你是一位经验丰富的塔罗牌占卜师，精通78张牌的含义和牌阵解读。',
                bazi: '你是一位专业的八字命理师，精通天干地支、五行生克、十神分析等传统命理学问。',
                astrology: '你是一位专业的占星师，精通星座、行星、宫位等占星学知识。',
                numerology: '你是一位数字命理师，精通数字能量学、生命数字、命运密码等数字命理学问。'
            },
            user_prompts: {
                tarot: '作为一位塔罗牌占卜师，请根据以下问题进行预测：\n\n问题：{question}\n\n{dataset_content}\n\n请从以下角度进行分析：\n1. 当前状况\n2. 未来发展\n3. 建议和指导\n4. 幸运元素',
                bazi: '作为一位八字命理师，请根据以下信息进行命理分析：\n\n问题：{question}\n\n{dataset_content}\n\n请从以下角度进行分析：\n1. 五行运势\n2. 事业财运\n3. 感情婚姻\n4. 健康建议\n5. 开运建议',
                astrology: '作为一位占星师，请根据以下信息进行星象分析：\n\n问题：{question}\n\n请从以下角度进行分析：\n1. 当前星象影响\n2. 重要时间节点\n3. 能量指导\n4. 幸运指数',
                numerology: '作为一位数字命理师，请根据以下信息进行数字能量分析：\n\n问题：{question}\n\n请从以下角度进行分析：\n1. 生命数字解读\n2. 能量振动\n3. 机遇与挑战\n4. 数字建议'
            }
        };
    }
    async preloadDatasets() {
        try {
            await this.datasetService.preloadDatasets();
        }
        catch (error) {
            console.error('预加载数据集失败:', error);
        }
    }
    async generateFortune(prompt, type, context) {
        try {
            // 八字类型优先使用ModelScope官方MCP服务
            if (type === 'bazi') {
                console.log('使用ModelScope官方@cantian-ai/Bazi-MCP服务进行分析...');
                const baziResult = await this.modelscopeMcpService.analyzeBazi({
                    question: prompt,
                    context: context
                });
                return {
                    prediction: baziResult.result,
                    advice: baziResult.advice,
                    luckyElements: baziResult.luckyElements,
                    confidence: baziResult.confidence
                };
            }
            // 首先尝试从数据集中获取相关内容
            const datasetContent = await this.getDatasetContent(prompt, type);
            // 构建算命专用的提示词
            const fortunePrompt = this.buildFortunePrompt(prompt, type, datasetContent, context);
            console.log('正在调用ModelScope API...');
            console.log('API URL:', `${this.baseUrl}/chat/completions`);
            console.log('Model:', this.modelId);
            console.log('API Key:', this.apiKey.substring(0, 10) + '...');
            // 调用ModelScope API - 使用OpenAI兼容接口
            const response = await axios_1.default.post(`${this.baseUrl}/chat/completions`, {
                model: this.modelId,
                messages: [
                    {
                        role: 'system',
                        content: this.buildSystemPrompt(type)
                    },
                    {
                        role: 'user',
                        content: fortunePrompt
                    }
                ],
                temperature: 0.6, // 降低随机性，提高专业性
                max_tokens: 800, // 增加输出长度，提供更详细的分析
                top_p: 0.85, // 稍微降低采样范围，提高输出质量
                frequency_penalty: 0.3, // 减少重复内容
                presence_penalty: 0.2, // 鼓励多样性
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 30000 // 30秒超时
            });
            console.log('ModelScope API调用成功');
            // ModelScope的响应格式与OpenAI不同
            const generatedText = response.data.output?.text || response.data.output || '';
            const result = this.parseFortuneResponse(generatedText, type);
            // 存储对话历史
            this.conversationHistory.push({ question: prompt, response: generatedText });
            return result;
        }
        catch (error) {
            console.error('ModelScope API Error:', error.message);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            // 如果是401错误，尝试使用备用模型
            if (error.response?.status === 401) {
                console.log('API认证失败，尝试使用备用模型...');
                return this.generateFallbackFortune(type);
            }
            return this.generateFallbackFortune(type);
        }
    }
    async getDatasetContent(prompt, type) {
        let relevantContent = '';
        try {
            if (type === 'bazi') {
                // 加载并搜索相关的八字内容
                const baziDataset = await this.datasetService.loadDataset('dclef233/bazi-non-reasoning-10k');
                if (baziDataset.length > 0) {
                    // 提取关键词进行搜索
                    const keywords = this.extractKeywords(prompt, type);
                    const relevantBazi = this.datasetService.searchDataset(baziDataset, keywords);
                    if (relevantBazi.length > 0) {
                        const randomItems = this.datasetService.getRandomItems(relevantBazi, 3);
                        relevantContent = `
相关八字知识：
${randomItems.map((item, index) => `- 知识点${index + 1}：${item?.content || item?.description || '专业命理知识'}`).join('\n')}
            `;
                    }
                }
            }
            if (type === 'tarot') {
                // 加载并搜索相关的塔罗内容
                const fortuneDataset = await this.datasetService.loadDataset('wjy779738920/fortune-telling');
                if (fortuneDataset.length > 0) {
                    // 提取关键词进行搜索
                    const keywords = this.extractKeywords(prompt, type);
                    const relevantFortune = this.datasetService.searchDataset(fortuneDataset, keywords);
                    if (relevantFortune.length > 0) {
                        const randomItems = this.datasetService.getRandomItems(relevantFortune, 3);
                        relevantContent = `
相关塔罗知识：
${randomItems.map((item, index) => `- 牌面解读${index + 1}：${item?.content || item?.description || '神秘塔罗指引'}`).join('\n')}
            `;
                    }
                }
            }
        }
        catch (error) {
            console.error('获取数据集内容失败:', error);
        }
        return relevantContent;
    }
    extractKeywords(prompt, type) {
        const keywords = [];
        // 根据类型提取相关关键词
        if (type === 'bazi') {
            keywords.push('八字', '五行', '天干', '地支', '十神', '大运', '流年', '命理');
        }
        else if (type === 'tarot') {
            keywords.push('塔罗', '牌', '占卜', '预测', '指引', '神秘');
        }
        else if (type === 'astrology') {
            keywords.push('星座', '星象', '行星', '宫位', '占星');
        }
        else if (type === 'numerology') {
            keywords.push('数字', '能量', '振动', '命理', '密码');
        }
        // 从问题中提取关键词
        const commonKeywords = prompt.match(/[\u4e00-\u9fa5]+/g) || [];
        keywords.push(...commonKeywords);
        return [...new Set(keywords)]; // 去重
    }
    buildFortunePrompt(question, type, datasetContent = '', context) {
        if (!this.promptsConfig?.user_prompts) {
            return this.getDefaultFortunePrompt(question, type, datasetContent);
        }
        const template = this.promptsConfig.user_prompts[type];
        if (!template) {
            return this.getDefaultFortunePrompt(question, type, datasetContent);
        }
        // 替换模板变量
        let fortunePrompt = template
            .replace('{question}', question)
            .replace('{dataset_content}', datasetContent);
        if (context) {
            // 添加上下文信息到提示词中
            return `上下文：${context}\n${fortunePrompt}`;
        }
        return fortunePrompt;
    }
    getDefaultFortunePrompt(question, type, datasetContent = '') {
        const defaultPrompts = {
            tarot: `作为一位塔罗牌占卜师，请根据以下问题进行预测：

问题：${question}

${datasetContent}

请从以下角度进行分析：
1. 当前状况（牌面含义、牌阵组合）
2. 未来发展（趋势、机遇）
3. 建议和指导（行动建议、心态调整）
4. 幸运元素（颜色、数字、方向、符号）

请用温暖、富有洞察力的话语回答。`,
            bazi: `作为一位八字命理师，请根据以下信息进行命理分析：

问题：${question}

${datasetContent}

请从以下角度进行分析：
1. 五行运势（生克关系、元素平衡）
2. 事业财运（职业发展、财富积累）
3. 感情婚姻（关系分析、情感指导）
4. 健康建议（身体健康、心理平衡）
5. 开运建议（改善运势、增强能量）

请用专业且易懂的语言回答。`,
            astrology: `作为一位占星师，请根据以下信息进行星象分析：

问题：${question}

请从以下角度进行分析：
1. 当前星象影响（行星位置、相位关系）
2. 重要时间节点（星象事件、运势转变）
3. 能量指导（星座能量、行星影响）
4. 幸运指数（运势评分、机遇预测）

请用富有诗意和神秘感的话语回答。`,
            numerology: `作为一位数字命理师，请根据以下信息进行数字能量分析：

问题：${question}

请从以下角度进行分析：
1. 生命数字解读（数字含义、能量特征）
2. 能量振动（数字频率、生命节奏）
3. 机遇与挑战（数字对应、能量冲突）
4. 数字建议（行动指南、能量调整）

请用简洁有力的话语回答。`
        };
        return defaultPrompts[type] || defaultPrompts.tarot;
    }
    buildSystemPrompt(type) {
        if (!this.promptsConfig?.system_roles) {
            return this.getDefaultSystemPrompt(type);
        }
        return this.promptsConfig.system_roles[type] || this.getDefaultSystemPrompt(type);
    }
    getDefaultSystemPrompt(type) {
        const defaultPrompts = {
            tarot: '你是一位经验丰富的塔罗牌占卜师，精通78张牌的含义和牌阵解读。',
            bazi: '你是一位专业的八字命理师，精通天干地支、五行生克、十神分析等传统命理学问。',
            astrology: '你是一位专业的占星师，精通星座、行星、宫位等占星学知识。',
            numerology: '你是一位数字命理师，精通数字能量学、生命数字、命运密码等数字命理学问。'
        };
        return defaultPrompts[type] || defaultPrompts.tarot;
    }
    parseFortuneResponse(text, type) {
        // 简单的文本解析逻辑
        const lines = text.split('\n').filter(line => line.trim());
        let prediction = '';
        let advice = '';
        const luckyElements = [];
        let confidence = 0.8; // 默认置信度
        // 根据不同类型的关键词提取
        const extractKeywords = {
            tarot: ['幸运', '颜色', '数字', '方向', '牌面', '指引'],
            bazi: ['五行', '十神', '大运', '流年', '开运', '阴阳'],
            astrology: ['星座', '行星', '相位', '能量', '幸运', '指引'],
            numerology: ['数字', '能量', '振动', '频率', '密码', '机遇']
        };
        const keywords = extractKeywords[type] || extractKeywords.tarot;
        for (const line of lines) {
            // 提取幸运元素
            if (line.includes('幸运') || line.includes('颜色') || line.includes('数字') || line.includes('方向')) {
                const matches = line.match(/(红色|蓝色|绿色|黄色|紫色|金色|银色|1|2|3|7|8|9|东|南|西|北|中心)/g);
                if (matches) {
                    luckyElements.push(...matches);
                }
            }
            // 提取建议内容
            if (line.includes('建议') || line.includes('指导') || line.includes('应该') || line.includes('需要') || line.includes('可以')) {
                advice += line + '\n';
            }
        }
        // 简化的响应结构
        prediction = lines.slice(0, Math.min(3, lines.length)).join('\n');
        advice = advice.trim() || lines.slice(Math.min(3, lines.length)).join('\n');
        // 根据是否有数据集支持调整置信度
        // 这里假设数据集服务可用时置信度更高
        confidence = 0.9;
        return {
            prediction: prediction || this.getDefaultPrediction(type),
            advice: advice || this.getDefaultAdvice(type),
            luckyElements: luckyElements.length > 0 ? luckyElements : this.getDefaultLuckyElements(type),
            confidence: confidence
        };
    }
    getDefaultPrediction(type) {
        const defaults = {
            tarot: '塔罗牌显示你正站在人生的十字路口，宇宙正在为你准备新的机会。',
            bazi: '八字显示你五行平衡，近期运势平稳上升，有贵人相助。',
            astrology: '当前星象为你带来内在觉醒的能量转化，适合新的开始。',
            numerology: '你的生命数字显示创造力和直觉力正在增强，机遇来临。'
        };
        return defaults[type] || defaults.tarot;
    }
    getDefaultAdvice(type) {
        const defaults = {
            tarot: '保持开放的心态，相信内在智慧的引导，勇敢踏出舒适圈。',
            bazi: '多行善事，调和阴阳，时机成熟时自然有收获。',
            astrology: '聆听内心的声音，在变化中寻找永恒的真理。',
            numerology: '相信数字的指引，在日常生活中寻找同步性和机遇。'
        };
        return defaults[type] || defaults.tarot;
    }
    getDefaultLuckyElements(type) {
        const defaults = {
            tarot: ['紫色', '7', '西方'],
            bazi: ['绿色', '3', '东方'],
            astrology: ['蓝色', '9', '北方'],
            numerology: ['金色', '1', '中心']
        };
        return defaults[type] || defaults.tarot;
    }
    generateFallbackFortune(type) {
        const fallbacks = {
            tarot: {
                prediction: '🔮 塔罗牌显示你正站在人生的十字路口，宇宙正在为你准备新的机会。当前星象显示你内在的直觉力正在增强，适合做出重要决定。',
                advice: '🌟 保持开放的心态，相信内在智慧的引导，勇敢踏出舒适圈。记住，每一个选择都是成长的机会。',
                luckyElements: ['紫色', '7', '西方'],
                confidence: 0.8
            },
            bazi: {
                prediction: '⚖️ 八字显示你五行平衡，近期运势平稳上升。天时地利人和，正是行动的好时机。你的努力即将得到回报。',
                advice: '💪 多行善事，调和阴阳，时机成熟时自然有收获。保持积极的心态，相信自己的判断力。',
                luckyElements: ['绿色', '3', '东方'],
                confidence: 0.8
            },
            astrology: {
                prediction: '🌌 当前星象为你带来内在觉醒的能量转化。水星逆行即将结束，沟通和表达将变得更加顺畅。',
                advice: '🎵 聆听内心的声音，在变化中寻找永恒的真理。这段时间适合反思和规划未来的方向。',
                luckyElements: ['蓝色', '9', '北方'],
                confidence: 0.8
            },
            numerology: {
                prediction: '🔢 你的生命数字显示创造力和直觉力正在增强。数字3和7的组合预示着新的开始和灵性成长。',
                advice: '✨ 相信数字的指引，在日常生活中寻找同步性。保持好奇心，探索未知的可能性。',
                luckyElements: ['金色', '1', '中心'],
                confidence: 0.8
            }
        };
        return fallbacks[type] || fallbacks.tarot;
    }
    getConversationHistory() {
        return this.conversationHistory;
    }
}
exports.ModelScopeService = ModelScopeService;
//# sourceMappingURL=modelscope.js.map