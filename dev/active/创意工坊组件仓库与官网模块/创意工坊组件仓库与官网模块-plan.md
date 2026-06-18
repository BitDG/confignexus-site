# 创意工坊组件仓库与官网模块 · Plan

## 大哥摘要（先看这段）

你现在有两个项目：一个是软件本体 `configNexus-1`（私有，没公开），一个是官网 `confignexus-site`（公开）。软件里 `app/` 下攒了 15 个示例组件（背包、塔防、抽卡、修仙模拟器……都是教第三方怎么给配置大师做插件用的样板），还有两套开发文档和两个 AI 技能包（"技能包"= 给 AI 装上后它就照规范帮人写组件代码）。

这次干两件事：

1. **新开一个公开仓库**（暂定名 `confignexus-workshop`，地址 `https://github.com/digua12331/confignexus-workshop`），把这 15 个示例组件、开发文档、两个 AI 技能包**整理后收进去**，作为"创意工坊开发资料库"对外开放。这样第三方开发者去这个仓库就能拿到样板和文档照着做。**注意：是"复制一份整理进新仓库"，软件本体 `configNexus-1` 一个字都不动**，你现有的组件开发照常。
2. **官网加一个新页面**（顶部导航多一项"创意工坊"），把这 15 个组件列出来（图标 + 名字 + 简介），页面顶部放那个新仓库的 GitHub 地址，访客点进去就能看到所有组件、跳去 GitHub。

验收时你能看到的：(1) 本机多出一个 `configNexus-workshop` 文件夹，里面组件/文档/技能分门别类摆好，跑一条命令能装好依赖、能把某个组件构建出来；(2) 官网本地打开，顶部多一个"创意工坊"，点进去是组件画廊，每个组件有图标名字简介，顶部 GitHub 按钮指向新仓库。

**需要你拍板的几点（在下方"风险与待确认"里，确认 plan 时一起回我即可）**：仓库名是否就叫 `confignexus-workshop`、用什么开源协议（LICENSE）、要不要把巨大的游戏组件（127M 那几个）也全收进去、新仓库本次只在本机建好还是要我直接推到 GitHub。

---

## 目标（可验证的验收标准）

### 阶段一：新建并整理 `confignexus-workshop` 仓库（本机，先不推送）

1. **目录成形且自包含**：新仓库根目录下有 `components/`（含 `_shared` / `_template` / `package.json` / 15 个组件源码，排除 `node_modules` 与 `dist`）、`docs/`（组件开发方案 13 篇 + 插件Mod开发方案 3 篇）、`skills/`（confignexus-component-dev + confignexus-mod 两个技能）、`README.md`、`LICENSE`、`.gitignore`。
   - 验收：`ls confignexus-workshop` 看到上述结构；`git -C configNexus-workshop status` 显示是一个已初始化、已本地提交的仓库；`node_modules`/`dist` 不在版本库内（`git ls-files | grep -E 'node_modules|/dist/'` 为空）。
2. **组件可独立构建**：在 `components/` 下 `npm install` 后，任选一个组件（如 `bag_app`）`npm run build` 成功产出 `dist/`。
   - 验收：`cd components && npm install && cd bag_app && npm run build` 退出码 0，生成 `dist/index.html`。
3. **技能链接自洽**：搬进来的 `confignexus-mod` 技能里原本指向 `../../../app/docs/...` 和 `../../../plugins/...` 的相对链接，改写成新仓库内的 `../../docs/插件Mod开发方案/...`；`confignexus-component-dev` 的 13 篇 references 互链保持有效。
   - 验收：在新仓库内 `grep -rn '\.\./\.\./\.\./app' skills/` 无残留；技能 SKILL.md frontmatter 合法。
4. **主程序零改动**：整个阶段不写入 `E:\configNexus-1` 任何文件。
   - 验收：`git -C E:/configNexus-1 status --porcelain` 在本阶段前后一致（无新增改动）。

### 阶段二：官网新增"创意工坊"页面

5. **新页面可访问且列全组件**：`confignexus-site` 新增 `workshop.html`，顶部导航（index/features/download/docs/workshop 五处）新增"创意工坊"项，页面列出全部 15 个组件（图标 + 多语言名 + 简介），页面顶部有指向新仓库的 GitHub 链接按钮。
   - 验收（浏览器可观察）：本地打开 `index.html`，顶部导航看到"创意工坊"；点进去看到 15 张组件卡片，每张有图标、名字、一句简介；页面顶部"在 GitHub 上查看"按钮 href 指向 `https://github.com/digua12331/confignexus-workshop`，新标签打开。
6. **四语不退化**：新页面文案进 `i18n.js`，中/英/日/韩切换正常（组件标题用 metadata 里的 `displayNames` 四语；简介至少中文，其余语言回退中文或英文）。
   - 验收：切到 English，导航与页面标题、组件名变英文，无中文残留报错；其余三语同理。
7. **官网构建独立性不破坏**：现有 `node build-docs.mjs` 仍通过；新页面不引入对 `configNexus-1` 的构建期依赖。
   - 验收：`node build-docs.mjs` 退出码 0；新页面用的组件数据是提交进站点的静态文件，不在构建期读 `app/`。

---

## 非目标（本次不做）

- **不动 `configNexus-1` 任何文件**（最高优先级约束）。新仓库是"复制整理"，不是"迁移"，软件本体的 `app/`、`.claude/skills/`、`docs/` 原样保留。
- **不把 `plugins/*-mod` 6 个真实插件源码搬进新仓库**：它们引用主程序内部 `src/main/ipc/...`，不自包含，且属产品代码，公开是更大的决定。本次只搬"插件Mod开发文档 + mod 技能（文档形态）"，插件源码示例留作后续可选项。
- **不把组件开发文档渲染成官网网页正文**（沿用前序任务"纯 Skill 形态 + 仓库托管"的决定，官网只做"列表 + 跳 GitHub"）。
- **本次不自动 `git push` 到 GitHub / 不自动 `gh repo create`**（推公开仓库是对外动作，需大哥明确点头；默认只在本机 init + commit，给出推送命令）。除非大哥在确认时明确说"直接推"。
- 不给组件补写新功能、不重构组件源码、不翻译教程正文。
- 不搭建自动同步框架（不把 `app/` → 新仓库做成常驻 sync；本次一次性整理，如需可后补脚本）。

---

## 实施步骤

### 阶段一：建仓库

1. **定结构、建空仓库**：在 `E:\configNexus-workshop` 建目录，`git init`，写 `.gitignore`（`node_modules/`、`**/dist/`、`*.log`）。
   - 验证：目录与 `.gitignore` 存在。
2. **搬组件**：用 `robocopy app components /E /XD node_modules dist docs 归墟`（递归排除任意层级 node_modules，含 classic-tower-defense/shot 自带的）把 `E:\configNexus-1\app` 复制到新仓库 `components/`。保留 `_shared`、`_template`、`create_component.bat`、`build_all.bat`、`package.json`、`package-lock.json`。复制后扫一遍确认无残留 `node_modules`/`dist`。
   - **修 workspaces（Codex 提醒）**：`app/package.json` 的 `workspaces` 只列了 7 个，实际 15 个组件。复制后枚举所有组件目录，把 `workspaces` 补全为 15 个，**并删除旧 `package-lock.json` 重新 `npm install` 生成**（否则公开仓库安装结果不可复现）。
   - 大体积组件（life-tetris 126M / red-void-defense 127M / shot 57M）排除 node_modules/dist 后剩余体积需复核；若仍过大，按"待确认"项决定是否收录（见风险段）。
   - 验证：`components/` 下 15 个组件目录齐全（或按确认后的子集），无 `node_modules`/`dist`；`workspaces` 覆盖全部收录的组件。
3. **搬文档**：`组件开发方案`（13 篇）、`插件Mod开发方案`（3 篇）从 `configNexus-1/app/docs/` 复制到新仓库 `docs/`。
   - 验证：`docs/组件开发方案` 13 个 md、`docs/插件Mod开发方案` 3 个 md。
4. **搬技能 + 修链接**：
   - `confignexus-component-dev`：从 `confignexus-site/skills/` 复制（已是清洗过的形态）。
   - `confignexus-mod`：从 `configNexus-1/.claude/skills/confignexus-mod/` 复制，把 SKILL.md 里 `../../../app/docs/插件Mod开发方案/` 改写为 `../../docs/插件Mod开发方案/`；`../../../plugins/...` 引用降级为"示例插件在主程序仓库"的文字说明（新仓库不含插件源码）。
   - **全量扫链接（Codex 提醒）**：不止改这两类，用 `rg` 把整个 `skills/confignexus-mod` 扫一遍硬编码绝对路径、`app/`、`src/`、`.claude`、二级链接，逐个修正或降级；确认安装后相对路径仍能解析。
   - 验证：`grep -rn '\.\./\.\./\.\./' skills/` 无残留；`rg 'E:\\\\|configNexus-1|/src/main' skills/` 无残留；两个 SKILL.md frontmatter 合法。
5. **写 README + LICENSE**：README 说明仓库定位（创意工坊开发资料库）、目录导览、组件如何 `npm install` + 构建、技能如何安装（可复用 `install.mjs` 思路），**写明 Node/npm 版本要求**（React 19 / Vite 7 / Tailwind 4 对环境敏感）。LICENSE 按大哥选定的协议写入。
   - 验证：README 打开结构清晰；LICENSE 存在。
6. **发布前体检 + 构建自检 + 本地提交**：
   - **公开前扫私密信息（Codex 提醒）**：扫 components/docs/skills/metadata，确认无 `E:\configNexus-1` 等私有绝对路径、内部接口地址、不可公开素材引用。
   - `cd components && npm install`，挑一个组件 `npm run build` 通过；`git add -A && git commit`（本地提交，不 push）。
   - 验证：私密扫描干净；构建退出码 0；`git log` 有一条初始提交；`E:/configNexus-1` 无改动。

### 阶段二：官网模块

7. **生成组件数据文件**：写一次性脚本读 15 个组件的 `metadata.json`，**用 `JSON.stringify` 序列化**（不手拼字符串，避免简介里引号/换行破坏 JS 或 XSS）生成 `confignexus-site/workshop-components.js`（每条含 id、四语 displayName、icon、zh 简介），提交进站点。**脚本源路径参数化、不写死 `E:\configNexus-1`，且不接入 build pipeline**，构建期不读 `app/`，保持独立。
   - 验证：`workshop-components.js` 含 15 条且是合法 JS；`node build-docs.mjs` 不依赖它也照常过。
8. **建 `workshop.html`**：仿 `features.html` 结构（同一套 header/footer/nav/`site.css`），顶部放标题 + GitHub 按钮，主体渲染组件卡片网格（图标 + 名 + 简介）。
   - 验证：浏览器打开，卡片网格与 GitHub 按钮显示正常。
9. **加导航项**：在 `index.html`/`features.html`/`download.html`/`docs.html`/`workshop.html` 五处 nav 与 footer 增加"创意工坊"链接。
   - 验证：每个页面顶部都能看到并点到"创意工坊"。
10. **i18n 四语**：在 `i18n.js` DICT 增加 `nav.workshop` 与新页面文案键（中/英/日/韩）；组件名直接取 `workshop-components.js` 的 displayNames，不重复进 DICT。
    - 验证：四语切换页面文案与导航正确，无报错。
11. **官网构建校验**：`node build-docs.mjs` 通过；`git diff --name-only HEAD` 只含本任务预期文件。
    - 验证：退出码 0；diff 无越界。

---

## 边界情况

- **大体积组件**：life-tetris / red-void-defense / shot 即便排除 node_modules/dist 仍可能很大（游戏美术/音视频）。需复核净体积，过大则按"待确认"决定是否收录或只收轻量子集。
- **组件对 `_shared` 的硬依赖**：所有组件 `import '../_shared/sdk/confignexus-sdk'` 且 vite alias `@shared`→`../_shared`。新仓库必须保留 `components/_shared` 与扁平同级布局，否则构建即断。
- **部分组件自带 node_modules**（如 classic-tower-defense、shot）：复制时务必排除，否则版本库爆炸且与 `components/package.json` workspace 冲突。
- **mod 技能引用插件源码**：新仓库不含 `plugins/`，SKILL.md 对 `plugins/ollama-mod` 等的"照现成改"指引需改为"示例在主程序仓库"或降级说明，避免死链误导。
- **组件描述只有中文**：metadata 的 `displayNames` 四语齐全但 `description` 多为中文。非中文页面简介回退策略需定（回退中文/英文/留空）。
- **GitHub 链接先行**：官网链接指向的新仓库本次默认不 push，链接会暂时 404，直到大哥推送。验收时说明此点。

---

## 风险与待确认

**大哥已确认（2026-06-17）**：

1. **仓库名** = `confignexus-workshop`（→ `github.com/digua12331/confignexus-workshop`）。
2. **LICENSE** = **Apache-2.0**。
3. **组件范围** = 大哥选"只收轻量的"，但实测净体积（排除 node_modules/dist）后**全部 15 个都是轻量**：最大 xianxia-simulator 5.4M（其 5.2M 为 `public/` 游戏素材），shot 529K，其余均 ≤251K，15 个源码合计约 8M。原"100M+ 大游戏"全是 node_modules，前提不成立 → 按"轻量即收"的标准，**15 个全收**（大哥回"继续"确认按此推进）。
4. **不推 GitHub** = 本次只在本机 `git init` + 本地提交，给出推送命令，大哥自己推。官网按钮指向 `github.com/digua12331/confignexus-workshop`，推送前会 404（预期）。

**技术风险（我自己兜，列出存档）**：

- **双快照漂移**：新仓库的组件/文档是 `app/` 的复制快照，日后上游更新会漂移。本次一次性整理，README 注明"上游真源在主程序仓库"；如需常驻同步另起任务。
- **官网链接 404 窗口期**：未推送前链接 404，属预期，已在边界情况说明。
- **构建独立性**：官网新页面坚持用提交进仓库的静态数据，不在构建期读 `app/`，延续前序"剪脐带"成果（见 `dev/active/官网文档独立化与组件Skill`）。

---

## 项目记忆扫描

- `dev/memory/auto.md`、`manual.md`：均为空模板，无相关条目。
- 强相关前序任务：`dev/active/官网文档独立化与组件Skill/`（已把 `confignexus-component-dev` 打成纯 Skill 形态、建 `sync-from-app.mjs`、官网构建已剪断对 `configNexus-1` 的依赖）。本任务延续其"单向复制快照、复制式安装技能、官网构建独立"的既定决策。

---

## 多模型 Plan 会审

> [Codex 评审] "app/package.json 的 workspaces 只列 7 个、实际 15 个，复制后须枚举补全并重生成 package-lock，否则安装不可复现；Windows 排除 node_modules/dist 用 robocopy /E /XD 最稳，复制后扫残留；confignexus-mod 链接修正不止两类，要 rg 全量扫绝对路径/app//src//.claude/二级链接；一次性生成脚本读 configNexus-1 不违反构建独立（产物已提交、build 不读），但脚本须参数化源路径、不接入 build、公开仓库不留私有绝对路径；workshop-components.js 用 JSON.stringify 不手拼；README 写明 Node/npm 版本；发布前全量扫私密路径/内部接口。显著更简路径：两阶段可独立交付——若只为官网展示先落阶段二，可构建仓库作为后续独立发布。"
> [Codex 综合主笔] 采纳全部技术补充并并入实施步骤（workspaces 补全+lock 重生、robocopy 排除、mod 技能全量扫链接、生成脚本 JSON.stringify+参数化+不入 build、发布前私密体检、README 版本要求）。保留两阶段同任务交付（官网链接需先定仓库名/URL，阶段一阶段二都依赖同一个确定的仓库名，拆任务反而多一轮对齐），但在风险段标注两阶段技术上可独立验收。放弃"裸复制 app/"的写法，因 workspaces 漏列与自带 node_modules 会让公开仓库安装不可复现。
> [Claude 白话化兜底] 大哥摘要已是 3-5 行白话、术语（仓库/技能包/构建/LICENSE）均括号解释；核对项目记忆 auto/manual 为空、无冲突偏好；确认延续前序"官网文档独立化"任务的既定决策（单向复制快照、复制式装技能、官网构建独立），未违反"不动主程序"的硬约束——本次全程对 `configNexus-1` 只读。
