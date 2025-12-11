# 🚀 宝塔Linux服务器部署指南

本指南将帮助您将个人网站部署到宝塔Linux服务器上。

## 📋 前置要求

1. **宝塔面板已安装**（建议版本 7.0+）
2. **Node.js 环境**（建议 Node.js 14+）
3. **PM2 进程管理器**（用于管理Node.js应用）
4. **Nginx**（用于反向代理和静态文件服务）

## 🔧 宝塔面板环境准备

### 1. 安装Node.js版本管理器

在宝塔面板中：
1. 进入 **软件商店** → 搜索 **PM2管理器** → 安装
2. 或者通过终端安装Node.js：
   ```bash
   # 安装Node.js版本管理器（nvm）
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 16
   nvm use 16
   ```

### 2. 安装PM2

```bash
npm install -g pm2
```

### 3. 安装Nginx（如果未安装）

在宝塔面板中：
1. 进入 **软件商店** → 搜索 **Nginx** → 安装

## 📦 项目部署步骤

### 步骤1：上传项目文件

1. 在宝塔面板中创建网站目录，例如：`/www/wwwroot/your-domain.com`
2. 将项目文件上传到服务器（可以使用宝塔的文件管理功能或FTP/SFTP）

**推荐目录结构：**
```
/www/wwwroot/your-domain.com/
├── server/          # 后端代码
├── dist/            # 前端构建文件（稍后生成）
├── package.json
└── ...其他文件
```

### 步骤2：安装依赖

**SSH连接到服务器，进入项目目录：**

```bash
cd /www/wwwroot/your-domain.com

# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 步骤3：配置环境变量

**创建后端环境变量文件：**

```bash
cd /www/wwwroot/your-domain.com/server
cp .env.example .env  # 如果存在
# 或者直接创建 .env 文件
nano .env
```

**`.env` 文件内容示例：**
```env
PORT=3000
NODE_ENV=production
```

### 步骤4：配置前端生产环境变量

**创建前端生产环境配置文件：**

```bash
cd /www/wwwroot/your-domain.com
cp .env.production.example .env.production
# 或者直接创建
nano .env.production
```

**`.env.production` 文件内容：**
```env
# 使用相对路径，Nginx会处理反向代理
VUE_APP_API_BASE_URL=/api
```

> 💡 **说明**：由于使用Nginx反向代理，API地址应使用相对路径 `/api`，而不是绝对URL。

### 步骤5：构建前端项目

```bash
cd /www/wwwroot/your-domain.com
npm run build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹。

### 步骤6：使用PM2启动后端服务

```bash
cd /www/wwwroot/your-domain.com/server

# 使用PM2启动（推荐）
pm2 start server.js --name personal-website-api

# 或者使用PM2配置文件
pm2 start ecosystem.config.js

# 设置PM2开机自启
pm2 startup
pm2 save
```

**PM2常用命令：**
```bash
pm2 list              # 查看运行中的应用
pm2 logs              # 查看日志
pm2 restart all       # 重启所有应用
pm2 stop all          # 停止所有应用
pm2 delete all        # 删除所有应用
```

### 步骤7：配置Nginx反向代理

在宝塔面板中：
1. 进入 **网站** → 选择您的网站 → **设置**
2. 进入 **配置文件** 标签
3. 将配置替换为以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # 替换为您的域名
    
    # 前端静态文件
    location / {
        root /www/wwwroot/your-domain.com/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /www/wwwroot/your-domain.com/dist;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

4. 点击 **保存**，然后 **重载配置**

### 步骤8：配置SSL证书（可选但推荐）

在宝塔面板中：
1. 进入 **网站** → 选择您的网站 → **设置**
2. 进入 **SSL** 标签
3. 选择 **Let's Encrypt** 免费证书
4. 填写域名，点击 **申请**
5. 申请成功后，开启 **强制HTTPS**

### 步骤9：配置防火墙

在宝塔面板中：
1. 进入 **安全** → **防火墙**
2. 确保以下端口已开放：
   - **80** (HTTP)
   - **443** (HTTPS)
   - **3000** (后端API，仅本地访问，不需要对外开放)

## 🔍 验证部署

1. **检查后端服务：**
   ```bash
   curl http://localhost:3000/api/health
   ```
   应该返回：`{"status":"ok","message":"服务器运行正常"}`

2. **检查前端：**
   在浏览器访问：`http://your-domain.com`

3. **检查API：**
   在浏览器访问：`http://your-domain.com/api/health`

## 🛠️ 常见问题排查

### 问题1：前端无法访问API

**解决方案：**
- 检查 `src/utils/api.js` 中的 `baseURL` 配置
- 确保Nginx反向代理配置正确
- 检查后端服务是否正常运行：`pm2 list`

### 问题2：PM2服务无法启动

**解决方案：**
```bash
# 查看详细错误日志
pm2 logs personal-website-api --lines 50

# 检查Node.js版本
node -v

# 检查依赖是否安装完整
cd server
npm install
```

### 问题3：数据库权限问题

**解决方案：**
```bash
# 确保数据库目录有写权限
chmod 755 /www/wwwroot/your-domain.com/server/database
chmod 644 /www/wwwroot/your-domain.com/server/database/*.sqlite
```

### 问题4：静态文件404

**解决方案：**
- 检查 `dist/` 目录是否存在
- 检查Nginx配置中的 `root` 路径是否正确
- 确保文件权限正确：`chmod -R 755 /www/wwwroot/your-domain.com/dist`

## 📝 更新部署

当需要更新网站时：

```bash
cd /www/wwwroot/your-domain.com

# 1. 拉取最新代码（如果使用Git）
git pull

# 2. 更新依赖
npm install
cd server && npm install && cd ..

# 3. 重新构建前端
npm run build

# 4. 重启后端服务
pm2 restart personal-website-api

# 5. 重载Nginx配置（宝塔面板会自动重载）
```

## 🔐 安全建议

1. **修改默认端口**（可选）：
   在 `.env` 文件中修改 `PORT`，并在Nginx配置中相应修改

2. **设置文件权限**：
   ```bash
   # 限制敏感文件权限
   chmod 600 server/.env
   chmod 644 server/database/*.sqlite
   ```

3. **定期备份数据库**：
   ```bash
   # 备份SQLite数据库
   cp server/database/database.sqlite server/database/database.sqlite.backup.$(date +%Y%m%d)
   ```

4. **启用防火墙**：
   在宝塔面板中配置防火墙规则，只开放必要端口

## 📞 技术支持

如遇到问题，请检查：
1. PM2日志：`pm2 logs personal-website-api`
2. Nginx错误日志：宝塔面板 → 网站 → 日志
3. 系统日志：`journalctl -u nginx`

---

**祝您部署顺利！** 🎉

