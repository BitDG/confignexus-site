# Persistent Script Library

Rewriting that batch of scripts you tuned last time, every time you open a new project? Can't find the formula functions you wrote because they're scattered across projects? The Script Library exists for exactly this: scripts you've written in the script editor and formula functions you've registered are **stored once and reused permanently across projects**, so you never rewrite them.

## Opening the Script Library

Main window menu → **Tools → Script Library**

Or click the **Script Library** button at the top of the Python Script Editor.

## The Script Library Panel

What you see after opening is a script list grouped by category:

![Script Library panel](Res/zh/images/脚本库面板.png)

- **Grouping**: auto-grouped by "category" tags
- **Scope switch**: Global (usable in all projects) / current project only
- **Enable / disable**: a disabled function can't be called, but its config is kept
- **Search**: the top search box filters by script name / tag / description

## Script Metadata

Besides the code itself, each script has:

| Field | Required | Description |
|------|------|------|
| Name | ✅ | The formula call name, unique |
| Category tag | ❌ | Used for grouping (numeric calc / string processing / ...) |
| Description | ❌ | For hover tooltips / doc generation |
| Author | ❌ | Who wrote it |
| Version | ❌ | For team synchronization |
| Scope | ✅ | Global / current project |

## Cross-Project Synchronization

**Global** scripts are stored in `~/.configNexus/scripts/global/` and shared by all projects.

**Current-project** scripts are stored in `<project>/scripts/local/` and travel with the project (recommended for Git version control).

## Working with Steam Workshop

Scripts in the library can be **packaged into a component** and uploaded to the Steam Workshop:

1. Select the scripts to package
2. **Package as Component** → enter the component metadata
3. Upload to the Workshop

After someone subscribes, these scripts appear automatically in their own script library.

## Script Dependencies

Scripts can call one another:

```python
# Script A: a basic utility
def round_to(value, step):
    return round(value / step) * step

# Script B: calls A
from script_lib import round_to  # via the special import syntax

def calc_price(base, level):
    raw = base * (1 + level * 0.1)
    return round_to(raw, 0.1)
```

> [!NOTE]
> `from script_lib import xxx` is a ConfigNexus-specific import syntax — it imports other scripts from the script library. Plain Python `import` won't do this.

## Doc Generation

The **Generate Docs** button at the top-right of the panel → exports a Markdown file listing all scripts + descriptions + signatures. Good for:

- Team onboarding docs
- Showing programmers "what functions the design side can use"

## Security

Scripts run in a sandbox (see the tutorial [[Python Script Editor]]). The same restrictions apply in the script library:

- Can't `open()` files
- Can't `subprocess`
- Can't touch `os.environ`

If a script needs an exception (rare), request "elevation" in the script metadata, and a confirmation dialog pops up at startup.

## Notes

> [!WARNING]
> Deleting a script is **unrecoverable** — it also deletes the local file. Back up important scripts with Git first, or export before deleting.

> [!TIP]
> Naming suggestion: start with a verb, lowercase with underscores (`calc_exp` / `validate_id` / `gen_localized_key`). This reads most naturally when called as a cell formula.

## What to Learn Next

- How to write and run scripts → [[Python Script Editor]]
- Register a script as a cell formula → [[Python Formula Integration]]
- Package and share scripts with others → [[Steam Workshop]]
