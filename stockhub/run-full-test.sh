#!/bin/bash

echo "🚀 StockHub V2.0 - 完整测试启动脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 统计变量
STEP=0
PASSED=0
FAILED=0

# 日志函数
log_step() {
    STEP=$((STEP + 1))
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}步骤 $STEP: $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    PASSED=$((PASSED + 1))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    FAILED=$((FAILED + 1))
}

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 步骤1：准备工作
log_step "准备工作"
chmod +x /workspace/projects/stockhub/backend/prepare-test.sh
/workspace/projects/stockhub/backend/prepare-test.sh

# 步骤2：启动后端服务
log_step "启动后端服务"
cd /workspace/projects/stockhub/backend

# 检查依赖
if [ ! -d "node_modules" ]; then
    log_info "安装后端依赖..."
    npm install --timeout=300000 > /tmp/backend-install.log 2>&1
    if [ $? -eq 0 ]; then
        log_success "后端依赖安装完成"
    else
        log_error "后端依赖安装失败，查看日志：/tmp/backend-install.log"
        exit 1
    fi
else
    log_success "后端依赖已存在"
fi

# 构建后端
log_info "构建后端..."
npm run build > /tmp/backend-build.log 2>&1
if [ $? -eq 0 ]; then
    log_success "后端构建完成"
else
    log_error "后端构建失败，查看日志：/tmp/backend-build.log"
    exit 1
fi

# 启动后端（后台）
log_info "启动后端服务（端口3000）..."
nohup npm run start:prod > /tmp/stockhub-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/stockhub-backend.pid
log_success "后端服务启动中 (PID: $BACKEND_PID)"

# 等待后端启动
log_info "等待后端服务启动..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "后端服务启动成功！"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "后端服务启动超时"
        tail -20 /tmp/stockhub-backend.log
        exit 1
    fi
    sleep 2
done

# 步骤3：初始化数据库
log_step "初始化数据库"
log_info "运行数据库优化脚本..."
sqlite3 /workspace/projects/stockhub/backend/data/stockhub.sqlite < /workspace/projects/stockhub/backend/migrations/database-optimization.sql > /tmp/db-init.log 2>&1
if [ $? -eq 0 ]; then
    log_success "数据库优化完成"
else
    log_info "数据库初始化可能已跳过或失败"
fi

# 初始化类目数据
log_info "初始化类目数据..."
curl -s -X POST http://localhost:3000/api/categories/initialize > /tmp/init-categories.log 2>&1
if echo "$(< /tmp/init-categories.log)" | grep -q "success\|already"; then
    log_success "类目数据初始化完成"
else
    log_info "类目数据初始化可能已存在"
fi

# 步骤4：启动前端服务
log_step "启动前端服务"
cd /workspace/projects/stockhub/frontend/domestic

# 检查依赖
if [ ! -d "node_modules" ]; then
    log_info "安装前端依赖..."
    npm install --timeout=300000 > /tmp/frontend-install.log 2>&1
    if [ $? -eq 0 ]; then
        log_success "前端依赖安装完成"
    else
        log_error "前端依赖安装失败，查看日志：/tmp/frontend-install.log"
        exit 1
    fi
else
    log_success "前端依赖已存在"
fi

# 构建前端
log_info "构建前端..."
npm run build > /tmp/frontend-build.log 2>&1
if [ $? -eq 0 ]; then
    log_success "前端构建完成"
else
    log_error "前端构建失败，查看日志：/tmp/frontend-build.log"
    exit 1
fi

# 启动前端（使用Python HTTP服务器）
log_info "启动前端服务（端口5173）..."
cd dist
nohup python3 -m http.server 5173 > /tmp/stockhub-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/stockhub-frontend.pid
log_success "前端服务启动中 (PID: $FRONTEND_PID)"

# 等待前端启动
log_info "等待前端服务启动..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        log_success "前端服务启动成功！"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "前端服务启动超时"
        tail -20 /tmp/stockhub-frontend.log
        exit 1
    fi
    sleep 2
done

# 步骤5：运行测试
log_step "运行完整测试"
chmod +x /workspace/projects/stockhub/test-all.sh
/workspace/projects/stockhub/test-all.sh
TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    log_success "所有测试通过！"
else
    log_error "测试失败，退出码：$TEST_RESULT"
fi

# 步骤6：服务状态检查
log_step "服务状态检查"
echo ""
echo "📊 服务状态："
echo ""

# 后端状态
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "后端服务: ${GREEN}✅ 运行中${NC} (http://localhost:3000)"
else
    echo -e "后端服务: ${RED}❌ 未运行${NC}"
fi

# 前端状态
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "前端服务: ${GREEN}✅ 运行中${NC} (http://localhost:5173)"
else
    echo -e "前端服务: ${RED}❌ 未运行${NC}"
fi

# API文档
if curl -s http://localhost:3000/api/docs > /dev/null; then
    echo -e "API文档: ${GREEN}✅ 可访问${NC} (http://localhost:3000/api/docs)"
else
    echo -e "API文档: ${RED}❌ 不可访问${NC}"
fi

echo ""

# 步骤7：测试总结
log_step "测试总结"
echo ""
echo "================================"
echo "📊 测试结果总结"
echo "================================"
echo ""
echo "总步骤数: $STEP"
echo -e "通过步骤: ${GREEN}$PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "失败步骤: ${RED}$FAILED${NC}"
else
    echo -e "失败步骤: ${GREEN}0${NC}"
fi
echo ""

echo "================================"
echo "📍 访问地址"
echo "================================"
echo ""
echo "🌐 前端应用: http://14.103.87.246:5173"
echo "📚 API文档: http://14.103.87.246:3000/api/docs"
echo "🔌 后端API: http://14.103.87.246:3000/api"
echo ""

echo "================================"
echo "📋 进程信息"
echo "================================"
echo ""
echo "后端PID: $(cat /tmp/stockhub-backend.pid)"
echo "前端PID: $(cat /tmp/stockhub-frontend.pid)"
echo ""

echo "================================"
echo "📝 日志文件"
echo "================================"
echo ""
echo "后端日志: tail -f /tmp/stockhub-backend.log"
echo "前端日志: tail -f /tmp/stockhub-frontend.log"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${RED}================================${NC}"
    echo -e "${RED}⚠️  测试未完全通过，请检查日志并修复问题${NC}"
    echo -e "${RED}================================${NC}"
    exit 1
else
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}🎉 所有服务已启动，测试通过！${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo -e "${BLUE}💡 提示：${NC}"
    echo "   1. 访问前端应用进行手动测试"
    echo "   2. 查看API文档测试接口"
    echo "   3. 停止服务: kill $(cat /tmp/stockhub-backend.pid) $(cat /tmp/stockhub-frontend.pid)"
    echo ""
    exit 0
fi
