"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fortune_1 = __importDefault(require("./routes/fortune"));
// 确保在导入其他模块之前加载环境变量
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 中间件配置
app.use((0, helmet_1.default)()); // 安全头
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:5173'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use((0, morgan_1.default)('combined')); // 请求日志
// 修复中文字符编码问题
app.use(express_1.default.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        // 确保中文字符正确解析
        req.rawBody = buf;
    }
}));
app.use(express_1.default.urlencoded({
    extended: true,
    verify: (req, res, buf) => {
        // 确保中文字符正确解析
        req.rawBody = buf;
    }
}));
// 静态文件服务 - 提供前端页面
// 从 backend/dist 指向根目录的 dist
const frontendDistPath = path_1.default.join(__dirname, '../../dist');
app.use(express_1.default.static(frontendDistPath));
// SPA路由支持 - 所有非API路由返回index.html
app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path_1.default.join(frontendDistPath, 'index.html'));
});
// 路由配置
app.use('/api/fortune', fortune_1.default);
// 健康检查接口
app.get('/health', (req, res) => {
    console.log('🔍 [健康检查] 收到请求:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        timestamp: new Date().toISOString()
    });
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'ai-fortune-backend',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '8080'
    });
});
// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({
        error: '内部服务器错误',
        message: process.env.NODE_ENV === 'development' ? error.message : '请稍后再试'
    });
});
// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: '接口不存在',
        path: req.originalUrl
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map