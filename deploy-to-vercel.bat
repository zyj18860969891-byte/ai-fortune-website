@echo off
chcp 65001 >nul
echo 🚀 开始部署AI算命网站到Vercel...
echo ========================================

echo 🔍 检查部署环境...

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)
echo ✅ Node.js版本已检测

REM 检查npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm未安装
    pause
    exit /b 1
)
echo ✅ npm已检测

echo.
echo 📦 准备前端项目...

REM 切换到前端目录
cd frontend
if %errorlevel% neq 0 (
    echo ❌ 无法进入frontend目录
    pause
    exit /b 1
)

REM 安装依赖
echo 📥 安装前端依赖...
npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 构建项目
echo 🔨 构建前端项目...
npm run build
if %errorlevel% neq 0 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)

echo ✅ 前端构建成功！
echo.
echo 📋 构建产物检查：
dir dist /b
echo.

echo 🌐 部署到Vercel的步骤：
echo.
echo 方法1 - 通过GitHub部署（推荐）：
echo 1. git add -A
echo 2. git commit -m "准备Vercel前端部署"
echo 3. git push origin master
echo 4. 访问 https://vercel.com 导入GitHub仓库
echo 5. 配置项目：
echo    - Framework Preset: Vite
echo    - Root Directory: frontend
echo    - Build Command: cd frontend && npm install && npm run build
echo    - Output Directory: frontend/dist
echo 6. 添加环境变量：
echo    VITE_API_BASE_URL=https://ai-fortune-website-production.up.railway.app
echo 7. 点击部署！
echo.
echo 方法2 - 通过Vercel CLI：
echo 1. npm install -g vercel
echo 2. vercel login
echo 3. vercel --prod frontend
echo.

echo 🎯 部署完成后：
echo ✅ 前端将部署到 https://your-project.vercel.app
echo ✅ 后端API: https://ai-fortune-website-production.up.railway.app
echo.
echo 📊 最终架构：
echo    前端 (Vercel) ← API调用 ← 后端 (Railway)
echo    ├─ React + Vite 静态网站
echo    ├─ 全球CDN加速
echo    ├─ 自动HTTPS
echo    └─ ModelScope AI + 八字MCP
echo.
echo 🎉 准备完成！请选择部署方法进行部署。
pause