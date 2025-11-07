import { RealModelScopeConfig } from '../services/realModelScopeOnlineService';
/**
 * 多模型配置管理器
 */
export declare class MultiModelConfig {
    private static instance;
    private configs;
    private constructor();
    static getInstance(): MultiModelConfig;
    /**
     * 加载所有配置
     */
    private loadConfigs;
    /**
     * 获取指定服务的配置
     */
    getConfig(serviceType: 'modelscope' | 'openai'): RealModelScopeConfig | null;
    /**
     * 获取当前默认配置
     */
    getDefaultConfig(): RealModelScopeConfig | null;
    /**
     * 获取所有可用服务类型
     */
    getAvailableServices(): ('modelscope' | 'openai')[];
    /**
     * 切换服务类型
     */
    switchService(serviceType: 'modelscope' | 'openai'): boolean;
    /**
     * 验证配置
     */
    validateConfig(serviceType?: 'modelscope' | 'openai'): {
        valid: boolean;
        errors: string[];
    };
}
export declare const multiModelConfig: MultiModelConfig;
export declare function getModelConfig(serviceType?: 'modelscope' | 'openai'): RealModelScopeConfig | null;
export declare function switchModelService(serviceType: 'modelscope' | 'openai'): boolean;
//# sourceMappingURL=multi-model-config.d.ts.map