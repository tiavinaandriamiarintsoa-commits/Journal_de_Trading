import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { formatMonnaie } from '../utils/format';

export default function GraphiqueEmotions({ resultatParEmotion }) {
  const entrees = Object.entries(resultatParEmotion || {});

  if (entrees.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-dim text-sm">
        Aucune donnée sur cette période
      </div>
    );
  }

  const donnees = entrees
    .map(([emotion, val]) => ({ emotion, profit: Math.round(val.profit * 100) / 100, nombreTrades: val.nombreTrades }))
    .sort((a, b) => b.profit - a.profit);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={donnees} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} layout="vertical">
        <CartesianGrid stroke="#2c303a" horizontal={false} />
        <XAxis
          type="number"
          stroke="#62666f"
          tick={{ fill: '#8b8f98', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#2c303a' }}
          tickFormatter={(v) => `${v}$`}
        />
        <YAxis
          type="category"
          dataKey="emotion"
          stroke="#62666f"
          tick={{ fill: '#e8e6e0', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            background: '#1c1f27',
            border: '1px solid #2c303a',
            borderRadius: 8,
            fontSize: 13,
          }}
          labelStyle={{ color: '#e8e6e0' }}
          formatter={(value, name, props) => [
            `${formatMonnaie(value)} (${props.payload.nombreTrades} trade${props.payload.nombreTrades > 1 ? 's' : ''})`,
            'Résultat',
          ]}
        />
        <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
          {donnees.map((entree, index) => (
            <Cell key={index} fill={entree.profit >= 0 ? '#4F9D69' : '#C1544A'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
