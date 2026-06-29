import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { server } from "./index.js";

describe("StackFiesta MCP Server", () => {
  let client: Client;
  let serverTransport: InMemoryTransport;

  beforeAll(async () => {
    const [clientTransport, srvTransport] = InMemoryTransport.createLinkedPair();
    serverTransport = srvTransport;
    client = new Client({ name: "test", version: "1.0" });
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  afterAll(async () => {
    await client.close();
    await server.close();
  });

  it("lists find_tools and get_tool", async () => {
    const result = await client.listTools();
    const names = result.tools.map((t) => t.name);
    expect(names).toContain("find_tools");
    expect(names).toContain("get_tool");
    expect(result.tools).toHaveLength(2);
  });

  it("find_tools requires query param", async () => {
    const tool = (await client.listTools()).tools.find((t) => t.name === "find_tools")!;
    expect(tool.inputSchema.required).toContain("query");
  });

  it("get_tool requires slug param", async () => {
    const tool = (await client.listTools()).tools.find((t) => t.name === "get_tool")!;
    expect(tool.inputSchema.required).toContain("slug");
  });
});
