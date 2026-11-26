interface AxisPoint {
  label: string;
  value: number; // 0-100
}

export function StatRadarChart({
  axes,
  accentColor = "#00E5FF",
}: {
  axes: AxisPoint[];
  accentColor?: string;
}) {
  const cx = 130;
  const cy = 120;
  const radius = 78;
  const count = axes.length;

  const pointAt = (index: number, pct: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (radius * Math.max(0, Math.min(100, pct))) / 100;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const rings = [25, 50, 75, 100];
  const dataPoly = axes
    .map((a, i) => {
      const p = pointAt(i, a.value);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 245" className="h-56 w-full max-w-[260px]">
        {rings.map((pct) => {
          const pts = axes
            .map((_, i) => {
              const p = pointAt(i, pct);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            })
            .join(" ");
          return (
            <polygon
              key={pct}
              points={pts}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        {axes.map((_, i) => {
          const end = pointAt(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={dataPoly}
          fill={accentColor}
          fillOpacity="0.22"
          stroke={accentColor}
          strokeWidth="2.2"
        />

        {axes.map((a, i) => {
          const p = pointAt(i, a.value);
          const labelPos = pointAt(i, 124);
          return (
            <g key={a.label}>
              <circle cx={p.x} cy={p.y} r="3.5" fill={accentColor} stroke="#0D0F14" strokeWidth="1.5" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#CBD5E1"
                fontSize="11"
                fontWeight="600"
              >
                {a.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function StatBar({
  label,
  value,
  accentColor = "#00E5FF",
}: {
  label: string;
  value: number;
  accentColor?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-300">{label}</span>
        <span className="font-mono font-bold text-white">{value}/100</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}
