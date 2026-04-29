import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, BookOpen, LineChart, User, Heart } from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/symptoms/new', icon: Activity, label: 'Log Symptom' },
  { to: '/diary', icon: BookOpen, label: 'Diary' },
  { to: '/tracker', icon: LineChart, label: 'Tracker' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ onClose }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <Heart size={18} fill="currentColor" />
        </span>
        <span className={styles.logoText}>VertiCare</span>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <ul className={styles.navList}>
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.active : ''].join(' ')
                }
                onClick={onClose}
              >
                <span className={styles.navIconWrap}>
                  <Icon size={17} />
                </span>
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarBottom}>
        <div className={styles.sidebarBottomCard}>
          <Heart size={14} fill="currentColor" className={styles.bottomHeart} />
          <p className={styles.bottomText}>Track your health, one day at a time.</p>
        </div>
      </div>
    </aside>
  );
}