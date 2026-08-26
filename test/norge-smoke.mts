// Smoke test for the public-data MCP: protocol + real SSB / Brreg / Kartverket APIs.
import { POST } from "../api/norge/mcp.ts";
import { NORGE_TOOL_NAMES } from "../lib/norge/register.ts";
import { getData, searchTables } from "../lib/norge/ssb.ts";
import { getEnhet } from "../lib/norge/brreg.ts";
import { searchAdresser } from "../lib/norge/kartverket.ts";

const URL = "http://localhost/api/norge/mcp";
let nextId = 1;
let sessionId: string | undefined;

async function rpc(method: string, params?: unknown, notify = false) {
  const body: Record<string, unknown> = { jsonrpc: "2.0", method };
  if (params !== undefined) body.params = params;
  if (!notify) body.id = nextId++;
  const res = await POST(
    new Request(URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        ...(sessionId ? { "mcp-session-id": sessionId } : {}),
      },
      body: JSON.stringify(body),
    })
  );
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

function toolText(result: { content: Array<{ text: string }> }) {
  return result.content[0].text as string;
}

const init = await rpc("initialize", {
  protocolVersion: "2025-03-26",
  capabilities: {},
  clientInfo: { name: "norge-smoke", version: "0" },
});
console.log("initialize ok:", init.serverInfo.name);
if (init.serverInfo.name !== "req-norge") throw new Error("wrong server name");
await rpc("notifications/initialized", undefined, true);

const tools = await rpc("tools/list");
const names = tools.tools.map((t: { name: string }) => t.name).sort();
const expected = [...NORGE_TOOL_NAMES].sort();
console.log("tools:", names.join(", "));
if (JSON.stringify(names) !== JSON.stringify(expected)) {
  throw new Error(`unexpected tool set: ${names.join(", ")}`);
}

const kilder = await rpc("tools/call", { name: "norge_kilder", arguments: {} });
if (!toolText(kilder).includes("Statistisk sentralbyrå")) {
  throw new Error("norge_kilder missing SSB credit");
}
console.log("norge_kilder ok");

const search = await searchTables("befolkning kommune");
const ids = search.tabeller.map((t) => t.id);
if (!ids.includes("11342") && !ids.includes("07459")) {
  throw new Error(`ssb_search missed population tables: ${ids.join(", ")}`);
}
console.log("ssb_search ok:", ids.slice(0, 5).join(", "));

const oslo = await getData("07459", [
  { variableCode: "Region", valueCodes: ["0301"] },
  { variableCode: "Tid", valueCodes: ["top(1)"] },
]);
if ("feil" in oslo) throw new Error(`ssb_get_data error: ${JSON.stringify(oslo)}`);
const innbyggere = oslo.rader[0]?.verdi;
if (typeof innbyggere !== "number" || innbyggere < 600_000) {
  throw new Error(`Oslo population looks wrong: ${innbyggere}`);
}
if (!String(oslo.rader[0]?.Region ?? "").includes("Oslo")) {
  throw new Error(`expected Oslo row, got ${JSON.stringify(oslo.rader[0])}`);
}
if (oslo.kilde !== "Statistisk sentralbyrå (SSB)") {
  throw new Error("missing SSB credit on data");
}
console.log("ssb_get_data Oslo ok:", innbyggere);

const viaMcp = await rpc("tools/call", {
  name: "ssb_get_data",
  arguments: {
    tableId: "11342",
    selection: [
      { variableCode: "Region", valueCodes: ["0301"] },
      { variableCode: "ContentsCode", valueCodes: ["Folkemengde"] },
      { variableCode: "Tid", valueCodes: ["top(1)"] },
    ],
  },
});
const mcpOslo = JSON.parse(toolText(viaMcp));
if (mcpOslo.rader?.[0]?.verdi !== innbyggere) {
  throw new Error(
    `MCP 11342 Oslo (${mcpOslo.rader?.[0]?.verdi}) != 07459 (${innbyggere})`
  );
}
console.log("ssb_get_data via MCP (11342) ok");

const enhet = await getEnhet("926931490");
if (enhet.enhet.navn !== "REQ AS") throw new Error(`unexpected enhet: ${enhet.enhet.navn}`);
if (!enhet.enhet.adresse?.includes("Sommerrogata")) {
  throw new Error(`unexpected address: ${enhet.enhet.adresse}`);
}
console.log("brreg_enhet ok:", enhet.enhet.navn);

const adr = await searchAdresser("Sommerrogata 17");
if (adr.adresser[0]?.adresse !== "Sommerrogata 17") {
  throw new Error(`unexpected address hit: ${JSON.stringify(adr.adresser[0])}`);
}
if (adr.adresser[0]?.kommunenummer !== "0301") {
  throw new Error("Sommerrogata 17 should be Oslo 0301");
}
console.log("kartverket_adresse ok:", adr.adresser[0]?.adresse);

console.log("NORGE SMOKE PASSED");
process.exit(0);
