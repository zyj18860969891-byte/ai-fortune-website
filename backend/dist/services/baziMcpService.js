"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaziMcpService = void 0;
// @ts-ignore
const node_fetch_1 = __importDefault(require("node-fetch"));
class BaziMcpService {
    constructor() {
        // 读取环境变量配置
        this.baseUrl = process.env.BAZI_MCP_URL || 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp';
        this.apiKey = process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180';
        this.timeout = parseInt(process.env.BAZI_MCP_TIMEOUT || '15000');
        console.log('🔮 八字MCP服务初始化:', {
            baseUrl: this.baseUrl,
            apiKey: this.apiKey.substring(0, 12) + '...',
            timeout: this.timeout
        });
    }
    static getInstance() {
        if (!BaziMcpService.instance) {
            BaziMcpService.instance = new BaziMcpService();
        }
        return BaziMcpService.instance;
    }
    /**
     * 计算八字 - 基于ms-agent的MCP服务实现
     */
    async calculateBazi(birthData) {
        try {
            console.log('🔮 调用八字MCP服务:', birthData);
            // 构建JSON-RPC请求（按照ms-agent的标准格式）
            const requestBody = {
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: 'calculate_bazi',
                    arguments: {
                        birth_data: birthData,
                        analysis_type: 'complete'
                    }
                }
            };
            console.log('📡 发送MCP请求:', {
                url: this.baseUrl,
                method: requestBody.method,
                tool: requestBody.params.name,
                id: requestBody.id
            });
            // 使用setTimeout实现超时控制
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), this.timeout);
            });
            // 调用MCP服务（使用ms-agent的调用方式）
            const fetchPromise = (0, node_fetch_1.default)(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-ModelScope-Token': this.apiKey
                },
                body: JSON.stringify(requestBody)
            });
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            console.log('📊 MCP响应状态:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 八字MCP调用成功:', {
                    success: data.result?.success,
                    hasData: !!data.result?.data,
                    error: data.error
                });
                // 处理ms-agent的响应格式
                if (data.result && data.result.success) {
                    return {
                        success: true,
                        data: data.result.data || data
                    };
                }
                else {
                    return {
                        success: false,
                        error: data.error?.message || 'MCP服务返回错误'
                    };
                }
            }
            else {
                const errorText = await response.text();
                console.error('❌ 八字MCP调用失败:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                return {
                    success: false,
                    error: `HTTP ${response.status}: ${errorText}`
                };
            }
        }
        catch (error) {
            console.error('❌ 八字MCP调用异常:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
     * 获取可用工具列表 - ms-agent标准方法
     */
    async listTools() {
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), 10000);
            });
            const fetchPromise = (0, node_fetch_1.default)(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-ModelScope-Token': this.apiKey
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'tools/list',
                    params: {}
                })
            });
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 获取工具列表成功:', data.result?.tools?.length || 0);
                return data;
            }
            else {
                return { success: false, error: `HTTP ${response.status}` };
            }
        }
        catch (error) {
            console.error('❌ 获取工具列表失败:', error.message);
            return { success: false, error: error.message };
        }
    }
    /**
     * 健康检查 - ms-agent标准方法
     */
    async healthCheck() {
        try {
            console.log('🔍 MCP服务健康检查...');
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), 10000);
            });
            const fetchPromise = (0, node_fetch_1.default)(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-ModelScope-Token': this.apiKey
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'tools/list',
                    params: {}
                })
            });
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            const healthy = response.ok;
            console.log(healthy ? '✅ MCP服务健康' : '❌ MCP服务异常');
            return {
                healthy,
                service: '@cantian-ai/Bazi-MCP (ms-agent标准)',
                endpoint: this.baseUrl,
                apiKey: this.apiKey.substring(0, 12) + '...',
                status: response.status,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ MCP健康检查失败:', error.message);
            return {
                healthy: false,
                service: '@cantian-ai/Bazi-MCP (ms-agent标准)',
                endpoint: this.baseUrl,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}
exports.BaziMcpService = BaziMcpService;
exports.default = BaziMcpService;
//# sourceMappingURL=baziMcpService.js.map