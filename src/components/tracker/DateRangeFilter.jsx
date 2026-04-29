// DateRangeFilter — filter controls for the Tracker page

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { getThisWeekRange, getThisMonthRange, getLast30DaysRange } from '../../utils/dateHelpers';
import styles from './DateRangeFilter.module.css';

const PRESETS = [
  { label: 'This Week', fn: getThisWeekRange },
  { label: 'This Month', fn: getThisMonthRange },
  { label: 'Last 30 Days', fn: getLast30DaysRange },
  { label: 'All Time', fn: () => ({ start: null, end: null }) },
];

export default function DateRangeFilter({ onChange }) {
  const [active, setActive] = useState('Last 30 Days');
  const [custom, setCustom] = useState({ start: '', end: '' });
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = (preset) => {
    setActive(preset.label);
    setShowCustom(false);
    const range = preset.fn();
    onChange(range);
  };

  const handleCustom = () => {
    if (!custom.start || !custom.end) return;
    const start = new Date(custom.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(custom.end);
    end.setHours(23, 59, 59, 999);
    setActive('Custom');
    onChange({ start: start.toISOString(), end: end.toISOString() });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.presets}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={[styles.preset, active === p.label ? styles.activePreset : ''].join(' ')}
            onClick={() => handlePreset(p)}
          >
            {p.label}
          </button>
        ))}
        <button
          className={[styles.preset, showCustom ? styles.activePreset : ''].join(' ')}
          onClick={() => setShowCustom((v) => !v)}
        >
          <Calendar size={14} />
          Custom
        </button>
      </div>

      {showCustom && (
        <div className={styles.customRow}>
          <div className={styles.customField}>
            <label className={styles.customLabel}>Start Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={custom.start}
              onChange={(e) => setCustom((p) => ({ ...p, start: e.target.value }))}
            />
          </div>
          <div className={styles.customField}>
            <label className={styles.customLabel}>End Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={custom.end}
              onChange={(e) => setCustom((p) => ({ ...p, end: e.target.value }))}
            />
          </div>
          <button className={styles.applyBtn} onClick={handleCustom}>Apply</button>
        </div>
      )}
    </div>
  );
}