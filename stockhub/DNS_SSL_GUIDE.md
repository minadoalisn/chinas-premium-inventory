# 🌐 DNS配置和SSL申请完整指南

## 📋 前置条件检查清单

### 必需条件
- [ ] 拥有cnsurpr.cn域名
- [ ] 拥有cnsurpr.com域名
- [ ] 域名已实名认证
- [ ] 云服务器80端口已开放
- [ ] 服务器防火墙允许80和443端口
- [ ] 云服务商已分配公网IP

---

## 🔧 步骤1: DNS解析配置

### 香港服务器 DNS配置

#### 阿里云配置步骤：
1. 登录 [阿里云管理控制台](https://ecs.console.aliyun.com)
2. 点击"域名" → "解析设置"
3. 找到 `cnsurpr.cn` 域名 → "解析设置"
4. 添加A记录：

```
记录类型: A
主机记录: @
记录值: 8.210.194.187 (请先在ECS控制台确认公网IP)
TTL: 600
```

#### 验证DNS解析：
```bash
# 等待DNS生效后（5-10分钟），执行以下命令验证
nslookup cnsurpr.cn
# 或
dig cnsurpr.cn
# 或
curl http://cnsurpr.cn
```

### 新加坡服务器 DNS配置

#### 腾讯云配置步骤：
1. 登录 [腾讯云管理控制台](https://console.cloud.tencent.com)
2. 点击"域名服务" → "DNS解析"
3. 找到 `cnsurpr.com` 域名 → "解析设置"
4. 添加A记录：

```
记录类型: A
主机记录: @
记录值: 47.236.244.51
TTL: 600
```

#### 验证DNS解析：
```bash
nslookup cnsurpr.com
# 或
dig cnsurpr.com
# 或
curl http://cnsurpr.com
```

---

## 🔒 步骤2: SSL证书申请

### ⚠️ 重要前提
SSL证书必须使用**域名**申请，**不能使用IP地址**！

### 香港服务器SSL申请

#### 前提条件
- ✅ DNS解析已生效（cnsurpr.cn → 8.210.194.187）
- ✅ 80端口已开放
- ✅ 防火墙已配置

#### 申请步骤
1. **SSH登录香港服务器**
```bash
ssh -i /root/.ssh/stockhub_hongkong root@8.210.194.187
```

2. **申请SSL证书**
```bash
certbot --nginx --non-interactive --agree-tos --email='admin@cnsurpr.cn' --domains='cnsurpr.cn,www.cnsurpr.cn' --redirect --force-renewal
```

3. **验证证书**
```bash
# 检查证书是否自动配置到Nginx
ls -la /etc/letsencrypt/live/cnsurpr.cn/

# 测试HTTPS访问
curl -I https://cnsurpr.cn
```

### 新加坡服务器SSL申请

#### 前提条件
- ✅ DNS解析已生效（cnsurpr.com → 47.236.244.51）
- ✅ 80端口已开放
- ✅ 防火墙已配置

#### 申请步骤
1. **SSH登录新加坡服务器**
```bash
ssh -i /root/.ssh/stockhub_singapore root@47.236.244.51
```

2. **申请SSL证书**
```bash
certbot --nginx --non-interactive --agree-tos --email='admin@cnsurpr.com' --domains='cnsurpr.com,www.cnsurpr.com' --redirect --force-renewal
```

3. **验证证书**
```bash
# 检查证书
ls -la /etc/letsencrypt/live/cnsurpr.com/

# 测试HTTPS访问
curl -I https://cnsurpr.com
```

---

## 🔄 SSL证书自动续期

Let's Encrypt证书有效期为90天，自动续期已配置：

### 验证自动续期
```bash
# 测试自动续期配置
certbot renew --dry-run

# 查看续期定时任务
systemctl list-timers | grep certbot
```

### 手动续期
```bash
certbot renew --force-renewal
```

---

## 🛡️ 安全加固

### 防火墙配置（阿里云）

#### 香港服务器
1. 登录阿里云控制台 → ECS实例管理
2. 点击"安全组" → "配置规则"
3. 添加入站规则：

| 协议类型 | 端口 | 授权对象 |
|---------|------|---------|
| TCP | 22 | 0.0.0.0/0（建议限制特定IP）|
| TCP | 80 | 0.0.0.0/0 |
| TCP | 443 | 0.0.0.0/0 |

#### 新加坡服务器
1. 登录腾讯云控制台 → CVM实例管理
2. 点击"安全组" → "添加规则"
3. 添加入站规则：

| 协议类型 | 端口 | 授权对象 |
|---------|------|---------|
| TCP | 22 | 0.0.0.0/0（建议限制特定IP）|
| TCP | 80 | 0.0.0.0/0 |
| TCP | 443 | 0.0.0.0/0 |

### 服务器内部防火墙

#### 两台服务器都执行：
```bash
# 开放必要端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh

# 允许SSH访问（建议限制IP）
firewall-cmd --permanent --add-port=22/tcp

# 重启防火墙
firewall-cmd --reload

# 查看状态
firewall-cmd --list-all
```

---

## 📋 验证清单

### 香港服务器
- [ ] DNS解析生效（cnsurpr.cn → 8.210.194.187）
- [ ] HTTP访问正常（http://cnsurpr.cn）
- [ ] HTTPS访问正常（https://cnsurpr.cn）
- [ ] SSL证书有效
- [ ] 自动续期已配置

### 新加坡服务器
- [ ] DNS解析生效（cnsurpr.com → 47.236.244.51）
- [ ] HTTP访问正常（http://cnsurpr.com）
- [ ] HTTPS访问正常（https://cnsurpr.com）
- [ ] SSL证书有效
- [ ] 自动续期已配置

---

## 🚨 故障排查

### DNS解析问题
```bash
# 检查DNS解析
nslookup cnsurpr.cn
dig cnsurpr.cn

# 检查本地hosts
cat /etc/hosts

# 检查域名注册商配置
whois cnsurpr.cn
```

### SSL申请失败
```bash
# 查看certbot日志
tail -100 /var/log/letsencrypt/letsencrypt.log

# 测试80端口
curl -I http://localhost:80

# 测试域名访问
curl -I http://cnsurpr.cn
```

### 防火墙问题
```bash
# 检查防火墙状态
systemctl status firewalld

# 检查端口监听
netstat -tlnp | grep -E ':(22|80|443)'

# 检查云服务商安全组
# 需要在云服务商控制台查看
```

---

## 📝 配置完成确认

完成以下配置后，请告知我：

1. ✅ DNS解析已配置
2. ✅ 防火墙已开放端口
3. ✅ HTTPS可访问
4. ✅ SSL证书已申请

**收到确认后，我将进行后续优化配置！**

---

**文档版本**: v1.0  
**更新时间**: 2026-03-29 14:25  
**适用服务器**: 香港(8.210.194.187) + 新加坡(47.236.244.51)
