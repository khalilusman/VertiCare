import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className={styles.shell}>
      {/* Mobile overlay backdrop */}
      {menuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={[styles.sidebarWrapper, menuOpen ? styles.sidebarOpen : ''].join(' ')}>
        <Sidebar onClose={() => setMenuOpen(false)} />
      </div>

      {/* Main content area */}
      <div className={styles.main}>
        <Navbar
          onMenuToggle={() => setMenuOpen((v) => !v)}
          menuOpen={menuOpen}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}