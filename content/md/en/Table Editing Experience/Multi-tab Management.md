# Multi-tab Management

You're halfway through editing Table A, need to check a value in Table B, open Table B — and Table A's selection and cursor position are gone. Multi-tab management solves exactly this: the main window **opens multiple tables at once**, one tab each, and they each keep their editing state as you switch back and forth, never interfering with one another.

## Tab Types

| Type | Icon | Meaning |
|------|------|------|
| Regular worksheet | 📊 | A sheet from an xlsx / cnx file |
| Welcome page | 🏠 | The home page (where this page lives) |
| Settings | ⚙️ | The settings center |
| Reference Graph | 🔗 | Single-instance reuse, see [[Reference Graph]] |

![Multi-tab management - tab bar](Res/zh/images/多页签管理-页签栏.png)

## Opening a New Tab

| Action | Description |
|------|------|
| Double-click a file in the File Browser | Opens in a new tab |
| Menu File → Open | Choose a file → new tab |
| Menu File → New | Blank worksheet → new tab |
| Drag a file onto the main window | Auto-opens as a new tab |
| Click the **+** at the far right of the tab bar | Creates a blank worksheet |
| Welcome page → Settings | Single-instance settings page |

## Tab Right-Click Menu

Right-click a tab:

- **Close** — close this one
- **Close Others** — keep this one, close all others
- **Close All to the Right** — close every tab to the right of this one
- **Copy Path** — copy the source file's path to the clipboard
- **Show in File Manager** — jump to the folder containing that file

## Performance Optimization (Important)

ConfigNexus doesn't fully render every tab the moment it opens — only the currently active tab **actually renders** a Luckysheet instance. When you switch to another tab:

- The current tab's Luckysheet instance **keeps its state** (cursor position, selection, unsaved changes)
- It's hidden and uses no CPU
- It restores instantly when you switch back

The effect: opening dozens of tabs grows memory linearly, but CPU isn't dragged down by dozens of hidden tabs.

## Pre-rendering Mechanism

So you don't have to wait the 1–2 seconds it takes to "create a Luckysheet instance" when switching tabs, the system **pre-renders** a hidden instance:

- On startup, if no table is open, a blank Luckysheet is silently rendered in the background
- When you click **+**, the pre-rendered instance is used directly → instant display
- Once used, the next one is prepared in the background

This is why "create a blank tab" appears almost instantly.

## Drag to Reorder

Tabs can be dragged to reorder — press and hold a tab header and drag it horizontally to the target position.

## Closing Unsaved Changes

Closing a tab with unsaved changes pops up a confirmation:

- **Save and Close**
- **Close Without Saving**
- **Cancel**

You can change the default behavior in settings (see [[Auto Save]]).

## Tab Count Limit

There's no hard limit in theory, but we recommend **no more than 20 open at once**. Too many crowd the tab bar (though it scrolls horizontally), and switching starts to feel sluggish.

## Notes

> [!TIP]
> Tab-switching shortcuts: **Ctrl+Tab** for the next tab / **Ctrl+Shift+Tab** for the previous. Handy for bouncing between two frequently used tables.

> [!NOTE]
> The Welcome page / Settings page / Reference Graph are all **single-instance** — opening them again switches to the existing tab rather than spawning a second one.
