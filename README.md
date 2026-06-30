# StackFiesta MCP

[![NPM](https://img.shields.io/npm/v/%40stackfiesta%2Fmcp)](https://www.npmjs.com/package/@stackfiesta/mcp)
[![Smithery](https://img.shields.io/badge/Smithery-stackfiesta-blue)](https://smithery.ai/server/stackfiesta/gamedev)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

AI tools for game development — searchable from Claude Code, Cursor, Windsurf, or any MCP-compatible agent. 100+ tools indexed by engine, task, and pricing.

## Connect

### Claude Code

```bash
claude mcp add stackfiesta --url https://stackfiesta.dev/mcp
```

### Gemini

Via Gemini CLI:

```bash
gemini config set mcpServers.stackfiesta.url https://stackfiesta.dev/mcp
```

### opencode

`opencode.jsonc`:

```json
{
  "mcpServers": {
    "stackfiesta": {
      "url": "https://stackfiesta.dev/mcp"
    }
  }
}
```

### Cursor / Windsurf / Claude Desktop / Cline / Zed

All use the same JSON config in their respective settings files:

```json
{
  "mcpServers": {
    "stackfiesta": {
      "url": "https://stackfiesta.dev/mcp"
    }
  }
}
```

| Client         | Config file |
|----------------|-------------|
| Cursor         | Settings → MCP → Add Server |
| Windsurf       | `~/.codeium/windsurf/config.json` |
| Claude Desktop | `claude_desktop_config.json` |
| Cline          | `~/.config/cline/mcp_settings.json` |
| Zed            | `~/.config/zed/settings.json` (key: `mcp_servers`) |
| GitHub Copilot | VS Code → MCP Servers → Add URL |

### Smithery (alternative install)

```bash
npx @smithery/cli install stackfiesta/gamedev
```

### Generic / any MCP client

| Field     | Value                        |
|-----------|------------------------------|
| Endpoint  | `https://stackfiesta.dev/mcp` |
| Transport | Streamable HTTP              |
| Auth      | None                         |

---

## What you can ask

> "Find AI tools for generating pixel art sprites"
>
> "What AI tools work with Godot?"
>
> "I need a free QA testing tool for my Unity game"
>
> "Tools for writing RPG dialogue"
>
> "Show me the details on Godogen"
>
> "Free tools for procedural level generation"
>
> "AI tools that export to FBX"

---

## Tools

### `find_tools`

Search the catalog. Full-text search with optional filters by engine, pricing, type, and category.

**Parameters:**

| Param    | Type   | Required | Description |
|----------|--------|----------|-------------|
| `query`  | string | yes      | Full-text search query |
| `engine` | string | no       | Game engine filter: `unity`, `unreal`, `godot`, `bevy`, etc. |
| `pricing`| string | no       | `free`, `freemium`, `paid`, `open-source` |
| `type`   | string | no       | `mcp-server`, `plugin`, `skill`, `prompt`, `api` |
| `category`| string | no       | Category slug: `ai-coding`, `level-design`, `npc-ai` |
| `limit`  | number | no       | Max results (default 10, max 24) |

### `get_tool`

Full details for one tool by slug. Returns use cases, features, pricing tiers, integrations, links, FAQ.

**Parameters:**

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| `slug` | string | yes      | URL slug (e.g. `unity-mcp`, `meshy`) |

---

## Example session

**You:** "Find me AI tools for generating 2D sprites that work with Godot"

**Agent** calls `find_tools({ query: "2D sprite generation", engine: "godot" })` → results appear.

**You:** "Show me the details on the first one"

**Agent** calls `get_tool({ slug: "somestring" })` → full details with pricing, features, and links.

---

## Catalog

100+ AI tools for Unity, Unreal, Godot, GameMaker, Bevy, and more. Browse the full catalog at [stackfiesta.dev](https://stackfiesta.dev).

## Analytics

Anonymous tool-call data collected via PostHog to improve the catalog. No personal data collected.

---

## Local / self-run (optional)

```bash
npx @stackfiesta/mcp
```

## License

MIT
