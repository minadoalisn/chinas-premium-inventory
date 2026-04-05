#!/bin/bash

echo "🧪 StockHub完整功能测试（虚拟认证模式）"
echo "================================"
echo ""

API_URL="http://localhost:3000"
PHONE="13800138000"
CODE="123456"

# 测试1: 健康检查
echo "测试1: 健康检查"
echo "GET $API_URL/api"
curl -s "$API_URL/api"
echo -e "\n"

# 测试2: 用户注册（虚拟）
echo "测试2: 用户注册"
echo "POST $API_URL/api/auth/register"
curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"code\": \"$CODE\"
  }"
echo -e "\n"

# 测试3: 用户登录（虚拟）
echo "测试3: 用户登录"
echo "POST $API_URL/api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"code\": \"$CODE\"
  }")
echo "$LOGIN_RESPONSE"
echo -e "\n"

# 提取token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "获取到的Token: ${TOKEN:0:20}..."
echo -e "\n"

# 测试4: 类目列表
echo "测试4: 类目列表"
echo "GET $API_URL/api/categories"
curl -s "$API_URL/api/categories"
echo -e "\n"

# 测试5: 用户列表
echo "测试5: 用户列表"
echo "GET $API_URL/api/users"
curl -s "$API_URL/api/users"
echo -e "\n"

# 测试6: 求购列表
echo "测试6: 求购列表"
echo "GET $API_URL/api/demands"
curl -s "$API_URL/api/demands"
echo -e "\n"

# 测试7: 商品列表
echo "测试7: 商品列表"
echo "GET $API_URL/api/products"
curl -s "$API_URL/api/products"
echo -e "\n"

# 测试8: 商户列表
echo "测试8: 商户列表"
echo "GET $API_URL/api/merchants"
curl -s "$API_URL/api/merchants"
echo -e "\n"

echo "================================"
echo "🎉 测试完成"
echo "================================"
echo ""
echo "📊 虚拟认证说明："
echo "   - 手机号: 任意有效的手机号"
echo "   - 验证码: 固定为 123456"
echo "   - Token有效期: 7天"
echo ""
echo "📍 访问地址："
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo "   🔌 后端API: http://14.103.87.246:3000/api"
echo ""
