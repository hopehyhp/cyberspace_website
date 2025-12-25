const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bcrypt = require('bcryptjs');

// 用户注册
router.post('/register', async (req, res) => {
  const { username, password, email, phone } = req.body;
  const database = db.getDB();

  // 验证输入
  if (!username || username.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: '用户名不能为空'
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: '密码不能为空且长度至少为6位'
    });
  }

  if (username.length > 50) {
    return res.status(400).json({
      success: false,
      message: '用户名长度不能超过50个字符'
    });
  }

  // 验证邮箱格式（如果提供）
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: '邮箱格式不正确'
    });
  }

  try {
    // 检查用户名是否已存在
    database.get(
      'SELECT id FROM users WHERE username = ?',
      [username.trim()],
      async (err, existingUser) => {
        if (err) {
          console.error('查询用户失败:', err);
          return res.status(500).json({
            success: false,
            message: '查询用户失败',
            error: err.message
          });
        }

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: '用户名已存在'
          });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 确定角色：用户名为 "hope" 的是管理员，其他是普通用户
        const role = username.trim().toLowerCase() === 'hopeadmin' ? 'admin' : 'user';

        // 创建用户
        const query = `
          INSERT INTO users (username, password, email, phone, status, role, updated_at)
          VALUES (?, ?, ?, ?, 'active', ?, CURRENT_TIMESTAMP)
        `;

        database.run(
          query,
          [
            username.trim(),
            hashedPassword,
            email ? email.trim() : null,
            phone ? phone.trim() : null,
            role
          ],
          function(err) {
            if (err) {
              console.error('注册用户失败:', err);
              return res.status(500).json({
                success: false,
                message: '注册用户失败',
                error: err.message
              });
            }

            // 返回新创建的用户（不包含密码）
            database.get(
              'SELECT id, username, email, phone, status, role, created_at, updated_at FROM users WHERE id = ?',
              [this.lastID],
              (err, user) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message: '获取新用户信息失败'
                  });
                }

                res.status(201).json({
                  success: true,
                  message: '注册成功',
                  data: user
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('注册过程出错:', error);
    return res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message
    });
  }
});

// 用户登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const database = db.getDB();

  // 验证输入
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名和密码不能为空'
    });
  }

  // 查找用户
  database.get(
    'SELECT id, username, password, email, phone, status, role, created_at, updated_at FROM users WHERE username = ?',
    [username.trim()],
    async (err, user) => {
      if (err) {
        console.error('查询用户失败:', err);
        return res.status(500).json({
          success: false,
          message: '登录失败',
          error: err.message
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }

      // 检查用户状态
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: '账户已被禁用'
        });
      }

      // 验证密码
      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: '用户名或密码错误'
          });
        }

        // 登录成功，返回用户信息（不包含密码）
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
          success: true,
          message: '登录成功',
          data: userWithoutPassword
        });
      } catch (error) {
        console.error('密码验证失败:', error);
        return res.status(500).json({
          success: false,
          message: '登录失败',
          error: error.message
        });
      }
    }
  );
});

// 获取当前用户信息（用于验证token或session）
router.get('/me', (req, res) => {
  // 这里可以添加token验证逻辑
  // 目前简单返回，实际应该从请求头中获取token并验证
  res.json({
    success: false,
    message: '请先登录'
  });
});

module.exports = router;

