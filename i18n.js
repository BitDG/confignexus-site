/* ConfigNexus 官网 · 客户端四语（中/英/日/韩）。
   - head 内引入：先做语言检测（设 window.CN_LANG、<html lang>、CJK 字体、非中文先隐藏防闪）。
   - DOM 就绪后：注入右上角语言切换器 + 用字典翻译营销页文案。
   - 切换语言：写 localStorage 后 location.reload()（首版用刷新，状态最少最稳）。
   - 中文是默认/兜底语言：HTML 里本就是中文，禁用 JS 也能看完整中文站；字典以中文为单一真源。
*/
(function () {
  'use strict';
  var LANGS = ['zh', 'en', 'ja', 'ko'];
  var KEY = 'cn_lang';

  function detect() {
    try { var s = localStorage.getItem(KEY); if (LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    var cands = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < cands.length; i++) {
      var p = String(cands[i] || '').toLowerCase().split('-')[0];
      if (p === 'zh') return 'zh';
      if (p === 'en') return 'en';
      if (p === 'ja') return 'ja';
      if (p === 'ko') return 'ko';
    }
    return 'zh';
  }

  var lang = detect();
  window.CN_LANG = lang;
  try { document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang); } catch (e) {}
  // 非中文：先隐藏可翻译区，等翻译完成再显示，避免中文一闪
  if (lang !== 'zh') { try { document.documentElement.classList.add('i18n-pending'); } catch (e) {} }
  // 日/韩字体（中/英用默认 Manrope + Noto Sans SC）
  if (lang === 'ja' || lang === 'ko') {
    try {
      var fam = lang === 'ja' ? 'Noto+Sans+JP' : 'Noto+Sans+KR';
      var lk = document.createElement('link'); lk.rel = 'stylesheet';
      lk.href = 'https://fonts.googleapis.com/css2?family=' + fam + ':wght@300;400;500;700&display=swap';
      document.head.appendChild(lk);
    } catch (e) {}
  }

  // ---------- 营销页字典（key -> 各语言文本；含 < 的值按 HTML 注入） ----------
  var DICT = {
    zh: {
      'nav.features': '功能', 'nav.workshop': '创意工坊', 'nav.download': '下载', 'nav.docs': '文档',
      'cta.download': '↓ 免费下载', 'cta.steam': '在 Steam 上查看',
      // 创意工坊页
      'ws.title': '创意工坊 · ConfigNexus',
      'ws.desc': 'ConfigNexus 创意工坊：16 个开源示例组件 + 8 个开源插件 Mod + 组件/插件开发文档 + AI 技能包，源码托管在 GitHub，照着就能给配置大师做组件和插件。',
      'ws.headTag': '创意工坊 · 开源组件', 'ws.headH': '现成的组件，<br>照着就能做你自己的',
      'ws.headP': '下面是 ConfigNexus 创意工坊的开源示例组件。全部源码 + 组件/插件开发文档 + AI 技能包都托管在 GitHub，克隆下来就能跑、能改、能当模板。',
      'ws.ghBtn': '↗ 在 GitHub 上查看', 'ws.docsBtn': '查看开发文档',
      'ws.gridTag': '组件清单', 'ws.gridH': '16 个开源示例组件', 'ws.empty': '组件清单加载中…',
      'ws.pluginsTag': '插件清单', 'ws.pluginsH': '8 个开源插件 Mod',
      'ws.endH': '想做自己的组件？', 'ws.endP': '克隆仓库，装上 AI 技能包，从模板起步。',
      // 首页
      'idx.title': 'ConfigNexus · 像电子表格一样掌控每一张配置表',
      'idx.desc': 'ConfigNexus —— 桌面端配置管理工具。表格化编辑、Excel 双向导入导出、本地 AI 助手、多格式导出（JSON / CSV / YAML / C# / Protobuf …）。',
      'idx.eyebrow': '专属于游戏开发者的游戏数据配置平台',
      'idx.heroH': '超越 <span class="hl">Excel、WPS</span><br>的编辑体验',
      'idx.sub': '表格化编辑游戏配置，Excel 全格式双向导入导出，CT 列类型、数据验证 DSL、<br>Python 函数集成、本地 AI 助手，一份数据导出成 8 种主流格式。',
      'idx.shotTab': 'ConfigNexus — 角色配置表.cnx',
      'idx.shotPh': '<b>软件界面截图占位</b><br>正式上线前换成真实截图',
      'idx.previewFile': '角色配置表.cnx',
      'idx.previewPath': '本地工程 / gameplay / character',
      'idx.previewTab1': '角色表', 'idx.previewTab2': '技能表', 'idx.previewTab3': '掉落表',
      'idx.previewPanel': '数据验证',
      'idx.previewIssue': '配置表填错，一行内定位',
      'idx.previewDesc': '规则、引用、类型同时检查，问题直接回到单元格。',
      'idx.previewExport': '一键导出',
      'idx.formatsLbl': '一份数据 · 多种导出格式',
      'idx.coreTag': '核心能力', 'idx.coreH': '为配置工作而生',
      'idx.c1t': '专业表格编辑', 'idx.c1d': 'xlsx/xls/json/csv 全格式导入，Luckysheet 内核手感，多页签预渲染秒切。',
      'idx.c2t': 'CT 列类型系统', 'idx.c2d': 'JSON 编辑器、富文本、多数据结构、日期、资源加载器，列即类型。',
      'idx.c3t': '数据验证 DSL', 'idx.c3d': '8 条规则 + && 组合，表头一行写完；跨表引用外键完整性校验。',
      'idx.c4t': '多样化导出', 'idx.c4d': 'JSON / YAML / CSV / Protobuf / C# 类 / Bytes / MessagePack 8 种格式。',
      'idx.c5t': 'Python 深度集成', 'idx.c5d': '单元格里调 Python 函数，SmartCache + 批量执行，沙箱脚本编辑器。',
      'idx.c6t': '扩展生态 · 创意工坊', 'idx.c6d': '外部引用源、引用关系图、Git/SVN、Steam 创意工坊订阅与上传。',
      'idx.endH': '把配置表交给 ConfigNexus', 'idx.endP': '免费下载，立即开始管理你的配置数据。',
      // 功能页
      'feat.title': '功能 · ConfigNexus',
      'feat.desc': 'ConfigNexus 的核心能力：AI 助手、专业表格编辑、CT 列类型、数据验证 DSL、多格式导出、Python 集成、实用工具箱、扩展生态。',
      'feat.headTag': '核心能力', 'feat.headH': '为游戏配置工作<br>而生的全套能力',
      'feat.headP': '从导入、编辑、验证到导出，覆盖配置管理的完整链路。点任意卡片可跳到对应教程。',
      'feat.s1tag': 'AI 智能助手', 'feat.s1h': '本地大模型，数据不出本机',
      'feat.s1c1t': '本地 AI 接入', 'feat.s1c1d': '接入 Ollama / LM Studio / 远程接口，按平台插件化扩展，宿主零改动。',
      'feat.s1c2t': '隐私优先', 'feat.s1c2d': 'AI 全程在本机运行，敏感配置数据不上传到任何外部服务。',
      'feat.s1c3t': '辅助填表与翻译', 'feat.s1c3d': 'AI 辅助批量填写、多语言翻译、内容生成，重复劳动交给它。',
      'feat.s2tag': '专业表格编辑', 'feat.s2h': '像 Excel 一样顺手，比 Excel 更懂配置',
      'feat.s2c1t': 'Excel 兼容', 'feat.s2c1d': 'xlsx/xlsm/xls/json/csv 全格式导入，Luckysheet 内核手感。',
      'feat.s2c2t': 'cnx 工程文件', 'feat.s2c2d': '保留 CT 列类型 / 引用 / Python 公式的原生工程格式。',
      'feat.s2c3t': '多页签管理', 'feat.s2c3d': '同时开多张表互不影响，预渲染秒切。',
      'feat.s3tag': 'CT 列类型系统', 'feat.s3h': '列即类型，结构化数据轻松编辑',
      'feat.s3c1t': 'JSON 编辑器', 'feat.s3c1d': 'Monaco 代码 + 树状双向同步。',
      'feat.s3c2t': '富文本编辑', 'feat.s3c2d': '类 Notion 所见即所得。',
      'feat.s3c3t': '多数据结构', 'feat.s3c3d': '对象数组 schema 驱动编辑。',
      'feat.s3c4t': '日期编辑', 'feat.s3c4d': '内置日期选择器，时区处理。',
      'feat.s3c5t': '资源加载器', 'feat.s3c5d': '图片 / 音频路径选择 + 缩略图。',
      'feat.s4tag': '数据验证 DSL', 'feat.s4h': '把配置错误挡在上线之前',
      'feat.s4c1t': '验证规则 DSL', 'feat.s4c1d': '8 条规则 + && 组合，表头一行写完。',
      'feat.s4c2t': '跨表引用校验', 'feat.s4c2d': 'ref / enum_ref 跨表外键完整性。',
      'feat.s5tag': '多样化导出', 'feat.s5h': '一份数据，喂给所有引擎',
      'feat.s5c1t': '8 种格式', 'feat.s5c1d': 'JSON / YAML / CSV / Protobuf / C# 类 / Bytes / MessagePack。Unity / Unreal / Godot / 自研引擎都能直接吃。',
      'feat.s6tag': 'Python 集成', 'feat.s6h': '把脚本能力嵌进表格',
      'feat.s6c1t': 'Python 公式', 'feat.s6c1d': '单元格里调 Python 函数 + SmartCache + 批量执行。',
      'feat.s6c2t': '脚本编辑器', 'feat.s6c2d': 'CodeMirror + 沙箱执行 + pandas / numpy。',
      'feat.s6c3t': '持久化脚本库', 'feat.s6c3d': '跨项目复用，工坊可分享。',
      'feat.s7tag': '实用工具箱', 'feat.s7h': '专为游戏配置打磨的效率工具',
      'feat.s7c1t': '多语言整合', 'feat.s7c1d': '中 / 英 / 日 / 韩四语，重复文本去重。',
      'feat.s7c2t': '字符提取', 'feat.s7c2d': '扫项目所有文本，生成字符白名单。',
      'feat.s7c3t': '字体子集化', 'feat.s7c3d': '字体压到 5% 以下，包体瘦身利器。',
      'feat.s7c4t': '批量修改', 'feat.s7c4d': '查找替换 / 数组 / 对象数组可视化批量。',
      'feat.s7c5t': '自动保存', 'feat.s7c5d': '断电 / 闪退 / 误关都不丢工。',
      'feat.s8tag': '扩展生态 · Steam 创意工坊', 'feat.s8h': '能力随需求生长',
      'feat.s8c1t': '文件浏览器', 'feat.s8c1d': '独立窗口树 + 角标 + 引用入口。',
      'feat.s8c2t': '外部引用源', 'feat.s8c2d': '跨项目挂表，跨表查值。',
      'feat.s8c3t': '引用关系图', 'feat.s8c3d': '可视化「谁引用谁」。',
      'feat.s8c4t': '创意工坊', 'feat.s8c4d': '订阅 / 上传组件，社区共建。',
      'feat.s8c5t': 'Git / SVN', 'feat.s8c5d': '内置源代码面板，commit / pull / branch。',
      'feat.s8c6t': '数据表对比', 'feat.s8c6d': '逐单元格 diff，字符级高亮（DLC）。',
      'feat.endH': '准备好试试了吗？', 'feat.endP': '免费下载 ConfigNexus，开始管理你的游戏配置。',
      // 下载页
      'dl.title': '下载 · ConfigNexus', 'dl.desc': '下载 ConfigNexus 桌面端配置管理工具（Windows）。',
      'dl.headTag': '下载', 'dl.headH': '获取 ConfigNexus', 'dl.headP': '桌面端配置管理工具，当前提供 Windows 版本。',
      'dl.ver': '最新版本 · v1.0.0', 'dl.btnTrial': '↓ 下载试用版（itch.io）', 'dl.btnSteam': '在 Steam 上获取',
      'dl.note': '试用版托管在 itch.io，点上面按钮可直接下载体验；完整版在 Steam 上获取。',
      'dl.k1': '系统', 'dl.v1': 'Windows 10 / 11', 'dl.k2': '架构', 'dl.v2': '64 位', 'dl.k3': '安装方式', 'dl.v3': 'NSIS 安装程序',
      'dl.s1h': '下载安装包', 'dl.s1p': '点上方按钮下载试用版（itch.io），或前往 Steam 获取完整版。',
      'dl.s2h': '运行安装', 'dl.s2p': '双击安装程序，按提示完成安装。若系统提示来源未知，选择仍要运行即可。',
      'dl.s3h': '开始使用', 'dl.s3p': '打开 ConfigNexus，导入 Excel 或新建配置表，参考文档快速上手。',
      'dl.endH': '不知道从哪开始？', 'dl.endP': '查看快速上手文档，几分钟跑通第一张配置表。', 'dl.endBtn': '查看文档 →',
      // 文档页 chrome
      'docs.title': '文档 · ConfigNexus', 'docs.desc': 'ConfigNexus 使用文档：表格编辑、CT 列类型、数据验证、数据导出、Python 集成、实用工具箱、扩展生态。'
    },
    en: {
      'nav.features': 'Features', 'nav.workshop': 'Workshop', 'nav.download': 'Download', 'nav.docs': 'Docs',
      'cta.download': '↓ Free download', 'cta.steam': 'View on Steam',
      // Workshop page
      'ws.title': 'Workshop · ConfigNexus',
      'ws.desc': 'ConfigNexus Workshop: 16 open-source example components + 8 open-source plugin mods + component/plugin dev docs + AI skill packs, all hosted on GitHub.',
      'ws.headTag': 'Workshop · Open Source', 'ws.headH': 'Ready-made components,<br>a head start on your own',
      'ws.headP': 'Below are the open-source example components from the ConfigNexus Workshop. All source code, component/plugin dev docs and AI skill packs live on GitHub — clone it to run, tweak, and use as templates.',
      'ws.ghBtn': '↗ View on GitHub', 'ws.docsBtn': 'View dev docs',
      'ws.gridTag': 'Component list', 'ws.gridH': '16 open-source example components', 'ws.empty': 'Loading components…',
      'ws.pluginsTag': 'Plugin list', 'ws.pluginsH': '8 open-source plugin mods',
      'ws.endH': 'Want to build your own?', 'ws.endP': 'Clone the repo, install the AI skill packs, start from a template.',
      'idx.title': 'ConfigNexus · Master every config sheet like a spreadsheet',
      'idx.desc': 'ConfigNexus — a desktop configuration management tool. Spreadsheet-style editing, two-way Excel import/export, a local AI assistant, and multi-format export (JSON / CSV / YAML / C# / Protobuf …).',
      'idx.eyebrow': 'A game-data configuration platform built for game developers',
      'idx.heroH': 'An editing experience<br>beyond <span class="hl">Excel &amp; WPS</span>',
      'idx.sub': 'Edit game configs in a spreadsheet, two-way import/export across all Excel formats, CT column types, a data-validation DSL,<br>Python function integration and a local AI assistant — export one dataset to 8 mainstream formats.',
      'idx.shotTab': 'ConfigNexus — character-config.cnx',
      'idx.shotPh': '<b>App screenshot placeholder</b><br>Will be replaced with a real screenshot before launch',
      'idx.previewFile': 'character-config.cnx',
      'idx.previewPath': 'Local project / gameplay / character',
      'idx.previewTab1': 'Characters', 'idx.previewTab2': 'Skills', 'idx.previewTab3': 'Drops',
      'idx.previewPanel': 'Validation',
      'idx.previewIssue': 'Wrong config, located in one row',
      'idx.previewDesc': 'Rules, references and types are checked together, then traced back to the exact cell.',
      'idx.previewExport': 'One-click export',
      'idx.formatsLbl': 'One dataset · many export formats',
      'idx.coreTag': 'Core capabilities', 'idx.coreH': 'Built for configuration work',
      'idx.c1t': 'Professional table editing', 'idx.c1d': 'Import xlsx/xls/json/csv with a Luckysheet-grade feel; pre-rendered tabs switch instantly.',
      'idx.c2t': 'CT column type system', 'idx.c2d': 'JSON editor, rich text, multi-data structures, dates, resource loader — the column is the type.',
      'idx.c3t': 'Data-validation DSL', 'idx.c3d': '8 rules plus && composition, written in one header row; cross-sheet foreign-key integrity checks.',
      'idx.c4t': 'Versatile export', 'idx.c4d': '8 formats: JSON / YAML / CSV / Protobuf / C# classes / Bytes / MessagePack.',
      'idx.c5t': 'Deep Python integration', 'idx.c5d': 'Call Python functions from cells, SmartCache plus batch execution, a sandboxed script editor.',
      'idx.c6t': 'Extensions · Steam Workshop', 'idx.c6d': 'External reference sources, a reference graph, Git/SVN, plus Steam Workshop subscribe & upload.',
      'idx.endH': 'Hand your config sheets to ConfigNexus', 'idx.endP': 'Download for free and start managing your configuration data right away.',
      'feat.title': 'Features · ConfigNexus',
      'feat.desc': 'ConfigNexus core capabilities: AI assistant, professional table editing, CT column types, a data-validation DSL, multi-format export, Python integration, a utility toolbox and an extension ecosystem.',
      'feat.headTag': 'Core capabilities', 'feat.headH': 'A complete toolkit built<br>for game-config work',
      'feat.headP': 'From import and editing to validation and export — covering the full configuration-management pipeline. Click any card to jump to its tutorial.',
      'feat.s1tag': 'AI assistant', 'feat.s1h': 'Local LLMs — your data never leaves the machine',
      'feat.s1c1t': 'Local AI integration', 'feat.s1c1d': 'Connect Ollama / LM Studio / remote APIs, extend per platform via plugins, zero host changes.',
      'feat.s1c2t': 'Privacy first', 'feat.s1c2d': 'The AI runs entirely on your machine; sensitive config data is never uploaded to any external service.',
      'feat.s1c3t': 'Assisted filling & translation', 'feat.s1c3d': 'AI assists with bulk filling, multilingual translation and content generation — hand it the repetitive work.',
      'feat.s2tag': 'Professional table editing', 'feat.s2h': 'As smooth as Excel, but it understands configs',
      'feat.s2c1t': 'Excel compatible', 'feat.s2c1d': 'Import xlsx/xlsm/xls/json/csv with a Luckysheet-grade feel.',
      'feat.s2c2t': 'cnx project file', 'feat.s2c2d': 'A native project format that preserves CT column types, references and Python formulas.',
      'feat.s2c3t': 'Multi-tab management', 'feat.s2c3d': 'Open many sheets at once without interference; pre-rendered for instant switching.',
      'feat.s3tag': 'CT column type system', 'feat.s3h': 'The column is the type — edit structured data with ease',
      'feat.s3c1t': 'JSON editor', 'feat.s3c1d': 'Monaco code plus two-way tree sync.',
      'feat.s3c2t': 'Rich text editing', 'feat.s3c2d': 'Notion-like WYSIWYG.',
      'feat.s3c3t': 'Multi-data structures', 'feat.s3c3d': 'Schema-driven editing of object arrays.',
      'feat.s3c4t': 'Date editing', 'feat.s3c4d': 'Built-in date picker with timezone handling.',
      'feat.s3c5t': 'Resource loader', 'feat.s3c5d': 'Pick image/audio paths with thumbnails.',
      'feat.s4tag': 'Data-validation DSL', 'feat.s4h': 'Catch config errors before they ship',
      'feat.s4c1t': 'Validation rule DSL', 'feat.s4c1d': '8 rules plus && composition, written in one header row.',
      'feat.s4c2t': 'Cross-sheet reference checks', 'feat.s4c2d': 'ref / enum_ref cross-sheet foreign-key integrity.',
      'feat.s5tag': 'Versatile export', 'feat.s5h': 'One dataset, fed to every engine',
      'feat.s5c1t': '8 formats', 'feat.s5c1d': 'JSON / YAML / CSV / Protobuf / C# classes / Bytes / MessagePack. Ready for Unity / Unreal / Godot / in-house engines.',
      'feat.s6tag': 'Python integration', 'feat.s6h': 'Embed scripting power into your sheets',
      'feat.s6c1t': 'Python formulas', 'feat.s6c1d': 'Call Python functions in cells + SmartCache + batch execution.',
      'feat.s6c2t': 'Script editor', 'feat.s6c2d': 'CodeMirror + sandboxed execution + pandas / numpy.',
      'feat.s6c3t': 'Persistent script library', 'feat.s6c3d': 'Reuse across projects, shareable via the Workshop.',
      'feat.s7tag': 'Utility toolbox', 'feat.s7h': 'Productivity tools honed for game configs',
      'feat.s7c1t': 'Multilingual integration', 'feat.s7c1d': 'Chinese / English / Japanese / Korean, with duplicate-text dedup.',
      'feat.s7c2t': 'Character extraction', 'feat.s7c2d': 'Scan all project text to generate a character whitelist.',
      'feat.s7c3t': 'Font subsetting', 'feat.s7c3d': 'Shrink fonts below 5% — a build-size slimming tool.',
      'feat.s7c4t': 'Batch editing', 'feat.s7c4d': 'Visual batch find-replace for arrays and object arrays.',
      'feat.s7c5t': 'Auto save', 'feat.s7c5d': 'No lost work from power loss, crashes or accidental closes.',
      'feat.s8tag': 'Extensions · Steam Workshop', 'feat.s8h': 'Capabilities that grow with your needs',
      'feat.s8c1t': 'File browser', 'feat.s8c1d': 'A standalone window tree with badges and reference entry points.',
      'feat.s8c2t': 'External reference sources', 'feat.s8c2d': 'Mount sheets across projects, look up values across sheets.',
      'feat.s8c3t': 'Reference graph', 'feat.s8c3d': 'Visualize who references whom.',
      'feat.s8c4t': 'Steam Workshop', 'feat.s8c4d': 'Subscribe to and upload components — built by the community.',
      'feat.s8c5t': 'Git / SVN', 'feat.s8c5d': 'A built-in source-control panel: commit / pull / branch.',
      'feat.s8c6t': 'Sheet diff', 'feat.s8c6d': 'Cell-by-cell diff with character-level highlighting (DLC).',
      'feat.endH': 'Ready to give it a try?', 'feat.endP': 'Download ConfigNexus for free and start managing your game configs.',
      'dl.title': 'Download · ConfigNexus', 'dl.desc': 'Download ConfigNexus, the desktop configuration management tool (Windows).',
      'dl.headTag': 'Download', 'dl.headH': 'Get ConfigNexus', 'dl.headP': 'A desktop configuration management tool — currently available for Windows.',
      'dl.ver': 'Latest · v1.0.0', 'dl.btnTrial': '↓ Download trial (itch.io)', 'dl.btnSteam': 'Get it on Steam',
      'dl.note': 'The trial is hosted on itch.io — click above to download and try it. Get the full version on Steam.',
      'dl.k1': 'OS', 'dl.v1': 'Windows 10 / 11', 'dl.k2': 'Architecture', 'dl.v2': '64-bit', 'dl.k3': 'Installation', 'dl.v3': 'NSIS installer',
      'dl.s1h': 'Download the installer', 'dl.s1p': 'Click the buttons above to download the trial (itch.io), or get the full version on Steam.',
      'dl.s2h': 'Run the installer', 'dl.s2p': 'Double-click the installer and follow the prompts. If the system warns about an unknown source, choose to run it anyway.',
      'dl.s3h': 'Get started', 'dl.s3p': 'Open ConfigNexus, import an Excel file or create a new config sheet, and follow the docs to get going.',
      'dl.endH': 'Not sure where to start?', 'dl.endP': 'Check the quick-start docs and get your first config sheet running in minutes.', 'dl.endBtn': 'View docs →',
      'docs.title': 'Docs · ConfigNexus', 'docs.desc': 'ConfigNexus documentation: table editing, CT column types, data validation, data export, Python integration, utility toolbox and the extension ecosystem.'
    },
    ja: {
      'nav.features': '機能', 'nav.workshop': 'ワークショップ', 'nav.download': 'ダウンロード', 'nav.docs': 'ドキュメント',
      'cta.download': '↓ 無料ダウンロード', 'cta.steam': 'Steam で見る',
      // ワークショップページ
      'ws.title': 'ワークショップ · ConfigNexus',
      'ws.desc': 'ConfigNexus ワークショップ：16 個のオープンソース実例コンポーネント + 8 個のオープンソースプラグイン Mod + コンポーネント/プラグイン開発ドキュメント + AI スキルパック、すべて GitHub でホスティング。',
      'ws.headTag': 'ワークショップ · オープンソース', 'ws.headH': '既製のコンポーネント、<br>自分のものづくりの出発点に',
      'ws.headP': '以下は ConfigNexus ワークショップのオープンソース実例コンポーネントです。すべてのソースコード、コンポーネント/プラグイン開発ドキュメント、AI スキルパックは GitHub にあり、クローンして実行・改造・テンプレート化できます。',
      'ws.ghBtn': '↗ GitHub で見る', 'ws.docsBtn': '開発ドキュメントを見る',
      'ws.gridTag': 'コンポーネント一覧', 'ws.gridH': '16 個のオープンソース実例コンポーネント', 'ws.empty': 'コンポーネントを読み込み中…',
      'ws.pluginsTag': 'プラグイン一覧', 'ws.pluginsH': '8 個のオープンソースプラグイン Mod',
      'ws.endH': '自分のコンポーネントを作りたい？', 'ws.endP': 'リポジトリをクローンし、AI スキルパックを導入、テンプレートから始めましょう。',
      'idx.title': 'ConfigNexus · すべての設定表をスプレッドシートのように管理',
      'idx.desc': 'ConfigNexus — デスクトップ向け設定管理ツール。表形式編集、Excel 双方向インポート/エクスポート、ローカル AI アシスタント、マルチフォーマット出力（JSON / CSV / YAML / C# / Protobuf …）。',
      'idx.eyebrow': 'ゲーム開発者のためのゲームデータ設定プラットフォーム',
      'idx.heroH': '<span class="hl">Excel・WPS</span>を超える<br>編集体験',
      'idx.sub': 'ゲーム設定を表形式で編集、Excel 全形式の双方向インポート/エクスポート、CT 列タイプ、データ検証 DSL、<br>Python 関数統合、ローカル AI アシスタント。一つのデータを 8 種類の主要フォーマットに出力。',
      'idx.shotTab': 'ConfigNexus — キャラ設定表.cnx',
      'idx.shotPh': '<b>アプリ画面のプレースホルダー</b><br>正式公開前に実際のスクリーンショットに差し替え',
      'idx.previewFile': 'キャラ設定表.cnx',
      'idx.previewPath': 'ローカルプロジェクト / gameplay / character',
      'idx.previewTab1': 'キャラ表', 'idx.previewTab2': 'スキル表', 'idx.previewTab3': 'ドロップ表',
      'idx.previewPanel': 'データ検証',
      'idx.previewIssue': '設定ミスを一行で特定',
      'idx.previewDesc': 'ルール、参照、型を同時に検査し、問題をセルまで戻します。',
      'idx.previewExport': 'ワンクリック出力',
      'idx.formatsLbl': '一つのデータ · 多彩な出力形式',
      'idx.coreTag': 'コア機能', 'idx.coreH': '設定作業のために生まれた',
      'idx.c1t': 'プロ仕様の表編集', 'idx.c1d': 'xlsx/xls/json/csv を全形式インポート、Luckysheet 級の操作感、複数タブを事前描画で瞬時切替。',
      'idx.c2t': 'CT 列タイプシステム', 'idx.c2d': 'JSON エディタ、リッチテキスト、マルチデータ構造、日付、リソースローダー。列がそのまま型。',
      'idx.c3t': 'データ検証 DSL', 'idx.c3d': '8 つのルール + && の組み合わせをヘッダー 1 行で記述、シート間参照の外部キー整合性チェック。',
      'idx.c4t': '多彩なエクスポート', 'idx.c4d': 'JSON / YAML / CSV / Protobuf / C# クラス / Bytes / MessagePack の 8 形式。',
      'idx.c5t': 'Python 深度統合', 'idx.c5d': 'セル内で Python 関数を呼び出し、SmartCache + 一括実行、サンドボックス化スクリプトエディタ。',
      'idx.c6t': '拡張エコシステム · ワークショップ', 'idx.c6d': '外部参照ソース、参照関係グラフ、Git/SVN、Steam ワークショップの購読とアップロード。',
      'idx.endH': '設定表は ConfigNexus へ', 'idx.endP': '無料でダウンロードして、今すぐ設定データの管理を始めましょう。',
      'feat.title': '機能 · ConfigNexus',
      'feat.desc': 'ConfigNexus のコア機能：AI アシスタント、プロ仕様の表編集、CT 列タイプ、データ検証 DSL、マルチフォーマット出力、Python 統合、実用ツールボックス、拡張エコシステム。',
      'feat.headTag': 'コア機能', 'feat.headH': 'ゲーム設定作業のために<br>生まれた全機能',
      'feat.headP': 'インポート・編集・検証・エクスポートまで、設定管理の全工程をカバー。各カードをクリックすると対応するチュートリアルへ。',
      'feat.s1tag': 'AI アシスタント', 'feat.s1h': 'ローカル LLM、データは端末外に出ない',
      'feat.s1c1t': 'ローカル AI 接続', 'feat.s1c1d': 'Ollama / LM Studio / リモート API に接続、プラットフォームごとにプラグインで拡張、ホスト無改修。',
      'feat.s1c2t': 'プライバシー優先', 'feat.s1c2d': 'AI は完全にローカルで動作し、機密設定データを外部サービスへ一切アップロードしません。',
      'feat.s1c3t': '入力補助と翻訳', 'feat.s1c3d': 'AI が一括入力・多言語翻訳・コンテンツ生成を支援、反復作業はお任せ。',
      'feat.s2tag': 'プロ仕様の表編集', 'feat.s2h': 'Excel のように快適、Excel 以上に設定を理解',
      'feat.s2c1t': 'Excel 互換', 'feat.s2c1d': 'xlsx/xlsm/xls/json/csv を全形式インポート、Luckysheet 級の操作感。',
      'feat.s2c2t': 'cnx プロジェクトファイル', 'feat.s2c2d': 'CT 列タイプ / 参照 / Python 数式を保持するネイティブプロジェクト形式。',
      'feat.s2c3t': 'マルチタブ管理', 'feat.s2c3d': '複数のシートを同時に開いても干渉せず、事前描画で瞬時切替。',
      'feat.s3tag': 'CT 列タイプシステム', 'feat.s3h': '列がそのまま型、構造化データを楽に編集',
      'feat.s3c1t': 'JSON エディタ', 'feat.s3c1d': 'Monaco コード + ツリー双方向同期。',
      'feat.s3c2t': 'リッチテキスト編集', 'feat.s3c2d': 'Notion ライクな WYSIWYG。',
      'feat.s3c3t': 'マルチデータ構造', 'feat.s3c3d': 'オブジェクト配列をスキーマ駆動で編集。',
      'feat.s3c4t': '日付編集', 'feat.s3c4d': '日付ピッカー内蔵、タイムゾーン対応。',
      'feat.s3c5t': 'リソースローダー', 'feat.s3c5d': '画像/音声パス選択 + サムネイル。',
      'feat.s4tag': 'データ検証 DSL', 'feat.s4h': '設定ミスをリリース前に防ぐ',
      'feat.s4c1t': '検証ルール DSL', 'feat.s4c1d': '8 ルール + && をヘッダー 1 行で記述。',
      'feat.s4c2t': 'シート間参照チェック', 'feat.s4c2d': 'ref / enum_ref のシート間外部キー整合性。',
      'feat.s5tag': '多彩なエクスポート', 'feat.s5h': '一つのデータをすべてのエンジンへ',
      'feat.s5c1t': '8 形式', 'feat.s5c1d': 'JSON / YAML / CSV / Protobuf / C# クラス / Bytes / MessagePack。Unity / Unreal / Godot / 自社エンジンでそのまま利用可。',
      'feat.s6tag': 'Python 統合', 'feat.s6h': 'スクリプトの力を表に組み込む',
      'feat.s6c1t': 'Python 数式', 'feat.s6c1d': 'セル内で Python 関数 + SmartCache + 一括実行。',
      'feat.s6c2t': 'スクリプトエディタ', 'feat.s6c2d': 'CodeMirror + サンドボックス実行 + pandas / numpy。',
      'feat.s6c3t': '永続スクリプトライブラリ', 'feat.s6c3d': 'プロジェクト横断で再利用、ワークショップで共有可。',
      'feat.s7tag': '実用ツールボックス', 'feat.s7h': 'ゲーム設定向けに磨いた効率ツール',
      'feat.s7c1t': '多言語統合', 'feat.s7c1d': '中/英/日/韓の 4 言語、重複テキストを除去。',
      'feat.s7c2t': '文字抽出', 'feat.s7c2d': 'プロジェクト全テキストを走査し文字ホワイトリストを生成。',
      'feat.s7c3t': 'フォントサブセット化', 'feat.s7c3d': 'フォントを 5% 以下に圧縮、ビルドサイズ削減の切り札。',
      'feat.s7c4t': '一括修正', 'feat.s7c4d': '検索置換／配列／オブジェクト配列のビジュアル一括処理。',
      'feat.s7c5t': '自動保存', 'feat.s7c5d': '停電・クラッシュ・誤操作でも作業を失わない。',
      'feat.s8tag': '拡張エコシステム · Steam ワークショップ', 'feat.s8h': 'ニーズに応じて成長する機能',
      'feat.s8c1t': 'ファイルブラウザ', 'feat.s8c1d': '独立ウィンドウのツリー + バッジ + 参照入口。',
      'feat.s8c2t': '外部参照ソース', 'feat.s8c2d': 'プロジェクト横断でシートをマウント、シート間で値を参照。',
      'feat.s8c3t': '参照関係グラフ', 'feat.s8c3d': '「誰が誰を参照しているか」を可視化。',
      'feat.s8c4t': 'ワークショップ', 'feat.s8c4d': 'コンポーネントの購読／アップロード、コミュニティで共創。',
      'feat.s8c5t': 'Git / SVN', 'feat.s8c5d': 'ソース管理パネル内蔵：commit / pull / branch。',
      'feat.s8c6t': '表比較', 'feat.s8c6d': 'セル単位の diff、文字レベルのハイライト（DLC）。',
      'feat.endH': '試してみませんか？', 'feat.endP': 'ConfigNexus を無料でダウンロードして、ゲーム設定の管理を始めましょう。',
      'dl.title': 'ダウンロード · ConfigNexus', 'dl.desc': 'デスクトップ向け設定管理ツール ConfigNexus をダウンロード（Windows）。',
      'dl.headTag': 'ダウンロード', 'dl.headH': 'ConfigNexus を入手', 'dl.headP': 'デスクトップ向け設定管理ツール。現在 Windows 版を提供。',
      'dl.ver': '最新版 · v1.0.0', 'dl.btnTrial': '↓ 体験版をダウンロード（itch.io）', 'dl.btnSteam': 'Steam で入手',
      'dl.note': '体験版は itch.io でホスティングされています。上のボタンから直接ダウンロードしてお試しください。完全版は Steam で入手できます。',
      'dl.k1': 'OS', 'dl.v1': 'Windows 10 / 11', 'dl.k2': 'アーキテクチャ', 'dl.v2': '64 ビット', 'dl.k3': 'インストール方式', 'dl.v3': 'NSIS インストーラー',
      'dl.s1h': 'インストーラーをダウンロード', 'dl.s1p': '上のボタンから体験版（itch.io）をダウンロード、または Steam で完全版を入手してください。',
      'dl.s2h': 'インストールを実行', 'dl.s2p': 'インストーラーをダブルクリックし、指示に従ってインストール。提供元不明と表示されたら「実行」を選択してください。',
      'dl.s3h': '使い始める', 'dl.s3p': 'ConfigNexus を開き、Excel をインポートまたは新規設定表を作成、ドキュメントを参考にすぐ開始。',
      'dl.endH': 'どこから始めればいい？', 'dl.endP': 'クイックスタートを見て、数分で最初の設定表を動かしましょう。', 'dl.endBtn': 'ドキュメントを見る →',
      'docs.title': 'ドキュメント · ConfigNexus', 'docs.desc': 'ConfigNexus の使用ドキュメント：表編集、CT 列タイプ、データ検証、データエクスポート、Python 統合、実用ツールボックス、拡張エコシステム。'
    },
    ko: {
      'nav.features': '기능', 'nav.workshop': '워크숍', 'nav.download': '다운로드', 'nav.docs': '문서',
      'cta.download': '↓ 무료 다운로드', 'cta.steam': 'Steam에서 보기',
      // 워크숍 페이지
      'ws.title': '워크숍 · ConfigNexus',
      'ws.desc': 'ConfigNexus 워크숍: 오픈소스 예제 컴포넌트 16개 + 오픈소스 플러그인 Mod 8개 + 컴포넌트/플러그인 개발 문서 + AI 스킬 팩, 모두 GitHub 호스팅.',
      'ws.headTag': '워크숍 · 오픈소스', 'ws.headH': '바로 쓰는 컴포넌트,<br>나만의 제작을 위한 출발점',
      'ws.headP': '아래는 ConfigNexus 워크숍의 오픈소스 예제 컴포넌트입니다. 모든 소스 코드와 컴포넌트/플러그인 개발 문서, AI 스킬 팩이 GitHub에 있어 클론해 실행·수정·템플릿으로 사용할 수 있습니다.',
      'ws.ghBtn': '↗ GitHub에서 보기', 'ws.docsBtn': '개발 문서 보기',
      'ws.gridTag': '컴포넌트 목록', 'ws.gridH': '오픈소스 예제 컴포넌트 16개', 'ws.empty': '컴포넌트 불러오는 중…',
      'ws.pluginsTag': '플러그인 목록', 'ws.pluginsH': '오픈소스 플러그인 Mod 8개',
      'ws.endH': '나만의 컴포넌트를 만들고 싶나요?', 'ws.endP': '저장소를 클론하고 AI 스킬 팩을 설치한 뒤 템플릿에서 시작하세요.',
      'idx.title': 'ConfigNexus · 모든 설정 시트를 스프레드시트처럼 관리',
      'idx.desc': 'ConfigNexus — 데스크톱 설정 관리 도구. 표 형식 편집, Excel 양방향 가져오기/내보내기, 로컬 AI 어시스턴트, 다중 형식 내보내기(JSON / CSV / YAML / C# / Protobuf …).',
      'idx.eyebrow': '게임 개발자를 위한 게임 데이터 설정 플랫폼',
      'idx.heroH': '<span class="hl">Excel·WPS</span>를 뛰어넘는<br>편집 경험',
      'idx.sub': '게임 설정을 표 형식으로 편집, 모든 Excel 형식 양방향 가져오기/내보내기, CT 열 유형, 데이터 검증 DSL,<br>Python 함수 통합, 로컬 AI 어시스턴트. 하나의 데이터를 8가지 주요 형식으로 내보내기.',
      'idx.shotTab': 'ConfigNexus — 캐릭터 설정표.cnx',
      'idx.shotPh': '<b>앱 화면 자리표시자</b><br>정식 출시 전 실제 스크린샷으로 교체 예정',
      'idx.previewFile': '캐릭터 설정표.cnx',
      'idx.previewPath': '로컬 프로젝트 / gameplay / character',
      'idx.previewTab1': '캐릭터', 'idx.previewTab2': '스킬', 'idx.previewTab3': '드롭',
      'idx.previewPanel': '데이터 검증',
      'idx.previewIssue': '설정 오류를 한 줄에서 찾기',
      'idx.previewDesc': '규칙, 참조, 유형을 함께 검사하고 정확한 셀로 돌아갑니다.',
      'idx.previewExport': '원클릭 내보내기',
      'idx.formatsLbl': '하나의 데이터 · 다양한 내보내기 형식',
      'idx.coreTag': '핵심 기능', 'idx.coreH': '설정 작업을 위해 태어나다',
      'idx.c1t': '전문 표 편집', 'idx.c1d': 'xlsx/xls/json/csv 전 형식 가져오기, Luckysheet 수준의 사용감, 사전 렌더링된 탭 즉시 전환.',
      'idx.c2t': 'CT 열 유형 시스템', 'idx.c2d': 'JSON 편집기, 리치 텍스트, 다중 데이터 구조, 날짜, 리소스 로더 — 열이 곧 유형.',
      'idx.c3t': '데이터 검증 DSL', 'idx.c3d': '8가지 규칙 + && 조합을 헤더 한 줄에 작성, 시트 간 참조 외래 키 무결성 검사.',
      'idx.c4t': '다양한 내보내기', 'idx.c4d': 'JSON / YAML / CSV / Protobuf / C# 클래스 / Bytes / MessagePack 등 8가지 형식.',
      'idx.c5t': 'Python 심층 통합', 'idx.c5d': '셀에서 Python 함수 호출, SmartCache + 일괄 실행, 샌드박스 스크립트 편집기.',
      'idx.c6t': '확장 생태계 · 창작마당', 'idx.c6d': '외부 참조 소스, 참조 관계 그래프, Git/SVN, Steam 창작마당 구독 및 업로드.',
      'idx.endH': '설정 시트를 ConfigNexus에 맡기세요', 'idx.endP': '무료로 다운로드하고 지금 바로 설정 데이터를 관리하세요.',
      'feat.title': '기능 · ConfigNexus',
      'feat.desc': 'ConfigNexus 핵심 기능: AI 어시스턴트, 전문 표 편집, CT 열 유형, 데이터 검증 DSL, 다중 형식 내보내기, Python 통합, 유틸리티 도구상자, 확장 생태계.',
      'feat.headTag': '핵심 기능', 'feat.headH': '게임 설정 작업을 위해<br>태어난 모든 기능',
      'feat.headP': '가져오기·편집·검증·내보내기까지 설정 관리의 전체 과정을 포괄. 카드를 클릭하면 해당 튜토리얼로 이동.',
      'feat.s1tag': 'AI 어시스턴트', 'feat.s1h': '로컬 LLM, 데이터는 기기를 벗어나지 않음',
      'feat.s1c1t': '로컬 AI 연동', 'feat.s1c1d': 'Ollama / LM Studio / 원격 API 연결, 플랫폼별 플러그인 확장, 호스트 변경 없음.',
      'feat.s1c2t': '개인정보 우선', 'feat.s1c2d': 'AI는 전적으로 로컬에서 실행되며 민감한 설정 데이터를 외부 서비스에 업로드하지 않습니다.',
      'feat.s1c3t': '입력 보조 및 번역', 'feat.s1c3d': 'AI가 일괄 입력·다국어 번역·콘텐츠 생성을 지원, 반복 작업을 맡기세요.',
      'feat.s2tag': '전문 표 편집', 'feat.s2h': 'Excel처럼 편하고, Excel보다 설정을 잘 이해',
      'feat.s2c1t': 'Excel 호환', 'feat.s2c1d': 'xlsx/xlsm/xls/json/csv 전 형식 가져오기, Luckysheet 수준의 사용감.',
      'feat.s2c2t': 'cnx 프로젝트 파일', 'feat.s2c2d': 'CT 열 유형 / 참조 / Python 수식을 보존하는 네이티브 프로젝트 형식.',
      'feat.s2c3t': '다중 탭 관리', 'feat.s2c3d': '여러 시트를 동시에 열어도 간섭 없이, 사전 렌더링으로 즉시 전환.',
      'feat.s3tag': 'CT 열 유형 시스템', 'feat.s3h': '열이 곧 유형, 구조화 데이터를 손쉽게 편집',
      'feat.s3c1t': 'JSON 편집기', 'feat.s3c1d': 'Monaco 코드 + 트리 양방향 동기화.',
      'feat.s3c2t': '리치 텍스트 편집', 'feat.s3c2d': 'Notion 유사 WYSIWYG.',
      'feat.s3c3t': '다중 데이터 구조', 'feat.s3c3d': '객체 배열 스키마 기반 편집.',
      'feat.s3c4t': '날짜 편집', 'feat.s3c4d': '내장 날짜 선택기, 시간대 처리.',
      'feat.s3c5t': '리소스 로더', 'feat.s3c5d': '이미지/오디오 경로 선택 + 썸네일.',
      'feat.s4tag': '데이터 검증 DSL', 'feat.s4h': '설정 오류를 출시 전에 차단',
      'feat.s4c1t': '검증 규칙 DSL', 'feat.s4c1d': '8가지 규칙 + && 조합을 헤더 한 줄에 작성.',
      'feat.s4c2t': '시트 간 참조 검사', 'feat.s4c2d': 'ref / enum_ref 시트 간 외래 키 무결성.',
      'feat.s5tag': '다양한 내보내기', 'feat.s5h': '하나의 데이터를 모든 엔진으로',
      'feat.s5c1t': '8가지 형식', 'feat.s5c1d': 'JSON / YAML / CSV / Protobuf / C# 클래스 / Bytes / MessagePack. Unity / Unreal / Godot / 자체 엔진에서 바로 사용.',
      'feat.s6tag': 'Python 통합', 'feat.s6h': '스크립트 기능을 표에 내장',
      'feat.s6c1t': 'Python 수식', 'feat.s6c1d': '셀에서 Python 함수 + SmartCache + 일괄 실행.',
      'feat.s6c2t': '스크립트 편집기', 'feat.s6c2d': 'CodeMirror + 샌드박스 실행 + pandas / numpy.',
      'feat.s6c3t': '영구 스크립트 라이브러리', 'feat.s6c3d': '프로젝트 간 재사용, 창작마당에서 공유 가능.',
      'feat.s7tag': '유틸리티 도구상자', 'feat.s7h': '게임 설정을 위해 다듬은 효율 도구',
      'feat.s7c1t': '다국어 통합', 'feat.s7c1d': '중/영/일/한 4개 언어, 중복 텍스트 제거.',
      'feat.s7c2t': '문자 추출', 'feat.s7c2d': '프로젝트 전체 텍스트를 스캔해 문자 화이트리스트 생성.',
      'feat.s7c3t': '폰트 서브셋', 'feat.s7c3d': '폰트를 5% 이하로 압축, 빌드 용량 절감 도구.',
      'feat.s7c4t': '일괄 수정', 'feat.s7c4d': '검색 치환 / 배열 / 객체 배열 시각적 일괄 처리.',
      'feat.s7c5t': '자동 저장', 'feat.s7c5d': '정전·크래시·실수로 닫아도 작업을 잃지 않음.',
      'feat.s8tag': '확장 생태계 · Steam 창작마당', 'feat.s8h': '필요에 따라 성장하는 기능',
      'feat.s8c1t': '파일 브라우저', 'feat.s8c1d': '독립 창 트리 + 배지 + 참조 진입점.',
      'feat.s8c2t': '외부 참조 소스', 'feat.s8c2d': '프로젝트 간 시트 마운트, 시트 간 값 조회.',
      'feat.s8c3t': '참조 관계 그래프', 'feat.s8c3d': "'누가 누구를 참조하는지' 시각화.",
      'feat.s8c4t': '창작마당', 'feat.s8c4d': '컴포넌트 구독 / 업로드, 커뮤니티 공동 제작.',
      'feat.s8c5t': 'Git / SVN', 'feat.s8c5d': '내장 소스 관리 패널: commit / pull / branch.',
      'feat.s8c6t': '시트 비교', 'feat.s8c6d': '셀 단위 diff, 문자 수준 강조 (DLC).',
      'feat.endH': '사용해 볼 준비가 되셨나요?', 'feat.endP': 'ConfigNexus를 무료로 다운로드하고 게임 설정 관리를 시작하세요.',
      'dl.title': '다운로드 · ConfigNexus', 'dl.desc': '데스크톱 설정 관리 도구 ConfigNexus 다운로드 (Windows).',
      'dl.headTag': '다운로드', 'dl.headH': 'ConfigNexus 받기', 'dl.headP': '데스크톱 설정 관리 도구. 현재 Windows 버전 제공.',
      'dl.ver': '최신 버전 · v1.0.0', 'dl.btnTrial': '↓ 체험판 다운로드 (itch.io)', 'dl.btnSteam': 'Steam에서 받기',
      'dl.note': '체험판은 itch.io에서 제공됩니다. 위 버튼을 눌러 바로 다운로드해 체험하세요. 정식 버전은 Steam에서 받을 수 있습니다.',
      'dl.k1': '운영체제', 'dl.v1': 'Windows 10 / 11', 'dl.k2': '아키텍처', 'dl.v2': '64비트', 'dl.k3': '설치 방식', 'dl.v3': 'NSIS 설치 프로그램',
      'dl.s1h': '설치 프로그램 다운로드', 'dl.s1p': '위 버튼으로 체험판(itch.io)을 다운로드하거나 Steam에서 정식 버전을 받으세요.',
      'dl.s2h': '설치 실행', 'dl.s2p': '설치 프로그램을 더블클릭하고 안내에 따라 설치하세요. 출처를 알 수 없다는 경고가 나오면 실행을 선택하면 됩니다.',
      'dl.s3h': '사용 시작', 'dl.s3p': 'ConfigNexus를 열고 Excel을 가져오거나 새 설정 시트를 만든 뒤 문서를 참고해 빠르게 시작하세요.',
      'dl.endH': '어디서 시작할지 모르겠나요?', 'dl.endP': '빠른 시작 문서를 보고 몇 분 만에 첫 설정 시트를 완성하세요.', 'dl.endBtn': '문서 보기 →',
      'docs.title': '문서 · ConfigNexus', 'docs.desc': 'ConfigNexus 문서: 표 편집, CT 열 유형, 데이터 검증, 데이터 내보내기, Python 통합, 유틸리티 도구상자, 확장 생태계.'
    }
  };
  window.CN_I18N = DICT;

  function applyI18n() {
    var d = DICT[lang]; if (!d) return;
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], key = el.getAttribute('data-i18n'), val = d[key];
      if (val == null) { if (lang !== 'zh') console.warn('[i18n] 缺翻译 key=' + key + ' lang=' + lang); continue; }
      var tag = el.tagName;
      if (tag === 'TITLE') document.title = val;
      else if (tag === 'META') el.setAttribute('content', val);
      else if (val.indexOf('<') >= 0) el.innerHTML = val;
      else el.textContent = val;
    }
  }

  function setLang(l) {
    if (l === lang) return;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    location.reload();
  }
  window.setSiteLang = setLang;

  // 语言元数据（与软件欢迎页一致：旗帜 + 名称；顺序 zh/ja/ko/en）
  var LANG_META = [
    ['zh', '🇨🇳', '简体中文'],
    ['ja', '🇯🇵', '日本語'],
    ['ko', '🇰🇷', '한국어'],
    ['en', '🇺🇸', 'English']
  ];
  var CARET = '<svg class="lang-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function injectSwitcher() {
    var nav = document.querySelector('.nav-links'); if (!nav) return;
    if (nav.querySelector('.lang-switcher')) return;
    var cur = null;
    for (var i = 0; i < LANG_META.length; i++) if (LANG_META[i][0] === lang) cur = LANG_META[i];
    if (!cur) cur = LANG_META[0];

    var wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    var items = LANG_META.map(function (x) {
      return '<button type="button" class="lang-item' + (x[0] === lang ? ' active' : '') +
        '" data-lang="' + x[0] + '" role="menuitem"><span class="lang-flag">' + x[1] +
        '</span><span>' + x[2] + '</span></button>';
    }).join('');
    wrap.innerHTML =
      '<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false">' +
        '<span class="lang-flag">' + cur[1] + '</span>' +
        '<span class="lang-name">' + cur[2] + '</span>' + CARET +
      '</button>' +
      '<div class="lang-menu" role="menu">' + items + '</div>';
    nav.appendChild(wrap);

    var btn = wrap.querySelector('.lang-btn');
    var menu = wrap.querySelector('.lang-menu');
    function close() { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    function toggle() {
      var open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    wrap.querySelectorAll('.lang-item').forEach(function (it) {
      it.addEventListener('click', function (e) { e.stopPropagation(); setLang(it.getAttribute('data-lang')); });
    });
    document.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function onReady() {
    injectSwitcher();
    applyI18n();
    try { document.documentElement.classList.remove('i18n-pending'); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
  // 安全兜底：万一上面没跑，load 时也确保显示出来
  window.addEventListener('load', function () { try { document.documentElement.classList.remove('i18n-pending'); } catch (e) {} });
})();
