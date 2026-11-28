// Small dependency-free charts. Every chart also shows its numbers as text.
import { cx } from "./ui";

export function BarList({ data, unit = "", tone = "bg-brand" }: { data: { label: string; value: number; note?: string }[]; unit?: string; tone?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="grid gap-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex justify-between gap-2 text-sm"><span className="font-medium text-slate-700">{d.label}</span><span className="font-semibold tabular-nums text-slate-900">{d.value}{unit}{d.note && <span className="ml-1 font-normal text-slate-500">{d.note}</span>}</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100" aria-hidden><div className={cx("h-full rounded-full", tone)} style={{ width: `${(d.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

/** Line/area chart for a cumulative series. */
export function AreaChart({ points, format, label }: { points: { x: string; y: number }[]; format: (v: number) => string; label: string }) {
  if (points.length === 0) return <p className="text-sm text-slate-500">No data yet.</p>;
  const W = 900, H = 220, P = 36;
  const max = Math.max(1, ...points.map((p) => p.y));
  const xs = (i: number) => P + (points.length === 1 ? (W - 2 * P) / 2 : (i * (W - 2 * P)) / (points.length - 1));
  const ys = (v: number) => H - P - (v / max) * (H - 2 * P);
  const line = points.map((p, i) => `${xs(i)},${ys(p.y)}`).join(" ");
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label}: ${points.map((p) => `${p.x} ${format(p.y)}`).join(", ")}`}>
        {[0, 0.5, 1].map((g) => <line key={g} x1={P} x2={W - P} y1={ys(max * g)} y2={ys(max * g)} stroke="#e2e8f0" strokeDasharray="4 4" />)}
        <polygon points={`${xs(0)},${H - P} ${line} ${xs(points.length - 1)},${H - P}`} fill="rgb(11 60 111 / 0.12)" />
        <polyline points={line} fill="none" stroke="#0b3c6f" strokeWidth="3" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={p.x}>
            <circle cx={xs(i)} cy={ys(p.y)} r="5" fill="#f5a623" stroke="#071f3a" strokeWidth="2" />
            <text x={xs(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">{p.x}</text>
            <text x={xs(i)} y={ys(p.y) - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#071f3a">{format(p.y)}</text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

/** Ring showing one percentage. */
export function Ring({ value, label, sub }: { value: number; label: string; sub?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 84 84" className="h-20 w-20 shrink-0 -rotate-90" aria-hidden>
        <circle cx="42" cy="42" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="42" cy="42" r={r} fill="none" stroke="#0b3c6f" strokeWidth="10" strokeDasharray={`${(v / 100) * c} ${c}`} strokeLinecap="round" />
      </svg>
      <div><p className="text-2xl font-bold tabular-nums text-slate-900">{v}%</p><p className="text-sm font-medium text-slate-700">{label}</p>{sub && <p className="text-xs text-slate-500">{sub}</p>}</div>
    </div>
  );
}

export const PALETTE = ["#0b3c6f", "#f5a623", "#0f9d8a", "#7c5cc4", "#e2574c", "#3a86c8", "#94a3b8", "#c08a1e"];

/** Donut with a legend; each slice's value and share is listed as text. */
export function Donut({ data, format = (v: number) => String(v), center }: { data: { label: string; value: number }[]; format?: (v: number) => string; center?: string }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  if (!total) return <p className="text-sm text-slate-500">No data yet.</p>;
  const r = 40, c = 2 * Math.PI * r;
  const lens = data.map((d) => (d.value / total) * c);
  const offs = lens.map((_, i) => lens.slice(0, i).reduce((a, v) => a + v, 0));
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0" role="img" aria-label={data.map((d) => `${d.label} ${format(d.value)}`).join(", ")}>
        <g transform="rotate(-90 50 50)">
          {data.map((d, i) => {
            const len = lens[i];
            return <circle key={d.label} cx="50" cy="50" r={r} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth="16" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offs[i]} />;
          })}
        </g>
        <text x="50" y="54" textAnchor="middle" fontSize="13" fontWeight="700" fill="#071f3a">{center ?? format(total)}</text>
      </svg>
      <ul className="grid min-w-0 flex-1 gap-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} aria-hidden />
            <span className="min-w-0 flex-1 truncate text-slate-700">{d.label}</span>
            <span className="font-semibold tabular-nums">{format(d.value)}</span>
            <span className="w-10 text-right text-xs text-slate-500">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Vertical grouped columns: one group per x label, one bar per series. */
export function Columns({ labels, series, format = (v: number) => String(v) }: { labels: string[]; series: { name: string; values: number[] }[]; format?: (v: number) => string }) {
  if (!labels.length) return <p className="text-sm text-slate-500">No data yet.</p>;
  const W = 900, H = 240, P = 30, B = 26;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const gw = (W - 2 * P) / labels.length;
  const bw = Math.min(48, (gw * 0.7) / series.length);
  return (
    <figure>
      {series.length > 1 && <Legend names={series.map((s) => s.name)} />}
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={series.map((s) => `${s.name}: ${labels.map((l, i) => `${l} ${format(s.values[i])}`).join(", ")}`).join("; ")}>
        <line x1={P} x2={W - P} y1={H - B} y2={H - B} stroke="#cbd5e1" />
        {labels.map((l, i) => {
          const x0 = P + i * gw + (gw - bw * series.length) / 2;
          return (
            <g key={l}>
              {series.map((s, k) => {
                const v = s.values[i] ?? 0, h = (v / max) * (H - B - 24);
                return (
                  <g key={s.name}>
                    <rect x={x0 + k * bw} y={H - B - h} width={bw - 3} height={h} rx="3" fill={PALETTE[k % PALETTE.length]} />
                    {v > 0 && <text x={x0 + k * bw + (bw - 3) / 2} y={H - B - h - 5} textAnchor="middle" fontSize="11" fontWeight="600" fill="#071f3a">{format(v)}</text>}
                  </g>
                );
              })}
              <text x={P + i * gw + gw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">{l.length > 16 ? l.slice(0, 15) + "…" : l}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/** Several lines over the same x labels. */
export function MultiLine({ labels, series, format = (v: number) => String(v) }: { labels: string[]; series: { name: string; values: number[] }[]; format?: (v: number) => string }) {
  if (!labels.length) return <p className="text-sm text-slate-500">No data yet.</p>;
  const W = 900, H = 240, P = 40;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const xs = (i: number) => P + (labels.length === 1 ? (W - 2 * P) / 2 : (i * (W - 2 * P)) / (labels.length - 1));
  const ys = (v: number) => H - P - (v / max) * (H - 2 * P);
  return (
    <figure>
      <Legend names={series.map((s) => s.name)} />
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={series.map((s) => `${s.name}: ${labels.map((l, i) => `${l} ${format(s.values[i])}`).join(", ")}`).join("; ")}>
        {[0, 0.5, 1].map((g) => <g key={g}><line x1={P} x2={W - P} y1={ys(max * g)} y2={ys(max * g)} stroke="#e2e8f0" strokeDasharray="4 4" /><text x={P - 6} y={ys(max * g) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{format(max * g)}</text></g>)}
        {series.map((s, k) => (
          <g key={s.name}>
            <polyline points={s.values.map((v, i) => `${xs(i)},${ys(v)}`).join(" ")} fill="none" stroke={PALETTE[k % PALETTE.length]} strokeWidth="3" strokeLinejoin="round" />
            {s.values.map((v, i) => <circle key={i} cx={xs(i)} cy={ys(v)} r="4.5" fill="#fff" stroke={PALETTE[k % PALETTE.length]} strokeWidth="2.5"><title>{`${s.name} · ${labels[i]}: ${format(v)}`}</title></circle>)}
          </g>
        ))}
        {labels.map((l, i) => <text key={l} x={xs(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#64748b">{l}</text>)}
      </svg>
    </figure>
  );
}

function Legend({ names }: { names: string[] }) {
  return (
    <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
      {names.map((n, k) => <span key={n} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: PALETTE[k % PALETTE.length] }} aria-hidden />{n}</span>)}
    </div>
  );
}
