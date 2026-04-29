// Symptom Logger Page — log a new vertigo episode

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import { toDateTimeLocal, nowISO } from '../utils/dateHelpers';
import { severityLabel, severityColor } from '../utils/calculations';
import styles from './SymptomLogger.module.css';

const TRIGGER_OPTIONS = [
  'Stress',
  'Bright light',
  'Dehydration',
  'Lack of sleep',
  'Screen time',
  'Food',
  'Noise',
  'Travel',
  'Unknown',
];

const INITIAL_FORM = {
  severity: 5,
  duration: '',
  dateTime: nowISO(),
  triggers: [],
  medicationInput: '',
  medications: [],
  whatHelped: '',
  notes: '',
};

export default function SymptomLogger() {
  const { addSymptom } = useHealthData();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---- Field handlers ----

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSeverityChange = (e) => setField('severity', Number(e.target.value));

  const handleDateChange = (e) => {
    // Convert datetime-local string back to ISO
    setField('dateTime', new Date(e.target.value).toISOString());
  };

  const toggleTrigger = (trigger) => {
    setForm((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter((t) => t !== trigger)
        : [...prev.triggers, trigger],
    }));
    if (errors.triggers) setErrors((prev) => ({ ...prev, triggers: '' }));
  };

  // Medication chip input
  const addMedication = () => {
    const med = form.medicationInput.trim();
    if (!med) return;
    if (!form.medications.includes(med)) {
      setForm((prev) => ({
        ...prev,
        medications: [...prev.medications, med],
        medicationInput: '',
      }));
    } else {
      setField('medicationInput', '');
    }
  };

  const removeMedication = (med) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m !== med),
    }));
  };

  const handleMedKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMedication();
    }
  };

  // ---- Validation ----

  const validate = () => {
    const errs = {};
    if (!form.duration.trim()) errs.duration = 'Please enter the episode duration.';
    if (!form.dateTime) errs.dateTime = 'Date and time are required.';
    return errs;
  };

  // ---- Submit ----

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    const symptomData = {
      severity: form.severity,
      duration: form.duration,
      dateTime: form.dateTime,
      triggers: form.triggers,
      medications: form.medications,
      whatHelped: form.whatHelped.trim(),
      notes: form.notes.trim(),
    };

    setTimeout(() => {
      addSymptom(symptomData);
      setToast({ type: 'success', message: 'Episode logged successfully!' });
      setTimeout(() => navigate('/dashboard'), 1800);
    }, 500);
  };

  const sColor = severityColor(form.severity);
  const sLabel = severityLabel(form.severity);

  return (
    <div className={styles.page}>
      {/* ---- Header ---- */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        <div>
          <h1 className={styles.title}>Log Episode</h1>
          <p className={styles.subtitle}>Record your current or recent vertigo episode.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.grid}>
          {/* ---- LEFT COLUMN ---- */}
          <div className={styles.col}>

            {/* Severity */}
            <Card padding="md" className={styles.card}>
              <h2 className={styles.cardTitle}>Severity</h2>
              <p className={styles.cardSub}>How intense was this episode?</p>

              <div className={styles.severityDisplay}>
                <span
                  className={styles.severityNum}
                  style={{ color: sColor }}
                >
                  {form.severity}
                </span>
                <span className={styles.severityOf}>/10</span>
                <span
                  className={styles.severityLabel}
                  style={{ color: sColor }}
                >
                  {sLabel}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={form.severity}
                onChange={handleSeverityChange}
                className={styles.slider}
                style={{ '--thumb-color': sColor }}
                aria-label="Severity from 1 to 10"
              />

              <div className={styles.sliderLabels}>
                <span>1 — Very Mild</span>
                <span>10 — Very Severe</span>
              </div>
            </Card>

            {/* Duration & Date */}
            <Card padding="md" className={styles.card}>
              <h2 className={styles.cardTitle}>When &amp; How Long</h2>

              <div className={styles.fieldGroup}>
                <Input
                  id="duration"
                  label="Duration"
                  placeholder="e.g. 30 minutes, 2 hours"
                  value={form.duration}
                  onChange={(e) => setField('duration', e.target.value)}
                  error={errors.duration}
                />

                <Input
                  id="dateTime"
                  label="Date & Time"
                  type="datetime-local"
                  value={toDateTimeLocal(form.dateTime)}
                  onChange={handleDateChange}
                  error={errors.dateTime}
                />
              </div>
            </Card>

            {/* What Helped & Notes */}
            <Card padding="md" className={styles.card}>
              <h2 className={styles.cardTitle}>Notes</h2>

              <div className={styles.fieldGroup}>
                <div className={styles.textareaField}>
                  <label htmlFor="whatHelped" className={styles.fieldLabel}>
                    What Helped
                  </label>
                  <textarea
                    id="whatHelped"
                    rows={3}
                    placeholder="e.g. Resting in a dark room, drinking water…"
                    value={form.whatHelped}
                    onChange={(e) => setField('whatHelped', e.target.value)}
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.textareaField}>
                  <label htmlFor="notes" className={styles.fieldLabel}>
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Any other observations about this episode…"
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* ---- RIGHT COLUMN ---- */}
          <div className={styles.col}>

            {/* Triggers */}
            <Card padding="md" className={styles.card}>
              <h2 className={styles.cardTitle}>Triggers</h2>
              <p className={styles.cardSub}>Select all that may have contributed.</p>
              {errors.triggers && (
                <p className={styles.fieldError}>{errors.triggers}</p>
              )}
              <div className={styles.triggerGrid}>
                {TRIGGER_OPTIONS.map((trigger) => {
                  const selected = form.triggers.includes(trigger);
                  return (
                    <button
                      key={trigger}
                      type="button"
                      className={[
                        styles.triggerChip,
                        selected ? styles.triggerSelected : '',
                      ].join(' ')}
                      onClick={() => toggleTrigger(trigger)}
                      aria-pressed={selected}
                    >
                      {trigger}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Medications */}
            <Card padding="md" className={styles.card}>
              <h2 className={styles.cardTitle}>Medications Taken</h2>
              <p className={styles.cardSub}>
                Type a medication name and press Enter or Add.
              </p>

              {/* Chips */}
              {form.medications.length > 0 && (
                <div className={styles.medChips}>
                  {form.medications.map((med) => (
                    <span key={med} className={styles.medChip}>
                      {med}
                      <button
                        type="button"
                        className={styles.medChipRemove}
                        onClick={() => removeMedication(med)}
                        aria-label={`Remove ${med}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.medInputRow}>
                <Input
                  id="medicationInput"
                  placeholder="e.g. Betahistine"
                  value={form.medicationInput}
                  onChange={(e) => setField('medicationInput', e.target.value)}
                  onKeyDown={handleMedKeyDown}
                  containerClassName={styles.medInputContainer}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addMedication}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              Save Episode
            </Button>

            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>

      {/* Toast notification */}
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