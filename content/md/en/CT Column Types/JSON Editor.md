# JSON Editor

A reward config crammed into a cell looks like this: `{"items":[{"id":1001,"rate":0.5}],"gold":50}` — the cell is too narrow to see it all, miss one quote while editing by hand and the program crashes outright, and with deep nesting you can't even tell which level you're editing. That's what the JSON Editor is for: set a column to JSON type, double-click a cell, and a Monaco code view + tree view pops up. Edit the code on the left and the tree on the right syncs instantly; click a node on the right and the cursor follows on the left. When the format is invalid the Save button is grayed out, so broken JSON can never be written into the cell.

> [!tip]
> JSON (JavaScript Object Notation, a lightweight data-interchange format) suits nested structures — reward lists, item attributes, level parameters. For simple "object arrays where every entry has a fixed structure," the **Multi-Data Editor** is more intuitive (see [[Multi-Data Edit Mode]]).

createtab:Res/zh/templates/JSON编辑器演示.cnx

## How to Use

### Step 1: Set a Column to JSON Editor

Select any cell in the target column → **right-click** → **CT Attributes → Set as JSON Editor**. It applies to the whole column at once.

> [!note]
> CT Attributes (Column Type) tags "what kind of data this column holds" — set it once and it governs the whole column. In the demo project, the `drops` column (column D) is the one set up for the JSON Editor; right-click any cell in column D to configure it.

### Step 2: Double-Click a Data Cell to Open the Editor

In the JSON column, **double-click a cell in a data row**, and the Monaco + tree-view popup appears.

> [!warning]
> Only **data rows** open it on double-click. Double-clicking in the header area (the field-name / type / validation-rule rows) does nothing — just like the rich text editor, this is intentional, so you don't accidentally edit the header as if it were data.

### Step 3: Edit in the Dual View

On the left is the Monaco code view (the same editor as VS Code) — edit the JSON text directly; on the right, the tree view syncs automatically, expands level by level, and clicking a node jumps the cursor to the matching line.

![JSON Editor dual view](Res/zh/images/JSON编辑器双视图.png)

Common tree-view actions:

| Action | Effect |
|------|------|
| Click a node | Positions the left editor's cursor on that line |
| Double-click a node | Pops up a small window to edit just that value (numbers/strings/booleans get matching controls) |
| Right-click a node | Add child / Delete / **Copy Path** / Collapse All |
| Drag a node | Reorder array elements |

### Step 4: Confirm the Format and Save

The status bar at the bottom shows in real time whether the JSON is valid — if valid, it shows the node count and the deepest level; if there's an error, it shows the error line + a description. **When the format is invalid the Save button is grayed out**, and you must fix it before writing back to the cell.

> [!tip]
> Common small mistakes (trailing commas like `[1,2,]`, single quotes like `{'key':'val'}`) are **auto-repaired first** before opening; only when auto-repair fails does it report an error and pinpoint the problem line. In the demo project, line 7 (Elite Goblin) has a preset trailing comma so you can see the auto-repair in action; line 8 (Skeleton Soldier) is incomplete JSON so you'll see the error being pinpointed.

video:Res/zh/videos/JSON编辑器.webm|Double-click a JSON cell → edit in the Monaco + tree dual view → save back

## Value-Type Color Coding

Each value in the tree view is color-coded by type:

| Type | Color | Example |
|------|------|------|
| String | Purple | `"Loot drop"` |
| Number | Blue | `100` |
| Boolean | Orange | `true` |
| null | Gray | `null` |
| Array | Green | `[3]` (3 elements) |
| Object | Green | `{2}` (2 fields) |

Types are never changed unexpectedly during two-way sync — unless you manually edit the code area.

## JSON Editor vs. Multi-Data Editor

| Scenario | Which to use |
|------|--------|
| The cell holds a single JSON object / arbitrary nested structure | JSON Editor |
| The cell is an object array with a fixed structure per entry (e.g., a reward list) | Multi-Data Editor (schema-driven, with more intuitive column alignment) |
| Quick exploration / uncertain structure | JSON Editor (more flexible) |

## Notes

> [!tip]
> Right-click a tree node → **Copy Path** gives you a JSONPath like `rewards[0].count`, which you can drop straight into a Python formula `=json_get('rewards[0].count')` to read the value automatically.

> [!warning]
> When you stuff several MB of JSON into a cell, the editor may load slowly — that kind of large structure is better kept in an external `.json` file and brought in via **External References** (see [[External References]]).

> [!note]
> The setting "this column is a JSON Editor column" (a CT attribute) is column metadata, stored in the `.cnx`, and isn't exported as a field. Saving as `.cnx` keeps the column type; saving as `.xlsx` loses it. See [[cnx Project File]].

## What to Learn Next

- Visually edit object arrays (reward lists / item attributes) → [[Multi-Data Edit Mode]]
- Attach image / audio paths to cells → [[Resource Editor]]
- Export JSON content along to your engine → [[Data Export]]
- Where the column type is stored, and whether it survives reopening → [[cnx Project File]]
