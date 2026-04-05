const Database = require('better-sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'stockhub.sqlite');

console.log('🔍 检查demands表结构...');
console.log(`数据库路径: ${dbPath}`);

const db = new Database(dbPath);

try {
  // 获取demands表结构
  const tableInfo = db.prepare("PRAGMA table_info(demands)").all();

  console.log('\n📊 demands表字段列表:');
  tableInfo.forEach(col => {
    console.log(`  ${col.name} (${col.type}) - ${col.notnull ? 'NOT NULL' : 'NULL'} - 默认值: ${col.dflt_value}`);
  });

  // 获取demands表的所有数据
  console.log('\n📋 demands表数据:');
  const demands = db.prepare("SELECT * FROM demands").all();
  console.log(`  总行数: ${demands.length}`);
  demands.forEach((d, i) => {
    console.log(`  ${i + 1}. ID:${d.id}, Title:${d.title || 'null'}, BuyerId:${d.buyer_id}, CategoryId:${d.category_id}`);
  });

  console.log('\n✅ 检查完成！');
} catch (err) {
  console.error('❌ 错误:', err.message);
} finally {
  db.close();
}
