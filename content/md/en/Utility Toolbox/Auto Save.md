# Auto Save

Automatically save your work at regular intervals to prevent data loss.

## How It Works

Auto Save monitors your editing activity and saves the file when the following conditions are met:

| Condition | Detail |
|-----------|--------|
| Idle Detection | Triggers after 2 minutes of no editing activity |
| Minimum Interval | At least 1 minute must pass between consecutive saves |
| Original Format | Saves back to the original file format (`.xlsx`, `.xls`, `.cnx`, etc.) |
| Failure Notification | Displays a toast notification if the save operation fails |

## Save Behavior

1. **Idle timer starts** when you stop editing (typing, pasting, deleting, etc.)
2. After **2 minutes of inactivity**, Auto Save checks the minimum interval
3. If at least **1 minute** has passed since the last save, the file is saved
4. The save writes back to the **original file path** in its **original format**
5. If the save fails (e.g., file is locked or disk is full), a **failure notification** is shown

## Timing Diagram

```
Edit -> [2 min idle] -> Check interval -> Save -> [wait for next idle]
  ^                                                       |
  |_____________________Edit detected_____________________|
```

## Configuration

Auto Save is enabled by default. You can toggle it in:

**Settings -> General -> Auto Save**

## Notes

> [!TIP]
> - Auto Save does not create new files — it overwrites the current file in place
> - Manual save (`Ctrl+S` / `Cmd+S`) is always available regardless of Auto Save status
> - The idle timer resets each time you make an edit
> - Auto Save only activates when a file has been opened (not for unsaved new sheets)

> [!NOTE]
> If the original file has been moved or deleted, Auto Save will show an error notification prompting you to use "Save As" instead.

## Related Tutorials

- Save the file in an engine-readable format → [[Data Export]]
- See what the CNX format keeps that XLSX drops → [[cnx Project File]]
