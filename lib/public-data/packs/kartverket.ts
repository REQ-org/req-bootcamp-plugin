import { z } from "zod";
import { fetchJson, UpstreamError } from "../http";
import {
  asNumber,
  asString,
  creditLine,
  fail,
  okJson,
} from "../result";
import type { DataPack, PackOptions, SourceCredit, ToolResult } from "../types";

const ADRESSER = "https://ws.geonorge.no/adresser/v1";
const STEDSNAVN = "https://ws.geonorge.no/stedsnavn/v1";
const EIENDOM = "https://api.kartverket.no/eiendom/v1";

export const KARTVERKET_SOURCE: SourceCredit = {
  id: "kartverket",
  name: "Kartverket / Geonorge",
  url: "https://kartverket.no/api-og-data",
  license: "NLOD / åpne data",
  licenseUrl: "https://www.geonorge.no/",
};

type Adresse = {
  adressetekst?: string;
  adressenavn?: string;
  nummer?: number;
  postnummer?: string;
  poststed?: string;
  kommunenummer?: string;
  kommunenavn?: string;
  gardsnummer?: number;
  bruksnummer?: number;
  festenummer?: number;
  representasjonspunkt?: { lat?: number; lon?: number };
};

type AdresseSok = {
  metadata?: { totaltAntallTreff?: number };
  adresser?: Adresse[];
};

type StedNavn = {
  skrivemåte?: string;
  navneobjekttype?: string;
  navnestatus?: string;
  stedsnummer?: number;
  kommuner?: Array<{ kommunenavn?: string; kommunenummer?: string }>;
  representasjonspunkt?: { nord?: number; øst?: number };
};

type StedSok = {
  metadata?: { totaltAntallTreff?: number };
  navn?: StedNavn[];
};

function catchUp(err: unknown): ToolResult {
  if (err instanceof UpstreamError) return fail(err.message);
  return fail(err instanceof Error ? err.message : String(err));
}

export function createKartverketPack(options: PackOptions = {}): DataPack {
  const fetchImpl = options.fetchImpl;

  async function searchAddress(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const sok = asString(args.sok);
      if (!sok) return fail("Mangler sok (f.eks. «Sommerrogata 17 Oslo»).");
      const treff = Math.min(Math.max(asNumber(args.treff) ?? 5, 1), 20);
      const url = new URL(`${ADRESSER}/sok`);
      url.searchParams.set("sok", sok);
      url.searchParams.set("treffPerSide", String(treff));
      const data = await fetchJson<AdresseSok>(url.toString(), {
        source: "Kartverket Adresse",
        fetchImpl,
      });
      return okJson(
        {
          query: sok,
          total: data.metadata?.totaltAntallTreff,
          adresser: (data.adresser ?? []).map((a) => ({
            adressetekst: a.adressetekst,
            postnummer: a.postnummer,
            poststed: a.poststed,
            kommune: a.kommunenavn,
            kommunenummer: a.kommunenummer,
            matrikkel: {
              gardsnummer: a.gardsnummer,
              bruksnummer: a.bruksnummer,
              festenummer: a.festenummer,
            },
            punkt: a.representasjonspunkt,
          })),
        },
        creditLine(KARTVERKET_SOURCE, "Adresse-API")
      );
    } catch (err) {
      return catchUp(err);
    }
  }

  async function searchPlace(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const sok = asString(args.sok);
      if (!sok) return fail("Mangler sok (f.eks. «Oslo» eller «Galdhøpiggen»).");
      const treff = Math.min(Math.max(asNumber(args.treff) ?? 5, 1), 20);
      const url = new URL(`${STEDSNAVN}/navn`);
      url.searchParams.set("sok", sok);
      url.searchParams.set("treffPerSide", String(treff));
      const data = await fetchJson<StedSok>(url.toString(), {
        source: "Kartverket Stedsnavn",
        fetchImpl,
      });
      return okJson(
        {
          query: sok,
          total: data.metadata?.totaltAntallTreff,
          steder: (data.navn ?? []).map((n) => ({
            navn: n.skrivemåte,
            type: n.navneobjekttype,
            status: n.navnestatus,
            stedsnummer: n.stedsnummer,
            kommuner: n.kommuner,
            punkt: n.representasjonspunkt
              ? { lat: n.representasjonspunkt.nord, lon: n.representasjonspunkt.øst }
              : undefined,
          })),
        },
        creditLine(KARTVERKET_SOURCE, "Stedsnavn-API (SSR)")
      );
    } catch (err) {
      return catchUp(err);
    }
  }

  async function lookupEiendom(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const kommunenummer = asString(args.kommunenummer);
      const gardsnummer = asNumber(args.gardsnummer);
      const bruksnummer = asNumber(args.bruksnummer);
      const lat = asNumber(args.lat);
      const lon = asNumber(args.lon);

      const hasMatrikkel =
        Boolean(kommunenummer) && gardsnummer !== undefined && bruksnummer !== undefined;
      const hasPunkt = lat !== undefined && lon !== undefined;
      if (!hasMatrikkel && !hasPunkt) {
        return fail(
          "Oppgi kommunenummer + gardsnummer + bruksnummer, eller lat + lon. Adressesøk gir matrikkelnummer."
        );
      }

      if (hasMatrikkel) {
        const url = new URL(`${EIENDOM}/geokoding`);
        url.searchParams.set("kommunenummer", kommunenummer!);
        url.searchParams.set("gardsnummer", String(gardsnummer));
        url.searchParams.set("bruksnummer", String(bruksnummer));
        const data = await fetchJson<unknown>(url.toString(), {
          source: "Kartverket Eiendom",
          fetchImpl,
        });
        return okJson(data, creditLine(KARTVERKET_SOURCE, "Eiendom-API (lokalisering)"));
      }

      const url = new URL(`${EIENDOM}/punkt`);
      url.searchParams.set("nord", String(lat));
      url.searchParams.set("ost", String(lon));
      url.searchParams.set("koordsys", "4258");
      url.searchParams.set("radius", String(asNumber(args.radius) ?? 15));
      url.searchParams.set("treffPerSide", "5");
      const data = await fetchJson<unknown>(url.toString(), {
        source: "Kartverket Eiendom",
        fetchImpl,
      });
      return okJson(data, creditLine(KARTVERKET_SOURCE, "Eiendom-API (punktsøk)"));
    } catch (err) {
      return catchUp(err);
    }
  }

  return {
    id: "kartverket",
    title: "Kartverket adresse, stedsnavn og eiendom",
    description:
      "Åpne Kartverket/Geonorge-API-er for adresser, stedsnavn (SSR) og eiendomslokalisering. Ingen API-nøkkel.",
    source: KARTVERKET_SOURCE,
    tools: [
      {
        name: "kartverket_search_address",
        description:
          "Søk etter offisiell norsk adresse (Kartverket Adresse-API). Returnerer poststed, kommunenummer og matrikkel (gårds-/bruksnummer).",
        inputSchema: {
          sok: z.string().describe("Adressetekst, f.eks. Sommerrogata 17 Oslo"),
          treff: z.number().int().min(1).max(20).optional(),
        },
        execute: searchAddress,
      },
      {
        name: "kartverket_search_place",
        description:
          "Søk i Sentralt stedsnavnregister (SSR) etter stedsnavn, f.eks. Oslo, Bergen, Galdhøpiggen.",
        inputSchema: {
          sok: z.string().describe("Stedsnavn"),
          treff: z.number().int().min(1).max(20).optional(),
        },
        execute: searchPlace,
      },
      {
        name: "kartverket_lookup_eiendom",
        description:
          "Åpent eiendomsoppslag: lokalisér en matrikkelenhet (kommunenummer, gårdsnr, bruksnr) eller finn eiendom nær et punkt (lat/lon, ETRS89). Full matrikkel med hjemmel krever eget Kartverket-abonnement - dette er bare det åpne lokaliserings-API-et.",
        inputSchema: {
          kommunenummer: z.string().optional().describe("F.eks. 0301"),
          gardsnummer: z.number().int().optional(),
          bruksnummer: z.number().int().optional(),
          lat: z.number().optional().describe("Breddegrad (ETRS89 / EPSG:4258)"),
          lon: z.number().optional().describe("Lengdegrad"),
          radius: z.number().optional().describe("Radius i meter ved punktsøk, default 15"),
        },
        execute: lookupEiendom,
      },
    ],
  };
}
