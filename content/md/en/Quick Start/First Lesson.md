# 🚀 First Lesson

Opened ConfigNexus for the first time and faced a wall of buttons with no idea where to start? This page walks you **all the way through your first config table** — from launching the app to exporting data in a format your game engine can read directly. No coding required; just follow along and click.

> [!tip]
> This is the "big-picture roadmap." Every feature mentioned in each step has its own detailed tutorial — if you want to go deeper, find the matching page in the left sidebar (linked here as clickable references).

---

## What It's For

In one sentence: **ConfigNexus is a "super Excel" built for game config data**. You fill in tables just like Excel (numbers, text, items, dialogue…), it checks your data for mistakes, and finally exports — in one click — to formats Unity / Unreal / Godot / your own engine can read directly (JSON, C#, Lua, and more).

Designers fill tables, programmers read the data, artists wire up resources — all three share one project, instead of endlessly "emailing Excel files back and forth."

---

## Step 1: Get to Know the Interface

After launching, you'll see an Excel-like main window. Start with four areas:

| Location | What It Is |
|------|--------|
| Top menu bar | Four menus — **File / View / Tools / Help** — every feature's entry point lives here |
| Table area | The big grid in the middle, works just like Excel (values, filters, freezing, formulas) |
| Tab bar | Above the table; open multiple tables at once without them interfering (see [[Multi-tab Management]]) |
| Desktop pet (bottom-right) | A little animated assistant; click it to expand the AI chat and common tools |

> [!note]
> Just remember where each menu lives: **New / Open / Import / Export / Save** are under "File"; **Logs / File Browser** are under "View"; **Python Scripts / Script Library** are under "Tools"; **Tutorials / About** are under "Help".

---

## Step 2: Create Your First Table

There are four ways to start — pick one:

1. **Start from scratch**: menu **File → New Project** (or click ➕ on the tab bar) to get an empty table to fill in yourself.
2. **Import an existing Excel file**: menu **File → Import Excel**, choose your `.xlsx` / `.xls`, and the data comes in as-is (see [[Xlsx File]]).
3. **Import JSON / CSV**: menu **File → Import JSON** or **Import CSV** (see [[JSON File]] [[CSV File]]).
4. **Use a template**: menu **File → Templates**, pick a starter template and edit it.

> [!tip]
> For beginners, "Import Excel" to bring in one of your existing tables gives you the best feel for the tool.

---

## Step 3: Edit Your Data

Once inside a table, just fill it in like Excel. What ConfigNexus adds on top is **CT Column Types** — tell a column "what kind of data this column holds," and the editing experience instantly levels up:

- **Right-click a column header → Set Column Type**, then choose:
  - **Date**: double-click to pop up a date picker, no manual typing (see [[Date Editor]])
  - **Resource**: double-click to pick an image / audio file, with a thumbnail shown in the cell (see [[Resource Editor]])
  - **JSON**: edit complex nested structures with a code + tree view, not by hand-typing in the cell (see [[JSON Editor]])
  - **Multi-Data**: object arrays like `[{...},{...}]`, edited visually in bulk (see [[Multi-Data Edit Mode]])
  - **Rich Text**: WYSIWYG formatting like Notion (see [[Rich Text Edit Mode]])

> [!tip]
> Don't rush to configure CT types at first — plain text/numbers can just be typed in directly. When you hit pain points like "I keep getting the date format wrong" or "I can never remember image paths," come back and set the right CT type for that column.

---

## Step 4: Check for Mistakes in Your Data

Once the table is filled, give it a checkup before exporting — don't carry bad data into your game.

ConfigNexus uses a **Validation Rules DSL**: write a short rule in the header row (for example, a column being `required`, `unique` (no duplicates), or `range(1,100)` (values between 1 and 100)), and the app **highlights bad cells in red in real time**. Clicking an entry in the validation log jumps straight to the offending cell.

- For detailed syntax, read [[Data Validation]] and [[Validation Rules DSL]].
- The single most useful one for beginners: add `unique` to your "ID column" to instantly catch duplicate IDs.

---

## Step 5: Export for Your Engine

Once the data is clean, export in one click:

1. Menu **File → Export Data** to open the export panel.
2. Check the formats your engine needs (multiple allowed) — **10 total**:
   - Text: **JSON / YAML / CSV**
   - Code (with built-in loaders): **C# / TypeScript / Lua / C++**
   - Binary: **Bytes / MessagePack / Protobuf**
3. Choose an output folder for each format, then click Export.
4. We recommend ticking "Validate before export" so errors get caught.

> [!tip]
> Not sure which to pick? For Unity, choose **C# + JSON**; for Unreal, **C++ + JSON**; for web / small games, **TypeScript** or **JSON**. See [[Data Export]].

---

## Step 6: Save Your Project

Remember to save your work:

- Menu **File → Save Project**, or the shortcut `Ctrl+S`.
- We recommend saving as **`.cnx`** (ConfigNexus's native project file) — it **fully preserves** CT column types, cross-table references, Python formulas, and other things Excel can't store. Close and reopen, and everything is still there.

> [!warning]
> If you save as `.xlsx`, advanced info like CT types, cross-table references, and formulas are lost. Use `.cnx` for day-to-day work, and only export to the target format when handing off to someone else or archiving.

---

## You Made It — What to Learn Next

By now you can get real work done in ConfigNexus. To go further, pick what you need:

- **Edit large swaths of data in bulk** → [[Batch Edit]] [[Multi-Data Batch Modification]]
- **Process tables automatically with scripts** → [[Python Script Editor]] [[Python Formula Integration]]
- **Have tables reference each other** (Table A holds an ID, Table B shows the name) → [[External References]] [[Reference Graph]]
- **Go multilingual** (manage Chinese / English / Japanese / Korean text) → [[Multilingual Workflow]]
- **Install more features** (subscribe to Steam Workshop plugins) → [[Steam Workshop]]

> [!success]
> Config IS the game — change one cell, and the game's behavior changes. Get this main path running smoothly first, then learn the rest as you need it.
