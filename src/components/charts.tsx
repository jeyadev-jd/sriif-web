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
