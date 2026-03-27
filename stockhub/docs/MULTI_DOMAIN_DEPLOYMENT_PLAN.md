# StockHub 多域名架构部署方案

**项目**: StockHub - 跨境库存交易平台
**架构**: 国内外双服务器部署
**时间**: 2026-03-28

---

## 🌍 服务器架构

### 服务器配置

#### 国内服务器（当前）
- **主机名**: iv-yeipo3m0owug9cco11o5
- **内网IP**: 10.29.238.60
- **公网IP**: 14.103.87.246
- **系统**: Ubuntu 6.8.0-55-generic
- **内存**: 3.8GB
- **磁盘**: 40GB
- **位置**: 中国（阿里云/腾讯云）
- **用途**: 国内求购网（stockhub.cn）

#### 新加坡服务器（待配置）
- **主机名**: 待配置
- **公网IP**: 待提供
- **系统**: 待确认（建议Ubuntu 22.04）
- **内存**: 待确认（建议≥4GB）
- **磁盘**: 待确认（建议≥40GB）
- **位置**: 新加坡（AWS/阿里云）
- **用途**: 国外特卖网（stockhub.com）

---

## 🏗️ 架构设计

### 1. 双站架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户访问                              │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   GeoDNS/CDN     │
                    └─────────┬─────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
      ┌───────▼────────┐           ┌────────▼────────┐
      │  中国用户      │           │  国际用户       │
      │  (中国IP)      │           │  (其他IP)       │
      └───────┬────────┘           └────────┬────────┘
              │                               │
      ┌───────▼────────┐           ┌────────▼────────┐
      │  stockhub.cn   │           │ stockhub.com    │
      │  (国内服务器)   │           │  (新加坡服务器)   │
      └───────┬────────┘           └────────┬────────┘
              │                               │
      ┌───────▼────────┐           ┌────────▼────────┐
      │   MySQL主库    │◄─────────►│  MySQL从库      │
      │   (读写)       │  数据同步  │  (只读)        │
      └───────┬────────┘           └────────┬────────┘
              │                               │
      ┌───────▼────────┐           ┌────────▼────────┐
      │    Redis       │◄─────────►│    Redis        │
      │   (缓存)       │  缓存同步 │   (缓存)       │
      └────────────────┘           └────────────────┘
```

### 2. 功能分配

#### 国内服务器（stockhub.cn）
- ✅ 求购发布和管理
- ✅ 智能匹配算法
- ✅ 商户审核
- ✅ 订单管理（国内）
- ✅ 用户管理
- ✅ 写操作优先

#### 新加坡服务器（stockhub.com）
- ✅ 商品展示和搜索
- ✅ 国际询盘
- ✅ 国际订单
- ✅ 多语言支持
- ✅ 货币转换
- ✅ 读操作优先

---

## 🔧 部署方案

### 阶段1：服务器准备（待你提供新加坡服务器信息）

#### 需要收集的信息
```bash
# 请在新加坡服务器上运行以下命令并提供结果
hostname
hostname -I
uname -a
free -h
df -h
docker --version
docker-compose --version
```

### 阶段2：数据库配置

#### 国内服务器配置（主库）

**MySQL配置** (`/etc/mysql/mysql.conf.d/mysqld.cnf`):

```ini
[mysqld]
# 服务器ID（必须唯一）
server-id = 1

# 启用二进制日志（用于主从复制）
log-bin = mysql-bin
binlog-format = ROW

# 需要复制的数据库
binlog-do-db = stockhub

# GTID模式（推荐）
gtid-mode = ON
enforce-gtid-consistency = ON

# 性能优化
max_connections = 500
innodb_buffer_pool_size = 1G
query_cache_size = 64M

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

**创建复制用户**:

```sql
-- 在国内服务器主库上执行
CREATE USER 'replicator'@'%' IDENTIFIED BY 'strong_password_here';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;

-- 查看主库状态
SHOW MASTER STATUS;
```

#### 新加坡服务器配置（从库）

**MySQL配置** (`/etc/mysql/mysql.conf.d/mysqld.cnf`):

```ini
[mysqld]
# 服务器ID（必须唯一，且不同于主库）
server-id = 2

# 中继日志
relay-log = mysql-relay-bin

# 只读模式（可选，从库建议开启）
read_only = 1

# GTID模式
gtid-mode = ON
enforce-gtid-consistency = ON

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

**配置从库**:

```sql
-- 在新加坡服务器从库上执行
CHANGE MASTER TO
  MASTER_HOST = '14.103.87.246',  -- 国内服务器公网IP
  MASTER_USER = 'replicator',
  MASTER_PASSWORD = 'strong_password_here',
  MASTER_LOG_FILE = 'mysql-bin.000001',  -- 从SHOW MASTER STATUS获取
  MASTER_LOG_POS = 154;  -- 从SHOW MASTER STATUS获取

-- 启动从库
START SLAVE;

-- 查看从库状态
SHOW SLAVE STATUS\G
```

### 阶段3：应用部署

#### 国内服务器部署

```bash
# 克隆代码
git clone https://github.com/minadoalisn/chinas-premium-inventory.git /opt/stockhub
cd /opt/stockhub

# 切换到优化分支
git checkout optimization-v2

# 配置环境变量
cat > backend/.env << EOF
NODE_ENV=production
PORT=3000
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=stockhub
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
SMSBAO_USERNAME=mengge
SMSBAO_PASSWORD=045311047cb34738834164403ea30817
SMSBAO_SIGN=【库存易】

# GEO配置
GEO_REGION=CN
GEO_CURRENCY=CNY

# 物流配置
LOGISTICS_PROVIDER=SF
LOGISTICS_API_KEY=your_sf_api_key

# CORS配置（允许新加坡服务器跨域访问）
CORS_ORIGIN=https://stockhub.com,https://stockhub.cn,http://localhost:3000
EOF

# 启动服务
docker-compose up -d
```

#### 新加坡服务器部署

```bash
# 克隆代码
git clone https://github.com/minadoalisn/chinas-premium-inventory.git /opt/stockhub
cd /opt/stockhub

# 切换到优化分支
git checkout optimization-v2

# 配置环境变量
cat > backend/.env << EOF
NODE_ENV=production
PORT=3000
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=stockhub
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
SMSBAO_USERNAME=mengge
SMSBAO_PASSWORD=045311047cb34738834164403ea30817
SMSBAO_SIGN=【库存易】

# GEO配置
GEO_REGION=SG
GEO_CURRENCY=SGD

# 物流配置
LOGISTICS_PROVIDER=DHL
LOGISTICS_API_KEY=your_dhl_api_key

# CORS配置
CORS_ORIGIN=https://stockhub.com,https://stockhub.cn,http://localhost:3000
EOF

# 启动服务
docker-compose up -d
```

### 阶段4：Nginx配置

#### 国内服务器Nginx配置

```nginx
# /etc/nginx/sites-available/stockhub.cn
server {
    listen 80;
    server_name stockhub.cn www.stockhub.cn;

    # HTTP重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name stockhub.cn www.stockhub.cn;

    # SSL证书配置
    ssl_certificate /etc/nginx/ssl/stockhub.cn.crt;
    ssl_certificate_key /etc/nginx/ssl/stockhub.cn.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/stockhub.cn.access.log;
    error_log /var/log/nginx/stockhub.cn.error.log;

    # 前端
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API文档
    location /api/docs {
        proxy_pass http://localhost:3000;
    }
}
```

#### 新加坡服务器Nginx配置

```nginx
# /etc/nginx/sites-available/stockhub.com
server {
    listen 80;
    server_name stockhub.com www.stockhub.com;

    # HTTP重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name stockhub.com www.stockhub.com;

    # SSL证书配置
    ssl_certificate /etc/nginx/ssl/stockhub.com.crt;
    ssl_certificate_key /etc/nginx/ssl/stockhub.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/stockhub.com.access.log;
    error_log /var/log/nginx/stockhub.com.error.log;

    # 前端
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API文档
    location /api/docs {
        proxy_pass http://localhost:3000;
    }
}
```

### 阶段5：DNS配置

#### GeoDNS配置（使用阿里云DNS或Cloudflare）

```
# A记录
stockhub.cn        A   14.103.87.246     # 国内服务器
*.stockhub.cn     A   14.103.87.246

stockhub.com       A   新加坡服务器IP      # 新加坡服务器
*.stockhub.com    A   新加坡服务器IP

# CNAME记录（可选，用于CDN）
www.stockhub.cn    CNAME   stockhub.cn
www.stockhub.com   CNAME   stockhub.com
```

#### 地域解析（可选，使用Cloudflare或阿里云DNS）

```
# 中国用户 → 国内服务器
CN → stockhub.cn (14.103.87.246)

# 其他地区用户 → 新加坡服务器
US → stockhub.com (新加坡IP)
EU → stockhub.com (新加坡IP)
SG → stockhub.com (新加坡IP)
```

### 阶段6：CDN配置

#### 国内CDN（阿里云CDN/腾讯云CDN）

```
域名: stockhub.cn
源站: 14.103.87.246
加速区域: 中国大陆
缓存规则: 静态资源7天，HTML 1小时
HTTPS: 开启
回源协议: HTTPS
```

#### 国际CDN（Cloudflare/AWS CloudFront）

```
域名: stockhub.com
源站: 新加坡服务器IP
加速区域: 全球
缓存规则: 静态资源30天，HTML 1天
HTTPS: 开启（免费SSL）
回源协议: HTTPS
```

---

## 🔄 数据同步策略

### 1. 主从复制延迟处理

```javascript
// 在新加坡服务器读取数据时，处理复制延迟
async function readWithRetry(query, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await query();
      return result;
    } catch (error) {
      if (i < maxRetries - 1) {
        await sleep(100 * Math.pow(2, i)); // 指数退避
      } else {
        throw error;
      }
    }
  }
}
```

### 2. Redis缓存同步

```javascript
// 缓存更新通知
async function updateCache(key, value) {
  // 更新本地Redis
  await redis.set(key, value);

  // 通过WebSocket通知其他服务器更新缓存
  await notifyCacheUpdate(key);
}

// 缓存失效通知
async function invalidateCache(pattern) {
  // 删除本地缓存
  await redis.del(pattern);

  // 通知其他服务器
  await notifyCacheInvalidation(pattern);
}
```

---

## 📊 监控方案

### 1. 服务器监控

```bash
# 安装监控工具
apt-get install htop iotop nethogs

# 配置邮件告警
apt-get install mailutils
```

### 2. 数据库监控

```bash
# 安装MySQL监控工具
apt-get install mysql-client

# 监控脚本
#!/bin/bash
# 监控主从复制状态
SLAVE_STATUS=$(mysql -u root -p$password -e "SHOW SLAVE STATUS\G" | grep "Slave_IO_Running")
if [[ $SLAVE_STATUS != *"Yes"* ]]; then
  echo "主从复制异常！" | mail -s "StockHub告警" admin@stockhub.cn
fi
```

### 3. 应用监控

```bash
# 使用PM2监控
pm2 start npm --name "stockhub-backend" -- run start:prod
pm2 monit

# 配置日志轮转
pm2 install pm2-logrotate
```

---

## 🚀 部署步骤总结

### 步骤1：准备新加坡服务器（待你提供信息）
- [ ] 获取新加坡服务器IP和登录信息
- [ ] 确认系统配置（Ubuntu 22.04）
- [ ] 安装Docker和Docker Compose

### 步骤2：配置数据库主从复制
- [ ] 配置国内服务器为主库
- [ ] 配置新加坡服务器为从库
- [ ] 测试数据同步

### 步骤3：部署应用到两台服务器
- [ ] 国内服务器部署（stockhub.cn）
- [ ] 新加坡服务器部署（stockhub.com）

### 步骤4：配置Nginx和SSL
- [ ] 配置两台服务器的Nginx
- [ ] 申请SSL证书（Let's Encrypt）
- [ ] 配置HTTPS

### 步骤5：配置DNS和CDN
- [ ] 配置域名解析
- [ ] 配置GeoDNS（可选）
- [ ] 配置CDN加速

### 步骤6：测试和监控
- [ ] 测试国内外访问
- [ ] 测试数据同步
- [ ] 配置监控告警
- [ ] 备份策略

---

## 📝 待你提供的信息

### 新加坡服务器
- [ ] 公网IP地址
- [ ] SSH登录信息（用户名/密码或密钥）
- [ ] 系统版本
- [ ] 内存和磁盘配置

### 域名
- [ ] stockhub.cn 是否已备案？
- [ ] stockhub.com 是否已购买？
- [ ] DNS服务商（阿里云/腾讯云/Cloudflare）

### 第三方服务
- [ ] 物流API密钥（顺丰、DHL、FedEx、UPS）
- [ ] 短信宝余额是否充足？

---

## 💡 下一步行动

**立即需要**：
1. 提供新加坡服务器信息
2. 确认域名状态
3. 确认第三方服务密钥

**我会执行**：
1. 配置数据库主从复制
2. 部署应用到两台服务器
3. 配置Nginx和SSL
4. 配置DNS和CDN
5. 测试和监控

---

**负责人**: 贾维斯 🤖
**方案状态**: 待新加坡服务器信息确认后执行
