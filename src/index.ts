#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { fileURLToPath } from "node:url";
import { PostHog } from "posthog-node";
import { instrument } from "@posthog/mcp";

const API_BASE = "https://stackfiesta.dev/api";

interface ToolSummary {
  title: string;
  slug: string;
  summary: string;
  pricing: string;
  tag_slugs: string[];
  stars_count: number;
}

interface SearchResponse {
  tools: ToolSummary[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    types: Record<string, number>;
    pricing: Record<string, number>;
    engines: Record<string, number>;
    categories: Record<string, number>;
  };
}

interface ToolDetail {
  title: string;
  summary: string;
  description: string | null;
  pricing: string;
  pricing_tiers: unknown;
  use_cases: string[];
  features: string[];
  faq: unknown;
  integrations: string[];
  hook_facts: unknown;
  links: {
    website: string | null;
    github: string | null;
    docs: string | null;
    npm: string | null;
    discord: string | null;
  };
  tag_slugs: string[];
  category_slugs: string[];
  stars_count: number;
}

const server = new Server(
  { name: "stackfiesta", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const posthog = new PostHog("phc_CKufHS68EGEKgYKBfcJ7hRkzj65qxLdoAHSMreXVRzyE", {
  host: "https://us.i.posthog.com",
});

instrument(server, posthog);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "find_tools",
      description: `Search AI tools for game development from the StackFiesta catalog.
Supports filtering by engine, pricing, type, and category. Returns paginated results (max 24).`,
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query (full-text search)",
          },
          engine: {
            type: "string",
            description: "Filter by game engine: unity, unreal, godot, bevy, etc.",
          },
          pricing: {
            type: "string",
            description: "Filter by pricing model: free, freemium, paid, open-source",
          },
          type: {
            type: "string",
            description: "Filter by tool type: mcp-server, plugin, skill, prompt, api",
          },
          category: {
            type: "string",
            description: "Filter by category slug (e.g. ai-coding, level-design, npc-ai)",
          },
          limit: {
            type: "number",
            description: "Maximum results (default 10, max 24)",
            default: 10,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "get_tool",
      description: "Get full details of a specific AI tool by its slug from StackFiesta.",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "URL slug of the tool (e.g. unity-mcp, meshy)",
          },
        },
        required: ["slug"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "find_tools": {
        const { query, engine, pricing, type, category, limit } = args as {
          query: string;
          engine?: string;
          pricing?: string;
          type?: string;
          category?: string;
          limit?: number;
        };

        const params = new URLSearchParams({ q: query, page: "1" });
        if (engine) params.set("engine", engine);
        if (pricing) params.set("pricing", pricing);
        if (type) params.set("type", type);
        if (category) params.set("category", category);

        const url = `${API_BASE}/search?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json() as SearchResponse;
        const items = data.tools.slice(0, Math.min(limit ?? 10, 24));

        return {
          content: [{
            type: "text",
            text: JSON.stringify(items, null, 2),
          }],
        };
      }

      case "get_tool": {
        const { slug } = args as { slug: string };

        const url = `${API_BASE}/tools/${encodeURIComponent(slug)}`;
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 404) {
            return {
              content: [{
                type: "text",
                text: JSON.stringify({ error: `Tool "${slug}" not found` }, null, 2),
              }],
              isError: true,
            };
          }
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json() as ToolDetail;

        return {
          content: [{
            type: "text",
            text: JSON.stringify(data, null, 2),
          }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (err) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(
          { error: err instanceof Error ? err.message : String(err) },
          null, 2,
        ),
      }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

export { server, posthog };

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  process.on("SIGTERM", async () => {
    await posthog.shutdown();
    process.exit(0);
  });
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
