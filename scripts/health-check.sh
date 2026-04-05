#!/bin/bash
# StockHub服务器健康检查脚本
# 检查：端口开放、服务运行、防火墙状态
# 每日自动执行，发现异常立即修复

set -e

echo "🔍 StockHub服务器健康检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 问题计数
ISSUES=0

# 检查函数
check_port() {
    local port=$1
    local service_name=$2

    echo -n "检查 $service_name (端口 $port)... "

    if firewall-cmd --list-ports 2>/dev/null | grep -q "${port}/tcp"; then
        echo -e "${GREEN}✅ 已开放${NC}"
        return 0
    else
        echo -e "${RED}❌ 未开放${NC}"
        ISSUES=$((ISSUES + 1))

        # 自动修复
        echo -e "${YELLOW}正在修复...${NC}"
        firewall-cmd --permanent --add-port=${port}/tcp >/dev/null 2>&1
        firewall-cmd --reload >/dev/null 2>&1

        if firewall-cmd --list-ports 2>/dev/null | grep -q "${port}/tcp"; then
            echo -e "${GREEN}✅ 修复成功${NC}"
        else
            echo -e "${RED}❌ 修复失败${NC}"
        fi
        return 1
    fi
}

check_service() {
    local port=$1
    local service_name=$2
    local process_name=$3

    echo -n "检查 $service_name 服务... "

    if netstat -tlnp 2>/dev/null | grep -q ":${port}.*LISTEN"; then
        PID=$(netstat -tlnp 2>/dev/null | grep ":${port}.*LISTEN" | awk '{print $7}' | cut -d'/' -f1)
        echo -e "${GREEN}✅ 运行中 (PID: ${PID})${NC}"
        return 0
    else
        echo -e "${RED}❌ 未运行${NC}"
        ISSUES=$((ISSUES + 1))

        # 尝试重启服务
        if [ -n "$process_name" ]; then
            echo -e "${YELLOW}尝试重启 ${process_name}...${NC}"
            pkill -f "$process_name" 2>/dev/null || true

            if [ "$process_name" = "node.*server.js" ]; then
                cd /var/www/stockhub && nohup node server.js >/tmp/backend.log 2>&1 &
            elif [ "$process_name" = "nginx" ]; then
                systemctl restart nginx 2>/dev/null || /usr/sbin/nginx -s reload 2>/dev/null
            fi

            sleep 2

            if netstat -tlnp 2>/dev/null | grep -q ":${port}.*LISTEN"; then
                echo -e "${GREEN}✅ 重启成功${NC}"
            else
                echo -e "${RED}❌ 重启失败${NC}"
            fi
        fi
        return 1
    fi
}

check_firewall() {
    echo -n "检查防火墙状态... "

    if systemctl is-active --quiet firewalld; then
        echo -e "${GREEN}✅ 运行中${NC}"
        return 0
    else
        echo -e "${RED}❌ 未运行${NC}"
        ISSUES=$((ISSUES + 1))

        # 启动防火墙
        systemctl start firewalld 2>/dev/null
        sleep 1

        if systemctl is-active --quiet firewalld; then
            echo -e "${GREEN}✅ 已启动${NC}"
        else
            echo -e "${RED}❌ 启动失败${NC}"
        fi
        return 1
    fi
}

check_nginx() {
    echo -n "检查 Nginx 配置... "

    if nginx -t 2>/dev/null; then
        echo -e "${GREEN}✅ 配置正确${NC}"
        return 0
    else
        echo -e "${RED}❌ 配置错误${NC}"
        ISSUES=$((ISSUES + 1))
        return 1
    fi
}

check_disk() {
    echo -n "检查磁盘空间... "

    USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ "$USAGE" -lt 80 ]; then
        echo -e "${GREEN}✅ 使用率 ${USAGE}%${NC}"
        return 0
    else
        echo -e "${RED}❌ 使用率 ${USAGE}% (超过80%)${NC}"
        ISSUES=$((ISSUES + 1))
        return 1
    fi
}

# 香港服务器检查
echo "📍 香港服务器 (8.210.194.187)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_firewall
check_port 80 "HTTP"
check_port 443 "HTTPS"
check_port 3000 "后端API"
check_service 3000 "后端API" "node.*server.js"
check_nginx
check_disk

echo ""

# 新加坡服务器检查（如果可以连接）
if ping -c 1 -W 2 47.236.244.51 >/dev/null 2>&1; then
    echo "📍 新加坡服务器 (47.236.244.51)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_firewall
    check_port 80 "HTTP"
    check_port 443 "HTTPS"
    check_service 80 "Nginx" "nginx"
    check_nginx
    check_disk
else
    echo "📍 新加坡服务器 (47.236.244.51)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}⚠️  无法连接${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ 所有检查通过，服务器运行正常！${NC}"
    exit 0
else
    echo -e "${RED}❌ 发现 ${ISSUES} 个问题，部分已自动修复${NC}"

    # 发送通知（如果配置了）
    # curl -X POST "$WEBHOOK_URL" -d "message=StockHub健康检查：发现${ISSUES}个问题" 2>/dev/null

    exit 1
fi
