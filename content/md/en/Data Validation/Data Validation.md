# Data Validation

Ensure correctness and integrity of configuration data. Supports two layers: basic format validation and DSL rule validation.

createtab:Res/zh/templates/数据验证.cnx

Open the demo file to follow the workflow

## Validation Types Overview

### Basic Validation (Automatic)

| Type | Description | Example |
|------|------------|---------|
| Unique ID | Column A IDs must not repeat | A5=1, A6=1 → Error |
| Dictionary Format | `List<Dictionary>` must be `[{key:value}]` | `[{1:100}]` ✓, `{1:100}` ✗ |
| Array Format | `int[]`/`float[]`/`string[]` must be `[x,y]` | `[1,2,3]` ✓, `1,2,3` ✗ |

### DSL Rule Validation (Validation Row)

Write DSL rules in the **validation row** of the table structure:

| Rule | Syntax | Example |
|------|--------|---------|
| Required | `required` | Field cannot be empty |
| Range | `range(min,max)` | `range(0,100)` — value must be 0~100 |
| Enum | `enum(a,b,c)` | `enum(warrior,mage,archer)` — only these values |
| Length | `len(min,max)` | `len(1,50)` — string length 1~50 |
| Regex | `regex(pattern)` | `regex(^[A-Z]{3}_\d+$)` — pattern match |
| Unique | `unique` | Column values must not repeat |
| Cross-table Ref | `ref(table@column)` | `ref(ItemConfig@id)` — value must exist in another table |
| Enum Ref | `enum_ref(table@column)` | `enum_ref(TypeConfig@type)` — enum from another table |

#### Combining Rules

Multiple rules combined with `&&`, all must pass:

```
required&&range(1,999)          → required and between 1~999
required&&len(1,20)&&regex(^[a-z_]+$)  → required, length 1~20, lowercase + underscore only
```

#### List Element Validation

For `list<int>`, `list<string>` column types, rules automatically validate **each element**:

```
Column type: list<int>    Rule: range(1,100)
Value: [1,50,200]  → Element [2]: value 200 not in range [1, 100]
```

## How to Use

Click the "Data Validation" button in the menu bar. Results appear in the Validation tab of the Log Viewer.

## Validation Area

Validation area per sheet based on table structure:
- **Start Column**: Column A
- **Start Row**: Data start row (defined by table structure, default row 5)
- **End**: Last row and column with valid data
- **ID Termination**: Stops when Column A encounters an empty cell

## Workflow Demo

### Step 1: Configure Table Structure

Ensure correct row structure. Default 5-row header:

| Row | Role | Example |
|-----|------|---------|
| Row 1 | Field names | id, name, type, price |
| Row 2 | Display names | ID, Name, Type, Price |
| Row 3 | Data types | int, string, int, float |
| Row 4 | Description | Unique ID, Item name, Category, Buy price |
| Row 5 | Validation rules | required, required&&len(1,50), enum(1,2,3), range(0,9999) |
| Row 6+ | Data | 1, Iron Sword, 1, 100.5 |

### Step 2: Write Validation Rules

Fill DSL rules in the validation row:

```
Column A (id):     required
Column B (name):   required&&len(1,50)
Column C (type):   required&&enum(1,2,3)
Column D (price):  range(0,9999)
Column E (ref_id): ref(ItemConfig@id)
```

### Step 3: Execute Validation

video:Res/zh/videos/数据验证.webm|Data Validation

Click "Data Validation" and the system will:
1. Iterate through all worksheets
2. Read validation row rules from each sheet
3. Validate each data cell against its rules
4. Output errors to the Log Viewer

### Step 4: Review and Fix

Results appear in the "Validation" tab of the Log panel:
- Click an error entry to jump to the cell
- Error level: shows specific rule failure reason
- Fix suggestion: each error includes a solution

## Cross-Table Reference Validation

`ref()` and `enum_ref()` support cross-worksheet validation:

```
Scenario: Item table's type field references a type config table

Item table validation row Column C:  ref(TypeConfig@id)
  → System finds the worksheet named "TypeConfig"
  → Reads all values from its "id" column
  → Validates each value in the current column exists in that set
```

## Custom Rule Extension

Register custom validation functions via code:

```javascript
window.validator.config.customRules = [
  {
    validate: (value, cellConfig) => {
      if (cellConfig.type === 'int' && value % 2 !== 0) {
        return 'Only even numbers allowed';
      }
      return true;
    }
  }
];
```
