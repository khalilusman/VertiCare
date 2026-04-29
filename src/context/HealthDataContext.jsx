import { createContext, useContext, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';
import {
  calcDashboardStats,
  getSeverityTrendData,
  getFrequencyData,
  getTriggerChartData,
  getMedicationChartData,
} from '../utils/calculations';
import { filterSymptomsByDateRange } from '../utils/dateHelpers';
import { useAuth } from './AuthContext';

const HealthDataContext = createContext(null);

function buildDemoData(userId) {
  const now = new Date();
  const daysAgo = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };

  const symptoms = [
    {
      id: 'sym_d1', userId, severity: 7, duration: '45 minutes',
      dateTime: daysAgo(1), triggers: ['Stress', 'Screen time'],
      medications: ['Betahistine'], whatHelped: 'Resting in dark room',
      notes: 'Started after long meeting', createdAt: daysAgo(1),
    },
    {
      id: 'sym_d2', userId, severity: 4, duration: '20 minutes',
      dateTime: daysAgo(3), triggers: ['Dehydration'],
      medications: ['Meclizine'], whatHelped: 'Drinking water',
      notes: 'Mild episode', createdAt: daysAgo(3),
    },
    {
      id: 'sym_d3', userId, severity: 8, duration: '2 hours',
      dateTime: daysAgo(5), triggers: ['Lack of sleep', 'Stress'],
      medications: ['Betahistine', 'Diazepam'], whatHelped: 'Sleep',
      notes: 'Worst episode this week', createdAt: daysAgo(5),
    },
    {
      id: 'sym_d4', userId, severity: 3, duration: '10 minutes',
      dateTime: daysAgo(7), triggers: ['Bright light'],
      medications: ['Betahistine'], whatHelped: 'Sunglasses',
      notes: '', createdAt: daysAgo(7),
    },
    {
      id: 'sym_d5', userId, severity: 6, duration: '1 hour',
      dateTime: daysAgo(10), triggers: ['Travel', 'Noise'],
      medications: ['Meclizine'], whatHelped: 'Sitting still',
      notes: 'During car ride', createdAt: daysAgo(10),
    },
    {
      id: 'sym_d6', userId, severity: 5, duration: '30 minutes',
      dateTime: daysAgo(12), triggers: ['Food', 'Stress'],
      medications: ['Betahistine'], whatHelped: 'Light meal',
      notes: 'After heavy lunch', createdAt: daysAgo(12),
    },
    {
      id: 'sym_d7', userId, severity: 2, duration: '5 minutes',
      dateTime: daysAgo(15), triggers: ['Unknown'],
      medications: [], whatHelped: 'Deep breathing',
      notes: 'Very mild', createdAt: daysAgo(15),
    },
  ];

  const diary = [
    {
      id: 'diary_d1', userId,
      title: 'Feeling much better today', mood: 'Improving',
      date: daysAgo(1).slice(0, 10),
      content: 'Woke up with minimal dizziness. The new medication seems to be helping. Managed to take a short walk in the morning without any issues.',
      createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: 'diary_d2', userId,
      title: 'Rough morning', mood: 'Dizzy',
      date: daysAgo(3).slice(0, 10),
      content: 'Had a difficult start. Episode came on suddenly around 9am. Had to lie down for most of the morning. Feeling slightly better in the afternoon.',
      createdAt: daysAgo(3), updatedAt: daysAgo(3),
    },
    {
      id: 'diary_d3', userId,
      title: 'Good day overall', mood: 'Good',
      date: daysAgo(6).slice(0, 10),
      content: 'No episodes today. Managed to work a full day. Going to bed early to maintain the routine.',
      createdAt: daysAgo(6), updatedAt: daysAgo(6),
    },
    {
      id: 'diary_d4', userId,
      title: 'Anxiety about upcoming appointment', mood: 'Anxious',
      date: daysAgo(9).slice(0, 10),
      content: 'Feeling nervous about my appointment with the specialist next week. Hope the data I have collected will be useful.',
      createdAt: daysAgo(9), updatedAt: daysAgo(9),
    },
  ];

  return { symptoms, diary };
}

export function HealthDataProvider({ children }) {
  const { currentUser } = useAuth();

  const [allSymptoms, setAllSymptoms] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYMPTOMS) || '[]'); } catch { return []; }
  });

  const [allDiary, setAllDiary] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.DIARY) || '[]'); } catch { return []; }
  });

  const symptoms = currentUser
    ? allSymptoms.filter((s) => s.userId === currentUser.id)
    : [];

  const diaryEntries = currentUser
    ? allDiary.filter((d) => d.userId === currentUser.id)
    : [];

  const stats = calcDashboardStats(symptoms);

  // ---- Symptom actions ----

  const addSymptom = useCallback((data) => {
    if (!currentUser) return;
    const newSym = {
      id: `symptom_${Date.now()}`,
      userId: currentUser.id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    const updated = [newSym, ...allSymptoms];
    setAllSymptoms(updated);
    localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(updated));
    return newSym;
  }, [currentUser, allSymptoms]);

  const deleteSymptom = useCallback((id) => {
    const updated = allSymptoms.filter((s) => s.id !== id);
    setAllSymptoms(updated);
    localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(updated));
  }, [allSymptoms]);

  const getSymptomsByUser = useCallback((userId) => {
    const id = userId || currentUser?.id;
    return allSymptoms.filter((s) => s.userId === id);
  }, [allSymptoms, currentUser]);

  const getRecentSymptoms = useCallback((limit = 5) => {
    return [...symptoms]
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      .slice(0, limit);
  }, [symptoms]);

  const getFilteredSymptoms = useCallback((start, end) => {
    return filterSymptomsByDateRange(symptoms, start, end);
  }, [symptoms]);

  const getChartData = useCallback((filteredSymptoms) => {
    const src = filteredSymptoms ?? symptoms;
    return {
      severityTrend: getSeverityTrendData(src),
      frequency: getFrequencyData(src),
      triggers: getTriggerChartData(src),
      medications: getMedicationChartData(src),
    };
  }, [symptoms]);

  // ---- Diary actions ----

  const addDiaryEntry = useCallback((data) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const entry = {
      id: `diary_${Date.now()}`,
      userId: currentUser.id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [entry, ...allDiary];
    setAllDiary(updated);
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(updated));
    return entry;
  }, [currentUser, allDiary]);

  const updateDiaryEntry = useCallback((id, data) => {
    const updated = allDiary.map((d) =>
      d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d
    );
    setAllDiary(updated);
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(updated));
  }, [allDiary]);

  const deleteDiaryEntry = useCallback((id) => {
    const updated = allDiary.filter((d) => d.id !== id);
    setAllDiary(updated);
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(updated));
  }, [allDiary]);

  const getDiaryEntriesByUser = useCallback((userId) => {
    const id = userId || currentUser?.id;
    return allDiary.filter((d) => d.userId === id);
  }, [allDiary, currentUser]);

  // ---- Demo data ----

  const loadDemoData = useCallback(() => {
    if (!currentUser) return;

    // Always remove old demo data first, then re-add fresh
    const { symptoms: demoSym, diary: demoDiary } = buildDemoData(currentUser.id);

    const withoutOldDemo = allSymptoms.filter(
      (s) => s.userId !== currentUser.id || !s.id.startsWith('sym_d')
    );
    const withoutOldDiary = allDiary.filter(
      (d) => d.userId !== currentUser.id || !d.id.startsWith('diary_d')
    );

    const updatedSym = [...demoSym, ...withoutOldDemo];
    const updatedDiary = [...demoDiary, ...withoutOldDiary];

    setAllSymptoms(updatedSym);
    setAllDiary(updatedDiary);
    localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(updatedSym));
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(updatedDiary));

    return { alreadyLoaded: false };
  }, [currentUser, allSymptoms, allDiary]);

  // ---- Clear all user data ----

  const clearAllData = useCallback(() => {
    if (!currentUser) return;
    const remainingSym = allSymptoms.filter((s) => s.userId !== currentUser.id);
    const remainingDiary = allDiary.filter((d) => d.userId !== currentUser.id);
    setAllSymptoms(remainingSym);
    setAllDiary(remainingDiary);
    localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(remainingSym));
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(remainingDiary));
  }, [currentUser, allSymptoms, allDiary]);

  return (
    <HealthDataContext.Provider value={{
      symptoms, diaryEntries, stats,
      addSymptom, deleteSymptom, getSymptomsByUser, getRecentSymptoms,
      getFilteredSymptoms, getChartData,
      addDiaryEntry, updateDiaryEntry, deleteDiaryEntry, getDiaryEntriesByUser,
      loadDemoData, clearAllData,
    }}>
      {children}
    </HealthDataContext.Provider>
  );
}

export function useHealthData() {
  const ctx = useContext(HealthDataContext);
  if (!ctx) throw new Error('useHealthData must be used within HealthDataProvider');
  return ctx;
}