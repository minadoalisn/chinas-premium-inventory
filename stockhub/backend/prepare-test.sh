#!/bin/bash

echo "🧪 StockHub V2.0 - 模拟数据测试准备脚本"
echo "================================"
echo ""

# 创建模拟数据服务
echo "📝 创建模拟数据配置..."

# 创建模拟配置文件
cat > /workspace/projects/stockhub/backend/mock-config.ts << 'EOF'
// 模拟数据配置
export const MOCK_CONFIG = {
  // 模拟验证码（用于测试）
  mockVerificationCode: '123456',
  
  // 模拟物流数据
  mockFreightRates: {
    SF: { base: 10, perKg: 2 },
    DHL: { base: 50, perKg: 15 },
    FedEx: { base: 45, perKg: 12 },
    UPS: { base: 40, perKg: 10 },
  },
  
  // 模拟运费计算
  calculateFreight: (provider: string, weight: number) => {
    const rates = MOCK_CONFIG.mockFreightRates[provider as keyof typeof MOCK_CONFIG.mockFreightRates];
    if (!rates) return null;
    return rates.base + (weight * rates.perKg);
  },
  
  // 模拟物流追踪
  mockTrackingData: [
    {
      number: 'SF123456789',
      provider: 'SF',
      status: '已发货',
      lastUpdate: new Date(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      trackingDetails: [
        { time: new Date(), location: '深圳市', status: '已揽收' },
        { time: new Date(Date.now() - 3600000), location: '深圳转运中心', status: '已发出' },
      ],
    },
    {
      number: 'DHL987654321',
      provider: 'DHL',
      status: '运输中',
      lastUpdate: new Date(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      trackingDetails: [
        { time: new Date(), location: '新加坡', status: '已揽收' },
        { time: new Date(Date.now() - 7200000), location: '新加坡物流中心', status: '已发出' },
      ],
    },
  ],
  
  // 模拟支付数据
  mockPaymentData: {
    alipay: {
      enabled: true,
      appId: 'mock-alipay-app-id',
      sandbox: true,
    },
    wechat: {
      enabled: true,
      appId: 'mock-wechat-app-id',
      sandbox: true,
    },
    paypal: {
      enabled: true,
      clientId: 'mock-paypal-client-id',
      sandbox: true,
    },
  },
};

export default MOCK_CONFIG;
EOF

echo "✅ 模拟配置文件已创建"

# 检查数据库文件
echo ""
echo "💾 检查数据库..."
if [ -f "/workspace/projects/stockhub/backend/data/stockhub.sqlite" ]; then
    echo "✅ 数据库文件已存在"
else
    echo "⚠️  数据库文件不存在，将在服务启动时创建"
fi

# 检查端口占用
echo ""
echo "🔍 检查端口占用..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  端口3000已被占用"
    echo "进程信息："
    lsof -i :3000 | tail -5
else
    echo "✅ 端口3000可用"
fi

if lsof -i :5173 > /dev/null 2>&1; then
    echo "⚠️  端口5173已被占用"
    echo "进程信息："
    lsof -i :5173 | tail -5
else
    echo "✅ 端口5173可用"
fi

echo ""
echo "================================"
echo "✅ 测试准备完成！"
echo ""
echo "📋 下一步："
echo "   1. 启动后端服务"
echo "   2. 启动前端服务"
echo "   3. 初始化数据库"
echo "   4. 运行完整测试"
echo ""
