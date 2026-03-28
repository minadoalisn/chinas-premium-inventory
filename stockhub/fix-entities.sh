#!/bin/bash

# 修复所有entity文件中的enum定义错误
cd /workspace/projects/stockhub/backend/src/modules

for file in $(find . -name "*.entity.ts" -type f); do
    echo "修复: $file"
    # 移除多余的enum定义
    sed -i 's/type: "varchar", length: 20,$/type: "varchar", length: 20, default: "open",/g' "$file"
    sed -i 's/enum: \[.*\], default:/default:/g' "$file"
    sed -i 's/enum: \[.*\];$/default: "open";/g' "$file"
    sed -i 's/, default: .*/;/g' "$file"
done

echo "✅ Entity文件修复完成"
