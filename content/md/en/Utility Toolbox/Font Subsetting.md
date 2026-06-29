# Font Subsetting

Your game is about to launch, and only now you find the Chinese font pack is 12MB and just loading the font stalls for several seconds — when your tables actually use only three thousand characters. Font subsetting deletes the "glyphs the font doesn't use" and keeps only the characters that actually appear in your project. Chinese fonts routinely run 10MB+; after subsetting they usually compress to a few hundred KB.

> [!tip]
> **Featured Store tool**. First use [[Character Extraction]] to get the project's character set, then come here to subset the font — two steps, least hassle.

## The Principle in One Sentence

A font file (ttf / otf) contains glyph data for every character. The game actually uses only the few thousand characters that appear in your tables. Subsetting **deletes** the glyphs for unused characters, yielding a smaller font file.

## Three-Step Flow

### Step 1: Extract Every Character the Project Uses

Main window menu → **Tools → Character Extraction**

- Choose the worksheets to scan (all by default)
- Choose the columns to scan (all text columns by default)
- Output: `charset.txt` — every unique character that appears in the project

See the tutorial [[Character Extraction]].

### Step 2: Subset the Font

Main window menu → **Tools → Font Subsetting**

- Choose the source font file (ttf / otf)
- Choose the character set (the `charset.txt` generated in Step 1)
- Output path (a version suffix is recommended, e.g., `font-v1.ttf`)

The system calls the built-in tool (based on fonttools) to subset the font.

### Step 3: Replace the Font in Your Game

Put the subsetted font into your game's resource directory and replace the original.

## Package-Size Reduction (Typical)

| Font | Original | After subsetting | Ratio |
|------|------|---------|--------|
| Source Han Sans Regular | 11.2 MB | 412 KB | -96% |
| Alibaba PuHuiTi | 9.8 MB | 380 KB | -96% |
| ZCOOL Happy (Chinese + some EN/JP) | 8.5 MB | 290 KB | -97% |

English fonts are small to begin with (a few hundred KB), so subsetting has little effect — this tool is mainly designed for CJK fonts.

## Multi-Font Batch

If your project uses several fonts (title font / body font / numeral font), you can process them in batch at once:

- Choose multiple source font files (Ctrl+click to multi-select)
- Share the same character set
- Output to one directory

## Character-Set Update Strategy

Ongoing iteration adds new text, so the font needs re-subsetting periodically:

- Automated: fold character extraction + font subsetting into your CI pipeline
- Manual: run it once before each release

> [!tip]
> Using a **superset** for the character set is safer than covering exactly what's needed — add the full ASCII set + common punctuation + digits to avoid missing characters. Characters that appear ad hoc in places like CHANGELOG / version numbers then won't turn into tofu boxes.

## Notes

> [!warning]
> **Don't distribute** the subsetted font to third parties — fonts are copyrighted, and subsetting is only for your own project. Whether subsetting a commercial font is legal depends on its license.

> [!note]
> Font subsetting uses fonttools (a Python toolchain), bundled into ConfigNexus — no separate installation needed.

## What to Learn Next

- First extract the project's character set → [[Character Extraction]]
- The complete workflow for consolidating multilingual text → [[Multilingual Workflow]]
