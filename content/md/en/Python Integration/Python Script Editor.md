# Python Script Editor

> [!IMPORTANT]
> This is a ConfigNexus Pro feature, available after purchase on Steam.

ConfigNexus includes a powerful Python script execution environment, allowing developers to write and execute data processing logic directly within the workbench.

createtab:Res/zh/templates/Python脚本演示.cnx

## PY Editor

Write and execute Python code directly inside the workbench.

video:Res/zh/videos/py脚本生成.webm|Python Script

## PY Functions

Define custom functions for a VBA-like experience, or even better.

## Python API Reference

The following APIs are available for cell and range operations within scripts:

| API | Description |
|-----|-------------|
| `get_cell(row, col)` | Get the value of a single cell |
| `set_cell(row, col, value)` | Set the value of a single cell |
| `get_range(r1, c1, r2, c2)` | Get values from a rectangular range |
| `set_range(r1, c1, data)` | Set values for a rectangular range |

## Script Library

Saved scripts are stored in the built-in script library for quick access and reuse. You can organize, search, and share scripts across projects.

## Import Support

Scripts support standard Python `import` statements for built-in modules. Third-party packages available in the bundled environment can also be imported.

## Security Restrictions

> [!NOTE]
> For safety, scripts run in a sandboxed environment with the following restrictions:
> - No file system write access outside the project directory
> - No network access
> - Limited execution time to prevent infinite loops

## Related Tutorials

- Reuse a finished script next time → [[Persistent Script Library]]
- Call Python functions from cells like Excel formulas → [[Python Formula Integration]]
- Quickly modify an area without scripting → [[Batch Edit]]
