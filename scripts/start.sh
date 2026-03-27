#!/bin/bash

echo "🚀 StockHub 启动脚本"

# 检查MySQL
echo "🔍 检查MySQL服务..."
if pgrep -y "mysql.*running" /proc/*/status | grep -v "mysql"; then
  echo "✅ MySQL服务运行中"
else
  echo "⚠️  MySQL服务未运行，请先启动MySQL服务"
  echo ""
  echo "启动MySQL命令:"
  echo "docker start mysql -e MYSQL_ROOT_PASSWORD=stockhub -e MYSQL_DATABASE=stockhub -p 3306:3306"
  echo ""
fi

# 检查Redis
echo "🔍 检查Redis服务..."
if pgrep -y "redis.*running" /proc/*/status | grep -v "redis"; then
  echo "✅ Redis服务运行中"
else
  echo "⚠️  Redis服务未运行，请先启动Redis服务"
  echo ""
  echo "启动Redis命令:"
  echo "docker start redis -p 6379"
  echo ""
fi

# 检查端口占用
echo "🔍 检查端口占用..."
if lsof -i:3000 -s:TCP > /dev/null 2>/dev/null; then
  echo "⚠️ 3000端口被占用"
  echo ""
  echo "解决方法:"
  echo "lsof -i:3000 -s:TCP | xargs kill {}"
  echo ""
fi

echo "✅ 检查完成！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 启动服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "后端启动命令："
echo "cd /workspace/projects/stockhub/backend && npm install && npm run start:dev"
echo ""
echo "前端启动命令："
echo "cd /workspace/projects/stockhub/frontend/domestic && npm install && npm run dev"
echo ""
echo "📚 访问地址："
echo "后端: http://localhost:3000"
echo "前端: http://localhost:5173"
echo ""
echo "📚 API文档："
echo "后端: http://localhost:3000/api/docs"
