#!/bin/bash

echo "🚀 StockHub 部署脚本"

# 停止并删除旧容器
echo "停止旧容器..."
docker-compose down

# 构建新镜像
echo "构建镜像..."
docker-compose build

# 启动服务
echo "启动服务..."
docker-compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 10

# 检查服务状态
echo "检查服务状态..."
docker-compose ps

# 查看日志
echo "查看日志..."
docker-compose logs --tail=50

echo "✅ 部署完成！"
echo "前端: http://localhost"
echo "后端API: http://localhost:3000"
echo "API文档: http://localhost:3000/api/docs"
