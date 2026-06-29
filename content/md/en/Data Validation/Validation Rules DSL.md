# Validation Rules DSL

You don't know when an ID column has duplicate IDs, you don't know when an enum column holds a non-existent value, and you definitely don't know when a cross-table reference points at a deleted ID — until the program errors out after export, or the game crashes at runtime. That's what the Validation Rules DSL is for: write a short declaration in the header's validation row (such as `required`, `unique`, or `ref(item@id)`), and the whole column is pulled into real-time checking. Mistakes are highlighted in red immediately, instead of being discovered only at export time.

> [!tip]
> DSL (Domain-Specific Language) here is just a short "validation declaration string" — written in the header, concise, version-controllable, and copy-pasteable. It's not a graphical rule builder; it's literally those few characters.

createtab:Res/zh/templates/数据验证测试.cnx

## 8 Built-in Rules

| Rule | Syntax Example | Effect |
|------|----------|------|
| `required` | `required` | Required; empty cells turn red |
| `unique` | `unique` | Whole-column uniqueness, essential against duplicate IDs |
| `range(min, max)` | `range(1, 100)` | Value must be within the interval |
| `enum(a, b, c)` | `enum(DAILY, WEEKLY, MONTHLY)` | Only these values allowed (a hard-coded enum) |
| `enum_ref(table@column)` | `enum_ref(item@id)` | Valid values come dynamically from a column in another table |
| `len(min, max)` | `len(1, 50)` | String length limit |
| `regex(pattern)` | `regex(^[A-Z]+$)` | Regular-expression match |
| `ref(table@column)` | `ref(item@id)` | Cross-table referential integrity — the value must exist in the other table |

## Combining Rules: `&&`

Chain multiple rules with `&&`; they're checked left to right and all must pass to be valid:

```
required && range(0, 100)
```

Meaning: required first (empty turns red), then check 0–100 (out of range turns red).

```
required && unique && len(3, 20) && regex(^[a-z_]+$)
```

Meaning: required + unique across the whole table + length 3–20 + only lowercase letters and underscores — all four must pass to be valid.

## Four Most Common Examples

### Primary-Key ID Column

```
required && unique && range(1000, 99999)
```

Required, no duplicates, within the given range — copy this line and you're done.

### Enum-Type Column (Hard-Coded Values)

```
required && enum(DAILY, WEEKLY, MAIN, SIDE)
```

Only these four values are allowed; anything else turns red.

### Foreign-Key Column (References Another Table)

```
required && ref(item@id)
```

The ID entered must exist in the `id` column of the `item` table; foreign-key integrity is guaranteed automatically.

### Dynamic-Enum Column (Valid Values Come from Another Table)

```
enum_ref(condition_type@id)
```

Add a new row to the `condition_type` table and this column's set of valid values follows automatically — no need to maintain the enum list by hand.

## Where to Write Rules

The header's **validation row** (row 5 by default, with the row role `validation`). For any column that needs validation, write the matching rule string in that column's row 5 cell.

> [!tip]
> Not sure which row is the validation row? After importing the demo project, look at the color marking on row 5, or right-click the column header → CT Attributes → view the current validation rule.

## How Errors Are Shown

- **Real-time red highlight**: a cell that violates a rule turns red as you edit, no need to run validation first
- **Hover tooltip**: hover over a red cell and the tooltip shows exactly which rule was violated
- **Validation log**: menu → Validation Log lists all errors, and **clicking a row jumps straight to the matching cell**

## Pre-export Blocking

At export time (JSON / Protobuf, etc.) the system runs a full-table check again. **Errors block the export** (warnings do not):

- Blocking (error): violations of `required` / `unique` / `ref` / `enum_ref`
- Pass but warn (warning): violations of `range` / `len` / `regex`

> [!tip]
> Want to treat all rules as errors? Settings → Data Validation → turn off "Lenient mode".

## Parser Features

- **Bracket-aware**: `regex(\(a\|b\))` isn't mis-split by the outer `&&`
- **Whitespace-tolerant**: `required  &&  range( 0 , 100 )` is equivalent to `required&&range(0,100)`
- **Case-sensitive**: rule names are lowercase; parameters are kept as-is

## Notes

> [!warning]
> `ref` / `enum_ref` require the referenced table to already be open in the project. If the referenced table isn't in the project, you need to bring it in via **External References** (see [[External References]]).

> [!note]
> The graphical rule-builder described in the old "Data Validation" tutorial was the v0.0.1-era way; from v0.0.2 onward everything switched to DSL strings. Old configs are auto-converted to DSL on upgrade — no manual changes needed.

## What to Learn Next

- The full validation workflow (run validation, review results, fix errors) → [[Data Validation]]
- How to attach a cross-table reference source → [[External References]]
- Using validation together with export → [[Data Export]]
