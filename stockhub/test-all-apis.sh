#!/bin/bash

echo "🧪 StockHub API 测试脚本（虚拟认证模式）"
echo "================================"
echo ""

API_URL="http://localhost:3000"

# 测试1: 健康检查
echo "测试1: 健康检查"
echo "GET $API_URL/api"
curl -s "$API_URL/api"
echo ""
echo ""

# 测试2: API文档
echo "测试2: API文档"
echo "GET $API_URL/api/docs"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/docs")
echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API文档可访问"
else
    echo "❌ API文档不可访问"
fi
echo ""

# 测试3: 类目初始化
echo "测试3: 类目初始化"
echo "POST $API_URL/api/categories/initialize"
curl -s -X POST "$API_URL/api/categories/initialize"
echo ""
echo ""

# 测试4: 类目列表
echo "测试4: 类目列表"
echo "GET $API_URL/api/categories"
curl -s "$API_URL/api/categories"
echo ""
echo ""

# 测试5: 用户注册（虚拟）
echo "测试5: 用户注册（虚拟）"
echo "POST $API_URL/api/auth/register"
curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "password123",
    "role": "buyer"
  }'
echo ""
echo ""

# 测试6: 用户登录（虚拟）
echo "测试6: 用户登录（虚拟）"
echo "POST $API_URL/api/auth/login"
curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "password123"
  }'
echo ""
echo ""

# 测试7: 求购列表
echo "测试7: 求购列表"
echo "GET $API_URL/api/demands"
curl -s "$API_URL/api/demands"
echo ""
echo ""

# 测试8: 商品列表
echo "测试8: 商品列表"
echo "GET $API_URL/api/products"
curl -s "$API_URL/api/products"
echo ""
echo ""

# 测试9: 商户列表
echo "测试9: 商户列表"
echo "GET $API_URL/api/merchants"
curl -s "$API_URL/api/merchants"
echo ""
echo ""

# 测试10: 用户列表
echo "测试10: 用户列表"
echo "GET $API_URL/api/users"
curl -s "$API_URL/api/users"
echo ""
echo ""

# 测试11: 统计数据
echo "测试11: 统计数据"
echo "GET $API_URL/api/stats/dashboard"
curl -s "$API_URL/api/stats/dashboard"
echo ""
echo ""

# 测试12: 管理后台
echo "测试12: 管理后台"
echo "GET $API_URL/api/admin/dashboard"
curl -s "$API_URL/api/admin/dashboard"
echo ""
echo ""

# 测试13: 询盘列表
echo "测试13: 询盘列表"
echo "GET $API_URL/api/inquiries"
curl -s "$API_URL/api/inquiries"
echo ""
echo ""

# 测试14: 订单列表
echo "测试14: 订单列表"
echo "GET $API_URL/api/orders"
curl -s "$API_URL/api/orders"
echo ""
echo ""

echo "================================"
echo "🎉 测试完成"
echo "================================"
echo ""
echo "📍 访问地址："
echo "   📚 API文档: http://14.103.87.246:3000/api/docs"
echo "   🔌 后端API: http://14.103.87.246:3000/api"
echo ""
