import { useNavigate } from 'react-router-dom';
import { Activity, BookOpen, LineChart } from 'lucide-react';
import styles from './QuickActions.module.css';

const ACTIONS = [
  {
    icon: Activity,
    label: 'Log Symptom',
    sub: 'Record an episode',
    to: '/symptoms/new',
    accent: 'var(--primary)',
    bg: 'rgba(61, 158, 158, 0.07)',
  },
  {
    icon: BookOpen,
    label: 'Open Diary',
    sub: 'Write a note',
    to: '/diary',
    accent: 'var(--secondary)',
    bg: 'rgba(106, 174, 212, 0.07)',
  },
  {
    icon: LineChart,
    label: 'View Tracker',
    sub: 'See your charts',
    to: '/tracker',
    accent: 'var(--warning)',
    bg: 'rgba(240, 160, 48, 0.07)',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className={styles.grid}>
      {ACTIONS.map(({ icon: Icon, label, sub, to, accent, bg }) => (
        <button
          key={to}
          className={styles.action}
          style={{ '--accent': accent, '--bg': bg }}
          onClick={() => navigate(to)}
        >
          <span className={styles.iconWrap}>
            <Icon size={20} />
          </span>
          <div className={styles.actionText}>
            <span className={styles.actionLabel}>{label}</span>
            <span className={styles.actionSub}>{sub}</span>
          </div>
        </button>
      ))}
    </div>
  );
}