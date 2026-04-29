// Diary Page — personal health diary with CRUD

import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, X, Check } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import { formatDate } from '../utils/dateHelpers';
import styles from './Diary.module.css';

const MOODS = ['Good', 'Okay', 'Dizzy', 'Tired', 'Anxious', 'Improving'];

const MOOD_VARIANTS = {
  Good: 'success', Improving: 'success', Okay: 'primary',
  Tired: 'default', Anxious: 'warning', Dizzy: 'danger',
};

const EMPTY_FORM = { title: '', mood: 'Okay', date: new Date().toISOString().slice(0, 10), content: '' };

// ---- Diary Form Modal ----
function DiaryModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(
    entry ? { title: entry.title, mood: entry.mood, date: entry.date, content: entry.content } : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); if (errors[k]) setErrors((p) => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.content.trim()) e.content = 'Please write something.';
    if (!form.date) e.date = 'Date is required.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{entry ? 'Edit Entry' : 'New Diary Entry'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm} noValidate>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Title</label>
            <input
              className={[styles.input, errors.title ? styles.inputError : ''].join(' ')}
              placeholder="How are you feeling today?"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
            {errors.title && <p className={styles.fieldError}>{errors.title}</p>}
          </div>

          {/* Mood + Date row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Mood</label>
              <div className={styles.moodGrid}>
                {MOODS.map((m) => (
                  <button
                    key={m} type="button"
                    className={[styles.moodChip, form.mood === m ? styles.moodActive : ''].join(' ')}
                    onClick={() => set('mood', m)}
                  >{m}</button>
                ))}
              </div>
            </div>
            <div className={styles.field} style={{ minWidth: 140 }}>
              <label className={styles.fieldLabel}>Date</label>
              <input
                type="date"
                className={[styles.input, errors.date ? styles.inputError : ''].join(' ')}
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
              {errors.date && <p className={styles.fieldError}>{errors.date}</p>}
            </div>
          </div>

          {/* Content */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Your entry</label>
            <textarea
              className={[styles.textarea, errors.content ? styles.inputError : ''].join(' ')}
              rows={6}
              placeholder="Write about how you felt today, what you noticed, or anything on your mind…"
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
            />
            {errors.content && <p className={styles.fieldError}>{errors.content}</p>}
          </div>

          <div className={styles.modalActions}>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit"><Check size={16} />{entry ? 'Save Changes' : 'Add Entry'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Diary Entry Card ----
function DiaryCard({ entry, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Card padding="md" className={styles.entryCard}>
      <div className={styles.entryHeader}>
        <div className={styles.entryMeta}>
          <Badge variant={MOOD_VARIANTS[entry.mood] || 'default'}>{entry.mood}</Badge>
          <span className={styles.entryDate}>{formatDate(entry.date)}</span>
        </div>
        <div className={styles.entryActions}>
          {confirmDelete ? (
            <>
              <span className={styles.confirmText}>Delete?</span>
              <button className={styles.iconBtn} onClick={() => onDelete(entry.id)} title="Confirm delete">
                <Check size={15} />
              </button>
              <button className={styles.iconBtn} onClick={() => setConfirmDelete(false)} title="Cancel">
                <X size={15} />
              </button>
            </>
          ) : (
            <>
              <button className={styles.iconBtn} onClick={() => onEdit(entry)} title="Edit"><Edit2 size={15} /></button>
              <button className={[styles.iconBtn, styles.deleteBtn].join(' ')} onClick={() => setConfirmDelete(true)} title="Delete"><Trash2 size={15} /></button>
            </>
          )}
        </div>
      </div>
      <h3 className={styles.entryTitle}>{entry.title}</h3>
      <p className={styles.entryContent}>{entry.content}</p>
    </Card>
  );
}

// ---- Main Page ----
export default function Diary() {
  const { diaryEntries, addDiaryEntry, updateDiaryEntry, deleteDiaryEntry } = useHealthData();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => setToast({ type, message });

  const sorted = useMemo(() => {
    return [...diaryEntries]
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q) || e.mood.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [diaryEntries, search]);

  const handleSave = (formData) => {
    if (editEntry) {
      updateDiaryEntry(editEntry.id, formData);
      showToast('success', 'Entry updated successfully.');
    } else {
      addDiaryEntry(formData);
      showToast('success', 'Diary entry added!');
    }
    setModalOpen(false);
    setEditEntry(null);
  };

  const handleEdit = (entry) => { setEditEntry(entry); setModalOpen(true); };
  const handleDelete = (id) => { deleteDiaryEntry(id); showToast('success', 'Entry deleted.'); };
  const openNew = () => { setEditEntry(null); setModalOpen(true); };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Personal Diary</h1>
          <p className={styles.subtitle}>A private space to track your daily wellbeing.</p>
        </div>
        <Button onClick={openNew}><Plus size={16} />New Entry</Button>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search entries by title, content, or mood…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clearSearch} onClick={() => setSearch('')}><X size={14} /></button>
        )}
      </div>

      {/* Entries */}
      {sorted.length === 0 ? (
        <Card padding="lg" className={styles.emptyCard}>
          <BookOpen size={36} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>
            {search ? 'No entries match your search' : 'No diary entries yet'}
          </p>
          <p className={styles.emptyText}>
            {search ? 'Try a different search term.' : 'Start writing to track your daily progress and feelings.'}
          </p>
          {!search && <Button size="sm" onClick={openNew}><Plus size={15} />Write first entry</Button>}
        </Card>
      ) : (
        <div className={styles.entries}>
          {sorted.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <DiaryModal
          entry={editEntry}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditEntry(null); }}
        />
      )}

      {/* Toast */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}