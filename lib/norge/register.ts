import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBrregTools } from "./brreg";
import { registerKartverketTools } from "./kartverket";
import { jsonResult } from "./result";
import { registerSsbTools } from "./ssb";

export const NORGE_TOOL_NAMES = [
  "norge_kilder",
  "ssb_search",
  "ssb_table_metadata",
  "ssb_get_data",
  "brreg_search",
  "brreg_enhet",
  "kartverket_adresse",
  "kartverket_stedsnavn",
  "kartverket_eiendom",
] as const;

export function registerNorgeTools(server: McpServer) {
  server.tool(
    "norge_kilder",
    "Oversikt over de åpne norske datakildene denne MCP-en wrapper, lisenser og eksempelspørsmål. Ingen innlogging.",
    {},
    async () =>
      jsonResult({
        server: "req-norge",
        url: "https://req-bootcamp.vercel.app/api/norge/mcp",
        merknad:
          "Offentlige connectors for REQ AI Bootcamp. Ingen API-nøkler. Alltid oppgi kilden når du svarer.",
        kilder: [
          {
            navn: "Statistisk sentralbyrå (SSB)",
            api: "https://data.ssb.no/api/",
            lisens: "CC BY 4.0",
            verktoy: ["ssb_search", "ssb_table_metadata", "ssb_get_data"],
            eksempel: "hvor mange innbyggere har Oslo?",
          },
          {
            navn: "Brønnøysundregistrene — Enhetsregisteret",
            api: "https://data.brreg.no/enhetsregisteret/api/",
            lisens: "NLOD",
            verktoy: ["brreg_search", "brreg_enhet"],
            eksempel: "slå opp REQ AS i Enhetsregisteret",
          },
          {
            navn: "Kartverket / Geonorge",
            api: "https://api.kartverket.no/",
            lisens: "NLOD",
            verktoy: ["kartverket_adresse", "kartverket_stedsnavn", "kartverket_eiendom"],
            eksempel: "hva er adressen Sommerrogata 17?",
          },
        ],
      })
  );

  registerSsbTools(server);
  registerBrregTools(server);
  registerKartverketTools(server);
}
