timeline: v 1.0.2 - Data Validation Enhancements|2026-06-04
- **Rule humanization (F7)**: Hover a validated row to see a plain-language bubble explaining the rule
- **Live validation**: Cells are validated as you edit — no need to wait for export
- **Unique rule**: In-column duplicate checking
endtimeline

timeline: v 1.0.1 - Export Fill & Rule Completion|2026-06-04
- **Default value export fill**: Configured default values are auto-filled on export (JSON/CSV/CS/YAML/binary — all formats)
- **path rule completion (F7 wrap-up)**: Completion for path-type validation rules
endtimeline

timeline: v 0.0.3 - UX & Stability|2026-05-25
- **File browser width**: Default width raised from 25% to 31.25% of main window
- **Reference graph entry fix**: Clicking 🔍 / 🔗 in file browser now correctly opens the relationship graph tab
- **Git/SVN badge perf**: Switched from per-file `git/svn status` to per-repo snapshot cache (30s) + request coalescing — large repos no longer lag
- **IPC channel centralization**: 260 hardcoded strings in main process moved to a single constant table
- **Python legacy cleanup**: Removed HTTP/Flask remnants, lighter startup
- **Source control panel perf**: Pagination + skeleton screen + scope limit — works smoothly with 10000+ changes
endtimeline

timeline: v 0.0.2 - Feature Expansion Update|2026-05-02
- **Component Store**: Built-in component store with full upload pipeline (Agreement / Validation / Package / Upload services)
- **Reference Graph**: New cross-reference graph subsystem integrated with the file browser
- **Mapping Refactor**: Legacy mapping subsystem unified into the external-ref source design
- **File Browser**: Full rewrite with search box; fixed empty-open and cross-window sync issues
- **Python Formula Integration**: CodeMirror code editor, SmartCache, BatchExecutor, script library & docs modals
- **Export Capabilities**: CSV export, custom export formats, Protobuf / MessagePack / Bytes binary (JSONB)
- **Architecture Refactor**:
  - Main process split into 17 IPC handler modules + window-factory
  - Preload bridge consolidation; CDN dependencies replaced with local vendoring
- **Performance & Stability**:
  - Infinite-scroll spreadsheet, Luckysheet rendering optimizations
  - Fixed cross-tab Python scripts, window-follow jitter, and language switch issues
- **Data Validation**: Ongoing polish of CT attributes and validation rules
- **Welcome Page**: Added multilingual assets, demo videos and templates
endtimeline

timeline: v 0.0.1 - Early Access Release|2026-2-5
- **Multi-Format Support**: Import/export Excel (xlsx/xlsm/xls), JSON, CSV, and more
- **Rich Text Editing**: Notion-like rich text editing
- **Multi-Data Editing**:
  - In-cell multi-data configuration (reward lists, attribute combinations)
  - Batch editing and modification
  - Multiple data formats: CT format, simple arrays, irregular nesting
- **CT Attributes**:
  - Rich Text Editor
  - Multi-Data Editor
  - Date Editor
  - Resource Editor
- **Data Export**: Multi-format export with pre-export validation
- **Data Validation**:
  - ID uniqueness validation
  - Format validation
  - Numeric range validation
  - Non-empty validation
- **Multilingual Workflow**: Integration, deduplication export
- **ID Generator**: Auto-generate unique IDs
- **Data Concatenation**: Batch string concatenation for multilingual key names
- **Python Scripts**: Built-in Python script editor (Pro version)
endtimeline
