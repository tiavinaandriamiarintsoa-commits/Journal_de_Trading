import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatDate, formatMonnaie } from '../utils/format';

export default function GraphiqueEvolution({ donnees }) {
  if (!donnees || donnees.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-dim text-sm">
        Aucun trade sur cette période
      </div>
    );
  }

  const donneesFormatees = donnees.map((d) => ({ ...d, dateLabel: formatDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={donneesFormatees} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="degradeEvolution" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A227" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#2c303a" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="dateLabel"
          stroke="#62666f"
          tick={{ fill: '#8b8f98', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#2c303a' }}
          minTickGap={30}
        />
        <YAxis
          stroke="#62666f"
          tick={{ fill: '#8b8f98', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={60}
          tickFormatter={(v) => `${v}$`}
        />
        <Tooltip
          contentStyle={{
            background: '#1c1f27',
            border: '1px solid #2c303a',
            borderRadius: 8,
            fontSize: 13,
          }}
          labelStyle={{ color: '#8b8f98' }}
          formatter={(value) => [formatMonnaie(value), 'Cumulé']}
        />
        <Area
          type="monotone"
          dataKey="resultatCumule"
          stroke="#C9A227"
          strokeWidth={2}
          fill="url(#degradeEvolution)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
