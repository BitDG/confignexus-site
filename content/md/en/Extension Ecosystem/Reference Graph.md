# Reference Graph

You changed a table's ID column and have no idea which tables in the project reference it — opening each one to check by hand takes tens of minutes and is easy to miss. The Reference Graph draws all the dependencies between tables in the project as a single picture: at a glance you see "who references this table, and what tables it depends on," so you can scope the impact before making a change and act with confidence.

Visually shows the graph of "which table is referenced by whom / what it references" in the current project — used to figure out "after I change an ID, which tables are affected" and "how many tables use this reward config."

![Reference graph: the dependencies between tables drawn as a node graph, with edges showing references](Res/zh/images/引用关系图-整图.png)

## Feature Overview

| Feature | Description |
|------|------|
| Single-file view | Centered on one file, showing direct / indirect references |
| Whole-directory view | Scoped to the current root, showing the entire association graph |
| Node jump | Click a node to open the corresponding table in the main window |
| Single-instance tab | Switching folders reuses the same tab, so you don't spawn a pile of graphs |

## How to Open

### Method 1: In-Row 🔍 (Single-File View)

In the File Browser, hover over any supported file (xlsx / json / cnx) and a 🔍 icon appears on the right. Click it → opens "this file's reference graph" tab.

### Method 2: Bottom-Left 🔗 (Whole-Directory View)

The 🔗 icon at the bottom-left of the File Browser → scoped to the current location (rootPath), lists the references among all files under that folder.

## How to Read the Graph

- **Arrow direction**: A → B means A references B
- **Node color**:
  - Blue: the currently focused file
  - Green: referenced by the focused file
  - Orange: references the focused file
- **Node size**: the more often referenced, the larger the node

## Node Operations

| Action | Effect |
|------|------|
| Single-click a node | Opens that file in a main-window tab |
| Double-click a node | Switches the graph's focus to this node (re-centers on it) |
| Drag a node | Adjusts the layout to see the structure more clearly |
| Scroll wheel | Zooms the whole graph |
| Drag empty space | Pans the view |

## Single-Instance Tab

No matter how many times you click 🔍 / 🔗, the main window has only **one** "🔗 Reference · xxx" tab. Each click updates its content and switches to it, rather than spawning several.

## Data Sources

The reference graph scans:

- **In-project**: all xlsx / json / cnx files that have been opened / live under the project root
- **External reference sources**: all the sources you've mounted in settings (see the tutorial [[External References]])

> [!TIP]
> The data is **scanned asynchronously** — a large project may take 1–2 seconds the first time the graph opens. The result is cached until the next manual refresh.

## Notes

> [!WARNING]
> Reference relationships are computed from **explicit lookup / foreign-key configs**. If your references are written inside Python scripts, or scattered in rich text, the graph can't detect them.

## What to Learn Next

- How to open the reference graph entry from the File Browser → [[File Browser]]
- Bring in other projects' tables so the graph can also show cross-project references → [[External References]]
- Compare differences between two versions cell by cell → [[Table Diff]]

> [!NOTE]
> If clicking 🔍 / 🔗 **does nothing**, first confirm the file is a supported format (xlsx / json / cnx) and that the File Browser has a working location selected. If it still doesn't respond, close and reopen the File Browser to recover.
