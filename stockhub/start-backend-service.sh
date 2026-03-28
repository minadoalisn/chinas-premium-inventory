#!/bin/bash

echo "🚀 StockHub V2.0 - 启动后端服务"
echo "================================"
echo ""

# 清理现有进程
echo "🛑 清理现有进程..."
pkill -f "nest" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
pkill -f "node.*main" 2>/dev/null || true
sleep 2

cd /workspace/projects/stockhub/backend

echo "📦 启动后端服务（开发模式）..."
# 使用ts-node直接启动
nohup npx ts-node src/main.ts > /tmp/stockhub-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端启动中 (PID: $BACKEND_PID)"
echo $BACKEND_PID > /tmp/stockhub-backend.pid

# 等待后端启动
echo "⏳ 等待后端服务启动..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 后端服务已启动！"
        break
    fi
    
    # 显示进度
    if [ $((i % 5)) -eq 0 ]; then
        echo "   等待中... ($i/30秒)"
        
        # 检查日志
        if [ -f /tmp/stockhub-backend.log ]; then
            LATEST_LOG=$(tail -3 /tmp/stockhub-backend.log)
            echo "   最新日志:"
            echo "$LATEST_LOG" | sed 's/^/      /'
        fi
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ 后端服务启动超时"
        echo "错误日志："
        tail -50 /tmp/stockhub-backend.log
        exit 1
    fi
    
    sleep 2
done

# 初始化类目
echo ""
echo "🔧 初始化类目数据..."
curl -s -X POST http://localhost:3000/api/categories/initialize > /tmp/init-categories.log 2>&1
if cat /tmp/init-categories.log | grep -q "success\|already"; then
    echo "✅ 类目初始化完成"
else
    echo "⚠️  类目初始化可能失败"
    cat /tmp/init-categories.log
fi

echo ""
echo "================================"
echo "🎉 后端服务启动成功！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo "   🔌 后端API: http://14.103.87.246:3000/api"
echo ""
echo "📝 后端日志："
echo "   tail -f /tmp/stockhub-backend.log"
echo ""
echo "🛑 停止服务："
echo "   kill $(cat /tmp/stockhub-backend.pid)"
echo ""

# 测试API
echo "🧪 测试API连接..."
curl -s http://localhost:3000 > /tmp/health-check.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 健康检查通过"
else
    echo "⚠️  健康检查失败"
fi
echo ""
