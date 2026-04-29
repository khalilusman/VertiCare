// ============================================================
// TriggerChart — most common triggers (horizontal BarChart)
// ============================================================

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';
import styles from './ChartCard.module.css';

const COLORS = ['#4BA3A3', '#7FB3D5', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#FB923C', '#60A5FA', '#F472B6'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipVal}>{payload[0].payload.name}: <strong>{payload[0].value} times</strong></p>
    </div>
  );
};

export default function TriggerChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <Card padding="md" className={styles.card}>
        <h3 className={styles.title}>Common Triggers</h3>
        <div className={styles.empty}>No trigger data for this period</div>
      </Card>
    );
  }

  return (
    <Card padding="md" className={styles.card}>
      <h3 className={styles.title}>Common Triggers</h3>
      <p className={styles.sub}>How often each trigger was reported</p>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5EDEF" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}