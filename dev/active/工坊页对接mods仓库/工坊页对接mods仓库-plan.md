# 工坊页对接 mods 仓库 · plan

## 大哥摘要
官网「创意工坊」页（workshop.html）以前那 15 张卡片链接的 GitHub 仓库已经被删了，现在点进去全是打不开（404）。这次把页面接到新仓库 `confignexus-mods`：①新仓库已设为公开；②页面上半部分仍是示例组件，但补齐成 16 个（多了「竞技场幸存者」）；③下半部分新增一块「插件 Mod」，把 8 个真插件（Git/SVN/Ollama/LM Studio/远程接口/找出值/桌宠黑猫·小狗）也摆出来。所有卡片点进去都能到新仓库对应的文件夹。验收就是：打开 workshop.html，能看到组件区 16 张卡 + 新的插件区 8 张卡，随便点几张都能跳到 github.com/digua12331/confignexus-mods 的对应目录、不再 404。

不动你任何现有数据，纯改官网静态页面，随时能回退。

## 目标
- confignexus-mods 仓库设为 public（已完成，`gh repo view` 显示 visibility=PUBLIC）。
- 工坊页所有指向旧仓库 `confignexus-workshop` 的链接全部改为 `confignexus-mods`（旧仓库已不存在 → 现状全 404）。
- 组件区从 15 → 16（补 arena-survivors，源自仓库 components/ 实际内容）。
- 新增「插件 Mod」区，渲染仓库 plugins/ 下的 8 个插件，卡片链到 `…/tree/main/plugins/<id>`。
- 验收标准（浏览器可观察）：
  1. 本地打开 workshop.html，组件区出现 16 张卡、插件区出现 8 张卡。
  2. 任取一张组件卡 + 一张插件卡，href 指向 `https://github.com/digua12331/confignexus-mods/tree/main/...` 且真实可打开（不 404）。
  3. 顶部/底部「在 GitHub 上查看」按钮指向 confignexus-mods 主页。
  4. 切到 EN/JA/KO，组件区标题数量与插件区标题正确显示、不崩。

## 非目标
- 不给 8 个插件补 4 语翻译（manifest 只有中文名，按原名展示；要翻译另起任务）。
- 不改组件/插件源码、不动 mods 仓库内容。
- 不重做工坊页视觉样式（复用现有 .cards/.card）。

## 实施步骤
1. 改 `scripts/gen-workshop-data.mjs`：REPO_URL→mods、默认源目录→configNexus-mods、新增扫描 plugins/ 产出 WORKSHOP_PLUGINS。验证：脚本能跑通无报错。
2. 跑生成器 `--src=E:/configNexus-mods/components` 重写 `workshop-components.js`。验证：文件含 16 组件 + 8 插件、URL 全为 mods。
3. 改 `workshop.js`：新增 renderPlugins()、底部按钮同步。验证：本地页面插件区出卡。
4. 改 `workshop.html`：加插件区 section、更新两个硬编码 GitHub 按钮 href。验证：DOM 结构正确。
5. 改 `i18n.js`：4 语补 ws.pluginsTag/ws.pluginsH、组件计数 15→16、ws.desc。验证：切语言无缺键。

## 边界情况
- WORKSHOP_PLUGINS 为空时插件区整段隐藏（不留空标题）。
- 插件 manifest 无 runtime.icon 时按 form 给兜底 emoji。
- esc 转义防 XSS（沿用现有 esc）。

## 风险与注意
- 旧仓库 confignexus-workshop 已删除 → 这是修复 404，不是可选优化。
- 插件名仅中文：非中文界面显示中文原名（manifest 真名），属已知取舍，见非目标。
- 大哥已在方向选择框拍板「组件+插件都显示」，方向锁定，不再二次确认。
