#!/bin/bash

echo "🚀 StockHub 快速云端部署（简化版）"
echo "================================"
echo ""

# 获取服务器IP
PUBLIC_IP=$(curl -s ifconfig.me)
echo "🖥️  公网IP: $PUBLIC_IP"
echo ""

cd /workspace/projects/stockhub

# 简化版：只启动后端和前端，不依赖MySQL/Redis（使用SQLite）
echo "📦 启动后端服务（使用SQLite）..."
cd backend

# 检查node_modules
if [ ! -d "node_modules" ]; then
    echo "⚠️  安装依赖..."
    npm install
fi

# 后台启动后端
nohup npm run start:prod > /tmp/stockhub-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端启动中... PID: $BACKEND_PID"

# 等待后端启动
sleep 10

# 检查后端是否启动成功
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 后端服务启动成功！"
else
    echo "❌ 后端服务启动失败，查看日志："
    tail -20 /tmp/stockhub-backend.log
fi

# 启动前端
echo ""
echo "📦 启动前端服务..."
cd frontend/domestic

# 检查node_modules
if [ ! -d "node_modules" ]; then
    echo "⚠️  安装依赖..."
    npm install
fi

# 构建前端
echo "🔨 构建前端..."
npm run build

# 使用HTTP服务器
cd dist
nohup python3 -m http.server 5173 > /tmp/stockhub-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端启动中... PID: $FRONTEND_PID"

# 等待前端启动
sleep 5

echo ""
echo "================================"
echo "🎉 部署完成！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   🌐 前端应用: http://$PUBLIC_IP:5173"
echo "   📚 API文档: http://$PUBLIC_IP:3000/api/docs"
echo "   🔌 后端API: http://$PUBLIC_IP:3000"
echo ""
echo "🔥 需要开放防火墙端口："
echo "   3000端口: sudo ufw allow 3000"
echo "   5173端口: sudo ufw allow 5173"
echo ""
echo "📋 查看日志："
echo "   后端: tail -f /tmp/stockhub-backend.log"
echo "   前端: tail -f /tmp/stockhub-frontend.log"
echo ""
echo "🛑 停止服务："
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "✅ 开始测试吧！"
