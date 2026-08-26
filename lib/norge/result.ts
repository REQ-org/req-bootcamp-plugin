export const text = (t: string) => ({
  content: [{ type: "text" as const, text: t }],
});

export function jsonResult(data: unknown) {
  return text(JSON.stringify(data, null, 2));
}

export function errorResult(melding: string, ekstra?: Record<string, unknown>) {
  return jsonResult({ feil: true, melding, ...ekstra });
}
