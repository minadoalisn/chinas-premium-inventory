#!/bin/bash

echo "🚀 StockHub V2.0 - 最简化启动"
echo "================================"
echo ""

# 清理进程
pkill -f "nest" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
sleep 2

cd /workspace/projects/stockhub/backend

echo "📦 启动后端服务（开发模式）..."
# 直接使用ts-node运行，不构建
nohup npx ts-node src/main.ts > /tmp/backend-dev.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端启动中 (PID: $BACKEND_PID)"
echo $BACKEND_PID > /tmp/backend-dev.pid

# 等待后端启动
echo "⏳ 等待后端..."
for i in {1..20}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 后端服务已启动！"
        break
    fi
    if [ $i -eq 20 ]; then
        echo "❌ 后端启动超时"
        echo "错误日志："
        tail -30 /tmp/backend-dev.log
        exit 1
    fi
    sleep 3
done

# 初始化类目
echo ""
echo "🔧 初始化类目..."
curl -s -X POST http://localhost:3000/api/categories/initialize > /dev/null && echo "✅ 类目初始化完成" || echo "⚠️  类目初始化失败"

echo ""
echo "================================"
echo "🎉 后端服务已启动！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo "   🔌 后端API: http://14.103.87.246:3000/api"
echo ""
echo "📝 后端日志："
echo "   tail -f /tmp/backend-dev.log"
echo ""
echo "🛑 停止服务："
echo "   kill $BACKEND_PID"
echo ""

echo "⏳ 前端服务需要单独启动"
echo "   cd /workspace/projects/stockhub/frontend/domestic && npm run dev"
echo ""
