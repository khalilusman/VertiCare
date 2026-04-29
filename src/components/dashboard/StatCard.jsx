import Card from '../ui/Card';
import styles from './StatCard.module.css';

/**
 * @param {React.ReactNode} icon
 * @param {string} label
 * @param {string|number} value
 * @param {string} [sub] - secondary detail text
 * @param {'default'|'primary'|'warning'|'danger'|'success'} [accent]
 */
export default function StatCard({ icon, label, value, sub, accent = 'primary' }) {
  return (
    <Card className={styles.card} padding="md">
      <div className={[styles.iconWrap, styles[accent]].join(' ')}>
        {icon}
      </div>
      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value ?? '—'}</p>
        {sub && <p className={styles.sub}>{sub}</p>}
      </div>
    </Card>
  );
}