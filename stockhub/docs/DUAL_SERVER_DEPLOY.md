# StockHub 双服务器部署指南

## 🌐 服务器信息

### 香港服务器（cnsurpr.cn）
- **域名**: cnsurpr.cn
- **内网IP**: 172.22.249.225
- **密码**: Adwnzm2009
- **操作系统**: Alibaba Cloud Linux 3.2104 LTS 64位
- **用途**: 国内用户访问
- **角色**: 主数据库（写入）

### 新加坡服务器（cnsurpr.com）
- **域名**: cnsurpr.com
- **公网IP**: 47.236.244.51
- **密码**: Adwnzm2009
- **操作系统**: Alibaba Cloud Linux 3.2104 LTS 64位
- **用途**: 国际用户访问
- **角色**: 从数据库（只读）

---

## 🏗️ 双服务器架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户访问                               │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   GeoDNS/CDN     │
                    └─────────┬─────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
      ┌───────▼────────┐           ┌──────▼────────┐
      │  香港服务器     │           │  新加坡服务器   │
      │  172.22.249.225 │           │  47.236.244.51  │
      │  cnsurpr.cn    │           │  cnsurpr.com    │
      │  Alibaba       │           │  Alibaba       │
      │  Linux 3      │           │  Linux 3      │
      └───────┬────────┘           └──────┬────────┘
              │                               │
              │     内网同步（VPC）       │
              │                               │
              └───────────────┬───────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   数据同步服务     │
                    │  MySQL主从复制    │
                    │  Redis集群        │
                    └───────────────────┘
```

---

## 🚀 快速开始

### 部署香港服务器

```bash
# 在本地机器执行
cd /workspace/projects/stockhub
chmod +x scripts/deploy-to-hongkong.sh
./scripts/deploy-to-hongkong.sh
```

### 部署新加坡服务器

```bash
# 在本地机器执行
cd /workspace/projects/stockhub
chmod +x scripts/deploy-to-singapore.sh
./scripts/deploy-to-singapore.sh
```

### 验证部署

```bash
# 验证香港服务器
cd /workspace/projects/stockhub
chmod +x scripts/verify-hongkong.sh
./scripts/verify-hongkong.sh

# 验证新加坡服务器
chmod +x scripts/verify-singapore.sh
./scripts/verify-singapore.sh
```

### 启动数据同步

```bash
# 在本地机器执行（持续运行）
cd /workspace/projects/stockhub
chmod +x scripts/sync-data-dual.sh
./scripts/sync-data-dual.sh
```

---

## 📋 完整部署步骤

### 第1步: 部署香港服务器

#### 方式1: 一键部署（推荐）
```bash
cd /workspace/projects/stockhub
./scripts/deploy-to-hongkong.sh
```

#### 方式2: 手动部署
```bash
# 连接服务器
ssh root@172.22.249.225
# 密码: Adwnzm2009

# 执行配置
chmod +x ~/setup-hongkong.sh
./setup-hongkong.sh

# 部署应用
chmod +x ~/deploy-hongkong.sh
./deploy-hongkong.sh
```

---

### 第2步: 部署新加坡服务器

#### 方式1: 一键部署（推荐）
```bash
cd /workspace/projects/stockhub
./scripts/deploy-to-singapore.sh
```

#### 方式2: 手动部署
```bash
# 连接服务器
ssh root@47.236.244.51
# 密码: Adwnzm2009

# 执行配置
chmod +x ~/setup-singapore.sh
./setup-singapore.sh

# 部署应用
chmod +x ~/deploy-singapore.sh
./deploy-singapore.sh
```

---

### 第3步: 配置DNS解析

在域名服务商（阿里云/腾讯云）配置DNS解析：

#### cnsurpr.cn（国内域名）
```
类型     主机记录         记录值
A        @              <香港公网IP>
A        www            <香港公网IP>
```

#### cnsurpr.com（国际域名）
```
类型     主机记录         记录值
A        @              47.236.244.51
A        www            47.236.244.51
```

⚠️ **注意**: 需要提供香港服务器的公网IP

---

### 第4步: 申请SSL证书

#### 香港服务器
```bash
ssh root@172.22.249.225
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cnsurpr.cn -d www.cnsurpr.cn
```

#### 新加坡服务器
```bash
ssh root@47.236.244.51
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cnsurpr.com -d www.cnsurpr.com
```

---

### 第5步: 配置数据同步

```bash
# 在本地机器启动数据同步服务
cd /workspace/projects/stockhub
./scripts/sync-data-dual.sh
```

---

## 🔄 数据同步方案

### 方案1: 定时同步（当前推荐）
```bash
# 每5分钟同步一次
cd /workspace/projects/stockhub
./scripts/sync-data-dual.sh
```

### 方案2: 使用cron定时任务（推荐）
```bash
# 在香港服务器上配置cron
ssh root@172.22.249.225
crontab -e

# 添加以下行（每5分钟同步一次）
*/5 * * * * /var/www/stockhub/scripts/sync-data-dual.sh >> /var/log/stockhub-sync.log 2>&1
```

### 方案3: MySQL主从复制（高级）
```bash
# 在香港主库配置
server-id = 1
log-bin = mysql-bin
binlog-format = ROW

# 在新加坡从库配置
server-id = 2
relay-log = mysql-relay
read-only = 1
replicaof <香港内网IP> 3306
masterauth <password>
```

---

## ✅ 验证部署

### 香港服务器验证
```bash
# 执行验证脚本
cd /workspace/projects/stockhub
./scripts/verify-hongkong.sh
```

### 新加坡服务器验证
```bash
# 执行验证脚本
cd /workspace/projects/stockhub
./scripts/verify-singapore.sh
```

### 手动验证
```bash
# 测试香港服务器
curl http://172.22.249.225:3000/api

# 测试新加坡服务器
curl http://47.236.244.51:3000/api
```

---

## 📊 访问地址

| 服务 | 香港服务器 | 新加坡服务器 |
|------|-----------|-------------|
| 前端应用 | http://cnsurpr.cn | http://cnsurpr.com |
| 后端API | http://cnsurpr.cn:3000 | http://cnsurpr.com:3000 |
| API文档 | http://cnsurpr.cn:3000/api/docs | http://cnsurpr.com:3000/api/docs |
| SSH连接 | ssh root@172.22.249.225 | ssh root@47.236.244.51 |

---

## 🛠️ 常用命令

### PM2管理
```bash
# 香港服务器
ssh root@172.22.249.225 "pm2 status"
ssh root@172.22.249.225 "pm2 restart stockhub-api"

# 新加坡服务器
ssh root@47.236.244.51 "pm2 status"
ssh root@47.236.244.51 "pm2 restart stockhub-api"
```

### Nginx管理
```bash
# 香港服务器
ssh root@172.22.249.225 "systemctl status nginx"
ssh root@172.22.249.225 "systemctl restart nginx"

# 新加坡服务器
ssh root@47.236.244.51 "systemctl status nginx"
ssh root@47.236.244.51 "systemctl restart nginx"
```

### 查看日志
```bash
# 香港服务器后端日志
ssh root@172.22.249.225 "pm2 logs stockhub-api"

# 新加坡服务器后端日志
ssh root@47.236.244.51 "pm2 logs stockhub-api"
```

---

## ⚠️ 常见问题

### 问题1: 香港服务器内网IP无法从外部访问
**解决方案**: 需要配置公网IP和DNS解析，或通过VPN访问

### 问题2: 两台服务器无法互通
**解决方案**: 检查VPC配置，确保两台服务器在相同VPC或VPC互通

### 问题3: 数据同步失败
**解决方案**: 检查网络连接和SSH权限，确认两台服务器可以互相访问

### 问题4: Node.js版本不一致
**解决方案**: 两台服务器都使用相同版本的Node.js 20

---

## 📋 部署清单

### 香港服务器
- [x] IP地址: 172.22.249.225
- [x] 密码: Adwnzm2009
- [x] 操作系统: Alibaba Cloud Linux 3.2104 LTS
- [x] 部署脚本: setup-hongkong.sh
- [x] 部署脚本: deploy-hongkong.sh
- [x] 验证脚本: verify-hongkong.sh
- [ ] 公网IP配置
- [ ] DNS解析配置
- [ ] SSL证书申请

### 新加坡服务器
- [x] IP地址: 47.236.244.51
- [x] 密码: Adwnzm2009
- [x] 操作系统: Alibaba Cloud Linux 3.2104 LTS
- [x] 部署脚本: setup-singapore.sh
- [x] 部署脚本: deploy-singapore.sh
- [x] 验证脚本: verify-singapore.sh
- [ ] DNS解析配置
- [ ] SSL证书申请

### 数据同步
- [x] 同步脚本: sync-data-dual.sh
- [ ] 数据同步服务启动
- [ ] MySQL主从复制配置（可选）
- [ ] Redis集群配置（可选）

---

## 📖 文档

| 文档 | 位置 | 说明 |
|------|------|------|
| **双服务器指南** | `docs/DUAL_SERVER_DEPLOY.md` | 本文档 |
| **香港部署指南** | `docs/DEPLOY_HONGKONG.md` | 香港服务器详细部署 |
| **新加坡部署指南** | `docs/DEPLOY_SINGAPORE.md` | 新加坡服务器详细部署 |

---

**部署日期**: 2026-03-29
**最后更新**: 2026-03-29 03:42
**维护人**: 贾维斯
**版本**: v1.0 (双服务器版)
