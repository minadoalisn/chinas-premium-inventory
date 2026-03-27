# StockHub 访问测试指南

## 🚀 快速启动

### 方式1：本地启动（推荐）

```bash
# 一键启动前后端
cd /workspace/projects/stockhub
chmod +x start-local.sh
./start-local.sh
```

### 方式2：Docker部署

```bash
# 使用Docker Compose
cd /workspace/projects/stockhub
docker-compose up -d
```

---

## 📍 访问地址

### 本地启动后的地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 🌐 **前端应用** | http://localhost:5173 | Vue 3前端界面 |
| 📚 **API文档** | http://localhost:3000/api/docs | Swagger API文档 |
| 🔌 **后端API** | http://localhost:3000 | Nest.js后端服务 |
| 📊 **健康检查** | http://localhost:3000/ | 服务健康状态 |

### Docker部署后的地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 🌐 **前端应用** | http://localhost:80 | Nginx代理 |
| 📚 **API文档** | http://localhost:80/api/docs | Swagger API文档 |
| 🔌 **后端API** | http://localhost:80/api | Nginx代理 |

---

## 🧪 测试流程

### 第1步：访问API文档

1. 打开浏览器访问：http://localhost:3000/api/docs
2. 查看所有可用的API端点
3. 测试基础功能是否正常

**测试清单**：
- [ ] 页面正常加载
- [ ] API端点列表显示
- [ ] 模块分类清晰（认证、用户、求购、商品等）

---

### 第2步：注册测试用户

使用Swagger测试注册流程：

```bash
# 1. 发送验证码
POST /api/sms/send-code
Body:
{
  "phone": "13800138000"
}

# 2. 使用验证码注册（验证码会显示在日志中）
POST /api/auth/register
Body:
{
  "phone": "13800138000",
  "code": "123456"  # 从日志中获取实际验证码
}

# 3. 登录
POST /api/auth/login
Body:
{
  "phone": "13800138000",
  "code": "123456"
}
```

**验证要点**：
- [ ] 验证码发送成功
- [ ] 用户注册成功
- [ ] 返回JWT Token
- [ ] 登录成功

---

### 第3步：测试前端应用

1. 打开浏览器访问：http://localhost:5173
2. 测试各个页面和功能

**测试清单**：

#### 登录/注册页面
- [ ] 页面正常显示
- [ ] 手机号输入框
- [ ] 验证码输入框
- [ ] 发送验证码按钮
- [ ] 登录/注册按钮

#### 求购大厅（Home）
- [ ] 求购列表显示
- [ ] 搜索功能
- [ ] 筛选功能
- [ ] 分页功能

#### 我的需求（MyDemands）
- [ ] 需求列表显示
- [ ] 创建求购按钮
- [ ] 编辑功能
- [ ] 删除功能

#### 库存商品（Products）
- [ ] 商品列表显示
- [ ] 搜索功能
- [ ] 筛选功能
- [ ] 分页功能

#### 商品详情（ProductDetail）
- [ ] 商品信息显示
- [ ] 图片展示
- [ ] 询盘按钮
- [ ] 相似商品推荐

#### 商户中心（MerchantCenter）
- [ ] 商户信息显示
- [ ] 编辑功能
- [ ] 商户申请功能

#### 数据统计（Stats）
- [ ] 统计数据显示
- [ ] 图表展示（如果有）

---

### 第4步：API接口测试

使用Postman或Swagger测试主要API：

#### 认证相关
```bash
# 注册
POST /api/auth/register
Content-Type: application/json
{
  "phone": "13800138001",
  "code": "123456"
}

# 登录
POST /api/auth/login
Content-Type: application/json
{
  "phone": "13800138001",
  "code": "123456"
}

# 获取个人信息
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

#### 求购相关
```bash
# 创建求购
POST /api/demands
Headers: Authorization: Bearer <token>
Content-Type: application/json
{
  "title": "求购iPhone 15",
  "description": "全新未拆封",
  "quantity": 10,
  "price": 6000,
  "categoryId": "1"
}

# 获取求购列表
GET /api/demands?page=1&limit=10

# 获取我的求购
GET /api/demands/my
Headers: Authorization: Bearer <token>
```

#### 商品相关
```bash
# 创建商品
POST /api/products
Headers: Authorization: Bearer <token>
Content-Type: application/json
{
  "title": "iPhone 15 Pro Max",
  "description": "256GB 深空黑色",
  "price": 8999,
  "quantity": 50,
  "categoryId": "1",
  "images": ["https://example.com/image.jpg"]
}

# 获取商品列表
GET /api/products?page=1&limit=10
```

---

### 第5步：业务流程测试

**完整业务流程测试**：

1. **买家注册** → 2. **发布求购** → 3. **等待匹配** → 4. **查看商品** → 5. **创建询盘** → 6. **创建订单**

**具体步骤**：

```bash
# Step 1: 买家注册
POST /api/auth/register
{ "phone": "13800138001", "code": "123456" }

# Step 2: 发布求购
POST /api/demands
{
  "title": "求购iPhone 15",
  "description": "全新未拆封，10台",
  "quantity": 10,
  "price": 6000,
  "categoryId": "1"
}

# Step 3: 商户注册并发布商品
POST /api/auth/register
{ "phone": "13800138002", "code": "123456" }

POST /api/merchants/apply
{
  "name": "Apple授权经销商",
  "company": "科技贸易有限公司",
  "description": "苹果官方授权经销商"
}

POST /api/products
{
  "title": "iPhone 15 Pro Max 256GB",
  "description": "全新未拆封",
  "price": 8999,
  "quantity": 50,
  "categoryId": "1",
  "images": ["https://example.com/iphone.jpg"]
}

# Step 4: 查看匹配商品
GET /api/demands/:id/match

# Step 5: 创建询盘
POST /api/inquiries
{
  "productId": "1",
  "message": "请问有库存吗？"
}

# Step 6: 创建订单
POST /api/orders
{
  "productId": "1",
  "quantity": 10,
  "totalPrice": 89990,
  "address": "北京市朝阳区xxx"
}
```

---

## 🐛 常见问题排查

### 问题1：后端无法启动
**症状**：访问 http://localhost:3000 无响应

**解决方案**：
```bash
# 查看后端日志
tail -f /tmp/stockhub-backend.log

# 检查端口占用
lsof -i :3000

# 重启后端
cd /workspace/projects/stockhub/backend
npm run start:dev
```

### 问题2：前端无法启动
**症状**：访问 http://localhost:5173 无响应

**解决方案**：
```bash
# 查看前端日志
tail -f /tmp/stockhub-frontend.log

# 检查端口占用
lsof -i :5173

# 重启前端
cd /workspace/projects/stockhub/frontend/domestic
npm run dev
```

### 问题3：验证码发送失败
**症状**：注册时无法发送验证码

**解决方案**：
```bash
# 查看短信服务配置
cat /workspace/projects/stockhub/backend/.env

# 检查短信宝余额
# 登录短信宝后台查看

# 查看后端日志中的验证码
tail -f /tmp/stockhub-backend.log | grep "验证码"
```

### 问题4：数据库错误
**症状**：API返回数据库相关错误

**解决方案**：
```bash
# 检查数据库文件
ls -la /workspace/projects/stockhub/backend/data/

# 重新初始化数据库
cd /workspace/projects/stockhub/backend
rm -f data/*.db
npm run start:dev
```

---

## 📊 性能测试

### 使用Apache Bench测试

```bash
# 安装ab工具（如果没有）
sudo apt-get install apache2-utils

# 测试首页性能
ab -n 1000 -c 10 http://localhost:3000/

# 测试API性能
ab -n 1000 -c 10 -H "Content-Type: application/json" \
   -p /tmp/test-data.json \
   http://localhost:3000/api/demands
```

### 使用curl测试

```bash
# 简单的响应时间测试
time curl http://localhost:3000/

# API响应测试
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138003","code":"123456"}' \
  -w "\nResponse time: %{time_total}s\n"
```

---

## 🔍 日志查看

### 后端日志
```bash
# 实时查看
tail -f /tmp/stockhub-backend.log

# 查看最后100行
tail -100 /tmp/stockhub-backend.log

# 搜索错误
grep "ERROR" /tmp/stockhub-backend.log

# 搜索验证码
grep "验证码" /tmp/stockhub-backend.log
```

### 前端日志
```bash
# 实时查看
tail -f /tmp/stockhub-frontend.log

# 查看最后100行
tail -100 /tmp/stockhub-frontend.log
```

---

## ✅ 测试检查清单

### 基础功能测试
- [ ] 后端服务正常启动
- [ ] 前端应用正常启动
- [ ] API文档可访问
- [ ] 用户注册/登录正常
- [ ] 验证码发送/验证正常

### 核心业务测试
- [ ] 求购发布/查看/管理
- [ ] 商品发布/查看/管理
- [ ] 询盘创建/回复
- [ ] 订单创建/状态流转
- [ ] 商户申请/审核

### 高级功能测试
- [ ] 智能匹配算法
- [ ] 相似商品推荐
- [ ] WebSocket消息推送
- [ ] 数据统计显示
- [ ] 文件上传功能

### 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] API响应时间 < 500ms
- [ ] 并发请求处理正常

### 兼容性测试
- [ ] Chrome浏览器
- [ ] Firefox浏览器
- [ ] Safari浏览器
- [ ] 移动端浏览器

---

## 🎯 测试完成后

### 停止服务
```bash
# 查找进程
ps aux | grep "nest start"
ps aux | grep "vite"

# 停止进程
kill <backend-pid>
kill <frontend-pid>

# 或使用脚本停止
cd /workspace/projects/stockhub
./stop-local.sh
```

### 清理数据
```bash
# 清理数据库
rm -f /workspace/projects/stockhub/backend/data/*.db

# 清理日志
rm -f /tmp/stockhub-*.log
```

---

## 📞 获取帮助

如果遇到问题，请：

1. 查看日志文件
2. 检查环境变量配置
3. 参考API文档
4. 联系开发者

---

**开始测试吧！** 🚀
