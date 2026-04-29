import { useNavigate } from 'react-router-dom';
import { Activity, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { timeAgo } from '../../utils/dateHelpers';
import { severityLabel, severityColor } from '../../utils/calculations';
import styles from './RecentSymptoms.module.css';

export default function RecentSymptoms({ symptoms = [] }) {
  const navigate = useNavigate();

  if (symptoms.length === 0) {
    return (
      <Card padding="lg" className={styles.empty}>
        <div className={styles.emptyIcon}>
          <Activity size={32} />
        </div>
        <p className={styles.emptyTitle}>No episodes logged yet</p>
        <p className={styles.emptyText}>
          Start tracking your vertigo episodes to see patterns and progress.
        </p>
        <Button size="sm" onClick={() => navigate('/symptoms/new')}>
          Log your first episode
        </Button>
      </Card>
    );
  }

  return (
    <div className={styles.list}>
      {symptoms.map((s) => (
        <Card key={s.id} padding="sm" className={styles.item}>
          {/* Severity indicator bar */}
          <div
            className={styles.severityBar}
            style={{ background: severityColor(s.severity) }}
          />

          <div className={styles.itemContent}>
            <div className={styles.itemLeft}>
              <div className={styles.itemHeader}>
                <span
                  className={styles.severity}
                  style={{ color: severityColor(s.severity) }}
                >
                  {severityLabel(s.severity)}
                </span>
                <span className={styles.severityNum}>
                  {s.severity}/10
                </span>
              </div>

              {/* Duration */}
              {s.duration && (
                <p className={styles.duration}>Duration: {s.duration}</p>
              )}

              {/* Triggers */}
              {s.triggers && s.triggers.length > 0 && (
                <div className={styles.triggers}>
                  {s.triggers.slice(0, 3).map((t) => (
                    <Badge key={t} variant="primary">
                      {t}
                    </Badge>
                  ))}
                  {s.triggers.length > 3 && (
                    <Badge variant="default">+{s.triggers.length - 3}</Badge>
                  )}
                </div>
              )}
            </div>

            <div className={styles.itemRight}>
              <p className={styles.time}>{timeAgo(s.dateTime)}</p>
              <ChevronRight size={16} className={styles.chevron} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}