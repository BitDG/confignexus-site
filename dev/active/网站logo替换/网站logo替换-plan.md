# 网站 logo 替换 · plan

## 大哥摘要
现在网站左上角的"标志"是用代码画的一个小方块（不是真 logo）。这次把它换成你给的真 logo 图片（那个黑色 C + 蓝色 N 的「CN」图标）。换完后：网站每个页面左上角的方块会变成 CN 图标，浏览器标签页（tab）上也会出现这个图标，首页开场小动画里也会显示它。不会动到任何文字、内容或数据，纯换图，做错了也能一键还原。

## 目标
把网站里所有"logo 展示位"统一换成 `assets/logo.png`（来源 `E:\configNexus-1\Data\icon\config\Logo.png`）。
验收标准（浏览器可观察）：
1. 打开 index/features/download/docs 四个页面，左上角导航处显示 CN 图标，不再是 2×2 小方块。
2. 浏览器标签页图标（favicon）显示 CN 图标。
3. 打开首页开场动画，品牌区出现 CN 图标。

## 非目标
- 不改 logo 旁的「ConfigNexus」文字与其样式。
- 不重新设计导航/页头布局。
- 不处理 docs/ 下的 markdown 内文图片。

## 实施步骤
1. 复制 Logo.png 到 `assets/logo.png`（已完成）。verify: 文件存在。
2. 四个 html 把导航 `.mark` 方块换成 `<img>`，并在 `<head>` 加 favicon。verify: 浏览器看到图标。
3. site.css 把 `.brand .mark` 系列样式换成 `.brand-logo` 尺寸，删掉因此失效的 hover 方块样式。verify: 图标尺寸正常、无报错。
4. intro.js 开场品牌区前加 logo 图片，site.css 加 `.intro-logo` 样式。verify: 开场动画显示图标。

## 边界情况
- logo 近似正方形，按高度固定、宽度自适应缩放，避免拉伸。

## 风险与注意
- 删除 `.brand .mark` 后，旧的 `.brand:hover .mark i` 等 hover 规则成为孤儿，需一并删除，否则留死样式。

## 多模型 Plan 会审
跳过：小档（纯视觉换图、≤6 文件、易回滚），按工作流不调外部模型。
