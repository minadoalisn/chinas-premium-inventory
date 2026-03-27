#!/bin/bash

echo "🔍 StockHub 服务状态检查"
echo "================================"
echo ""

PUBLIC_IP=$(curl -s ifconfig.me)
echo "🖥️  公网IP: $PUBLIC_IP"
echo ""

# 检查端口
echo "📡 检查端口状态..."
if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "✅ 后端端口 3000 正在监听"
else
    echo "❌ 后端端口 3000 未监听"
fi

if netstat -tlnp 2>/dev/null | grep -q ":5173 "; then
    echo "✅ 前端端口 5173 正在监听"
else
    echo "❌ 前端端口 5173 未监听"
fi

if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
    echo "✅ HTTP端口 80 正在监听"
else
    echo "❌ HTTP端口 80 未监听"
fi

echo ""

# 检查进程
echo "🔄 检查进程状态..."
if ps aux | grep -q "[n]est start"; then
    BACKEND_PID=$(ps aux | grep "[n]est start" | awk '{print $2}')
    echo "✅ 后端进程运行中 (PID: $BACKEND_PID)"
else
    echo "❌ 后端进程未运行"
fi

if ps aux | grep -q "[h]ttp.server"; then
    FRONTEND_PID=$(ps aux | grep "[h]ttp.server" | awk '{print $2}')
    echo "✅ 前端进程运行中 (PID: $FRONTEND_PID)"
else
    echo "❌ 前端进程未运行"
fi

if ps aux | grep -q "[d]ocker.*stockhub"; then
    echo "✅ Docker容器运行中"
else
    echo "❌ Docker容器未运行"
fi

echo ""

# 测试访问
echo "🌐 测试访问..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 后端API可访问"
else
    echo "❌ 后端API不可访问"
fi

if curl -s http://localhost:3000/api/docs > /dev/null 2>&1; then
    echo "✅ API文档可访问"
else
    echo "❌ API文档不可访问"
fi

if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ 前端应用可访问"
else
    echo "❌ 前端应用不可访问"
fi

echo ""

echo "================================"
echo "📍 访问地址"
echo "================================"
echo "   🌐 前端: http://$PUBLIC_IP:5173"
echo "   📚 API文档: http://$PUBLIC_IP:3000/api/docs"
echo "   🔌 后端API: http://$PUBLIC_IP:3000"
echo ""

echo "📝 日志位置："
echo "   后端: /tmp/stockhub-backend.log"
echo "   前端: /tmp/stockhub-frontend.log"
echo ""

echo "🔥 检查防火墙："
echo "   Ubuntu: sudo ufw status"
echo "   CentOS: sudo firewall-cmd --list-ports"
