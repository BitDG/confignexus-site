# 官网文档独立化与组件Skill · Plan

## 大哥摘要（先看这段）

现在官网有个"脐带"没剪断：每次重新生成文档，都得去 `configNexus-1`（你那个软件的源码项目）里现读教程正文、现拷图片视频。软件项目挪个位置或不在了，官网就构建不出来了。这次干三件事：

1. **剪脐带**：把教程正文（中/英/日/韩，共 34 + 20×3 篇）和图片视频都**搬进官网项目自己存着、提交进版本库**，以后构建只读官网自己的东西，软件项目不在也照样能生成。验收：把 `configNexus-1` 文件夹临时改个名，在官网项目里跑一条生成命令，照样成功、文档页照样显示全部教程和那张演示图。
2. **留个一键更新按钮**（其实是个命令脚本）：平时官网独立跑；哪天软件那边教程更新了，跑一下 `node sync-from-app.mjs`，就把软件那边最新的内容拉过来覆盖，并自动重新生成、自动检查。验收：软件存在时跑这条命令，官网内容更新且只动了该动的文件夹。
3. **把"创意工坊组件开发文档"打包成一个 Skill**：那是软件里教第三方开发者怎么做插件组件的 13 篇规范。做成 Skill（一种"AI 技能包"——AI 加载后就照着这套规范帮人写组件代码）。验收：装好后开一个新的 AI 对话，说"我要开发一个 ConfigNexus 创意工坊组件"，AI 能自动认出并按这 13 篇规范来做。

不用担心动到你现有的东西：官网现有页面、样式、四语切换都不碰；教程内容是"搬过来一份"，不改字；那 13 篇开发文档是给 AI 用的技能包，不会出现在官网页面上（你选的纯 Skill 形态）。

---

## 目标（可验证的验收标准）

1. **构建彻底独立**：`build-docs.mjs` 内不再出现任何 `E:/configNexus-1` 或机器专属绝对路径（仓库根用 `import.meta.url` 推导，连 `E:/configNexus-site` 这种写死也去掉）。验收：把 `E:\configNexus-1` 临时改名后，在站点目录跑 `node build-docs.mjs` 仍成功；生成的 `docs-data.js` 含四语数据，篇数打印为 **zh=34 / en=20 / ja=20 / ko=20**（build 跳过 CHANGELOG.md，故非 21）。
2. **构建校验先于产物、可阻断**：把现状"先写 docs-data.js、再 WARN、退出码恒 0"改为"先做一致性 + 媒体引用校验 → 失败非零退出且不写产物 → 通过才写 docs-data.js 并拷生成物"。验收：故意把 manifest 指向一个不存在的 md，跑 build 时**非零退出**且 `docs-data.js` 未被改写。
3. **文档页零退化**：`docs.html` 仍渲染全部 34 篇中文教程，gif/图片/视频/模板按钮均正常。验收：浏览器打开 docs.html，侧栏分类与篇目齐全，能看到 `Res-zh` 里的演示 gif 和图片。
4. **一键同步可用且安全**：`node sync-from-app.mjs` 在 configNexus-1 存在时，把 md / 媒体 / 13 篇组件文档拉过来覆盖，随后自动跑 build + 全量校验。验收：跑完后 `git diff --name-only HEAD` 只出现 `content/md/`、`docs/Res-*/`、`skills/confignexus-component-dev/references/`、生成物这几类预期路径；目标有未提交改动时默认拒绝、提示需 `--force`。
5. **Skill 可被发现并触发**：`skills/confignexus-component-dev/SKILL.md` frontmatter 合法（name/description 带触发条件），`references/` 含全部 13 篇且互链有效。验收：跑安装脚本把 skill 复制到 `~/.claude/skills/`（或 App 的 `.claude/skills/`）后，新开会话说"开发一个 ConfigNexus 创意工坊组件"，该 skill 被列出/触发并按需读取 references。

---

## 非目标（本次不做）

- 不重构 `docs.js` 渲染逻辑、不动 `i18n.js`、不动营销页（index/features/download）。
- 不把 13 篇组件开发文档渲染上官网（大哥选了纯 Skill 形态）。
- 不新翻译任何内容、不补 en/ja/ko 媒体；不强行补那处已存在的缺图（见"边界情况"，记入 dev/issues.md）。
- 不搭 MCP server；单个 skill 不升级成 Claude 插件。
- 不用软链分发 skill（Windows 权限/跨盘/隐藏依赖），统一走复制式安装。

---

## 实施步骤

1. **vendor md 进站点**：把 `configNexus-1/src/renderer/welcome/md/{zh,en,ja,ko}` 复制到站点 `content/md/{zh,en,ja,ko}/`（保留中文子目录与文件名），`git add` 提交。
   - 定位：`content/md` 是 App 上游的**可编辑快照**（非"真源"——内容上游是 App，结构真源是 `docs-manifest.js`）。
   - 验证：`content/md/zh` 下能数到 34 篇（不含 CHANGELOG）；en/ja/ko 各 20 篇。
2. **改 `build-docs.mjs` 去依赖**：
   - 用 `import.meta.url` 推导仓库根，替换写死的 `SW`/`SITE` 两个绝对路径。
   - md 读取改为 `<root>/content/md`。
   - **删掉**从 configNexus-1 拷 `Res/*` 的 step 2（媒体已是仓库内提交物，构建不再外拷）。
   - 验证：源码内 grep 不到 `configNexus-1` 与 `E:/`；把 App 改名后 build 仍通过。
3. **构建加校验、调顺序**：
   - 新增「媒体引用存在性校验」：扫四语 md 里的 `![]()` 图片与 `video:` 引用，改写 `Res/(lang)/`→`docs/Res-$1/` 后断言文件存在，缺失计入错误。
   - 调整流程为：先跑 manifest 一致性校验 + 媒体校验 → 有错则 `process.exit(1)` 且**不写** docs-data.js → 全通过再写产物。
   - 验证：制造一处坏引用 → 非零退出且产物未变；修好后退出 0、产物更新。
4. **建一键同步脚本 `sync-from-app.mjs`**（本仓库唯一**可执行**引用 App 路径之处；路径用 `--app-root` 参数 / 环境变量 / 同级目录回退，不写死）：
   - 先校验三个上游源都存在（welcome/md、welcome/Res、app/docs/组件开发方案），缺任一则非零退出不写入。
   - 镜像同步到 `content/md`、`docs/Res-*`、`skills/.../references`（明确语义：镜像式，清理上游已删除的旧文件，避免残留）。
   - 覆盖前检查目标是否有未提交改动，默认拒绝并提示 `--force`。
   - 复制完成后自动 `node build-docs.mjs` 跑校验。
   - 输出操作日志（CLI 形态）：`开始 / 成功(文件数) / 失败(原因)`，失败返回非零码。
   - 验证：App 在场时跑通；故意删一个上游目录 → 非零退出、未写入。
5. **打包 Skill `skills/confignexus-component-dev/`**：
   - `references/00..12_*.md`：13 篇复制进来；**清洗 6 处失效的 `../../*_app/` 相对链接**（指向 App 内示例 app，skill 里不存在），保留 13 篇之间有效的 `./0X_*.md` 互链。
   - `SKILL.md`：frontmatter（name=confignexus-component-dev；description 写明触发场景"开发/制作 ConfigNexus 创意工坊组件/插件时"）；正文给出**独立列全 13 篇**的索引（不照抄上游 00 总览——它实际漏列了 09/10/11）+ 阅读顺序指引。
   - 内容一致性对齐：`02_技术栈规范`(Vite ^5.x) 与 `03_依赖管理规范`(^6.0.3) 版本号取一处为准统一（以 App 现用为准，查 package.json 后定）。
   - 验证：frontmatter 解析合法；references 13 篇齐全；grep 不到 `../../` 失效链接。
6. **写安装脚本 + README 说明**：`skills/install.mjs`（或 README 段落）把 skill 文件夹复制到 `~/.claude/skills/` 或 App 的 `.claude/skills/`。
   - 验证：跑安装后新开 Claude 会话能发现该 skill；用一句组件开发请求触发它。
7. **记一致性 issue**：把"en/ja/ko Python脚本编辑器引用 `Res/zh/videos/py脚本生成.webm` 但 site/App 上游均无"这条已存在缺图，追加到 `dev/issues.md`（本任务不修）。

---

## 边界情况

- **CHANGELOG.md**：build 显式跳过，篇数应是 34/20/20/20，不是 35/21。验收脚本断言这组数。
- **空目录不进 git**：`docs/Res-en/ja/ko` 当前未被 git 跟踪；由于四语 md 的媒体引用**全指向 `Res/zh`**，这些占位目录即使缺失也不会缺图。本任务不强制提交占位 README（除非同步脚本需要它们存在，则同步时自动建）。
- **已存在缺图**：en/ja/ko 的 Python 脚本编辑器引用了一个 site 与 App 上游都不存在的视频。新增的媒体校验会把它报出来——为不阻塞本任务，校验对"已知缺失白名单"降级为 WARN，并把该条记入 `dev/issues.md` 另行处理。
- **同步覆盖冲突**：若站点内 `content/md` 等被本地手改过又跑 sync，默认拒绝覆盖（保护本地编辑），需 `--force`。
- **App 不在场**：build 必须能跑（独立）；只有 sync 需要 App 在场，缺失时友好非零退出。
- **跨盘/Windows 权限**：skill 安装用复制而非软链，规避跨盘软链与权限问题。

---

## 风险与注意

- **双快照漂移**：`content/md` 与 App 上游可能逐渐不一致。缓解：单向同步（App→site），并在同步产物里记录同步日期/上游提交号；文档写清"不要反向手改 content/md 当真源"。
- **13 篇文档时效**：草案误判为"v2.0/2024-12 快照"，实际多篇 2026-05/06 更新过；打包时以实际文件为准，SKILL.md 标注同步时间而非写死版本号。
- **媒体校验的边界**：首次引入校验可能把历史遗留缺图全报出来——用已知白名单降级，避免一上来就红一片阻塞交付。
- **Skill 发现性**：site 仓库的 `skills/` 不会被 Claude 自动加载，必须经安装脚本落到 skills 扫描目录——这是 Skill 形态固有代价，已用安装脚本兜住。
- **操作日志判定**：build/docs/skill 属豁免（纯构建工具，console 输出即可）；但 `sync-from-app.mjs` 是会改文件的 CLI，须有起止/文件数/失败非零码（已列入步骤 4）。

---

## 多模型 Plan 会审

> [Codex 评审] "不应称 content/md 为独立真源——它是 App 上游的可编辑快照；build-docs.mjs 还硬编码了 E:/configNexus-site 应用 import.meta.url 推导；现校验只 WARN 且先写后校、退出码恒 0，应先校验失败非零退出再写产物；sync 需先验上游存在、镜像语义明确、默认拒覆盖本地改动、复制后自动 build；总览 00 实际漏列 09/10/11；02 与 03 的 Vite 版本号自相矛盾；篇数实为 34/20/20/20。"
> [Codex 综合主笔] 采纳全部评审：去掉一切机器专属硬编码、校验前置可阻断、sync 做安全镜像+自动 build、skill 索引独立列全 13 篇并清洗失效链接、补媒体校验与已知缺图 issue 化；放弃了"content/md 是真源"的措辞与"软链分发"，因前者会诱发反向误改、后者在 Windows/跨盘不稳。（注：因只读沙箱无法直接落盘，最终文本由 Claude 转写，内容为 Codex 综合结论。）
> [Claude 白话化兜底] 重写了大哥摘要为 3 件事的白话版（剪脐带/一键更新/打包技能包，术语都加了括号解释）；核对项目记忆（auto/manual 均空，无冲突偏好）；确认未违反"小功能直接改"等长期偏好——本任务确属默认档大改，走全流程合理。
