# 创意工坊组件仓库与官网模块 · 任务清单

## 阶段一：新建并整理 confignexus-workshop 仓库（本机）

- [x] 1. 建仓库骨架 → verify: `E:\configNexus-workshop` 存在，`git status` 显示已 init，`.gitignore` 含 node_modules/dist
- [x] 2. robocopy 搬组件到 components/ → verify: 15 个组件目录齐全，扫不到残留 node_modules/dist，_shared/_template/脚手架在
- [x] 3. 补全 workspaces=15 + 重生 package-lock → verify: workspaces 列全 15；删旧 lock 后 `npm install` 成功(451 包)生成新 lock
- [x] 4. 搬两套文档到 docs/ → verify: docs/组件开发方案 13 篇、docs/插件Mod开发方案 3 篇
- [x] 5. 搬两个技能 + 修 mod 技能链接 + 清私有路径 → verify: mod 技能 4 处文档链接改 ../../docs/ + 加范围说明；6 文件 10 处本机私有绝对路径已清空
- [x] 6. 写 README + LICENSE(Apache-2.0) → verify: README 含目录导览/组件清单/Node≥20 版本/安装说明；LICENSE 为 Apache-2.0 全文
- [x] 7. 发布前私密体检 + 构建自检 + 本地提交 → verify: 私有路径已清空、.env.local 占位密钥已 gitignore 并补 .example；bag_app `npm run build` exit 0；commit be9ea68 成功；configNexus-1 的改动经核实为大哥在途开发(非本任务产生，robocopy 只读源)

## 阶段二：官网"创意工坊"页面

- [x] 8. 生成 workshop-components.js（一次性脚本，JSON.stringify，参数化源路径） → verify: 含 15 条、合法 JS、node 加载通过；脚本不入 build pipeline、不写死私有路径
- [x] 9. 建 workshop.html（仿 features.html）：顶部标题 + GitHub 按钮 + 组件卡片网格 → verify: DOM 模拟跑 workshop.js 真实渲染：四语各 15 卡片(emoji+名+中文简介)、15 组件 GitHub 链接、顶部按钮 href=新仓库。真实浏览器视觉留大哥一眼（本机 browser MCP 未接入，agent SKIP）
- [x] 10. 五处 nav + footer 加"创意工坊"链接 → verify: index/features/download/docs/workshop 各 2 处 workshop 链接（nav+footer）
- [x] 11. i18n.js 补四语（nav.workshop + 页面键） → verify: nav.workshop ×4；ws.* 12 键 ×4 语=48，各键各 4 次；node --check 通过
- [x] 12. 官网构建校验 + diff 核对 → verify: `node build-docs.mjs` exit 0（仅白名单历史缺图 WARN）；本任务改动严格落在 workshop.* / scripts/gen-workshop-data.mjs / i18n.js / 4 页 nav，未碰 site.css/docs.js/intro.js 等前序未提交文件
