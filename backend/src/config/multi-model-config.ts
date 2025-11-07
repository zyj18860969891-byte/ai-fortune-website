import dotenv from 'dotenv';
import { RealModelScopeConfig } from '../services/realModelScopeOnlineService';

// 加载环境变量
dotenv.config();

/**
 * 多模型配置管理器
 */
export class MultiModelConfig {
  private static instance: MultiModelConfig;
  private configs: Map<string, RealModelScopeConfig> = new Map();

  private constructor() {
    this.loadConfigs();
  }

  public static getInstance(): MultiModelConfig {
    if (!MultiModelConfig.instance) {
      MultiModelConfig.instance = new MultiModelConfig();
    }
    return MultiModelConfig.instance;
  }

  /**
   * 加载所有配置
   */
  private loadConfigs(): void {
    // ModelScope配置 - Qwen-7B-Chat
    const modelScopeConfig: RealModelScopeConfig = {
      apiKey: process.env.MODELSCOPE_TOKEN || '',
      modelId: process.env.MODELSCOPE_MODEL_ID || 'ZhipuAI/GLM-4.6',
      baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1',
      serviceType: 'modelscope'
    };
    this.configs.set('modelscope', modelScopeConfig);

    // OpenAI配置 - GPT-5
    const openaiConfig: RealModelScopeConfig = {
      apiKey: process.env.MODELSCOPE_TOKEN || '', // 保持兼容性
      modelId: process.env.OPENAI_MODEL || 'gpt-5',
      baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1',
      serviceType: 'openai',
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      openaiModel: process.env.OPENAI_MODEL || 'gpt-5'
    };
    this.configs.set('openai', openaiConfig);

    // 默认配置
    const defaultServiceType = (process.env.AI_SERVICE_TYPE || 'modelscope') as 'modelscope' | 'openai';
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
  public getConfig(serviceType: 'modelscope' | 'openai'): RealModelScopeConfig | null {
    return this.configs.get(serviceType) || null;
  }

  /**
   * 获取当前默认配置
   */
  public getDefaultConfig(): RealModelScopeConfig | null {
    const defaultServiceType = (process.env.AI_SERVICE_TYPE || 'modelscope') as 'modelscope' | 'openai';
    return this.configs.get(defaultServiceType) || null;
  }

  /**
   * 获取所有可用服务类型
   */
  public getAvailableServices(): ('modelscope' | 'openai')[] {
    return Array.from(this.configs.keys()) as ('modelscope' | 'openai')[];
  }

  /**
   * 切换服务类型
   */
  public switchService(serviceType: 'modelscope' | 'openai'): boolean {
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
  public validateConfig(serviceType?: 'modelscope' | 'openai'): { valid: boolean; errors: string[] } {
    const config = serviceType ? this.configs.get(serviceType) : this.getDefaultConfig();
    const errors: string[] = [];

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

// 导出单例实例
export const multiModelConfig = MultiModelConfig.getInstance();

// 导出配置获取函数
export function getModelConfig(serviceType?: 'modelscope' | 'openai'): RealModelScopeConfig | null {
  return serviceType ? multiModelConfig.getConfig(serviceType) : multiModelConfig.getDefaultConfig();
}

// 导出服务切换函数
export function switchModelService(serviceType: 'modelscope' | 'openai'): boolean {
  return multiModelConfig.switchService(serviceType);
}