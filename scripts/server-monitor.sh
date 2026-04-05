#!/bin/bash
# StockHub服务器自动监控和修复脚本

LOG_FILE="/var/log/stockhub-monitor.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查Nginx
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        log "❌ Nginx未运行，正在启动..."
        systemctl start nginx
        sleep 2
        if systemctl is-active --quiet nginx; then
            log "✅ Nginx已启动"
            return 0
        else
            log "❌ Nginx启动失败"
            return 1
        fi
    fi
    log "✅ Nginx运行正常"
}

# 检查后端服务
check_backend() {
    if ! netstat -tlnp | grep -q ":3000.*LISTEN"; then
        log "❌ 后端服务未运行，正在启动..."
        cd /var/www/stockhub && nohup node backend/server.js > /tmp/backend.log 2>&1 &
        sleep 3
        if netstat -tlnp | grep -q ":3000.*LISTEN"; then
            log "✅ 后端服务已启动"
            return 0
        else
            log "❌ 后端服务启动失败"
            return 1
        fi
    fi
    log "✅ 后端服务运行正常"
}

# 检查防火墙端口
check_firewall() {
    PORTS="80 443 3000"
    NEED_RELOAD=0

    for PORT in $PORTS; do
        if ! firewall-cmd --list-ports 2>/dev/null | grep -q "${PORT}/tcp"; then
            log "⚠️ 端口${PORT}未开放，正在添加..."
            firewall-cmd --permanent --add-port=${PORT}/tcp >/dev/null 2>&1
            NEED_RELOAD=1
        fi
    done

    if [ $NEED_RELOAD -eq 1 ]; then
        firewall-cmd --reload >/dev/null 2>&1
        log "✅ 防火墙规则已更新并重载"
    else
        log "✅ 防火墙端口正常"
    fi
}

# 主检查流程
main() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "开始服务器健康检查"

    check_nginx
    check_backend
    check_firewall

    log "检查完成"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

main
