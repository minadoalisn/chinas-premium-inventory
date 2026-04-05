#!/bin/bash

# ==========================================
# StockHub 香港服务器初始化脚本
# Alibaba Cloud Linux 3.2104 LTS
# ==========================================

set -e

echo "🚀 开始配置香港服务器 (Alibaba Cloud Linux 3)..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 更新系统
echo -e "${GREEN}[1/10]${NC} 更新系统..."
sudo yum update -y

# 2. 设置时区
echo -e "${GREEN}[2/10]${NC} 设置时区为 Asia/Shanghai..."
sudo timedatectl set-timezone Asia/Shanghai

# 3. 设置主机名
echo -e "${GREEN}[3/10]${NC} 设置主机名..."
sudo hostnamectl set-hostname cnsurpr-hk

# 4. 创建应用用户
echo -e "${GREEN}[4/10]${NC} 创建应用用户 stockhub..."
if ! id -u stockhub > /dev/null 2>&1; then
  sudo useradd -m -s /bin/bash stockhub
  sudo usermod -aG wheel stockhub
  echo -e "${GREEN}✓ 用户 stockhub 创建成功${NC}"
else
  echo -e "${YELLOW}ℹ️  用户 stockhub 已存在${NC}"
fi

# 5. 安装基础工具
echo -e "${GREEN}[5/10]${NC} 安装基础工具..."
sudo yum install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  net-tools \
  unzip \
  gcc \
  gcc-c++ \
  make \
  python3 \
  python3-pip

# 6. 安装Node.js 20 (使用yum)
echo -e "${GREEN}[6/10]${NC} 安装Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  sudo yum install -y nodejs
  echo -e "${GREEN}✓ Node.js $(node -v) 安装成功${NC}"
  echo -e "${GREEN}✓ npm $(npm -v) 安装成功${NC}"
else
  echo -e "${YELLOW}ℹ️  Node.js $(node -v) 已安装${NC}"
fi

# 7. 安装PM2（进程管理）
echo -e "${GREEN}[7/10]${NC} 安装PM2..."
sudo npm install -g pm2

# 8. 安装Nginx
echo -e "${GREEN}[8/10]${NC} 安装Nginx..."
if ! command -v nginx &> /dev/null; then
  sudo yum install -y nginx
  sudo systemctl enable nginx
  sudo systemctl start nginx
  echo -e "${GREEN}✓ Nginx 安装成功${NC}"
else
  echo -e "${YELLOW}ℹ️  Nginx 已安装${NC}"
fi

# 9. 安装Redis
echo -e "${GREEN}[9/10]${NC} 安装Redis..."
if ! command -v redis-server &> /dev/null; then
  sudo yum install -y redis
  sudo systemctl enable redis
  sudo systemctl start redis
  echo -e "${GREEN}✓ Redis 安装成功${NC}"
else
  echo -e "${YELLOW}ℹ️  Redis 已安装${NC}"
fi

# 10. 配置防火墙（使用firewalld）
echo -e "${GREEN}[10/10]${NC} 配置防火墙..."
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=5173/tcp
sudo firewall-cmd --reload
echo -e "${GREEN}✓ 防火墙配置成功${NC}"

# 11. 创建交换空间（可选）
echo -e "${GREEN}[11/11]${NC} 创建交换空间..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 4G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo -e "${GREEN}✓ 4GB 交换空间创建成功${NC}"
else
  echo -e "${YELLOW}ℹ️  交换空间已存在${NC}"
fi

# 12. 创建项目目录
echo -e "${GREEN}[12/12]${NC} 创建项目目录..."
sudo mkdir -p /var/www/stockhub
sudo chown -R stockhub:stockhub /var/www/stockhub
echo -e "${GREEN}✓ 项目目录创建成功${NC}"

# 显示系统信息
echo ""
echo "=================================="
echo -e "${GREEN}✅ 服务器配置完成！${NC}"
echo "=================================="
echo ""
echo "系统信息:"
echo "  操作系统: Alibaba Cloud Linux 3.2104 LTS"
echo "  内核版本: $(uname -r)"
echo "  主机名: $(hostname)"
echo "  时区: $(timedatectl | grep "Time zone" | awk '{print $3}')"
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "  Redis: $(redis-server --version)"
echo ""
echo "网络配置:"
echo "  IP地址: $(hostname -I | awk '{print $1}')"
echo "  防火墙: $(sudo firewall-cmd --state)"
echo ""
echo "下一步:"
echo "  1. 克隆项目代码"
echo "  2. 安装依赖"
echo "  3. 配置环境变量"
echo "  4. 启动应用"
echo ""
