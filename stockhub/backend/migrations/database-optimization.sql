-- ============================================
-- StockHub V2.0 - 数据库优化脚本
-- ============================================

-- 1. 添加外键约束
ALTER TABLE users ADD CONSTRAINT fk_user_merchant 
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE SET NULL;

ALTER TABLE demands ADD CONSTRAINT fk_demand_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE demands ADD CONSTRAINT fk_demand_category 
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

ALTER TABLE products ADD CONSTRAINT fk_product_merchant 
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE;

ALTER TABLE products ADD CONSTRAINT fk_product_category 
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

ALTER TABLE inquiries ADD CONSTRAINT fk_inquiry_buyer 
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE inquiries ADD CONSTRAINT fk_inquiry_seller 
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE inquiries ADD CONSTRAINT fk_inquiry_product 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE inquiries ADD CONSTRAINT fk_inquiry_demand 
  FOREIGN KEY (demand_id) REFERENCES demands(id) ON DELETE SET NULL;

ALTER TABLE orders ADD CONSTRAINT fk_order_buyer 
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_order_seller 
  FOREIGN KEY (seller_id) REFERENCES merchants(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_order_product 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- 2. 添加唯一约束
ALTER TABLE users ADD UNIQUE INDEX uk_phone (phone);
ALTER TABLE merchants ADD UNIQUE INDEX uk_user_id (user_id);

-- 3. 添加索引优化
-- 用户相关
CREATE INDEX idx_user_phone ON users(phone);
CREATE INDEX idx_user_created_at ON users(created_at);

-- 商户相关
CREATE INDEX idx_merchant_status ON merchants(status);
CREATE INDEX idx_merchant_created_at ON merchants(created_at);

-- 求购相关
CREATE INDEX idx_demand_user_id ON demands(user_id);
CREATE INDEX idx_demand_category_id ON demands(category_id);
CREATE INDEX idx_demand_status ON demands(status);
CREATE INDEX idx_demand_created_at ON demands(created_at);
CREATE INDEX idx_demand_title ON demands(title);

-- 商品相关
CREATE INDEX idx_product_merchant_id ON products(merchant_id);
CREATE INDEX idx_product_category_id ON products(category_id);
CREATE INDEX idx_product_status ON products(status);
CREATE INDEX idx_product_created_at ON products(created_at);
CREATE INDEX idx_product_title ON products(title);
CREATE INDEX idx_product_price ON products(price);

-- 询盘相关
CREATE INDEX idx_inquiry_buyer_id ON inquiries(buyer_id);
CREATE INDEX idx_inquiry_seller_id ON inquiries(seller_id);
CREATE INDEX idx_inquiry_product_id ON inquiries(product_id);
CREATE INDEX idx_inquiry_demand_id ON inquiries(demand_id);
CREATE INDEX idx_inquiry_status ON inquiries(status);
CREATE INDEX idx_inquiry_created_at ON inquiries(created_at);

-- 订单相关
CREATE INDEX idx_order_buyer_id ON orders(buyer_id);
CREATE INDEX idx_order_seller_id ON orders(seller_id);
CREATE INDEX idx_order_product_id ON orders(product_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created_at ON orders(created_at);
CREATE INDEX idx_order_total_price ON orders(total_price);

-- 验证码相关
CREATE INDEX idx_verification_code_phone ON verification_codes(phone);
CREATE INDEX idx_verification_code_expires_at ON verification_codes(expires_at);

-- 消息相关
CREATE INDEX idx_notification_user_id ON notifications(user_id);
CREATE INDEX idx_notification_created_at ON notifications(created_at);
CREATE INDEX idx_notification_is_read ON notifications(is_read);

-- 4. 添加检查约束
ALTER TABLE demands ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0);
ALTER TABLE demands ADD CONSTRAINT chk_price_positive CHECK (price >= 0);
ALTER TABLE products ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0);
ALTER TABLE products ADD CONSTRAINT chk_price_positive CHECK (price >= 0);
ALTER TABLE orders ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0);
ALTER TABLE orders ADD CONSTRAINT chk_total_price_positive CHECK (total_price >= 0);

-- 5. 添加触发器（自动更新时间戳）
DELIMITER //

CREATE TRIGGER trg_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW 
BEGIN
  SET NEW.updated_at = NOW();
END//

CREATE TRIGGER trg_merchants_updated_at 
BEFORE UPDATE ON merchants 
FOR EACH ROW 
BEGIN
  SET NEW.updated_at = NOW();
END//

CREATE TRIGGER trg_demands_updated_at 
BEFORE UPDATE ON demands 
FOR EACH ROW 
BEGIN
  SET NEW.updated_at = NOW();
END//

CREATE TRIGGER trg_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW 
BEGIN
  SET NEW.updated_at = NOW();
END//

CREATE TRIGGER trg_orders_updated_at 
BEFORE UPDATE ON orders 
FOR EACH ROW 
BEGIN
  SET NEW.updated_at = NOW();
END//

DELIMITER ;

-- 6. 添加视图（常用查询）
-- 求购详情视图
CREATE VIEW v_demand_details AS
SELECT 
  d.id,
  d.title,
  d.description,
  d.quantity,
  d.price,
  d.status,
  d.created_at,
  u.name as user_name,
  u.phone as user_phone,
  c.name as category_name,
  c.icon as category_icon,
  (SELECT COUNT(*) FROM inquiries WHERE demand_id = d.id) as inquiry_count
FROM demands d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN categories c ON d.category_id = c.id;

-- 商品详情视图
CREATE VIEW v_product_details AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.quantity,
  p.price,
  p.status,
  p.images,
  p.created_at,
  m.name as merchant_name,
  m.company as merchant_company,
  c.name as category_name,
  c.icon as category_icon,
  (SELECT COUNT(*) FROM orders WHERE product_id = p.id) as order_count
FROM products p
LEFT JOIN merchants m ON p.merchant_id = m.id
LEFT JOIN categories c ON p.category_id = c.id;

-- 订单详情视图
CREATE VIEW v_order_details AS
SELECT 
  o.id,
  o.quantity,
  o.total_price,
  o.status,
  o.address,
  o.created_at,
  u.name as buyer_name,
  u.phone as buyer_phone,
  m.name as seller_name,
  m.company as seller_company,
  p.title as product_title,
  p.price as product_price
FROM orders o
LEFT JOIN users u ON o.buyer_id = u.id
LEFT JOIN merchants m ON o.seller_id = m.id
LEFT JOIN products p ON o.product_id = p.id;

-- 7. 添加存储过程（常用业务逻辑）
DELIMITER //

-- 创建求购时检查用户权限
CREATE PROCEDURE sp_create_demand(
  IN p_user_id VARCHAR(255),
  IN p_title VARCHAR(100),
  IN p_description TEXT,
  IN p_quantity INT,
  IN p_price DECIMAL(10,2),
  IN p_category_id VARCHAR(255),
  OUT p_demand_id VARCHAR(255),
  OUT p_success BOOLEAN,
  OUT p_message VARCHAR(255)
)
BEGIN
  DECLARE user_exists INT DEFAULT 0;
  
  -- 检查用户是否存在
  SELECT COUNT(*) INTO user_exists FROM users WHERE id = p_user_id;
  
  IF user_exists = 0 THEN
    SET p_success = FALSE;
    SET p_message = '用户不存在';
  ELSE
    -- 创建求购
    INSERT INTO demands (
      user_id, title, description, quantity, price, category_id, status
    ) VALUES (
      p_user_id, p_title, p_description, p_quantity, p_price, p_category_id, 'pending'
    );
    
    SET p_demand_id = LAST_INSERT_ID();
    SET p_success = TRUE;
    SET p_message = '求购创建成功';
  END IF;
END//

-- 创建订单时检查库存
CREATE PROCEDURE sp_create_order(
  IN p_buyer_id VARCHAR(255),
  IN p_product_id VARCHAR(255),
  IN p_quantity INT,
  IN p_total_price DECIMAL(10,2),
  IN p_address VARCHAR(500),
  OUT p_order_id VARCHAR(255),
  OUT p_success BOOLEAN,
  OUT p_message VARCHAR(255)
)
BEGIN
  DECLARE v_quantity_available INT DEFAULT 0;
  DECLARE v_merchant_id VARCHAR(255);
  
  -- 检查库存
  SELECT quantity, merchant_id INTO v_quantity_available, v_merchant_id
  FROM products WHERE id = p_product_id;
  
  IF v_quantity_available < p_quantity THEN
    SET p_success = FALSE;
    SET p_message = '库存不足';
  ELSE
    -- 创建订单
    INSERT INTO orders (
      buyer_id, seller_id, product_id, quantity, total_price, address, status
    ) VALUES (
      p_buyer_id, v_merchant_id, p_product_id, p_quantity, p_total_price, p_address, 'pending'
    );
    
    SET p_order_id = LAST_INSERT_ID();
    SET p_success = TRUE;
    SET p_message = '订单创建成功';
  END IF;
END//

DELIMITER ;

-- 8. 添加事件（自动清理过期数据）
DELIMITER //

CREATE EVENT ev_cleanup_expired_codes
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  DELETE FROM verification_codes WHERE expires_at < NOW();
END//

DELIMITER ;

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

-- 9. 性能优化
-- 设置适当的缓冲池大小（根据服务器内存调整）
-- SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB

-- 启用查询缓存
-- SET GLOBAL query_cache_type = ON;
-- SET GLOBAL query_cache_size = 67108864; -- 64MB

-- 10. 数据完整性检查
-- 检查孤立记录
SELECT 'Users without merchant' as check_type, COUNT(*) as count
FROM users WHERE merchant_id IS NOT NULL 
  AND merchant_id NOT IN (SELECT id FROM merchants);

SELECT 'Demands without user' as check_type, COUNT(*) as count
FROM demands WHERE user_id NOT IN (SELECT id FROM users);

SELECT 'Demands without category' as check_type, COUNT(*) as count
FROM demands WHERE category_id NOT IN (SELECT id FROM categories);

SELECT 'Products without merchant' as check_type, COUNT(*) as count
FROM products WHERE merchant_id NOT IN (SELECT id FROM merchants);

SELECT 'Products without category' as check_type, COUNT(*) as count
FROM products WHERE category_id NOT IN (SELECT id FROM categories);

SELECT 'Inquiries without buyer' as check_type, COUNT(*) as count
FROM inquiries WHERE buyer_id NOT IN (SELECT id FROM users);

SELECT 'Orders without buyer' as check_type, COUNT(*) as count
FROM orders WHERE buyer_id NOT IN (SELECT id FROM users);

SELECT 'Orders without seller' as check_type, COUNT(*) as count
FROM orders WHERE seller_id NOT IN (SELECT id FROM merchants);

-- 完成
SELECT 'Database optimization completed successfully!' as status;
