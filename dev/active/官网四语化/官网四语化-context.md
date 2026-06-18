# 官网四语化 · Context（AI 自用）

## 关键文件（边界）

读+改：
- `index.html` / `features.html` / `download.html` — 营销页：head 引入 i18n.js + 字体钩子；可翻译元素加 `data-i18n`；features 深链改稳定 ID。
- `docs.html` — head 引入 i18n.js + docs-manifest.js（在 docs-data.js / docs.js 之前）。
- `docs.js` — 侧栏 STRUCTURE 改读 manifest 稳定 ID；按 `window.CN_LANG` 渲染；缺翻译挂提示条；hash 安全解码 + 中文别名兼容；媒体路径按语言改写。
- `build-docs.mjs` — 扫四语真实目录生成 `window.DOCS={zh,en,ja,ko}`；复制 Res-{en,ja,ko}；读 manifest 做一致性校验。
- `site.css` — 加 `.i18n-pending` 隐藏样式、语言切换器样式、`.doc-fallback-note` 提示条样式。
- `intro.js` — MUSINGS/REVEAL 按语言取（仅文案，不改启用状态）。

新增：
- `i18n.js` — 语言检测（head）+ 切换器注入与营销字典渲染（DOM ready）+ 字体注入。含 `MARKETING_I18N[lang][key]`。
- `docs-manifest.js` — `window.DOC_MANIFEST`（稳定 ID 有序数组，每条带 cat + 各语言 md key 或 null）+ `window.DOC_CATS`（分类稳定键→各语言标题）。

不碰：CNAME / .nojekyll / README / site.js（卡片光斑）/ Markdown 解析核心逻辑（仅在 parse 入口按语言改写媒体前缀）。

## 数据事实（建 manifest 依据）

- zh 34 篇；en/ja/ko **各 20 篇且为同一子集**；缺失 14 篇（cnx工程文件、多页签管理、JSON编辑器、验证规则DSL、Python公式集成、持久化脚本库、多语言字符提取、字体子集化、文件浏览器、外部引用源、引用关系图、创意工坊、源代码管理、数据表对比）→ 这 14 篇在 en/ja/ko 走"中文回退 + 提示条"。
- **跨语言分类归属不一致**：zh 把「富文本编辑」放 CT列类型、「Python脚本编辑器」放 Python集成；en/ja/ko 却把这两篇放到「工具箱」。→ 官网 canonical 用 **zh 的分类归属**为准，manifest 显式记每语言的真实文件 key，无公式可自动推导。
- 文件名即标题（沿用软件做法）：篇目显示标题 = 该语言 md key 的 basename；缺失则用 zh basename + 提示条。
- 媒体：软件 `welcome/Res/{zh,en,ja,ko}`；站点已存在 `docs/Res-zh`，需复制 en/ja/ko。md 内引用形如 `Res/<lang>/...`，parse 改写为 `docs/Res-<lang>/...`。

### canonical 稳定 ID → 各语言 md key（manifest 蓝本）
分类顺序 = zh：cat-table / cat-ct / cat-valid / cat-export / cat-py / cat-util / cat-ext

| id | zh | en | ja | ko |
|---|---|---|---|---|
| table-xlsx | 表格编辑体验/xlsx文件 | Table Editing Experience/Xlsx File | 表編集体験/Xlsxファイル | 표 편집 경험/Xlsx 파일 |
| table-xls | 表格编辑体验/xls文件 | …/Xls File | …/Xlsファイル | …/Xls 파일 |
| table-json | 表格编辑体验/json文件 | …/JSON File | …/JSONファイル | …/JSON 파일 |
| table-csv | 表格编辑体验/csv文件 | …/CSV File | …/CSVファイル | …/CSV 파일 |
| table-cnx | 表格编辑体验/cnx工程文件 | null | null | null |
| table-multitab | 表格编辑体验/多页签管理 | null | null | null |
| ct-json | CT列类型/JSON编辑器 | null | null | null |
| ct-richtext | CT列类型/富文本编辑 | Utility Toolbox/Rich Text Edit Mode | ユーティリティ/リッチテキスト編集モード | 유틸리티/리치 텍스트 편집 모드 |
| ct-multidata | CT列类型/多数据编辑 | CT Column Types/Multi-Data Edit Mode | CT列タイプ/マルチデータ編集モード | CT 컬럼 유형/다중 데이터 편집 모드 |
| ct-date | CT列类型/日期编辑 | CT Column Types/Date Editor | CT列タイプ/日付エディタ | CT 컬럼 유형/날짜 편집기 |
| ct-resource | CT列类型/资源编辑 | CT Column Types/Resource Editor | CT列タイプ/リソースエディタ | CT 컬럼 유형/리소스 편집기 |
| valid-dsl | 数据验证/验证规则DSL | null | null | null |
| valid-check | 数据验证/数据验证 | Data Validation/Data Validation | データ検証/データ検証 | 데이터 검증/데이터 검증 |
| export-data | 数据导出/数据导出 | Data Export/Data Export | データエクスポート/データエクスポート | 데이터 내보내기/데이터 내보내기 |
| py-script | Python集成/Python脚本编辑器 | Utility Toolbox/Python Script Editor | ユーティリティ/Pythonスクリプトエディタ | 유틸리티/Python 스크립트 편집기 |
| py-formula | Python集成/Python公式集成 | null | null | null |
| py-library | Python集成/持久化脚本库 | null | null | null |
| util-i18n-workflow | 实用工具箱/多语言工作流 | Utility Toolbox/Multilingual Workflow | ユーティリティ/多言語ワークフロー | 유틸리티/다국어 워크플로우 |
| util-i18n-extract | 实用工具箱/多语言字符提取 | null | null | null |
| util-font-subset | 实用工具箱/字体子集化 | null | null | null |
| util-batch-edit | 实用工具箱/批量编辑 | Utility Toolbox/Batch Edit | ユーティリティ/一括編集 | 유틸리티/일괄 편집 |
| util-multidata-batch | 实用工具箱/多数据批量修改 | Utility Toolbox/Multi-Data Batch Modification | ユーティリティ/マルチデータ一括修正 | 유틸리티/다중 데이터 일괄 수정 |
| util-concat | 实用工具箱/数据拼接 | Utility Toolbox/Data Concatenation | ユーティリティ/データ連結 | 유틸리티/데이터 연결 |
| util-convert | 实用工具箱/数据转换 | Utility Toolbox/Data Conversion | ユーティリティ/データ変換 | 유틸리티/데이터 변환 |
| util-idgen | 实用工具箱/ID生成器 | Utility Toolbox/ID Generator | ユーティリティ/IDジェネレーター | 유틸리티/ID 생성기 |
| util-smartpaste | 实用工具箱/智能粘贴 | Utility Toolbox/Smart Paste | ユーティリティ/スマートペースト | 유틸리티/스마트 붙여넣기 |
| util-custom-formula | 实用工具箱/自定义公式 | Utility Toolbox/Custom Formulas | ユーティリティ/カスタム数式 | 유틸리티/사용자 정의 수식 |
| util-autosave | 实用工具箱/自动保存 | Utility Toolbox/Auto Save | ユーティリティ/自動保存 | 유틸리티/자동 저장 |
| ext-filebrowser | 扩展生态/文件浏览器 | null | null | null |
| ext-extref | 扩展生态/外部引用源 | null | null | null |
| ext-refgraph | 扩展生态/引用关系图 | null | null | null |
| ext-workshop | 扩展生态/创意工坊 | null | null | null |
| ext-scm | 扩展生态/源代码管理 | null | null | null |
| ext-diff | 扩展生态/数据表对比 (DLC) | null | null | null |

> features.html 旧深链对应：用 zh 中文 hash → 在 docs.js 里建「zh key → 稳定 ID」别名表兜底；新链接直接用稳定 ID。

## 决策记录

- **客户端 i18n、同 URL、reload 切换**：站点小 + 非程序员维护，最低维护成本。不做静态子目录（避免 4× HTML 维护，属过度设计）。SEO 取舍已在 plan 风险段告知大哥并获确认。
- **canonical 用 zh 分类归属**：跨语言分类不一致，强行对齐其它语言会让中文用户的结构变样；以 zh 为准最稳，其它语言文件按 manifest 显式映射。
- **缺翻译回退中文 + 提示条**（非静默混排）：满足大哥"菜单不空"诉求，又诚实标注。正文容器 `lang="zh-CN"`。
- **单一 docs-data.js 含四语**：en/ja/ko 是 20 篇子集，总量可接受；不拆分（拆分属优化，YAGNI）。
- **文件名即标题**：沿用软件做法，不另建标题字典，省一层维护。
- **manifest 手建但 build 校验**：跨分类映射无法自动推导，手建不可避免；build-docs 读 manifest 交叉校验防漏防错。
- 不做"资深工程师会嫌过度设计"的东西：无切换动画、无语言协商库、无 i18n 框架依赖、不抽象多余 helper。

## 依赖与约束

- 纯静态、无打包、file:// 也要能跑（故数据用 `window.X=` 而非 fetch JSON）。
- 操作日志规则：本站无后端、无日志系统，营销页/文档页为纯浏览展示（非 mutation）。语言切换属纯前端展示切换，**不触发数据变更**，按工作流日志豁免范围（纯样式/展示）处理，不强加日志。
- 类型检查：本项目为原生 JS，无 TS/构建类型检查；verify 以「`node build-docs.mjs` 跑通 + 浏览器实测」为准。
