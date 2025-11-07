export interface UserProfile {
    userId: string;
    birthDate: string;
    birthTime: string;
    gender: string;
    location: string;
    occupation?: string;
    interests?: string[];
    baziData?: any;
}
export interface IntelligentAnalysisResult {
    success: boolean;
    data: any;
    serviceType: string;
    proactive: boolean;
    timestamp: string;
}
export declare class IntelligentBaziService {
    private modelScopeService;
    private userProfiles;
    constructor();
    /**
     * 建立智能用户档案
     */
    setupUserProfile(userData: {
        userId: string;
        birthDate: string;
        birthTime: string;
        gender: string;
        location: string;
        occupation?: string;
        interests?: string[];
    }): Promise<IntelligentAnalysisResult>;
    /**
     * 智能主动分析 - 基于当前时间和位置
     */
    generateProactiveRecommendations(userId: string, location?: any): Promise<IntelligentAnalysisResult>;
    /**
     * 基于时间的智能分析
     */
    generateTimelyAnalysis(userId: string): Promise<IntelligentAnalysisResult>;
    /**
     * 获取当前最佳建议（无需询问）
     */
    getCurrentBestAdvice(userId: string): Promise<IntelligentAnalysisResult>;
    private calculateBaziData;
    private calculateElements;
    private generateInitialAnalysis;
    private getCurrentSeason;
    private generateMonthlyOutlook;
    private personalizeByOccupation;
    private analyzeTimingContext;
    private getLunarDate;
    private generateTimeSensitiveAdvice;
    private getActivitiesByTime;
    private getColorsBySeason;
    private getAvoidActivities;
    private generateSeasonalAdvice;
    private getSeasonFocus;
    private getSeasonHealthAdvice;
    private getSeasonCareerAdvice;
    private getSeasonRelationshipAdvice;
    private getSeasonFinancialAdvice;
    private generateSolarTermsReminder;
    private calculateNextCheckIn;
    private calculateNextOptimalTiming;
    private findNextOptimalHour;
    private generateImmediateAdvice;
    private getLuckyNumbers;
    private identifyCurrentOpportunities;
    private suggestOptimalActivities;
    private generateUrgentReminders;
    private getCurrentLuckyElements;
    private getSeasonalStones;
    private getSeasonElements;
    private performMultiDimensionalAnalysis;
    private analyzeLocationContext;
    private identifyImmediateOpportunities;
    private generatePersonalizedProactiveSuggestions;
    private getOccupationBasedSuggestions;
    private generateHealthReminders;
    private getNextHealthCheck;
    private getOptimalDailyRoutine;
    private generateRelationshipTips;
    private getCommunicationStyle;
    private getRelationshipActivities;
    private generateFinancialGuidance;
    private getFinancialTimingAdvice;
    private getInvestmentAdvice;
    private getSpendingTips;
    private getSavingGoals;
    private suggestNextAction;
    private assessRecommendationPriority;
    /**
     * 获取用户档案
     */
    getUserProfile(userId: string): UserProfile | undefined;
    /**
     * 更新用户档案
     */
    updateUserProfile(userId: string, updates: Partial<UserProfile>): boolean;
    /**
     * 删除用户档案
     */
    deleteUserProfile(userId: string): boolean;
    /**
     * 获取所有用户档案
     */
    getAllUserProfiles(): UserProfile[];
}
export default IntelligentBaziService;
//# sourceMappingURL=intelligentBaziService.d.ts.map