import {
  UserPreferences,
  LessonAttempt,
  QuizAttempt,
  LabSubmission,
  EvidenceRecord,
  SessionLog,
  ExportDataPayload,
} from '../domain/types';

const DB_NAME = 'ai-learning-os-db';
const DB_VERSION = 1;
const STORAGE_PREFIX = 'ai-learning-os:';

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'EN_KO',
  focus: 'BOTH',
  dailyGoalMin: 20,
  level: 'INTERMEDIATE',
  reducedMotion: false,
  onboardingCompleted: false,
  safetyPledged: true,
  fontSize: 'standard',
};

// IndexedDB Helper
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('store')) {
        db.createObjectStore('store');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction('store', 'readonly');
      const store = tx.objectStore('store');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    // Fallback to localStorage
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : null;
  }
}

async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('store', 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Storage transaction aborted'));
      tx.objectStore('store').put(value, key);
    });
    db.close();
  } catch {
    // Fallback to localStorage
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  }
  // Also sync key preferences and small state to localStorage for quick bootstrap
  if (key === 'preferences') {
    localStorage.setItem(STORAGE_PREFIX + 'preferences', JSON.stringify(value));
  }
}

export interface AppStoredState {
  preferences: UserPreferences;
  attempts: Record<string, LessonAttempt>;
  quizAttempts: Record<string, QuizAttempt[]>;
  labSubmissions: Record<string, LabSubmission>;
  evidenceRecords: EvidenceRecord[];
  sessionLogs: SessionLog[];
  userNotes: Record<string, string>;
}

export async function loadInitialState(): Promise<AppStoredState> {
  const preferences = (await idbGet<UserPreferences>('preferences')) || DEFAULT_PREFERENCES;
  const attempts = (await idbGet<Record<string, LessonAttempt>>('attempts')) || {};
  const quizAttempts = (await idbGet<Record<string, QuizAttempt[]>>('quizAttempts')) || {};
  const labSubmissions = (await idbGet<Record<string, LabSubmission>>('labSubmissions')) || {};
  const evidenceRecords = (await idbGet<EvidenceRecord[]>('evidenceRecords')) || [];
  const sessionLogs = (await idbGet<SessionLog[]>('sessionLogs')) || [];
  const userNotes = (await idbGet<Record<string, string>>('userNotes')) || {};

  return {
    preferences,
    attempts,
    quizAttempts,
    labSubmissions,
    evidenceRecords,
    sessionLogs,
    userNotes,
  };
}

export async function persistPreferences(prefs: UserPreferences): Promise<void> {
  await idbSet('preferences', prefs);
}

export async function persistAttempts(attempts: Record<string, LessonAttempt>): Promise<void> {
  await idbSet('attempts', attempts);
}

export async function persistQuizAttempts(quizAttempts: Record<string, QuizAttempt[]>): Promise<void> {
  await idbSet('quizAttempts', quizAttempts);
}

export async function persistLabSubmissions(submissions: Record<string, LabSubmission>): Promise<void> {
  await idbSet('labSubmissions', submissions);
}

export async function persistEvidenceRecords(records: EvidenceRecord[]): Promise<void> {
  await idbSet('evidenceRecords', records);
}

export async function persistSessionLogs(logs: SessionLog[]): Promise<void> {
  await idbSet('sessionLogs', logs);
}

export async function persistUserNotes(notes: Record<string, string>): Promise<void> {
  await idbSet('userNotes', notes);
}

export async function generateExportPayload(state: AppStoredState): Promise<ExportDataPayload> {
  return {
    schemaVersion: '1.0',
    exportedAt: new Date().toISOString(),
    preferences: state.preferences,
    attempts: state.attempts,
    quizAttempts: state.quizAttempts,
    labSubmissions: state.labSubmissions,
    evidenceRecords: state.evidenceRecords,
    sessionLogs: state.sessionLogs,
    userNotes: state.userNotes,
  };
}

export function exportSessionToMarkdown(session: SessionLog): string {
  return `# AI Learning OS — Session Record
**Date:** ${session.date}
**Topic:** ${session.topic}
**Stage:** ${session.stage}
**Implementation Maturity:** ${session.maturity}
**Maturity Reason:** ${session.maturityReason}

---

## 1. Core Focus & Mental Model
- **Goal:** ${session.goal}
- **Learned:** ${session.learned}
- **Mental Model:** ${session.mentalModel}

## 2. Practical Execution & Evidence
- **Practiced:** ${session.practiced}
- **Implemented Artifact:** ${session.implemented || 'None (Proposal or Concept only)'}
- **What Was Actually Executed:** ${session.actuallyExecuted || 'None'}
- **Systematic Tests Performed:** ${session.testsPerformed || 'None'}
- **Verified Outcome:** ${session.verified || 'None'}

## 3. Reflection & Next Step
- **Still Unclear / Ambiguity:** ${session.stillUnclear || 'None'}
- **Next Best Step:** ${session.nextBestStep}

*Exported from AI Learning OS on ${new Date().toISOString()}*
`;
}

export async function clearAllLocalData(): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('store', 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Reset transaction aborted'));
      tx.objectStore('store').clear();
    });
    db.close();
  } catch (error) {
    // Do not claim a successful reset if an existing IndexedDB store could not be cleared.
    if (typeof indexedDB !== 'undefined') throw error;
  }
  // Clear localStorage keys starting with prefix
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
