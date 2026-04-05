#!/bin/bash

echo "🗄️ 手动初始化数据库"
echo "================================"
echo ""

DB_PATH="/workspace/projects/stockhub/backend/data/stockhub.sqlite"

# 删除旧数据库
echo "1. 删除旧数据库..."
rm -f "$DB_PATH" "$DB_PATH-shm" "$DB_PATH-wal"

# 创建数据库和表
echo "2. 创建数据库和表..."
sqlite3 "$DB_PATH" << 'EOF'

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'buyer',
  nickname VARCHAR(100),
  avatar VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商户表
CREATE TABLE IF NOT EXISTS merchants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  business_license VARCHAR(50) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  province VARCHAR(100),
  country VARCHAR(100) NOT NULL DEFAULT 'China',
  postal_code VARCHAR(20),
  factory_area DECIMAL(10,2),
  employee_count INTEGER,
  production_lines INTEGER,
  annual_revenue DECIMAL(15,2),
  certifications TEXT,
  product_images TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  rating DECIMAL(2,1) DEFAULT 5.0,
  completed_orders INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 类目表
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  name_en VARCHAR(100),
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  parent_id INTEGER,
  level INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 求购表
CREATE TABLE IF NOT EXISTS demands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER,
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'CNY',
  quantity INTEGER,
  unit VARCHAR(50),
  target_country VARCHAR(100),
  required_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  matched_count INTEGER DEFAULT 0,
  created_by VARCHAR(20) NOT NULL,
  updated_by VARCHAR(20) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  category_id INTEGER,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description TEXT,
  description_en TEXT,
  slug VARCHAR(300) UNIQUE,
  specifications TEXT,
  images TEXT,
  stock_qty INTEGER NOT NULL,
  min_order_qty INTEGER DEFAULT 1,
  price_domestic DECIMAL(10,2),
  price_international DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'CNY',
  display_domestic INTEGER DEFAULT 1,
  display_overseas INTEGER DEFAULT 1,
  expire_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  approved_at DATETIME,
  created_by VARCHAR(20) NOT NULL,
  updated_by VARCHAR(20) NOT NULL,
  synced_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 询盘表
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_id INTEGER NOT NULL,
  buyer_company_name VARCHAR(200),
  buyer_name VARCHAR(100),
  buyer_email VARCHAR(100),
  buyer_phone VARCHAR(50),
  product_ids TEXT,
  product_details TEXT,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  buyer_viewed_at DATETIME,
  merchant_reply TEXT,
  merchant_viewed_at DATETIME,
  last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no VARCHAR(32) UNIQUE NOT NULL,
  buyer_id INTEGER NOT NULL,
  merchant_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'CNY',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending_deposit',
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  deposit_paid_at DATETIME,
  balance_paid_at DATETIME,
  shipping_method VARCHAR(50),
  tracking_number VARCHAR(100),
  carrier VARCHAR(100),
  shipping_address TEXT,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending_deposit',
  order_notes TEXT,
  created_by VARCHAR(20) NOT NULL,
  updated_by VARCHAR(20) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始类目数据
INSERT OR IGNORE INTO categories (name, name_en, slug, description, level, sort_order) VALUES
('电子元器件', 'Electronic Components', 'electronic-components', '各类电子元器件', 1, 1),
('集成电路', 'Integrated Circuits', 'integrated-circuits', 'IC芯片、处理器等', 2, 1),
('被动元件', 'Passive Components', 'passive-components', '电阻、电容、电感等', 2, 2),
('连接器', 'Connectors', 'connectors', '各类连接器和插头', 2, 3),
('工业设备', 'Industrial Equipment', 'industrial-equipment', '工业生产设备', 1, 2),
('自动化设备', 'Automation Equipment', 'automation-equipment', '自动化生产线设备', 2, 1),
('机械设备', 'Machinery Equipment', 'machinery-equipment', '各类机械加工设备', 2, 2);

EOF

if [ $? -eq 0 ]; then
    echo "   ✅ 数据库创建成功"
    DB_SIZE=$(ls -lh "$DB_PATH" | awk '{print $5}')
    echo "   数据库大小: $DB_SIZE"
else
    echo "   ❌ 数据库创建失败"
    exit 1
fi

# 查看表
echo ""
echo "3. 查看创建的表..."
sqlite3 "$DB_PATH" ".tables"

# 查看类目数据
echo ""
echo "4. 查看类目数据..."
sqlite3 "$DB_PATH" "SELECT id, name, name_en, slug FROM categories LIMIT 5;"

echo ""
echo "================================"
echo "🎉 数据库初始化完成"
echo "================================"
