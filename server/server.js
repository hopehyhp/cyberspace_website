const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 设置信任代理，以便正确获取客户端IP
app.set('trust proxy', true);

// API 路由
app.use('/api/messages', require('./routes/messages'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 初始化数据库并启动服务器
db.init()
  .then(() => {
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      console.log(`📡 API 端点: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ 服务器启动失败:', err);
    process.exit(1);
  });

