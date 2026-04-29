// ---- Severity ----

export function severityLabel(value) {
  if (value <= 3) return 'Mild';
  if (value <= 6) return 'Moderate';
  return 'Severe';
}

export function severityColor(value) {
  if (value <= 3) return '#34D399';
  if (value <= 6) return '#FBBF24';
  return '#F87171';
}

export function calculateAverageSeverity(symptoms) {
  if (!symptoms || symptoms.length === 0) return null;
  const total = symptoms.reduce((sum, s) => sum + (s.severity || 0), 0);
  return Math.round((total / symptoms.length) * 10) / 10;
}

// ---- Triggers ----

export function getTriggerCounts(symptoms) {
  const counts = {};
  (symptoms || []).forEach((s) => {
    (s.triggers || []).forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  return counts;
}

export function getMostCommonTrigger(symptoms) {
  const counts = getTriggerCounts(symptoms);
  if (Object.keys(counts).length === 0) return null;
  return Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
}

// ---- Medications ----

export function getMedicationCounts(symptoms) {
  const counts = {};
  (symptoms || []).forEach((s) => {
    (s.medications || []).forEach((m) => {
      const key = m.trim();
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
  });
  return counts;
}

export function getMostUsedMedication(symptoms) {
  const counts = getMedicationCounts(symptoms);
  if (Object.keys(counts).length === 0) return null;
  return Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
}

// ---- Grouping ----

export function groupSymptomsByDate(symptoms) {
  const groups = {};
  (symptoms || []).forEach((s) => {
    const date = s.dateTime ? s.dateTime.slice(0, 10) : 'Unknown';
    if (!groups[date]) groups[date] = [];
    groups[date].push(s);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({ date, items, count: items.length }));
}

// ---- Chart data formatters ----

export function getSeverityTrendData(symptoms) {
  return [...(symptoms || [])]
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .map((s) => ({
      date: new Date(s.dateTime).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
      }),
      severity: s.severity,
      fullDate: s.dateTime,
    }));
}

export function getFrequencyData(symptoms) {
  const groups = groupSymptomsByDate(symptoms);
  return groups.map(({ date, count }) => ({
    date: new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    }),
    episodes: count,
  }));
}

export function getTriggerChartData(symptoms) {
  const counts = getTriggerCounts(symptoms);
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }));
}

export function getMedicationChartData(symptoms) {
  const counts = getMedicationCounts(symptoms);
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));
}

// ---- Dashboard stats ----

export function calcDashboardStats(symptoms) {
  if (!symptoms || symptoms.length === 0) {
    return {
      totalEpisodes: 0,
      averageSeverity: null,
      lastEpisode: null,
      mostCommonTrigger: null,
      mostUsedMedication: null,
    };
  }
  const totalEpisodes = symptoms.length;
  const averageSeverity = calculateAverageSeverity(symptoms);
  const sorted = [...symptoms].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );
  const lastEpisode = sorted[0]?.dateTime || null;
  const mostCommonTrigger = getMostCommonTrigger(symptoms);
  const mostUsedMedication = getMostUsedMedication(symptoms);
  return { totalEpisodes, averageSeverity, lastEpisode, mostCommonTrigger, mostUsedMedication };
}