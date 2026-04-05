#!/bin/bash

echo "🔧 重启后端并初始化数据库"
echo "================================"
echo ""

# 停止所有后端进程
echo "1. 停止现有后端进程..."
pkill -f "ts-node.*main" 2>/dev/null || true
sleep 3

# 删除空数据库
echo "2. 删除旧数据库..."
cd /workspace/projects/stockhub/backend
rm -f data/stockhub.sqlite data/stockhub.sqlite-shm data/stockhub.sqlite-wal
mkdir -p data

# 启动后端
echo "3. 启动后端服务..."
export PORT=3000
nohup npx ts-node --transpile-only src/main.ts > /tmp/backend-restart.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/backend.pid
echo "   PID: $BACKEND_PID"

# 等待启动
echo ""
echo "4. 等待后端启动和数据库初始化..."
sleep 10

# 检查数据库文件
echo ""
echo "5. 检查数据库文件..."
DB_SIZE=$(ls -lh data/stockhub.sqlite 2>/dev/null | awk '{print $5}')
echo "   数据库大小: $DB_SIZE"

if [ "$DB_SIZE" = "0B" ] || [ -z "$DB_SIZE" ]; then
    echo "   ⚠️ 数据库未初始化，等待5秒..."
    sleep 5
    DB_SIZE=$(ls -lh data/stockhub.sqlite 2>/dev/null | awk '{print $5}')
    echo "   数据库大小: $DB_SIZE"
fi

# 检查后端状态
echo ""
echo "6. 检查后端状态..."
if curl -s http://localhost:3000/api > /dev/null 2>&1; then
    echo "   ✅ 后端运行正常"
else
    echo "   ❌ 后端启动失败"
    echo ""
    echo "   错误日志："
    tail -30 /tmp/backend-restart.log
    exit 1
fi

# 初始化类目
echo ""
echo "7. 初始化类目数据..."
curl -s -X POST http://localhost:3000/api/categories/initialize
echo ""

# 测试类目列表
echo ""
echo "8. 测试类目列表..."
curl -s http://localhost:3000/api/categories
echo ""

echo ""
echo "================================"
echo "🎉 后端重启完成"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo "   🔌 后端API: http://14.103.87.246:3000/api"
echo ""
echo "📝 后端日志："
echo "   tail -f /tmp/backend-restart.log"
echo ""
