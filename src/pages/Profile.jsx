// Profile Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, X, User, Mail, Calendar, Pill, Zap, Trash2, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/dateHelpers';
import styles from './Profile.module.css';

const TRIGGER_OPTIONS = ['Stress', 'Bright light', 'Dehydration', 'Lack of sleep', 'Screen time', 'Food', 'Noise', 'Travel', 'Unknown'];

export default function Profile() {
  const { currentUser, logout, updateProfile } = useAuth();
  const { loadDemoData, clearAllData, symptoms, diaryEntries } = useHealthData();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [nameError, setNameError] = useState('');

  const [medications, setMedications] = useState(currentUser?.medications || []);
  const [medInput, setMedInput] = useState('');

  const [triggers, setTriggers] = useState(currentUser?.triggers || []);

  const [toast, setToast] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const showToast = (type, message) => setToast({ type, message });

  // ---- Name save ----
  const handleSaveName = () => {
    if (!name.trim()) { setNameError('Name cannot be empty.'); return; }
    const result = updateProfile({ name });
    if (result.success) showToast('success', 'Name updated successfully.');
    else showToast('error', result.error);
  };

  // ---- Medications ----
  const addMed = () => {
    const m = medInput.trim();
    if (!m || medications.includes(m)) { setMedInput(''); return; }
    const updated = [...medications, m];
    setMedications(updated);
    updateProfile({ medications: updated });
    setMedInput('');
  };

  const removeMed = (m) => {
    const updated = medications.filter((x) => x !== m);
    setMedications(updated);
    updateProfile({ medications: updated });
  };

  // ---- Triggers ----
  const toggleTrigger = (t) => {
    const updated = triggers.includes(t) ? triggers.filter((x) => x !== t) : [...triggers, t];
    setTriggers(updated);
    updateProfile({ triggers: updated });
  };

  // ---- Demo data ----
  const handleLoadDemo = () => {
    const result = loadDemoData();
    if (result?.alreadyLoaded) showToast('info', 'Demo data already loaded.');
    else showToast('success', 'Demo data loaded! Check Dashboard and Tracker.');
  };

  // ---- Clear data ----
  const handleClearData = () => {
    clearAllData();
    setConfirmClear(false);
    showToast('success', 'All your data has been cleared.');
  };

  // ---- Logout ----
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.subtitle}>Manage your account and preferences.</p>
      </div>

      {/* Account info */}
      <Card padding="md" className={styles.card}>
        <h2 className={styles.cardTitle}><User size={17} /> Account</h2>
        <div className={styles.infoRow}>
          <Mail size={15} className={styles.infoIcon} />
          <div>
            <p className={styles.infoLabel}>Email</p>
            <p className={styles.infoVal}>{currentUser?.email}</p>
          </div>
        </div>
        <div className={styles.infoRow}>
          <Calendar size={15} className={styles.infoIcon} />
          <div>
            <p className={styles.infoLabel}>Member since</p>
            <p className={styles.infoVal}>{formatDate(currentUser?.createdAt)}</p>
          </div>
        </div>
        <div className={styles.infoRow}>
          <Database size={15} className={styles.infoIcon} />
          <div>
            <p className={styles.infoLabel}>Data summary</p>
            <p className={styles.infoVal}>{symptoms.length} episodes · {diaryEntries.length} diary entries</p>
          </div>
        </div>

        {/* Edit name */}
        <div className={styles.nameEdit}>
          <label className={styles.fieldLabel}>Display Name</label>
          <div className={styles.nameRow}>
            <input
              className={[styles.input, nameError ? styles.inputError : ''].join(' ')}
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              placeholder="Your full name"
            />
            <Button size="sm" onClick={handleSaveName}>Save</Button>
          </div>
          {nameError && <p className={styles.fieldError}>{nameError}</p>}
        </div>
      </Card>

      {/* Medications */}
      <Card padding="md" className={styles.card}>
        <h2 className={styles.cardTitle}><Pill size={17} /> Current Medications</h2>
        <p className={styles.cardSub}>These are the medications you currently take for vertigo.</p>

        {medications.length > 0 && (
          <div className={styles.chips}>
            {medications.map((m) => (
              <span key={m} className={styles.chip}>
                {m}
                <button className={styles.chipRemove} onClick={() => removeMed(m)} title={`Remove ${m}`}><X size={12} /></button>
              </span>
            ))}
          </div>
        )}

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder="e.g. Betahistine"
            value={medInput}
            onChange={(e) => setMedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMed())}
          />
          <Button size="sm" variant="ghost" onClick={addMed}><Plus size={15} />Add</Button>
        </div>
      </Card>

      {/* Common triggers */}
      <Card padding="md" className={styles.card}>
        <h2 className={styles.cardTitle}><Zap size={17} /> Common Triggers</h2>
        <p className={styles.cardSub}>Select your known vertigo triggers.</p>
        <div className={styles.triggerGrid}>
          {TRIGGER_OPTIONS.map((t) => (
            <button
              key={t}
              className={[styles.triggerChip, triggers.includes(t) ? styles.triggerActive : ''].join(' ')}
              onClick={() => toggleTrigger(t)}
            >{t}</button>
          ))}
        </div>
        {triggers.length > 0 && (
          <p className={styles.triggerNote}>
            Selected: {triggers.map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
          </p>
        )}
      </Card>

      {/* Demo data */}
      <Card padding="md" className={styles.card}>
        <h2 className={styles.cardTitle}><Database size={17} /> Demo Data</h2>
        <p className={styles.cardSub}>Load sample data to see how charts and tracking look with populated data.</p>
        <Button variant="secondary" size="sm" onClick={handleLoadDemo}>
          <Database size={15} />
          Load Demo Data
        </Button>
      </Card>


      {/* Danger zone */}
      <Card padding="md" className={styles.dangerCard}>
        <h2 className={styles.dangerTitle}>Danger Zone</h2>

        {!confirmClear ? (
          <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)}>
            <Trash2 size={15} />
            Clear All My Data
          </Button>
        ) : (
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>This will permanently delete all your symptoms and diary entries. Are you sure?</p>
            <div className={styles.confirmActions}>
              <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleClearData}>Yes, delete everything</Button>
            </div>
          </div>
        )}

        <div className={styles.logoutSection}>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </Card>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}