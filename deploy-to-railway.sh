#!/bin/bash

echo "🚀 开始部署到 Railway..."

# 检查 Railway CLI 是否已安装
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装，请先安装："
    echo "npm install -g @railway/cli"
    exit 1
fi

# 登录 Railway
echo "🔐 登录 Railway..."
railway login

# 创建新项目（如果还没有）
echo "📝 创建 Railway 项目..."
railway init

# 添加 Railway 远程仓库
echo "🔗 添加 Railway 远程仓库..."
railway link

# 推送代码到 Railway
echo "📤 推送代码到 Railway..."
git push railway master

echo "✅ 部署完成！"
echo "🌐 访问你的应用："
echo "   railway open"