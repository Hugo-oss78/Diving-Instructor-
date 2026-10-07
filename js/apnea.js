// Données d'entraînement à l'apnée (respiration + tables progressives).
//
// Source : dépliant "Apnée — Entraînement en apnée pour le cursus
// plongée" (V. Perret), tables SQUAT-HYPERCAPNIE et SQUAT-HYPOXIE,
// adaptées ici en version à SEC (assis/allongé) plutôt qu'en squats,
// pour un usage au calme guidé par l'appli. Les durées de maintien
// sont des CIBLES indicatives, jamais une contrainte : on relâche
// toujours dès que le besoin de respirer se fait sentir.
//
// Règle des 12h (pas d'apnée dans les 12h suivant une plongée) :
// Mémento DP 2024 (unité de plongée professionnelle), fiche P-6.

export const HYPERCAPNIE_LEVELS = [
  { level: 1, hold: 15, reps: 6, recovery: 60, series: 3, seriesRecovery: 300 },
  { level: 2, hold: 20, reps: 8, recovery: 60, series: 3, seriesRecovery: 300 },
  { level: 3, hold: 30, reps: 10, recovery: 30, series: 3, seriesRecovery: 300 },
  { level: 4, hold: 20, reps: 8, recovery: 60, series: 2, seriesRecovery: 300 },
  { level: 5, hold: 30, reps: 10, recovery: 30, series: 2, seriesRecovery: 300 },
  { level: 6, hold: 30, reps: 8, recovery: 60, series: 2, seriesRecovery: 300 },
  { level: 7, hold: 45, reps: 6, recovery: 60, series: 1, seriesRecovery: 300 },
];

export const HYPOXIQUE_LEVELS = [
  { level: 1, hold: 20, reps: 6, recovery: 60, series: 2, seriesRecovery: 300 },
  { level: 2, hold: 30, reps: 6, recovery: 60, series: 2, seriesRecovery: 300 },
  { level: 3, hold: 45, reps: 6, recovery: 60, series: 2, seriesRecovery: 300 },
];

export const TABLES = {
  hypercapnie: { levels: HYPERCAPNIE_LEVELS, color: "#c62828" },
  hypoxique: { levels: HYPOXIQUE_LEVELS, color: "#1d6fa5" },
};

const PROGRESS_KEY = "instructorPrepApneaProgressV1";

export function loadApneaProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : { hypercapnie: 1, hypoxique: 1 };
  } catch {
    return { hypercapnie: 1, hypoxique: 1 };
  }
}

export function saveApneaProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}
