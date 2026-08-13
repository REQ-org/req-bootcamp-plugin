import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(
  process.cwd(),
  "plugins/req-bootcamp-plugin/content"
);

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "get_schedule",
      "Full schedule for the REQ AI Bootcamp: all 10 sessions with dates and topics (Norwegian).",
      {},
      async () => text(await readFile(path.join(CONTENT_DIR, "schedule.md"), "utf8"))
    );

    server.tool(
      "get_session",
      "Details for one bootcamp session: pre-work and, once held, the recap (Norwegian). Sessions are numbered 1-10.",
      { number: z.number().int().min(1).max(10).describe("Session number, 1-10") },
      async ({ number }) => {
        const file = `session-${String(number).padStart(2, "0")}.md`;
        try {
          return text(await readFile(path.join(CONTENT_DIR, "sessions", file), "utf8"));
        } catch {
          const have = (await readdir(path.join(CONTENT_DIR, "sessions"))).sort();
          return text(
            `Ingen fil for økt ${number} ennå. Tilgjengelige økter: ${have.join(", ") || "ingen"}.`
          );
        }
      }
    );

    server.tool(
      "get_faq",
      "Practical FAQ for the REQ AI Bootcamp: when, where, contacts, tools and access (Norwegian).",
      {},
      async () => text(await readFile(path.join(CONTENT_DIR, "faq.md"), "utf8"))
    );
  },
  {
    serverInfo: { name: "req-bootcamp", version: "1.0.0" },
  },
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };
