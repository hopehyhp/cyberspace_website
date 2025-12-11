const express = require('express');
const router = express.Router();
const db = require('../database/db');

// 获取所有留言
router.get('/', (req, res) => {
  const database = db.getDB();
  
  const query = `
    SELECT 
      m.id,
      m.name,
      m.content,
      m.timestamp,
      COALESCE(COUNT(ml.id), 0) as likes
    FROM messages m
    LEFT JOIN message_likes ml ON m.id = ml.message_id
    GROUP BY m.id
    ORDER BY m.timestamp DESC
  `;

  database.all(query, [], (err, rows) => {
    if (err) {
      console.error('获取留言失败:', err);
      return res.status(500).json({ 
        success: false, 
        message: '获取留言失败',
        error: err.message 
      });
    }

    const messages = rows.map(row => ({
      id: row.id,
      name: row.name,
      content: row.content,
      timestamp: row.timestamp,
      likes: row.likes,
      liked: false // 前端需要根据用户IP判断
    }));

    res.json({
      success: true,
      data: messages
    });
  });
});

// 提交新留言
router.post('/', (req, res) => {
  const { name, content } = req.body;

  // 验证输入
  if (!name || !content) {
    return res.status(400).json({
      success: false,
      message: '昵称和留言内容不能为空'
    });
  }

  if (name.trim().length === 0 || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: '昵称和留言内容不能为空'
    });
  }

  if (name.length > 20) {
    return res.status(400).json({
      success: false,
      message: '昵称长度不能超过20个字符'
    });
  }

  if (content.length > 500) {
    return res.status(400).json({
      success: false,
      message: '留言内容不能超过500个字符'
    });
  }

  const database = db.getDB();
  const timestamp = Date.now();

  const query = `
    INSERT INTO messages (name, content, timestamp)
    VALUES (?, ?, ?)
  `;

  database.run(query, [name.trim(), content.trim(), timestamp], function(err) {
    if (err) {
      console.error('提交留言失败:', err);
      return res.status(500).json({
        success: false,
        message: '提交留言失败',
        error: err.message
      });
    }

    // 返回新创建的留言
    const newMessage = {
      id: this.lastID,
      name: name.trim(),
      content: content.trim(),
      timestamp: timestamp,
      likes: 0,
      liked: false
    };

    res.status(201).json({
      success: true,
      message: '留言提交成功',
      data: newMessage
    });
  });
});

// 点赞/取消点赞
router.post('/:id/like', (req, res) => {
  const messageId = parseInt(req.params.id);
  const userIp = req.ip || req.connection.remoteAddress || 'unknown';

  if (isNaN(messageId)) {
    return res.status(400).json({
      success: false,
      message: '无效的留言ID'
    });
  }

  const database = db.getDB();

  // 检查留言是否存在
  database.get('SELECT id FROM messages WHERE id = ?', [messageId], (err, message) => {
    if (err) {
      console.error('查询留言失败:', err);
      return res.status(500).json({
        success: false,
        message: '查询留言失败',
        error: err.message
      });
    }

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '留言不存在'
      });
    }

    // 检查是否已经点赞
    database.get(
      'SELECT id FROM message_likes WHERE message_id = ? AND user_ip = ?',
      [messageId, userIp],
      (err, like) => {
        if (err) {
          console.error('查询点赞失败:', err);
          return res.status(500).json({
            success: false,
            message: '查询点赞失败',
            error: err.message
          });
        }

        if (like) {
          // 取消点赞
          database.run(
            'DELETE FROM message_likes WHERE message_id = ? AND user_ip = ?',
            [messageId, userIp],
            (err) => {
              if (err) {
                console.error('取消点赞失败:', err);
                return res.status(500).json({
                  success: false,
                  message: '取消点赞失败',
                  error: err.message
                });
              }

              // 获取更新后的点赞数
              database.get(
                'SELECT COUNT(*) as count FROM message_likes WHERE message_id = ?',
                [messageId],
                (err, result) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      message: '获取点赞数失败'
                    });
                  }

                  res.json({
                    success: true,
                    message: '已取消点赞',
                    data: {
                      likes: result.count,
                      liked: false
                    }
                  });
                }
              );
            }
          );
        } else {
          // 添加点赞
          database.run(
            'INSERT INTO message_likes (message_id, user_ip) VALUES (?, ?)',
            [messageId, userIp],
            (err) => {
              if (err) {
                console.error('点赞失败:', err);
                return res.status(500).json({
                  success: false,
                  message: '点赞失败',
                  error: err.message
                });
              }

              // 获取更新后的点赞数
              database.get(
                'SELECT COUNT(*) as count FROM message_likes WHERE message_id = ?',
                [messageId],
                (err, result) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      message: '获取点赞数失败'
                    });
                  }

                  res.json({
                    success: true,
                    message: '点赞成功',
                    data: {
                      likes: result.count,
                      liked: true
                    }
                  });
                }
              );
            }
          );
        }
      }
    );
  });
});

// 检查用户是否已点赞某条留言
router.get('/:id/like-status', (req, res) => {
  const messageId = parseInt(req.params.id);
  const userIp = req.ip || req.connection.remoteAddress || 'unknown';

  if (isNaN(messageId)) {
    return res.status(400).json({
      success: false,
      message: '无效的留言ID'
    });
  }

  const database = db.getDB();

  database.get(
    'SELECT id FROM message_likes WHERE message_id = ? AND user_ip = ?',
    [messageId, userIp],
    (err, like) => {
      if (err) {
        console.error('查询点赞状态失败:', err);
        return res.status(500).json({
          success: false,
          message: '查询点赞状态失败',
          error: err.message
        });
      }

      res.json({
        success: true,
        data: {
          liked: !!like
        }
      });
    }
  );
});

module.exports = router;

