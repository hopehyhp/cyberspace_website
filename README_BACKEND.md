# 完整项目运行指南

本项目包含前端（Vue.js）和后端（Node.js）两部分。

## 项目结构

```
personal_website/
├── src/              # 前端 Vue.js 代码
├── server/           # 后端 Node.js 代码
├── package.json      # 前端依赖
└── server/package.json  # 后端依赖
```

## 快速开始

### 1. 安装前端依赖

```bash
npm install
```

### 2. 安装后端依赖

```bash
cd server
npm install
cd ..
```

### 3. 配置环境变量（可选）

前端 API 地址配置在 `src/utils/api.js` 中，默认指向 `http://localhost:3000/api`

如需修改，可以：
- 创建 `.env` 文件并设置 `VUE_APP_API_BASE_URL`
- 或直接修改 `src/utils/api.js` 中的 `baseURL`

### 4. 启动项目

#### 方式一：分别启动（推荐开发时使用）

**终端 1 - 启动后端服务器：**
```bash
cd server
npm run dev
```

**终端 2 - 启动前端开发服务器：**
```bash
npm run serve
```

#### 方式二：使用启动脚本（Windows）

创建 `start.bat` 文件：
```batch
@echo off
start cmd /k "cd server && npm run dev"
timeout /t 3
start cmd /k "npm run serve"
```

然后双击运行 `start.bat`

#### 方式三：使用启动脚本（Linux/Mac）

创建 `start.sh` 文件：
```bash
#!/bin/bash
cd server && npm run dev &
sleep 3
npm run serve
```

然后运行：
```bash
chmod +x start.sh
./start.sh
```

### 5. 访问应用

- 前端：http://localhost:8080
- 后端 API：http://localhost:3000/api

## 生产环境部署

### 1. 构建前端

```bash
npm run build
```

构建文件将输出到 `dist/` 目录

### 2. 启动后端服务器

```bash
cd server
npm start
```

### 3. 配置反向代理（可选）

可以使用 Nginx 等反向代理服务器，将前端静态文件和后端 API 统一管理。

## 常见问题

### 1. 前端无法连接后端

- 确保后端服务器已启动（http://localhost:3000）
- 检查 `src/utils/api.js` 中的 `baseURL` 配置
- 检查浏览器控制台是否有 CORS 错误

### 2. 数据库错误

- 确保 `server/database/` 目录有写入权限
- 删除 `server/database/database.sqlite` 文件重新初始化

### 3. 端口冲突

- 修改 `server/server.js` 中的 `PORT` 变量
- 修改前端 `src/utils/api.js` 中的 `baseURL`

## 技术栈

### 前端
- Vue.js 2.6
- Vue Router 3.5
- Axios 1.6
- 赛博朋克风格 UI

### 后端
- Node.js
- Express 4.18
- SQLite3 5.1
- CORS 支持

## 开发建议

1. 开发时使用 `npm run dev` 启动后端（自动重启）
2. 使用浏览器开发者工具查看网络请求
3. 检查后端控制台日志以调试问题
4. 数据库文件建议加入 `.gitignore`（已包含）

