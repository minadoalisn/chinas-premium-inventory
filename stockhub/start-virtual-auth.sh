#!/bin/bash

echo "🚀 启动后端服务（虚拟认证模式）"
echo "================================"
echo ""

# 清理进程
pkill -f "ts-node.*main" 2>/dev/null || true
sleep 2

cd /workspace/projects/stockhub/backend

echo "📦 启动后端服务..."
export PORT=3000
nohup npx ts-node --transpile-only src/main.ts > /tmp/backend-virtual-auth.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/backend.pid
echo "✅ 后端启动中 (PID: $BACKEND_PID)"

# 等待后端启动
echo "⏳ 等待后端服务启动..."
for i in {1..50}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 后端服务已启动！"
        break
    fi
    
    if [ $i -eq 50 ]; then
        echo "❌ 后端服务启动超时"
        echo "错误日志："
        tail -50 /tmp/backend-virtual-auth.log
        exit 1
    fi
    
    if [ $((i % 10)) -eq 0 ]; then
        echo "   等待中... ($i/50秒)"
    fi
    
    sleep 3
done

# 测试API
echo ""
echo "🧪 测试API连接..."
echo "1. 健康检查"
curl -s http://localhost:3000/ | head -100
echo ""

echo "2. API文档"
curl -s http://localhost:3000/api/docs | head -100
echo ""

echo "3. 类目列表"
curl -s http://localhost:3000/api/categories | head -100
echo ""

echo "4. 类目初始化"
curl -s -X POST http://localhost:3000/api/categories/initialize | head -100
echo ""

echo "================================"
echo "🎉 后端服务状态报告"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo "   🔌 后端API: http://14.103.87.246:3000/api"
echo ""
echo "📝 后端日志："
echo "   tail -f /tmp/backend-virtual-auth.log"
echo ""
echo "🛑 停止服务："
echo "   kill $(cat /tmp/backend.pid)"
echo ""
