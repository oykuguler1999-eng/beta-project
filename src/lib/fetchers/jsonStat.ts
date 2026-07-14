export type JsonStatDataset = {
  value: Record<string, number> | (number | null)[];
  dimension: Record<
    string,
    { category: { index: Record<string, number> | string[]; label?: Record<string, string> } }
  >;
  id: string[];
  size: number[];
};

export function decodeJsonStat(data: JsonStatDataset): Record<string, string | number>[] {
  const { id, size, dimension, value } = data;

  const dimCodes: string[][] = id.map((dimId) => {
    const index = dimension[dimId].category.index;
    if (Array.isArray(index)) return index;
    return Object.keys(index).sort((a, b) => index[a] - index[b]);
  });

  const total = size.reduce((a, b) => a * b, 1);
  const getValue = (flatIndex: number): number | null | undefined =>
    Array.isArray(value) ? value[flatIndex] : value[String(flatIndex)];

  const results: Record<string, string | number>[] = [];

  for (let flat = 0; flat < total; flat++) {
    const v = getValue(flat);
    if (v === undefined || v === null) continue;

    let remainder = flat;
    const indices: number[] = new Array(size.length);
    for (let d = size.length - 1; d >= 0; d--) {
      indices[d] = remainder % size[d];
      remainder = Math.floor(remainder / size[d]);
    }

    const row: Record<string, string | number> = { value: v };
    id.forEach((dimId, d) => {
      row[dimId] = dimCodes[d][indices[d]];
    });
    results.push(row);
  }

  return results;
}
