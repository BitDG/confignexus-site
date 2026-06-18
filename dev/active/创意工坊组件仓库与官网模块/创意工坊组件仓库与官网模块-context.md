# 创意工坊组件仓库与官网模块 · Context（AI 自用）

## 关键文件（改动边界）

### 新建（阶段一：`E:\configNexus-workshop`，全新仓库）
- `E:\configNexus-workshop\.gitignore`：`node_modules/`、`**/dist/`、`*.log`。
- `E:\configNexus-workshop\components\`：从 `E:\configNexus-1\app` 复制（robocopy /E /XD node_modules dist docs 归墟）。保留 `_shared`、`_template`、`create_component.bat`、`build_all.bat`、`package.json`、`package-lock.json` + 15 个组件目录。
  - `components\package.json`：`workspaces` 补全为 15 个（原只列 7：talent_app/dialogue_app/gacha_app/map_app/bag_app/task_app/shot）；删旧 `package-lock.json` 重 `npm install` 重生。
- `E:\configNexus-workshop\docs\组件开发方案\`（13 篇）、`docs\插件Mod开发方案\`（3 篇）：从 `configNexus-1\app\docs\` 复制。
- `E:\configNexus-workshop\skills\confignexus-component-dev\`：从 `configNexus-site\skills\confignexus-component-dev\` 复制（已清洗形态）。
- `E:\configNexus-workshop\skills\confignexus-mod\`：从 `configNexus-1\.claude\skills\confignexus-mod\` 复制 + 修链接（`../../../app/docs/` → `../../docs/`；`../../../plugins/` → 文字说明）。
- `E:\configNexus-workshop\README.md`、`LICENSE`（Apache-2.0）。

### 新建（阶段二：`E:\configNexus-site`）
- `workshop-components.js`：一次性脚本读 15 个 metadata.json 生成（JSON.stringify，id/四语 displayName/icon/zh 简介）。
- `workshop.html`：仿 `features.html`（同 header/footer/nav/site.css）。
- `scripts/gen-workshop-data.mjs`（或同类）：生成上面数据文件的一次性脚本，源路径参数化，不入 build。

### 会改（阶段二：`E:\configNexus-site`）
- `index.html` / `features.html` / `download.html` / `docs.html`：nav 与 footer 各加一项"创意工坊"→ `workshop.html`。
- `i18n.js`：DICT 加 `nav.workshop` + workshop 页文案键（中/英/日/韩）。
- `site.css`：仅当现有 `.card`/`.cards` 样式不够用时才补；优先复用。

### 只读参考（不改）
- `E:\configNexus-1\**`：**全程只读，禁止写入**（最高约束）。
- `features.html`：抄它的页面骨架（header/nav/footer/section/cards 结构）。
- `i18n.js`：DICT 结构（zh/en/ja/ko 四块，含 `<` 的值按 HTML 注入），仿现有 `nav.*` 与 `feat.*` 加键。
- `skills/install.mjs`、`skills/README.md`：新仓库 README 的安装说明可借鉴其措辞。

## 决策记录

- **复制而非迁移**：新仓库是 `app/` 的快照副本，`configNexus-1` 原样不动。资深视角：不抽"双向同步框架"——本次一次性整理，没人要常驻同步的灵活性；真要再说。
- **保持 components/ 扁平布局**：组件 `import '../_shared/...'` + vite alias `@shared`→`../_shared`，必须让 `_shared` 与各组件同级，照搬 `app/` 布局最省事、零改组件源码（符合"不顺手重构"）。
- **workspaces 补全到 15**：原 7 个是历史遗留。补全 + 重生 lock，保证公开仓库 `npm install` 可复现（Codex 提醒）。
- **mod 技能链接降级**：新仓库不含 `plugins/` 源码（它们引用主程序内部 `src/`，不自包含，且是产品代码）。SKILL.md 里指向 plugins 的"照现成改"改为"示例在主程序仓库"文字说明，避免死链。
- **官网用静态数据文件**：`workshop-components.js` 一次性生成、提交进仓库，构建期不读 `app/`——延续前序"官网构建独立"成果。生成脚本参数化源路径，公开产物无 `E:\configNexus-1` 私有路径。
- **组件名取 metadata.displayNames**：四语齐全，直接用；简介只有中文，非中文页回退中文（不强行机翻，避免引入未经审校文案）。
- **不过度做**：不给组件加功能、不重构、不搭 CI、不做组件详情页（本次只列表 + 跳 GitHub）。

## 依赖与约束

- 新仓库组件技术栈基准（以 `app/package.json` 为准）：react/react-dom ^19.2.0、vite ^7.3.0、@vitejs/plugin-react ^5.1.2、tailwindcss/@tailwindcss/vite ^4.1.18、typescript ~5.8.2。README 写明 Node/npm 版本要求。
- 15 个组件（确认全收）：bag_app, classic-tower-defense, dialogue_app, figball, figsnake.io, gacha_app, life-tetris, mail_app, map_app, mecha_codex_app, red-void-defense, shot, talent_app, task_app, xianxia-simulator。`归墟`（无 metadata，企划/美术）不收。
- 操作日志：本任务产物多为构建工具 / 静态站，CLI 脚本（gen-workshop-data）按 console 起止输出即可；官网是纯静态展示页，无 mutation，豁免埋点。
- Apache-2.0：LICENSE 全文 + 在 README 标注；如需可在组件头部加 SPDX，本次先只放根 LICENSE（不逐文件改，避免动 15×N 文件）。
- 跨盘/Windows：robocopy 做排除复制；技能/数据用复制，不软链。
