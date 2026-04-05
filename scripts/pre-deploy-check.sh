#!/bin/bash
# StockHub部署检查清单
# 每次部署前必须检查

set -e

echo "📋 StockHub部署检查清单"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查项
checks=0
passed=0

check() {
    local name=$1
    local command=$2

    echo -n "[$((checks+1))] $name... "

    checks=$((checks + 1))

    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 通过${NC}"
        passed=$((passed + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        return 1
    fi
}

# 前置检查
echo "🔍 前置检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "SSH密钥存在" "test -f /root/.ssh/stockhub_hongkong"
check "SSH密钥存在" "test -f /root/.ssh/stockhub_singapore"
check "防火墙运行中" "systemctl is-active firewalld"
check "网络连接正常" "ping -c 1 8.210.194.187"
check "网络连接正常" "ping -c 1 47.236.244.51"

echo ""
echo "🔍 香港服务器检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "80端口已开放" "ssh -i /root/.ssh/stockhub_hongkong -o StrictHostKeyChecking=no root@8.210.194.187 'firewall-cmd --list-ports | grep 80/tcp'"
check "443端口已开放" "ssh -i /root/.ssh/stockhub_hongkong -o StrictHostKeyChecking=no root@8.210.194.187 'firewall-cmd --list-ports | grep 443/tcp'"
check "3000端口已开放" "ssh -i /root/.ssh/stockhub_hongkong -o StrictHostKeyChecking=no root@8.210.194.187 'firewall-cmd --list-ports | grep 3000/tcp'"
check "后端服务运行中" "ssh -i /root/.ssh/stockhub_hongkong -o StrictHostKeyChecking=no root@8.210.194.187 'netstat -tlnp | grep :3000'"
check "Nginx运行中" "ssh -i /root/.ssh/stockhub_hongkong -o StrictHostKeyChecking=no root@8.210.194.187 'systemctl is-active nginx'"
check "前端目录存在" "ssh -i /root/.ssh/stockhub_hongkong -o StrictHostKeyChecking=no root@8.210.194.187 'test -d /var/www/stockhub/frontend/dist'"
check "后端目录存在" "ssh -i /root/.ssh/stockhub_hongkong -o StrictHostKeyChecking=no root@8.210.194.187 'test -d /var/www/stockhub/backend'"

echo ""
echo "🔍 新加坡服务器检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "80端口已开放" "ssh -i /root/.ssh/stockhub_singapore -o StrictHostKeyChecking=no root@47.236.244.51 'firewall-cmd --list-ports | grep 80/tcp'"
check "443端口已开放" "ssh -i /root/.ssh/stockhub_singapore -o StrictHostKeyChecking=no root@47.236.244.51 'firewall-cmd --list-ports | grep 443/tcp'"
check "Nginx运行中" "ssh -i /root/.ssh/stockhub_singapore -o StrictHostKeyChecking=no root@47.236.244.51 'systemctl is-active nginx'"
check "前端目录存在" "ssh -i /root/.ssh/stockhub_singapore -o StrictHostKeyChecking=no root@47.236.244.51 'test -d /var/www/stockhub/frontend/dist'"

echo ""
echo "🔍 API检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "品类API正常" "curl -s http://8.210.194.187/api/categories | grep -q 'id'"
check "商品API正常" "curl -s http://8.210.194.187/api/products | grep -q 'id'"
check "验证码API正常" "curl -s 'http://8.210.194.187/api/captcha/generate?id=test' | grep -q 'svg'"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $passed -eq $checks ]; then
    echo -e "${GREEN}✅ 所有检查通过 ($passed/$checks)，可以开始部署！${NC}"
    exit 0
else
    echo -e "${RED}❌ 检查未通过 ($passed/$checks)，请先修复问题${NC}"
    exit 1
fi
