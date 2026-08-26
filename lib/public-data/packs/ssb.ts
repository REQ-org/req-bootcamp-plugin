import { z } from "zod";
import { fetchJson, UpstreamError } from "../http";
import { flattenJsonStat2, type JsonStat2 } from "../jsonstat";
import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  creditLine,
  fail,
  okJson,
} from "../result";
import type { DataPack, PackOptions, SourceCredit, ToolResult } from "../types";

const SSB_V2 = "https://data.ssb.no/api/pxwebapi/v2";
const KLASS = "https://data.ssb.no/api/klass/v1/classifications";

export const SSB_SOURCE: SourceCredit = {
  id: "ssb",
  name: "Statistisk sentralbyrå (SSB)",
  url: "https://data.ssb.no/api/pxwebapi/v2",
  license: "CC BY 4.0",
  licenseUrl: "https://www.ssb.no/diverse/lisens",
};

const VALUE_PREVIEW = 12;

type SsbTableHit = {
  id: string;
  label: string;
  updated?: string;
  firstPeriod?: string;
  lastPeriod?: string;
  variableNames?: string[];
  source?: string;
  timeUnit?: string;
};

type SsbSearchResponse = {
  tables?: SsbTableHit[];
  page?: { pageNumber?: number; pageSize?: number; totalElements?: number };
};

type KlassCode = { code: string; name: string; parentCode?: string | null };
type KlassResponse = { codes?: KlassCode[] };

function credit(tableId?: string): string {
  const extra = tableId
    ? `tabell ${tableId} (https://www.ssb.no/statbank/table/${tableId})`
    : "PxWebApi v2";
  return creditLine(SSB_SOURCE, extra);
}

function catchUp(err: unknown): ToolResult {
  if (err instanceof UpstreamError) return fail(err.message);
  return fail(err instanceof Error ? err.message : String(err));
}

export function createSsbPack(options: PackOptions = {}): DataPack {
  const fetchImpl = options.fetchImpl;

  async function searchTables(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const query = asString(args.query);
      if (!query) return fail("Mangler søkeord (query). Prøv f.eks. «folkemengde kommune».");
      const lang = asString(args.lang) === "en" ? "en" : "no";
      const pageSize = Math.min(Math.max(asNumber(args.page_size) ?? 8, 1), 30);
      const page = Math.max(asNumber(args.page) ?? 1, 1);
      const includeDiscontinued = asBoolean(args.include_discontinued) ?? false;

      const url = new URL(`${SSB_V2}/tables`);
      url.searchParams.set("lang", lang);
      url.searchParams.set("query", query);
      url.searchParams.set("pagesize", String(pageSize));
      url.searchParams.set("pagenumber", String(page));
      url.searchParams.set("includeDiscontinued", String(includeDiscontinued));

      const data = await fetchJson<SsbSearchResponse>(url.toString(), {
        source: "SSB",
        fetchImpl,
      });
      const tables = (data.tables ?? []).map((t) => ({
        id: t.id,
        label: t.label,
        updated: t.updated,
        firstPeriod: t.firstPeriod,
        lastPeriod: t.lastPeriod,
        variables: t.variableNames,
        timeUnit: t.timeUnit,
      }));
      return okJson(
        {
          query,
          count: tables.length,
          total: data.page?.totalElements,
          hint:
            "Neste steg: ssb_table_metadata med table_id, deretter ssb_get_data. For kommunal folkemengde er tabell 07459 et godt utgangspunkt (Oslo = 0301).",
          tables,
        },
        credit()
      );
    } catch (err) {
      return catchUp(err);
    }
  }

  async function tableMetadata(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const tableId = asString(args.table_id);
      if (!tableId) return fail("Mangler table_id (f.eks. 07459).");
      const lang = asString(args.lang) === "en" ? "en" : "no";
      const valueQuery = asString(args.value_query)?.toLowerCase();

      const data = await fetchJson<JsonStat2>(
        `${SSB_V2}/tables/${encodeURIComponent(tableId)}/metadata?lang=${lang}`,
        { source: "SSB", fetchImpl }
      );

      const dimensions = (data.id ?? []).map((code, i) => {
        const dim = data.dimension?.[code];
        const labels = dim?.category?.label ?? {};
        const entries = Object.entries(labels);
        const matched = valueQuery
          ? entries.filter(
              ([k, v]) =>
                k.toLowerCase().includes(valueQuery) ||
                v.toLowerCase().includes(valueQuery)
            )
          : entries.slice(0, VALUE_PREVIEW);
        return {
          code,
          label: dim?.label ?? code,
          valueCount: data.size?.[i] ?? entries.length,
          values: matched.map(([k, v]) => ({ code: k, label: v })),
          truncated:
            !valueQuery && entries.length > VALUE_PREVIEW
              ? `Viser ${VALUE_PREVIEW} av ${entries.length}. Bruk value_query for å søke i kodene (f.eks. «Oslo»).`
              : undefined,
        };
      });

      return okJson(
        {
          tableId,
          title: data.label,
          source: data.source,
          updated: data.updated,
          dimensions,
          hint: "Bruk ssb_get_data med value_codes, f.eks. { Region: \"0301\", Tid: \"top(1)\", ContentsCode: \"Personer1\" }.",
        },
        credit(tableId)
      );
    } catch (err) {
      return catchUp(err);
    }
  }

  async function getData(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const tableId = asString(args.table_id);
      if (!tableId) return fail("Mangler table_id (f.eks. 07459).");
      const lang = asString(args.lang) === "en" ? "en" : "no";
      const valueCodes = asRecord(args.value_codes) ?? {};
      const codeLists = asRecord(args.code_lists) ?? {};

      const selection = Object.entries(valueCodes).map(([variableCode, raw]) => {
        const values =
          typeof raw === "string"
            ? raw.split(",").map((s) => s.trim()).filter(Boolean)
            : Array.isArray(raw)
              ? raw.filter((v): v is string => typeof v === "string")
              : [];
        const item: {
          variableCode: string;
          valueCodes: string[];
          codeList?: string;
        } = { variableCode, valueCodes: values };
        const list = asString(codeLists[variableCode]);
        if (list) item.codeList = list;
        return item;
      });

      const url = `${SSB_V2}/tables/${encodeURIComponent(tableId)}/data?lang=${lang}&outputFormat=json-stat2`;
      const data = await fetchJson<JsonStat2>(url, {
        source: "SSB",
        fetchImpl,
        method: selection.length ? "POST" : "GET",
        body: selection.length ? JSON.stringify({ selection }) : undefined,
      });

      const flat = flattenJsonStat2(data);
      const id = flat.tableId ?? tableId;
      return okJson(
        {
          tableId: id,
          title: flat.title,
          updated: flat.updated,
          rowCount: flat.rows.length,
          rows: flat.rows.slice(0, 200),
          truncated: flat.rows.length > 200 ? `Viser 200 av ${flat.rows.length} rader.` : undefined,
        },
        credit(id)
      );
    } catch (err) {
      return catchUp(err);
    }
  }

  async function findRegion(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const query = asString(args.query);
      if (!query) return fail("Mangler query (f.eks. «Oslo» eller «0301»).");
      const needle = query.toLowerCase();
      const date = new Date().toISOString().slice(0, 10);

      const [kommuner, fylker] = await Promise.all([
        fetchJson<KlassResponse>(`${KLASS}/131/codes.json?from=${date}`, {
          source: "SSB Klass",
          fetchImpl,
        }),
        fetchJson<KlassResponse>(`${KLASS}/104/codes.json?from=${date}`, {
          source: "SSB Klass",
          fetchImpl,
        }),
      ]);

      const match = (codes: KlassCode[], kind: "kommune" | "fylke") =>
        (codes ?? [])
          .filter(
            (c) =>
              c.code.toLowerCase() === needle ||
              c.name.toLowerCase().includes(needle)
          )
          .slice(0, 15)
          .map((c) => ({ kind, code: c.code, name: c.name }));

      const hits = [
        ...match(kommuner.codes ?? [], "kommune"),
        ...match(fylker.codes ?? [], "fylke"),
      ];
      return okJson(
        {
          query,
          hits,
          hint: "Bruk koden i ssb_get_data som Region, f.eks. Oslo kommune = 0301.",
        },
        creditLine(SSB_SOURCE, "Klass 131 (kommuner) og 104 (fylker)")
      );
    } catch (err) {
      return catchUp(err);
    }
  }

  return {
    id: "ssb",
    title: "SSB Statistikkbanken",
    description:
      "Søk, metadata og uttrekk fra SSBs åpne PxWebApi v2. Ingen API-nøkkel.",
    source: SSB_SOURCE,
    tools: [
      {
        name: "ssb_search_tables",
        description:
          "Søk i SSBs statistikkbank etter tabeller (norske søkeord gir best treff, f.eks. «folkemengde», «KPI», «arbeidsledighet»). Returnerer tabell-id, tittel og tidsrom. For «hvor mange innbyggere har Oslo?» start med «folkemengde kommune» - tabell 07459 er et godt treff.",
        inputSchema: {
          query: z
            .string()
            .describe("Søkeord. Norsk, f.eks. «folkemengde kommune» eller title:kpi"),
          lang: z.enum(["no", "en"]).optional().describe("Språk, default no"),
          page_size: z.number().int().min(1).max(30).optional(),
          page: z.number().int().min(1).optional(),
          include_discontinued: z.boolean().optional(),
        },
        execute: searchTables,
      },
      {
        name: "ssb_table_metadata",
        description:
          "Hent variabler og verdikoder for en SSB-tabell. Kall denne før ssb_get_data. Bruk value_query for å finne koder (f.eks. «Oslo» → 0301).",
        inputSchema: {
          table_id: z.string().describe("Tabellnummer, f.eks. 07459"),
          lang: z.enum(["no", "en"]).optional(),
          value_query: z
            .string()
            .optional()
            .describe("Filtrer verdikoder på navn eller kode, f.eks. Oslo"),
        },
        execute: tableMetadata,
      },
      {
        name: "ssb_get_data",
        description:
          "Hent tall fra en SSB-tabell. Filtrer alltid på Tid (f.eks. top(1) for nyeste år) for å unngå store uttrekk. value_codes er et objekt variabel → kode, f.eks. { Region: \"0301\", Tid: \"top(1)\", ContentsCode: \"Personer1\" }. Støtter top(n), from(x), range(a,b) og *.",
        inputSchema: {
          table_id: z.string().describe("Tabellnummer, f.eks. 07459"),
          value_codes: z
            .record(z.string(), z.union([z.string(), z.array(z.string())]))
            .optional()
            .describe("Filter per variabel. Tomt = SSBs standarduttrekk."),
          code_lists: z
            .record(z.string(), z.string())
            .optional()
            .describe("Valgfri kodeliste per variabel, f.eks. agg_KommFylker"),
          lang: z.enum(["no", "en"]).optional(),
        },
        execute: getData,
      },
      {
        name: "ssb_find_region",
        description:
          "Slå opp SSB-regionkode for kommune eller fylke (Klass). «Oslo» → 0301, «Vestland» → 46. Bruk koden som Region i ssb_get_data.",
        inputSchema: {
          query: z.string().describe("Kommunenavn, fylkesnavn eller kode"),
        },
        execute: findRegion,
      },
    ],
  };
}
