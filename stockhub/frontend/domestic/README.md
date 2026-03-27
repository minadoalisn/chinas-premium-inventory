# StockHub 前端项目

国内求购平台前端应用，基于 Vue 3 + Vite + Element Plus 开发。

## 项目结构

```
src/
├── api/                    # API 接口封装
│   └── index.ts           # 统一 API 客户端
├── assets/                # 静态资源
│   └── styles/
│       └── main.css       # 全局样式
├── components/            # 公共组件
│   └── CreateDemandDialog.vue  # 创建求购弹窗
├── router/                # 路由配置
│   └── index.ts           # 路由定义
├── stores/                # 状态管理
│   ├── auth.ts            # 用户认证
│   ├── demand.ts          # 求购需求
│   ├── product.ts         # 商品
│   └── index.ts           # Store 导出
├── views/                 # 页面组件
│   ├── Home.vue           # 求购大厅
│   ├── MyDemands.vue      # 我的需求
│   ├── Products.vue       # 库存商品
│   ├── ProductDetail.vue  # 商品详情
│   ├── MerchantCenter.vue # 商户中心
│   ├── Login.vue          # 登录
│   └── Register.vue       # 注册
├── App.vue                # 根组件
└── main.ts                # 入口文件
```

## 功能特性

### 已实现页面

1. **Home.vue（求购大厅）**
   - 统计数据栏（今日求购、成交额、商户数、商品数）
   - 搜索筛选区（关键词搜索、类目筛选）
   - 热门类目标签
   - 求购需求卡片列表
   - 支持排序（最新/数量/价格）

2. **MyDemands.vue（我的需求）**
   - 我的求购列表
   - 创建新求购
   - 编辑求购
   - 删除求购
   - 状态标识（加急/普通）

3. **MerchantCenter.vue（商户中心）**
   - 统计卡片（总商品/已上架/审核中/已售罄）
   - 商品列表表格
   - 发布商品入口
   - 编辑/查看/下架操作

4. **Login.vue（登录）**
   - 邮箱/密码登录
   - 表单验证

5. **Register.vue（注册）**
   - 用户注册
   - 表单验证（邮箱/手机号/密码）

6. **ProductDetail.vue（商品详情）**
   - 商品信息展示
   - 相似商品推荐
   - 操作按钮（收藏/购买/联系）

### 公共组件

- **CreateDemandDialog.vue**：创建求购弹窗
  - 表单验证
  - 支持加急选项

## 技术栈

- **Vue 3** - 渐进式框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - 类型安全
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Element Plus** - UI 组件库
- **Axios** - HTTP 客户端
- **RemixIcon** - 图标库

## 开发命令

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
访问：http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## API 配置

API 基础地址通过环境变量配置：

```bash
# .env
VITE_API_BASE_URL=/api
```

开发环境下，API 请求会通过 Vite 代理转发到后端服务器（http://localhost:3000）

## 状态管理

### Auth Store（用户认证）
- `token` - JWT Token
- `user` - 用户信息
- `login(token, user)` - 登录
- `logout()` - 登出
- `setUser(userData)` - 更新用户信息

### Demand Store（求购需求）
- `demandList` - 求购列表
- `isCreateDialogVisible` - 创建弹窗状态
- `createDemand(data)` - 创建求购
- `updateDemand(id, data)` - 更新求购
- `deleteDemand(id)` - 删除求购

### Product Store（商品）
- `products` - 商品列表
- `isLoading` - 加载状态
- `selectedProducts` - 选中商品

## 路由配置

| 路径 | 组件 | 说明 | 权限 |
|------|------|------|------|
| `/` | Home.vue | 求购大厅 | 公开 |
| `/login` | Login.vue | 登录 | 公开 |
| `/register` | Register.vue | 注册 | 公开 |
| `/my-demands` | MyDemands.vue | 我的需求 | 需登录 |
| `/products` | Products.vue | 库存商品 | 需登录 |
| `/products/:id` | ProductDetail.vue | 商品详情 | 需登录 |
| `/merchant-center` | MerchantCenter.vue | 商户中心 | 需登录 |

## 样式系统

- **Element Plus**：主要 UI 组件库
- **TailwindCSS**：工具类样式（需配置）
- **RemixIcon**：图标库

## 后端对接

所有 API 请求会自动添加：
- `Authorization: Bearer {token}` header
- `X-Client-Type: domestic` header

401 错误会自动跳转到登录页。

## 待开发功能

- [ ] Products.vue（库存商品页面）
- [ ] 商品发布表单
- [ ] 商户入驻申请页面
- [ ] 求购详情页（匹配结果展示）
- [ ] 个人中心页面
- [ ] 订单管理页面
- [ ] 购物车功能
- [ ] 收藏功能

## 注意事项

1. **API 跨域**：开发环境使用 Vite 代理，生产环境需配置 Nginx
2. **图片资源**：使用阿里云 OSS，需配置域名
3. **Token 过期**：401 错误会自动登出
4. **表单验证**：使用 Element Plus 验证规则

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90
