import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchJson, withQuery } from "./http";
import { errorResult, jsonResult } from "./result";

const BASE = "https://data.brreg.no/enhetsregisteret/api";
const KILDE = {
  kilde: "Brønnøysundregistrene, Enhetsregisteret",
  lisens: "Norsk lisens for offentlige data (NLOD) — https://data.brreg.no/",
  api: "https://data.brreg.no/enhetsregisteret/api/",
};

type BrregEnhet = {
  organisasjonsnummer?: string;
  navn?: string;
  organisasjonsform?: { kode?: string; beskrivelse?: string };
  stiftelsesdato?: string;
  registreringsdatoEnhetsregisteret?: string;
  naeringskode1?: { kode?: string; beskrivelse?: string };
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommune?: string;
    kommunenummer?: string;
    land?: string;
  };
  hjemmeside?: string;
  konkurs?: boolean;
  underAvvikling?: boolean;
};

type BrregSearch = {
  _embedded?: { enheter?: BrregEnhet[] };
  page?: { size: number; totalElements: number; totalPages: number; number: number };
};

function compactEnhet(e: BrregEnhet) {
  const adr = e.forretningsadresse;
  return {
    organisasjonsnummer: e.organisasjonsnummer,
    navn: e.navn,
    organisasjonsform: e.organisasjonsform?.beskrivelse ?? e.organisasjonsform?.kode,
    stiftelsesdato: e.stiftelsesdato,
    naering: e.naeringskode1
      ? `${e.naeringskode1.kode} ${e.naeringskode1.beskrivelse}`
      : undefined,
    adresse: adr
      ? [adr.adresse?.join(", "), adr.postnummer, adr.poststed, adr.kommune]
          .filter(Boolean)
          .join(" ")
      : undefined,
    hjemmeside: e.hjemmeside,
    konkurs: e.konkurs,
    underAvvikling: e.underAvvikling,
  };
}

export async function searchEnheter(opts: {
  navn?: string;
  organisasjonsnummer?: string;
  size?: number;
}) {
  const size = opts.size ?? 8;
  const data = await fetchJson<BrregSearch>(
    withQuery(`${BASE}/enheter`, {
      navn: opts.navn,
      organisasjonsnummer: opts.organisasjonsnummer,
      size,
    })
  );
  return {
    ...KILDE,
    totaltTreff: data.page?.totalElements ?? 0,
    enheter: (data._embedded?.enheter ?? []).map(compactEnhet),
  };
}

export async function getEnhet(organisasjonsnummer: string) {
  const orgnr = organisasjonsnummer.replace(/\s/g, "");
  const data = await fetchJson<BrregEnhet>(`${BASE}/enheter/${orgnr}`);
  return { ...KILDE, enhet: compactEnhet(data) };
}

export function registerBrregTools(server: McpServer) {
  server.tool(
    "brreg_search",
    "Søk i Enhetsregisteret etter foretak på navn eller organisasjonsnummer. Åpne data fra Brønnøysundregistrene, ingen nøkkel. Eksempel: «REQ AS» eller org.nr 926931490.",
    {
      navn: z.string().optional().describe("Foretaksnavn, f.eks. «REQ AS»"),
      organisasjonsnummer: z
        .string()
        .optional()
        .describe("Ni siffer, evt. kommaseparert liste"),
      size: z.number().int().min(1).max(20).optional().describe("Antall treff, standard 8"),
    },
    async ({ navn, organisasjonsnummer, size }) => {
      if (!navn && !organisasjonsnummer) {
        return errorResult("Oppgi navn eller organisasjonsnummer.", KILDE);
      }
      try {
        return jsonResult(await searchEnheter({ navn, organisasjonsnummer, size }));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), KILDE);
      }
    }
  );

  server.tool(
    "brreg_enhet",
    "Slå opp én enhet i Enhetsregisteret på organisasjonsnummer (9 siffer). Kilde: Brønnøysundregistrene.",
    {
      organisasjonsnummer: z
        .string()
        .describe("Organisasjonsnummer, 9 siffer. Eksempel: 926931490"),
    },
    async ({ organisasjonsnummer }) => {
      try {
        return jsonResult(await getEnhet(organisasjonsnummer));
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err), KILDE);
      }
    }
  );
}
