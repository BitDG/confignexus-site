# 官网文档独立化与组件Skill · Context（AI 自用）

## 关键文件（改动边界）

### 会改
- `build-docs.mjs`（站点根）：去掉 `SW`/`SITE` 两处绝对路径硬编码，改 `import.meta.url` 推导根 + 读 `content/md`；删除从 configNexus-1 拷 Res 的 step 2；校验前置可阻断（先校验→失败非零退出不写产物→通过才写）；新增媒体引用存在性校验。
- `dev/issues.md`（不存在则建）：追加一条已知缺图 issue。

### 会建
- `content/md/{zh,en,ja,ko}/…`：vendor 进来的教程 md（zh 34 / en·ja·ko 各 20，build 跳 CHANGELOG）。来源 `E:/configNexus-1/src/renderer/welcome/md/<lang>`。
- `sync-from-app.mjs`（站点根）：一键同步脚本。本仓库唯一**可执行**引用 App 路径处；路径用 `--app-root`/env/同级回退。镜像同步 md+Res+组件文档 → content/md、docs/Res-*、skills/.../references；先验上游存在、默认拒覆盖本地改动(--force)、复制后自动 build。CLI 日志(起止/文件数/非零失败码)。
- `skills/confignexus-component-dev/SKILL.md`：frontmatter(name+触发description) + 独立列全 13 篇索引 + 阅读顺序。
- `skills/confignexus-component-dev/references/00..12_*.md`：13 篇组件开发文档，来源 `E:/configNexus-1/app/docs/组件开发方案/`，清洗 6 处 `../../*_app/` 失效链接。
- `skills/install.mjs`（或 README 段）：复制式安装到 `~/.claude/skills/` 或 App 的 `.claude/skills/`。

### 只读参考（不改）
- `docs.js`：第 49 行 `Res/(zh|en|ja|ko)/`→`docs/Res-$1/` 改写规则；媒体校验要复用同一改写逻辑判断文件存在。
- `docs-manifest.js`：结构真源（稳定 ID→各语言 md key/分类），build 校验对照它。媒体引用不在此校验，需新增。
- `docs/Res-zh/`（已提交，42 文件 14MB）：媒体现状，构建不再外拷后这里就是成品。

## 决策记录

- **content/md 定位 = App 上游的可编辑快照，不是"真源"**。内容上游是 App，结构真源是 manifest。单向同步 App→site，文档写清不要反向手改。（避免双真源误改）
- **媒体不再二次 vendor**：zh 媒体已提交在 `docs/Res-*`，en/ja/ko 上游仅占位。故媒体保持现状放 docs/Res-*，build 删拷贝步骤即可，不另建 content/Res（否则 14MB 提交两份，浪费）。
- **媒体校验引入已知缺失白名单**：首次加校验会把历史遗留缺图全报红；用白名单对已知缺失降级 WARN，避免一上来阻塞交付。资深视角：不是过度设计，是防止"新校验把旧债全变成硬错误"卡住本任务。
- **skill 用复制安装不用软链**：Windows 权限/跨盘/隐藏依赖会削弱独立性。单 skill 不升级 Claude 插件——没那个必要。
- **不抽通用同步框架**：sync 脚本就服务这一个上游，直写三段复制 + 校验，不做"可配置多源"这种没人要的灵活性。

## 依赖与约束

- Node ESM 脚本（`.mjs`，现有 build-docs.mjs 即是）；用 `fs` 的 `cpSync`/`rmSync` 等，`import.meta.url`+`fileURLToPath` 推导根。
- build-docs.mjs 现有校验逻辑（3a/3b/3c）保留，只调用顺序与退出码语义。
- 操作日志：build/docs/skill 豁免（构建工具）；sync 是改文件 CLI，要起止+文件数+非零失败码。
- Vite 版本不一致（02 写 ^5.x / 03 写 ^6.0.3）：以 App `package.json` 现用为准统一，打包前查。
- 13 篇互链：保留有效的 `./0X_*.md`；清洗 6 处 `../../*_app/`（指向 App 内 task_app/bag_app/mail_app 等，skill 内不存在）。
