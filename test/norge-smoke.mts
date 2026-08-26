// Smoke test for the public-data MCP: handler + real open APIs (no keys).
import { POST } from "../api/norge.ts";

const URL = "http://localhost/api/norge";
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

function toolText(result: { content: Array<{ text: string }> }): string {
  return result.content[0]?.text ?? "";
}

const init = await rpc("initialize", {
  protocolVersion: "2025-03-26",
  capabilities: {},
  clientInfo: { name: "norge-smoke", version: "0" },
});
console.log("initialize ok:", init.serverInfo.name);
if (init.serverInfo.name !== "norge-open-data") {
  throw new Error(`unexpected server name: ${init.serverInfo.name}`);
}
await rpc("notifications/initialized", undefined, true);

const tools = await rpc("tools/list");
const names = tools.tools.map((t: { name: string }) => t.name).sort();
console.log("tools:", names.join(", "));
const expected = [
  "brreg_get_enhet",
  "brreg_search",
  "kartverket_lookup_eiendom",
  "kartverket_search_address",
  "kartverket_search_place",
  "norge_kilder",
  "ssb_find_region",
  "ssb_get_data",
  "ssb_search_tables",
  "ssb_table_metadata",
];
if (JSON.stringify(names) !== JSON.stringify(expected)) {
  throw new Error(`unexpected tool set: ${names.join(", ")}`);
}

const kilder = await rpc("tools/call", { name: "norge_kilder", arguments: {} });
if (!toolText(kilder).includes("Statistisk sentralbyrå")) {
  throw new Error("norge_kilder missing SSB credit");
}
console.log("norge_kilder ok");

const search = await rpc("tools/call", {
  name: "ssb_search_tables",
  arguments: { query: "folkemengde kommune", page_size: 5 },
});
const searchText = toolText(search);
if (!searchText.includes("07459") && !searchText.includes("11342")) {
  throw new Error(`ssb_search_tables missed population tables: ${searchText.slice(0, 300)}`);
}
if (!searchText.includes("Kilde: Statistisk sentralbyrå")) {
  throw new Error("ssb_search_tables missing source credit");
}
console.log("ssb_search_tables ok");

const region = await rpc("tools/call", {
  name: "ssb_find_region",
  arguments: { query: "Oslo" },
});
if (!toolText(region).includes("0301")) {
  throw new Error(`ssb_find_region did not resolve Oslo: ${toolText(region).slice(0, 300)}`);
}
console.log("ssb_find_region Oslo → 0301 ok");

const pop = await rpc("tools/call", {
  name: "ssb_get_data",
  arguments: {
    table_id: "07459",
    value_codes: { Region: "0301", Tid: "top(1)", ContentsCode: "Personer1" },
  },
});
const popText = toolText(pop);
const popMatch = popText.match(/"verdi":\s*(\d+)/);
if (!popMatch) throw new Error(`ssb_get_data Oslo: no verdi\n${popText.slice(0, 500)}`);
const innbyggere = Number(popMatch[1]);
if (innbyggere < 500_000 || innbyggere > 1_000_000) {
  throw new Error(`unexpected Oslo population: ${innbyggere}`);
}
if (!popText.includes("07459")) throw new Error("ssb_get_data missing table id");
console.log(`ssb_get_data Oslo ok: ${innbyggere} innbyggere`);

const meta = await rpc("tools/call", {
  name: "ssb_table_metadata",
  arguments: { table_id: "07459", value_query: "Oslo" },
});
if (!toolText(meta).includes("0301")) {
  throw new Error("ssb_table_metadata value_query Oslo missed 0301");
}
console.log("ssb_table_metadata ok");

const brreg = await rpc("tools/call", {
  name: "brreg_search",
  arguments: { navn: "REQ Capital", size: 3 },
});
const brregText = toolText(brreg);
if (!brregText.includes("926931490") && !brregText.includes("REQ")) {
  throw new Error(`brreg_search missed REQ: ${brregText.slice(0, 300)}`);
}
if (!brregText.includes("Brønnøysund")) {
  throw new Error("brreg_search missing source credit");
}
console.log("brreg_search ok");

const enhet = await rpc("tools/call", {
  name: "brreg_get_enhet",
  arguments: { orgnr: "926931490" },
});
if (!toolText(enhet).includes("Sommerrogata")) {
  throw new Error("brreg_get_enhet missed address");
}
console.log("brreg_get_enhet ok");

const addr = await rpc("tools/call", {
  name: "kartverket_search_address",
  arguments: { sok: "Sommerrogata 17", treff: 2 },
});
if (!toolText(addr).includes("0301")) {
  throw new Error("kartverket_search_address missed Oslo");
}
console.log("kartverket_search_address ok");

const sted = await rpc("tools/call", {
  name: "kartverket_search_place",
  arguments: { sok: "Oslo", treff: 2 },
});
if (!toolText(sted).includes("Oslo")) {
  throw new Error("kartverket_search_place missed Oslo");
}
console.log("kartverket_search_place ok");

const eiendom = await rpc("tools/call", {
  name: "kartverket_lookup_eiendom",
  arguments: { kommunenummer: "0301", gardsnummer: 209, bruksnummer: 44 },
});
if (!toolText(eiendom).includes("209") && !toolText(eiendom).includes("matrikkel")) {
  throw new Error(`kartverket_lookup_eiendom unexpected: ${toolText(eiendom).slice(0, 300)}`);
}
console.log("kartverket_lookup_eiendom ok");

console.log("NORGE SMOKE PASSED");
process.exit(0);
