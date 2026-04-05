# StockHub 新加坡服务器部署指南

## 🌐 服务器信息

- **IP地址**: 47.236.244.51
- **域名**: cnsurpr.com（国际特卖网站）
- **操作系统**: Alibaba Cloud Linux 3.2104 LTS 64位
- **延迟**: 187ms
- **用途**: 国际用户访问
- **包管理器**: yum (RHEL/CentOS兼容)

---

## 🚀 快速开始

### 方式1: 一键部署（推荐）

```bash
# 在本地机器执行
cd /workspace/projects/stockhub
chmod +x scripts/deploy-to-singapore.sh
./scripts/deploy-to-singapore.sh
```

### 方式2: 手动部署

#### 步骤1: 连接服务器
```bash
ssh root@47.236.244.51
# 输入密码: Adwnzm2009
```

#### 步骤2: 执行配置脚本
```bash
# 上传脚本到服务器
cd /workspace/projects/stockhub
scp scripts/setup-singapore.sh root@47.236.244.51:~/
scp scripts/deploy-singapore.sh root@47.236.244.51:~/

# 在服务器上执行配置
ssh root@47.236.244.51
chmod +x ~/setup-singapore.sh
./setup-singapore.sh
```

#### 步骤3: 部署应用
```bash
chmod +x ~/deploy-singapore.sh
./deploy-singapore.sh
```

---

## ✅ Alibaba Cloud Linux 3 特性

### 优势
- ✅ **阿里云硬件优化**: 性能提升10-15%
- ✅ **RHEL/CentOS兼容**: 使用yum包管理器
- ✅ **长期支持**: 稳定可靠
- ✅ **国内软件源**: 下载速度快
- ✅ **性能调优**: 内核、网络、IO优化

### 包管理命令
```bash
# 更新系统
sudo yum update -y

# 安装软件
sudo yum install -y nginx

# 搜索软件
sudo yum search nginx

# 删除软件
sudo yum remove nginx

# 查看已安装
sudo yum list installed
```

### 防火墙管理
```bash
# 查看状态
sudo firewall-cmd --state

# 开放端口
sudo firewall-cmd --permanent --add-port=80/tcp

# 重载防火墙
sudo firewall-cmd --reload

# 查看规则
sudo firewall-cmd --list-all
```

---

## ✅ 验证部署

### 在本地执行验证脚本
```bash
cd /workspace/projects/stockhub
chmod +x scripts/verify-singapore.sh
./scripts/verify-singapore.sh
```

### 手动验证
```bash
# 1. 测试后端API
curl http://47.236.244.51:3000/api

# 2. 测试前端应用
curl http://47.236.244.51

# 3. 测试API文档
curl http://47.236.244.51:3000/api/docs

# 4. SSH查看PM2状态
ssh root@47.236.244.51 "pm2 status"

# 5. SSH查看Nginx状态
ssh root@47.236.244.51 "systemctl status nginx"
```

---

## 🔄 数据同步

### 启动数据同步服务
```bash
# 在本地机器执行
cd /workspace/projects/stockhub
chmod +x scripts/sync-data.sh
./scripts/sync-data.sh
```

### 配置定时同步（使用cron）
```bash
# 在香港服务器上配置cron
ssh root@14.103.87.246
crontab -e

# 添加以下行（每5分钟同步一次）
*/5 * * * * /var/www/stockhub/scripts/sync-data.sh >> /var/log/stockhub-sync.log 2>&1
```

---

## 🌐 域名配置

### DNS解析
在域名服务商（阿里云/腾讯云）配置DNS解析：

```
类型     主机记录         记录值
A        @              47.236.244.51
A        www            47.236.244.51
```

### 配置Nginx支持域名
```nginx
server {
    listen 80;
    server_name cnsurpr.com www.cnsurpr.com;

    # 其他配置...
}
```

---

## 🔒 SSL证书（可选）

### 使用Let's Encrypt免费证书
```bash
# 在新加坡服务器上执行
ssh root@47.236.244.51

# 安装certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d cnsurpr.com -d www.cnsurpr.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 📊 访问地址

| 服务 | 地址 |
|------|------|
| 前端应用 | http://47.236.244.51 |
| 后端API | http://47.236.244.51:3000 |
| API文档 | http://47.236.244.51:3000/api/docs |
| SSH连接 | ssh root@47.236.244.51 |

---

## 🛠️ 常用命令

### PM2管理
```bash
# 查看状态
pm2 status

# 重启应用
pm2 restart stockhub-api

# 停止应用
pm2 stop stockhub-api

# 查看日志
pm2 logs stockhub-api

# 监控
pm2 monit
```

### Nginx管理
```bash
# 查看状态
systemctl status nginx

# 重启Nginx
systemctl restart nginx

# 测试配置
nginx -t

# 查看日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 日志查看
```bash
# 后端日志
tail -f /var/www/stockhub/chinas-premium-inventory/backend/logs/stockhub-api.log

# Nginx日志
tail -f /var/log/nginx/cnsurpr.access.log
tail -f /var/log/nginx/cnsurpr.error.log
```

---

## ⚠️ 常见问题

### 问题1: SSH连接失败
```bash
# 解决方案
ping 47.236.244.51
# 检查网络是否通畅

# 检查SSH端口
telnet 47.236.244.51 22
```

### 问题2: Node.js安装失败（Alibaba Cloud Linux）
```bash
# 解决方案（使用yum）
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

### 问题3: Nginx无法启动
```bash
# 解决方案
sudo nginx -t
# 检查配置错误

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 重启服务
sudo systemctl restart nginx
```

### 问题4: PM2启动失败
```bash
# 解决方案
cd /var/www/stockhub/chinas-premium-inventory/backend
pm2 start npm --name "stockhub-api" -- run start
pm2 save
```

### 问题5: 防火墙配置（Alibaba Cloud Linux）
```bash
# 检查防火墙状态
sudo firewall-cmd --state

# 开放端口
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# 查看所有规则
sudo firewall-cmd --list-all
```

### 问题6: 权限问题
```bash
# 解决方案（修改目录所有者）
sudo chown -R stockhub:wheel /var/www/stockhub

# 或切换用户
sudo su - stockhub
cd /var/www/stockhub/chinas-premium-inventory/backend
pm2 start npm --name "stockhub-api" -- run start
```

### 问题7: 软件源问题
```bash
# 更新阿里云软件源
sudo yum clean all
sudo yum makecache
sudo yum update -y

# 如果仍然有问题，可以手动添加源
# 编辑 /etc/yum.repos.d/aliyun.repo
```

---

## 📞 技术支持

如遇问题，请联系：
- 贾维斯（AI助手）
- 阿里云技术支持

---

## 📋 部署清单

### Alibaba Cloud Linux 3 特定配置
- [x] 操作系统确认: Alibaba Cloud Linux 3.2104 LTS
- [x] 包管理器: yum
- [x] 防火墙: firewalld
- [x] 用户组: wheel (不是sudo)

### 阿里云服务（可选）
- [ ] OSS对象存储（图片存储）
- [ ] CDN加速（内容分发）
- [ ] SLB负载均衡
- [ ] WAF Web防火墙

---

**部署日期**: 2026-03-29
**最后更新**: 2026-03-29 03:35
**操作系统**: Alibaba Cloud Linux 3.2104 LTS 64位
**维护人**: 贾维斯
**版本**: v1.0 (Alibaba Cloud Linux 3优化版)
