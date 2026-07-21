# Connect External AI to ConfigNexus

## What This Solves

ConfigNexus supports MCP, a standard interface that lets external AI tools call application features. Once connected, tools such as Claude Code and Codex can ask ConfigNexus to perform real data operations.

## Available Operations

- Export configuration data.
- Run data validation.
- Import Excel files or convert data back to Excel.
- Compare directories, files, and cell differences.
- Preview and confirm writing data back.
- Read external references.
- Check the runtime environment.

## Connect a Tool

1. Right-click the desktop companion and open **Assistant Hub Settings**.
2. Open **Connection Settings**.
3. Find **AI Tool Connection (MCP)**.
4. Select **Copy AI Connection Configuration**.
5. Paste the configuration into the MCP settings of the external AI tool.
6. Restart or refresh the external AI tool.
7. Run an environment check first, then validate or export a small project.

## Recommended Safety Order

1. Read or inspect the environment first.
2. Run validation, export, or comparison next.
3. Preview any write-back operation.
4. Review the preview before confirming the write.

> [!warning]
> MCP gives external AI tools real operating capability. Never skip the write-back preview, and never approve bulk changes without checking the target path.

> [!note]
> Claude Code and Codex are examples of MCP clients. This does not mean their vendors' model APIs are built directly into ConfigNexus.
