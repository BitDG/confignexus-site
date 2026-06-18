# 事实包 + Claude plan 草案（供 Codex 会审/定稿用，非最终 plan）

> 给 Codex 的上下文：Codex 看不到本项目 SessionStart 注入的记忆，下面把项目现状、约束、Claude 初步设计一次性交代清楚。

## 任务一句话
让 `E:\configNexus-site`（ConfigNexus 官网，纯静态 HTML/JS）**脱离对 `E:\configNexus-1`（Electron App 源码）的构建期依赖**；同时把 App 里的「创意工坊组件开发文档」（13 篇）**打包成一个 Claude Skill**；并留一个**一键同步脚本**，需要时从 configNexus-1 拉最新覆盖。

## 项目现状（已核实）
- 官网是纯静态站：根目录有 `index.html / features.html / download.html / docs.html`，文档页靠 `docs-data.js`（`window.DOCS`）离线渲染（file:// 下 fetch 被拦，所以预打包成 JS）。
- 文档数据由 `build-docs.mjs` 生成。该脚本 **硬编码** `const SW = 'E:/configNexus-1/src/renderer/welcome'`，干三件事：
  1. 扫 `SW/md/{zh,en,ja,ko}` 下的 .md（含子目录，按相对路径作 key）→ 写 `docs-data.js`（`window.DOCS = {zh:{key:md},en,ja,ko}`）。
  2. 把 `SW/Res/{zh,en,ja,ko}` 整目录 `cpSync` 到站点 `docs/Res-{lang}/`（媒体：gifs/images/videos/templates）。
  3. 对照 `docs-manifest.js`（手建唯一真源，稳定 ID → 各语言 md key/分类）做一致性校验，报 WARN。
- `docs.js` 渲染时把 markdown 里的 `Res/(zh|en|ja|ko)/` 路径改写成 `docs/Res-$1/`；支持 `![]()` 图片、`video:` 视频、`createtab:` 模板按钮。
- **关键发现**：
  - `docs/Res-zh/`（约 14MB，42 个文件）**已经提交进 git**（已 tracked）。
  - `welcome/md`：zh 34 篇、en/ja/ko 各 21 篇（翻译子集），目前每次构建从 configNexus-1 现读，**未 vendor 进 site 仓库**。
  - `welcome/Res/{en,ja,ko}` 源头各只有 1 个文件（README 占位），**真实媒体几乎全是 zh**。所以"媒体独立"基本已完成，缺口主要是 md 正文每次现读 + build 的拷贝步骤仍指向 configNexus-1。
- 组件开发文档源：`E:\configNexus-1\app\docs\组件开发方案\`，13 篇（`00_组件开发总览.md` … `12_组件需求说明书模板.md`），共 188K，**纯文字无内嵌图片**，互相用相对链接 `./0X_xxx.md` 串联，引用了同级示例 app（`../../task_app/` 等，仅文本引用）。面向第三方开发者，技术栈 React+Vite+Tailwind，强调 Cyberpunk UI 风格 + IPC 对接规范。

## 大哥已拍板的方向
1. 组件文档 = 上述 13 篇创意工坊开发规范。
2. 打包形态 = **Skill**（不同时上官网；纯给 AI 加载用）。
3. 同步策略 = **保留一键同步脚本**（平时独立，需要时手动从 configNexus-1 拉最新覆盖）。

## Claude 初步设计（请 Codex 评审是否有更简/更稳的写法）

### A. 站点独立（vendoring）
- 新增 `content/md/{zh,en,ja,ko}/…`：把 welcome 的 md vendor 进 site 仓库并提交，成为站点内的真源。
- 媒体维持现状放 `docs/Res-{lang}/`（zh 已提交；en/ja/ko 仅 README 占位，体积可忽略）。
- 改 `build-docs.mjs`：
  - md 读取源从 `E:/configNexus-1/...` 改成本地 `./content/md`。
  - **删掉** step 2「从 configNexus-1 拷 Res」这段（媒体已是仓库内提交物，构建不再外拷）。
  - manifest 校验照旧。
  - 结果：build-docs.mjs 内 **不再出现任何 configNexus-1 路径**，构建 100% 独立。
- 验收：把 configNexus-1 目录临时改名/移走，`node build-docs.mjs` 仍能跑通、docs-data.js 与媒体完好；docs.html 仍渲染全部 34 篇 + 那张 gif/png。

### B. 一键同步脚本
- 新增 `sync-from-app.mjs`：**全仓库唯一**引用 configNexus-1 路径的文件。做三件事：
  1. `welcome/md/{lang}` → `content/md/{lang}`（覆盖）
  2. `welcome/Res/{lang}` → `docs/Res-{lang}`（覆盖）
  3. `app/docs/组件开发方案/*` → `skills/confignexus-component-dev/references/`（覆盖）
- `node sync-from-app.mjs` 手动跑。configNexus-1 不存在时友好报错退出，不阻塞。

### C. Skill 打包
- 新增 `skills/confignexus-component-dev/`（ascii kebab 文件夹名，满足 skill 规范）：
  - `SKILL.md`：frontmatter（name=confignexus-component-dev，description 含触发条件：当用户要"开发/做一个 ConfigNexus 创意工坊组件/插件"时加载），正文=总览 + 13 篇索引 + 使用顺序指引，指向 references/。
  - `references/00..12_*.md`：13 篇 vendor 进来（中文文件名保留）。
- 激活方式：site 仓库只是**规范源/可分发包**，用时把该文件夹拷/软链到 `~/.claude/skills/` 或 configNexus-1 的 `.claude/skills/`（组件开发实际发生地）。README/SKILL 里写清。

### 非目标
- 不重构 docs.js 渲染逻辑、不动 i18n、不动营销页。
- 不把 13 篇开发文档渲染上官网（大哥选了纯 Skill）。
- 不新翻译任何内容；不补 en/ja/ko 媒体。
- 不搭 MCP server。

### 风险/待 Codex 挑刺
- vendoring 后"双真源"风险：content/md 与 configNexus-1 谁是真源？设计是 site 内 content/ 为站点真源，App 为上游，sync 单向 App→site。需在文档写清避免反向误改。
- skill 在 site 仓库不会被 Claude 自动发现，必须有安装步骤——这是 Skill 形态的固有代价，是否需要做个 install 脚本？
- 13 篇文档版本是 v2.0/2024-12 快照，引用了 ../../task_app 等 App 内路径，作为 skill 参考是否需要清洗这些失效相对链接？
- 操作日志规则：本任务是构建工具+静态文档+skill，无 UI mutation / 无后端 mutation API，判定豁免（build 脚本 console.log 即可）。请 Codex 确认这个判定。
