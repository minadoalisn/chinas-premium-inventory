#!/bin/bash

echo "🚀 StockHub V2.0 - 开发模式启动（用于测试）"
echo "================================"
echo ""

# 停止现有进程
echo "🛑 停止现有进程..."
pkill -f "nest start" 2>/dev/null
pkill -f "node.*nest" 2>/dev/null
sleep 2

# 启动后端（开发模式）
echo "📦 启动后端服务（开发模式，端口3000）..."
cd /workspace/projects/stockhub/backend

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules不存在，使用ts-node运行"
    nohup npx ts-node src/main.ts > /tmp/stockhub-backend.log 2>&1 &
    BACKEND_PID=$!
else
    echo "✅ node_modules存在，使用nest start:dev运行"
    nohup npm run start:dev > /tmp/stockhub-backend.log 2>&1 &
    BACKEND_PID=$!
fi

echo $BACKEND_PID > /tmp/stockhub-backend.pid
echo "✅ 后端服务启动中... PID: $BACKEND_PID"
echo ""

# 等待后端启动
echo "⏳ 等待后端服务启动..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 后端服务已启动！"
        break
    fi
    
    # 检查后端日志
    if [ $((i % 10)) ]; then
        echo "   等待中... ($i/60秒)"
    fi
    
    sleep 1
done

if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ 后端服务启动失败"
    echo "错误日志："
    tail -50 /tmp/stockhub-backend.log
    exit 1
fi

echo ""

# 启动前端（开发模式）
echo "📦 启动前端服务（开发模式，端口5173）..."
cd /workspace/projects/stockhub/frontend/domestic

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules不存在，使用vite运行"
    cd ..
    nohup npx vite frontend/domestic --host 0.0.0.0 --port 5173 > /tmp/stockhub-frontend.log 2>&1 &
    FRONTEND_PID=$!
else
    echo "✅ node_modules存在，使用npm run dev运行"
    cd frontend/domestic
    nohup npm run dev -- --host 0.0.0.0 --port 5173 > /tmp/stockhub-frontend.log 2>&1 &
    FRONTEND_PID=$!
fi

echo $FRONTEND_PID > /tmp/stockhub-frontend.pid
echo "✅ 前端服务启动中... PID: $FRONTEND_PID"
echo ""

# 等待前端启动
echo "⏳ 等待前端服务启动..."
for i in {1..60}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ 前端服务已启动！"
        break
    fi
    
    # 检查前端日志
    if [ $((i % 10)) ]; then
        echo "   等待中... ($i/60秒)"
    fi
    
    sleep 1
done

if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "❌ 前端服务启动失败"
    echo "错误日志："
    tail -50 /tmp/stockhub-frontend.log
    exit 1
fi

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
echo "   后端PID: $(cat /tmp/stockhub-backend.pid)"
echo "   前端PID: $(cat /tmp/stockhub-frontend.pid)"
echo ""
echo "📝 日志文件："
echo "   后端: tail -f /tmp/stockhub-backend.log"
echo "   前端: tail -f /tmp/stockhub-frontend.log"
echo ""
echo "🛑 停止服务："
echo "   kill $(cat /tmp/stockhub-backend.pid) $(cat /tmp/stockhub-frontend.pid)"
echo ""
echo "✅ 开始测试吧！使用 ./test-e2e.sh 进行自动化测试"
echo ""
echo "📝 测试清单："
echo "   查看 docs/MANUAL_TEST_CHECKLIST.md"
echo ""
