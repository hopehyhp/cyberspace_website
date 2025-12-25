const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保 database 目录存在
const DB_DIR = __dirname;
const DB_PATH = path.join(DB_DIR, 'database.sqlite');

// 如果目录不存在，创建它
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db = null;

// 初始化数据库
function init() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        reject(err);
        return;
      }
      console.log('✅ 已连接到 SQLite 数据库');
      createTables().then(resolve).catch(reject);
    });
  });
}

// 创建数据表
function createTables() {
  return new Promise((resolve, reject) => {
    const createMessagesTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createLikesTable = `
      CREATE TABLE IF NOT EXISTS message_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id INTEGER NOT NULL,
        user_ip TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(message_id, user_ip),
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
      )
    `;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        status TEXT DEFAULT 'active',
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.serialize(() => {
      db.run(createMessagesTable, (err) => {
        if (err) {
          console.error('❌ 创建 messages 表失败:', err.message);
          reject(err);
          return;
        }
        console.log('✅ messages 表已创建/已存在');
      });

      db.run(createLikesTable, (err) => {
        if (err) {
          console.error('❌ 创建 message_likes 表失败:', err.message);
          reject(err);
          return;
        }
        console.log('✅ message_likes 表已创建/已存在');
      });

      db.run(createUsersTable, (err) => {
        if (err) {
          console.error('❌ 创建 users 表失败:', err.message);
          reject(err);
          return;
        }
        console.log('✅ users 表已创建/已存在');
        
        // 检查并添加 password 字段（如果表已存在但没有该字段）
        db.all("PRAGMA table_info(users)", [], (err, rows) => {
          if (err) {
            console.error('❌ 检查表结构失败:', err.message);
            resolve();
            return;
          }
          
          const hasPassword = rows && rows.some(row => row.name === 'password');
          if (!hasPassword) {
            db.run("ALTER TABLE users ADD COLUMN password TEXT", (err) => {
              if (err) {
                // 如果字段已存在，忽略错误
                if (!err.message.includes('duplicate column')) {
                  console.error('❌ 添加 password 字段失败:', err.message);
                }
              } else {
                console.log('✅ 已添加 password 字段到 users 表');
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  });
}

// 获取数据库实例
function getDB() {
  if (!db) {
    throw new Error('数据库未初始化，请先调用 init()');
  }
  return db;
}

// 关闭数据库连接
function close() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ 数据库连接已关闭');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  init,
  getDB,
  close
};

