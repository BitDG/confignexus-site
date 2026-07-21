# AI Chat and Table Generation

## What This Solves

The assistant can answer configuration questions, generate structured content, and create a new worksheet from a table in its response.

## Open Chat

1. Complete [[AI Setup and Model Configuration]].
2. Select the desktop companion to open the assistant.
3. Choose a chat model below the input box.

## Steps

### Step 1: Describe the Result

State the table's purpose, fields, row count, and constraints. For example:

> Generate an item configuration table with ID, name, type, rarity, price, and description. Create 10 test rows. IDs must start at 1001 and must not repeat.

### Step 2: Review the Response

Check field names, IDs, numeric ranges, enum values, and references. AI-generated content is a draft and should not be treated as final data.

### Step 3: Create a Worksheet

When the response contains a table, use the create button next to it to make a new worksheet. Continue editing it in the table editor.

## Manage Chats

- Create, rename, pin, or delete past chats.
- Save repeated instructions under **Saved Prompts**.
- Assign a trigger word to a prompt and call it from the input box shortcut menu.

> [!tip]
> Specific prompts produce more consistent results. Replace “fill this table” with the exact columns, row count, and rules you need.

## Next

- Edit the current table directly: [[Operate Worksheets with Natural Language]]
- Process localization columns: [[AI Translation and Text Processing]]
