// ============================================================
// SeverityChart — severity trend over time (LineChart)
// ============================================================

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Card from '../ui/Card';
import styles from './ChartCard.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{label}</p>
      <p className={styles.tooltipVal}>Severity: <strong>{payload[0].value}/10</strong></p>
    </div>
  );
};

export default function SeverityChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <Card padding="md" className={styles.card}>
        <h3 className={styles.title}>Severity Trend</h3>
        <div className={styles.empty}>No data for this period</div>
      </Card>
    );
  }

  return (
    <Card padding="md" className={styles.card}>
      <h3 className={styles.title}>Severity Trend</h3>
      <p className={styles.sub}>Episode severity over time (1–10)</p>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5EDEF" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} ticks={[0, 2, 4, 6, 8, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={7} stroke="#F87171" strokeDasharray="4 4" strokeOpacity={0.6} />
            <ReferenceLine y={4} stroke="#FBBF24" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Line
              type="monotone" dataKey="severity"
              stroke="#4BA3A3" strokeWidth={2.5}
              dot={{ fill: '#4BA3A3', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#357878' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem} style={{ color: '#34D399' }}>● Mild (1–3)</span>
        <span className={styles.legendItem} style={{ color: '#FBBF24' }}>● Moderate (4–6)</span>
        <span className={styles.legendItem} style={{ color: '#F87171' }}>● Severe (7–10)</span>
      </div>
    </Card>
  );
}