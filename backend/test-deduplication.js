"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 测试新的智能去重算法
const realModelScopeOnlineService_1 = require("./src/services/realModelScopeOnlineService");
// 创建临时配置来测试去重功能
const config = {
    apiKey: 'test-key',
    modelId: 'test-model',
    baseUrl: 'https://test.com'
};
async function testDeduplication() {
    const service = new realModelScopeOnlineService_1.RealModelScopeOnlineService(config);
    const testText = `👋 您好！欢迎使用八字排盘系统！

😊 今天运势很好

🌟 八字排盘显示

您今天会遇到好运气

👋 您好！欢迎使用八字排盘系统！

😊 今天运势很好

🌟 八字排盘显示

您今天会遇到好运气

💪 运势分析

🌸 今日适合...

👋 您好！欢迎使用八字排盘系统！`;
    console.log('🧪 测试文本长度:', testText.length);
    console.log('📄 原始文本:');
    console.log(testText);
    console.log('\n' + '='.repeat(50) + '\n');
    // 使用callModelScopeAPI方法作为测试入口来触发去重
    const result = await service.generateFortune('测试问题', testText);
    console.log('🧹 分析后预测长度:', result.prediction.length);
    console.log('📄 分析后预测内容:');
    console.log(result.prediction);
}
testDeduplication().catch(console.error);
