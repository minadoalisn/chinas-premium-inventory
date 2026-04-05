const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'stockhub.sqlite');

console.log('🔧 修复Merchant表...');
console.log('数据库路径:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ 打开数据库失败:', err);
    process.exit(1);
  }
  console.log('✅ 数据库连接成功');
});

const alterTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 添加缺失的字段
      db.run(`ALTER TABLE merchants ADD COLUMN response_rate DECIMAL(5,2) DEFAULT 0`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          reject(err);
        } else {
          console.log('   ✅ response_rate 字段已添加');
          db.run(`ALTER TABLE merchants ADD COLUMN response_time VARCHAR(20) DEFAULT '24h'`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
              reject(err);
            } else {
              console.log('   ✅ response_time 字段已添加');
              db.run(`ALTER TABLE merchants ADD COLUMN bank_name VARCHAR(200)`, (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                  reject(err);
                } else {
                  console.log('   ✅ bank_name 字段已添加');
                  db.run(`ALTER TABLE merchants ADD COLUMN bank_account VARCHAR(100)`, (err) => {
                    if (err && !err.message.includes('duplicate column name')) {
                      reject(err);
                    } else {
                      console.log('   ✅ bank_account 字段已添加');
                      db.run(`ALTER TABLE merchants ADD COLUMN swift_code VARCHAR(20)`, (err) => {
                        if (err && !err.message.includes('duplicate column name')) {
                          reject(err);
                        } else {
                          console.log('   ✅ swift_code 字段已添加');
                          db.run(`ALTER TABLE merchants ADD COLUMN approved_at DATETIME`, (err) => {
                            if (err && !err.message.includes('duplicate column name')) {
                              reject(err);
                            } else {
                              console.log('   ✅ approved_at 字段已添加');
                              resolve();
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
};

// 主流程
async function main() {
  try {
    console.log('\n📝 添加缺失字段...');
    await alterTables();
    console.log('\n🎉 Merchant表修复完成！');
    
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
