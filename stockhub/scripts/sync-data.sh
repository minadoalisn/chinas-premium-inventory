#!/bin/bash

# ==========================================
# 数据同步脚本（香港 ←→ 新加坡）
# ==========================================

# 服务器配置
HK_SERVER="root@14.103.87.246"  # 香港服务器（当前）
SG_SERVER="root@47.236.244.51"  # 新加坡服务器

# 项目路径
PROJECT_DIR="/var/www/stockhub/chinas-premium-inventory"
BACKUP_DIR="/tmp/stockhub-backup"

# 同步间隔（秒）
SYNC_INTERVAL=300  # 5分钟

echo "🔄 StockHub 数据同步服务"
echo "================================"
echo "香港服务器: $HK_SERVER"
echo "新加坡服务器: $SG_SERVER"
echo "同步间隔: $SYNC_INTERVAL 秒"
echo ""

# 创建备份目录
mkdir -p $BACKUP_DIR

# 同步函数
sync_data() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始同步数据..."

  # 1. 同步数据库文件
  echo "  1. 同步数据库..."
  scp $HK_SERVER:$PROJECT_DIR/backend/data/stockhub.sqlite \
     $BACKUP_DIR/stockhub-$(date +%Y%m%d-%H%M%S).sqlite
  scp $BACKUP_DIR/stockhub-$(date +%Y%m%d-%H%M%S).sqlite \
     $SG_SERVER:$PROJECT_DIR/backend/data/stockhub.sqlite

  # 2. 同步OSS图片（如果有）
  echo "  2. 同步图片资源..."
  # scp -r $HK_SERVER:$PROJECT_DIR/backend/uploads/* \
  #    $SG_SERVER:$PROJECT_DIR/backend/uploads/

  # 3. 重启新加坡服务
  echo "  3. 重启新加坡服务..."
  ssh $SG_SERVER "pm2 restart stockhub-api"

  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 同步完成！"
  echo ""
}

# 主循环
echo "开始持续同步..."
echo "按 Ctrl+C 停止"
echo ""

while true; do
  sync_data
  sleep $SYNC_INTERVAL
done
