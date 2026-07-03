# Smart Paste

Intelligently parse and convert clipboard content into structured spreadsheet data.

createtab:Res/en/templates/智能粘贴演示.cnx

## Feature Overview

| Feature | Description |
|---------|-------------|
| Markdown Table Conversion | Paste Markdown tables and automatically convert them into spreadsheet cells |
| JSON Array Conversion | Paste JSON arrays and map them to rows and columns |
| Confirmation Dialog | Preview the parsed result before applying to the spreadsheet |

## Supported Formats

### Markdown Tables

Paste a Markdown table like:

```markdown
| ID   | Name   | Price |
|------|--------|-------|
| 1001 | Sword  | 100   |
| 1002 | Shield | 150   |
```

ConfigNexus detects the Markdown table format and converts it into structured cell data automatically.

### JSON Arrays

Paste a JSON array like:

```json
[
  {"id": 1001, "name": "Sword", "price": 100},
  {"id": 1002, "name": "Shield", "price": 150}
]
```

The keys become column headers and each object becomes a data row.

## How to Use

1. Copy a Markdown table or JSON array to the clipboard
2. Select the target cell in the spreadsheet
3. Press `Ctrl+V` (or `Cmd+V` on macOS) to paste
4. A confirmation dialog appears showing the parsed preview
5. Click "Confirm" to apply, or "Cancel" to paste as plain text

## Notes

> [!TIP]
> - Smart Paste activates automatically when structured content is detected
> - If the clipboard content is plain text, normal paste behavior is used
> - The confirmation dialog allows you to verify the result before modifying cells

## Related Tutorials

- Bulk-load large Markdown / JSON into tables → [[Batch Edit]]
- Tidy up column formatting after pasting → [[Data Concatenation]]
- Validate required / unique fields after pasting → [[Data Validation]]
