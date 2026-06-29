# External References

A designer needs to fill in item IDs in Table A, but the item master table lives in a different project — in the past you could only copy by hand from notes, or open two Excel files and eyeball them side by side. External References brings "another project's table" in, so this project's formulas / validation / autocomplete can query the other side's data directly, without manually maintaining the mapping.

Register files / folders from outside the project as "reference sources," so formulas / validation / autocomplete can look up tables across projects — for example, add another project's `talent.xlsx` and this project's `id` column can drop-down-select the IDs from the other side.

## Feature Overview

| Feature | Description |
|------|------|
| Multi-source support | Mount multiple files / folders as reference sources at once |
| Alias mechanism | Give each source a memorable display name, easy to tell apart in dropdowns |
| Conflict resolution | When multiple sources have same-named tables / columns, specify which takes priority in settings |
| Recursive scan | A folder source can be set to "scan one level" or "scan all subdirectories" |
| Incremental refresh | A single source can be refreshed on its own, without reloading everything |

## Adding a Reference Source

### Method 1: File Browser Right-Click

In the File Browser, right-click any file or folder → **🔗 Add as External Reference Source** → enter a display name → for a folder you'll be asked about the recursion mode.

### Method 2: Settings Page

Main window **Settings → External Reference Sources** → click **+ Add** → choose a file or folder.

## Alias vs. Display Name

| Concept | What it is | How to use |
|------|--------|--------|
| Display name | The label you give this reference source | Distinguishes sources in dropdowns |
| Alias | Each reference key discovered within the source | Called directly in formulas / CT columns |

Example: add `ProjectB/talent.xlsx` with the display name "Project B Talents." After scanning, the system registers the alias `talent` — so in this project `=lookup('talent', 'id', 1001)` can query the other side's data.

## Conflict Resolution

If two sources both register the alias `talent`:

1. Settings page → External Reference Sources → see the source with the ⚠ badge
2. Open the "conflict list"
3. For each conflicting alias, choose a priority source (or rename one of them)

Until the conflict is resolved, calling that alias uses the **most recently added** source (with a warning log).

## Refresh Mechanism

- Refresh a single source: click the 🔄 for that source on the settings page
- Refresh all: **🔄 Refresh All** at the top of the settings page
- After a source file is modified it **does not** re-scan automatically — you must refresh manually

> [!TIP]
> A reference source's scan results are cached locally in the project and persist across sessions. Adding a large folder for the first time (hundreds of xlsx files) may take a few seconds.

## Delete / Disable

- **Disable**: temporarily stop this source from participating in lookups, but keep its config (toggle on the settings page)
- **Delete**: remove it completely (after deletion, formulas that referenced this source can no longer find values)

## Formula Integration

In a cell, write:

```
=lookup('<alias>', '<column>', <primary key value>)
```

`<alias>` must be a registered reference-source alias; if there's an unresolved alias conflict, the function resolves by "most recently added" and logs a warning.

## Notes

> [!WARNING]
> External reference sources are **read-only** — data looked up through them can't be edited directly in this project. To change the other side's values, open that file.

> [!NOTE]
> Old projects' mapping configs are **migrated automatically** to external reference sources on upgrade — no manual redo needed. If the migration result looks wrong, you can re-import from the settings page → External Reference Sources → Advanced → "Re-import from old mapping".

## What to Learn Next

- Do "right-click → add as reference source" in one step in the File Browser → [[File Browser]]
- Visualize "which external tables this project references" → [[Reference Graph]]
- How a reference source's columns are used for dropdown selection / validation → [[Data Validation]]
