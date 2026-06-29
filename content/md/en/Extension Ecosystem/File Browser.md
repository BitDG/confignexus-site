# File Browser

As a project grows, config tables get scattered across a dozen folders — you find files from memory, you never know what breaks when you rename a file, and you can only check Git/SVN status by opening a terminal. The File Browser gathers all of this into one sidebar: a standalone window docked to the left of the main window, combining a file tree + version-control badges + a reference-graph entry, so you can manage your whole project directory without leaving the app.

A standalone file-tree window docked to the left of the main window, dedicated to managing config files across the whole project directory — create / rename / delete / drag into the main window to open, with integrated Git / SVN badges, reference graph, external references, and other extension capabilities.

## Feature Overview

| Feature | Description |
|------|------|
| File tree | Expands by folder hierarchy with lazy folder loading (scanned only when opened), staying smooth at tens of thousands of files |
| Multi-location switch | A top dropdown switches "working locations" (multiple project roots) |
| Search box | Type a keyword to filter file names in the tree in real time |
| Right-click menu | New file / folder, rename, delete, show in file manager, add as external reference source |
| Double-click to open in main window | Double-click a supported file (xlsx / json / cnx, etc.) to open it in the main window |
| Badge system | Shows Git/SVN status (M/A/D/U/C) next to file names, provided by the git-mod and svn-mod plugins |
| Reference-graph entry | In-row 🔍 for a single-file view, bottom-left 🔗 for the whole current folder |
| Extension slot | A vertical icon bar on the left (Git / SVN / Settings / Reference Graph), dynamically registered by plugins |

![File Browser - full view](Res/zh/images/文件浏览器-全貌.png)

## Opening the File Browser

Main window menu bar **View → File Browser**. The window docks to the left of the main window by default, at 31.25% of the main window's width, the same height as the main window, and follows it as it moves.

> [!TIP]
> The File Browser is a **standalone window** that talks to the main window via inter-process communication. Closing it doesn't affect tables already open in the main window; reopening it keeps your last browsing position.

## Switching Working Locations

The top dropdown lists all working locations configured under **Settings → File Browser Locations** (each location = one project root). Switching reloads the whole tree.

When no locations are configured, the File Browser uses "the project directory the main window last opened" as the root.

## File-Tree Operations

| Action | Description |
|------|------|
| Single-click a file | Highlights the selection (doesn't open) |
| Double-click a file | Opens it in the main window (supported formats only: xlsx / xlsm / xls / json / csv / cnx) |
| Single-click a folder | Expand / collapse |
| Click the 🔍 next to a file name | Opens that file's reference graph (supported formats only) |
| Right-click any node | Pops up a menu: New / Rename / Delete / Show in File Manager / Add as External Reference Source |

> [!NOTE]
> Delete goes through the **system recycle bin** and is recoverable. When renaming / moving, if the file is already open in the main window, you'll first be warned "this file is currently being edited."

## Search

Type a keyword in the top search box to **filter in real time** the file names currently visible in the tree (including path-fragment matches). Press ESC or click the ✕ on the right to clear.

Search only filters the expanded part; if you want to search the whole tree, expand all folders first.

## Badges (Git / SVN Status)

If the current location is inside a Git repository or SVN working copy, single-letter badges appear to the right of file names:

| Badge | Color | Meaning |
|------|------|------|
| M | Yellow | Modified |
| A | Green | Added |
| D | Red | Deleted |
| U / ? | Gray | Untracked |
| C | Red | Conflict |

Badges refresh every 30 seconds; they update immediately after actions like commit / revert / stage.

> [!TIP]
> Badges are provided by the **git-mod** / **svn-mod** plugins, which require `git` / `svn.exe` on the system PATH. If not installed, badges hide automatically without affecting other features.

## Reference-Graph Entry

- **In-row 🔍**: opens the single-file view of "who references this file / what this file references"
- **Bottom-left 🔗**: shows the whole association graph, scoped to the current root directory

Both entries open the tab in the main window and reuse a single instance (clicking again switches to the existing tab rather than opening several).

## Add as External Reference Source

Right-click any file or folder and choose **🔗 Add as External Reference Source**:

- Enter a display name (to distinguish sources in dropdown menus)
- For a folder you'll be asked "scan recursively?" ("Yes" = scan all subdirectories, "No" = first level only)
- On success it shows the number of aliases; if there are alias conflicts, resolve them under **Settings → External Reference Sources**

See the tutorial [[External References]].

## Extension Slot: The Left Vertical Icon Bar

The 44px-wide vertical icon strip on the left is dynamically registered by plugins:

| Icon | Source | Function |
|------|------|------|
| 🌿 | git-mod | Opens the Git source-control panel (commit / pull / push / stash / branch) |
| 🌐 | svn-mod | Opens the SVN source-control panel (commit / update / log) |
| 🔗 | Built-in | Reference graph for the current folder |
| ⚙️ | Built-in | File Browser settings |

Icon order and visibility are controlled by `contributesSettings.sidebar.order` in `plugins/<plugin>/manifest.json`.

## Notes

> [!WARNING]
> The File Browser's "Refresh" button **re-scans the root directory** — with many files there's a 1–2 second wait. You don't need to refresh manually in daily use; file changes are watched and reflected automatically.

> [!NOTE]
> The File Browser **doesn't consume the main window's memory**. It has its own renderer process and communicates with the main window via IPC.

## What to Learn Next

- See "who references this table / what it references" → [[Reference Graph]]
- Bring in another project's table so this project's formulas can look up data across tables → [[External References]]
- Put config tables under version control to check "who changed which value" → [[Source Control]]
- Compare differences between two versions cell by cell → [[Table Diff]]
