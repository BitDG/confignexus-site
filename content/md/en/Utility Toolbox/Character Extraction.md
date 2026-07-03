# Character Extraction

Your game has thousands of lines of Chinese text that will ultimately be baked into the game's font — but a font file contains tens of thousands of glyphs, while you actually use only two or three thousand of them. This tool scans every column tagged with a multilingual format in the project, deduplicates the characters that appear into a single character set, and feeds it to the font-subsetting tool to shrink the font from 10MB+ down to a few hundred KB.

> [!tip]
> **Featured Store tool**: scan all multilingual text in the project → extract the **set of unique characters** → generate `charset.txt`. Used together with [[Font Subsetting]], it can shrink a game font to under 5% of its original size.

createtab:Res/en/templates/工作流演示.cnx

## What It's For

| Scenario | How to use |
|------|--------|
| Font subsetting | Use the character set generated here to subset a font with the font-subsetting tool |
| Character audit | See exactly how many unique characters the project uses |
| Character-compatibility check | Drop the character set into a font tool to see which fonts don't support them |

## How to Use

### Step 1: Open the Tool

Main window menu → **Tools → Character Extraction**

### Step 2: Configure the Scan Scope

| Option | Description |
|------|------|
| Scan scope | Current worksheet / all tables in the current project / custom |
| Scan columns | All columns / text-type columns only / custom |
| Include languages | Simplified Chinese / Traditional Chinese / EN / JP / KR / all |
| Character filter | Skip ASCII / skip digits / skip punctuation (optional) |
| Output path | Defaults to `<project>/charset.txt` |

### Step 3: Run and Review the Result

![Character extraction panel](Res/zh/images/多语言字符提取面板.png)

Click "**Extract**," and when it finishes the status bar shows the total character count. Example `charset.txt` content:

```
AttackDefenseCritRateTalentSkillHello World 你好こんにちは안녕하세요123456...
```

Each character takes one position, deduplicated, sorted by Unicode code point.

> [!tip]
> A game font typically contains 7,000–9,000 Chinese characters; extracting a few thousand is enough, and the subsetting compression ratio can exceed 95%.

## Common Uses

### Use 1: Pair with "Font Subsetting"

The most common use. After extracting the character set, send it straight to the [[Font Subsetting]] tool to subset the font — see that tutorial for details.

### Use 2: Detect "Weird Characters" in the Project

Sometimes copy-pasting by designers brings in **full-width spaces / invisible characters / emoji** — these make the game font show tofu boxes.

Run a character extraction and check `charset.txt` for:
- Full-width spaces `　`
- Zero-width spaces
- Control characters
- Emoji (if you don't plan to support them)

When found, batch-clean them with "Find & Replace".

### Use 3: Incremental Extraction

Run it once before each release and diff against the previous version's character set to see which characters this version added — so you can decide whether to re-subset the font.

## Advanced

The output `charset.txt` is a **character allowlist** — you can give it to the font-subsetting tool, localization-check scripts, and artists doing display lettering (so artists only need to draw these characters) all at once.

> [!note]
> The scan also counts **formula results** in cells — for example, the "Player Zhang San" computed from `=CONCATENATE("Player", A1)` contributes those characters.

> [!note]
> If you want to "exclude" — e.g., exclude all Simplified Chinese to get only Traditional Chinese / English / Japanese characters — that isn't currently supported; you'd post-process `charset.txt` with a script after extraction.

## What to Learn Next

- Feed the character set into the font tool to shrink the font pack → [[Font Subsetting]]
- The complete workflow for consolidating and deduplicating multilingual text → [[Multilingual Workflow]]
