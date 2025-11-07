export declare class MCPDeploymentService {
    private static instance;
    private baseUrl;
    private config;
    private isDeployed;
    private constructor();
    static getInstance(): MCPDeploymentService;
    private loadConfig;
    private getDefaultMCPConfig;
    deployMCPService(): Promise<boolean>;
    private checkMCPHealth;
    private manualDeploy;
    callBaziMCP(params: {
        question: string;
        context?: string;
    }): Promise<any>;
    private callLocalBaziService;
    private performIntelligentBaziAnalysis;
    private adjustForContext;
    private generateLuckyElements;
    private callRemoteMCPService;
    private getIntelligentFallback;
    isServiceDeployed(): boolean;
}
//# sourceMappingURL=mcpDeploymentService.d.ts.map