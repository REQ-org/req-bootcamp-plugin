// Garden is one MCP pack inside the REQ bootcamp plugin — not a second plugin,
// and not a plugin-hosted /api/norge/mcp.
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const GARDEN = "https://varden-mcp-garden.vercel.app/api/mcp";
const COURSE = "https://req-bootcamp.vercel.app/api/mcp";
const DEAD = "https://req-bootcamp.vercel.app/api/norge/mcp";
const ROOT = process.cwd();
const PLUGIN = path.join(ROOT, "plugins/req-bootcamp-plugin");

const mcp = JSON.parse(
  await readFile(path.join(PLUGIN, ".mcp.json"), "utf8")
) as {
  mcpServers?: Record<string, { url?: string }>;
};
const keys = Object.keys(mcp.mcpServers ?? {});
if (keys.includes("req-norge")) {
  throw new Error("rename req-norge — Garden is a pack key, not a sibling plugin");
}
if (JSON.stringify(keys.sort()) !== JSON.stringify(["req-bootcamp", "varden-garden"])) {
  throw new Error(`expected req-bootcamp + varden-garden, got: ${keys.join(", ")}`);
}
const bootcamp = mcp.mcpServers?.["req-bootcamp"]?.url;
const garden = mcp.mcpServers?.["varden-garden"]?.url;
if (bootcamp !== COURSE) throw new Error(`req-bootcamp url wrong: ${bootcamp}`);
if (garden !== GARDEN) throw new Error(`varden-garden must point at Garden, got: ${garden}`);
if (JSON.stringify(mcp).includes("/api/norge/mcp") || garden === DEAD) {
  throw new Error("plugin still advertises plugin-hosted /api/norge/mcp");
}
console.log(".mcp.json ok: varden-garden → Garden");

const marketplace = JSON.parse(
  await readFile(path.join(ROOT, ".claude-plugin/marketplace.json"), "utf8")
) as { plugins?: { name?: string }[] };
if (marketplace.plugins?.length !== 1 || marketplace.plugins[0]?.name !== "req-bootcamp") {
  throw new Error("marketplace must keep exactly one plugin: req-bootcamp");
}
try {
  await access(path.join(ROOT, "plugins/varden-mcp-garden"));
  throw new Error("do not ship plugins/varden-mcp-garden — Garden is not a standalone plugin");
} catch (err) {
  if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
}
console.log("marketplace ok: one plugin, no standalone Garden");

const packs = [
  {
    name: "ssb",
    needles: ["befolkning", "ssb_search_tables", "ssb_table_data", "400"],
  },
  {
    name: "brreg",
    needles: ["orgnr", "brreg_search_entities", "brreg_get_roles", "omsetning"],
  },
  {
    name: "regnskap",
    needles: ["omsetning", "brreg_get_accounts", "926931490", "3-år"],
  },
  {
    name: "kartverket",
    needles: ["adresse", "kartverket_search_addresses", "Sommerrogata", "Matrikkel"],
  },
  {
    name: "met",
    needles: ["vær", "met_locationforecast", "varden-garden"],
  },
  {
    name: "oslo-pbe",
    needles: [
      "reguleringsplan",
      "oslo_list_layers",
      "oslo_plans_for_parcel",
      "oslo_planbestemmelser",
      "oslo_search_cases",
      "oslo_case",
      "saksinnsyn",
      "504",
    ],
  },
] as const;

for (const pack of packs) {
  const raw = await readFile(path.join(PLUGIN, "skills", pack.name, "SKILL.md"), "utf8");
  if (!raw.startsWith("---\n") || !raw.includes(`name: ${pack.name}`)) {
    throw new Error(`${pack.name}: missing YAML name`);
  }
  const desc = raw.match(/^description:\s*(.+)$/m)?.[1] ?? "";
  if (desc.length < 40) throw new Error(`${pack.name}: description too thin for routing`);
  const missing = pack.needles.filter((n) => !raw.toLowerCase().includes(n.toLowerCase()));
  if (missing.length) {
    throw new Error(`${pack.name} skill missing: ${missing.join(", ")}`);
  }
  await access(path.join(PLUGIN, "commands", `${pack.name}.md`));
}
console.log("Garden pack skills + commands ok");

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
  "oslo_plans_for_parcel",
  "oslo_planbestemmelser",
];
const missing = required.filter((n) => !names.includes(n));
if (missing.length) throw new Error(`Garden missing packs: ${missing.join(", ")}`);
console.log("Garden packs ok:", required.join(", "));
console.log("GARDEN POINTER PASSED");
process.exit(0);
