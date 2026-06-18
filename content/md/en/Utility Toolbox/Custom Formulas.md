# Custom Formulas

Create, manage, and share user-defined formulas that extend the built-in spreadsheet functions.

createtab:Res/zh/templates/自定义公式演示.cnx

## Feature Overview

| Feature | Description |
|---------|-------------|
| Formula Registration | Register custom formulas with a name, description, and implementation |
| CRUD Operations | Create, read, update, and delete formulas through the management panel |
| Persistence | Formulas are saved to the project and persist across sessions |
| Import / Export | Share formulas between projects via JSON import and export |

## How to Use

### Creating a Formula

1. Open the Custom Formula Manager from the toolbar or menu
2. Click "New Formula"
3. Enter the formula name (e.g., `REWARD_VALUE`)
4. Write the formula implementation in the code editor
5. Add a description and parameter documentation
6. Click "Save"

### Using a Formula

Once registered, custom formulas can be used in cells just like built-in functions:

```
=REWARD_VALUE(A2, B2, C2)
```

## Import and Export

### Export

1. Open the Custom Formula Manager
2. Select formulas to export (or select all)
3. Click "Export" to save as a JSON file

### Import

1. Open the Custom Formula Manager
2. Click "Import" and select a JSON file
3. Review the imported formulas and confirm

## Notes

> [!NOTE]
> - Formula names must be unique within the project
> - Formulas are executed in a sandboxed Python environment
> - Changes take effect immediately after saving — no restart required
