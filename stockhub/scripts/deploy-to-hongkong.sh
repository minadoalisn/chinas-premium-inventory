#!/bin/bash

# ==========================================
# 一键部署脚本（本地 → 香港服务器）
# ==========================================

SERVER_IP="172.22.249.225"
SERVER_USER="root"
LOCAL_SCRIPT_DIR="/workspace/projects/stockhub/scripts"
REMOTE_SCRIPT_DIR="~/stockhub-scripts"

echo "🚀 一键部署StockHub到香港服务器..."
echo "服务器: $SERVER_IP"
echo ""

# 检查SSH连接
echo "检查SSH连接..."
if ! ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP echo "连接成功"; then
  echo "❌ 无法连接到服务器，请检查:"
  echo "  1. 服务器IP是否正确"
  echo "  2. 网络是否在同一VPC内"
  echo "  3. SSH端口22是否开放"
  exit 1
fi
echo "✅ SSH连接成功"
echo ""

# 创建远程脚本目录
echo "创建远程脚本目录..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_SCRIPT_DIR"

# 上传脚本
echo "上传配置脚本..."
scp $LOCAL_SCRIPT_DIR/setup-hongkong.sh $SERVER_USER@$SERVER_IP:$REMOTE_SCRIPT_DIR/
scp $LOCAL_SCRIPT_DIR/deploy-hongkong.sh $SERVER_USER@$SERVER_IP:$REMOTE_SCRIPT_DIR/

# 执行配置脚本
echo "执行服务器配置..."
ssh $SERVER_USER@$SERVER_IP "chmod +x $REMOTE_SCRIPT_DIR/setup-hongkong.sh && $REMOTE_SCRIPT_DIR/setup-hongkong.sh"

# 执行部署脚本
echo "部署应用..."
ssh $SERVER_USER@$SERVER_IP "chmod +x $REMOTE_SCRIPT_DIR/deploy-hongkong.sh && $REMOTE_SCRIPT_DIR/deploy-hongkong.sh"

# 显示部署结果
echo ""
echo "=================================="
echo "✅ 部署完成！"
echo "=================================="
echo ""
echo "访问地址:"
echo "  🌐 前端: http://$SERVER_IP"
echo "  🔌 API: http://$SERVER_IP:3000"
echo "  📚 文档: http://$SERVER_IP:3000/api/docs"
echo ""
echo "PM2状态:"
ssh $SERVER_USER@$SERVER_IP "pm2 status"
echo ""
