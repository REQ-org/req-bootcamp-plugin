import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, withQuery } from "./http";
import { errorResult, jsonResult } from "./result";

const ADRESSER = "https://api.kartverket.no/adresser/v1";
const STEDSNAVN = "https://api.kartverket.no/stedsnavn/v1";
const EIENDOM = "https://api.kartverket.no/eiendom/v1";

const KILDE = {
  kilde: "Kartverket / Geonorge",
  lisens: "Norsk lisens for offentlige data (NLOD) — https://kartverket.no/api-og-data",
  api: "https://api.kartverket.no/",
};

type Adresse = {
  adressetekst?: string;
  adressenavn?: string;
  nummer?: number;
  postnummer?: string;
  poststed?: string;
  kommunenavn?: string;
  kommunenummer?: string;
  gardsnummer?: number;
  bruksnummer?: number;
  festenummer?: number;
  representasjonspunkt?: { lat?: number; lon?: number; øst?: number; nord?: number };
};

type AdresseSok = {
  metadata?: { totaltAntallTreff?: number };
  adresser?: Adresse[];
};

type Stedsnavn = {
  skrivemåte?: string;
  navneobjekttype?: string;
  navnestatus?: string;
  kommuner?: Array<{ kommunenavn?: string; kommunenummer?: string }>;
  fylker?: Array<{ fylkesnavn?: string; fylkesnummer?: string }>;
  representasjonspunkt?: { nord?: number; øst?: number };
};

type StedsnavnSok = {
  metadata?: { totaltAntallTreff?: number };
  navn?: Stedsnavn[];
};

type GeoJson = {
  type?: string;
  features?: Array<{
    geometry?: { coordinates?: number[] };
    properties?: Record<string, unknown>;
  }>;
};

export async function searchAdresser(sok: string, treffPerSide = 8) {
  const data = await fetchJson<AdresseSok>(
    withQuery(`${ADRESSER}/sok`, { sok, treffPerSide, asciiKompatibel: "true" })
  );
  return {
    ...KILDE,
    totaltTreff: data.metadata?.totaltAntallTreff ?? 0,
    adresser: (data.adresser ?? []).map((a) => ({
      adresse: a.adressetekst,
      postnummer: a.postnummer,
      poststed: a.poststed,
      kommune: a.kommunenavn,
      kommunenummer: a.kommunenummer,
      gardsnummer: a.gardsnummer,
      bruksnummer: a.bruksnummer,
      festenummer: a.festenummer,
      koordinater: a.representasjonspunkt,
    })),
  };
}

export async function searchStedsnavn(sok: string, treffPerSide = 8) {
  const data = await fetchJson<StedsnavnSok>(
    withQuery(`${STEDSNAVN}/navn`, { sok, treffPerSide, side: 1 })
  );
  return {
    ...KILDE,
    totaltTreff: data.metadata?.totaltAntallTreff ?? 0,
    steder: (data.navn ?? []).map((n) => ({
      navn: n.skrivemåte,
      type: n.navneobjekttype,
      status: n.navnestatus,
      kommune: n.kommuner?.[0]?.kommunenavn,
      kommunenummer: n.kommuner?.[0]?.kommunenummer,
      fylke: n.fylker?.[0]?.fylkesnavn,
      koordinater: n.representasjonspunkt,
    })),
  };
}

export async function lookupEiendom(opts: {
  kommunenummer: string;
  gardsnummer: number;
  bruksnummer: number;
  festenummer?: number;
}) {
  const data = await fetchJson<GeoJson>(
    withQuery(`${EIENDOM}/geokoding`, {
      kommunenummer: opts.kommunenummer,
      gardsnummer: opts.gardsnummer,
      bruksnummer: opts.bruksnummer,
      festenummer: opts.festenummer,
    })
  );
  return {
    ...KILDE,
    merknad:
      "Åpent eiendoms-API for lokalisering (matrikkelnummer → punkt). Ikke full matrikkel; grensekvalitet leveres ikke.",
    eiendommer: (data.features ?? []).map((f) => ({
      ...f.properties,
      koordinater: f.geometry?.coordinates,
    })),
  };
}

export function registerKartverketTools(server: McpServer) {
  server.tool(
    "kartverket_adresse",
    "Søk etter offisielle adresser i matrikkelen (Kartverket Adresse-API). Eksempel: «Sommerrogata 17». Returnerer også gnr/bnr som kan brukes i kartverket_eiendom. Åpne data, ingen nøkkel.",
    {
      sok: z.string().min(2).describe("Adressesøk, f.eks. «Sommerrogata 17» eller «Karl Johans gate 1 Oslo»"),
      treffPerSide: z.number().int().min(1).max(20).optional(),
    },
    async ({ sok, treffPerSide }) => {
      try {
        return jsonResult(await searchAdresser(sok, treffPerSide));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), KILDE);
      }
    }
  );

  server.tool(
    "kartverket_stedsnavn",
    "Søk i Sentralt stedsnavnregister (SSR) etter stedsnavn. Eksempel: «Oslo», «Gaustatoppen». Kilde: Kartverket.",
    {
      sok: z.string().min(2).describe("Stedsnavn, gjerne med * for trunkering"),
      treffPerSide: z.number().int().min(1).max(20).optional(),
    },
    async ({ sok, treffPerSide }) => {
      try {
        return jsonResult(await searchStedsnavn(sok, treffPerSide));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), KILDE);
      }
    }
  );

  server.tool(
    "kartverket_eiendom",
    "Slå opp representasjonspunkt for en matrikkelenhet (kommune + gnr/bnr) via Kartverkets åpne eiendoms-API. Bruk kommunenummer/gnr/bnr fra kartverket_adresse.",
    {
      kommunenummer: z.string().describe("Kommunenummer, 4 siffer. Oslo = 0301"),
      gardsnummer: z.number().int().min(0).describe("Gårdsnummer"),
      bruksnummer: z.number().int().min(0).describe("Bruksnummer"),
      festenummer: z.number().int().min(0).optional(),
    },
    async (args) => {
      try {
        return jsonResult(await lookupEiendom(args));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), KILDE);
      }
    }
  );
}
