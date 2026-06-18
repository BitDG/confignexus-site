# CSV File Support

Support for standard CSV format import and usage with advanced parsing capabilities.

createtab:Res/zh/templates/CSV导入演示.cnx

## CSV Import

Two import methods are supported:

### Method 1: Menu Import

File -> Import CSV -> Select a CSV format file for import.

video:Res/zh/videos/导入csv.webm|Import CSV

### Method 2: Drag and Drop Import

Drag and drop CSV format files directly into the ConfigNexus interface for import.

video:Res/zh/videos/拖拽csv.webm|Drag and Drop CSV

## Advanced Features

| Feature | Description |
|---------|-------------|
| Web Worker Async | CSV parsing runs in a background Web Worker thread, keeping the UI responsive even for large files |
| Auto Encoding Detection | Automatically detects file encoding (UTF-8, GBK, Shift-JIS, EUC-KR, etc.) for correct character display |
| Delimiter Detection | Automatically identifies the delimiter used in the file (comma, tab, semicolon, or pipe) |
| Drag and Drop Import | Simply drag files onto the application window to start the import process |

## Encoding Support

ConfigNexus automatically detects and handles the following encodings:

| Encoding | Common Usage |
|----------|-------------|
| UTF-8 | Universal standard, recommended |
| GBK / GB2312 | Chinese (Simplified) |
| Shift-JIS | Japanese |
| EUC-KR | Korean |
| Latin-1 | Western European |

## CSV Format Notes

> [!NOTE]
> CSV format only contains data content, not display formatting (such as fonts, colors, and other style information). If you need to preserve formatting, consider using the XLSX format instead.

> [!TIP]
> - Large CSV files are parsed asynchronously to avoid freezing the interface
> - The detected delimiter and encoding are shown in the import preview
> - You can override the auto-detected settings manually if needed
