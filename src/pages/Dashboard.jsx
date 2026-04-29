import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, TrendingDown, Clock, Zap, Pill, Database, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import StatCard from '../components/dashboard/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentSymptoms from '../components/dashboard/RecentSymptoms';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { timeAgo } from '../utils/dateHelpers';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { stats, getRecentSymptoms, loadDemoData } = useHealthData();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const recentSymptoms = getRecentSymptoms(5);
  const firstName = currentUser?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
      ? 'Good afternoon'
      : hour >= 17 && hour < 21
      ? 'Good evening'
      : 'Good night';

  const handleLoadDemo = () => {
    const result = loadDemoData();
    if (result?.alreadyLoaded)
      setToast({ type: 'info', message: 'Demo data is already loaded.' });
    else
      setToast({ type: 'success', message: 'Demo data loaded! Charts are now populated.' });
  };

  return (
    <div className={styles.page}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeLeft}>
          <p className={styles.greetingText}>{greeting}</p>
          <h1 className={styles.welcomeTitle}>{firstName} 👋</h1>
          <p className={styles.welcomeSub}>Here's your health summary for today.</p>
        </div>
        <div className={styles.welcomeActions}>
          {recentSymptoms.length === 0 && (
            <Button variant="ghost" size="sm" onClick={handleLoadDemo}>
              <Database size={14} />
              Load Demo
            </Button>
          )}
          <Button size="sm" onClick={() => navigate('/symptoms/new')}>
            <Activity size={14} />
            Log Episode
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.statsGrid}>
          <StatCard
            icon={<Activity size={20} />}
            label="Total Episodes"
            value={stats.totalEpisodes || 0}
            sub="All time"
            accent="primary"
          />
          <StatCard
            icon={<TrendingDown size={20} />}
            label="Avg Severity"
            value={stats.averageSeverity !== null ? `${stats.averageSeverity}/10` : '—'}
            sub="Across all episodes"
            accent={
              !stats.averageSeverity
                ? 'default'
                : stats.averageSeverity <= 4
                ? 'success'
                : stats.averageSeverity <= 7
                ? 'warning'
                : 'danger'
            }
          />
          <StatCard
            icon={<Clock size={20} />}
            label="Last Episode"
            value={stats.lastEpisode ? timeAgo(stats.lastEpisode) : '—'}
            sub="Most recent"
            accent="default"
          />
          <StatCard
            icon={<Zap size={20} />}
            label="Top Trigger"
            value={stats.mostCommonTrigger || '—'}
            sub="Most reported"
            accent="warning"
          />
          <StatCard
            icon={<Pill size={20} />}
            label="Top Medication"
            value={stats.mostUsedMedication || '—'}
            sub="Most taken"
            accent="success"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <QuickActions />
      </section>

      {/* Recent Episodes */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Episodes</h2>
          {recentSymptoms.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/tracker')}>
              View all <ArrowRight size={13} />
            </Button>
          )}
        </div>
        <RecentSymptoms symptoms={recentSymptoms} />
      </section>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}