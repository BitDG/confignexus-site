# ID Generator

Automatically generate unique IDs to avoid manual input duplicates or omissions.

createtab:Res/en/templates/ID生成器演示.cnx

## Feature Overview

| Feature | Description |
|---------|-------------|
| Format Templates | Define ID patterns using customizable templates (e.g., `ITEM_{0000}`) |
| Auto-Increment | Generate sequential IDs with configurable start value and step |
| Random / UUID | Generate random numeric IDs or standard UUID strings |
| Preset Management | Save and load frequently used ID generation presets |
| Batch Fill | Fill an entire column or selected range with generated IDs in one click |

## How to Use

1. Select the target cell or range
2. **Right-click the column header** (the letter row at the top of the spreadsheet, e.g., A, B, C) → **Generate Content** → **ID Generator**
3. Choose a generation mode (Auto-Increment, Random, or UUID)
4. Configure the format template and parameters
5. Click "Generate" to fill the selected cells

## Feature Demo

video:Res/en/videos/ID生成.webm|ID Generation

## Generation Modes

### Auto-Increment

Generate sequential IDs starting from a specified value:

```
Start: 1001, Step: 1
Result: 1001, 1002, 1003, 1004, ...
```

### Random

Generate random numeric IDs within a specified range:

```
Range: 10000 - 99999
Result: 38271, 91024, 55483, ...
```

### UUID

Generate standard UUID strings:

```
Result: 550e8400-e29b-41d4-a716-446655440000
```

## Preset Management

Save commonly used configurations as presets for quick access. Presets store the generation mode, format template, and all parameters.

## Related Tutorials

- Verify there are no duplicate IDs → [[Data Validation]]
- Build composite keys from IDs (e.g., `txt_item_1001`) → [[Data Concatenation]]
