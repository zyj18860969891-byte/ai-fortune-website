#!/bin/bash

# AI算命网站 - Vercel一键部署脚本
# 作者：AI助手
# 日期：2025-11-08

echo "🚀 开始部署AI算命网站到Vercel..."
echo "========================================"

# 检查必要的工具
echo "🔍 检查部署环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi
echo "✅ Node.js版本: $(node --version)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装"
    exit 1
fi
echo "✅ npm版本: $(npm --version)"

# 检查Vercel CLI（可选）
if ! command -v vercel &> /dev/null; then
    echo "⚠️ Vercel CLI未安装，将通过GitHub部署"
    USE_CLI=false
else
    echo "✅ Vercel CLI已安装: $(vercel --version)"
    USE_CLI=true
fi

echo ""
echo "📦 准备前端项目..."

# 切换到前端目录
cd frontend || exit 1

# 安装依赖
echo "📥 安装前端依赖..."
npm install

# 构建项目
echo "🔨 构建前端项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 前端构建成功！"
else
    echo "❌ 前端构建失败"
    exit 1
fi

echo ""
echo "📋 构建产物检查："
ls -la dist/

echo ""
echo "🌐 部署到Vercel..."

if [ "$USE_CLI" = true ]; then
    echo "使用Vercel CLI部署..."
    
    # 确保Vercel CLI已登录
    echo "请确保已登录Vercel (vercel login)"
    
    # 设置项目配置
    cat > vercel.json << EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_API_BASE_URL": "https://ai-fortune-website-production.up.railway.app"
  }
}
EOF
    
    # 执行部署
    echo "🚀 开始CLI部署..."
    if vercel --prod; then
        echo "✅ CLI部署成功！"
    else
        echo "❌ CLI部署失败，尝试GitHub部署..."
        USE_CLI=false
    fi
fi

if [ "$USE_CLI" = false ]; then
    echo "请使用以下步骤通过GitHub部署到Vercel："
    echo ""
    echo "1. 将代码推送到GitHub："
    echo "   git add -A"
    echo "   git commit -m '准备Vercel部署'"
    echo "   git push origin master"
    echo ""
    echo "2. 访问 https://vercel.com 并导入GitHub仓库"
    echo ""
    echo "3. 配置项目设置："
    echo "   - Framework Preset: Vite"
    echo "   - Root Directory: frontend"
    echo "   - Build Command: cd frontend && npm install && npm run build"
    echo "   - Output Directory: frontend/dist"
    echo "   - Install Command: cd frontend && npm install"
    echo ""
    echo "4. 添加环境变量："
    echo "   VITE_API_BASE_URL=https://ai-fortune-website-production.up.railway.app"
    echo ""
    echo "5. 点击部署！"
fi

echo ""
echo "🎯 部署完成后："
echo "1. 前端将部署到 https://your-project.vercel.app"
echo "2. 后端API: https://ai-fortune-website-production.up.railway.app"
echo "3. 测试功能是否正常"
echo ""
echo "📊 项目架构："
echo "   前端 (Vercel) ← API调用 ← 后端 (Railway)"
echo "   ├─ 静态网站托管"
echo "   ├─ 全球CDN加速" 
echo "   └─ 自动HTTPS"
echo ""
echo "🔧 后端功能："
echo "   ├─ ModelScope AI集成"
echo "   ├─ 八字MCP服务"
echo "   ├─ 多类型算命支持"
echo "   └─ 智能缓存机制"
echo ""
echo "🎉 部署完成！如有问题请检查Vercel构建日志"