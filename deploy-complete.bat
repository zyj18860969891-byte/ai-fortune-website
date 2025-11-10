@echo off
echo 🚀 开始部署完整实现到 Railway...

cd /d "e:\MultiModel\ai-fortune-website"

echo 📦 检查依赖...
npm install

echo 📝 提交更改...
git add .
git commit -m "部署完整 ModelScope 实现"

echo 🚀 推送到 Railway...
git push railway master

echo ✅ 部署完成！
echo 🌐 请访问 Railway 应用查看结果
echo 🔍 健康检查: https://your-app.railway.app/health
echo 🤖 AI 测试: https://your-app.railway.app/api/fortune/chat

pause