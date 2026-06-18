# Data Concatenation

Batch concatenate strings from multiple columns, suitable for generating multilingual key names and resource paths.

createtab:Res/zh/templates/数据拼接演示.cnx

## Feature Overview

| Feature | Description |
|---------|-------------|
| Multi-Column Concatenation | Combine data from multiple columns into a single string |
| Custom Delimiter | Specify any separator between concatenated values (e.g., `_`, `.`, `/`) |
| Format Template | Define output patterns using column placeholders |
| Result Preview | Preview concatenation results before applying |

## How to Use

1. Select the target column where results will be placed
2. Open the Data Concatenation tool
3. Choose source columns and configure the format template
4. Set the delimiter between values
5. Preview the result and click "Apply"

![](数据拼接.png)

## Use Cases

### Multilingual Key Names

```
Prefix: txt_item_
Column A (ID): 1001, 1002, 1003
Result: txt_item_1001, txt_item_1002, txt_item_1003
```

### Resource Path Generation

```
Template: res/icon/{Column A}_{Column B}.png
Result: res/icon/item_sword.png, res/icon/item_shield.png
```

### Composite Identifiers

```
Columns: Module + Type + ID
Delimiter: .
Result: game.weapon.1001, game.armor.2001
```
