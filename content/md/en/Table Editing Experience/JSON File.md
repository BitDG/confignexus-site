# JSON File

Support for importing and exporting JSON object array format.

## Supported Object Arrays

### Standard JSON Array

```json
[
  {
    "id": 1,
    "name": "Item1",
    "type": "weapon",
    "price": 100
  },
  {
    "id": 2,
    "name": "Item2",
    "type": "armor",
    "price": 200
  }
]
```

## JSON Import

### Method 1: Menu Import

File → Import JSON → Select JSON file

video:Res/zh/videos/导入json.webm|Import JSON

### Method 2: Paste Import

Copied JSON content will be automatically recognized and imported when pasted

video:Res/zh/videos/复制gif.webm|Paste Import JSON

## Related Tutorials

- Store complex nested JSON objects in a cell → [[JSON Editor]]
- Visually batch-edit object-array data → [[Multi-Data Edit Mode]]
- Export to more engine formats (C# / Lua / MessagePack, etc.) → [[Data Export]]
- Add validation rules to imported data → [[Data Validation]]
- Keep CT config and styles when saving → [[cnx Project File]]
