type JsonStatCategory = {
  index?: Record<string, number> | string[];
  label?: Record<string, string>;
  unit?: Record<string, { base?: string; decimals?: number }>;
};

type JsonStatDimension = {
  label?: string;
  category?: JsonStatCategory;
};

export type JsonStat2 = {
  label?: string;
  source?: string;
  updated?: string;
  id?: string[];
  size?: number[];
  value?: Array<number | null>;
  dimension?: Record<string, JsonStatDimension>;
  extension?: { px?: { tableid?: string } };
};

export type FlatRow = Record<string, string | number | null>;

export function flattenJsonStat2(data: JsonStat2): {
  title: string;
  source: string;
  updated: string;
  tableId?: string;
  rows: FlatRow[];
} {
  const dimensions = data.id ?? [];
  const sizes = data.size ?? [];
  const values = data.value ?? [];
  const dim = data.dimension ?? {};

  const dimKeys = dimensions.map((code) => orderedKeys(dim[code]?.category));

  const rows: FlatRow[] = [];
  for (let i = 0; i < values.length; i++) {
    const row: FlatRow = { verdi: values[i] ?? null };
    let idx = i;
    for (let d = dimensions.length - 1; d >= 0; d--) {
      const size = sizes[d] ?? 1;
      const keyIdx = idx % size;
      idx = Math.floor(idx / size);
      const code = dimKeys[d]?.[keyIdx] ?? "";
      const label = dim[dimensions[d]]?.category?.label?.[code] ?? code;
      row[dimensions[d]] = code === label ? code : `${code} ${label}`;
    }
    rows.push(row);
  }

  return {
    title: data.label ?? "",
    source: data.source ?? "Statistisk sentralbyrå",
    updated: data.updated ?? "",
    tableId: data.extension?.px?.tableid,
    rows,
  };
}

function orderedKeys(category: JsonStatCategory | undefined): string[] {
  const index = category?.index;
  if (!index) return [];
  if (Array.isArray(index)) return index;
  return Object.entries(index)
    .sort((a, b) => a[1] - b[1])
    .map(([k]) => k);
}
