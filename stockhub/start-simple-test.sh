#!/bin/bash

echo "🚀 StockHub V2.0 - 简化测试启动"
echo "================================"
echo ""

# 杀死可能存在的进程
echo "🛑 清理进程..."
pkill -f "nest" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "http.server" 2>/dev/null || true
sleep 2

# 尝试启动后端
echo "📦 启动后端服务..."
cd /workspace/projects/stockhub/backend

# 检查是否有node_modules
if [ -d "node_modules" ]; then
    echo "✅ node_modules存在"
    
    # 尝试直接运行
    nohup npx nest start:dev > /tmp/backend-test.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/backend.pid
    echo "✅ 后端启动中 (PID: $BACKEND_PID)"
else
    echo "⚠️  node_modules不存在"
fi

# 等待后端启动
echo "⏳ 等待后端..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 后端启动成功！"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ 后端启动超时"
        exit 1
    fi
    sleep 2
done

# 尝试启动前端
echo ""
echo "📦 启动前端服务..."
cd /workspace/projects/stockhub/frontend/domestic

if [ -d "node_modules" ]; then
    echo "✅ node_modules存在"
    
    # 尝试直接运行
    nohup npm run dev > /tmp/frontend-test.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/frontend.pid
    echo "✅ 前端启动中 (PID: $FRONTEND_PID)"
else
    echo "⚠️  node_modules不存在"
fi

# 等待前端启动
echo "⏳ 等待前端..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ 前端启动成功！"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ 前端启动超时"
        exit 1
    fi
    sleep 2
done

echo ""
echo "================================"
echo "🎉 测试环境就绪！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   🌐 前端: http://14.103.87.246:5173"
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo ""
echo "📋 开始测试："
echo "   访问前端进行手动测试"
echo "   查看API文档测试接口"
echo "   运行: bash test-e2e.sh"
echo ""
echo "📝 日志："
echo "   后端: tail -f /tmp/backend-test.log"
echo "   前端: tail -f /tmp/frontend-test.log"
echo ""
echo "🛑 停止服务："
echo "   kill $(cat /tmp/backend.pid) $(cat /tmp/frontend.pid) 2>/dev/null || true"
echo ""

# 初始化类目
echo "🔧 初始化类目数据..."
curl -s -X POST http://localhost:3000/api/categories/initialize > /dev/null && echo "✅ 类目初始化完成" || echo "⚠️  类目初始化失败"

echo ""
echo "✅ 测试环境准备完成！"
