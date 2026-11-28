// Client-side CSV export (Excel opens these directly).
export type Cell = string | number | boolean | null | undefined;

const esc = (v: Cell) => {
  const s = v == null ? "" : String(v);
  // Quote when needed; prefix formula-looking text so spreadsheets don't execute it.
  const safe = /^[=+\-@]/.test(s) && !/^-?\d/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function toCsv(head: string[], rows: Cell[][]) {
  return [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}

export function downloadCsv(name: string, head: string[], rows: Cell[][]) {
  const blob = new Blob(["﻿" + toCsv(head, rows)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name.endsWith(".csv") ? name : `${name}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
