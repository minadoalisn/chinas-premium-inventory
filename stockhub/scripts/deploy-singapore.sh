#!/bin/bash

# ==========================================
# StockHub 应用部署脚本
# ==========================================

set -e

# 配置
PROJECT_DIR="/var/www/stockhub"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
GIT_REPO="https://github.com/minadoalisn/chinas-premium-inventory.git"
BRANCH="optimization-v2"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 开始部署StockHub应用到新加坡服务器..."
echo ""

# 1. 创建项目目录
echo -e "${GREEN}[1/8]${NC} 创建项目目录..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R stockhub:stockhub $PROJECT_DIR

# 2. 克隆代码仓库
echo -e "${GREEN}[2/8]${NC} 克隆代码仓库..."
cd $PROJECT_DIR
if [ ! -d "chinas-premium-inventory" ]; then
  git clone $GIT_REPO
  cd chinas-premium-inventory
  git checkout $BRANCH
else
  cd chinas-premium-inventory
  git pull origin $BRANCH
fi

# 3. 安装后端依赖
echo -e "${GREEN}[3/8]${NC} 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
  npm install
else
  echo -e "${YELLOW}ℹ️  后端依赖已安装，跳过...${NC}"
fi

# 4. 配置环境变量
echo -e "${GREEN}[4/8]${NC} 配置环境变量..."
if [ ! -f ".env" ]; then
  cat > .env <<EOF
DB_SYNCHRONIZE=false
DB_LOGGING=true
DB_TYPE=sqlite
DB_DATABASE=./data/stockhub.sqlite
JWT_SECRET=stockhub-jwt-secret-key-2026
JWT_EXPIRE=7d

# SMS配置（短信宝）
SMSBAO_USERNAME=mengge
SMSBAO_PASSWORD=045311047cb34738834164403ea30817

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# 应用配置
PORT=3000
NODE_ENV=production
EOF
  echo -e "${GREEN}✓ 环境变量配置成功${NC}"
else
  echo -e "${YELLOW}ℹ️  环境变量已配置，跳过...${NC}"
fi

# 5. 初始化数据库
echo -e "${GREEN}[5/8]${NC} 初始化数据库..."
mkdir -p data
if [ ! -f "data/stockhub.sqlite" ]; then
  node init-db.js
  echo -e "${GREEN}✓ 数据库初始化成功${NC}"
else
  echo -e "${YELLOW}ℹ️  数据库已存在，跳过...${NC}"
fi

# 6. 安装前端依赖并构建
echo -e "${GREEN}[6/8]${NC} 构建前端应用..."
cd ../frontend/domestic
if [ ! -d "node_modules" ]; then
  npm install
  npm run build
else
  npm run build
  echo -e "${GREEN}✓ 前端构建成功${NC}"
fi

# 7. 配置Nginx
echo -e "${GREEN}[7/8]${NC} 配置Nginx..."
sudo tee /etc/nginx/sites-available/cnsurpr > /dev/null <<EOF
server {
    listen 80;
    server_name cnsurpr.com www.cnsurpr.com;

    # 前端静态文件
    location / {
        root /var/www/stockhub/chinas-premium-inventory/frontend/domestic/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
EOF

sudo ln -sf /etc/nginx/sites-available/cnsurpr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
echo -e "${GREEN}✓ Nginx配置成功${NC}"

# 8. 启动后端应用（使用PM2）
echo -e "${GREEN}[8/8]${NC} 启动后端应用..."
cd /var/www/stockhub/chinas-premium-inventory/backend

# 检查PM2是否已运行
pm2 list | grep stockhub-api > /dev/null
if [ $? -eq 0 ]; then
  pm2 restart stockhub-api
  echo -e "${GREEN}✓ 后端应用已重启${NC}"
else
  pm2 start npm --name "stockhub-api" -- run start
  pm2 save
  pm2 startup
  echo -e "${GREEN}✓ 后端应用已启动${NC}"
fi

# 显示状态
echo ""
echo "=================================="
echo -e "${GREEN}✅ 部署完成！${NC}"
echo "=================================="
echo ""
echo "应用信息:"
echo "  后端API: http://47.236.244.51:3000"
echo "  前端应用: http://47.236.244.51"
echo "  API文档: http://47.236.244.51:3000/api/docs"
echo ""
echo "PM2状态:"
pm2 status
echo ""
echo "Nginx状态:"
sudo systemctl status nginx --no-pager
echo ""
echo "下一步:"
echo "  1. 配置DNS解析（cnsurpr.com → 47.236.244.51）"
echo "  2. 申请SSL证书"
echo "  3. 测试应用功能"
echo ""
