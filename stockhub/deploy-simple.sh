#!/bin/bash

# ==========================================
# StockHub 简化部署脚本
# ==========================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  StockHub 部署包生成器${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

BACKEND_DIR="/workspace/projects/stockhub/backend"
FRONTEND_DIR="/workspace/projects/stockhub/frontend/domestic"
DEPLOY_DIR="/workspace/projects/stockhub/deploy-package"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}[1/4]${NC} 清理旧部署包..."
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 复制后端文件
echo -e "${GREEN}[2/4]${NC} 复制后端文件..."
mkdir -p $DEPLOY_DIR/backend
rsync -av --exclude='node_modules' --exclude='dist' --exclude='logs' --exclude='data' \
    $BACKEND_DIR/ $DEPLOY_DIR/backend/

# 复制前端文件
echo -e "${GREEN}[3/4]${NC} 复制前端文件..."
mkdir -p $DEPLOY_DIR/frontend/dist
cp -r $FRONTEND_DIR/dist/* $DEPLOY_DIR/frontend/dist/

# 创建部署脚本
echo -e "${GREEN}[4/4]${NC} 生成服务器部署脚本..."
cat > $DEPLOY_DIR/install.sh << 'EOF'
#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  StockHub 服务器安装${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 1. 安装Node.js
echo -e "${GREEN}[1/6]${NC} 检查Node.js..."
if ! command -v node &> /dev/null; then
    echo "安装Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
node --version
npm --version

# 2. 安装Nginx
echo -e "${GREEN}[2/6]${NC} 检查Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "安装Nginx..."
    apt-get install -y nginx
fi
nginx -v

# 3. 创建目录
echo -e "${GREEN}[3/6]${NC} 创建项目目录..."
mkdir -p /var/www/stockhub
cd /var/www/stockhub

# 4. 安装后端依赖
echo -e "${GREEN}[4/6]${NC} 安装后端依赖..."
cd backend
npm install --production

# 5. 配置环境变量
echo -e "${GREEN}[5/6]${NC} 配置环境变量..."
cat > .env << 'ENVEOF'
DB_SYNCHRONIZE=false
DB_LOGGING=true
DB_TYPE=sqlite
DB_DATABASE=./data/stockhub.sqlite
JWT_SECRET=stockhub-jwt-secret-key-2026
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=production
SMSBAO_USERNAME=mengge
SMSBAO_PASSWORD=045311047cb34738834164403ea30817
ENVEOF

# 初始化数据库
mkdir -p data logs
node init-db.js

# 6. 启动应用
echo -e "${GREEN}[6/6]${NC} 启动应用..."
# 停止旧进程
pkill -f "node.*dist/main" 2>/dev/null || true

# 构建和启动
npm run build
nohup node dist/main.js > logs/backend.log 2>&1 &

sleep 3

if pgrep -f "node.*dist/main" > /dev/null; then
    echo -e "${GREEN}  ✓ 后端启动成功${NC}"
else
    echo -e "${YELLOW}  ⚠ 检查日志${NC}"
    tail -20 logs/backend.log
fi

# 7. 配置Nginx
echo -e "${GREEN}[7/7]${NC} 配置Nginx..."
cat > /etc/nginx/sites-available/stockhub << 'NGINXEOF'
server {
    listen 80;
    server_name _;

    location / {
        root /var/www/stockhub/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/json;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/stockhub /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 测试
echo ""
echo -e "${GREEN}测试API连接...${NC}"
curl -s http://localhost:3000/api/categories | head -20

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✅ 安装完成！${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "访问地址: http://$(hostname -I | awk '{print $1}')"
echo "API文档: http://$(hostname -I | awk '{print $1}')/api/docs"
echo ""
EOF

chmod +x $DEPLOY_DIR/install.sh

# 打包
echo -e "${GREEN}创建部署包...${NC}"
cd $DEPLOY_DIR
tar -czf stockhub-deploy-${TIMESTAMP}.tar.gz backend/ frontend/ install.sh
md5sum stockhub-deploy-${TIMESTAMP}.tar.gz > checksum.txt

# 完成
echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✅ 部署包生成完成！${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "📦 部署包: $DEPLOY_DIR/stockhub-deploy-${TIMESTAMP}.tar.gz"
echo "📏 大小: $(du -h $DEPLOY_DIR/stockhub-deploy-${TIMESTAMP}.tar.gz | cut -f1)"
echo "🔐 校验:"
cat $DEPLOY_DIR/checksum.txt
echo ""
echo "📋 服务器部署步骤:"
echo "  1. scp stockhub-deploy-${TIMESTAMP}.tar.gz root@服务器IP:/root/"
echo "  2. ssh root@服务器IP"
echo "  3. tar -xzf stockhub-deploy-${TIMESTAMP}.tar.gz -C /var/www/stockhub/"
echo "  4. cd /var/www/stockhub && ./install.sh"
echo ""
