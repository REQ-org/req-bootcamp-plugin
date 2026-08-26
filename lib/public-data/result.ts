import type { SourceCredit, ToolResult } from "./types";

export function creditLine(source: SourceCredit, extra?: string): string {
  const bits = [
    `Kilde: ${source.name}`,
    extra,
    source.url,
    `Lisens: ${source.license} (${source.licenseUrl})`,
    "Åpne data - ingen API-nøkkel.",
  ].filter(Boolean);
  return bits.join(" · ");
}

export function okJson(payload: unknown, credit: string): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: `${JSON.stringify(payload, null, 2)}\n\n${credit}`,
      },
    ],
  };
}

export function fail(message: string): ToolResult {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

export function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

export function asStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    return items.length ? items : undefined;
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return undefined;
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}
