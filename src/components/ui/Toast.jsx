import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

/**
 * @param {'success' | 'error' | 'info'} type
 * @param {string} message
 * @param {Function} onClose
 * @param {number} duration - ms before auto-close
 */
export default function Toast({ type = 'success', message, onClose, duration = 3500 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay for enter animation
    const show = setTimeout(() => setVisible(true), 20);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for exit animation
    }, duration);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <AlertCircle size={18} />,
  };

  return (
    <div
      className={[styles.toast, styles[type], visible ? styles.visible : '']
        .filter(Boolean)
        .join(' ')}
      role="alert"
    >
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}