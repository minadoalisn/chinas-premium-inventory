# StockHub 部署指南（香港/新加坡服务器）

## 📋 服务器信息

| 服务器 | IP地址 | 域名 | SSH用户 |
|--------|--------|------|---------|
| 香港服务器 | 172.22.249.225 | cnsurpr.cn | root |
| 新加坡服务器 | 47.236.244.51 | cnsurpr.com | root |

## 🔧 部署前准备

### 1. 检查本地文件

```bash
# 检查部署包
ls -lh stockhub-deploy.tar.gz

# 验证前端构建
cd frontend/domestic
ls -la dist/

# 验证后端配置
cd ../../backend
cat .env
```

### 2. 传输文件到服务器

**方式1: SCP传输**
```bash
# 传输到香港服务器
scp stockhub-deploy.tar.gz root@172.22.249.225:/root/

# 传输到新加坡服务器
scp stockhub-deploy.tar.gz root@47.236.244.51:/root/
```

**方式2: 使用部署脚本**
```bash
# 自动部署（需要SSH连接）
./deploy-quick.sh hongkong
./deploy-quick.sh singapore
```

### 3. 手动部署步骤（如果SSH不可用）

#### 步骤1: 登录服务器
```bash
ssh root@172.22.249.225  # 香港
# 或
ssh root@47.236.244.51   # 新加坡
```

#### 步骤2: 安装必要软件
```bash
# 更新系统
apt-get update && apt-get upgrade -y

# 安装Node.js (如果未安装)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装Nginx
apt-get install -y nginx

# 验证安装
node --version
npm --version
nginx -v
```

#### 步骤3: 解压部署包
```bash
cd /root
tar -xzf stockhub-deploy.tar.gz -C /var/www/stockhub/
```

#### 步骤4: 后端部署
```bash
cd /var/www/stockhub/backend

# 安装依赖
npm install

# 配置环境变量
cat > .env << 'EOF'
DB_SYNCHRONIZE=false
DB_LOGGING=true
DB_TYPE=sqlite
DB_DATABASE=./data/stockhub.sqlite
JWT_SECRET=stockhub-jwt-secret-key-2026
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=production

# SMS配置
SMSBAO_USERNAME=mengge
SMSBAO_PASSWORD=045311047cb34738834164403ea30817
EOF

# 初始化数据库
mkdir -p data
# 上传数据库初始化脚本（见附件 init-db.js）
node init-db.js

# 构建并启动
npm run build
nohup node dist/main.js > logs/backend.log 2>&1 &

# 验证启动
curl http://localhost:3000/api/categories
```

#### 步骤5: 前端部署
```bash
cd /var/www/stockhub/frontend/domestic

# 如果dist目录已存在，跳过构建
# 否则执行构建
npm install
npm run build
```

#### 步骤6: 配置Nginx
```bash
# 创建Nginx配置
cat > /etc/nginx/sites-available/stockhub << 'EOF'
server {
    listen 80;
    server_name _;

    # 前端静态文件
    location / {
        root /var/www/stockhub/frontend/domestic/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/json;
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/stockhub /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启Nginx
systemctl restart nginx
```

#### 步骤7: 验证部署
```bash
# 检查后端进程
ps aux | grep node

# 检查Nginx状态
systemctl status nginx

# 测试API
curl http://localhost:3000/api/categories

# 检查日志
tail -20 /var/www/stockhub/backend/logs/backend.log
```

## 🚀 快速部署脚本

### 一键部署（需要SSH访问权限）

```bash
# 香港服务器
./deploy-quick.sh hongkong

# 新加坡服务器
./deploy-quick.sh singapore
```

### Docker部署（推荐生产环境）

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📊 部署检查清单

### 后端检查
- [ ] Node.js 已安装
- [ ] 依赖已安装 (`npm install`)
- [ ] 环境变量已配置 (`.env`)
- [ ] 数据库已初始化
- [ ] 后端服务已启动
- [ ] API可访问 (`curl /api/categories`)

### 前端检查
- [ ] 前端已构建 (`dist/` 目录存在)
- [ ] 静态文件可访问
- [ ] API代理配置正确
- [ ] 页面可正常加载

### 网络检查
- [ ] 防火墙开放端口 80/443
- [ ] 防火墙开放端口 3000（内部）
- [ ] DNS解析配置正确
- [ ] 域名可访问

## 🔍 故障排查

### 后端无法启动
```bash
# 查看日志
tail -50 /var/www/stockhub/backend/logs/backend.log

# 检查端口占用
netstat -tlnp | grep 3000

# 手动启动测试
cd /var/www/stockhub/backend
node dist/main.js
```

### 前端404错误
```bash
# 检查dist目录
ls -la /var/www/stockhub/frontend/domestic/dist/

# 检查Nginx配置
cat /etc/nginx/sites-available/stockhub

# 测试Nginx配置
nginx -t
```

### API代理失败
```bash
# 测试后端直接访问
curl http://localhost:3000/api/categories

# 检查Nginx错误日志
tail -20 /var/log/nginx/error.log
```

## 🔐 安全配置

### SSL证书配置（Let's Encrypt）
```bash
# 安装certbot
apt-get install -y certbot python3-certbot-nginx

# 申请证书（替换域名）
certbot --nginx -d cnsurpr.cn -d www.cnsurpr.cn

# 自动续期
certbot renew --dry-run
```

### 防火墙配置
```bash
# UFW防火墙
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# iptables
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## 📈 性能优化

### Nginx缓存
```nginx
# 在Nginx配置中添加
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### PM2进程管理（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动应用
cd /var/www/stockhub/backend
pm2 start dist/main.js --name stockhub-api

# 配置自动启动
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs stockhub-api
```

## 📞 技术支持

如果遇到问题，请提供：
1. 服务器IP和错误信息
2. 相关日志文件内容
3. 执行的具体命令
4. 预期结果vs实际结果

---

**部署版本**: v2.0
**最后更新**: 2026-03-29
**执行者**: 贾维斯 (J.A.R.V.I.S)
