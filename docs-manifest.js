/* ConfigNexus 官网文档清单（手建，唯一真源）。
   稳定 ID 决定侧栏顺序与深链；每条记录该篇目在四种语言里的真实 md key（无翻译则 null）。
   分类归属以中文版为准（其它语言把部分篇目放在不同分类，这里统一按中文结构呈现）。
   build-docs.mjs 会读取本文件做一致性校验（manifest 引用的文件必须存在；磁盘上的文件必须被引用）。
   旧的中文 hash 深链通过 docs.js 里的别名表（zh key -> 稳定 ID）继续可用。
   篇目显示标题 = 对应语言 md key 的 basename；缺该语言时回退中文 basename 并挂"暂无翻译"提示条。 */
window.DOC_CATS = {
  "cat-quickstart": { "zh": "快速开始", "en": "Quick Start", "ja": "クイックスタート", "ko": "빠른 시작" },
  "cat-table":  { "zh": "表格编辑体验", "en": "Table Editing Experience", "ja": "表編集体験", "ko": "표 편집 경험" },
  "cat-ct":     { "zh": "CT 列类型",   "en": "CT Column Types",          "ja": "CT列タイプ",   "ko": "CT 컬럼 유형" },
  "cat-valid":  { "zh": "数据验证",     "en": "Data Validation",          "ja": "データ検証",   "ko": "데이터 검증" },
  "cat-export": { "zh": "数据导出",     "en": "Data Export",              "ja": "データエクスポート", "ko": "데이터 내보내기" },
  "cat-py":     { "zh": "Python 集成",  "en": "Python Integration",       "ja": "Python統合",   "ko": "Python 통합" },
  "cat-util":   { "zh": "实用工具箱",   "en": "Utility Toolbox",          "ja": "ユーティリティ", "ko": "유틸리티" },
  "cat-ext":    { "zh": "扩展生态",     "en": "Extension Ecosystem",      "ja": "拡張エコシステム", "ko": "확장 생태계" }
};
window.DOC_MANIFEST = [
  { "id": "quick-first-lesson", "cat": "cat-quickstart", "dlc": false, "keys": { "zh": "快速开始/新手第一课", "en": "Quick Start/First Lesson", "ja": "クイックスタート/はじめてのレッスン", "ko": "빠른 시작/첫 수업" } },

  { "id": "table-xlsx",    "cat": "cat-table",  "dlc": false, "keys": { "zh": "表格编辑体验/xlsx文件", "en": "Table Editing Experience/Xlsx File", "ja": "表編集体験/Xlsxファイル", "ko": "표 편집 경험/Xlsx 파일" } },
  { "id": "table-xls",     "cat": "cat-table",  "dlc": false, "keys": { "zh": "表格编辑体验/xls文件",  "en": "Table Editing Experience/Xls File",  "ja": "表編集体験/Xlsファイル",  "ko": "표 편집 경험/Xls 파일" } },
  { "id": "table-json",    "cat": "cat-table",  "dlc": false, "keys": { "zh": "表格编辑体验/json文件", "en": "Table Editing Experience/JSON File", "ja": "表編集体験/JSONファイル", "ko": "표 편집 경험/JSON 파일" } },
  { "id": "table-csv",     "cat": "cat-table",  "dlc": false, "keys": { "zh": "表格编辑体验/csv文件",  "en": "Table Editing Experience/CSV File",  "ja": "表編集体験/CSVファイル",  "ko": "표 편집 경험/CSV 파일" } },
  { "id": "table-cnx",     "cat": "cat-table",  "dlc": false, "keys": { "zh": "表格编辑体验/cnx工程文件", "en": "Table Editing Experience/cnx Project File", "ja": "表編集体験/cnxプロジェクトファイル", "ko": "표 편집 경험/cnx 프로젝트 파일" } },
  { "id": "table-multitab","cat": "cat-table",  "dlc": false, "keys": { "zh": "表格编辑体验/多页签管理", "en": "Table Editing Experience/Multi-tab Management", "ja": "表編集体験/マルチタブ管理", "ko": "표 편집 경험/멀티 탭 관리" } },

  { "id": "ct-json",       "cat": "cat-ct",     "dlc": false, "keys": { "zh": "CT列类型/JSON编辑器", "en": "CT Column Types/JSON Editor", "ja": "CT列タイプ/JSONエディタ", "ko": "CT 컬럼 유형/JSON 편집기" } },
  { "id": "ct-richtext",   "cat": "cat-ct",     "dlc": false, "keys": { "zh": "CT列类型/富文本编辑", "en": "CT Column Types/Rich Text Edit Mode", "ja": "CT列タイプ/リッチテキスト編集", "ko": "CT 컬럼 유형/리치 텍스트 편집" } },
  { "id": "ct-multidata",  "cat": "cat-ct",     "dlc": false, "keys": { "zh": "CT列类型/多数据编辑", "en": "CT Column Types/Multi-Data Edit Mode", "ja": "CT列タイプ/マルチデータ編集モード", "ko": "CT 컬럼 유형/다중 데이터 편집 모드" } },
  { "id": "ct-date",       "cat": "cat-ct",     "dlc": false, "keys": { "zh": "CT列类型/日期编辑", "en": "CT Column Types/Date Editor", "ja": "CT列タイプ/日付エディタ", "ko": "CT 컬럼 유형/날짜 편집기" } },
  { "id": "ct-resource",   "cat": "cat-ct",     "dlc": false, "keys": { "zh": "CT列类型/资源编辑", "en": "CT Column Types/Resource Editor", "ja": "CT列タイプ/リソースエディタ", "ko": "CT 컬럼 유형/리소스 편집기" } },

  { "id": "valid-dsl",     "cat": "cat-valid",  "dlc": false, "keys": { "zh": "数据验证/验证规则DSL", "en": "Data Validation/Validation Rules DSL", "ja": "データ検証/検証ルールDSL", "ko": "데이터 검증/검증 규칙 DSL" } },
  { "id": "valid-check",   "cat": "cat-valid",  "dlc": false, "keys": { "zh": "数据验证/数据验证", "en": "Data Validation/Data Validation", "ja": "データ検証/データ検証", "ko": "데이터 검증/데이터 검증" } },

  { "id": "export-data",   "cat": "cat-export", "dlc": false, "keys": { "zh": "数据导出/数据导出", "en": "Data Export/Data Export", "ja": "データエクスポート/データエクスポート", "ko": "데이터 내보내기/데이터 내보내기" } },

  { "id": "py-script",     "cat": "cat-py",     "dlc": false, "keys": { "zh": "Python集成/Python脚本编辑器", "en": "Python Integration/Python Script Editor", "ja": "Python統合/Pythonスクリプトエディタ", "ko": "Python 통합/Python 스크립트 편집기" } },
  { "id": "py-formula",    "cat": "cat-py",     "dlc": false, "keys": { "zh": "Python集成/Python公式集成", "en": "Python Integration/Python Formula Integration", "ja": "Python統合/Python数式統合", "ko": "Python 통합/Python 수식 통합" } },
  { "id": "py-library",    "cat": "cat-py",     "dlc": false, "keys": { "zh": "Python集成/持久化脚本库", "en": "Python Integration/Persistent Script Library", "ja": "Python統合/永続スクリプトライブラリ", "ko": "Python 통합/영구 스크립트 라이브러리" } },

  { "id": "util-i18n-workflow",  "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/多语言工作流", "en": "Utility Toolbox/Multilingual Workflow", "ja": "ユーティリティ/多言語ワークフロー", "ko": "유틸리티/다국어 워크플로우" } },
  { "id": "util-i18n-extract",   "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/多语言字符提取", "en": "Utility Toolbox/Character Extraction", "ja": "ユーティリティ/多言語文字抽出", "ko": "유틸리티/다국어 문자 추출" } },
  { "id": "util-font-subset",    "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/字体子集化", "en": "Utility Toolbox/Font Subsetting", "ja": "ユーティリティ/フォントサブセット化", "ko": "유틸리티/폰트 서브셋" } },
  { "id": "util-batch-edit",     "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/批量编辑", "en": "Utility Toolbox/Batch Edit", "ja": "ユーティリティ/一括編集", "ko": "유틸리티/일괄 편집" } },
  { "id": "util-multidata-batch","cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/多数据批量修改", "en": "Utility Toolbox/Multi-Data Batch Modification", "ja": "ユーティリティ/マルチデータ一括修正", "ko": "유틸리티/다중 데이터 일괄 수정" } },
  { "id": "util-concat",         "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/数据拼接", "en": "Utility Toolbox/Data Concatenation", "ja": "ユーティリティ/データ連結", "ko": "유틸리티/데이터 연결" } },
  { "id": "util-convert",        "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/数据转换", "en": "Utility Toolbox/Data Conversion", "ja": "ユーティリティ/データ変換", "ko": "유틸리티/데이터 변환" } },
  { "id": "util-idgen",          "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/ID生成器", "en": "Utility Toolbox/ID Generator", "ja": "ユーティリティ/IDジェネレーター", "ko": "유틸리티/ID 생성기" } },
  { "id": "util-smartpaste",     "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/智能粘贴", "en": "Utility Toolbox/Smart Paste", "ja": "ユーティリティ/スマートペースト", "ko": "유틸리티/스마트 붙여넣기" } },
  { "id": "util-autosave",       "cat": "cat-util", "dlc": false, "keys": { "zh": "实用工具箱/自动保存", "en": "Utility Toolbox/Auto Save", "ja": "ユーティリティ/自動保存", "ko": "유틸리티/자동 저장" } },

  { "id": "ext-filebrowser","cat": "cat-ext", "dlc": false, "keys": { "zh": "扩展生态/文件浏览器", "en": "Extension Ecosystem/File Browser", "ja": "拡張エコシステム/ファイルブラウザ", "ko": "확장 생태계/파일 브라우저" } },
  { "id": "ext-extref",     "cat": "cat-ext", "dlc": false, "keys": { "zh": "扩展生态/外部引用源", "en": "Extension Ecosystem/External References", "ja": "拡張エコシステム/外部参照ソース", "ko": "확장 생태계/외부 참조 소스" } },
  { "id": "ext-refgraph",   "cat": "cat-ext", "dlc": false, "keys": { "zh": "扩展生态/引用关系图", "en": "Extension Ecosystem/Reference Graph", "ja": "拡張エコシステム/参照関係グラフ", "ko": "확장 생태계/참조 관계 그래프" } },
  { "id": "ext-workshop",   "cat": "cat-ext", "dlc": false, "keys": { "zh": "扩展生态/创意工坊", "en": "Extension Ecosystem/Steam Workshop", "ja": "拡張エコシステム/Steamワークショップ", "ko": "확장 생태계/Steam 워크샵" } },
  { "id": "ext-scm",        "cat": "cat-ext", "dlc": false, "keys": { "zh": "扩展生态/源代码管理", "en": "Extension Ecosystem/Source Control", "ja": "拡張エコシステム/ソース管理", "ko": "확장 생태계/소스 관리" } },
  { "id": "ext-diff",       "cat": "cat-ext", "dlc": true,  "keys": { "zh": "扩展生态/数据表对比", "en": "Extension Ecosystem/Table Diff", "ja": "拡張エコシステム/テーブル差分", "ko": "확장 생태계/테이블 비교" } }
];
