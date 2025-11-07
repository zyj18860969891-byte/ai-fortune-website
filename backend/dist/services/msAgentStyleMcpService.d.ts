export interface McpServerConfig {
    type: 'streamable_http';
    url: string;
    headers?: Record<string, string>;
    timeout?: number;
    sse_read_timeout?: number;
}
export interface McpConfig {
    mcpServers: Record<string, McpServerConfig>;
}
export declare class MsAgentStyleMcpService {
    private static instance;
    private mcpConfig;
    private baseUrl;
    private apiKey;
    private timeout;
    private sessions;
    private exitStack;
    private constructor();
    static getInstance(): MsAgentStyleMcpService;
    /**
     * 基于Bazi MCP官方文档的MCP工具调用
     * 参考：https://github.com/cantian-ai/bazi-mcp
     */
    callTool(serverName: string, toolName: string, toolArgs: any): Promise<any>;
    /**
     * 列出可用工具（参考ms_agent的实现）
     */
    listTools(serverName: string): Promise<any>;
    /**
     * 连接到MCP服务器并创建Client - 基于ms-agent实现
     * 参考：ms_agent/tools/mcp_client.py
     */
    private connectToServer;
    /**
     * 使用streamable_http传输方式发送请求 - 增强日志版本
     * 基于Bazi MCP实际需求：需要mcp-session-id header
     */
    private sendStreamableHttpRequest;
    /**
     * 计算八字 - 使用Bazi MCP工具调用
     * 根据八字MCP官方文档，工具名称是getBaziDetail
     * 参考：https://github.com/cantian-ai/bazi-mcp
     */
    calculateBazi(birthData: any): Promise<any>;
    /**
     * 准备八字MCP参数格式
     * 根据官方文档格式要求
     */
    private prepareBaziArgs;
    /**
     * 构建ISO格式的阳历时间
     */
    private buildSolarDatetime;
    /**
     * 健康检查 - 使用Bazi MCP的tools/list接口
     */
    healthCheck(): Promise<any>;
    /**
     * 获取MCP配置
     */
    getMcpConfig(): McpConfig;
}
export default MsAgentStyleMcpService;
//# sourceMappingURL=msAgentStyleMcpService.d.ts.map