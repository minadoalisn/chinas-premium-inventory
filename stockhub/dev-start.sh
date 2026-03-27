#!/bin/bash

echo "🚀 StockHub 开发环境启动脚本"
echo "================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi
echo "✅ Node.js 版本: $(node --version)"

# 进入后端目录
cd /workspace/projects/stockhub/backend

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装后端依赖..."
    npm install
else
    echo "✅ 后端依赖已安装"
fi

# 启动后端服务器
echo "🔧 正在启动后端服务器..."
npm run start:dev &
BACKEND_PID=$!

# 等待后端启动
sleep 5

echo ""
echo "================================"
echo "✅ 启动成功！"
echo ""
echo "📡 后端服务: http://localhost:3000"
echo "📚 API 文档: http://localhost:3000/api/docs"
echo ""
echo "🚀 启动前端:"
echo "   cd /workspace/projects/stockhub/frontend/domestic"
echo "   npm install && npm run dev"
echo ""
echo "⏹️  停止服务: Ctrl+C 或 kill $BACKEND_PID"
echo ""
echo "💡 提示: 首次启动会自动初始化12个类目数据"
echo "================================"

# 保持进程运行
wait $BACKEND_PID
