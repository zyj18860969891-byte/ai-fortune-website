"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiModelConfig = exports.MultiModelConfig = void 0;
exports.getModelConfig = getModelConfig;
exports.switchModelService = switchModelService;
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
/**
 * 多模型配置管理器
 */
class MultiModelConfig {
    constructor() {
        this.configs = new Map();
        this.loadConfigs();
    }
    static getInstance() {
        if (!MultiModelConfig.instance) {
            MultiModelConfig.instance = new MultiModelConfig();
        }
        return MultiModelConfig.instance;
    }
    /**
     * 加载所有配置
     */
    loadConfigs() {
        // ModelScope配置 - Qwen-7B-Chat
        const modelScopeConfig = {
            apiKey: process.env.MODELSCOPE_TOKEN || '',
            modelId: process.env.MODELSCOPE_MODEL_ID || 'Qwen/Qwen3-235B-A22B-Instruct-2507',
            baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1',
            serviceType: 'modelscope'
        };
        this.configs.set('modelscope', modelScopeConfig);
        // OpenAI配置 - GPT-5
        const openaiConfig = {
            apiKey: process.env.MODELSCOPE_TOKEN || '', // 保持兼容性
            modelId: process.env.OPENAI_MODEL || 'gpt-5',
            baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1',
            serviceType: 'openai',
            openaiApiKey: process.env.OPENAI_API_KEY || '',
            openaiModel: process.env.OPENAI_MODEL || 'gpt-5'
        };
        this.configs.set('openai', openaiConfig);
        // 默认配置
        const defaultServiceType = (process.env.AI_SERVICE_TYPE || 'modelscope');
        const defaultConfig = this.configs.get(defaultServiceType);
        console.log('🎯 多模型配置加载完成');
        console.log('📡 可用服务:', Array.from(this.configs.keys()));
        console.log('🎭 默认服务:', defaultServiceType);
        console.log('🔧 默认配置:', {
            modelId: defaultConfig?.modelId,
            serviceType: defaultConfig?.serviceType,
            baseUrl: defaultConfig?.baseUrl
        });
    }
    /**
     * 获取指定服务的配置
     */
    getConfig(serviceType) {
        return this.configs.get(serviceType) || null;
    }
    /**
     * 获取当前默认配置
     */
    getDefaultConfig() {
        const defaultServiceType = (process.env.AI_SERVICE_TYPE || 'modelscope');
        return this.configs.get(defaultServiceType) || null;
    }
    /**
     * 获取所有可用服务类型
     */
    getAvailableServices() {
        return Array.from(this.configs.keys());
    }
    /**
     * 切换服务类型
     */
    switchService(serviceType) {
        if (this.configs.has(serviceType)) {
            process.env.AI_SERVICE_TYPE = serviceType;
            console.log(`🔄 已切换到服务: ${serviceType}`);
            return true;
        }
        console.log(`❌ 服务不存在: ${serviceType}`);
        return false;
    }
    /**
     * 验证配置
     */
    validateConfig(serviceType) {
        const config = serviceType ? this.configs.get(serviceType) : this.getDefaultConfig();
        const errors = [];
        if (!config) {
            errors.push('配置不存在');
            return { valid: false, errors };
        }
        if (!config.apiKey) {
            errors.push('API密钥未配置');
        }
        if (!config.modelId) {
            errors.push('模型ID未配置');
        }
        if (!config.baseUrl) {
            errors.push('基础URL未配置');
        }
        if (config.serviceType === 'openai' && !config.openaiApiKey) {
            errors.push('OpenAI API密钥未配置');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
exports.MultiModelConfig = MultiModelConfig;
// 导出单例实例
exports.multiModelConfig = MultiModelConfig.getInstance();
// 导出配置获取函数
function getModelConfig(serviceType) {
    return serviceType ? exports.multiModelConfig.getConfig(serviceType) : exports.multiModelConfig.getDefaultConfig();
}
// 导出服务切换函数
function switchModelService(serviceType) {
    return exports.multiModelConfig.switchService(serviceType);
}
//# sourceMappingURL=multi-model-config.js.map