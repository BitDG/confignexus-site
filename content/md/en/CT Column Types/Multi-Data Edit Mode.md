# Multi-Data Edit Mode

Manage complex multi-data configurations within a single cell, such as reward lists, attribute combinations, etc.

## How to Open

1. Select cell → Right-click menu → CT Attributes → Set as Multi-Data Editor
2. The column is now set as a multi-data editor
3. Except for the first three rows, double-clicking any cell will open the multi-data editor interface

video: Res/zh/videos/多数据编辑器打开.webm|Open Multi-Data Editor


## Setting Data

Example with reward data: `[{1001:100:30},{1002:200:60},{1003:300:90}]`

Format: RewardID:Quantity:Weight

### Operation Steps

1. First set the column as a multi-data editor
2. Double-click the cell to fill, opening the multi-data editor popup
3. Right-click on the corresponding column to set column properties, click + to create new columns

video:Res/zh/videos/多数据编辑器设置列.webm|Set Multi-Data Editor Columns

4. Fill in the corresponding data, click "New Row" to add row data

video:Res/zh/videos/多数据编辑器编辑数据.webm|Edit Multi-Data Editor Data

## Advanced Operations

> [!TIP]
> - Fields like `item` and `reward` can be set as **mapping tables** in the settings tab
> - After setting, double-clicking a cell will display the corresponding ID names, reducing selection errors
> - You can also quickly add corresponding ID configurations through buttons

## Related Tutorials

- A more flexible way to edit nested JSON → [[JSON Editor]]
- Attach images / audio to cells → [[Resource Editor]]
- Batch-edit many rows of multi-data columns → [[Multi-Data Batch Modification]]
- Export to your engine → [[Data Export]]
