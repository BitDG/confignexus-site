# AI Translation and Text Processing

## What This Solves

AI can translate localization columns in bulk. It can also translate a selection, generate English field names, or refine text.

## Global Translation

1. Select the desktop companion, then choose **Smart Global Translation**.
2. Choose the source column and translation range.
3. Add one or more output columns.
4. Choose the target language for each output column.
5. Start translation and wait for the results to be written back.
6. Spot-check proper nouns, numbers, paths, and placeholders.

Global translation is useful for generating several language columns at once. For larger tasks, you can check progress or cancel unfinished work.

## Right-Click Actions for a Selection

After selecting cells, the right-click menu provides:

- **AI Translate**: translates the selection while preserving its rows and columns.
- **Generate English Field Names**: creates code-friendly English names from Chinese fields.
- **AI Rewrite**: rewrites text in the selected tone.

## Custom Output Rules

Open **Assistant Hub Settings → Existing Content** to configure translation prompts, global translation rules, English field naming, field-generation prompts, and rewriting tone.

Useful prompt rule:

> Preserve `{name}`, `{0}`, `%s`, numbers, HTML tags, and asset paths. Do not translate program identifiers.

> [!warning]
> Bulk translation writes changes back to the table. Save the project first, then check placeholders and proper nouns so translated text remains readable by the game.

## Next

- Refine rich text: [[Process Rich Text with AI]]
- Change task models: [[AI Setup and Model Configuration]]
