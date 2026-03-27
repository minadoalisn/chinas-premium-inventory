#!/bin/bash

echo "🚀 StockHub 前端启动脚本"
echo "================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi
echo "✅ Node.js 版本: $(node --version)"

# 进入前端目录
cd /workspace/projects/stockhub/frontend/domestic

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装前端依赖..."
    npm install
else
    echo "✅ 前端依赖已安装"
fi

# 启动前端开发服务器
echo "🎨 正在启动前端开发服务器..."
echo ""
echo "🌐 前端地址: http://localhost:5173"
echo ""
echo "⏹️  停止服务: Ctrl+C"
echo "================================"

npm run dev
