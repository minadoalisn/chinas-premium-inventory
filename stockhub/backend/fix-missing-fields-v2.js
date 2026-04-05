const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'stockhub.sqlite');

console.log('🔧 修复缺失字段...');
console.log('数据库路径:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ 打开数据库失败:', err);
    process.exit(1);
  }
  console.log('✅ 数据库连接成功');
});

const alterDemandsTable = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const fields = [
        { name: 'min_qty', sql: 'min_qty INTEGER DEFAULT 0' },
        { name: 'max_price', sql: 'max_price DECIMAL(10, 2)' },
        { name: 'demand_desc', sql: 'demand_desc TEXT' },
        { name: 'location', sql: 'location VARCHAR(100)' },
        { name: 'status', sql: 'status VARCHAR(20) DEFAULT "open"' },
        { name: 'matched_count', sql: 'matched_count INTEGER DEFAULT 0' },
        { name: 'tags', sql: 'tags JSON' },
      ];

      let index = 0;
      const addField = () => {
        if (index >= fields.length) {
          resolve();
          return;
        }

        const field = fields[index];
        db.run(`ALTER TABLE demands ADD COLUMN ${field.sql}`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.log(`   ⚠️  ${field.name} 字段添加失败: ${err.message}`);
          } else {
            console.log(`   ✅ ${field.name} 字段已添加`);
          }
          index++;
          addField();
        });
      };

      addField();
    });
  });
};

const alterProductsTable = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const fields = [
        { name: 'videos', sql: 'videos JSON' },
        { name: 'slug', sql: 'slug VARCHAR(300)' },
        { name: 'specifications', sql: 'specifications JSON' },
        { name: 'sku', sql: 'sku VARCHAR(100)' },
        { name: 'brand', sql: 'brand VARCHAR(100)' },
        { name: 'stock_qty', sql: 'stock_qty INTEGER DEFAULT 0' },
        { name: 'domestic_price', sql: 'domestic_price DECIMAL(10, 2)' },
        { name: 'overseas_price', sql: 'overseas_price DECIMAL(10, 2)' },
        { name: 'min_order_qty', sql: 'min_order_qty INTEGER DEFAULT 1' },
        { name: 'wholesale_tiers', sql: 'wholesale_tiers JSON' },
        { name: 'display_domestic', sql: 'display_domestic INTEGER DEFAULT 1' },
        { name: 'display_overseas', sql: 'display_overseas INTEGER DEFAULT 1' },
        { name: 'is_expired', sql: 'is_expired INTEGER DEFAULT 0' },
        { name: 'expire_date', sql: 'expire_date DATETIME' },
        { name: 'status', sql: 'status VARCHAR(20) DEFAULT "pending"' },
        { name: 'seo_title', sql: 'seo_title VARCHAR(255)' },
        { name: 'seo_description', sql: 'seo_description TEXT' },
        { name: 'seo_keywords', sql: 'seo_keywords VARCHAR(500)' },
        { name: 'view_count', sql: 'view_count INTEGER DEFAULT 0' },
        { name: 'inquiry_count', sql: 'inquiry_count INTEGER DEFAULT 0' },
        { name: 'sold_count', sql: 'sold_count INTEGER DEFAULT 0' },
        { name: 'synced_at', sql: 'synced_at DATETIME' },
      ];

      let index = 0;
      const addField = () => {
        if (index >= fields.length) {
          resolve();
          return;
        }

        const field = fields[index];
        db.run(`ALTER TABLE products ADD COLUMN ${field.sql}`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.log(`   ⚠️  ${field.name} 字段添加失败: ${err.message}`);
          } else {
            console.log(`   ✅ ${field.name} 字段已添加`);
          }
          index++;
          addField();
        });
      };

      addField();
    });
  });
};

// 主流程
async function main() {
  try {
    console.log('\n📝 添加demands表缺失字段...');
    await alterDemandsTable();
    console.log('\n📝 添加products表缺失字段...');
    await alterProductsTable();
    console.log('\n🎉 字段修复完成！');

    const fs = require('fs');
    const stats = fs.statSync(dbPath);
    console.log(`\n📊 数据库大小: ${(stats.size / 1024).toFixed(2)} KB`);

    db.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 修复失败:', error);
    db.close();
    process.exit(1);
  }
}

main();
