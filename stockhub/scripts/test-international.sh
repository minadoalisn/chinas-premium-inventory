#!/bin/bash
# StockHub International端测试脚本

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} - $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} - $2"
        ((FAILED++))
    fi
}

BASE_URL="https://cnsurpr.com"
API_URL="https://cnsurpr.cn/api"

echo "=========================================="
echo " StockHub 国际端全面测试"
echo " $(date)"
echo "=========================================="

echo ""
echo "1️⃣ 页面可访问性测试"
echo "-------------------------------------------"

curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" | grep -q "200" && test_result 0 "首页" || test_result 1 "首页"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/product.html" | grep -q "200" && test_result 0 "商品详情页" || test_result 1 "商品详情页"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/cart.html" | grep -q "200" && test_result 0 "购物车" || test_result 1 "购物车"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/checkout.html" | grep -q "200" && test_result 0 "结账页" || test_result 1 "结账页"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login.html" | grep -q "200" && test_result 0 "登录页" || test_result 1 "登录页"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/register.html" | grep -q "200" && test_result 0 "注册页" || test_result 1 "注册页"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/orders.html" | grep -q "200" && test_result 0 "订单页" || test_result 1 "订单页"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/payment/success.html" | grep -q "200" && test_result 0 "支付成功" || test_result 1 "支付成功"

echo ""
echo "2️⃣ API接口测试"
echo "-------------------------------------------"

curl -s "$API_URL/products" | grep -q "id" && test_result 0 "商品API" || test_result 1 "商品API"
curl -s "$API_URL/categories" | grep -q "name" && test_result 0 "品类API" || test_result 1 "品类API"

echo ""
echo "3️⃣ 响应时间测试"
echo "-------------------------------------------"

TIME=$(curl -o /dev/null -s -w '%{time_total}' "$BASE_URL/")
echo "首页: ${TIME}s (目标<2s)"
echo "$TIME < 2.0" | bc -l | grep -q 1 && test_result 0 "响应时间" || test_result 1 "响应时间"

echo ""
echo "=========================================="
echo "📊 结果: 通过=$PASSED 失败=$FAILED"
echo "=========================================="
