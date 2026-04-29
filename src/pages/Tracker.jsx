// Tracker Page — visual charts + symptom timeline

import { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import DateRangeFilter from '../components/tracker/DateRangeFilter';
import SeverityChart from '../components/tracker/SeverityChart';
import FrequencyChart from '../components/tracker/FrequencyChart';
import TriggerChart from '../components/tracker/TriggerChart';
import MedicationChart from '../components/tracker/MedicationChart';
import SymptomTimeline from '../components/tracker/SymptomTimeline';
import Card from '../components/ui/Card';
import { getLast30DaysRange } from '../utils/dateHelpers';
import { getSeverityTrendData, getFrequencyData, getTriggerChartData, getMedicationChartData } from '../utils/calculations';
import styles from './Tracker.module.css';

export default function Tracker() {
  const { symptoms, getFilteredSymptoms } = useHealthData();

  // Default to last 30 days
  const defaultRange = getLast30DaysRange();
  const [range, setRange] = useState(defaultRange);

  const filtered = useMemo(() => {
    if (!range.start && !range.end) return symptoms;
    return getFilteredSymptoms(range.start, range.end);
  }, [symptoms, range, getFilteredSymptoms]);

  const chartData = useMemo(() => ({
    severityTrend: getSeverityTrendData(filtered),
    frequency: getFrequencyData(filtered),
    triggers: getTriggerChartData(filtered),
    medications: getMedicationChartData(filtered),
  }), [filtered]);

  const [activeTab, setActiveTab] = useState('charts');

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Health Tracker</h1>
          <p className={styles.subtitle}>Visualize your symptom patterns over time.</p>
        </div>
        <div className={styles.episodeCount}>
          <Activity size={16} />
          <span>{filtered.length} episode{filtered.length !== 1 ? 's' : ''} in period</span>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card padding="md">
        <DateRangeFilter onChange={setRange} />
      </Card>

      {/* Tab switcher */}
      <div className={styles.tabs}>
        <button
          className={[styles.tab, activeTab === 'charts' ? styles.activeTab : ''].join(' ')}
          onClick={() => setActiveTab('charts')}
        >
          Charts
        </button>
        <button
          className={[styles.tab, activeTab === 'timeline' ? styles.activeTab : ''].join(' ')}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>

      {/* Charts view */}
      {activeTab === 'charts' && (
        <div className={styles.chartsGrid}>
          <div className={styles.fullWidth}>
            <SeverityChart data={chartData.severityTrend} />
          </div>
          <div className={styles.fullWidth}>
            <FrequencyChart data={chartData.frequency} />
          </div>
          <TriggerChart data={chartData.triggers} />
          <MedicationChart data={chartData.medications} />
        </div>
      )}

      {/* Timeline view */}
      {activeTab === 'timeline' && (
        <div className={styles.timelineSection}>
          <SymptomTimeline symptoms={filtered} />
        </div>
      )}
    </div>
  );
}