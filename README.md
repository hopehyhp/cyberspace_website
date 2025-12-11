# 🌐 Personal Website - 赛博空间

<div align="center">

![Vue](https://img.shields.io/badge/Vue-2.6.14-4FC08D?style=flat-square&logo=vue.js)
![Vue Router](https://img.shields.io/badge/Vue%20Router-3.5.4-4FC08D?style=flat-square&logo=vue.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=flat-square)

一个具有赛博朋克风格的个人网站，展示个人信息、留言互动和娱乐游戏功能。

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [技术栈](#-技术栈)

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

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run serve
```

访问 [http://localhost:8080](http://localhost:8080) 查看效果

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
├── src/
│   ├── assets/            # 静态资源（图片等）
│   │   └── logo.png
│   ├── components/        # 可复用组件
│   │   └── Navigation.vue # 导航栏组件
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── styles/            # 全局样式
│   │   └── cyberpunk-theme.css
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   │   ├── games/         # 游戏相关页面
│   │   │   ├── Gomoku3x3.vue
│   │   │   └── GuessNumber.vue
│   │   ├── Entertainment.vue
│   │   ├── Home.vue
│   │   ├── MessageBoard.vue
│   │   └── PersonalIntro.vue
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── .gitignore
├── babel.config.js
├── package.json
├── README.md
└── vue.config.js
```

## 🛠 技术栈

- **前端框架**: Vue 2.6.14
- **路由管理**: Vue Router 3.5.4
- **构建工具**: Vue CLI 5.0
- **代码规范**: ESLint
- **样式**: CSS3 (赛博朋克主题)

## 📝 开发说明

### 自定义配置

项目使用 Vue CLI 进行构建，更多配置请参考 [Vue CLI 配置文档](https://cli.vuejs.org/config/)。

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置
3. 如需在导航栏显示，更新 `src/components/Navigation.vue`

### 添加新游戏

1. 在 `src/views/games/` 目录下创建游戏组件
2. 在路由中添加游戏路由
3. 在 `Entertainment.vue` 中添加游戏卡片

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

```
MIT License

Copyright (c) 2024 Personal Website Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/hopehyhp/personal_website/issues)
- 发送 Pull Request

## ⭐ 致谢

感谢所有为本项目做出贡献的开发者！

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [Hope hyhp]

</div>
