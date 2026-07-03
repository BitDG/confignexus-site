# cnx Project File

You save your project as xlsx every day, and every time you reopen it you have to re-set the CT column types, the validation rules are gone, and last time's Python formulas are nowhere to be found — that's because xlsx simply can't hold these configs. `.cnx` is ConfigNexus's **native project file**: it packs the table data, CT types, validation rules, cross-table references, and Python formulas into a single file, so **everything is still there when you close and reopen**.

Click the button below to import a demo project and see right away what a `.cnx` looks like when opened:

createtab:Res/en/templates/富文本编辑演示.cnx

## How It Differs from .xlsx

| Aspect | .xlsx | .cnx |
|------|-------|------|
| File size | Smaller for the same data | Larger (includes metadata) |
| Formulas | ✅ Excel formulas | ✅ Excel formulas + Python formulas |
| Styles | ✅ | ✅ |
| Merged cells | ✅ | ✅ |
| CT column types | ❌ Lost on import | ✅ Fully preserved |
| Cross-table references | ❌ | ✅ |
| External reference config | ❌ | ✅ |
| Rich text / JSON view state | ❌ | ✅ |
| Validation Rules DSL | ❌ Degraded to plain text on export | ✅ |
| Opens in Excel | ✅ | ❌ |

**In short**: use `.cnx` for long-lived projects, and `.xlsx` for collaborating externally or final delivery.

## When to Use cnx

- ✅ Day-to-day project files (the ones you and your teammates edit in ConfigNexus)
- ✅ Source files committed into Git version control
- ✅ Any scenario where you need to keep CT columns / validation rules / Python formulas

## When Not to Use cnx

- ❌ Showing it to programmers (they can't open it — export to json/xlsx first)
- ❌ Showing it to non-ConfigNexus users
- ❌ Quick sharing over email / IM (xlsx is more universal)

## Create a New cnx Project

Main window menu → **File → New cnx Project** → choose a save location → an empty `.cnx` is created automatically, containing one default sheet.

## Convert xlsx to cnx

Open the xlsx in the main window → menu → **File → Save As cnx** → choose a save location.

After conversion:

- All data is preserved
- Regular formulas are preserved
- Styles are preserved
- CT column types **need to be re-applied** (xlsx doesn't carry this info)
- Validation rules **need to be re-written**

## Convert cnx to xlsx (Export)

Main window menu → **File → Export → xlsx** → choose an output path.

What degrades:

- CT column types → degraded to plain string columns
- Python formulas → **not exported** (xlsx has no Python runtime)
- Validation Rules DSL → converted to xlsx "data validation" (simple rules convert; complex ones are lost)

## Double-Click Association

ConfigNexus registers a double-click association for `.cnx` — double-clicking a `.cnx` file in your file manager opens it directly in ConfigNexus.

## Internal File Structure

A `.cnx` is essentially a zip:

```
.cnx
├─ data.xlsx        ← table data (standard xlsx)
├─ ct-schema.json   ← CT column type config
├─ validation.json  ← validation rules
├─ refs.json        ← cross-table references / external sources
├─ formulas.py      ← registered Python formulas
└─ meta.json        ← project metadata
```

> [!TIP]
> Want to inspect a `.cnx`? Rename its extension to `.zip` and unzip it. The text parts are all JSON — readable and diff-friendly. That's exactly why cnx works well with Git version control: its internals are text and diff cleanly.

## Notes

> [!WARNING]
> Don't edit the xlsx inside a cnx with another tool — it breaks consistency with ct-schema/validation. To change the data, always open it in ConfigNexus.

> [!NOTE]
> There's no cnx **format version** compatibility headache — a cnx written by v0.0.3 opens fine in v0.0.5. The reverse (opening a newer cnx in an older version), however, may drop fields.
