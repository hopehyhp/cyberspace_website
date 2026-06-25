# 代码风格与格式化（ESLint + Prettier）说明

此文档说明项目中新增的代码规范化/格式化配置、常用规则、IDE 集成和如何在本地/CI 中运行格式化与校验命令。

目标
- 保持代码风格一致，降低团队审查成本。
- 自动修复可修复的问题（Prettier + ESLint --fix）。
- 与 VS Code 集成实现保存即修复（可选）。

新增文件（位置：项目根）
- `.eslintrc.js` — ESLint 主配置，集成 `vue-eslint-parser`、`@babel/eslint-parser`、`eslint-plugin-vue` 与 `eslint-plugin-prettier`。
- `.eslintignore` — 忽略构建产物、依赖与无关文件。
- `.prettierrc` — Prettier 配置。
- `.prettierignore` — 忽略 Prettier 不需格式化的路径。
- `.vscode/settings.json` — （可选）工作区 VSCode 设置：保存时自动运行 ESLint fix。

快速使用
- 格式化（Prettier）：
  npm run format

- ESLint 检查（严格）:
  npm run lint:eslint

- ESLint 自动修复（可修复的规则）:
  npm run lint:eslint:fix

注意：这些脚本已写入 `package.json`（如不存在请参考本仓库的 package.json）。

Prettier 规则（来自 `.prettierrc`）
- printWidth: 100
- singleQuote: true（尽量使用单引号）
- semi: true（语句末尾加分号）
- trailingComma: "es5"（符合 ES5 的尾随逗号规则）
- arrowParens: "avoid"（单参数箭头函数省略括号）
- endOfLine: "lf"（文件内部采用 LF 换行）

主要 ESLint 规则要点（来自 `.eslintrc.js`，仅列出重点）
- 环境：browser、node、es2021
- 插件：vue、prettier、import（用于 import 校验）
- 扩展：eslint:recommended、plugin:vue/essential、plugin:prettier/recommended
- 常见规则：
  - no-console / no-debugger：生产环境警告，开发环境关闭
  - no-unused-vars：warn，带有 `_` 前缀的变量可被忽略
  - prettier/prettier：与 `.prettierrc` 保持一致，作为错误报告
  - vue/script-setup-uses-vars、vue/max-attributes-per-line 等 Vue 相关规则

VSCode 集成
- 已在 `.vscode/settings.json` 中启用：
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true }
  这样在保存文件时会触发 ESLint 的 fix（需要安装 VSCode 的 ESLint 插件并启用工作区）。

换行符（CRLF vs LF）说明
- Prettier 设定 `endOfLine: 'lf'`，建议仓库中使用 LF。Windows 本地如果出现大量 CRLF 导致的 prettier 报错，请在 Git 配置或编辑器中设置
  core.autocrlf=false（或根据团队策略设置）。

CI / 持续集成建议
1. 在 CI（GitHub Actions / GitLab CI）中运行 `npm ci && npm run lint:eslint`，并在发现问题时让构建失败。2. 可在 PR 流程中添加 `npm run format` 的可选步骤或在 merge 前强制运行 `lint:eslint:fix` + reformat 并提交。

Git 钩子建议（可选）
- 使用 `husky` + `lint-staged`：在 pre-commit 钩子上运行 `prettier --write` 和 `eslint --fix`，保证提交的代码符合规范。

已完成/当前状态（需求覆盖）
- 添加并配置 `.eslintrc.js`：Done
- 添加并配置 `.prettierrc`：Done
- 添加 `.eslintignore` / `.prettierignore`：Done
- 添加 VSCode 工作区设置（可选）: Done
- package.json 增加 `lint`/`lint:eslint`/`lint:eslint:fix`/`format` 脚本：Done（已写入）
- devDependencies：Prettier 与相关 ESLint 插件已添加到 `package.json`（请确保你已运行 `npm install`）：Done

常见问题与解决方法
- 如果看到大量 `prettier/prettier` 报错，优先运行 `npm run format`，再运行 `npm run lint:eslint:fix`。
- 若在 Windows 上遇到 npm 安装缓存权限问题：可指定本地缓存 `--cache ./.npm-cache` 或以管理员身份运行，或修复全局 npm cache 路径权限。
- 若想强制 LF：在 Git 中设置 `.gitattributes`（例如 `* text=auto eol=lf`）并重新签出仓库。
