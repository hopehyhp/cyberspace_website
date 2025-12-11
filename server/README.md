# 个人网站后端服务器

这是个人网站的后端 API 服务器，使用 Node.js + Express + SQLite 构建。

## 功能特性

- ✅ 留言板 API（获取、提交、点赞）
- ✅ SQLite 数据库存储
- ✅ RESTful API 设计
- ✅ CORS 跨域支持
- ✅ 错误处理

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 启动服务器

```bash
# 开发模式（使用 nodemon，自动重启）
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3000` 启动

## API 文档

### 健康检查

```
GET /api/health
```

### 留言板 API

#### 获取所有留言

```
GET /api/messages
```

响应示例：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "用户名",
      "content": "留言内容",
      "timestamp": 1234567890,
      "likes": 5,
      "liked": false
    }
  ]
}
```

#### 提交新留言

```
POST /api/messages
Content-Type: application/json

{
  "name": "用户名",
  "content": "留言内容"
}
```

响应示例：
```json
{
  "success": true,
  "message": "留言提交成功",
  "data": {
    "id": 1,
    "name": "用户名",
    "content": "留言内容",
    "timestamp": 1234567890,
    "likes": 0,
    "liked": false
  }
}
```

#### 点赞/取消点赞

```
POST /api/messages/:id/like
```

响应示例：
```json
{
  "success": true,
  "message": "点赞成功",
  "data": {
    "likes": 6,
    "liked": true
  }
}
```

#### 检查点赞状态

```
GET /api/messages/:id/like-status
```

响应示例：
```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```

## 数据库结构

### messages 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| name | TEXT | 用户昵称 |
| content | TEXT | 留言内容 |
| timestamp | INTEGER | 时间戳 |
| likes | INTEGER | 点赞数（计算字段） |
| created_at | DATETIME | 创建时间 |

### message_likes 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| message_id | INTEGER | 留言ID（外键） |
| user_ip | TEXT | 用户IP地址 |
| created_at | DATETIME | 创建时间 |

## 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```
PORT=3000
```

## 注意事项

- 数据库文件 `database.sqlite` 会在首次运行时自动创建
- 点赞功能基于用户IP地址，同一IP对同一条留言只能点赞一次
- 建议在生产环境中使用更安全的用户认证机制

