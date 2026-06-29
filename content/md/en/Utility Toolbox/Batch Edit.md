# Batch Edit

Edit multiple multi-data cells simultaneously through a dedicated batch editing spreadsheet.

createtab:Res/zh/templates/批量编辑演示.cnx

## Feature Overview

| Feature | Description |
|---------|-------------|
| Multi-Data Column Detection | Automatically identifies columns configured as multi-data editors |
| Batch Editing Spreadsheet | Opens a dedicated table view to edit all multi-data entries at once |
| Right-Click Menu | Access batch edit from the context menu on any multi-data column |
| Value Collection | Aggregates all unique values from the selected column for quick reference |

## How to Use

1. Right-click on a column that is configured as a multi-data editor
2. Select "Batch Edit" from the context menu
3. A dedicated spreadsheet opens showing all multi-data entries in an expanded table view
4. Edit values directly in the batch editing table
5. Click "Apply" to write changes back to the original cells

## Feature Demo

video:Res/zh/videos/批量编辑.webm|Batch Edit

## Workflow

### Step 1: Identify Multi-Data Columns

Columns configured with the CT multi-data editor type are automatically detected and eligible for batch editing.

### Step 2: Open Batch Editor

Right-click the column header or any cell in the column, then select "Batch Edit" from the context menu.

### Step 3: Edit in Table View

The batch editor displays all multi-data entries in a flat table format. Each sub-field (e.g., RewardID, Quantity, Weight) gets its own column for easy editing.

### Step 4: Apply Changes

After editing, click "Apply" to write all changes back to the original multi-data cells.

## Notes

> [!TIP]
> - The batch editor respects mapping table associations, showing mapped names alongside raw IDs
> - Use the value collection feature to quickly see all distinct values in a column
> - Changes are only applied when you confirm — the original data remains unchanged until then

## Related Tutorials

- Edit a single multi-data cell → [[Multi-Data Edit Mode]]
- Apply arithmetic to plain numeric columns in bulk → [[Multi-Data Batch Modification]]
- Set a column to the multi-data type → [[Multi-Data Edit Mode]]
