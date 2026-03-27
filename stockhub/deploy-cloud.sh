#!/bin/bash

echo "🚀 StockHub 云端部署脚本"
echo "================================"
echo ""

# 获取服务器IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "🖥️  服务器IP: $SERVER_IP"
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，正在安装..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    echo "✅ Docker安装完成"
else
    echo "✅ Docker已安装"
fi

# 检查Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，正在安装..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose安装完成"
else
    echo "✅ Docker Compose已安装"
fi

echo ""
echo "📦 构建Docker镜像..."
cd /workspace/projects/stockhub

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down 2>/dev/null

# 构建镜像
echo "🔨 构建镜像..."
docker-compose build

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

echo ""
echo "================================"
echo "🎉 部署完成！"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   🌐 前端应用: http://$SERVER_IP"
echo "   📚 API文档: http://$SERVER_IP/api/docs"
echo "   🔌 后端API: http://$SERVER_IP/api"
echo ""
echo "🔥 检查防火墙设置："
echo "   如果无法访问，请开放80端口："
echo "   sudo ufw allow 80"
echo "   或"
echo "   sudo firewall-cmd --add-port=80/tcp --permanent"
echo "   sudo firewall-cmd --reload"
echo ""
echo "📋 查看日志："
echo "   docker-compose logs -f"
echo ""
echo "🛑 停止服务："
echo "   docker-compose down"
echo ""
echo "✅ 开始使用吧！"
