const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // 监听所有网络接口，允许外部访问

// CORS 配置
const corsOptions = {
  origin: function (origin, callback) {
    // 允许的源列表
    const allowedOrigins = [
      'http://82.156.227.230',
      'http://82.156.227.230:80',
      'http://82.156.227.230:443',
      'https://82.156.227.230',
      'http://hopehu.xyz',
      'https://hopehu.xyz',
      'http://www.hopehu.xyz',
      'https://www.hopehu.xyz',
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://0.0.0.0:3000'
    ];

    // 如果没有origin（比如Postman、curl或移动应用），允许通过
    if (!origin) {
      return callback(null, true);
    }

    // 开发环境：允许所有源
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // 生产环境：检查是否在允许列表中
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // 如果需要更严格的限制，取消下面的注释并注释掉 callback(null, true)
      // callback(new Error('不允许的源: ' + origin));
      // 临时允许所有源（用于调试，生产环境建议使用上面的严格模式）
      callback(null, true);
    }
  },
  credentials: true, // 允许携带凭证（cookies等）
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // 允许的HTTP方法
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-User-Id'], // 允许的请求头
  exposedHeaders: ['Content-Length', 'Content-Type'], // 暴露给前端的响应头
  maxAge: 86400 // 预检请求的缓存时间（24小时）
};

// 中间件
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 设置信任代理，以便正确获取客户端IP
app.set('trust proxy', true);

// API 路由
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 初始化数据库并启动服务器
db.init()
  .then(() => {
    // 启动服务器
    app.listen(PORT, HOST, () => {
      console.log(`🚀 服务器运行在 http://${HOST}:${PORT}`);
      console.log(`📡 API 端点: http://${HOST}:${PORT}/api`);
      console.log(`🌐 本地访问: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ 服务器启动失败:', err);
    process.exit(1);
  });

