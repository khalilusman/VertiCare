import styles from './Badge.module.css';

/**
 * @param {'default' | 'primary' | 'success' | 'warning' | 'danger'} variant
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}