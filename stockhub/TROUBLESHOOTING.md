# StockHub 部署故障排查与解决方案

## 🔴 当前问题

### 网络连接失败
```
❌ SSH连接: Connection timed out
❌ Ping测试: 100% packet loss
❌ 端口22: 无法连接
```

### 影响范围
- **香港服务器**: 172.22.249.225 (cnsurpr.cn)
- **新加坡服务器**: 47.236.244.51 (cnsurpr.com)
- **SSH密码**: Adwnzm2009 ✅ 已记录

---

## 🔍 可能原因

### 1. 网络隔离
- 当前环境与服务器不在同一网络
- 需要VPN或专用网络访问
- 服务器可能有IP白名单限制

### 2. 防火墙限制
- 服务器防火墙阻止SSH连接
- 云服务提供商的安全组配置
- 网络设备（路由器/交换机）过滤

### 3. 服务器状态
- 服务器未启动
- SSH服务未运行
- 网络配置错误

### 4. IP地址错误
- IP地址已变更
- 需要使用域名而非IP
- 内网/外网地址混淆

---

## 💡 解决方案

### 方案A: 检查服务器控制面板

#### 阿里云
1. 登录阿里云控制台
2. 进入ECS实例管理
3. 检查服务器状态
4. 配置安全组规则：
   - 开放SSH端口22
   - 开放HTTP端口80
   - 开放HTTPS端口443

#### 腾讯云
1. 登录腾讯云控制台
2. 进入CVM实例管理
3. 检查服务器状态
4. 配置安全组：
   - 添加入站规则（22, 80, 443）
   - 允许来源IP：0.0.0.0/0

#### 其他云服务商
- AWS → Security Groups
- Google Cloud → Firewall Rules
- Vultr → Firewall

---

### 方案B: 使用云服务商Web终端

#### 阿里云
1. 控制台 → ECS实例
2. 点击"远程连接"
3. 选择"Workbench"
4. 复制粘贴部署命令

#### 腾讯云
1. 控制台 → CVM实例
2. 点击"登录"
3. 选择"VNC登录"
4. 复制粘贴部署命令

#### 通用Web终端命令
```bash
# 创建目录
mkdir -p /var/www/stockhub

# 下载部署包（如果可以从其他地方下载）
# 或者上传部署包到服务器

# 解压
cd /var/www/stockhub
tar -xzf stockhub-deploy-20260329_100622.tar.gz

# 执行安装
./install.sh
```

---

### 方案C: 使用SFTP/FTP上传

#### FileZilla
1. 新建站点连接：
   - 主机: 172.22.249.225
   - 用户: root
   - 密码: Adwnzm2009
   - 端口: 22

2. 上传文件：
   - 上传 stockhub-deploy-20260329_100622.tar.gz
   - 上传到 /root/ 目录

3. 通过Web终端执行安装

#### WinSCP
1. 新建站点连接
2. 上传部署包
3. 执行安装脚本

---

### 方案D: 检查并修复服务器SSH

#### 步骤1: 通过Web终端登录
```bash
# 检查SSH服务状态
systemctl status sshd

# 如果未运行，启动SSH
systemctl start sshd
systemctl enable sshd

# 检查防火墙
firewall-cmd --list-all
# 或
ufw status

# 开放SSH端口
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload

# 或Ubuntu
ufw allow 22
```

#### 步骤2: 检查网络配置
```bash
# 检查IP地址
ip addr show

# 检查路由
ip route show

# 检查DNS
cat /etc/resolv.conf

# 测试外网连接
ping -c 4 8.8.8.8
```

---

### 方案E: 使用Docker部署（如果可用）

#### 通过Web终端执行
```bash
# 检查Docker是否安装
docker --version

# 如果未安装
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# 拉取镜像（如果已发布）
docker pull stockhub:latest

# 运行容器
docker run -d \
  --name stockhub \
  -p 80:80 \
  -p 3000:3000 \
  -e DB_TYPE=sqlite \
  -e DB_DATABASE=/app/data/stockhub.sqlite \
  stockhub:latest
```

---

## 📋 部署包内容

部署包包含：
```
stockhub-deploy-20260329_100622.tar.gz (156K)
├── backend/              # 后端应用
│   ├── src/              # 源代码
│   ├── node_modules/     # 需要安装
│   ├── init-db.js        # 数据库初始化
│   └── package.json
├── frontend/
│   └── dist/             # 前端构建文件
└── install.sh            # 自动安装脚本
```

---

## 🚀 推荐部署流程

### 第1步: 确认服务器状态
1. 登录云服务商控制台
2. 确认服务器运行状态
3. 检查网络和安全组配置

### 第2步: 配置防火墙
确保以下端口已开放：
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (后端API，可选)

### 第3步: 上传部署包
使用以下任一方式：
- Web终端直接下载（如果可访问外网）
- SFTP/FTP上传
- 云控制面板文件上传

### 第4步: 执行安装
```bash
cd /var/www/stockhub
./install.sh
```

### 第5步: 验证部署
```bash
# 检查服务状态
curl http://localhost:3000/api/categories

# 检查Nginx
systemctl status nginx

# 查看日志
tail -20 /var/www/stockhub/backend/logs/backend.log
```

---

## 📞 获取帮助

如果遇到问题，请提供：

1. **服务器信息**
   - 云服务商（阿里云/腾讯云/AWS等）
   - 服务器地区
   - 服务器类型

2. **错误信息**
   - 具体错误提示
   - 执行的命令
   - 预期结果 vs 实际结果

3. **当前状态**
   - 服务器是否正常运行？
   - 是否能通过Web终端访问？
   - 防火墙配置如何？

---

## 📝 备选方案

### 方案1: 使用VPS控制面板
大多数VPS提供商都有Web控制面板：
- 阿里云: 阿里云管理控制台
- 腾讯云: 腾讯云管理控制台
- AWS: EC2 Console
- Vultr: Vultr Control Panel

### 方案2: 重新配置SSH
```bash
# 重置SSH配置
sshd-keygen -A
systemctl restart sshd

# 检查SSH配置
cat /etc/ssh/sshd_config

# 允许root登录（如果需要）
sed -i 's/PermitRootLogin no/PermitRootLogin yes/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 方案3: 使用域名连接
如果IP无法连接，尝试使用域名：
```
ssh root@cnsurpr.cn
ssh root@cnsurpr.com
```

---

## 🎯 下一步行动

1. **立即检查服务器控制面板**
   - 确认服务器状态
   - 配置安全组规则
   - 尝试Web终端连接

2. **使用Web终端部署**
   - 上传部署包到服务器
   - 执行安装脚本
   - 验证部署结果

3. **反馈问题**
   - 告知我服务器状态
   - 提供具体的错误信息
   - 说明能访问的方式

---

**创建时间**: 2026-03-29 12:54
**状态**: 网络连接问题，等待服务器访问
**执行者**: 贾维斯 (J.A.R.V.I.S) 🤖

**备注**: 所有部署文件已准备就绪，只需能够访问服务器即可完成部署。
