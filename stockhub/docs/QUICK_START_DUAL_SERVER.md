# StockHub 双服务器快速开始指南

## 🌐 服务器配置

| 服务器 | 域名 | IP地址 | 密码 | 操作系统 | 角色 |
|--------|------|--------|------|---------|------|
| **香港** | cnsurpr.cn | 172.22.249.225 | Adwnzm2009 | Alibaba Cloud Linux 3.2104 LTS | 主数据库 |
| **新加坡** | cnsurpr.com | 47.236.244.51 | Adwnzm2009 | Alibaba Cloud Linux 3.2104 LTS | 从数据库 |

---

## 🚀 快速部署（3步）

### 第1步: 部署香港服务器

```bash
cd /workspace/projects/stockhub
./scripts/deploy-to-hongkong.sh
```

**或手动部署**:
```bash
ssh root@172.22.249.225
# 密码: Adwnzm2009
chmod +x ~/setup-hongkong.sh
./setup-hongkong.sh
chmod +x ~/deploy-hongkong.sh
./deploy-hongkong.sh
```

---

### 第2步: 部署新加坡服务器

```bash
cd /workspace/projects/stockhub
./scripts/deploy-to-singapore.sh
```

**或手动部署**:
```bash
ssh root@47.236.244.51
# 密码: Adwnzm2009
chmod +x ~/setup-singapore.sh
./setup-singapore.sh
chmod +x ~/deploy-singapore.sh
./deploy-singapore.sh
```

---

### 第3步: 启动数据同步

```bash
cd /workspace/projects/stockhub
./scripts/sync-data-dual.sh
```

---

## ✅ 验证部署

```bash
# 验证香港服务器
./scripts/verify-hongkong.sh

# 验证新加坡服务器
./scripts/verify-singapore.sh
```

---

## 📊 访问地址

| 服务 | 地址 |
|------|------|
| 香港前端 | http://cnsurpr.cn |
| 新加坡前端 | http://cnsurpr.com |
| 香港API | http://cnsurpr.cn:3000 |
| 新加坡API | http://cnsurpr.com:3000 |

---

## 🔄 数据同步

### 手动同步（测试）
```bash
./scripts/sync-data-dual.sh
```

### 自动同步（生产）
```bash
# 在香港服务器上配置cron
ssh root@172.22.249.225
crontab -e
# 添加: */5 * * * * /var/www/stockhub/scripts/sync-data-dual.sh >> /var/log/stockhub-sync.log 2>&1
```

---

## 🛠️ 常用操作

### 查看香港服务状态
```bash
ssh root@172.22.249.225 "pm2 status"
```

### 查看新加坡服务状态
```bash
ssh root@47.236.244.51 "pm2 status"
```

### 重启香港服务
```bash
ssh root@172.22.249.225 "pm2 restart stockhub-api"
```

### 重启新加坡服务
```bash
ssh root@47.236.244.51 "pm2 restart stockhub-api"
```

---

## 📋 脚本清单

| 脚本 | 用途 | 执行方式 |
|------|------|---------|
| `setup-hongkong.sh` | 香港服务器初始化 | 在服务器上执行 |
| `deploy-hongkong.sh` | 香港应用部署 | 在服务器上执行 |
| `deploy-to-hongkong.sh` | 一键部署到香港 | 本地执行 |
| `verify-hongkong.sh` | 香港部署验证 | 本地执行 |
| `setup-singapore.sh` | 新加坡服务器初始化 | 在服务器上执行 |
| `deploy-singapore.sh` | 新加坡应用部署 | 在服务器上执行 |
| `deploy-to-singapore.sh` | 一键部署到新加坡 | 本地执行 |
| `verify-singapore.sh` | 新加坡部署验证 | 本地执行 |
| `sync-data-dual.sh` | 双服务器数据同步 | 本地执行（持续） |

---

## 📞 需要帮助？

- **完整文档**: `docs/DUAL_SERVER_DEPLOY.md`
- **香港文档**: `docs/DEPLOY_HONGKONG.md`
- **新加坡文档**: `docs/DEPLOY_SINGAPORE.md`

---

**快速开始日期**: 2026-03-29
**维护人**: 贾维斯
