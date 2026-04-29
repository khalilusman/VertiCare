import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/symptoms/new': 'Log Episode',
  '/diary': 'Personal Diary',
  '/tracker': 'Health Tracker',
  '/profile': 'Your Profile',
};

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?';

  const pageTitle = PAGE_TITLES[location.pathname] || 'VertiCare';

  return (
    <header className={styles.navbar}>
      <button
        className={styles.menuToggle}
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>

      <span className={styles.pageTitle}>{pageTitle}</span>
      <div className={styles.spacer} />

      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={17} />
        </button>

        <div className={styles.userWrapper}>
          <button
            className={styles.userBtn}
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.userName}>
              {currentUser?.name?.split(' ')[0]}
            </span>
            <ChevronDown size={14} className={styles.chevron} />
          </button>

          {showUserMenu && (
            <>
              <div
                className={styles.overlay}
                onClick={() => setShowUserMenu(false)}
              />
              <div className={styles.dropdown}>
                <div className={styles.dropdownUser}>
                  <div className={styles.dropdownAvatar}>{initials}</div>
                  <div>
                    <p className={styles.dropdownName}>{currentUser?.name}</p>
                    <p className={styles.dropdownEmail}>{currentUser?.email}</p>
                  </div>
                </div>
                <hr className={styles.divider} />
                <button
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}