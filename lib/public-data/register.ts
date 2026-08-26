import { createBrregPack } from "./packs/brreg";
import { createKartverketPack } from "./packs/kartverket";
import { createSsbPack } from "./packs/ssb";
import { creditLine, okJson } from "./result";
import type { DataPack, McpToolHost, PackOptions, SourceCredit } from "./types";

const CATALOG_SOURCE: SourceCredit = {
  id: "norge-open-data",
  name: "Norske åpne data (REQ AI Bootcamp)",
  url: "https://req-bootcamp.vercel.app/api/norge",
  license: "peker til kildenes egne lisenser",
  licenseUrl: "https://req-bootcamp.vercel.app",
};

/** All public packs shipped with this server. Catalog product can import this list. */
export function createPublicDataPacks(options: PackOptions = {}): DataPack[] {
  return [
    createSsbPack(options),
    createBrregPack(options),
    createKartverketPack(options),
  ];
}

export function registerPack(server: McpToolHost, pack: DataPack): void {
  for (const tool of pack.tools) {
    server.tool(tool.name, tool.description, tool.inputSchema, (args) =>
      tool.execute(args)
    );
  }
}

export function registerPublicDataPacks(
  server: McpToolHost,
  options: PackOptions = {}
): DataPack[] {
  const packs = createPublicDataPacks(options);
  for (const pack of packs) registerPack(server, pack);

  server.tool(
    "norge_kilder",
    "Oversikt over de åpne norske datakildene denne MCP-en wrapper, med lisens og lenke. Ingen REQ-interne kilder.",
    {},
    async () =>
      okJson(
        {
          server: "norge-open-data",
          auth: "ingen - offentlige åpne API-er",
          packs: packs.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            source: p.source,
            tools: p.tools.map((t) => t.name),
          })),
        },
        creditLine(CATALOG_SOURCE)
      )
  );

  return packs;
}
