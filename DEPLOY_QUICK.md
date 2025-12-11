# ⚡ 快速部署指南（宝塔Linux）

## 🎯 5分钟快速部署

### 1. 上传文件到服务器
```bash
# 使用宝塔文件管理器或FTP上传项目到：
/www/wwwroot/your-domain.com/
```

### 2. 安装Node.js和PM2
```bash
# 在宝塔终端执行
npm install -g pm2
```

### 3. 配置生产环境变量（可选）
```bash
cd /www/wwwroot/your-domain.com
# 创建生产环境配置文件
echo "VUE_APP_API_BASE_URL=/api" > .env.production
```

### 4. 运行部署脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

### 5. 配置Nginx（在宝塔面板中）

进入 **网站** → **设置** → **配置文件**，替换为：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /www/wwwroot/your-domain.com/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 6. 完成！

访问 `http://your-domain.com` 查看网站

---

## 📝 常用命令

```bash
# 查看服务状态
pm2 list

# 查看日志
pm2 logs personal-website-api

# 重启服务
pm2 restart personal-website-api

# 停止服务
pm2 stop personal-website-api

# 仅重新构建前端
./build.sh
```

## 🔧 更新网站

```bash
cd /www/wwwroot/your-domain.com
git pull          # 如果使用Git
./deploy.sh       # 重新部署
```

---

详细说明请查看 [README_DEPLOY.md](README_DEPLOY.md)

