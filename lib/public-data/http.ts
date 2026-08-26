import type { FetchLike } from "./types";

export const USER_AGENT =
  "req-bootcamp-norge-mcp/1.0 (+https://req-bootcamp.vercel.app)";

const DEFAULT_TIMEOUT_MS = 12_000;

export class UpstreamError extends Error {
  constructor(
    readonly source: string,
    readonly status: number,
    readonly detail: string
  ) {
    super(
      status
        ? `${source} svarte HTTP ${status}${detail ? `: ${detail}` : ""}`
        : `${source}: ${detail}`
    );
    this.name = "UpstreamError";
  }
}

export async function fetchJson<T>(
  url: string,
  options: {
    source: string;
    fetchImpl?: FetchLike;
    method?: "GET" | "POST";
    headers?: Record<string, string>;
    body?: string;
    timeoutMs?: number;
    accept?: string;
  }
): Promise<T> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );
  try {
    const res = await fetchImpl(url, {
      method: options.method ?? "GET",
      headers: {
        accept: options.accept ?? "application/json",
        "user-agent": USER_AGENT,
        ...(options.body ? { "content-type": "application/json" } : {}),
        ...options.headers,
      },
      body: options.body,
      signal: controller.signal,
    });
    const raw = await res.text();
    if (!res.ok) {
      throw new UpstreamError(options.source, res.status, clip(raw, 400));
    }
    if (!raw) return {} as T;
    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new UpstreamError(
        options.source,
        res.status,
        `Ugyldig JSON: ${clip(raw, 200)}`
      );
    }
  } catch (err) {
    if (err instanceof UpstreamError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new UpstreamError(options.source, 0, "Tidsavbrudd mot kilden");
    }
    throw new UpstreamError(
      options.source,
      0,
      err instanceof Error ? err.message : String(err)
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}
