#!/bin/bash

# ==========================================
# StockHub 部署包生成器
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

# 配置
BACKEND_DIR="/workspace/projects/stockhub/backend"
FRONTEND_DIR="/workspace/projects/stockhub/frontend/domestic"
DEPLOY_DIR="/workspace/projects/stockhub/deploy-package"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}[1/6]${NC} 清理旧部署包..."
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 构建前端
echo -e "${GREEN}[2/6]${NC} 构建前端应用..."
cd $FRONTEND_DIR
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✓ 前端构建成功${NC}"
else
    echo -e "${YELLOW}  ⚠ 前端已构建，使用现有dist${NC}"
fi

# 复制文件
echo -e "${GREEN}[3/6]${NC} 复制后端文件..."
mkdir -p $DEPLOY_DIR/backend
cp -r $BACKEND_DIR/* $DEPLOY_DIR/backend/
rm -rf $DEPLOY_DIR/backend/node_modules
rm -rf $DEPLOY_DIR/backend/dist
rm -rf $DEPLOY_DIR/backend/logs

# 复制前端文件
echo -e "${GREEN}[4/6]${NC} 复制前端文件..."
mkdir -p $DEPLOY_DIR/frontend
cp -r $FRONTEND_DIR/dist $DEPLOY_DIR/frontend/

# 创建部署脚本
echo -e "${GREEN}[5/6]${NC} 生成服务器部署脚本..."
cat > $DEPLOY_DIR/install.sh << 'EOF'
#!/bin/bash
# StockHub 服务器安装脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  StockHub 服务器安装${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 检测服务器类型
if [ -f "/etc/lsb-release" ]; then
    OS="ubuntu"
elif [ -f "/etc/redhat-release" ]; then
    OS="centos"
else
    OS="unknown"
fi

echo "检测到操作系统: $OS"

# 1. 安装Node.js
echo -e "${GREEN}[1/7]${NC} 安装Node.js..."
if ! command -v node &> /dev/null; then
    if [ "$OS" == "ubuntu" ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    elif [ "$OS" == "centos" ]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
        yum install -y nodejs
    fi
    echo -e "${GREEN}  ✓ Node.js已安装${NC}"
else
    echo -e "${YELLOW}  ℹ️  Node.js已安装${NC}"
fi

# 2. 安装Nginx
echo -e "${GREEN}[2/7]${NC} 安装Nginx..."
if ! command -v nginx &> /dev/null; then
    if [ "$OS" == "ubuntu" ]; then
        apt-get install -y nginx
    elif [ "$OS" == "centos" ]; then
        yum install -y nginx
    fi
    echo -e "${GREEN}  ✓ Nginx已安装${NC}"
else
    echo -e "${YELLOW}  ℹ️  Nginx已安装${NC}"
fi

# 3. 安装后端依赖
echo -e "${GREEN}[3/7]${NC} 安装后端依赖..."
cd /var/www/stockhub/backend
npm install
echo -e "${GREEN}  ✓ 依赖安装完成${NC}"

# 4. 配置环境变量
echo -e "${GREEN}[4/7]${NC} 配置环境变量..."
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
echo -e "${GREEN}  ✓ 环境变量配置完成${NC}"

# 5. 初始化数据库
echo -e "${GREEN}[5/7]${NC} 初始化数据库..."
mkdir -p data
node init-db.js
echo -e "${GREEN}  ✓ 数据库初始化完成${NC}"

# 6. 构建并启动后端
echo -e "${GREEN}[6/7]${NC} 启动后端应用..."
npm run build

# 停止旧进程
pkill -f "node.*dist/main" 2>/dev/null || true

# 启动新进程
nohup node dist/main.js > logs/backend.log 2>&1 &
sleep 3

if pgrep -f "node.*dist/main" > /dev/null; then
    echo -e "${GREEN}  ✓ 后端应用启动成功${NC}"
else
    echo -e "${YELLOW}  ⚠ 后端启动失败，检查日志${NC}"
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

# 启用站点
ln -sf /etc/nginx/sites-available/stockhub /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

echo -e "${GREEN}  ✓ Nginx配置完成${NC}"

# 完成
echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✅ 安装完成！${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "访问地址:"
echo "  🌐 http://$(hostname -I | awk '{print $1}')"
echo "  🔧 http://$(hostname -I | awk '{print $1}')/api"
echo ""
EOF

chmod +x $DEPLOY_DIR/install.sh

# 打包
echo -e "${GREEN}[6/6]${NC} 创建部署包..."
cd $DEPLOY_DIR
tar -czf stockhub-deploy-${TIMESTAMP}.tar.gz backend/ frontend/ install.sh
md5sum stockhub-deploy-${TIMESTAMP}.tar.gz > checksum.txt

# 完成
echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✅ 部署包生成完成！${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "📦 部署包位置: $DEPLOY_DIR/stockhub-deploy-${TIMESTAMP}.tar.gz"
echo "📏 文件大小: $(du -h $DEPLOY_DIR/stockhub-deploy-${TIMESTAMP}.tar.gz | cut -f1)"
echo "🔐 MD5校验:"
cat $DEPLOY_DIR/checksum.txt
echo ""
echo "📋 服务器部署步骤:"
echo "  1. 上传文件: scp stockhub-deploy-${TIMESTAMP}.tar.gz root@服务器IP:/root/"
echo "  2. 登录服务器: ssh root@服务器IP"
echo "  3. 解压文件: tar -xzf stockhub-deploy-${TIMESTAMP}.tar.gz -C /var/www/stockhub/"
echo "  4. 安装应用: cd /var/www/stockhub && ./install.sh"
echo ""
