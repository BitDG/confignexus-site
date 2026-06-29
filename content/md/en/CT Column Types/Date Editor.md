# Date Editor

Dedicated date selection and editing interface to avoid manual date format errors.

createtab:Res/zh/templates/日期编辑演示.cnx

## How to Open

1. Select a cell -> Right-click menu -> CT Attributes -> Set as Date Editor
2. The column is now configured as a date editor
3. Except for the first three rows of header data, double-clicking any cell in the column will open the date selection panel

video:Res/zh/videos/日期编辑器.webm|Date Editor

## Feature Overview

| Feature | Description |
|---------|-------------|
| Calendar Panel | Visual calendar interface for intuitive date picking with month/year navigation |
| Multiple Date Formats | Support for various output formats (YYYY-MM-DD, MM/DD/YYYY, Unix timestamp, etc.) |
| Quick Selection | Shortcut buttons for common dates like "Today", "Yesterday", "Start of Month" |
| Cell Editing | Seamless integration with the spreadsheet — selected dates are written directly to cells |

## Supported Formats

| Format | Example |
|--------|---------|
| `YYYY-MM-DD` | 2026-04-17 |
| `YYYY/MM/DD` | 2026/04/17 |
| `MM/DD/YYYY` | 04/17/2026 |
| `DD.MM.YYYY` | 17.04.2026 |
| Unix Timestamp | 1776556800 |

## Quick Selection Buttons

The calendar panel includes shortcut buttons for frequently used dates:

| Button | Action |
|--------|--------|
| Today | Select the current date |
| Yesterday | Select the previous day |
| Start of Month | Select the first day of the current month |
| End of Month | Select the last day of the current month |
| Clear | Remove the date value from the cell |

## Tips

> [!TIP]
> - The date format can be configured per column in CT Attributes
> - Quick selection buttons help avoid manual typing errors
> - The calendar panel highlights the currently selected date
> - Navigate between months using the arrow buttons in the calendar header

## Related Tutorials

- Attach image / audio paths to cells → [[Resource Editor]]
- Edit nested structures (reward lists, etc.) → [[Multi-Data Edit Mode]] [[JSON Editor]]
- How date columns are exported → [[Data Export]]
- Where the column type is stored → [[cnx Project File]]
