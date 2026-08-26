// Assert the plugin points at the live Varden MCP Garden — not a plugin-hosted /api/norge/mcp.
import { readFile } from "node:fs/promises";
import path from "node:path";

const GARDEN = "https://varden-mcp-garden.vercel.app/api/mcp";
const COURSE = "https://req-bootcamp.vercel.app/api/mcp";
const DEAD = "https://req-bootcamp.vercel.app/api/norge/mcp";

const mcpPath = path.join(
  process.cwd(),
  "plugins/req-bootcamp-plugin/.mcp.json"
);
const mcp = JSON.parse(await readFile(mcpPath, "utf8"));
const bootcamp = mcp.mcpServers?.["req-bootcamp"]?.url;
const norge = mcp.mcpServers?.["req-norge"]?.url;

if (bootcamp !== COURSE) throw new Error(`req-bootcamp url wrong: ${bootcamp}`);
if (norge !== GARDEN) throw new Error(`req-norge must point at Garden, got: ${norge}`);
if (norge === DEAD || JSON.stringify(mcp).includes("/api/norge/mcp")) {
  throw new Error("plugin still advertises plugin-hosted /api/norge/mcp");
}
console.log(".mcp.json ok: req-norge → Garden");

let nextId = 1;
let sessionId: string | undefined;

async function rpc(method: string, params?: unknown, notify = false) {
  const body: Record<string, unknown> = { jsonrpc: "2.0", method };
  if (params !== undefined) body.params = params;
  if (!notify) body.id = nextId++;
  const res = await fetch(GARDEN, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify(body),
  });
  sessionId = res.headers.get("mcp-session-id") ?? sessionId;
  if (notify) return null;
  const raw = await res.text();
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status} ${raw}`);
  const data =
    raw.startsWith("event:") || raw.includes("\ndata:")
      ? JSON.parse(
          raw
            .split("\n")
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.slice(5))
            .join("")
        )
      : JSON.parse(raw);
  if (data.error) throw new Error(`${method}: ${JSON.stringify(data.error)}`);
  return data.result;
}

const init = await rpc("initialize", {
  protocolVersion: "2025-03-26",
  capabilities: {},
  clientInfo: { name: "garden-pointer", version: "0" },
});
console.log("initialize ok:", init.serverInfo.name);
if (init.serverInfo.name !== "varden-mcp-garden") {
  throw new Error(`expected varden-mcp-garden, got ${init.serverInfo.name}`);
}
await rpc("notifications/initialized", undefined, true);

const listed = await rpc("tools/list");
const names: string[] = listed.tools.map((t: { name: string }) => t.name);
const required = [
  "ssb_search_tables",
  "brreg_search_entities",
  "kartverket_search_addresses",
  "met_locationforecast",
  "brreg_get_accounts",
];
const missing = required.filter((n) => !names.includes(n));
if (missing.length) throw new Error(`Garden missing packs: ${missing.join(", ")}`);
console.log("Garden packs ok:", required.join(", "));
console.log("GARDEN POINTER PASSED");
process.exit(0);
