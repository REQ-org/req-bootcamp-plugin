// Local smoke test: drives the handler directly with Web Requests (no server).
import { POST } from "../api/mcp.ts";

const URL = "http://localhost/api/mcp";
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
  const data = raw.startsWith("event:") || raw.includes("\ndata:")
    ? JSON.parse(raw.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5)).join(""))
    : JSON.parse(raw);
  if (data.error) throw new Error(`${method}: ${JSON.stringify(data.error)}`);
  return data.result;
}

const init = await rpc("initialize", {
  protocolVersion: "2025-03-26",
  capabilities: {},
  clientInfo: { name: "smoke", version: "0" },
});
console.log("initialize ok:", init.serverInfo.name);
await rpc("notifications/initialized", undefined, true);

const tools = await rpc("tools/list");
const names = tools.tools.map((t: { name: string }) => t.name).sort();
console.log("tools:", names.join(", "));
if (JSON.stringify(names) !== JSON.stringify(["get_faq", "get_schedule", "get_session"]))
  throw new Error("unexpected tool set");

const sched = await rpc("tools/call", { name: "get_schedule", arguments: {} });
const schedText = sched.content[0].text as string;
if (!schedText.includes("18. august 2026")) throw new Error("schedule content wrong");
if (!schedText.includes("4. sep 2026")) throw new Error("schedule missing Friday 4 Sep session 3");
if (schedText.includes("MCP: koble til")) throw new Error("schedule still has stale økt 3 topic");
if (!schedText.includes("13. november 2026")) throw new Error("schedule does not end 13 Nov");
console.log("get_schedule ok");

const s1 = await rpc("tools/call", { name: "get_session", arguments: { number: 1 } });
const s1text = s1.content[0].text as string;
if (!s1text.includes("Fundamentals I")) throw new Error("session 1 content wrong");
if (s1text.includes("kommer etter økten")) throw new Error("session 1 recap still stub");
if (!s1text.includes("Fange → Samle → Bygge")) throw new Error("session 1 missing Varden demo recap");
if (!s1text.includes("installerte kurspluginen")) throw new Error("session 1 missing plugin hands-on recap");
console.log("get_session(1) ok");

const s2 = await rpc("tools/call", { name: "get_session", arguments: { number: 2 } });
const s2text = s2.content[0].text as string;
if (s2text.includes("kommer etter økten")) throw new Error("session 2 recap still stub");
if (!s2text.includes("stresstest")) throw new Error("session 2 missing walkthrough recap");
if (!s2text.includes("Quick wins")) throw new Error("session 2 missing matrix recap");
console.log("get_session(2) ok");

const s3 = await rpc("tools/call", { name: "get_session", arguments: { number: 3 } });
const s3text = s3.content[0].text as string;
if (!s3text.includes("Projects, dokumenter og offentlige data")) {
  throw new Error("session 3 missing Friday agenda title");
}
if (!s3text.includes("4. sep 2026")) throw new Error("session 3 date wrong");
if (s3text.includes("1. sep 2026")) throw new Error("session 3 still dated 1. sep");
if (!s3text.includes("Planinnsyn") || !s3text.includes("oslo-pbe")) {
  throw new Error("session 3 missing live oslo-pbe / Planinnsyn");
}
if (!s3text.includes("Hvilke reguleringsplaner gjelder Sommerrogata 17")) {
  throw new Error("session 3 missing tested Planinnsyn demo prompt");
}
if (s3text.includes("Norges Bank")) {
  throw new Error("session 3 must not invent Norges Bank");
}
console.log("get_session(3) ok");

const s4 = await rpc("tools/call", { name: "get_session", arguments: { number: 4 } });
const s4text = s4.content[0].text as string;
if (!s4text.includes("Arbeidsøkt") || !s4text.includes("18. sep 2026")) {
  throw new Error("session 4 is not the 18 Sep arbeidsøkt");
}
if (!s4text.includes("Send oss to setninger")) throw new Error("session 4 missing case pre-work");
console.log("get_session(4) ok");

const s5 = await rpc("tools/call", { name: "get_session", arguments: { number: 5 } });
const s5text = s5.content[0].text as string;
if (s5text.includes("kommer etter økten")) throw new Error("session 5 recap still stub");
if (!s5text.includes("REQ Evergreen Income Fund")) throw new Error("session 5 missing Evergreen example recap");
if (!s5text.includes("Sjekk at hvert tall på siden finnes i datafilene")) {
  throw new Error("session 5 missing step 2 prompts");
}
console.log("get_session(5) ok");

const s6 = await rpc("tools/call", { name: "get_session", arguments: { number: 6 } });
const s6text = s6.content[0].text as string;
if (!s6text.includes("Dashboard-eksempel og arbeidsøkt") || !s6text.includes("16. okt 2026")) {
  throw new Error("session 6 is not the 16 Oct dashboard example and working session");
}
console.log("get_session(6) ok");

const s8 = await rpc("tools/call", { name: "get_session", arguments: { number: 8 } });
if (!s8.content[0].text.includes("Bygge en MCP")) throw new Error("session 8 content wrong");
console.log("get_session(8) ok");

const s9 = await rpc("tools/call", { name: "get_session", arguments: { number: 9 } });
if (!s9.content[0].text.includes("Trygg bruk")) throw new Error("session 9 content wrong");
console.log("get_session(9) ok");

const s10 = await rpc("tools/call", { name: "get_session", arguments: { number: 10 } });
if (!s10.content[0].text.includes("Oppsummering og veien videre")) {
  throw new Error("session 10 content wrong");
}
console.log("get_session(10) ok");

const faq = await rpc("tools/call", { name: "get_faq", arguments: {} });
if (!faq.content[0].text.includes("Sommerrogata")) throw new Error("faq content wrong");
console.log("get_faq ok");

console.log("SMOKE PASSED");
process.exit(0);
