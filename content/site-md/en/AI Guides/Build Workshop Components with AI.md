# Build Workshop Components with AI

## What This Solves

ConfigNexus provides a component-development skill package. Install it in an AI tool that supports skills, then ask the AI to create or modify Workshop components according to the existing project rules.

## What the Skill Package Contains

- Project structure and technology stack.
- Dependency and asset-loading rules.
- IPC communication and data formats.
- Field mapping and UI rules.
- Multilingual support.
- Development, testing, and delivery workflow.

## Steps

1. Find `skills/confignexus-component-dev` in the official website repository.
2. Run the skill installer, or copy the skill directory into your AI tool's skill directory.
3. Start a new AI session so the tool loads the skill.
4. Ask it to “build a ConfigNexus Workshop component” and describe the purpose, input, output, and interface.
5. Prefer modifying an existing example component.
6. Run and verify the component according to its instructions before deciding whether to publish it.

## Recommended Request

> Build a ConfigNexus component that reads the current selection, counts empty cells, and shows the result in a dialog. Reuse the existing component template, support Chinese and English, and add no dependencies.

> [!warning]
> AI-generated components can still contain errors or unsafe operations. Review dependencies, file access, network requests, and IPC permissions before installation.

> [!tip]
> Do not ask AI to rebuild the project from an empty folder. Reusing an existing Workshop example produces less code and is easier to verify in the real application.

## Next

- Browse and install components: [[Steam Workshop]]
- Read the skill guide: `skills/README.md` in the official website repository
