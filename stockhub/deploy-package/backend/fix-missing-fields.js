const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'stockhub.sqlite');
const db = new Database(dbPath);

console.log('🗄️ 修复缺失字段...');
console.log(`数据库路径: ${dbPath}`);

try {
  // 启用外键约束
  db.pragma('foreign_keys = ON');

  // 检查并添加缺失字段
  const tablesToCheck = [
    {
      name: 'demands',
      fields: [
        { name: 'min_qty', type: 'INTEGER DEFAULT 0' },
        { name: 'max_price', type: 'DECIMAL(10, 2)' },
        { name: 'demand_desc', type: 'TEXT' },
        { name: 'location', type: 'VARCHAR(100)' },
        { name: 'status', type: 'VARCHAR(20) DEFAULT "open"' },
        { name: 'matched_count', type: 'INTEGER DEFAULT 0' },
        { name: 'tags', type: 'JSON' },
      ]
    },
    {
      name: 'products',
      fields: [
        { name: 'videos', type: 'JSON' },
        { name: 'slug', type: 'VARCHAR(300)' },
        { name: 'specifications', type: 'JSON' },
        { name: 'sku', type: 'VARCHAR(100)' },
        { name: 'brand', type: 'VARCHAR(100)' },
        { name: 'stock_qty', type: 'INTEGER DEFAULT 0' },
        { name: 'domestic_price', type: 'DECIMAL(10, 2)' },
        { name: 'overseas_price', type: 'DECIMAL(10, 2)' },
        { name: 'min_order_qty', type: 'INTEGER DEFAULT 1' },
        { name: 'wholesale_tiers', type: 'JSON' },
        { name: 'display_domestic', type: 'INTEGER DEFAULT 1' },
        { name: 'display_overseas', type: 'INTEGER DEFAULT 1' },
        { name: 'is_expired', type: 'INTEGER DEFAULT 0' },
        { name: 'expire_date', type: 'DATETIME' },
        { name: 'status', type: 'VARCHAR(20) DEFAULT "pending"' },
        { name: 'seo_title', type: 'VARCHAR(255)' },
        { name: 'seo_description', type: 'TEXT' },
        { name: 'seo_keywords', type: 'VARCHAR(500)' },
        { name: 'view_count', type: 'INTEGER DEFAULT 0' },
        { name: 'inquiry_count', type: 'INTEGER DEFAULT 0' },
        { name: 'sold_count', type: 'INTEGER DEFAULT 0' },
        { name: 'synced_at', type: 'DATETIME' },
      ]
    }
  ];

  for (const table of tablesToCheck) {
    console.log(`\n📝 检查 ${table.name} 表...`);

    // 获取表结构
    const tableInfo = db.prepare(`PRAGMA table_info(${table.name})`).all();

    for (const field of table.fields) {
      const exists = tableInfo.some(col => col.name === field.name);

      if (!exists) {
        try {
          db.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${field.name} ${field.type}`).run();
          console.log(`   ✅ ${field.name} 字段已添加`);
        } catch (err) {
          console.log(`   ⚠️  ${field.name} 字段添加失败: ${err.message}`);
        }
      } else {
        console.log(`   ℹ️  ${field.name} 字段已存在`);
      }
    }
  }

  console.log('\n🎉 字段修复完成！');

  // 显示数据库大小
  const stats = db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get();
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`\n📊 数据库大小: ${sizeKB} KB`);

} catch (err) {
  console.error('\n❌ 错误:', err.message);
  process.exit(1);
} finally {
  db.close();
}
