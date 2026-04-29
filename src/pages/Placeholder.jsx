// Placeholder Page — used for routes coming in Part 2

import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import styles from './Placeholder.module.css';

export default function Placeholder({ title = 'Coming Soon', description }) {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <Construction size={36} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.desc}>
          {description ||
            'This section is under construction and will be available in Part 2 of VertigoTrack.'}
        </p>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
}