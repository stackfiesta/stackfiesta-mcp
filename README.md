# StackFiesta MCP Server

[![NPM](https://img.shields.io/npm/v/%40stackfiesta%2Fmcp)](https://www.npmjs.com/package/@stackfiesta/mcp)
[![Smithery](https://img.shields.io/badge/Smithery-stackfiesta-blue)](https://smithery.ai/server/@stackfiesta/mcp)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Give your AI agent access to the curated StackFiesta catalog of AI tools for game development.**

Your AI assistant can search tools, compare options, and find the right asset generator, MCP server, plugin, or workflow — without leaving your IDE.

---

## Quick Start

### Via Smithery (recommended)

[Install from Smithery](https://smithery.ai/server/@stackfiesta/mcp)

### Via npx

Add to your `claude_desktop_config.json`, `cursor/mcp.json`, or `.windsurf/config.json`:

```json
{
  "mcpServers": {
    "stackfiesta": {
      "command": "npx",
      "args": ["-y", "@stackfiesta/mcp"]
    }
  }
}
```

### Manual install

```bash
npm install -g @stackfiesta/mcp
stackfiesta-mcp
```

---

## Tools

### `find_tools`

Search AI tools for game development by query and filters.

**Parameters:**

| Param    | Type   | Required | Description |
|----------|--------|----------|-------------|
| query    | string | yes      | Search query |
| engine   | string | no       | Game engine: `unity`, `unreal`, `godot`, `bevy` |
| pricing  | string | no       | `free`, `freemium`, `paid`, `open-source` |
| type     | string | no       | `mcp-server`, `plugin`, `skill`, `prompt`, `api` |
| category | string | no       | Category slug: `ai-coding`, `level-design`, `npc-ai` |
| limit    | number | no       | Max results (default 10, max 24) |

### `get_tool`

Get full details of a specific tool by slug.

**Parameters:**

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| slug  | string | yes      | URL slug (e.g. `unity-mcp`) |

---

## Example Queries

Try asking your AI assistant:

> _"Find me open-source MCP servers for Unity"_
>
> _"What AI tools are available for NPC dialogue?"_
>
> _"Show me details about the Unity MCP tool"_
>
> _"List free asset generation tools for Godot"_

---

## Links

- [StackFiesta.dev](https://stackfiesta.dev) — Browse the full catalog
- [GitHub](https://github.com/stackfiesta/stackfiesta-mcp)

---

⭐ **If this tool helps you, star the repo on GitHub!**
