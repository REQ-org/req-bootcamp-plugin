import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, withQuery } from "./http";
import { errorResult, jsonResult } from "./result";

const V0 = "https://data.ssb.no/api/v0";
const V2 = "https://data.ssb.no/api/pxwebapi/v2";
const KILDE = {
  kilde: "Statistisk sentralbyrå (SSB)",
  lisens: "CC BY 4.0 — https://www.ssb.no/diverse/lisens",
  api: "https://data.ssb.no/api/",
};

const HINT_TABLES = ["11342", "07459", "06913"] as const;

export type SsbSelection = {
  variableCode: string;
  valueCodes: string[];
  codelist?: string;
};

type V2Table = {
  id: string;
  label: string;
  description?: string;
  firstPeriod?: string;
  lastPeriod?: string;
  variableNames?: string[];
  category?: string;
  source?: string;
};

type V2Search = {
  tables?: V2Table[];
  page?: { pageNumber: number; pageSize: number; totalElements: number };
};

type V0Variable = {
  code: string;
  text: string;
  values?: string[];
  valueTexts?: string[];
  elimination?: boolean;
  time?: boolean;
};

type V0Metadata = {
  title?: string;
  variables?: V0Variable[];
};

type JsonStat2 = {
  label?: string;
  source?: string;
  updated?: string;
  id?: string[];
  size?: number[];
  value?: Array<number | null>;
  dimension?: Record<
    string,
    {
      label: string;
      category: {
        index: Record<string, number> | string[];
        label: Record<string, string>;
        unit?: Record<string, { base?: string }>;
      };
    }
  >;
};

function isHintQuery(query: string): boolean {
  return /innbyggere|folkemengde|befolkning|oslo/i.test(query);
}

function isDiscontinued(label: string): boolean {
  return /avslutta serie/i.test(label);
}

export async function searchTables(
  query: string,
  opts: { pageSize?: number; includeDiscontinued?: boolean } = {}
) {
  const pageSize = opts.pageSize ?? 12;
  const data = await fetchJson<V2Search>(
    withQuery(`${V2}/tables`, {
      query,
      lang: "no",
      pageSize,
      pageNumber: 1,
    })
  );
  const seen = new Set<string>();
  const tables: Array<V2Table & { hint?: boolean }> = [];

  const push = (table: V2Table, hint = false) => {
    if (seen.has(table.id)) return;
    if (!opts.includeDiscontinued && isDiscontinued(table.label)) return;
    seen.add(table.id);
    tables.push({ ...table, hint });
  };

  if (isHintQuery(query)) {
    for (const id of HINT_TABLES) {
      try {
        const table = await fetchJson<V2Table>(
          withQuery(`${V2}/tables/${id}`, { lang: "no" })
        );
        push(table, true);
      } catch {
        // Hint-tabellen er valgfri — hopp over hvis oppslaget feiler.
      }
    }
  }

  for (const table of data.tables ?? []) push(table);

  return {
    ...KILDE,
    soppslag: query,
    totaltTreff: data.page?.totalElements ?? tables.length,
    tabeller: tables.slice(0, pageSize).map((t) => ({
      id: t.id,
      tittel: t.label,
      periode: [t.firstPeriod, t.lastPeriod].filter(Boolean).join("–"),
      variabler: t.variableNames ?? [],
      anbefaltForInnbyggere: t.hint || undefined,
    })),
    tips:
      "Arbeidsflyt: ssb_search → ssb_table_metadata (finn regionkode, f.eks. Oslo = 0301) → ssb_get_data. Vanlige tabeller: 11342 (areal og befolkning), 07459 (befolkning etter alder/kjønn), 06913 (befolkningsendringer).",
  };
}

export async function tableMetadata(
  tableId: string,
  opts: { finn?: string; maksVerdier?: number } = {}
) {
  const meta = await fetchJson<V0Metadata>(`${V0}/no/table/${tableId}`);
  const maks = opts.maksVerdier ?? 16;
  const finn = opts.finn?.trim().toLowerCase();

  return {
    ...KILDE,
    tabell: tableId,
    tittel: meta.title,
    variabler: (meta.variables ?? []).map((v) => {
      const pairs = (v.values ?? []).map((code, i) => ({
        kode: code,
        tekst: v.valueTexts?.[i] ?? code,
      }));
      const treff = finn
        ? pairs.filter(
            (p) =>
              p.kode.toLowerCase().includes(finn) ||
              p.tekst.toLowerCase().includes(finn)
          )
        : [];
      return {
        kode: v.code,
        navn: v.text,
        kanUtelates: Boolean(v.elimination),
        tid: Boolean(v.time),
        antallVerdier: pairs.length,
        eksempelVerdier: pairs.slice(0, maks),
        funn: finn ? treff.slice(0, maks) : undefined,
      };
    }),
    filterTips:
      "valueCodes kan være eksplisitte koder, top(N), from(ÅÅÅÅ), range(X,Y) eller 03*. Variabler med kanUtelates=true summeres hvis du hopper over dem. Oslo kommune = 0301, hele landet = 0.",
  };
}

function pxFilter(valueCodes: string[], codelist?: string): {
  filter: string;
  values: string[];
} {
  if (codelist) {
    if (codelist.startsWith("vs:")) return { filter: `vs:${codelist.slice(3)}`, values: valueCodes };
    if (codelist.startsWith("agg_")) return { filter: `agg:${codelist.slice(4)}`, values: valueCodes };
    return { filter: codelist, values: valueCodes };
  }
  const first = valueCodes[0] ?? "";
  if (valueCodes.length === 1 && first.startsWith("top(")) {
    return { filter: "top", values: [first.match(/\d+/)?.[0] ?? "1"] };
  }
  if (valueCodes.length === 1 && first.startsWith("from(")) {
    return { filter: "from", values: [first.slice(5, -1)] };
  }
  if (valueCodes.length === 1 && first.startsWith("bottom(")) {
    return { filter: "bottom", values: [first.match(/\d+/)?.[0] ?? "1"] };
  }
  if (valueCodes.length === 1 && first.startsWith("range(")) {
    const match = first.match(/range\((.+),(.+)\)/);
    if (match) return { filter: "between", values: [match[1], match[2]] };
  }
  if (valueCodes.some((v) => v.includes("*") || v.includes("?"))) {
    return { filter: "glob", values: valueCodes };
  }
  return { filter: "item", values: valueCodes };
}

function parseJsonStat2(tableId: string, data: JsonStat2) {
  const ids = data.id ?? [];
  const sizes = data.size ?? [];
  const values = data.value ?? [];
  const dimension = data.dimension ?? {};

  const codesPerDim = ids.map((id) => {
    const index = dimension[id]?.category.index;
    if (Array.isArray(index)) return index;
    return Object.entries(index ?? {})
      .sort((a, b) => a[1] - b[1])
      .map(([code]) => code);
  });

  const rows = values.map((value, i) => {
    const row: Record<string, string | number | null> = { verdi: value };
    let n = i;
    for (let d = ids.length - 1; d >= 0; d--) {
      const size = sizes[d] ?? 1;
      const pos = n % size;
      n = Math.floor(n / size);
      const code = codesPerDim[d]?.[pos] ?? "";
      const label = dimension[ids[d]]?.category.label[code] ?? code;
      row[ids[d]] = code === label ? code : `${code} ${label}`;
    }
    return row;
  });

  const maxRows = 200;
  return {
    ...KILDE,
    tabell: tableId,
    tittel: data.label,
    oppdatert: data.updated,
    antallRader: rows.length,
    avkortet: rows.length > maxRows,
    rader: rows.slice(0, maxRows),
  };
}

export async function getData(tableId: string, selection: SsbSelection[] = []) {
  if (selection.length === 0) {
    const meta = await fetchJson<V0Metadata>(`${V0}/no/table/${tableId}`);
    const cells = (meta.variables ?? []).reduce(
      (acc, v) => acc * Math.max(v.values?.length ?? 1, 1),
      1
    );
    if (cells > 400) {
      return {
        feil: true,
        kode: "FOR_MANGE_CELLER",
        melding: `Uten filter ville tabell ${tableId} returnert ca. ${cells.toLocaleString("nb-NO")} celler.`,
        forslag:
          "Bruk ssb_table_metadata og sett selection. Eksempel for Oslo: variableCode=Region valueCodes=[0301], variableCode=Tid valueCodes=[top(1)].",
        ...KILDE,
      };
    }
  }

  const body = {
    query: selection.map((s) => ({
      code: s.variableCode,
      selection: pxFilter(s.valueCodes, s.codelist),
    })),
    response: { format: "json-stat2" },
  };

  const data = await fetchJson<JsonStat2>(`${V0}/no/table/${tableId}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJsonStat2(tableId, data);
}

export function registerSsbTools(server: McpServer) {
  server.tool(
    "ssb_search",
    "Søk i SSBs statistikkbank etter tabeller (norsk eller engelsk). Brukes først når noen spør om innbyggere, KPI, arbeidsledighet e.l. Oslo-innbyggere: søk «befolkning kommune» — tabell 11342 eller 07459. Kilde: SSB, åpne data, ingen nøkkel.",
    {
      query: z.string().min(1).describe("Fritekst, f.eks. «befolkning kommune» eller «07459»"),
      pageSize: z.number().int().min(1).max(30).optional().describe("Antall treff, standard 12"),
      includeDiscontinued: z
        .boolean()
        .optional()
        .describe("Ta med avsluttede serier. Standard false."),
    },
    async ({ query, pageSize, includeDiscontinued }) => {
      try {
        return jsonResult(await searchTables(query, { pageSize, includeDiscontinued }));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), KILDE);
      }
    }
  );

  server.tool(
    "ssb_table_metadata",
    "Hent variabler og kodelister for en SSB-tabell. Bruk finn for å slå opp regionkoder (f.eks. «Oslo» → 0301). Variabler med kanUtelates=true kan hoppes over (da summeres de).",
    {
      tableId: z.string().min(1).describe("Fem-sifret tabell-id, f.eks. 07459"),
      finn: z.string().optional().describe("Søk i kodelister, f.eks. «Oslo» eller «0301»"),
    },
    async ({ tableId, finn }) => {
      try {
        return jsonResult(await tableMetadata(tableId, { finn }));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), {
          ...KILDE,
          forslag: "Sjekk tableId med ssb_search.",
        });
      }
    }
  );

  server.tool(
    "ssb_get_data",
    "Hent tall fra en SSB-tabell med filter. For «hvor mange innbyggere har Oslo?»: tableId=07459 eller 11342, Region=0301, Tid=top(1). Filter: top(N), from(ÅÅÅÅ), range(X,Y) eller eksplisitte koder. Alltid oppgi kilde SSB.",
    {
      tableId: z.string().min(1).describe("Tabell-id, f.eks. 07459"),
      selection: z
        .array(
          z.object({
            variableCode: z.string().describe("F.eks. Region, Tid, ContentsCode"),
            valueCodes: z
              .array(z.string())
              .min(1)
              .describe("Koder eller uttrykk som top(1), from(2020)"),
            codelist: z.string().optional().describe("Valgfri kodeliste, f.eks. agg_KommFylker"),
          })
        )
        .optional()
        .describe("Filter per variabel. Tomt utvalg avvises på store tabeller."),
    },
    async ({ tableId, selection }) => {
      try {
        return jsonResult(await getData(tableId, selection ?? []));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), {
          ...KILDE,
          forslag:
            "Sjekk variableCode/valueCodes med ssb_table_metadata. Tid kan være 2026, 2026M01 eller 2026K1.",
        });
      }
    }
  );
}
