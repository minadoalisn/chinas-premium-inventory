#!/bin/bash

echo "🛑 StockHub 停止服务脚本"
echo "================================"
echo ""

# 停止后端
echo "🛑 停止后端服务..."
BACKEND_PID=$(ps aux | grep "nest start" | grep -v grep | awk '{print $2}')
if [ -n "$BACKEND_PID" ]; then
    kill $BACKEND_PID
    echo "✅ 后端已停止 (PID: $BACKEND_PID)"
else
    echo "⚠️  后端未运行"
fi

# 停止前端
echo "🛑 停止前端服务..."
FRONTEND_PID=$(ps aux | grep "vite" | grep -v grep | awk '{print $2}')
if [ -n "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID
    echo "✅ 前端已停止 (PID: $FRONTEND_PID)"
else
    echo "⚠️  前端未运行"
fi

echo ""
echo "✅ 所有服务已停止！"
