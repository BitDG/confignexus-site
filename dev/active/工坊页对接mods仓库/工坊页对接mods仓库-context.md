# 工坊页对接 mods 仓库 · context（AI 自用）

## 关键文件（本次边界）
- `scripts/gen-workshop-data.mjs` — 生成器。改 REPO_URL、默认源、加 plugins 扫描。
- `workshop-components.js` — 生成产物（committed）。由生成器重写，勿手改。含 WORKSHOP_REPO/WORKSHOP_COMPONENTS/（新）WORKSHOP_PLUGINS。
- `workshop.js` — 渲染逻辑。render()(组件) + 新增 renderPlugins() + syncRepoLinks()。ICONS 是 lucide→emoji 映射（仅组件用）；插件 icon 已是 emoji 字符串，直接用。
- `workshop.html` — 页面结构。#ws-cards（组件）+ 新增 #ws-plugins 区；顶部 #ws-github 按钮 + 底部无 id 按钮（行 ~62）两处硬编码 href。
- `i18n.js` — 4 语 ws.* 文案，zh ~46-52 / en ~129-135 / ja ~208-214 / ko ~287-293。

## 数据源事实
- 本地 `E:/configNexus-mods/{components,plugins}` 与 GitHub 一致。
- 组件用 metadata.json（有四语 displayNames + lucide icon）；`_`前缀目录跳过 → 16 个。
- 插件用 manifest.json（id/name(中文)/description(中文)/cnxCategory.form；ai-runtime 类有 runtime.icon emoji）；`_shared` 跳过 → 8 个。
- 插件 form→兜底 emoji：tool🔧 / ai-runtime🤖(优先 runtime.icon) / theme🎨 / menu🧩。

## 决策记录
- 插件不补 4 语翻译：manifest 无 displayNames，造翻译= 凭空数据+维护漂移，过度设计。直接用 manifest 中文名跨语言展示，desc 仅 zh。资深工程师视角：不为「8 个插件的 ja/ko 名」这种没要求的事写 override map。
- 复用 .cards/.card，不写新 CSS（插件卡与组件卡同构）。
- 生成器一次生成两个数组写进同一个 workshop-components.js（不另开文件，减少 html script 引用改动）。
- 底部 GitHub 按钮直接改硬编码 href（不强行加 id 走 JS 同步），顶部仍由 syncRepoLinks 从 WORKSHOP_REPO 兜。

## 依赖与约束
- 站点构建期不读组件源（前序「文档独立化」约定）→ 必须把数据固化进 workshop-components.js。
- 纯静态站点，无构建链，改完直接浏览器打开 workshop.html 验证。
