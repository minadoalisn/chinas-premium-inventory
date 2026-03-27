#!/bin/bash

echo "🚀 StockHub 本地启动脚本"
echo "================================"
echo ""

# 检查后端
echo "📦 启动后端服务..."
cd /workspace/projects/stockhub/backend

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules 不存在，正在安装依赖..."
    npm install
fi

echo "🔧 启动后端（端口3000）..."
nohup npm run start:dev > /tmp/stockhub-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端启动中... PID: $BACKEND_PID"

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 10

# 检查后端是否启动成功
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 后端服务启动成功！"
else
    echo "❌ 后端服务启动失败，请查看日志："
    tail -20 /tmp/stockhub-backend.log
    exit 1
fi

echo ""
echo "📦 启动前端服务..."
cd /workspace/projects/stockhub/frontend/domestic

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules 不存在，正在安装依赖..."
    npm install
fi

echo "🔧 启动前端（端口5173）..."
nohup npm run dev > /tmp/stockhub-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端启动中... PID: $FRONTEND_PID"

# 等待前端启动
echo "⏳ 等待前端服务启动..."
sleep 10

echo ""
echo "================================"
echo "🎉 服务启动完成！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   🌐 前端应用: http://localhost:5173"
echo "   📚 API文档: http://localhost:3000/api/docs"
echo "   🔌 后端API: http://localhost:3000"
echo ""
echo "📋 进程信息："
echo "   后端PID: $BACKEND_PID"
echo "   前端PID: $FRONTEND_PID"
echo ""
echo "📝 日志文件："
echo "   后端日志: tail -f /tmp/stockhub-backend.log"
echo "   前端日志: tail -f /tmp/stockhub-frontend.log"
echo ""
echo "🛑 停止服务："
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "✅ 开始测试吧！"
