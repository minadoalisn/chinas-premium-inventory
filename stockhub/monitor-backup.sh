#!/bin/bash

# StockHub 监控和备份脚本
# 用于两台服务器的系统监控和数据备份

set -e

# 配置
BACKUP_DIR="/var/www/stockhub/backups"
LOG_DIR="/var/log/stockhub"
DB_FILE="/var/www/stockhub/backend/data/stockhub.sqlite"
NGINX_LOG="/var/log/nginx/access.log"
BACKUP_FILE="stockhub_$(date +%Y%m%d_%H%M%S).sqlite"
KEEP_DAYS=7

echo "======================================="
echo "  StockHub 监控和备份"
echo "======================================="
echo ""

# 1. 创建备份目录
echo "[1/5] 检查备份目录..."
mkdir -p $BACKUP_DIR
echo "✓ 备份目录: $BACKUP_DIR"

# 2. 数据库备份
echo ""
echo "[2/5] 备份数据库..."
if [ -f "$DB_FILE" ]; then
    cp $DB_FILE "$BACKUP_DIR/$BACKUP_FILE"
    echo "✓ 数据库已备份: $BACKUP_DIR/$BACKUP_FILE"
    
    # 压缩备份
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo "✓ 备份已压缩: $BACKUP_DIR/${BACKUP_FILE}.gz"
else
    echo "✗ 数据库文件不存在: $DB_FILE"
fi

# 3. 清理旧备份
echo ""
echo "[3/5] 清理旧备份（保留最近7天）..."
find $BACKUP_DIR -name "stockhub_*.sqlite.gz" -type f -mtime +$KEEP_DAYS -delete 2>/dev/null || echo "✓ 无需清理旧备份"

# 4. 系统状态检查
echo ""
echo "[4/5] 系统状态检查..."

# CPU使用率
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "✓ CPU使用率: ${CPU_USAGE}%"

# 内存使用
MEM_USAGE=$(free | grep Mem | awk '{printf "%.1f%%\n", ($3/$2) * 100}')
echo "✓ 内存使用率: ${MEM_USAGE}%"

# 磁盘使用
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}')
echo "✓ 磁盘使用率: $DISK_USAGE"

# 服务状态
echo ""
echo "服务状态:"
echo "  - 后端: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/categories)"
echo "  - Nginx: $(systemctl is-active nginx && echo '运行中' || echo '已停止')"

# 5. 日志检查
echo ""
echo "[5/5] 检查错误日志..."
ERROR_COUNT=$(tail -1000 /var/log/nginx/error.log 2>/dev/null | grep -c "error" || echo "0")
echo "✓ Nginx错误日志: 过去1000行中有 $ERROR_COUNT 个错误"

ERROR_COUNT=$(tail -1000 /var/www/stockhub/backend/logs/backend.log 2>/dev/null | grep -c -i "error\|fail\|exception" || echo "0")
echo "✓ 后端错误日志: 过去1000行中有 $ERROR_COUNT 个错误"

# 6. 生成报告
echo ""
echo "======================================="
echo "  监控报告完成"
echo "======================================="
echo "时间: $(date)"
echo "服务器: $(hostname)"
echo "备份位置: $BACKUP_DIR"
echo "======================================="

# 保存监控数据
echo "$(date),$CPU_USAGE,$MEM_USAGE,$DISK_USAGE,$ERROR_COUNT" >> /var/www/stockhub/monitoring.log

echo ""
echo "✅ 监控和备份完成！"
