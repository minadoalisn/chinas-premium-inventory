#!/bin/bash

echo "🧪 StockHub 前后端完整流程测试"
echo "================================"
echo ""

API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"

# 测试1: 后端健康检查
echo "测试1: 后端健康检查"
echo "GET $API_URL/api"
curl -s "$API_URL/api"
echo -e "\n"

# 测试2: 前端访问
echo "测试2: 前端访问"
echo "GET $FRONTEND_URL"
curl -s "$FRONTEND_URL" | head -10
echo -e "\n"

# 测试3: API文档
echo "测试3: API文档"
echo "GET $API_URL/api/docs"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/docs")
echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ API文档可访问"
else
    echo "   ❌ API文档不可访问"
fi
echo -e "\n"

# 测试4: 类目列表
echo "测试4: 类目列表"
echo "GET $API_URL/api/categories"
CATEGORIES=$(curl -s "$API_URL/api/categories")
echo "$CATEGORIES" | python3 -m json.tool 2>/dev/null | head -20 || echo "$CATEGORIES"
echo -e "\n"

# 测试5: 用户注册（虚拟认证）
echo "测试5: 用户注册（虚拟认证）"
echo "POST $API_URL/api/auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","code":"123456"}')
echo "$REGISTER_RESPONSE"
echo -e "\n"

# 提取token
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ -n "$TOKEN" ]; then
    echo "✅ 获取到Token: ${TOKEN:0:20}..."
else
    echo "⚠️ 未获取到Token"
fi
echo -e "\n"

# 测试6: 用户登录
echo "测试6: 用户登录"
echo "POST $API_URL/api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","code":"123456"}')
echo "$LOGIN_RESPONSE"
echo -e "\n"

# 测试7: 用户列表
echo "测试7: 用户列表"
echo "GET $API_URL/api/users"
curl -s "$API_URL/api/users"
echo -e "\n"

# 测试8: 商户列表
echo "测试8: 商户列表"
echo "GET $API_URL/api/merchants"
curl -s "$API_URL/api/merchants"
echo -e "\n"

# 测试9: 求购列表
echo "测试9: 求购列表"
echo "GET $API_URL/api/demands"
curl -s "$API_URL/api/demands"
echo -e "\n"

# 测试10: 商品列表
echo "测试10: 商品列表"
echo "GET $API_URL/api/products"
curl -s "$API_URL/api/products"
echo -e "\n"

echo "================================"
echo "🎉 测试完成"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   🌐 前端应用: http://14.103.87.246:5173"
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo "   🔌 后端API: http://14.103.87.246:3000/api"
echo ""
echo "📊 虚拟认证说明："
echo "   - 手机号: 任意有效的手机号"
echo "   - 验证码: 固定为 123456"
echo "   - Token有效期: 7天"
echo ""
