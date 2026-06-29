# 🌐 Personal Website - 赛博空间

<div align="center">

![Vue](https://img.shields.io/badge/Vue-2.6.14-4FC08D?style=flat-square&logo=vue.js)
![Vue Router](https://img.shields.io/badge/Vue%20Router-3.5.4-4FC08D?style=flat-square&logo=vue.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=flat-square)

一个具有赛博朋克风格的个人网站，展示个人信息、留言互动和娱乐游戏功能。


[功能特性](#-功能特性) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [技术栈](#-技术栈)

**项目演示地址：** https://www.hopehu.cloud

</div>

---

## ✨ 功能特性

- 🎨 **赛博朋克风格设计** - 采用霓虹灯效果和未来感UI设计，营造沉浸式视觉体验
- 📱 **响应式布局** - 完美适配桌面端和移动端设备
- 🏠 **个人主页** - 展示个人介绍、技能和经历
- 💬 **留言板功能** - 支持访客留言和互动交流
- 🎮 **娱乐游戏** - 内置多款小游戏，包括：
  - 3x3 五子棋 - 经典五子棋的迷你版本
  - 猜数字游戏 - 考验逻辑推理能力
  - 俄罗斯方块 - 经典消除游戏
- 🎯 **单页应用** - 基于 Vue Router 实现流畅的页面切换
- ⚡ **性能优化** - 轻量级设计，快速加载

## 🚀 快速开始

### 环境要求

- Node.js >= 12.x
- npm >= 6.x 或 yarn >= 1.x

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/hopehyhp/personal_website.git
cd personal_website
```

2. **安装前端依赖**
```bash
npm install
```

3. **安装后端依赖**
```bash
cd server
npm install
cd ..
```

4. **启动项目**

分别启动前端和后端：

终端 1 - 启动后端：
```bash
cd server
npm run dev
```

终端 2 - 启动前端：
```bash
npm run serve
```

5. **访问应用**

- 前端：http://localhost:8080
- 后端 API：http://localhost:3000/api

> 💡 **提示**：确保后端服务器先启动，前端才能正常使用留言板功能

### 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist/` 目录

### 代码检查

```bash
npm run lint
```

## 📁 项目结构

```
personal_website/
├── public/                 # 静态资源
│   ├── index.html         # HTML 模板
│   └── favicon.ico        # 网站图标
├── src/                   # 前端源代码
│   ├── assets/            # 静态资源（图片等）
│   │   ├── grid/          # 网格图片资源
│   │   ├── logo.png
│   │   └── userImage.png
│   ├── components/        # 可复用组件
│   │   └── Navigation.vue # 导航栏组件
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── styles/            # 全局样式
│   │   └── cyberpunk-theme.css
│   ├── utils/             # 工具函数
│   │   └── api.js         # API 请求封装
│   ├── views/             # 页面视图
│   │   ├── games/         # 游戏相关页面
│   │   │   ├── Gomoku3x3.vue    # 3x3 五子棋
│   │   │   ├── GuessNumber.vue  # 猜数字游戏
│   │   │   └── Tetris.vue       # 俄罗斯方块
│   │   ├── Entertainment.vue    # 娱乐页面
│   │   ├── Home.vue             # 首页
│   │   ├── MessageBoard.vue     # 留言板
│   │   └── PersonalIntro.vue    # 个人介绍
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── server/                # 后端服务器
│   ├── database/          # 数据库相关
│   │   ├── db.js          # 数据库连接和初始化
│   │   └── database.sqlite # SQLite 数据库文件（自动生成）
│   ├── routes/             # API 路由
│   │   └── messages.js    # 留言板路由
│   ├── .env.example       # 环境变量示例
│   ├── .gitignore
│   ├── ecosystem.config.js # PM2 进程管理配置
│   ├── package.json       # 后端依赖
│   ├── README.md          # 后端文档
│   └── server.js          # 服务器入口
├── scripts/               # 工具脚本
│   ├── generate_grid.html # 网格生成工具
│   ├── split_image.js    # 图片分割脚本（Node.js）
│   ├── split_image.py    # 图片分割脚本（Python）
│   └── README.md         # 脚本说明
├── .gitignore
├── babel.config.js
├── jsconfig.json         # JavaScript 配置
├── package.json           # 前端依赖
├── README.md
├── vue.config.js         # Vue CLI 配置
└── LICENSE               # MIT 许可证
```

## 🛠 技术栈

### 前端
- **框架**: Vue 2.6.14
- **路由**: Vue Router 3.5.4
- **HTTP 客户端**: Axios 1.6.0
- **构建工具**: Vue CLI 5.0
- **代码规范**: ESLint
- **样式**: CSS3 (赛博朋克主题)

### 后端
- **运行环境**: Node.js
- **Web 框架**: Express 4.18.2
- **数据库**: SQLite3 5.1.6
- **跨域处理**: CORS 2.8.5
- **请求解析**: body-parser 1.20.2
- **环境变量**: dotenv 16.3.1
- **开发工具**: Nodemon 3.0.1 (开发模式自动重启)

## 📝 开发说明

### 自定义配置

项目使用 Vue CLI 进行构建，更多配置请参考 [Vue CLI 配置文档](https://cli.vuejs.org/config/)。

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置
3. 如需在导航栏显示，更新 `src/components/Navigation.vue`

### 添加新游戏

1. 在 `src/views/games/` 目录下创建游戏组件
2. 在 `src/router/index.js` 中添加游戏路由配置
3. 在 `src/views/Entertainment.vue` 中添加游戏卡片

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 ESLint 规则
- 使用有意义的变量和函数名
- 添加必要的注释
- 保持代码风格一致

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/hopehyhp/personal_website/issues)
- 发送 Pull Request

## 🎯 路由说明

- `/` - 首页
- `/about` - 个人介绍
- `/messages` - 留言板
- `/entertainment` - 娱乐游戏中心
- `/entertainment/gomoku3x3` - 3x3 五子棋
- `/entertainment/guess-number` - 猜数字游戏
- `/entertainment/tetris` - 俄罗斯方块

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [Hope hyhp]

</div>

