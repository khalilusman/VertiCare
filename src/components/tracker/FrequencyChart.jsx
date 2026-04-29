// ============================================================
// FrequencyChart — episodes per day (BarChart)
// ============================================================

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import styles from './ChartCard.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{label}</p>
      <p className={styles.tooltipVal}>Episodes: <strong>{payload[0].value}</strong></p>
    </div>
  );
};

export default function FrequencyChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <Card padding="md" className={styles.card}>
        <h3 className={styles.title}>Episode Frequency</h3>
        <div className={styles.empty}>No data for this period</div>
      </Card>
    );
  }

  return (
    <Card padding="md" className={styles.card}>
      <h3 className={styles.title}>Episode Frequency</h3>
      <p className={styles.sub}>Number of episodes per day</p>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5EDEF" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="episodes" fill="#7FB3D5" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}