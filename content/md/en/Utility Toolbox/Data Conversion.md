# Data Conversion

Automatically calculate and convert complex multi-data cell content based on mapping table configuration.

createtab:Res/en/templates/数据转换演示.cnx

## Feature Overview

| Feature | Description |
|---------|-------------|
| Data Parsing & Grouping | Parse structured data arrays within cells into individual components |
| Mapping Table Association | Link fields to external mapping tables for value lookup |
| Expected Value Calculation | Compute weighted values using quantity and probability fields |
| Delimiter Detection | Automatically detect data separators within cell content |

> [!note]
> **How to open:** Right-click the column header of the multi-data column (the letter row at the top of the spreadsheet) → **Generate Content** → **Data Transformation**. The multi-data column must first be configured as a CT Multi-Data Editor (right-click column header → CT Properties).

> [!note]
> This section is being translated. Full step-by-step content will be aligned with the Chinese tutorial in a future update.

## How It Works

Adapts to CT multi-data editor data, performing calculations and conversions based on mapping table configuration.

## Use Case Example

Given a reward array: `[{1001,30,0.75},{1002,50,0.85}]`

Data structure: `{RewardID, Quantity, ObtainProbability}`

### Calculation Requirements

To calculate the specific value of this cell:

1. Look up the corresponding gold price in the `item` mapping table
2. Multiply the gold price by quantity and obtain probability
3. Sum all entries within `{}` to get the final reward value

### Calculation Formula

```
Total Value = Sigma (Gold Price x Quantity x Obtain Probability)
```

### Example Calculation

```
Item 1001: Gold Price = 10
  Value = 10 x 30 x 0.75 = 225

Item 1002: Gold Price = 8
  Value = 8 x 50 x 0.85 = 340

Total Value = 225 + 340 = 565
```

## Related Tutorials

- Import an external mapping table → [[External References]]
- Edit the multi-data format → [[Multi-Data Edit Mode]]
- Need more complex calculation logic → [[Python Script Editor]]
