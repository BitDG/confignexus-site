# Source Control (Git / SVN)

A designer changed some item value, and in the afternoon a programmer asks "which lines did you change" — and you can only rely on memory or screenshot comparisons. Every team has lived through this inefficient back-and-forth. Putting config tables under Git / SVN is like giving them version history just like code: who changed which cell, when, and what it was before and after — it's all in a single log, so you never rely on memory again.

ConfigNexus has a built-in Git / SVN client panel — config tables are code too, and putting them under version control makes "who changed which value" clear and traceable. The panel hangs in the File Browser's left sidebar.

## Feature Overview

| Feature | Git | SVN |
|------|-----|-----|
| Change list | ✅ Staged / unstaged / untracked, three columns | ✅ A single change column (SVN has no staging concept) |
| Commit | ✅ | ✅ |
| Pull / Update | ✅ pull | ✅ update |
| Push | ✅ push | — (SVN commit goes straight to the server) |
| Revert | ✅ discard / revert | ✅ revert |
| Branch management | ✅ branches / checkout / create / delete / merge | — |
| Stash drafts | ✅ stash / stash pop | — |
| History view | ✅ log + diff | ✅ log + diff |
| File badges | ✅ M / A / D / U / C | ✅ M / A / D / ? / C |

## Prerequisites

- **Git**: the `git` command on the system PATH (installing [Git for Windows](https://git-scm.com/) does this by default)
- **SVN**: `svn.exe` on the system PATH (when installing TortoiseSVN, **tick the command line client tools** option to install it)

> [!NOTE]
> Not having them installed is fine — ConfigNexus self-checks at startup, and plugins for tools that aren't installed hide their icons automatically without affecting other features.

## Opening the Panel

The vertical icon bar on the left of the File Browser:

- 🌿 → Git source-control panel
- 🌐 → SVN source-control panel

![Source control - Git panel](Res/zh/images/源代码管理-Git面板.png)

## Badge System

Version-control status appears automatically next to file names in the File Browser:

| Badge | Meaning |
|------|------|
| M | Modified |
| A | Added |
| D | Deleted |
| U / ? | Untracked |
| C | Conflict |

Badges are cached for 30 seconds; they refresh immediately after a commit / revert action.

## Git Panel Operations

### Commit Flow

1. Look at the **Unstaged** area listing this round of changes
2. Single-click a file name to view the diff
3. Click the **+** to the right of the file name to stage it (moves it to the staged area)
4. Write a commit message in the box at the bottom
5. Click **Commit** → done

### Branch Management

The 🌿 chip next to the branch name at the top of the panel → pops up a branch popover:

- Lists all local / remote branches
- The current branch has a ⭐ in front
- Click another branch → switch (you'll be prompted first if there are uncommitted changes)
- **+ New Branch** enter a name → auto-checkout to the new branch

### Stash Drafts

When you don't want to commit but need to switch branches:

1. In the panel toolbar, click **Stash Current Changes**, enter a note → it's pushed onto the stash stack
2. Switch to another branch to work
3. Switch back to the original branch → click **Pop Latest Draft** in the toolbar → changes are restored

## SVN Panel Operations

### Commit Flow

1. Tick the files to commit in the change list
2. Enter a commit message at the bottom
3. Click **Commit** → sent straight to the SVN server (SVN has no local staging concept)

### Sync the Latest from the Server

Toolbar **⬇ Update** → pull the server's latest version to your local copy.

## Performance Optimization

From v0.0.3, Git / SVN badges and the change list use "whole-repo snapshot caching + request merging":

- The first open queries `git status` / `svn status` once
- Within 30 seconds, all files' badge queries hit the cache
- After commit / pull / revert actions the cache invalidates automatically

The effect: a directory with hundreds of files **no longer stutters** when opening the File Browser.

## Scope Limiting

The source-control panel lists changes for the **whole repository** by default. You can make it list only changes under the **current File Browser location**:

- Toggle the **Current Scope** chip at the top of the panel between "whole repo / current directory"
- Strongly recommended to switch to "current directory" for large config projects with many changed files

## Large Change Lists (10,000+ files)

For tens of thousands of changes, the panel auto-paginates:

- Each group shows only the first 200 entries
- The bottom has **Load More (+200)** / **Show All** buttons
- It won't cram 10,000 DOM nodes in at once and freeze the browser

## Table-Diff Integration

If the **Table Diff DLC** is installed:

- Click an `.xlsx` / `.cnx` file in the change list → a popup asks "diff by table or by text"
- Diff by table: compares the HEAD version against the working version, with cell-level highlighting
- Diff by text: a regular unified diff

See the tutorial [[Table Diff]].

## Notes

> [!WARNING]
> Reverting changes is **unrecoverable** — both `git checkout --` and `svn revert` restore files to the last committed state, and unsaved work is lost outright. The system pops a confirmation first, but make sure you really don't want these changes before clicking.

> [!TIP]
> Open a commit in the Git history → you see which files this commit changed + the diff of each file. To compare against the working area, use the **Compare with HEAD** tool (covered in the Table Diff page).

## What to Learn Next

- How to open the Git/SVN panel in the File Browser sidebar → [[File Browser]]
- Cell-by-cell diff of config tables (not just text diff) → [[Table Diff]]
- Reference relationships between files — scope the impact before changing → [[Reference Graph]]
