const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'stockhub.sqlite');

console.log('🔧 添加demands表的title字段...');
console.log(`数据库路径: ${dbPath}`);

const db = new Database(db_path);

try {
  // 添加title字段
  db.prepare(`ALTER TABLE demands ADD COLUMN title VARCHAR(255) NOT NULL`).run();
    console.log('   ✅ title 字段已添加');
} catch (err) {
  console.log(`   ℹ️  title 字段添加失败: ${err.message}`);
}

// 查看demands表结构
console.log('\n📊 更新后的demands表字段列表:');
const tableInfo = db.prepare("PRAGMA table_info(demands)").all();
tableInfo.forEach(col => {
  console.log(`  ${col.name} (${col.type}) - ${col.notnull ? 'NOT NULL' : 'NULL'} - 默认值: ${col.dflt_value}`);
});

console.log('\n🎉 完成！');

db.close();
