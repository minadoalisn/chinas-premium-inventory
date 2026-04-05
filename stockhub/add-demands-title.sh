#!/bin/bash

# 添加demands表的title字段

echo "🔧 添加demands表的title字段..."

cd /workspace/projects/stockhub/backend

# 备份数据库
cp data/stockhub.sqlite data/stockhub.sqlite.backup

# 添加title字段
sqlite3 data/stockhub.sqlite << 'EOF'
ALTER TABLE demands ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '';
EOF

if [ $? -eq 0 ]; then
  echo "✅ title字段添加成功"
else
  echo "⚠️ title字段添加失败或已存在"
fi

# 查看demands表结构
echo ""
echo "📊 demands表字段列表:"
sqlite3 data/stockhub.sqlite << 'EOF'
PRAGMA table_info(demands);
EOF

echo ""
echo "🎉 完成！"
