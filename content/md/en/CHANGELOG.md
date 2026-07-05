timeline: v 1.0.1 - Import Structure Confirmation and Validation Upgrade|2026-07-05
- **Import structure confirmation**: When importing Excel / CSV, ConfigNexus scans the first 10 rows so you can confirm field-name, display-name, type, description, validation, and data-start rows
- **Import structure adaptation**: After confirmation, imported data can be rearranged to match the current table schema
- **Unified validation rules**: Live validation and the Data Validation panel now use the same rule runner, so counts and locations stay consistent
- **Field-type auto validation**: Even without a fifth-row validation rule, int / float / bool / List / Dictionary columns are checked from their field types
- **Onboarding polish**: When live validation is disabled, the guide now sends users to Data Validation logs instead of marking the step complete too early
- **Welcome copy refresh**: Product positioning now focuses on a data-configuration workflow platform for game developers
endtimeline

timeline: v 1.0.0 - Steam Release|2026-06-29
- **Official release**: ConfigNexus is now available as a data-configuration workflow platform for game developers
- **Table import and project format**: Supports Excel / JSON / CSV / CNX project files while preserving field types, references, and project settings
- **CT column types**: Includes JSON, rich-text, multi-data, date, and resource editors
- **Validation and multi-format export**: Supports field types, validation-rule DSL, pre-export checks, and JSON / YAML / CSV / Protobuf / C# / Bytes / MessagePack export
- **Workflow tools and extension ecosystem**: Includes Python formulas/scripts, multilingual tools, batch editing, file browser, external references, Git / SVN, and Workshop entry points
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
