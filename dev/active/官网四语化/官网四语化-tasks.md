# 官网四语化 · 任务清单

- [x] 1. 建 docs-manifest.js（稳定 ID 有序 manifest + 分类标题映射） → verify: 浏览器 console 打印 `window.DOC_MANIFEST.length===34` 且 `window.DOC_CATS` 含 7 分类四语标题
- [x] 2. 重写 build-docs.mjs 扫四语 + 复制 Res + manifest 校验，并跑出 docs-data.js → verify: `node build-docs.mjs` 退出 0，打印四语篇数(zh34/en20/ja20/ko20)，docs-data.js 含 `DOCS.zh/en/ja/ko`，无 manifest 失配 warn
- [x] 3. 建 i18n.js（head 语言检测 + DOM ready 注入切换器 + 营销字典 applyMarketingI18n + 字体注入 + reload 切换） → verify: 四页右上角出现切换器；切换后 reload，`document.documentElement.lang` 与文案随之变；清 localStorage + 改浏览器语言无痕开命中对应语言
- [x] 4. 营销页打标：index/features/download 加 data-i18n + head 引入 i18n.js；features 深链改稳定 ID → verify: 三页逐语言切换无残留中文(除品牌名)；英文模式点功能卡片正确定位到对应文档篇目
- [x] 5. 改造 docs.js：读 manifest 按语言渲染侧栏/正文 + 缺翻译提示条 + 媒体按语言改写 + hash 安全解码与中文别名兼容；docs.html 引入 i18n.js+manifest → verify: 英文模式已译篇目显英文正文、未译篇目顶部出现提示条+中文正文且容器 lang=zh-CN；旧中文深链能打开；非法 hash 不白屏
- [x] 6. site.css 加 .i18n-pending / 切换器 / .doc-fallback-note 样式 → verify: 非中文首屏不闪中文；切换器与提示条样式与站点风格一致
- [x] 7. intro.js 文案四语化(MUSINGS/REVEAL 按 window.CN_LANG) → verify: 代码层确认按语言取数组(动画当前未启用，无浏览器验收)
- [x] 8. 全量校验 + 越界检查 → verify: 5 个 JS 文件 node --check 通过；133 条字典 key 四语齐整、HTML 用到的 key 全有、25 条深链全命中 manifest；运行时解析规则(已译不回退/未译回退中文/旧中文hash别名/非法hash回退首篇/ja-ko命中本语言)用真实数据复跑全过；四语媒体均指向 Res-zh(42文件齐全)不裂图；git diff 全在白名单内。浏览器逐项点击验收因本会话未注入 browser-use MCP 未自动跑（已起本地服务器供大哥肉眼验收）
