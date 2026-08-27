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
if (!sched.content[0].text.includes("18. august 2026")) throw new Error("schedule content wrong");
console.log("get_schedule ok");

const s1 = await rpc("tools/call", { name: "get_session", arguments: { number: 1 } });
if (!s1.content[0].text.includes("Fundamentals I")) throw new Error("session 1 content wrong");
console.log("get_session(1) ok");

const s2 = await rpc("tools/call", { name: "get_session", arguments: { number: 2 } });
const s2text = s2.content[0].text as string;
if (s2text.includes("kommer etter økten")) throw new Error("session 2 recap still stub");
if (!s2text.includes("stresstest")) throw new Error("session 2 missing walkthrough recap");
if (!s2text.includes("Quick wins")) throw new Error("session 2 missing matrix recap");
console.log("get_session(2) ok");

const s9 = await rpc("tools/call", { name: "get_session", arguments: { number: 9 } });
if (!s9.content[0].text.includes("Trygg bruk")) throw new Error("session 9 content wrong");
console.log("get_session(9) ok");

const faq = await rpc("tools/call", { name: "get_faq", arguments: {} });
if (!faq.content[0].text.includes("Sommerrogata")) throw new Error("faq content wrong");
console.log("get_faq ok");

console.log("SMOKE PASSED");
process.exit(0);
