"use strict";
// 基于ms-agent源码分析的正确MCP配置实现
// 参考：https://github.com/modelscope/ms-agent/blob/main/ms_agent/tools/mcp_client.py
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsAgentStyleMcpService = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
class MsAgentStyleMcpService {
    constructor() {
        this.sessions = new Map();
        // 读取环境变量配置
        this.baseUrl = process.env.BAZI_MCP_URL || 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp';
        this.apiKey = process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180';
        this.timeout = parseInt(process.env.BAZI_MCP_TIMEOUT || '15000');
        // 构建ms-agent风格的MCP配置
        this.mcpConfig = {
            mcpServers: {
                "Bazi-MCP": {
                    type: "streamable_http",
                    url: this.baseUrl,
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'X-ModelScope-Token': this.apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/event-stream'
                    },
                    timeout: this.timeout,
                    sse_read_timeout: this.timeout
                },
                "Enhance-Prompt-MCP": {
                    type: "streamable_http",
                    url: "https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp",
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'X-ModelScope-Token': this.apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/event-stream'
                    },
                    timeout: this.timeout,
                    sse_read_timeout: this.timeout
                }
            }
        };
        console.log('🔮 MsAgentStyleMcpService初始化:', {
            baseUrl: this.baseUrl,
            apiKey: this.apiKey.substring(0, 12) + '...',
            timeout: this.timeout,
            config: this.mcpConfig
        });
    }
    static getInstance() {
        if (!MsAgentStyleMcpService.instance) {
            MsAgentStyleMcpService.instance = new MsAgentStyleMcpService();
        }
        return MsAgentStyleMcpService.instance;
    }
    /**
     * 基于Bazi MCP官方文档的MCP工具调用
     * 参考：https://github.com/cantian-ai/bazi-mcp
     */
    async callTool(serverName, toolName, toolArgs) {
        try {
            console.log(`🔮 调用Bazi MCP工具: ${serverName}.${toolName}`, toolArgs);
            const serverConfig = this.mcpConfig.mcpServers[serverName];
            if (!serverConfig) {
                throw new Error(`MCP服务器 ${serverName} 未配置`);
            }
            // 获取ClientSession（带重试机制）
            let session;
            let retryCount = 0;
            const maxRetries = 2;
            while (retryCount <= maxRetries) {
                try {
                    session = await this.connectToServer(serverName, serverConfig);
                    break;
                }
                catch (error) {
                    if (retryCount >= maxRetries) {
                        throw error;
                    }
                    retryCount++;
                    console.log(`🔄 第${retryCount}次重试连接:`, error.message);
                    // 清理失败的会话
                    this.sessions.delete(serverName);
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // 递增延迟
                }
            }
            if (!session) {
                throw new Error('无法建立MCP连接');
            }
            console.log('📡 发送Bazi MCP请求:', {
                method: 'tools/call',
                tool: toolName,
                server: serverName,
                url: serverConfig.url
            });
            // 使用正确的MCP工具调用方式
            const response = await session.callTool({
                name: toolName,
                arguments: toolArgs
            });
            console.log('📊 Bazi MCP响应状态:', {
                isError: response.isError,
                content: response.content,
                contentType: typeof response.content,
                hasContent: !!response.content
            });
            if (!response.isError) {
                console.log('✅ Bazi MCP工具调用成功');
                // 正确解析响应内容
                let content = '';
                if (Array.isArray(response.content)) {
                    content = response.content.map((c) => {
                        if (c?.text)
                            return c.text;
                        if (typeof c === 'string')
                            return c;
                        return JSON.stringify(c);
                    }).join('\n');
                }
                else if (response.content && typeof response.content === 'object' && 'text' in response.content) {
                    content = response.content.text;
                }
                else if (typeof response.content === 'string') {
                    content = response.content;
                }
                else if (response.content) {
                    content = JSON.stringify(response.content);
                }
                return {
                    success: true,
                    content: content,
                    data: response
                };
            }
            else {
                console.error('❌ Bazi MCP工具调用失败:', response.content);
                let errorMsg = '未知错误';
                if (Array.isArray(response.content)) {
                    errorMsg = response.content.map((c) => c?.text || '').join('\n');
                }
                else if (response.content && typeof response.content === 'object' && 'text' in response.content) {
                    errorMsg = response.content.text;
                }
                else if (typeof response.content === 'string') {
                    errorMsg = response.content;
                }
                return {
                    success: false,
                    error: `工具调用失败: ${errorMsg}`
                };
            }
        }
        catch (error) {
            console.error('❌ Bazi MCP工具调用异常:', error.message);
            // 检查是否是session过期错误
            if (error.message.includes('SessionExpired') || error.message.includes('session') && error.message.includes('expired')) {
                console.log('🔄 检测到session过期，清除现有会话...');
                this.sessions.delete(serverName);
            }
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
     * 列出可用工具（参考ms_agent的实现）
     */
    async listTools(serverName) {
        try {
            console.log(`🔍 列出MCP工具: ${serverName}`);
            const serverConfig = this.mcpConfig.mcpServers[serverName];
            if (!serverConfig) {
                throw new Error(`MCP服务器 ${serverName} 未配置`);
            }
            const requestBody = {
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/list',
                params: {}
            };
            const session = await this.connectToServer(serverName, serverConfig);
            const response = await session.listTools();
            if (!response.isError) {
                console.log('✅ 获取工具列表成功:', response.tools.length);
                return { success: true, tools: response.tools };
            }
            else {
                return { success: false, error: '获取工具列表失败' };
            }
        }
        catch (error) {
            console.error('❌ 获取工具列表失败:', error.message);
            return { success: false, error: error.message };
        }
    }
    /**
     * 连接到MCP服务器并创建Client - 基于ms-agent实现
     * 参考：ms_agent/tools/mcp_client.py
     */
    async connectToServer(serverName, serverConfig) {
        try {
            console.log(`📡 [ms-agent] 连接到MCP服务器: ${serverName}`);
            // 检查是否已有有效连接
            if (this.sessions.has(serverName)) {
                const existingClient = this.sessions.get(serverName);
                if (existingClient) {
                    try {
                        // 验证现有会话是否有效
                        await existingClient.listTools();
                        console.log('📡 [ms-agent] 使用现有会话');
                        return existingClient;
                    }
                    catch (error) {
                        console.log('📡 [ms-agent] 现有会话无效，清除后重连');
                        this.sessions.delete(serverName);
                    }
                }
            }
            // 使用Streamable HTTP传输方式
            const transport = new streamableHttp_js_1.StreamableHTTPClientTransport(new URL(serverConfig.url), {
                requestInit: {
                    headers: serverConfig.headers,
                    signal: AbortSignal.timeout(serverConfig.timeout || 15000)
                }
            });
            // 创建Client
            const client = new index_js_1.Client({
                name: 'ai-fortune-backend',
                version: '1.0.0'
            }, {
                capabilities: {}
            });
            // 连接传输层
            await client.connect(transport);
            console.log('✅ [ms-agent] MCP客户端连接成功');
            // 保存会话
            this.sessions.set(serverName, client);
            // 列出可用工具
            const toolsResult = await client.listTools();
            console.log(`✅ [ms-agent] 获取到 ${toolsResult.tools.length} 个工具`);
            return client;
        }
        catch (error) {
            console.error('❌ [ms-agent] MCP连接失败:', error.message);
            throw error;
        }
    }
    /**
     * 使用streamable_http传输方式发送请求 - 增强日志版本
     * 基于Bazi MCP实际需求：需要mcp-session-id header
     */
    async sendStreamableHttpRequest(serverConfig, requestBody, sessionId) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), serverConfig.timeout || 15000);
        try {
            const headers = {
                ...serverConfig.headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream'
            };
            // 暂时不使用会话ID，测试是否是会话ID导致的问题
            let finalSessionId = sessionId;
            if (sessionId && sessionId !== 'direct-call' && sessionId !== '') {
                headers['mcp-session-id'] = sessionId;
                console.log('📡 [ms-agent风格] 使用会话ID:', sessionId);
            }
            else {
                console.log('📡 [ms-agent风格] 跳过会话ID');
                finalSessionId = 'no-session';
            }
            console.log('📡 [详细日志] 发送Bazi MCP请求:', {
                url: serverConfig.url,
                method: requestBody.method,
                id: requestBody.id,
                tool: requestBody.params?.name,
                headers: Object.keys(headers),
                sessionId: sessionId,
                finalSessionId: finalSessionId,
                mcpSessionId: headers['mcp-session-id'],
                bodySize: JSON.stringify(requestBody).length,
                bodyPreview: JSON.stringify(requestBody).substring(0, 200) + '...'
            });
            const startTime = Date.now();
            const response = await fetch(serverConfig.url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            const endTime = Date.now();
            console.log('📡 [详细日志] 请求响应详情:', {
                status: response.status,
                statusText: response.statusText,
                responseTime: `${endTime - startTime}ms`,
                responseHeaders: Object.fromEntries(response.headers.entries()),
                contentType: response.headers.get('content-type'),
                contentLength: response.headers.get('content-length')
            });
            clearTimeout(timeoutId);
            return response;
        }
        catch (error) {
            clearTimeout(timeoutId);
            console.error('📡 [详细日志] 请求异常:', {
                error: error.message,
                errorType: error.name,
                isTimeout: error.name === 'AbortError',
                sessionId: sessionId
            });
            throw error;
        }
    }
    /**
     * 计算八字 - 使用Bazi MCP工具调用
     * 根据八字MCP官方文档，工具名称是getBaziDetail
     * 参考：https://github.com/cantian-ai/bazi-mcp
     */
    async calculateBazi(birthData) {
        try {
            console.log('🔮 使用Bazi MCP工具计算八字');
            console.log('📊 原始birthData:', JSON.stringify(birthData, null, 2));
            // 根据八字MCP文档准备参数
            const baziArgs = this.prepareBaziArgs(birthData);
            console.log('📋 准备Bazi MCP参数:', JSON.stringify(baziArgs, null, 2));
            console.log('🔧 参数类型检查:', {
                hasSolarDatetime: !!baziArgs.solarDatetime,
                hasLunarDatetime: !!baziArgs.lunarDatetime,
                gender: baziArgs.gender,
                eightCharProviderSect: baziArgs.eightCharProviderSect
            });
            // 使用正确的工具名称getBaziDetail
            console.log('🚀 开始调用MCP工具...');
            const result = await this.callTool('Bazi-MCP', 'getBaziDetail', baziArgs);
            console.log('📡 MCP工具调用完成，返回结果:', result);
            if (result.success) {
                console.log('✅ Bazi MCP计算成功');
                console.log('📄 原始响应内容:', result.content);
                // 更健壮的数据解析
                let parsedData = null;
                // 1. 先尝试从content字段解析
                if (result.content) {
                    try {
                        parsedData = JSON.parse(result.content);
                        console.log('📊 从content字段解析成功:', {
                            hasDayMaster: !!parsedData?.日主,
                            dayMaster: parsedData?.日主,
                            keys: Object.keys(parsedData || {})
                        });
                    }
                    catch (e) {
                        console.log('⚠️ content字段JSON解析失败，尝试直接使用:', e.message);
                        // 如果content本身就是对象，直接使用
                        if (typeof result.content === 'object') {
                            parsedData = result.content;
                        }
                        else {
                            // 否则作为普通文本返回
                            parsedData = { content: result.content };
                        }
                    }
                }
                // 2. 如果content解析失败，尝试从data字段解析
                if (!parsedData && result.data) {
                    try {
                        if (typeof result.data === 'string') {
                            parsedData = JSON.parse(result.data);
                        }
                        else {
                            parsedData = result.data;
                        }
                        console.log('📊 从data字段解析成功:', {
                            hasDayMaster: !!parsedData?.日主,
                            dayMaster: parsedData?.日主,
                            keys: Object.keys(parsedData || {})
                        });
                    }
                    catch (e) {
                        console.warn('⚠️ data字段解析也失败:', e);
                        parsedData = result.data;
                    }
                }
                // 3. 如果都失败了，构造一个基本的响应结构
                if (!parsedData) {
                    console.warn('⚠️ 所有解析都失败，使用默认结构');
                    parsedData = {
                        八字: '计算失败',
                        日主: '未知',
                        错误信息: result.content || result.error || '未知错误',
                        rawResponse: result
                    };
                }
                return {
                    success: true,
                    data: parsedData
                };
            }
            else {
                console.warn('⚠️ Bazi MCP计算失败:', result.error);
                return {
                    success: false,
                    error: result.error,
                    data: null
                };
            }
        }
        catch (error) {
            console.error('❌ Bazi MCP计算异常:', error.message);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }
    /**
     * 准备八字MCP参数格式
     * 根据官方文档格式要求
     */
    prepareBaziArgs(birthData) {
        // 如果是ISO格式的阳历时间
        if (birthData.solarDatetime) {
            return {
                solarDatetime: birthData.solarDatetime,
                gender: birthData.gender || 1, // 1为男，0为女
                eightCharProviderSect: birthData.eightCharProviderSect || 2
            };
        }
        // 如果是农历时间
        if (birthData.lunarDatetime) {
            return {
                lunarDatetime: birthData.lunarDatetime,
                gender: birthData.gender || 1,
                eightCharProviderSect: birthData.eightCharProviderSect || 2
            };
        }
        // 如果是分离的年月日时分
        if (birthData.year && birthData.month && birthData.day) {
            // 构建ISO格式的阳历时间
            const solarDatetime = this.buildSolarDatetime(birthData.year, birthData.month, birthData.day, birthData.hour || 0, birthData.minute || 0, birthData.timezone || 'Asia/Shanghai');
            return {
                solarDatetime: solarDatetime,
                gender: birthData.gender === 'female' ? 0 : 1,
                eightCharProviderSect: birthData.eightCharProviderSect || 2
            };
        }
        // 如果是传统的年月日时格式
        if (birthData.birthYear && birthData.birthMonth && birthData.birthDay) {
            const solarDatetime = this.buildSolarDatetime(birthData.birthYear, birthData.birthMonth, birthData.birthDay, birthData.birthHour || 0, birthData.birthMinute || 0, 'Asia/Shanghai');
            return {
                solarDatetime: solarDatetime,
                gender: birthData.gender === 'female' ? 0 : 1,
                eightCharProviderSect: 2
            };
        }
        throw new Error('无法解析出生数据格式，请提供有效的年月日时分信息');
    }
    /**
     * 构建ISO格式的阳历时间
     */
    buildSolarDatetime(year, month, day, hour, minute, timezone) {
        // 构建日期时间字符串，假设为北京时间的阳历时间
        const date = new Date(year, month - 1, day, hour, minute, 0, 0);
        // 格式化为ISO格式并添加时区偏移
        return date.toISOString().replace('Z', '+08:00');
    }
    /**
     * 健康检查 - 使用Bazi MCP的tools/list接口
     */
    async healthCheck() {
        try {
            console.log('🔍 Bazi MCP服务健康检查...');
            const toolsResult = await this.listTools('Bazi-MCP');
            const healthy = toolsResult.success;
            console.log(healthy ? '✅ Bazi MCP服务健康' : '❌ Bazi MCP服务异常');
            return {
                healthy,
                service: '@cantian-ai/Bazi-MCP (简化版)',
                endpoint: this.baseUrl,
                config: this.mcpConfig,
                status: healthy ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ Bazi MCP健康检查失败:', error.message);
            return {
                healthy: false,
                service: '@cantian-ai/Bazi-MCP (简化版)',
                endpoint: this.baseUrl,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * 获取MCP配置
     */
    getMcpConfig() {
        return this.mcpConfig;
    }
}
exports.MsAgentStyleMcpService = MsAgentStyleMcpService;
exports.default = MsAgentStyleMcpService;
//# sourceMappingURL=msAgentStyleMcpService.js.map