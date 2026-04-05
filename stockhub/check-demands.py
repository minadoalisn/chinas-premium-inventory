import sqlite3

conn = sqlite3.connect('/workspace/projects/stockhub/backend/data/stockhub.sqlite')
cursor = conn.cursor()

# 获取demands表结构
cursor.execute('PRAGMA table_info(demands)')
columns = cursor.fetchall()

print('demands表字段:')
for col in columns:
    col_name = col[1]
    col_type = col[2]
    not_null = col[3]
    print(f'  {col_name} ({col_type}) - {not_null}')

conn.close()
