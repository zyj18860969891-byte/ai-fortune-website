export declare class ModelScopeMcpService {
    private mcpProcess;
    private isConnected;
    constructor();
    private initializeMCPServer;
    private startLocalMCPServer;
    private launchMCPServer;
    analyzeBazi(params: {
        name?: string;
        birthDate?: string;
        birthTime?: string;
        question: string;
        context?: string;
    }): Promise<any>;
    private callLocalMCPTool;
    private getLocalBaziAnalysis;
    disconnect(): Promise<void>;
    isServiceAvailable(): boolean;
}
export default ModelScopeMcpService;
//# sourceMappingURL=modelscopeMcpService.d.ts.map