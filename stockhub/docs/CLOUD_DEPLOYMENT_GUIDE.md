# StockHub 云端部署访问指南

## 🚀 云端部署步骤

### 1. 执行部署脚本

```bash
cd /workspace/projects/stockhub
chmod +x deploy-cloud.sh
./deploy-cloud.sh
```

### 2. 获取服务器IP

部署完成后，脚本会显示服务器IP地址。你也可以手动查看：

```bash
hostname -I
```

或者查看公网IP：

```bash
curl ifconfig.me
```

假设服务器IP是：`123.45.67.89`

---

## 📍 访问地址

部署成功后，你可以通过以下地址访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| 🌐 **前端应用** | http://123.45.67.89 | Vue 3前端界面 |
| 📚 **API文档** | http://123.45.67.89/api/docs | Swagger API文档 |
| 🔌 **后端API** | http://123.45.67.89/api | Nest.js后端服务 |

---

## 🔥 防火墙配置

### Ubuntu/Debian (UFW)

```bash
# 检查防火墙状态
sudo ufw status

# 开放80端口（HTTP）
sudo ufw allow 80

# 如果需要，开放443端口（HTTPS）
sudo ufw allow 443

# 重载防火墙
sudo ufw reload
```

### CentOS/RHEL (Firewalld)

```bash
# 检查防火墙状态
sudo firewall-cmd --state

# 开放80端口
sudo firewall-cmd --add-port=80/tcp --permanent

# 如果需要，开放443端口
sudo firewall-cmd --add-port=443/tcp --permanent

# 重载防火墙
sudo firewall-cmd --reload

# 查看开放的端口
sudo firewall-cmd --list-ports
```

### 阿里云/腾讯云/AWS

如果你的服务器在云平台上，还需要在云平台的控制台开放安全组：

1. 登录云平台控制台
2. 找到你的服务器实例
3. 点击"安全组"或"防火墙"
4. 添加入站规则：
   - 端口：80
   - 协议：TCP
   - 来源：0.0.0.0/0（允许所有IP访问）

---

## 🌐 配置域名访问（可选）

### 1. 购买域名

如果你有自己的域名，可以配置域名访问：

### 2. 配置DNS解析

在你的域名服务商处添加A记录：

```
类型: A
主机记录: @
记录值: 123.45.67.89
TTL: 600
```

或者添加子域名：

```
类型: A
主机记录: stockhub
记录值: 123.45.67.89
TTL: 600
```

### 3. 更新Nginx配置

编辑 `/workspace/projects/stockhub/nginx/nginx.conf`：

```nginx
server {
    listen 80;
    server_name stockhub.yourdomain.com;  # 改成你的域名

    # ... 其他配置保持不变
}
```

重启Nginx：

```bash
docker-compose restart nginx
```

### 4. 访问域名

现在可以通过域名访问：
- 前端：http://stockhub.yourdomain.com
- API文档：http://stockhub.yourdomain.com/api/docs

---

## 🔒 配置HTTPS（可选）

### 1. 申请SSL证书

使用Let's Encrypt免费SSL证书：

```bash
# 安装certbot
sudo apt-get install certbot

# 申请证书（需要先配置域名）
sudo certbot certonly --standalone -d stockhub.yourdomain.com
```

### 2. 复制证书到项目目录

```bash
sudo mkdir -p /workspace/projects/stockhub/nginx/ssl
sudo cp /etc/letsencrypt/live/stockhub.yourdomain.com/fullchain.pem \
   /workspace/projects/stockhub/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/stockhub.yourdomain.com/privkey.pem \
   /workspace/projects/stockhub/nginx/ssl/key.pem
sudo chmod 644 /workspace/projects/stockhub/nginx/ssl/*.pem
```

### 3. 启用Nginx HTTPS配置

编辑 `/workspace/projects/stockhub/nginx/nginx.conf`，取消HTTPS配置的注释：

```nginx
server {
  listen 443 ssl http2;
  server_name stockhub.yourdomain.com;

  ssl_certificate /etc/nginx/ssl/cert.pem;
  ssl_certificate_key /etc/nginx/ssl/key.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  location / {
    proxy_pass http://frontend:80;
  }

  location /api {
    proxy_pass http://backend:3000;
  }
}
```

### 4. 重启服务

```bash
docker-compose restart nginx
```

### 5. 访问HTTPS

- 前端：https://stockhub.yourdomain.com
- API文档：https://stockhub.yourdomain.com/api/docs

---

## 🧪 云端测试流程

### 1. 检查服务状态

```bash
# 查看所有容器状态
docker-compose ps

# 查看后端日志
docker-compose logs backend

# 查看前端日志
docker-compose logs frontend

# 查看所有日志
docker-compose logs -f
```

### 2. 测试API连通性

```bash
# 测试后端健康检查
curl http://123.45.67.89/api/docs

# 测试API接口
curl -X GET http://123.45.67.89/api/categories
```

### 3. 测试前端访问

在浏览器中访问：http://123.45.67.89

### 4. 测试注册流程

1. 打开 http://123.45.67.89
2. 点击"注册"
3. 输入手机号
4. 发送验证码
5. 查看后端日志获取验证码：
   ```bash
   docker-compose logs backend | grep "验证码"
   ```
6. 输入验证码完成注册

---

## 🐛 常见问题排查

### 问题1：无法访问网站

**检查项**：

1. 检查容器是否运行
   ```bash
   docker-compose ps
   ```

2. 检查防火墙是否开放
   ```bash
   sudo ufw status
   # 或
   sudo firewall-cmd --list-ports
   ```

3. 检查云平台安全组配置

4. 测试本地访问
   ```bash
   curl http://localhost
   ```

### 问题2：API请求失败

**检查项**：

1. 检查后端容器日志
   ```bash
   docker-compose logs backend
   ```

2. 检查数据库连接
   ```bash
   docker-compose logs mysql
   ```

3. 测试API直接访问
   ```bash
   curl http://localhost/api/categories
   ```

### 问题3：验证码无法发送

**检查项**：

1. 查看后端日志中的短信发送记录
   ```bash
   docker-compose logs backend | grep "短信"
   ```

2. 检查短信宝配置
   ```bash
   cat /workspace/projects/stockhub/.env | grep SMS
   ```

3. 测试短信API（使用curl）

---

## 📊 监控和日志

### 查看实时日志

```bash
# 所有服务
docker-compose logs -f

# 只看后端
docker-compose logs -f backend

# 只看前端
docker-compose logs -f frontend

# 只看数据库
docker-compose logs -f mysql
```

### 查看容器资源使用

```bash
# 查看容器状态
docker stats

# 查看容器详情
docker inspect stockhub-backend
```

### 查看数据库

```bash
# 进入MySQL容器
docker exec -it stockhub-mysql mysql -uroot -prootpassword

# 查看数据库
USE stockhub;
SHOW TABLES;

# 退出
EXIT;
```

---

## 🔄 更新部署

### 更新代码后重新部署

```bash
cd /workspace/projects/stockhub

# 拉取最新代码
git pull origin master

# 重新构建并启动
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🛑 停止服务

```bash
cd /workspace/projects/stockhub

# 停止所有服务
docker-compose down

# 停止并删除数据卷（谨慎使用）
docker-compose down -v
```

---

## 💡 优化建议

### 1. 配置CDN加速

如果用户分布广泛，可以配置CDN加速静态资源。

### 2. 配置负载均衡

如果并发量大，可以配置多个后端实例和Nginx负载均衡。

### 3. 配置数据库备份

定期备份数据库：

```bash
# 备份数据库
docker exec stockhub-mysql mysqldump -uroot -prootpassword stockhub > backup.sql

# 恢复数据库
docker exec -i stockhub-mysql mysql -uroot -prootpassword stockhub < backup.sql
```

### 4. 配置日志轮转

防止日志文件过大：

```bash
# 配置logrotate
sudo nano /etc/logrotate.d/stockhub

# 内容
/workspace/projects/stockhub/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

---

## 📞 技术支持

如果遇到问题，请：

1. 查看日志文件
2. 检查容器状态
3. 查看防火墙配置
4. 查看云平台安全组配置

---

**开始云端测试吧！** 🚀
