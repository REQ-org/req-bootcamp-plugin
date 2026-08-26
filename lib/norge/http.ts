const USER_AGENT =
  "req-bootcamp-norge/1.0 (+https://req-bootcamp.vercel.app; open Norwegian data for REQ AI Bootcamp)";

const TIMEOUT_MS = 20_000;

export async function fetchJson<T = unknown>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("accept")) headers.set("accept", "application/json");
  if (!headers.has("user-agent")) headers.set("user-agent", USER_AGENT);

  const res = await fetch(url, {
    ...init,
    headers,
    signal: init.signal ?? AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status} ${res.statusText} fra ${url}: ${body.slice(0, 400)}`
    );
  }
  if (!body) return {} as T;
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(`Ugyldig JSON fra ${url}: ${body.slice(0, 200)}`);
  }
}

export function withQuery(
  base: string,
  params: Record<string, string | number | undefined>
): string {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}
