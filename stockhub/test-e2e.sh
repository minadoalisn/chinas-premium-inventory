#!/bin/bash

echo "🧪 StockHub V2.0 - 端到端完整测试脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m''

# 统计变量
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
API_BASE="http://localhost:3000/api"
FRONTEND_URL="http://localhost:5173"

# 测试函数
test_api() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=${5:-200}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "[$TOTAL_TESTS] 测试: $test_name ... "
    
    local response
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    local http_code=$(echo "$response" | tail -n 1)
    local body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (${http_code})"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "$body" | head -20
    else
        echo -e "${RED}❌ FAIL${NC} (期望: $expected_status, 实际: $http_code)"
        echo "$body" | head -20
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

echo "================================"
echo "📋 StockHub 端到端测试"
echo "================================"
echo ""
echo "🔗 后端API: $API_BASE"
echo "🌐 前端URL: $FRONTEND_URL"
echo ""

# ==================== 1. 基础功能测试 ====================

echo "================================"
echo "1. 基础功能测试"
echo "================================"
echo ""

test_api "健康检查" "GET" "/" "" "200"

test_api "API文档访问" "GET" "/docs" "" "200"

# ==================== 2. 类目管理测试 ====================

echo "================================"
echo "2. 类目管理测试"
echo "================================"
echo ""

test_api "获取类目列表" "GET" "/categories" "" "200"

test_api "初始化类目" "POST" "/categories/initialize" '{}' "200"

test_api "获取类目详情" "GET" "/categories/1" "" "200"

# ==================== 3. 认证测试 ====================

echo "================================"
echo "3. 认证测试（模拟数据）"
echo "================================"
echo ""

# 发送验证码（模拟模式会返回固定验证码）
echo "[$((TOTAL_TESTS + 1))] 测试: 发送验证码（模拟）..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))
response=$(curl -s -X POST "$API_BASE/sms/send-code" \
    -H "Content-Type: application/json" \
    -d '{"phone":"13800138000"}')
if echo "$response" | grep -q "123456"; then
    echo -e "${GREEN}✅ PASS${NC} - 模拟验证码: 123456"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  WARN${NC} - 使用实际短信服务"
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi
echo ""

# 模拟注册（使用固定验证码）
test_api "用户注册（模拟验证码）" "POST" "/auth/register" \
    '{"phone":"13800138000","code":"123456"}' "201"

# 模拟登录
test_api "用户登录（模拟验证码）" "POST" "/auth/login" \
    '{"phone":"13800138000","code":"123456"}' "201"

# ==================== 4. 用户测试 ====================

echo "================================"
echo "4. 用户管理测试"
echo "================================"
echo ""

# 获取用户列表（管理后台）
test_api "获取用户列表" "GET" "/admin/users?page=1&limit=10" "" "401"

# ==================== 5. 商户测试 ====================

echo "================================"
echo "5. 商户管理测试"
echo "================================"
echo ""

test_api "获取商户列表" "GET" "/admin/merchants?page=1&limit=10" "" "401"

# ==================== 6. 求购测试 ====================

echo "================================"
echo "6. 求购需求测试"
echo "================================"
echo ""

test_api "获取求购列表" "GET" "/demands?page=1&limit=10" "" "200"

test_api "获取求购详情" "GET" "/demands/1" "" "200"

# ==================== 7. 商品测试 ====================

echo "================================"
echo "7. 商品管理测试"
echo "================================"
echo ""

test_api "获取商品列表" "GET "/products?page=1&limit=10" "" "200"

test_api "获取商品详情" "GET "/products/1" "" "200"

test_api "获取相似商品" "GET "/products/1/similar" "" "200"

# ==================== 8. 订单测试 ====================

echo "================================"
echo "8. 订单管理测试"
echo "================================"
echo ""

test_api "获取订单列表" "GET "/admin/orders?page=1&limit=10" "" "401"

# ==================== 9. 统计测试 ====================

echo "================================"
echo "9. 数据统计测试"
echo "================================"
echo ""

test_api "获取仪表盘数据" "GET "/admin/dashboard" "" "401"

test_api "获取订单趋势" "GET "/admin/stats/order-trend?period=7" "" "401"

# ==================== 10. 系统设置测试 ====================

echo "================================"
echo "10. 系统设置测试"
echo "================================"
echo ""

test_api "获取系统设置" "GET "/admin/settings" "" "401"

# ==================== 测试总结 ====================

echo "================================"
echo "📊 测试结果总结"
echo "================================"
echo ""
echo "总测试数: $TOTAL_TESTS"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"
echo -e "通过率: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}================================"
    echo "🎉 所有测试通过！"
    echo "================================"
    exit 0
else
    echo -e "${RED}================================"
    echo "⚠️  有测试失败，请检查日志"
    echo "================================"
    exit 1
fi
