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

const BRREG = "https://data.brreg.no/enhetsregisteret/api";

export const BRREG_SOURCE: SourceCredit = {
  id: "brreg",
  name: "Brønnøysundregistrene, Enhetsregisteret",
  url: "https://data.brreg.no/enhetsregisteret/api/dokumentasjon/no/",
  license: "NLOD / åpne data",
  licenseUrl: "https://data.brreg.no/enhetsregisteret/api/dokumentasjon/no/",
};

type BrregAdresse = {
  adresse?: string[];
  postnummer?: string;
  poststed?: string;
  kommune?: string;
  kommunenummer?: string;
};

type BrregEnhet = {
  organisasjonsnummer?: string;
  navn?: string;
  organisasjonsform?: { kode?: string; beskrivelse?: string };
  antallAnsatte?: number;
  stiftelsesdato?: string;
  konkurs?: boolean;
  underAvvikling?: boolean;
  naeringskode1?: { kode?: string; beskrivelse?: string };
  forretningsadresse?: BrregAdresse;
  hjemmeside?: string;
  registrertIForetaksregisteret?: boolean;
};

type BrregSearch = {
  _embedded?: { enheter?: BrregEnhet[] };
  page?: { totalElements?: number; number?: number; size?: number };
};

function slim(e: BrregEnhet) {
  const adr = e.forretningsadresse;
  return {
    organisasjonsnummer: e.organisasjonsnummer,
    navn: e.navn,
    organisasjonsform: e.organisasjonsform
      ? `${e.organisasjonsform.kode} ${e.organisasjonsform.beskrivelse ?? ""}`.trim()
      : undefined,
    ansatte: e.antallAnsatte,
    stiftelsesdato: e.stiftelsesdato,
    naering: e.naeringskode1
      ? `${e.naeringskode1.kode} ${e.naeringskode1.beskrivelse ?? ""}`.trim()
      : undefined,
    adresse: adr
      ? {
          linjer: adr.adresse,
          postnummer: adr.postnummer,
          poststed: adr.poststed,
          kommune: adr.kommune,
          kommunenummer: adr.kommunenummer,
        }
      : undefined,
    hjemmeside: e.hjemmeside,
    konkurs: e.konkurs,
    underAvvikling: e.underAvvikling,
  };
}

function digitsOrgnr(raw: string): string | undefined {
  const digits = raw.replace(/\s+/g, "");
  return /^\d{9}$/.test(digits) ? digits : undefined;
}

function catchUp(err: unknown): ToolResult {
  if (err instanceof UpstreamError) return fail(err.message);
  return fail(err instanceof Error ? err.message : String(err));
}

export function createBrregPack(options: PackOptions = {}): DataPack {
  const fetchImpl = options.fetchImpl;

  async function search(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const navn = asString(args.navn);
      const orgnr = asString(args.orgnr);
      const kommune = asString(args.kommune);
      if (!navn && !orgnr && !kommune) {
        return fail("Oppgi minst navn, orgnr eller kommune.");
      }
      const size = Math.min(Math.max(asNumber(args.size) ?? 5, 1), 20);
      const url = new URL(`${BRREG}/enheter`);
      if (navn) url.searchParams.set("navn", navn);
      if (orgnr) {
        const digits = digitsOrgnr(orgnr);
        if (!digits) return fail("orgnr må være 9 siffer.");
        url.searchParams.set("organisasjonsnummer", digits);
      }
      if (kommune) url.searchParams.set("kommunenummer", kommune);
      url.searchParams.set("size", String(size));

      const data = await fetchJson<BrregSearch>(url.toString(), {
        source: "Brønnøysundregistrene",
        fetchImpl,
      });
      const enheter = (data._embedded?.enheter ?? []).map(slim);
      return okJson(
        {
          count: enheter.length,
          total: data.page?.totalElements,
          enheter,
        },
        creditLine(BRREG_SOURCE)
      );
    } catch (err) {
      return catchUp(err);
    }
  }

  async function getEnhet(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const raw = asString(args.orgnr);
      if (!raw) return fail("Mangler orgnr (9 siffer).");
      const orgnr = digitsOrgnr(raw);
      if (!orgnr) return fail("orgnr må være 9 siffer.");
      const data = await fetchJson<BrregEnhet>(`${BRREG}/enheter/${orgnr}`, {
        source: "Brønnøysundregistrene",
        fetchImpl,
      });
      return okJson(slim(data), creditLine(BRREG_SOURCE, `enhet ${orgnr}`));
    } catch (err) {
      return catchUp(err);
    }
  }

  return {
    id: "brreg",
    title: "Enhetsregisteret",
    description:
      "Søk og oppslag i Brønnøysundregistrenes åpne Enhetsregister. Ingen API-nøkkel.",
    source: BRREG_SOURCE,
    tools: [
      {
        name: "brreg_search",
        description:
          "Søk etter norske foretak i Enhetsregisteret på navn, organisasjonsnummer eller kommunenummer. F.eks. «REQ Capital» eller kommune 0301.",
        inputSchema: {
          navn: z.string().optional().describe("Foretaksnavn, f.eks. REQ"),
          orgnr: z.string().optional().describe("9-sifret organisasjonsnummer"),
          kommune: z.string().optional().describe("Kommunenummer, f.eks. 0301"),
          size: z.number().int().min(1).max(20).optional(),
        },
        execute: search,
      },
      {
        name: "brreg_get_enhet",
        description:
          "Hent ett foretak fra Enhetsregisteret med 9-sifret organisasjonsnummer.",
        inputSchema: {
          orgnr: z.string().describe("9-sifret organisasjonsnummer, f.eks. 926931490"),
        },
        execute: getEnhet,
      },
    ],
  };
}
