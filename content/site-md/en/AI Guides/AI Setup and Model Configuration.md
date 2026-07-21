# AI Setup and Model Configuration

## What This Solves

ConfigNexus connects to AI models through runtime plugins. Before using AI for the first time, install a plugin, connect its service, and select a model.

## Supported Connections

| Connection | Best For | Where Data Goes |
|---|---|---|
| Ollama | Running open-source models on your computer | Stays on your computer by default |
| LM Studio | Using a model already downloaded and loaded in LM Studio | Stays on your computer by default |
| Remote API | Using an online service compatible with the OpenAI protocol | Sent to that service provider |

## Steps

1. Open the Workshop and install the AI runtime plugin you need.
2. Follow the plugin instructions to start Ollama or LM Studio, or configure a remote API.
3. Restart ConfigNexus.
4. Right-click the desktop companion and open **Assistant Hub Settings**.
5. Open **Connection Settings**, then select **Refresh Plugins** and **Refresh All Models**.
6. Select the default model first. Then, if needed, select dedicated models for translation, rewriting, worksheet operations, field generation, formula generation, and chat.
7. Return to the main window and confirm that the assistant shows as connected.

## Privacy

Running locally does not mean every connection is offline. Ollama and LM Studio usually process content on your computer. A remote API sends the content needed for each request to its service provider. Before using a remote model with sensitive data, review the provider's data policy.

## Common Problems

> [!warning]
> Chat, global translation, worksheet operations, and the right-click AI menu are hidden until an AI runtime plugin is installed.

- No models found: make sure the service is running and a model is loaded, then refresh the model list.
- Cannot connect: check the service address, port, firewall, and API key.
- A task uses the wrong model: check whether that task has its own model selection.

## Next

- Start a chat: [[AI Chat and Table Generation]]
- Translate in bulk: [[AI Translation and Text Processing]]
- Edit a worksheet: [[Operate Worksheets with Natural Language]]
