@echo off
echo 🚀 开始部署到 Railway...

REM 检查 Railway CLI 是否已安装
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI 未安装，请先安装：
    echo npm install -g @railway/cli
    pause
    exit /b 1
)

REM 登录 Railway
echo 🔐 登录 Railway...
railway login

REM 创建新项目（如果还没有）
echo 📝 创建 Railway 项目...
railway init

REM 添加 Railway 远程仓库
echo 🔗 添加 Railway 远程仓库...
railway link

REM 推送代码到 Railway
echo 📤 推送代码到 Railway...
git push railway master

echo ✅ 部署完成！
echo 🌐 访问你的应用：
echo    railway open

pause