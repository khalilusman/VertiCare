// ============================================================
// MedicationChart — medication usage frequency (BarChart)
// ============================================================

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';
import styles from './ChartCard.module.css';

const COLORS = ['#34D399', '#4BA3A3', '#7FB3D5', '#FBBF24', '#F87171', '#A78BFA'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipVal}>{payload[0].payload.name}: <strong>{payload[0].value} times</strong></p>
    </div>
  );
};

export default function MedicationChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <Card padding="md" className={styles.card}>
        <h3 className={styles.title}>Medication Usage</h3>
        <div className={styles.empty}>No medication data for this period</div>
      </Card>
    );
  }

  return (
    <Card padding="md" className={styles.card}>
      <h3 className={styles.title}>Medication Usage</h3>
      <p className={styles.sub}>Times each medication was taken</p>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5EDEF" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}