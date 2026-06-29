# Table Diff

When you receive "final_final_v3_fixed.xlsx," the thing you dread most is comparing it against the copy in your hands — both tables are hundreds of rows, and you can only scan row by row with your eyes, or make do with Excel's VLOOKUP, taking forever and still missing things. Table Diff puts the two files together and tells you cell by cell which cell changed and to what, at character-level precision, staying smooth even at 5,000 rows.

Between two xlsx / cnx files, or two versions of the same file, **compare cell by cell** — which cell changed and to what, who added a row, who deleted a column, all at a glance.

> [!IMPORTANT]
> Table Diff is a **standalone DLC tool** that must be obtained separately on Steam. The entries described below only appear once the DLC is installed.

## Feature Overview

| Feature | Description |
|------|------|
| Character-level diff | Text within a cell is highlighted by character (not a whole-cell highlight) |
| Token-level diff | Numbers / JSON / arrays are split by token to avoid false positives |
| Three-step flow | Pick folders → see the diff file list → see the specific cell diff |
| Module A: popup | Single-file comparison, in popup form |
| Module B: standalone window | Cross-folder comparison, in a standalone window |
| Git / SVN integration | Directly compare "working version vs HEAD version" |

## Three Ways to Open

### Method 1: Menu → Table Diff

Main window menu bar **📊 Table Diff** → opens the standalone window (Module B), going through the full three-step flow:

1. **Step 1 Pick two folders**: left "current version," right "reference version"
2. **Step 2 Diff file list**: lists additions/deletions/changes among files under the two folders; click a row to expand
3. **Step 3 Cell-diff grid**: a sticky three-row header + top/bottom layering, viewing changes cell by cell

### Method 2: Git / SVN Source-Control Panel

Click an `.xlsx` / `.cnx` file in the change list of the source-control panel:

- With the Table Diff DLC installed → a popup asks "diff by table or by text"
- Choose table diff → working version vs HEAD version, with cell-level highlighting
- Choose text diff → a regular unified diff

### Method 3: Branch ↔ Working Area Comparison

In the Git panel's "History" view, right-click a commit → **Diff with working area by table** → automatically exports the commit's version to a temp file and compares it against the working version.

## Diff Color Coding

| Color | Meaning |
|------|------|
| Green background | Added (not in the reference version, present in the current version) |
| Red background | Deleted (present in the reference version, not in the current version) |
| Yellow background | Modified |
| Character-level red / green | The substring replaced within the same cell |

## What Character-Level Diff Is

For example:

| Reference version | Current version | Highlight effect |
|---|---|---|
| `Attack 100` | `Attack 120` | "100" red, "120" green, "Attack " unchanged |
| `[1,2,3]` | `[1,2,4]` | "3" red, "4" green, the rest unchanged |
| `Reward: Gold` | `Reward: Diamond` | "Gold" red, "Diamond" green |

It's implemented with LCS (Longest Common Subsequence) + token splitting. The algorithm lives in `cell-diff-render.js`, covered by vitest.

![Table diff - cell diff](Res/zh/images/数据表对比-单元格diff.png)

## The Three-Step Flow's Pages

### Step 1 Pick Folders

Pick one folder on each side ("current / reference" semantics are up to you; swapping them just inverts the result). You can tick "scan subdirectories recursively."

### Step 2 Diff File List

Lists all differing files:

- Added (green +): not in the reference version, present in the current
- Deleted (red -): present in the reference version, not in the current
- Changed (yellow ~): present on both sides but with different content
- Files with the same name and same hash aren't shown

Click a row to expand / collapse, click a file name to enter Step 3.

### Step 3 Cell-Diff Grid

- A three-row sticky header (sheet name / column name / header)
- Row height auto-fits the content
- "Reference / current" shown in top/bottom layers
- The two sides' content for the same row and column shown side by side

## Performance

Character-level diff is computed **only when a cell is opened** (lazy computation). A whole table of 5,000+ rows stays smooth.

## Notes

> [!NOTE]
> The Table Diff DLC is a paid DLC. When not purchased, the "diff by table" entries in the menu and in Git / SVN don't appear, and the corresponding IPC doesn't respond — but **plain text diff** is unaffected (a built-in Git / SVN feature).

> [!TIP]
> It's a different feature from the "Reference Graph": the reference graph shows "who references whom," while Table Diff shows "which cell changed to what."

## What to Learn Next

- Trigger a table diff directly from the Git/SVN change list → [[Source Control]]
- Scope the impact before changing (which tables reference this one) → [[Reference Graph]]
- Put config tables under version control so every change has a traceable record → [[Source Control]]
