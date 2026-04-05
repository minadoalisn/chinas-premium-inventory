#!/bin/bash

# ==========================================
# 香港服务器部署后验证脚本
# ==========================================

SERVER_IP="172.22.249.225"

echo "🔍 香港服务器部署验证"
echo "================================"
echo "服务器: $SERVER_IP"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查函数
check_service() {
  local name=$1
  local command=$2

  echo -n "检查 $name... "

  if ssh root@$SERVER_IP "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 正常${NC}"
    return 0
  else
    echo -e "${RED}✗ 异常${NC}"
    return 1
  fi
}

check_http() {
  local name=$1
  local url=$2

  echo -n "检查 $name... "

  status=$(curl -s -o /dev/null -w "%{http_code}" $url)
  if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓ 正常 (HTTP $status)${NC}"
    return 0
  else
    echo -e "${RED}✗ 异常 (HTTP $status)${NC}"
    return 1
  fi
}

# 1. 检查服务器连接
echo "[1/10] 基础服务检查"
check_service "SSH连接" "echo 'ping'"

# 2. 检查Node.js
check_service "Node.js" "node -v"

# 3. 检查PM2
check_service "PM2" "pm2 list"

# 4. 检查Nginx
check_service "Nginx" "systemctl status nginx --no-pager"

# 5. 检查Redis
check_service "Redis" "systemctl status redis --no-pager"

echo ""
echo "[2/10] 应用服务检查"

# 6. 检查后端API
check_http "后端API" "http://$SERVER_IP:3000/api"

# 7. 检查前端应用
check_http "前端应用" "http://$SERVER_IP"

# 8. 检查API文档
check_http "API文档" "http://$SERVER_IP:3000/api/docs"

echo ""
echo "[3/10] 数据检查"

# 9. 检查数据库
echo -n "检查数据库... "
db_exists=$(ssh root@$SERVER_IP "[ -f /var/www/stockhub/chinas-premium-inventory/backend/data/stockhub.sqlite ] && echo '1' || echo '0'")
if [ "$db_exists" = "1" ]; then
  echo -e "${GREEN}✓ 存在${NC}"
else
  echo -e "${RED}✗ 不存在${NC}"
fi

# 10. 检查PM2进程
echo -n "检查PM2进程... "
pm2_output=$(ssh root@$SERVER_IP "pm2 list | grep stockhub-api")
if [ -n "$pm2_output" ]; then
  echo -e "${GREEN}✓ 运行中${NC}"
  ssh root@$SERVER_IP "pm2 status"
else
  echo -e "${RED}✗ 未运行${NC}"
fi

echo ""
echo "=================================="
echo "验证完成！"
echo ""

# 显示访问信息
echo "访问信息:"
echo "  🌐 前端: http://$SERVER_IP"
echo "  🔌 API: http://$SERVER_IP:3000"
echo "  📚 文档: http://$SERVER_IP:3000/api/docs"
echo ""

# 显示服务器信息
echo "服务器信息:"
ssh root@$SERVER_IP << 'EOF'
echo "  操作系统: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "  主机名: $(hostname)"
echo "  CPU: $(nproc) 核"
echo "  内存: $(free -h | grep Mem | awk '{print $2}')"
echo "  磁盘: $(df -h / | tail -1 | awk '{print $2}' | sed 's/G//G')"
echo ""
echo "服务状态:"
echo "  Nginx: $(systemctl is-active nginx)"
echo "  Redis: $(systemctl is-active redis)"
echo "  防火墙: $(firewall-cmd --state)"
echo ""
EOF

# 提示后续步骤
echo "后续步骤:"
echo "  1. 配置DNS解析（cnsurpr.cn → 公网IP）"
echo "  2. 申请SSL证书"
echo "  3. 测试所有功能"
echo "  4. 配置数据同步（与新加坡）"
echo ""
