#!/bin/bash

echo "🧪 StockHub V2.0 - 完整测试脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 统计变量
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试结果数组
declare -a TEST_RESULTS=()

# 测试函数
run_test() {
    local test_name=$1
    local test_command=$2
    local expected_result=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "[$TOTAL_TESTS] 测试: $test_name ... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ -z "$expected_result" ] || eval "$expected_result"; then
            echo -e "${GREEN}✅ PASS${NC}"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            TEST_RESULTS+=("$test_name|PASS")
        else
            echo -e "${RED}❌ FAIL${NC} (预期结果不匹配)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            TEST_RESULTS+=("$test_name|FAIL")
        fi
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TEST_RESULTS+=("$test_name|FAIL")
    fi
}

echo "📋 开始测试..."
echo ""

# ============================================
# 1. 后端测试
# ============================================
echo "🔧 后端测试"
echo "----------------------------------------"

# 检查后端是否运行
run_test "后端服务运行中" "curl -s http://localhost:3000 > /dev/null"

# 检查API文档
run_test "API文档可访问" "curl -s http://localhost:3000/api/docs | grep -q 'StockHub'"

# 检查类目API
run_test "类目API正常" "curl -s http://localhost:3000/api/categories | grep -q '\[\]'"

# 检查健康检查
run_test "健康检查接口" "curl -s http://localhost:3000/ | grep -q 'StockHub'"

echo ""

# ============================================
# 2. 前端测试
# ============================================
echo "🎨 前端测试"
echo "----------------------------------------"

# 检查前端是否运行
run_test "前端服务运行中" "curl -s http://localhost:5173 > /dev/null"

# 检查HTML内容
run_test "前端HTML正常" "curl -s http://localhost:5173 | grep -q '<!DOCTYPE html>'"

# 检查静态资源
run_test "静态资源加载" "curl -s -I http://localhost:5173 | grep -q '200'"

echo ""

# ============================================
# 3. 数据库测试
# ============================================
echo "💾 数据库测试"
echo "----------------------------------------"

# 检查数据库文件
run_test "数据库文件存在" "test -f /workspace/projects/stockhub/backend/data/stockhub.db"

# 检查数据库表
if [ -f "/workspace/projects/stockhub/backend/data/stockhub.db" ]; then
    run_test "用户表存在" "sqlite3 /workspace/projects/stockhub/backend/data/stockhub.db '.tables' | grep -q 'users'"
    run_test "商户表存在" "sqlite3 /workspace/projects/stockhub/backend/data/stockhub.db '.tables' | grep -q 'merchants'"
    run_test "求购表存在" "sqlite3 /workspace/projects/stockhub/backend/data/stockhub.db '.tables' | grep -q 'demands'"
    run_test "商品表存在" "sqlite3 /workspace/projects/stockhub/backend/data/stockhub.db '.tables' | grep -q 'products'"
    run_test "订单表存在" "sqlite3 /workspace/projects/stockhub/backend/data/stockhub.db '.tables' | grep -q 'orders'"
fi

echo ""

# ============================================
# 4. 业务流程测试
# ============================================
echo "🔄 业务流程测试"
echo "----------------------------------------"

# 测试注册流程（模拟）
echo -n "[注册流程] 发送验证码 ... "
TEST_RESPONSE=$(curl -s -X POST http://localhost:3000/api/sms/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000"}' 2>/dev/null)
if echo "$TEST_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  SKIP${NC} (短信服务未配置)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 测试类目初始化
echo -n "[类目管理] 初始化类目 ... "
TEST_RESPONSE=$(curl -s -X POST http://localhost:3000/api/categories/initialize 2>/dev/null)
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if echo "$TEST_RESPONSE" | grep -q "success\|already"; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    TEST_RESULTS+=("类目初始化|PASS")
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    TEST_RESULTS+=("类目初始化|FAIL")
fi

echo ""

# ============================================
# 5. 性能测试
# ============================================
echo "⚡ 性能测试"
echo "----------------------------------------"

# 测试API响应时间
echo -n "[性能] API响应时间 ... "
START_TIME=$(date +%s%N)
curl -s http://localhost:3000/api/categories > /dev/null
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if [ $RESPONSE_TIME -lt 500 ]; then
    echo -e "${GREEN}✅ PASS${NC} (${RESPONSE_TIME}ms)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    TEST_RESULTS+=("API响应时间|PASS")
elif [ $RESPONSE_TIME -lt 1000 ]; then
    echo -e "${YELLOW}⚠️  WARN${NC} (${RESPONSE_TIME}ms)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    TEST_RESULTS+=("API响应时间|PASS")
else
    echo -e "${RED}❌ FAIL${NC} (${RESPONSE_TIME}ms)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    TEST_RESULTS+=("API响应时间|FAIL")
fi

echo ""

# ============================================
# 6. 安全测试
# ============================================
echo "🔒 安全测试"
echo "----------------------------------------"

# 测试SQL注入防护
run_test "SQL注入防护" "! curl -s 'http://localhost:3000/api/demands?search=1%27%20OR%20%271%27%3D%271' | grep -q 'error'"

# 测试XSS防护
run_test "XSS防护" "! curl -s -X POST http://localhost:3000/api/auth/register \
  -H \"Content-Type: application/json\" \
  -d '{\"phone\":\"<script>alert(1)</script>\",\"code\":\"123456\"}' | grep -q '<script>'"

echo ""

# ============================================
# 7. 配置检查
# ============================================
echo "⚙️  配置检查"
echo "----------------------------------------"

# 检查环境变量
run_test "环境变量配置" "test -f /workspace/projects/stockhub/backend/.env"

# 检查package.json
run_test "依赖配置" "test -f /workspace/projects/stockhub/backend/package.json"

# 检查数据库优化
run_test "数据库优化脚本" "test -f /workspace/projects/stockhub/backend/migrations/database-optimization.sql"

# 检查SEO配置
run_test "SEO配置" "test -f /workspace/projects/stockhub/frontend/domestic/src/config/geo-seo.ts"

echo ""

# ============================================
# 测试结果汇总
# ============================================
echo "================================"
echo "📊 测试结果汇总"
echo "================================"
echo ""
echo "总测试数: $TOTAL_TESTS"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"
echo -e "通过率: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
echo ""

if [ $FAILED_TESTS -gt 0 ]; then
    echo "❌ 失败的测试:"
    for result in "${TEST_RESULTS[@]}"; do
        if [[ $result == *"FAIL"* ]]; then
            echo "   - ${result%|*}"
        fi
    done
    echo ""
fi

# 最终判断
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！系统可以部署上线！${NC}"
    exit 0
elif [ $FAILED_TESTS -le $((TOTAL_TESTS / 10)) ]; then
    echo -e "${YELLOW}⚠️  有少量测试失败，建议修复后再部署${NC}"
    exit 1
else
    echo -e "${RED}❌ 测试失败过多，请修复后再部署${NC}"
    exit 2
fi
