# Steam Workshop

Every new project means building templates from scratch — item tables, dialogue tables, task tables, rebuilt cell by cell; same with Python scripts, where a handy export script from the last project has to be rewritten for the next. The Steam Workshop packages these reusable "templates / scripts / presets" for sharing: one-click subscribe to mature community components in the built-in store inside ConfigNexus, or upload your own for others to use.

> [!IMPORTANT]
> The Workshop is available **only through the official Steam channel**. Non-Steam channels (cracked / portable / netdisk versions) will see the entry grayed out plus a top notice "Steam version only."

## Feature Overview

| Feature | Description |
|------|------|
| Browse community components | Search / sort / preview in the component store built into ConfigNexus |
| One-click subscribe | After subscribing, Steam auto-downloads and installs locally |
| Auto-update | When a Workshop component updates, subscribers are notified on next launch |
| Upload components | Your own components can be packaged and uploaded, with preview image, version number, and dependency description |
| Agreement signing | Before uploading you must sign the Steam Workshop legal agreement (one-time) |

## Opening the Component Store

Main window menu bar **Tools → Component Store**, or the entry on the Welcome / Settings page.

![Steam Workshop - component store](Res/zh/images/创意工坊-组件商店.png)

The store has two tabs:

- **Installed**: local components + subscribed Workshop components
- **Store**: all public components currently searchable on Steam (sorted by popularity by default)

## Subscribing to a Component

In the Store tab:

1. Search / browse to the component you want
2. Click **Subscribe**
3. Steam downloads in the background (without blocking the main UI)
4. Once downloaded, it appears automatically under "Installed" with its status turning green

## Unsubscribing

Find the component under the "Installed" tab → **Unsubscribe** → choose whether to also delete the local files.

> [!NOTE]
> Unsubscribing **deletes** the local copy by default. If you want to keep a local copy, back up the component directory manually outside ConfigNexus first.

## Uploading a Component

### Prerequisites

1. **The Steam client is running** and **the logged-in account owns ConfigNexus**
2. **First upload**: you must sign the Steam Workshop legal agreement (tick to confirm in the dialog)
3. **A Pro feature** (the free version can download and subscribe, but not upload)

### Upload Flow

1. **Tools → Component Store → Installed** tab, select the local component to upload
2. Click **Upload to Workshop**
3. Fill in the upload metadata: title / summary / tags / visibility (public / friends only / private) / preview image
4. Validation: the system validates the component structure + the validity of the metadata
5. Packaging: the component directory is zipped up and uploaded
6. Agreement signing: on the first time, the agreement pops up (accept it in the Steam client)
7. Wait for the upload to finish

### Subsequent Updates

When you upload the same component again (keeping the `metadata.json` in the directory unchanged), the system automatically recognizes it as an "update" rather than a "create," and you don't need to re-sign the agreement.

## Author Identity Verification

- A component can only be updated by its original author
- On upload, the system compares `metadata.authorSteamId` with the currently logged-in Steam ID
- On mismatch, the upload is rejected with "you can only upload components you created"

> [!TIP]
> On first upload, the system automatically sets `metadata.authorSteamId` to the current user. So the **first upload must be done by the author themselves**, otherwise you won't be able to change it afterward.

## Error Reference

| Error code | Meaning | Resolution |
|--------|------|------|
| E_STEAM_UNINITIALIZED | Steam not running or not logged in | Launch and log into the Steam client |
| E_STEAM_AGREEMENT_REQUIRED | Must sign the Workshop agreement first | Accept the agreement in the Steam client |
| E_AUTHOR_MISMATCH | The current account isn't the original author | Upload with the original author's account |
| E_COMPONENT_INVALID | The component structure is non-compliant | Check that `metadata.json` is complete and the preview image exists |
| E_UPLOAD_FAILED | Network / Steam server issue | Retry later |

## Notes

> [!WARNING]
> Components uploaded to the Workshop are **visible to anyone** (unless you chose "friends only" or "private"). Don't upload configs containing trade secrets / client data to the public Workshop.

> [!IMPORTANT]
> Violating the Steam Workshop legal agreement (plagiarizing others' work, illegal content, etc.) may get your Steam account banned. Confirm you hold the legal rights to the content before uploading.

## What to Learn Next

- How to use the table templates that come in a component → [[First Lesson]]
- How to run a downloaded Python-script component in the app → [[Python Script Editor]]
- Have your own component to upload? Get the directory structure straight before packaging.
