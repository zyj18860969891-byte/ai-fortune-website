export declare class BaziMcpService {
    private static instance;
    private baseUrl;
    private apiKey;
    private timeout;
    private constructor();
    static getInstance(): BaziMcpService;
    /**
     * 计算八字 - 基于ms-agent的MCP服务实现
     */
    calculateBazi(birthData: any): Promise<any>;
    /**
     * 获取可用工具列表 - ms-agent标准方法
     */
    listTools(): Promise<any>;
    /**
     * 健康检查 - ms-agent标准方法
     */
    healthCheck(): Promise<any>;
}
export default BaziMcpService;
//# sourceMappingURL=baziMcpService.d.ts.map