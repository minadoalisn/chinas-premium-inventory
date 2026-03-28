#!/bin/bash

echo "🔍 依赖安装监控脚本"
echo "================================"
echo ""

BACKEND_DIR="/workspace/projects/stockhub/backend"

while true; do
    echo "📊 检查安装状态..."
    echo ""
    
    # 检查package-lock.json
    if [ -f "$BACKEND_DIR/package-lock.json" ]; then
        echo "✅ package-lock.json 已创建"
    else
        echo "⏳ package-lock.json 正在创建..."
    fi
    
    # 检查node_modules
    if [ -d "$BACKEND_DIR/node_modules" ]; then
        PACKAGE_COUNT=$(find "$BACKEND_DIR/node_modules" -maxdepth 1 -type d | wc -l)
        echo "✅ node_modules 目录存在 ($PACKAGE_COUNT 个包)"
    else
        echo "⏳ node_modules 目录正在创建..."
    fi
    
    # 检查npm进程
    NPM_PID=$(pgrep -f "npm.*install" | head -1)
    if [ -n "$NPM_PID" ]; then
        echo "✅ npm install 正在运行 (PID: $NPM_PID)"
    else
        echo "⚠️  npm install 已完成或失败"
        break
    fi
    
    echo ""
    echo "⏳ 等待30秒后再次检查..."
    echo "================================"
    sleep 30
done

echo ""
echo "🎉 检查完成！"
echo ""

# 最终检查
if [ -d "$BACKEND_DIR/node_modules" ]; then
    PACKAGE_COUNT=$(find "$BACKEND_DIR/node_modules" -maxdepth 1 -type d | wc -l)
    echo "✅ 依赖安装成功！"
    echo "📦 已安装包数量: $PACKAGE_COUNT"
    
    # 检查关键包
    echo ""
    echo "🔍 检查关键包..."
    KEY_PACKAGES=(
        "@nestjs/common"
        "@nestjs/core"
        "@nestjs/platform-express"
        "typescript"
        "ts-node"
    )
    
    for pkg in "${KEY_PACKAGES[@]}"; do
        if [ -d "$BACKEND_DIR/node_modules/$pkg" ]; then
            echo "  ✅ $pkg"
        else
            echo "  ❌ $pkg"
        fi
    done
    
    echo ""
    echo "🚀 准备启动服务..."
else
    echo "❌ 依赖安装失败"
    echo "📝 查看错误日志:"
    tail -50 ~/.npm/_logs/*.log 2>/dev/null || echo "日志文件未找到"
fi
