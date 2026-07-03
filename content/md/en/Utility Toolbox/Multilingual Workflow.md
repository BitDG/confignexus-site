# Multilingual Workflow

Complete multilingual support workflow for games and applications, including text integration and deduplication export.

## Overview

This workflow is based on worksheets within a single tab. Multilingual columns in other worksheets need to be set to `txt_XXX` format to be included in the multilingual system.

createtab:Res/en/templates/工作流演示.cnx

Open the demo file to follow the process

## Workflow

### Step 1: Set Up Pet Menu

In the settings tab, add the following two options to the pet menu's `language`:
- Integrate Multilingual
- Multilingual Deduplication Export

### Step 2: Integrate Multilingual

Right-click on the pet, open the corresponding menu, and select "Integrate Multilingual".

video:Res/en/videos/整合多语言.webm|Integrate Multilingual

### Step 3: Deduplication Export

Export deduplicated txt files and the corresponding character set.

video:Res/en/videos/中文去重导出字体.webm|Deduplication Font Export

## Related Tutorials

- Feed the character set into the font tool to shrink font packs → [[Font Subsetting]]
- Just extract the charset without integrating → [[Character Extraction]]
- How to save and manage project files → [[cnx Project File]]
