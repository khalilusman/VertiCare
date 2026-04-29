import { Link } from 'react-router-dom';
import {
  Activity,
  BookOpen,
  LineChart,
  BarChart2,
  Heart,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Button from '../components/ui/Button';
import styles from './Landing.module.css';

const FEATURES = [
  {
    icon: Activity,
    title: 'Symptom Logging',
    desc: 'Track severity, duration, triggers, and medications for each vertigo episode.',
    color: '#3D9E9E',
    bg: 'rgba(61, 158, 158, 0.08)',
  },
  {
    icon: BookOpen,
    title: 'Personal Diary',
    desc: 'Keep a private journal to capture thoughts, patterns, and daily wellbeing.',
    color: '#6AAED4',
    bg: 'rgba(106, 174, 212, 0.1)',
  },
  {
    icon: LineChart,
    title: 'Health Tracker',
    desc: 'Monitor your progress over time and identify what helps you feel better.',
    color: '#2EBD8A',
    bg: 'rgba(46, 189, 138, 0.1)',
  },
  {
    icon: BarChart2,
    title: 'Visual Reports',
    desc: 'Clear charts and summaries that you can share with your healthcare team.',
    color: '#F0A030',
    bg: 'rgba(240, 160, 48, 0.1)',
  },
];

export default function Landing() {
  return (
    <div className={styles.page}>
      {/* ---- Nav ---- */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <span className={styles.navLogoIcon}>
            <Heart size={16} fill="currentColor" />
          </span>
          <span className={styles.navLogoText}>VertiCare</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <ShieldCheck size={14} />
          <span>Private &amp; secure — your data stays on your device</span>
        </div>

        <h1 className={styles.heroTitle}>
          Track your vertigo.
          <br />
          <em>Understand your health.</em>
        </h1>

        <p className={styles.heroSub}>
          VertiCare is a calm, easy-to-use health companion designed for
          people living with vertigo and balance disorders. Log episodes,
          identify triggers, and share insights with your doctor.
        </p>

        <div className={styles.heroCtas}>
          <Link to="/signup">
            <Button size="lg">
              Start tracking for free
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="lg">
              Sign in to your account
            </Button>
          </Link>
        </div>

        {/* Decorative stats row */}
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>100%</span>
            <span className={styles.statLabel}>Private</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>Free</span>
            <span className={styles.statLabel}>No cost</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>Easy</span>
            <span className={styles.statLabel}>Designed for episodes</span>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.sectionTitle}>Everything you need to stay informed</h2>
          <p className={styles.sectionSub}>
            Purpose-built for people with vertigo — calm design, large controls,
            no distracting animations.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ color, background: bg }}>
                <Icon size={24} />
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className={styles.ctaBanner}>
        <h2 className={styles.ctaTitle}>Ready to take control of your health?</h2>
        <p className={styles.ctaSub}>
          Create your free account in seconds. No credit card required.
        </p>
        <Link to="/signup">
          <Button size="lg">
            Create free account
            <ArrowRight size={18} />
          </Button>
        </Link>
      </section>

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <Heart size={14} fill="currentColor" />
          <span>VertiCare</span>
        </div>
        <p className={styles.footerNote}>
          This app is not a medical device and does not provide medical advice.
          Always consult your healthcare provider.
        </p>
      </footer>
    </div>
  );
}