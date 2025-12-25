const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bcrypt = require('bcryptjs');

// 获取所有用户
router.get('/', (req, res) => {
  const database = db.getDB();
  
  const query = `
    SELECT 
      id,
      username,
      email,
      phone,
      status,
      role,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `;
  
  // 注意：查询结果中不包含密码字段

  database.all(query, [], (err, rows) => {
    if (err) {
      console.error('获取用户列表失败:', err);
      return res.status(500).json({ 
        success: false, 
        message: '获取用户列表失败',
        error: err.message 
      });
    }

    res.json({
      success: true,
      data: rows
    });
  });
});

// 根据ID获取单个用户
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const database = db.getDB();

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: '无效的用户ID'
    });
  }

  database.get(
    'SELECT * FROM users WHERE id = ?',
    [userId],
    (err, row) => {
      if (err) {
        console.error('获取用户失败:', err);
        return res.status(500).json({
          success: false,
          message: '获取用户失败',
          error: err.message
        });
      }

      if (!row) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        data: row
      });
    }
  );
});

// 创建新用户（管理员功能，需要密码）
router.post('/', async (req, res) => {
  const { username, password, email, phone, status, role } = req.body;
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

  // 验证状态值
  const validStatuses = ['active', 'inactive', 'banned'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: '状态值无效，必须是: active, inactive, 或 banned'
    });
  }

  // 验证角色值
  const validRoles = ['user', 'admin', 'moderator'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: '角色值无效，必须是: user, admin, 或 moderator'
    });
  }

  try {
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, password, email, phone, status, role, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    database.run(
      query,
      [
        username.trim(),
        hashedPassword,
        email ? email.trim() : null,
        phone ? phone.trim() : null,
        status || 'active',
        role || 'user'
      ],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({
              success: false,
              message: '用户名已存在'
            });
          }
          console.error('创建用户失败:', err);
          return res.status(500).json({
            success: false,
            message: '创建用户失败',
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
              message: '用户创建成功',
              data: user
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('创建用户过程出错:', error);
    return res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: error.message
    });
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password, email, phone, status, role } = req.body;
  const database = db.getDB();

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: '无效的用户ID'
    });
  }

  // 检查用户是否存在
  database.get('SELECT id FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err) {
      console.error('查询用户失败:', err);
      return res.status(500).json({
        success: false,
        message: '查询用户失败',
        error: err.message
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证输入
    if (username && username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '用户名不能为空'
      });
    }

    if (username && username.length > 50) {
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

    // 验证状态值
    const validStatuses = ['active', 'inactive', 'banned'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '状态值无效，必须是: active, inactive, 或 banned'
      });
    }

    // 验证角色值
    const validRoles = ['user', 'admin', 'moderator'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: '角色值无效，必须是: user, admin, 或 moderator'
      });
    }

    // 构建更新查询
    const updates = [];
    const values = [];

    if (username !== undefined) {
      updates.push('username = ?');
      values.push(username.trim());
    }
    
    // 如果提供了密码，则更新密码
    if (password !== undefined && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: '密码长度至少为6位'
        });
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push('password = ?');
        values.push(hashedPassword);
      } catch (error) {
        console.error('加密密码失败:', error);
        return res.status(500).json({
          success: false,
          message: '更新密码失败',
          error: error.message
        });
      }
    }
    
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email ? email.trim() : null);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone ? phone.trim() : null);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有提供要更新的字段'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    database.run(query, values, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({
            success: false,
            message: '用户名已存在'
          });
        }
        console.error('更新用户失败:', err);
        return res.status(500).json({
          success: false,
          message: '更新用户失败',
          error: err.message
        });
      }

      // 返回更新后的用户（不包含密码）
      database.get(
        'SELECT id, username, email, phone, status, role, created_at, updated_at FROM users WHERE id = ?',
        [userId],
        (err, updatedUser) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: '获取更新后的用户信息失败'
            });
          }

          res.json({
            success: true,
            message: '用户更新成功',
            data: updatedUser
          });
        }
      );
    });
  });
});

// 删除用户
router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const database = db.getDB();

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: '无效的用户ID'
    });
  }

  // 检查用户是否存在
  database.get('SELECT id FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      console.error('查询用户失败:', err);
      return res.status(500).json({
        success: false,
        message: '查询用户失败',
        error: err.message
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    database.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
      if (err) {
        console.error('删除用户失败:', err);
        return res.status(500).json({
          success: false,
          message: '删除用户失败',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: '用户删除成功'
      });
    });
  });
});

module.exports = router;

