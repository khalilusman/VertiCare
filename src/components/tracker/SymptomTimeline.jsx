// ============================================================
// SymptomTimeline — vertical timeline of episodes
// ============================================================

import { Activity } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDateTime } from '../../utils/dateHelpers';
import { severityLabel, severityColor } from '../../utils/calculations';
import styles from './SymptomTimeline.module.css';

export default function SymptomTimeline({ symptoms = [] }) {
  if (symptoms.length === 0) {
    return (
      <div className={styles.empty}>
        <Activity size={28} />
        <p>No episodes in this period</p>
      </div>
    );
  }

  const sorted = [...symptoms].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  return (
    <div className={styles.timeline}>
      {sorted.map((s, i) => {
        const color = severityColor(s.severity);
        const label = severityLabel(s.severity);
        const badgeVariant = s.severity <= 3 ? 'success' : s.severity <= 6 ? 'warning' : 'danger';

        return (
          <div key={s.id} className={styles.item}>
            {/* Timeline line + dot */}
            <div className={styles.lineCol}>
              <div className={styles.dot} style={{ borderColor: color, background: color + '22' }} />
              {i < sorted.length - 1 && <div className={styles.line} />}
            </div>

            {/* Content card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <Badge variant={badgeVariant}>{label}</Badge>
                  <span className={styles.severityNum} style={{ color }}>{s.severity}/10</span>
                </div>
                <span className={styles.dateTime}>{formatDateTime(s.dateTime)}</span>
              </div>

              <div className={styles.cardBody}>
                {s.duration && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Duration</span>
                    <span className={styles.fieldVal}>{s.duration}</span>
                  </div>
                )}

                {s.triggers?.length > 0 && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Triggers</span>
                    <div className={styles.chips}>
                      {s.triggers.map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
                    </div>
                  </div>
                )}

                {s.medications?.length > 0 && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Medications</span>
                    <div className={styles.chips}>
                      {s.medications.map((m) => <Badge key={m} variant="success">{m}</Badge>)}
                    </div>
                  </div>
                )}

                {s.whatHelped && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>What Helped</span>
                    <span className={styles.fieldVal}>{s.whatHelped}</span>
                  </div>
                )}

                {s.notes && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Notes</span>
                    <span className={styles.fieldVal}>{s.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}