# Resource Editor

Professional game resource management and editing features with visual preview capabilities.

createtab:Res/zh/templates/资源编辑演示.cnx

## How to Open

1. Select a cell -> Right-click menu -> CT Attributes -> Set as Resource Editor
2. Double-click the cell to open the resource selection interface

## Feature Overview

| Feature | Description |
|---------|-------------|
| Image Preview | Instantly preview image resources (PNG, JPG, WebP, etc.) in the editor |
| Audio Playback | Play audio files (MP3, WAV, OGG) directly within the resource panel |
| Folder Management | Browse, create, and organize resource folders from the editor |
| Search | Quickly find resources by name or path using the search bar |
| Rename | Rename resource files directly in the management panel |
| Delete | Remove unused resources with confirmation prompt |

## Feature Demo

video:Res/zh/videos/资源加载器.webm|Resource Editor

## Workflow

1. Set the target column to Resource Editor via CT Attributes
2. Double-click a cell to open the resource browser
3. Navigate folders or use search to find the desired resource
4. Click a resource to select it — a preview is shown automatically
5. Confirm selection to write the resource path into the cell

## Supported Resource Types

| Type | Extensions |
|------|-----------|
| Images | `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.gif` |
| Audio | `.mp3`, `.wav`, `.ogg`, `.flac` |
| Other | Any file type can be referenced by path |

> [!TIP]
> Set the resource root directory in project settings so that relative paths are generated automatically.
