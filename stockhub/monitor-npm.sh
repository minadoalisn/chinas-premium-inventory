#!/bin/bash

echo "📊 npm install 详细监控"
echo "================================"
echo ""

BACKEND_DIR="/workspace/projects/stockhub/backend"
NPM_LOG="/root/.npm/_logs/$(ls -t ~/.npm/_logs/ | head -1)"

echo "🔍 当前状态："
echo ""

# 1. 检查进程
echo "1️⃣ npm进程状态："
if ps aux | grep -q "npm install"; then
    echo "   ✅ npm install 正在运行"
    NPM_PID=$(ps aux | grep "npm install" | grep -v grep | awk '{print $2}' | head -1)
    echo "   📌 PID: $NPM_PID"
    echo "   ⏱️  运行时间: $(ps -p $NPM_PID -o etime= | tr -d ' ')"
else
    echo "   ❌ npm install 未运行"
    exit 1
fi

echo ""

# 2. 检查缓存
echo "2️⃣ npm缓存状态："
if [ -d ~/.npm ]; then
    CACHE_SIZE=$(du -sh ~/.npm 2>/dev/null | awk '{print $1}')
    echo "   ✅ npm缓存目录存在"
    echo "   📦 缓存大小: $CACHE_SIZE"
else
    echo "   ❌ npm缓存目录不存在"
fi

echo ""

# 3. 检查node_modules
echo "3️⃣ node_modules状态："
if [ -d "$BACKEND_DIR/node_modules" ]; then
    PACKAGE_COUNT=$(find "$BACKEND_DIR/node_modules" -maxdepth 1 -type d | wc -l)
    echo "   ✅ node_modules目录存在"
    echo "   📦 已安装包: $PACKAGE_COUNT"
else
    echo "   ⏳ node_modules目录未创建"
fi

echo ""

# 4. 检查package-lock.json
echo "4️⃣ package-lock.json状态："
if [ -f "$BACKEND_DIR/package-lock.json" ]; then
    echo "   ✅ package-lock.json已创建"
    LOCK_SIZE=$(du -h "$BACKEND_DIR/package-lock.json" | awk '{print $1}')
    echo "   📄 文件大小: $LOCK_SIZE"
else
    echo "   ⏳ package-lock.json未创建"
fi

echo ""

# 5. 检查npm日志
echo "5️⃣ npm日志最新输出："
if [ -f "$NPM_LOG" ]; then
    echo "   📝 最近10行："
    tail -10 "$NPM_LOG" | sed 's/^/      /'
else
    echo "   ⚠️  日志文件未找到"
fi

echo ""
echo "================================"
echo "💡 提示：npm install通常需要5-10分钟"
echo "🕐 当前时间: $(date '+%H:%M:%S')"
