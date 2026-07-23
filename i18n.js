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
      'cta.download': '↓ 在 Steam 免费试玩', 'cta.steam': '在 Steam 上查看',
      // 创意工坊页
      'ws.title': '创意工坊 · ConfigNexus',
      'ws.desc': 'ConfigNexus 创意工坊：16 个开源示例组件 + 8 个开源插件 Mod + 组件/插件开发文档 + AI 技能包，源码托管在 GitHub，照着就能给配置大师做组件和插件。',
      'ws.headTag': '创意工坊 · 开源组件', 'ws.headH': '现成的组件，<br>照着就能做你自己的',
      'ws.headP': '下面是 ConfigNexus 创意工坊的开源示例组件。全部源码 + 组件/插件开发文档 + AI 技能包都托管在 GitHub，克隆下来就能跑、能改、能当模板。',
      'ws.ghBtn': '↗ 在 GitHub 上查看', 'ws.docsBtn': '查看开发文档',
      'ws.videoTag': '创意工坊实录', 'ws.videoH': '天赋坐标可视化编辑',
      'ws.videoTitle': '天赋坐标：可视化拖拽与表格双向同步', 'ws.videoDesc': '配置坐标轴、拖动节点，并让表格与 Mod 实时同步',
      'ws.gridTag': '组件清单', 'ws.gridH': '16 个开源示例组件', 'ws.empty': '组件清单加载中…',
      'ws.pluginsTag': '插件清单', 'ws.pluginsH': '8 个开源插件 Mod',
      'ws.endH': '想做自己的组件？', 'ws.endP': '克隆仓库，装上 AI 技能包，从模板起步。',
      // 首页
      'idx.title': 'ConfigNexus · 面向游戏开发者的数据配置工作流平台',
      'idx.desc': '支持字段类型、数据校验、Excel 导入与多格式导出；内置富文本、多数据、JSON 编辑器和文件浏览器，让配置填写、检查、导出和协作更高效、更少出错。',
      'idx.eyebrow': '游戏数据配置工作流平台',
      'idx.heroH': '面向游戏开发者的<br><span class="hl">数据配置工作流平台</span>',
      'idx.sub': '支持字段类型、数据校验、Excel 导入与多格式导出；内置富文本、多数据、JSON 编辑器和文件浏览器，让配置填写、检查、导出和协作更高效、更少出错。',
      'idx.formatsLbl': '一份数据 · 多种导出格式',
      'idx.coreTag': '核心能力', 'idx.coreH': '为配置工作而生',
      'idx.c1t': '专业表格编辑', 'idx.c1d': 'xlsx/xls/json/csv 全格式导入，Luckysheet 内核手感，多页签预渲染秒切。',
      'idx.c2t': 'CT 列类型系统', 'idx.c2d': 'JSON 编辑器、富文本、多数据结构、日期、资源加载器，列即类型。',
      'idx.c3t': '数据验证 DSL', 'idx.c3d': '8 条规则 + && 组合，表头一行写完；跨表引用外键完整性校验。',
      'idx.c4t': '多样化导出', 'idx.c4d': 'JSON / YAML / CSV / Protobuf / C# 类 / Bytes / MessagePack 8 种格式。',
      'idx.c5t': 'Python 深度集成', 'idx.c5d': '单元格里调 Python 函数，SmartCache + 批量执行，沙箱脚本编辑器。',
      'idx.c6t': '扩展生态 · 创意工坊', 'idx.c6d': '外部引用源、引用关系图、Git/SVN、Steam 创意工坊订阅与上传。',
      'idx.aiTag': 'AI 扩展能力', 'idx.aiH': '让重复的配置工作交给 AI',
      'idx.aiP': '按需连接本地或远程模型，用自然语言完成内容生成、翻译和工作表操作；原有编辑、验证与导出流程保持不变。',
      'idx.aiC1t': '对话与内容生成', 'idx.aiC1d': '生成配置内容和结构化表格，并直接创建为新工作表。',
      'idx.aiC2t': '翻译与文本处理', 'idx.aiC2d': '批量翻译多语言列、生成英文字段并按指定语气润色文本。',
      'idx.aiC3t': '自然语言操作表格', 'idx.aiC3d': '通过文字指令增删行列、填写区域、清空内容或调整格式。',
      'idx.endH': '把配置表交给 ConfigNexus', 'idx.endP': '前往 Steam 免费试玩；需要完整功能时可在同一页面获取完整版。',
      'ai.modNote': '需要安装 AI Mod',
      // 功能页
      'feat.title': '功能 · ConfigNexus',
      'feat.desc': 'ConfigNexus 的核心能力：AI 助手、专业表格编辑、CT 列类型、数据验证 DSL、多格式导出、Python 集成、实用工具箱、扩展生态。',
      'feat.headTag': '核心能力', 'feat.headH': '为游戏配置工作<br>而生的全套能力',
      'feat.headP': '从导入、编辑、验证到导出，覆盖配置管理的完整链路。点任意卡片可跳到对应教程。',
      'feat.s1tag': 'AI 智能助手', 'feat.s1h': '本地或远程模型，按需选择',
      'feat.s1c1t': '本地 AI 接入', 'feat.s1c1d': '接入 Ollama / LM Studio / 远程接口，按平台插件化扩展，宿主零改动。',
      'feat.s1c2t': '隐私可控', 'feat.s1c2d': '选择本地模型时数据留在本机；使用远程接口时由对应服务商处理请求。',
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
      'dl.ver': 'Windows 桌面版', 'dl.btnTrial': '↓ 下载试用版（itch.io）', 'dl.btnSteam': '在 Steam 免费试玩 / 获取完整版',
      'dl.itchFallback': '也可以从 itch.io 下载试用版 →',
      'dl.note': '免费试玩与完整版都在同一 Steam 商店页；itch.io 仅作为备用下载。',
      'dl.k1': '系统', 'dl.v1': 'Windows 10 / 11', 'dl.k2': '架构', 'dl.v2': '64 位', 'dl.k3': '安装方式', 'dl.v3': 'Steam 客户端',
      'dl.s1h': '打开 Steam 商店页', 'dl.s1p': '前往 Steam 免费试玩，或在同一页面获取完整版。',
      'dl.s2h': '通过 Steam 安装', 'dl.s2p': '选择试玩版或完整版后，Steam 客户端会自动完成下载、安装和后续更新。',
      'dl.s3h': '开始使用', 'dl.s3p': '打开 ConfigNexus，导入 Excel 或新建配置表，参考文档快速上手。',
      'dl.endH': '不知道从哪开始？', 'dl.endP': '查看快速上手文档，几分钟跑通第一张配置表。', 'dl.endBtn': '查看文档 →',
      // 文档页 chrome
      'docs.title': '文档 · ConfigNexus', 'docs.desc': 'ConfigNexus 使用文档：表格编辑、CT 列类型、数据验证、数据导出、Python 集成、实用工具箱、扩展生态。'
    },
    en: {
      'nav.features': 'Features', 'nav.workshop': 'Workshop', 'nav.download': 'Download', 'nav.docs': 'Docs',
      'cta.download': '↓ Try free on Steam', 'cta.steam': 'View on Steam',
      // Workshop page
      'ws.title': 'Workshop · ConfigNexus',
      'ws.desc': 'ConfigNexus Workshop: 16 open-source example components + 8 open-source plugin mods + component/plugin dev docs + AI skill packs, all hosted on GitHub.',
      'ws.headTag': 'Workshop · Open Source', 'ws.headH': 'Ready-made components,<br>a head start on your own',
      'ws.headP': 'Below are the open-source example components from the ConfigNexus Workshop. All source code, component/plugin dev docs and AI skill packs live on GitHub — clone it to run, tweak, and use as templates.',
      'ws.ghBtn': '↗ View on GitHub', 'ws.docsBtn': 'View dev docs',
      'ws.videoTag': 'Workshop demo', 'ws.videoH': 'Visual talent coordinate editing',
      'ws.videoTitle': 'Talent coordinates: visual editing and two-way table sync', 'ws.videoDesc': 'Configure axes, drag nodes, and keep the table and Mod in sync',
      'ws.gridTag': 'Component list', 'ws.gridH': '16 open-source example components', 'ws.empty': 'Loading components…',
      'ws.pluginsTag': 'Plugin list', 'ws.pluginsH': '8 open-source plugin mods',
      'ws.endH': 'Want to build your own?', 'ws.endP': 'Clone the repo, install the AI skill packs, start from a template.',
      'idx.title': 'ConfigNexus · Data configuration workflow for game developers',
      'idx.desc': 'Supports field types, data validation, Excel import, and multi-format export, with rich-text, multi-data, JSON editors, and a file browser for faster, safer config work.',
      'idx.eyebrow': 'Game-data configuration workflow',
      'idx.heroH': 'A data-configuration workflow platform<br><span class="hl">for game developers</span>',
      'idx.sub': 'Supports field types, data validation, Excel import, and multi-format export, with rich-text, multi-data, JSON editors, and a file browser for faster, safer config work.',
      'idx.formatsLbl': 'One dataset · many export formats',
      'idx.coreTag': 'Core capabilities', 'idx.coreH': 'Built for configuration work',
      'idx.c1t': 'Professional table editing', 'idx.c1d': 'Import xlsx/xls/json/csv with a Luckysheet-grade feel; pre-rendered tabs switch instantly.',
      'idx.c2t': 'CT column type system', 'idx.c2d': 'JSON editor, rich text, multi-data structures, dates, resource loader — the column is the type.',
      'idx.c3t': 'Data-validation DSL', 'idx.c3d': '8 rules plus && composition, written in one header row; cross-sheet foreign-key integrity checks.',
      'idx.c4t': 'Versatile export', 'idx.c4d': '8 formats: JSON / YAML / CSV / Protobuf / C# classes / Bytes / MessagePack.',
      'idx.c5t': 'Deep Python integration', 'idx.c5d': 'Call Python functions from cells, SmartCache plus batch execution, a sandboxed script editor.',
      'idx.c6t': 'Extensions · Steam Workshop', 'idx.c6d': 'External reference sources, a reference graph, Git/SVN, plus Steam Workshop subscribe & upload.',
      'idx.aiTag': 'AI extensions', 'idx.aiH': 'Hand repetitive config work to AI',
      'idx.aiP': 'Connect local or remote models as needed for content generation, translation and worksheet operations, without changing the existing editing, validation and export workflow.',
      'idx.aiC1t': 'Chat and content generation', 'idx.aiC1d': 'Generate configuration content and structured tables, then create them as new worksheets.',
      'idx.aiC2t': 'Translation and text processing', 'idx.aiC2d': 'Translate multilingual columns, generate English field names and polish text in a chosen tone.',
      'idx.aiC3t': 'Natural-language worksheet operations', 'idx.aiC3d': 'Add or remove rows and columns, fill ranges, clear content or adjust formatting with text commands.',
      'idx.endH': 'Hand your config sheets to ConfigNexus', 'idx.endP': 'Try ConfigNexus free on Steam, then get the full version from the same page when you need it.',
      'ai.modNote': 'Requires an AI Mod',
      'feat.title': 'Features · ConfigNexus',
      'feat.desc': 'ConfigNexus core capabilities: AI assistant, professional table editing, CT column types, a data-validation DSL, multi-format export, Python integration, a utility toolbox and an extension ecosystem.',
      'feat.headTag': 'Core capabilities', 'feat.headH': 'A complete toolkit built<br>for game-config work',
      'feat.headP': 'From import and editing to validation and export — covering the full configuration-management pipeline. Click any card to jump to its tutorial.',
      'feat.s1tag': 'AI assistant', 'feat.s1h': 'Choose local or remote models as needed',
      'feat.s1c1t': 'Local AI integration', 'feat.s1c1d': 'Connect Ollama / LM Studio / remote APIs, extend per platform via plugins, zero host changes.',
      'feat.s1c2t': 'Privacy under your control', 'feat.s1c2d': 'Local models keep data on your machine; remote APIs process requests through their respective providers.',
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
      'dl.ver': 'Windows desktop app', 'dl.btnTrial': '↓ Download trial (itch.io)', 'dl.btnSteam': 'Try free / Get the full version on Steam',
      'dl.itchFallback': 'Or download the trial from itch.io →',
      'dl.note': 'The free demo and full version share one Steam store page; itch.io remains an alternative download.',
      'dl.k1': 'OS', 'dl.v1': 'Windows 10 / 11', 'dl.k2': 'Architecture', 'dl.v2': '64-bit', 'dl.k3': 'Installation', 'dl.v3': 'Steam client',
      'dl.s1h': 'Open the Steam store page', 'dl.s1p': 'Try it free on Steam, or get the full version from the same page.',
      'dl.s2h': 'Install through Steam', 'dl.s2p': 'Choose the demo or full version and Steam will handle downloading, installation, and updates.',
      'dl.s3h': 'Get started', 'dl.s3p': 'Open ConfigNexus, import an Excel file or create a new config sheet, and follow the docs to get going.',
      'dl.endH': 'Not sure where to start?', 'dl.endP': 'Check the quick-start docs and get your first config sheet running in minutes.', 'dl.endBtn': 'View docs →',
      'docs.title': 'Docs · ConfigNexus', 'docs.desc': 'ConfigNexus documentation: table editing, CT column types, data validation, data export, Python integration, utility toolbox and the extension ecosystem.'
    },
    ja: {
      'nav.features': '機能', 'nav.workshop': 'ワークショップ', 'nav.download': 'ダウンロード', 'nav.docs': 'ドキュメント',
      'cta.download': '↓ Steam で無料体験', 'cta.steam': 'Steam で見る',
      // ワークショップページ
      'ws.title': 'ワークショップ · ConfigNexus',
      'ws.desc': 'ConfigNexus ワークショップ：16 個のオープンソース実例コンポーネント + 8 個のオープンソースプラグイン Mod + コンポーネント/プラグイン開発ドキュメント + AI スキルパック、すべて GitHub でホスティング。',
      'ws.headTag': 'ワークショップ · オープンソース', 'ws.headH': '既製のコンポーネント、<br>自分のものづくりの出発点に',
      'ws.headP': '以下は ConfigNexus ワークショップのオープンソース実例コンポーネントです。すべてのソースコード、コンポーネント/プラグイン開発ドキュメント、AI スキルパックは GitHub にあり、クローンして実行・改造・テンプレート化できます。',
      'ws.ghBtn': '↗ GitHub で見る', 'ws.docsBtn': '開発ドキュメントを見る',
      'ws.videoTag': 'ワークショップ実演', 'ws.videoH': '天賦座標をビジュアル編集',
      'ws.videoTitle': '天賦座標：ドラッグ操作と表の双方向同期', 'ws.videoDesc': '座標軸を設定し、ノードを動かして表と Mod を同期',
      'ws.gridTag': 'コンポーネント一覧', 'ws.gridH': '16 個のオープンソース実例コンポーネント', 'ws.empty': 'コンポーネントを読み込み中…',
      'ws.pluginsTag': 'プラグイン一覧', 'ws.pluginsH': '8 個のオープンソースプラグイン Mod',
      'ws.endH': '自分のコンポーネントを作りたい？', 'ws.endP': 'リポジトリをクローンし、AI スキルパックを導入、テンプレートから始めましょう。',
      'idx.title': 'ConfigNexus · ゲーム開発者向けデータ設定ワークフロー',
      'idx.desc': 'フィールド型、データ検証、Excel インポート、複数形式のエクスポートに対応。リッチテキスト、マルチデータ、JSON エディタ、ファイルブラウザで設定作業をより速く安全にします。',
      'idx.eyebrow': 'ゲームデータ設定ワークフロー',
      'idx.heroH': 'ゲーム開発者向け<br><span class="hl">データ設定ワークフロープラットフォーム</span>',
      'idx.sub': 'フィールド型、データ検証、Excel インポート、複数形式のエクスポートに対応。リッチテキスト、マルチデータ、JSON エディタ、ファイルブラウザで設定作業をより速く安全にします。',
      'idx.formatsLbl': '一つのデータ · 多彩な出力形式',
      'idx.coreTag': 'コア機能', 'idx.coreH': '設定作業のために生まれた',
      'idx.c1t': 'プロ仕様の表編集', 'idx.c1d': 'xlsx/xls/json/csv を全形式インポート、Luckysheet 級の操作感、複数タブを事前描画で瞬時切替。',
      'idx.c2t': 'CT 列タイプシステム', 'idx.c2d': 'JSON エディタ、リッチテキスト、マルチデータ構造、日付、リソースローダー。列がそのまま型。',
      'idx.c3t': 'データ検証 DSL', 'idx.c3d': '8 つのルール + && の組み合わせをヘッダー 1 行で記述、シート間参照の外部キー整合性チェック。',
      'idx.c4t': '多彩なエクスポート', 'idx.c4d': 'JSON / YAML / CSV / Protobuf / C# クラス / Bytes / MessagePack の 8 形式。',
      'idx.c5t': 'Python 深度統合', 'idx.c5d': 'セル内で Python 関数を呼び出し、SmartCache + 一括実行、サンドボックス化スクリプトエディタ。',
      'idx.c6t': '拡張エコシステム · ワークショップ', 'idx.c6d': '外部参照ソース、参照関係グラフ、Git/SVN、Steam ワークショップの購読とアップロード。',
      'idx.aiTag': 'AI 拡張機能', 'idx.aiH': '反復する設定作業は AI へ',
      'idx.aiP': '必要に応じてローカルまたはリモートモデルに接続し、生成、翻訳、シート操作を自然言語で実行。従来の編集、検証、出力フローは変わりません。',
      'idx.aiC1t': '対話とコンテンツ生成', 'idx.aiC1d': '設定コンテンツと構造化テーブルを生成し、新しいシートとして作成します。',
      'idx.aiC2t': '翻訳とテキスト処理', 'idx.aiC2d': '多言語列の一括翻訳、英語フィールド名の生成、指定トーンでの推敲に対応します。',
      'idx.aiC3t': '自然言語でシート操作', 'idx.aiC3d': 'テキスト指示で行列の追加・削除、範囲入力、クリア、書式変更を行います。',
      'idx.endH': '設定表は ConfigNexus へ', 'idx.endP': 'Steam で無料体験し、必要になったら同じページから完全版を入手できます。',
      'ai.modNote': 'AI Mod のインストールが必要です',
      'feat.title': '機能 · ConfigNexus',
      'feat.desc': 'ConfigNexus のコア機能：AI アシスタント、プロ仕様の表編集、CT 列タイプ、データ検証 DSL、マルチフォーマット出力、Python 統合、実用ツールボックス、拡張エコシステム。',
      'feat.headTag': 'コア機能', 'feat.headH': 'ゲーム設定作業のために<br>生まれた全機能',
      'feat.headP': 'インポート・編集・検証・エクスポートまで、設定管理の全工程をカバー。各カードをクリックすると対応するチュートリアルへ。',
      'feat.s1tag': 'AI アシスタント', 'feat.s1h': 'ローカルまたはリモートモデルを必要に応じて選択',
      'feat.s1c1t': 'ローカル AI 接続', 'feat.s1c1d': 'Ollama / LM Studio / リモート API に接続、プラットフォームごとにプラグインで拡張、ホスト無改修。',
      'feat.s1c2t': 'プライバシーを制御', 'feat.s1c2d': 'ローカルモデルならデータは端末内に保持。リモート API は各サービス提供元がリクエストを処理します。',
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
      'dl.ver': 'Windows デスクトップ版', 'dl.btnTrial': '↓ 体験版をダウンロード（itch.io）', 'dl.btnSteam': 'Steam で無料体験 / 完全版を入手',
      'dl.itchFallback': 'itch.io から体験版をダウンロードすることもできます →',
      'dl.note': '無料体験版と完全版は同じ Steam ストアページにあります。itch.io は予備のダウンロード先です。',
      'dl.k1': 'OS', 'dl.v1': 'Windows 10 / 11', 'dl.k2': 'アーキテクチャ', 'dl.v2': '64 ビット', 'dl.k3': 'インストール方式', 'dl.v3': 'Steam クライアント',
      'dl.s1h': 'Steam ストアページを開く', 'dl.s1p': 'Steam で無料体験するか、同じページから完全版を入手してください。',
      'dl.s2h': 'Steam からインストール', 'dl.s2p': '体験版または完全版を選ぶと、Steam がダウンロード、インストール、更新を行います。',
      'dl.s3h': '使い始める', 'dl.s3p': 'ConfigNexus を開き、Excel をインポートまたは新規設定表を作成、ドキュメントを参考にすぐ開始。',
      'dl.endH': 'どこから始めればいい？', 'dl.endP': 'クイックスタートを見て、数分で最初の設定表を動かしましょう。', 'dl.endBtn': 'ドキュメントを見る →',
      'docs.title': 'ドキュメント · ConfigNexus', 'docs.desc': 'ConfigNexus の使用ドキュメント：表編集、CT 列タイプ、データ検証、データエクスポート、Python 統合、実用ツールボックス、拡張エコシステム。'
    },
    ko: {
      'nav.features': '기능', 'nav.workshop': '워크숍', 'nav.download': '다운로드', 'nav.docs': '문서',
      'cta.download': '↓ Steam에서 무료 체험', 'cta.steam': 'Steam에서 보기',
      // 워크숍 페이지
      'ws.title': '워크숍 · ConfigNexus',
      'ws.desc': 'ConfigNexus 워크숍: 오픈소스 예제 컴포넌트 16개 + 오픈소스 플러그인 Mod 8개 + 컴포넌트/플러그인 개발 문서 + AI 스킬 팩, 모두 GitHub 호스팅.',
      'ws.headTag': '워크숍 · 오픈소스', 'ws.headH': '바로 쓰는 컴포넌트,<br>나만의 제작을 위한 출발점',
      'ws.headP': '아래는 ConfigNexus 워크숍의 오픈소스 예제 컴포넌트입니다. 모든 소스 코드와 컴포넌트/플러그인 개발 문서, AI 스킬 팩이 GitHub에 있어 클론해 실행·수정·템플릿으로 사용할 수 있습니다.',
      'ws.ghBtn': '↗ GitHub에서 보기', 'ws.docsBtn': '개발 문서 보기',
      'ws.videoTag': '워크숍 데모', 'ws.videoH': '특성 좌표 시각 편집',
      'ws.videoTitle': '특성 좌표: 드래그 편집과 표 양방향 동기화', 'ws.videoDesc': '좌표축을 설정하고 노드를 드래그해 표와 Mod를 동기화',
      'ws.gridTag': '컴포넌트 목록', 'ws.gridH': '오픈소스 예제 컴포넌트 16개', 'ws.empty': '컴포넌트 불러오는 중…',
      'ws.pluginsTag': '플러그인 목록', 'ws.pluginsH': '오픈소스 플러그인 Mod 8개',
      'ws.endH': '나만의 컴포넌트를 만들고 싶나요?', 'ws.endP': '저장소를 클론하고 AI 스킬 팩을 설치한 뒤 템플릿에서 시작하세요.',
      'idx.title': 'ConfigNexus · 게임 개발자를 위한 데이터 설정 워크플로',
      'idx.desc': '필드 유형, 데이터 검증, Excel 가져오기, 다중 형식 내보내기를 지원하며 리치 텍스트, 다중 데이터, JSON 편집기와 파일 브라우저로 설정 작업을 더 빠르고 안전하게 만듭니다.',
      'idx.eyebrow': '게임 데이터 설정 워크플로',
      'idx.heroH': '게임 개발자를 위한<br><span class="hl">데이터 설정 워크플로 플랫폼</span>',
      'idx.sub': '필드 유형, 데이터 검증, Excel 가져오기, 다중 형식 내보내기를 지원하며 리치 텍스트, 다중 데이터, JSON 편집기와 파일 브라우저로 설정 작업을 더 빠르고 안전하게 만듭니다.',
      'idx.formatsLbl': '하나의 데이터 · 다양한 내보내기 형식',
      'idx.coreTag': '핵심 기능', 'idx.coreH': '설정 작업을 위해 태어나다',
      'idx.c1t': '전문 표 편집', 'idx.c1d': 'xlsx/xls/json/csv 전 형식 가져오기, Luckysheet 수준의 사용감, 사전 렌더링된 탭 즉시 전환.',
      'idx.c2t': 'CT 열 유형 시스템', 'idx.c2d': 'JSON 편집기, 리치 텍스트, 다중 데이터 구조, 날짜, 리소스 로더 — 열이 곧 유형.',
      'idx.c3t': '데이터 검증 DSL', 'idx.c3d': '8가지 규칙 + && 조합을 헤더 한 줄에 작성, 시트 간 참조 외래 키 무결성 검사.',
      'idx.c4t': '다양한 내보내기', 'idx.c4d': 'JSON / YAML / CSV / Protobuf / C# 클래스 / Bytes / MessagePack 등 8가지 형식.',
      'idx.c5t': 'Python 심층 통합', 'idx.c5d': '셀에서 Python 함수 호출, SmartCache + 일괄 실행, 샌드박스 스크립트 편집기.',
      'idx.c6t': '확장 생태계 · 창작마당', 'idx.c6d': '외부 참조 소스, 참조 관계 그래프, Git/SVN, Steam 창작마당 구독 및 업로드.',
      'idx.aiTag': 'AI 확장 기능', 'idx.aiH': '반복적인 설정 작업은 AI에게',
      'idx.aiP': '필요에 따라 로컬 또는 원격 모델을 연결해 콘텐츠 생성, 번역, 워크시트 작업을 자연어로 수행하며 기존 편집·검증·내보내기 흐름은 그대로 유지합니다.',
      'idx.aiC1t': '대화와 콘텐츠 생성', 'idx.aiC1d': '설정 콘텐츠와 구조화된 표를 생성하고 새 워크시트로 만듭니다.',
      'idx.aiC2t': '번역과 텍스트 처리', 'idx.aiC2d': '다국어 열 일괄 번역, 영문 필드명 생성, 지정한 어조의 문장 다듬기를 지원합니다.',
      'idx.aiC3t': '자연어 워크시트 작업', 'idx.aiC3d': '텍스트 명령으로 행과 열 추가·삭제, 범위 입력, 내용 지우기, 서식 변경을 수행합니다.',
      'idx.endH': '설정 시트를 ConfigNexus에 맡기세요', 'idx.endP': 'Steam에서 무료로 체험하고 필요할 때 같은 페이지에서 정식 버전을 받을 수 있습니다.',
      'ai.modNote': 'AI Mod 설치 필요',
      'feat.title': '기능 · ConfigNexus',
      'feat.desc': 'ConfigNexus 핵심 기능: AI 어시스턴트, 전문 표 편집, CT 열 유형, 데이터 검증 DSL, 다중 형식 내보내기, Python 통합, 유틸리티 도구상자, 확장 생태계.',
      'feat.headTag': '핵심 기능', 'feat.headH': '게임 설정 작업을 위해<br>태어난 모든 기능',
      'feat.headP': '가져오기·편집·검증·내보내기까지 설정 관리의 전체 과정을 포괄. 카드를 클릭하면 해당 튜토리얼로 이동.',
      'feat.s1tag': 'AI 어시스턴트', 'feat.s1h': '필요에 따라 로컬 또는 원격 모델 선택',
      'feat.s1c1t': '로컬 AI 연동', 'feat.s1c1d': 'Ollama / LM Studio / 원격 API 연결, 플랫폼별 플러그인 확장, 호스트 변경 없음.',
      'feat.s1c2t': '개인정보 직접 제어', 'feat.s1c2d': '로컬 모델은 데이터를 기기에 보관하고, 원격 API는 해당 서비스 제공자가 요청을 처리합니다.',
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
      'dl.ver': 'Windows 데스크톱 앱', 'dl.btnTrial': '↓ 체험판 다운로드 (itch.io)', 'dl.btnSteam': 'Steam에서 무료 체험 / 정식 버전 받기',
      'dl.itchFallback': 'itch.io에서 체험판을 다운로드할 수도 있습니다 →',
      'dl.note': '무료 체험판과 정식 버전은 같은 Steam 상점 페이지에 있습니다. itch.io는 보조 다운로드 경로입니다.',
      'dl.k1': '운영체제', 'dl.v1': 'Windows 10 / 11', 'dl.k2': '아키텍처', 'dl.v2': '64비트', 'dl.k3': '설치 방식', 'dl.v3': 'Steam 클라이언트',
      'dl.s1h': 'Steam 상점 페이지 열기', 'dl.s1p': 'Steam에서 무료로 체험하거나 같은 페이지에서 정식 버전을 받으세요.',
      'dl.s2h': 'Steam으로 설치', 'dl.s2p': '체험판 또는 정식 버전을 선택하면 Steam이 다운로드, 설치, 업데이트를 처리합니다.',
      'dl.s3h': '사용 시작', 'dl.s3p': 'ConfigNexus를 열고 Excel을 가져오거나 새 설정 시트를 만든 뒤 문서를 참고해 빠르게 시작하세요.',
      'dl.endH': '어디서 시작할지 모르겠나요?', 'dl.endP': '빠른 시작 문서를 보고 몇 분 만에 첫 설정 시트를 완성하세요.', 'dl.endBtn': '문서 보기 →',
      'docs.title': '문서 · ConfigNexus', 'docs.desc': 'ConfigNexus 문서: 표 편집, CT 열 유형, 데이터 검증, 데이터 내보내기, Python 통합, 유틸리티 도구상자, 확장 생태계.'
    }
  };

  Object.assign(DICT.zh, {
    'nav.menu': '菜单', 'cta.download': '↓ 在 Steam 免费试玩', 'cta.demo': '观看 30 秒演示',
    'idx.title': 'ConfigNexus · 从 Excel 到游戏引擎的配置工作台',
    'idx.desc': '导入 xlsx、xls、json、csv，用表格方式编辑，检查字段类型、引用和规则，再导出 JSON、Protobuf、C# 等工程格式。',
    'idx.eyebrow': '给游戏策划与开发者的配置工作台',
    'idx.heroH': '从 Excel 到游戏引擎，<br><span class="hl">配置数据少出错、好维护</span>',
    'idx.sub': '导入 xlsx / xls / json / csv，用熟悉的表格方式编辑；字段类型、引用和规则即时检查，再导出 JSON、Protobuf、C# 等工程格式。',
    'idx.demoCaption': '真实产品界面 · 30 秒了解完整配置流程',
    'idx.proofLabel': '一条可验证的配置工作流', 'idx.proofImport': '导入 xlsx / xls / json / csv',
    'idx.proofEdit': '表格与结构化编辑', 'idx.proofValidate': '类型、规则与引用校验', 'idx.proofExport': '导出工程格式',
    'idx.workflowH': '一张表，从拿到手到交给引擎', 'idx.workflowP': '每一步都发生在真实产品里：保留原始数据结构，编辑时发现问题，按项目需要导出。',
    'idx.flow1t': '导入，不用重做数据', 'idx.flow1d': '把现有 xlsx、xls、json、csv 直接带进来，继续用熟悉的表格方式工作。',
    'idx.flow2t': '编辑，结构就在单元格里', 'idx.flow2d': '表格、多页签、JSON 和 CT 列类型协同工作，复杂配置不再拆成零散工具。',
    'idx.flow3t': '校验，问题留在上线之前', 'idx.flow3d': '字段类型、规则和跨表引用即时检查，错误回到具体数据位置处理。',
    'idx.flow4t': '导出，接进你的工程', 'idx.flow4d': '按项目需要输出 JSON、Protobuf、C#、Bytes、MessagePack 等格式。',
    'idx.learnMore': '查看核心工作流 →', 'idx.openDocs': '打开对应文档 →',
    'idx.advancedTag': '进阶能力', 'idx.advancedH': '配置变复杂，工具也跟得上',
    'idx.referenceT': '看清跨表引用', 'idx.referenceD': '把外部数据源与引用关系画出来，定位配置依赖。',
    'idx.aiDemoCaption': '用自然语言操作真实工作表', 'idx.ecoTag': '工程与生态', 'idx.ecoH': '从一张表，走向整个项目',
    'idx.ecoRef': '引用关系图：追踪跨表依赖', 'idx.ecoScript': '脚本库：复用项目自动化',
    'idx.endP': '前往 Steam 免费试玩；需要完整功能时可在同一页面获取完整版。',
    'feat.groupCore': '核心工作流', 'feat.groupEngineering': '效率与工程', 'feat.groupExtensions': '扩展能力',
    'feat.groupCoreH': '导入、编辑、校验、导出，一条链路完成', 'feat.groupCoreP': '从已有数据开始，在同一个工作台中整理结构、发现问题，再交付给游戏工程。',
    'feat.groupEngineeringH': '把重复处理沉淀成项目能力', 'feat.groupEngineeringP': '用 Python、批量工具和脚本库处理规模化配置工作。',
    'feat.groupExtensionsH': '连接项目、团队与可选 AI', 'feat.groupExtensionsP': '引用图、版本控制、创意工坊和 AI Mod 按项目需要接入。',
    'feat.aiIntro': 'AI 是可选扩展，不改变原有导入、编辑、校验与导出流程。',
    'proof.realLabel': '真实操作全程', 'proof.focusLabel': '关键区域放大 · 来自同一条真实录屏',
    'proof.realTitle': '看真实操作，也看清关键结果', 'proof.realDesc': '每段视频都来自最新真实录制脚本；信息密集的区域同时提供同源局部放大图。',
    'proof.exportPathTitle': '导出路径配置', 'proof.exportPathDesc': '把不同格式写入项目指定目录，保持交付路径稳定。',
    'proof.idTitle': '批量生成 ID', 'proof.idDesc': '按规则生成并回写连续 ID，真实结果直接留在表格中。',
    'dl.ver': 'Windows 桌面版', 'dl.trialTag': 'Steam 官方入口', 'dl.trialH': 'Steam 版（含免费试玩）',
    'dl.trialP': '在同一 Steam 商店页免费试玩；需要完整功能时可直接获取完整版。', 'dl.fullTag': '完整版本', 'dl.fullH': 'Steam 版',
    'dl.fullP': '需要完整版本时，前往 Steam 查看并获取。'
  });

  Object.assign(DICT.en, {
    'nav.menu': 'Menu', 'cta.download': '↓ Try free on Steam', 'cta.demo': 'Watch the 30-second demo',
    'idx.title': 'ConfigNexus · From Excel to your game engine',
    'idx.desc': 'Import xlsx, xls, json, and csv; edit in a familiar grid; validate types, references, and rules; then export engineering-ready formats.',
    'idx.eyebrow': 'A configuration workspace for game designers and developers',
    'idx.heroH': 'From Excel to your game engine,<br><span class="hl">safer configs that stay maintainable</span>',
    'idx.sub': 'Import xlsx / xls / json / csv and edit in a familiar grid. Check field types, references, and rules as you work, then export JSON, Protobuf, C#, and more.',
    'idx.demoCaption': 'Real product UI · See the complete workflow in 30 seconds',
    'idx.proofLabel': 'One verifiable configuration workflow', 'idx.proofImport': 'Import xlsx / xls / json / csv',
    'idx.proofEdit': 'Grid and structured editing', 'idx.proofValidate': 'Type, rule, and reference checks', 'idx.proofExport': 'Export engineering formats',
    'idx.workflowH': 'One sheet, from handoff to game engine', 'idx.workflowP': 'Every step happens in the real product: preserve source structure, catch issues while editing, and export for your project.',
    'idx.flow1t': 'Import without rebuilding data', 'idx.flow1d': 'Bring existing xlsx, xls, json, and csv files straight in and keep working in a familiar grid.',
    'idx.flow2t': 'Edit structure right in the cells', 'idx.flow2d': 'Tables, tabs, JSON, and CT column types work together, so complex configs no longer need scattered tools.',
    'idx.flow3t': 'Catch issues before release', 'idx.flow3d': 'Check field types, rules, and cross-sheet references immediately, then return to the exact data that needs attention.',
    'idx.flow4t': 'Export into your project', 'idx.flow4d': 'Output JSON, Protobuf, C#, Bytes, MessagePack, and other formats your project needs.',
    'idx.learnMore': 'See the core workflow →', 'idx.openDocs': 'Open the relevant docs →',
    'idx.advancedTag': 'Advanced capabilities', 'idx.advancedH': 'As configs grow, the tooling keeps up',
    'idx.referenceT': 'Understand cross-sheet references', 'idx.referenceD': 'Map external data sources and reference relationships to locate dependencies.',
    'idx.aiDemoCaption': 'Operate a real worksheet with natural language', 'idx.ecoTag': 'Engineering & ecosystem', 'idx.ecoH': 'From one sheet to the whole project',
    'idx.ecoRef': 'Reference graph: trace cross-sheet dependencies', 'idx.ecoScript': 'Script library: reuse project automation',
    'idx.endP': 'Try ConfigNexus free on Steam, then get the full version from the same page when you need it.',
    'feat.groupCore': 'Core workflow', 'feat.groupEngineering': 'Productivity & engineering', 'feat.groupExtensions': 'Extensions',
    'feat.groupCoreH': 'Import, edit, validate, and export in one flow', 'feat.groupCoreP': 'Start with existing data, organize structure and catch issues in one workspace, then deliver it to the game project.',
    'feat.groupEngineeringH': 'Turn repetitive work into project capability', 'feat.groupEngineeringP': 'Use Python, batch tools, and the script library for configuration work at scale.',
    'feat.groupExtensionsH': 'Connect projects, teams, and optional AI', 'feat.groupExtensionsP': 'Add reference graphs, source control, Workshop content, and AI Mods when the project needs them.',
    'feat.aiIntro': 'AI is an optional extension and does not change the core import, edit, validate, and export flow.',
    'proof.realLabel': 'Full real workflow', 'proof.focusLabel': 'Focused detail · From the same real recording',
    'proof.realTitle': 'See the real workflow and the result clearly', 'proof.realDesc': 'Every video comes from the latest real recorder; dense areas include a focused frame from the same recording.',
    'proof.exportPathTitle': 'Export path configuration', 'proof.exportPathDesc': 'Write each format to the project directory it belongs in and keep delivery paths stable.',
    'proof.idTitle': 'Generate IDs in bulk', 'proof.idDesc': 'Generate sequential IDs by rule and write the verified result back to the worksheet.',
    'dl.ver': 'Windows desktop app', 'dl.trialTag': 'Official Steam access', 'dl.trialH': 'Steam edition (free demo)',
    'dl.trialP': 'Try it free from the same Steam store page, then get the full version there when you need it.', 'dl.fullTag': 'Full version', 'dl.fullH': 'Steam edition',
    'dl.fullP': 'When you need the full version, view and get it on Steam.'
  });

  Object.assign(DICT.ja, {
    'nav.menu': 'メニュー', 'cta.download': '↓ Steam で無料体験', 'cta.demo': '30 秒デモを見る',
    'idx.title': 'ConfigNexus · Excel からゲームエンジンまで',
    'idx.desc': 'xlsx、xls、json、csv を取り込み、使い慣れた表で編集。型・参照・ルールを検証し、開発向け形式にエクスポートします。',
    'idx.eyebrow': 'ゲームデザイナーと開発者のための設定ワークスペース',
    'idx.heroH': 'Excel からゲームエンジンまで、<br><span class="hl">ミスが少なく保守しやすい設定データへ</span>',
    'idx.sub': 'xlsx / xls / json / csv を取り込み、使い慣れた表で編集。フィールド型・参照・ルールをその場で確認し、JSON、Protobuf、C# などへ出力します。',
    'idx.demoCaption': '実際の製品画面 · 30 秒で全工程を確認',
    'idx.proofLabel': '検証できる一連の設定ワークフロー', 'idx.proofImport': 'xlsx / xls / json / csv を取り込み',
    'idx.proofEdit': '表と構造化データを編集', 'idx.proofValidate': '型・ルール・参照を検証', 'idx.proofExport': '開発向け形式に出力',
    'idx.workflowH': '一枚の表を、受け取りからエンジンまで', 'idx.workflowP': 'すべて実際の製品内で完結。元の構造を保ち、編集中に問題を見つけ、プロジェクトに合わせて出力します。',
    'idx.flow1t': '作り直さずにインポート', 'idx.flow1d': '既存の xlsx、xls、json、csv を直接取り込み、使い慣れた表で作業を続けられます。',
    'idx.flow2t': 'セルの中で構造まで編集', 'idx.flow2d': '表、タブ、JSON、CT 列タイプが連携し、複雑な設定を複数ツールに分散させません。',
    'idx.flow3t': 'リリース前に問題を止める', 'idx.flow3d': 'フィールド型、ルール、シート間参照を即時確認し、問題のデータへ戻れます。',
    'idx.flow4t': 'プロジェクトへエクスポート', 'idx.flow4d': 'JSON、Protobuf、C#、Bytes、MessagePack など必要な形式で出力します。',
    'idx.learnMore': 'コアワークフローを見る →', 'idx.openDocs': '対応ドキュメントを開く →',
    'idx.advancedTag': '高度な機能', 'idx.advancedH': '設定が複雑になっても、ツールが追いつく',
    'idx.referenceT': 'シート間参照を把握', 'idx.referenceD': '外部データソースと参照関係を可視化し、依存関係を特定します。',
    'idx.aiDemoCaption': '自然言語で実際のワークシートを操作', 'idx.ecoTag': '開発とエコシステム', 'idx.ecoH': '一枚の表からプロジェクト全体へ',
    'idx.ecoRef': '参照関係図：シート間依存を追跡', 'idx.ecoScript': 'スクリプトライブラリ：自動化を再利用',
    'idx.endP': 'Steam で無料体験し、必要になったら同じページから完全版を入手できます。',
    'feat.groupCore': 'コアワークフロー', 'feat.groupEngineering': '効率化と開発', 'feat.groupExtensions': '拡張機能',
    'feat.groupCoreH': '取り込み・編集・検証・出力を一つの流れで', 'feat.groupCoreP': '既存データから始め、一つのワークスペースで構造整理と問題検出を行い、ゲーム工程へ渡します。',
    'feat.groupEngineeringH': '反復処理をプロジェクトの力に', 'feat.groupEngineeringP': 'Python、バッチツール、スクリプトライブラリで大規模な設定作業に対応します。',
    'feat.groupExtensionsH': 'プロジェクト、チーム、任意の AI を接続', 'feat.groupExtensionsP': '参照図、バージョン管理、ワークショップ、AI Mod を必要に応じて追加します。',
    'feat.aiIntro': 'AI は任意の拡張機能で、既存の取り込み・編集・検証・出力フローは変わりません。',
    'proof.realLabel': '実際の操作を全編表示', 'proof.focusLabel': '重要部分を拡大 · 同じ実録映像から抜粋',
    'proof.realTitle': '実際の操作と結果を、はっきり確認', 'proof.realDesc': 'すべて最新の実録スクリプトによる映像です。情報量の多い部分には同じ映像から拡大画像を添えています。',
    'proof.exportPathTitle': '出力先の設定', 'proof.exportPathDesc': '形式ごとにプロジェクト内の指定先へ書き出し、受け渡し先を安定させます。',
    'proof.idTitle': 'ID を一括生成', 'proof.idDesc': 'ルールに従って連番 ID を生成し、確認済みの結果を表へ書き戻します。',
    'dl.ver': 'Windows デスクトップ版', 'dl.trialTag': 'Steam 公式', 'dl.trialH': 'Steam 版（無料体験あり）',
    'dl.trialP': '同じ Steam ストアページで無料体験し、必要になったら完全版を入手できます。', 'dl.fullTag': '完全版', 'dl.fullH': 'Steam 版',
    'dl.fullP': '完全版が必要になったら Steam で確認・入手できます。'
  });

  Object.assign(DICT.ko, {
    'nav.menu': '메뉴', 'cta.download': '↓ Steam에서 무료 체험', 'cta.demo': '30초 데모 보기',
    'idx.title': 'ConfigNexus · Excel에서 게임 엔진까지',
    'idx.desc': 'xlsx, xls, json, csv를 가져와 익숙한 표에서 편집하고 유형·참조·규칙을 검증한 뒤 개발용 형식으로 내보냅니다.',
    'idx.eyebrow': '게임 기획자와 개발자를 위한 설정 작업 공간',
    'idx.heroH': 'Excel에서 게임 엔진까지,<br><span class="hl">실수는 줄이고 유지보수는 쉽게</span>',
    'idx.sub': 'xlsx / xls / json / csv를 가져와 익숙한 표에서 편집하세요. 필드 유형, 참조, 규칙을 즉시 검사하고 JSON, Protobuf, C# 등으로 내보냅니다.',
    'idx.demoCaption': '실제 제품 화면 · 30초로 전체 흐름 확인',
    'idx.proofLabel': '검증 가능한 하나의 설정 워크플로', 'idx.proofImport': 'xlsx / xls / json / csv 가져오기',
    'idx.proofEdit': '표 및 구조화 편집', 'idx.proofValidate': '유형·규칙·참조 검증', 'idx.proofExport': '개발 형식으로 내보내기',
    'idx.workflowH': '하나의 표를 전달받아 게임 엔진까지', 'idx.workflowP': '모든 단계가 실제 제품 안에서 진행됩니다. 원본 구조를 유지하고 편집 중 문제를 찾은 뒤 프로젝트에 맞게 내보냅니다.',
    'idx.flow1t': '데이터를 다시 만들지 않고 가져오기', 'idx.flow1d': '기존 xlsx, xls, json, csv를 바로 가져와 익숙한 표에서 계속 작업합니다.',
    'idx.flow2t': '셀 안에서 구조까지 편집', 'idx.flow2d': '표, 탭, JSON, CT 열 유형이 함께 작동해 복잡한 설정을 여러 도구로 나누지 않습니다.',
    'idx.flow3t': '출시 전에 문제 차단', 'idx.flow3d': '필드 유형, 규칙, 시트 간 참조를 즉시 검사하고 문제가 있는 데이터로 돌아갑니다.',
    'idx.flow4t': '프로젝트로 내보내기', 'idx.flow4d': 'JSON, Protobuf, C#, Bytes, MessagePack 등 프로젝트에 필요한 형식으로 출력합니다.',
    'idx.learnMore': '핵심 워크플로 보기 →', 'idx.openDocs': '관련 문서 열기 →',
    'idx.advancedTag': '고급 기능', 'idx.advancedH': '설정이 복잡해져도 도구가 따라갑니다',
    'idx.referenceT': '시트 간 참조 파악', 'idx.referenceD': '외부 데이터 소스와 참조 관계를 시각화해 의존성을 찾습니다.',
    'idx.aiDemoCaption': '자연어로 실제 워크시트 조작', 'idx.ecoTag': '개발과 생태계', 'idx.ecoH': '하나의 표에서 전체 프로젝트로',
    'idx.ecoRef': '참조 관계 그래프: 시트 간 의존성 추적', 'idx.ecoScript': '스크립트 라이브러리: 프로젝트 자동화 재사용',
    'idx.endP': 'Steam에서 무료로 체험하고 필요할 때 같은 페이지에서 정식 버전을 받을 수 있습니다.',
    'feat.groupCore': '핵심 워크플로', 'feat.groupEngineering': '효율 및 개발', 'feat.groupExtensions': '확장 기능',
    'feat.groupCoreH': '가져오기·편집·검증·내보내기를 한 흐름으로', 'feat.groupCoreP': '기존 데이터에서 시작해 한 작업 공간에서 구조를 정리하고 문제를 찾은 뒤 게임 프로젝트로 전달합니다.',
    'feat.groupEngineeringH': '반복 작업을 프로젝트 역량으로', 'feat.groupEngineeringP': 'Python, 일괄 도구, 스크립트 라이브러리로 대규모 설정 작업을 처리합니다.',
    'feat.groupExtensionsH': '프로젝트, 팀, 선택형 AI 연결', 'feat.groupExtensionsP': '참조 그래프, 버전 관리, 창작마당, AI Mod를 필요에 따라 추가합니다.',
    'feat.aiIntro': 'AI는 선택형 확장 기능이며 기존 가져오기·편집·검증·내보내기 흐름을 바꾸지 않습니다.',
    'proof.realLabel': '실제 작업 전체 과정', 'proof.focusLabel': '핵심 영역 확대 · 동일한 실제 녹화에서 발췌',
    'proof.realTitle': '실제 작업과 결과를 선명하게 확인', 'proof.realDesc': '모든 영상은 최신 실제 녹화 스크립트에서 나왔으며 정보가 많은 영역은 같은 영상의 확대 화면을 함께 제공합니다.',
    'proof.exportPathTitle': '내보내기 경로 설정', 'proof.exportPathDesc': '형식별 파일을 프로젝트의 지정 폴더에 기록해 전달 경로를 안정적으로 유지합니다.',
    'proof.idTitle': 'ID 일괄 생성', 'proof.idDesc': '규칙에 따라 연속 ID를 생성하고 검증된 결과를 워크시트에 다시 기록합니다.',
    'dl.ver': 'Windows 데스크톱 앱', 'dl.trialTag': 'Steam 공식', 'dl.trialH': 'Steam 버전 (무료 체험판 포함)',
    'dl.trialP': '같은 Steam 상점 페이지에서 무료로 체험하고 필요할 때 정식 버전을 받을 수 있습니다.', 'dl.fullTag': '정식 버전', 'dl.fullH': 'Steam 버전',
    'dl.fullP': '정식 버전이 필요하면 Steam에서 확인하고 받을 수 있습니다.'
  });
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
