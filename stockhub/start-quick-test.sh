#!/bin/bash

echo "🚀 StockHub - 快速启动测试服务"
echo "================================"
echo ""

# 检查后端
echo "📦 启动后端服务..."
cd /workspace/projects/stockhub/backend

if [ ! -f "dist/main.js" ]; then
    echo "⚠️  后端未构建，正在构建..."
    npm run build > /tmp/backend-build-quick.log 2>&1
fi

# 启动后端
if pgrep -f "node.*dist/main.js" > /dev/null; then
    echo "✅ 后端已运行 (PID: $(pgrep -f 'node.*dist/main.js' | head -1))"
else
    echo "🔧 启动后端服务..."
    nohup node dist/main.js > /tmp/stockhub-backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/stockhub-backend.pid
    echo "✅ 后端启动中... PID: $BACKEND_PID"
fi

# 等待后端启动
for i in {1..15}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 后端服务已启动"
        break
    fi
    sleep 2
done

echo ""
echo "📦 启动前端服务..."
cd /workspace/projects/stockhub/frontend/domestic

if [ ! -d "dist" ]; then
    echo "⚠️  前端未构建，正在构建..."
    npm run build > /tmp/frontend-build-quick.log 2>&1
fi

# 启动前端
if pgrep -f "python.*http.server.*5173" > /dev/null; then
    echo "✅ 前端已运行 (PID: $(pgrep -f 'python.*http.server.*5173' | head -1))"
else
    echo "🔧 启动前端服务..."
    cd dist
    nohup python3 -m http.server 5173 > /tmp/stockhub-frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/stockhub-frontend.pid
    echo "✅ 前端启动中... PID: $FRONTEND_PID"
    cd ..
fi

# 等待前端启动
for i in {1..15}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ 前端服务已启动"
        break
    fi
    sleep 2
done

echo ""
echo "================================"
echo "🎉 服务启动完成！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   🌐 前端应用: http://14.103.87.246:5173"
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo ""
echo "📋 进程信息："
echo "   后端PID: $(cat /tmp/stockhub-backend.pid 2>/dev/null || echo 'N/A')"
echo "   前端PID: $(cat /tmp/stockhub-frontend.pid 2>/dev/null || echo 'N/A')"
echo ""
echo "📝 日志文件："
echo "   后端: tail -f /tmp/stockhub-backend.log"
echo "   前端: tail -f /tmp/stockhub-frontend.log"
echo ""
echo "🛑 停止服务："
echo "   kill \$(cat /tmp/stockhub-backend.pid 2>/dev/null) \$(cat /tmp/stockhub-frontend.pid 2>/dev/null)"
echo ""
echo "✅ 开始手动测试吧！"
