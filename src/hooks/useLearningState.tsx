import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { validateBackupPayload } from '../storage/backupValidation';
import {
  UserPreferences,
  LessonAttempt,
  QuizAttempt,
  LabSubmission,
  EvidenceRecord,
  SessionLog,
  ExportDataPayload,
  Maturity,
  Lesson,
} from '../domain/types';
import {
  loadInitialState,
  persistPreferences,
  persistAttempts,
  persistQuizAttempts,
  persistLabSubmissions,
  persistEvidenceRecords,
  persistSessionLogs,
  persistUserNotes,
  generateExportPayload,
  clearAllLocalData,
  DEFAULT_PREFERENCES,
} from '../storage/db';
import { LESSON_CATALOG } from '../data/lessonCatalog';
import { ALL_LABS } from '../data/labs';
import {
  calculateStudyStreak,
  calculateLessonDailyStreak,
  DailyStreakInfo,
  getLocalDateString,
  nextRecommendedLesson,
  isLessonCompleted,
} from '../domain/mastery';

interface LearningContextValue {
  loading: boolean;
  preferences: UserPreferences;
  attempts: Record<string, LessonAttempt>;
  quizAttempts: Record<string, QuizAttempt[]>;
  labSubmissions: Record<string, LabSubmission>;
  evidenceRecords: EvidenceRecord[];
  sessionLogs: SessionLog[];
  userNotes: Record<string, string>;

  // Actions
  updatePreferences: (patch: Partial<UserPreferences>) => Promise<void>;
  recordLessonStep: (lessonId: string, step: number) => Promise<void>;
  completeLesson: (lessonId: string, quizScore: number, studyOnly?: boolean) => Promise<void>;
  recordQuizAttempt: (lessonId: string, answers: Record<string, string[]>, score: number, passed: boolean) => Promise<void>;
  saveLabSubmission: (labId: string, submission: Partial<LabSubmission>) => Promise<void>;
  addOrUpdateEvidence: (record: EvidenceRecord) => Promise<void>;
  deleteEvidence: (id: string) => Promise<void>;
  saveSessionLog: (log: SessionLog) => Promise<void>;
  setUserNote: (lessonId: string, note: string) => Promise<void>;
  exportData: () => Promise<ExportDataPayload>;
  importData: (payload: ExportDataPayload, mode: 'merge' | 'replace') => Promise<{ count: number }>;
  resetData: () => Promise<void>;

  // Computed metrics
  studiedLessonsCount: number;
  completedLessonsCount: number;
  workingEvidenceCount: number;
  verifiedEvidenceCount: number;
  proposalCount: number;
  prototypeCount: number;
  streak: number;
  currentDailyStreak: number;
  completedToday: boolean;
  streakInfo: DailyStreakInfo;
  recentDaysStreak: { dateStr: string; dayLabel: string; completed: boolean; isToday: boolean }[];
  recommendedLesson: Lesson | undefined;
  chatgptProgress: { total: number; completed: number; pct: number };
  m365Progress: { total: number; completed: number; pct: number };
  crossProgress: { total: number; completed: number; pct: number };
  labsCompletedCount: number;
}

const LearningContext = createContext<LearningContextValue | null>(null);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [attempts, setAttempts] = useState<Record<string, LessonAttempt>>({});
  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizAttempt[]>>({});
  const [labSubmissions, setLabSubmissions] = useState<Record<string, LabSubmission>>({});
  const [evidenceRecords, setEvidenceRecords] = useState<EvidenceRecord[]>([]);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadInitialState().then((state) => {
      setPreferences(state.preferences);
      setAttempts(state.attempts);
      setQuizAttempts(state.quizAttempts);
      setLabSubmissions(state.labSubmissions);
      setEvidenceRecords(state.evidenceRecords);
      setSessionLogs(state.sessionLogs);
      setUserNotes(state.userNotes);
      setLoading(false);
    });
  }, []);

  const updatePreferences = useCallback(async (patch: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...patch };
      persistPreferences(next);
      return next;
    });
  }, []);

  const recordLessonStep = useCallback(async (lessonId: string, step: number) => {
    setAttempts((prev) => {
      const existing = prev[lessonId] || {
        id: `att-${lessonId}`,
        lessonId,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStep: 0,
      };
      const updated: LessonAttempt = {
        ...existing,
        currentStep: Math.max(existing.currentStep, step),
        updatedAt: new Date().toISOString(),
      };
      const next = { ...prev, [lessonId]: updated };
      persistAttempts(next);
      return next;
    });
  }, []);

  const completeLesson = useCallback(async (lessonId: string, quizScore: number, studyOnly: boolean = false) => {
    const nowIso = new Date().toISOString();
    const todayStr = getLocalDateString(new Date());
    const lesson = LESSON_CATALOG.find((l) => l.id === lessonId);

    setAttempts((prev) => {
      const existing = prev[lessonId] || {
        id: `att-${lessonId}`,
        lessonId,
        startedAt: nowIso,
        updatedAt: nowIso,
        currentStep: 7,
      };
      const updated: LessonAttempt = {
        ...existing,
        quizScore,
        studyOnly,
        completedAt: nowIso,
        updatedAt: nowIso,
      };
      const next = { ...prev, [lessonId]: updated };
      persistAttempts(next);
      return next;
    });

    // Auto-record a session log entry for today so daily streak and calendar heatmap reflect completed lessons
    setSessionLogs((prev) => {
      const existingToday = prev.find(
        (s) => s.date === todayStr && s.topic.includes(lesson?.title || lessonId)
      );
      if (existingToday) return prev;

      const newLog: SessionLog = {
        id: `ses-${Date.now().toString(36)}`,
        date: todayStr,
        topic: lesson ? `${lesson.code} · ${lesson.title}` : `레슨 완료 (${lessonId})`,
        stage: lesson?.stage || 'TOOLS',
        goal: lesson?.objectives?.[0] || '8단계 레슨 및 이해 점검 퀴즈 완료',
        learned: lesson?.problem || '핵심 아키텍처 및 멘탈 모델 학습 완료',
        mentalModel: lesson?.architecture || '',
        practiced: `${lesson?.code || lessonId} 퀴즈 점수: ${quizScore}점 (${studyOnly ? '열람 완료' : '합격'})`,
        implemented: `${lesson?.code || lessonId} 프롬프트 및 가이드 실습 완료`,
        verified: `퀴즈 채점 완료 (${quizScore}점 >= 80점)`,
        stillUnclear: '',
        nextBestStep: lesson?.labId ? `연계 실습 랩(${lesson.labId}) 시작` : '다음 커리큘럼 레슨 진행',
        artifactCreated: lesson?.copyablePromptTemplate ? '프롬프트 템플릿 검증' : '학습 완료 증적',
        actuallyExecuted: '8단계 레슨 학습 및 퀴즈 제출 완료',
        testsPerformed: '정상, 엣지, 실패방지, 재실행 검증 케이스 학습 완료',
        maturity: 'WORKING',
        maturityReason: '학습자가 8단계 커리큘럼 및 퀴즈를 통과하여 작동 성숙도 입증.',
        updatedAt: nowIso,
      };
      const nextLogs = [newLog, ...prev];
      persistSessionLogs(nextLogs);
      return nextLogs;
    });
  }, []);

  const recordQuizAttempt = useCallback(async (lessonId: string, answers: Record<string, string[]>, score: number, passed: boolean) => {
    const newAttempt: QuizAttempt = {
      id: `qa-${Date.now().toString(36)}`,
      lessonId,
      timestamp: new Date().toISOString(),
      selectedAnswers: answers,
      score,
      passed,
    };
    setQuizAttempts((prev) => {
      const currentList = prev[lessonId] || [];
      const next = { ...prev, [lessonId]: [...currentList, newAttempt] };
      persistQuizAttempts(next);
      return next;
    });
    // Update attempt quiz score
    setAttempts((prev) => {
      const existing = prev[lessonId];
      if (existing) {
        const nextAtt = {
          ...existing,
          quizScore: Math.max(existing.quizScore ?? 0, score),
          completedAt: passed ? (existing.completedAt || new Date().toISOString()) : existing.completedAt,
          updatedAt: new Date().toISOString(),
        };
        const next = { ...prev, [lessonId]: nextAtt };
        persistAttempts(next);
        return next;
      }
      return prev;
    });
  }, []);

  const saveLabSubmission = useCallback(async (labId: string, patch: Partial<LabSubmission>) => {
    setLabSubmissions((prev) => {
      const existing = prev[labId] || {
        id: `sub-${labId}`,
        labId,
        updatedAt: new Date().toISOString(),
        workingNotes: '',
        artifactPayload: null,
        selfRubricScores: {},
        testCaseResults: {},
      };
      const updated: LabSubmission = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      const next = { ...prev, [labId]: updated };
      persistLabSubmissions(next);
      return next;
    });
  }, []);

  const addOrUpdateEvidence = useCallback(async (record: EvidenceRecord) => {
    setEvidenceRecords((prev) => {
      const index = prev.findIndex((e) => e.id === record.id);
      let next: EvidenceRecord[];
      if (index >= 0) {
        next = [...prev];
        next[index] = { ...record, updatedAt: new Date().toISOString() };
      } else {
        next = [record, ...prev];
      }
      persistEvidenceRecords(next);
      return next;
    });
  }, []);

  const deleteEvidence = useCallback(async (id: string) => {
    setEvidenceRecords((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persistEvidenceRecords(next);
      return next;
    });
  }, []);

  const saveSessionLog = useCallback(async (log: SessionLog) => {
    setSessionLogs((prev) => {
      const index = prev.findIndex((s) => s.id === log.id);
      let next: SessionLog[];
      if (index >= 0) {
        next = [...prev];
        next[index] = { ...log, updatedAt: new Date().toISOString() };
      } else {
        next = [log, ...prev];
      }
      persistSessionLogs(next);
      return next;
    });
  }, []);

  const setUserNote = useCallback(async (lessonId: string, note: string) => {
    setUserNotes((prev) => {
      const next = { ...prev, [lessonId]: note };
      persistUserNotes(next);
      return next;
    });
  }, []);

  const exportData = useCallback(async (): Promise<ExportDataPayload> => {
    return generateExportPayload({
      preferences,
      attempts,
      quizAttempts,
      labSubmissions,
      evidenceRecords,
      sessionLogs,
      userNotes,
    });
  }, [preferences, attempts, quizAttempts, labSubmissions, evidenceRecords, sessionLogs, userNotes]);

  const importData = useCallback(async (payload: ExportDataPayload, mode: 'merge' | 'replace'): Promise<{ count: number }> => {
    validateBackupPayload(payload);

    if (mode === 'replace') {
      setPreferences(payload.preferences || DEFAULT_PREFERENCES);
      setAttempts(payload.attempts || {});
      setQuizAttempts(payload.quizAttempts || {});
      setLabSubmissions(payload.labSubmissions || {});
      setEvidenceRecords(payload.evidenceRecords || []);
      setSessionLogs(payload.sessionLogs || []);
      setUserNotes(payload.userNotes || {});

      await persistPreferences(payload.preferences || DEFAULT_PREFERENCES);
      await persistAttempts(payload.attempts || {});
      await persistQuizAttempts(payload.quizAttempts || {});
      await persistLabSubmissions(payload.labSubmissions || {});
      await persistEvidenceRecords(payload.evidenceRecords || []);
      await persistSessionLogs(payload.sessionLogs || []);
      await persistUserNotes(payload.userNotes || {});

      return { count: Object.keys(payload.attempts || {}).length + (payload.evidenceRecords || []).length };
    } else {
      // Merge mode
      const mergedAttempts = { ...attempts, ...(payload.attempts || {}) };
      const mergedQuizAttempts = { ...quizAttempts };
      for (const [lessonId, entries] of Object.entries(payload.quizAttempts)) {
        const byId = new Map((mergedQuizAttempts[lessonId] || []).map(entry => [entry.id, entry]));
        entries.forEach(entry => byId.set(entry.id, entry));
        mergedQuizAttempts[lessonId] = Array.from(byId.values());
      }
      const mergedLabs = { ...labSubmissions, ...(payload.labSubmissions || {}) };
      const mergedNotes = { ...userNotes, ...(payload.userNotes || {}) };
      
      const evidenceMap = new Map<string, EvidenceRecord>();
      evidenceRecords.forEach((e) => evidenceMap.set(e.id, e));
      (payload.evidenceRecords || []).forEach((e) => evidenceMap.set(e.id, e));
      const mergedEvidence = Array.from(evidenceMap.values());

      const sessionMap = new Map<string, SessionLog>();
      sessionLogs.forEach((s) => sessionMap.set(s.id, s));
      (payload.sessionLogs || []).forEach((s) => sessionMap.set(s.id, s));
      const mergedSessions = Array.from(sessionMap.values());

      setAttempts(mergedAttempts);
      setQuizAttempts(mergedQuizAttempts);
      setLabSubmissions(mergedLabs);
      setUserNotes(mergedNotes);
      setEvidenceRecords(mergedEvidence);
      setSessionLogs(mergedSessions);

      await persistAttempts(mergedAttempts);
      await persistQuizAttempts(mergedQuizAttempts);
      await persistLabSubmissions(mergedLabs);
      await persistUserNotes(mergedNotes);
      await persistEvidenceRecords(mergedEvidence);
      await persistSessionLogs(mergedSessions);

      return { count: (payload.evidenceRecords || []).length + (payload.sessionLogs || []).length };
    }
  }, [attempts, quizAttempts, labSubmissions, userNotes, evidenceRecords, sessionLogs]);

  const resetData = useCallback(async () => {
    await clearAllLocalData();
    setPreferences(DEFAULT_PREFERENCES);
    setAttempts({});
    setQuizAttempts({});
    setLabSubmissions({});
    setEvidenceRecords([]);
    setSessionLogs([]);
    setUserNotes({});
  }, []);

  // Computed metrics
  const studiedLessonsCount = useMemo(() => {
    return Object.values(attempts).filter((a) => a.startedAt).length;
  }, [attempts]);

  const completedLessonsCount = useMemo(() => {
    return Object.values(attempts).filter((a) => isLessonCompleted(a)).length;
  }, [attempts]);

  const workingEvidenceCount = useMemo(() => {
    return evidenceRecords.filter((e) => e.maturity === 'WORKING').length;
  }, [evidenceRecords]);

  const verifiedEvidenceCount = useMemo(() => {
    return evidenceRecords.filter((e) => e.maturity === 'VERIFIED').length;
  }, [evidenceRecords]);

  const proposalCount = useMemo(() => {
    return evidenceRecords.filter((e) => e.maturity === 'PROPOSAL').length;
  }, [evidenceRecords]);

  const prototypeCount = useMemo(() => {
    return evidenceRecords.filter((e) => e.maturity === 'PROTOTYPE').length;
  }, [evidenceRecords]);

  const streakInfo = useMemo(() => {
    return calculateLessonDailyStreak(attempts, sessionLogs);
  }, [attempts, sessionLogs]);

  const streak = streakInfo.currentStreak;
  const currentDailyStreak = streakInfo.currentStreak;
  const completedToday = streakInfo.completedToday;

  const recentDaysStreak = useMemo(() => {
    const days: { dateStr: string; dayLabel: string; completed: boolean; isToday: boolean }[] = [];
    const dayNamesKo = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = getLocalDateString(d);
      const isoStr = d.toISOString().split('T')[0];
      const isCompleted = streakInfo.activeDates.includes(dateStr) || streakInfo.activeDates.includes(isoStr);
      days.push({
        dateStr,
        dayLabel: dayNamesKo[d.getDay()],
        completed: isCompleted,
        isToday: i === 0,
      });
    }
    return days;
  }, [streakInfo]);

  const recommendedLesson = useMemo(() => {
    return nextRecommendedLesson(LESSON_CATALOG, attempts, preferences);
  }, [attempts, preferences]);

  const chatgptProgress = useMemo(() => {
    const list = LESSON_CATALOG.filter((l) => l.platform === 'CHATGPT' && l.contentStatus === 'READY');
    const comp = list.filter((l) => isLessonCompleted(attempts[l.id])).length;
    return { total: list.length, completed: comp, pct: list.length ? Math.round((comp / list.length) * 100) : 0 };
  }, [attempts]);

  const m365Progress = useMemo(() => {
    const list = LESSON_CATALOG.filter((l) => l.platform === 'M365' && l.contentStatus === 'READY');
    const comp = list.filter((l) => isLessonCompleted(attempts[l.id])).length;
    return { total: list.length, completed: comp, pct: list.length ? Math.round((comp / list.length) * 100) : 0 };
  }, [attempts]);

  const crossProgress = useMemo(() => {
    const list = LESSON_CATALOG.filter((l) => l.platform === 'CROSS' && l.contentStatus === 'READY');
    const comp = list.filter((l) => isLessonCompleted(attempts[l.id])).length;
    return { total: list.length, completed: comp, pct: list.length ? Math.round((comp / list.length) * 100) : 0 };
  }, [attempts]);

  const labsCompletedCount = useMemo(() => {
    return Object.values(labSubmissions).filter((s) => s.completedAt).length;
  }, [labSubmissions]);

  return (
    <LearningContext.Provider
      value={{
        loading,
        preferences,
        attempts,
        quizAttempts,
        labSubmissions,
        evidenceRecords,
        sessionLogs,
        userNotes,
        updatePreferences,
        recordLessonStep,
        completeLesson,
        recordQuizAttempt,
        saveLabSubmission,
        addOrUpdateEvidence,
        deleteEvidence,
        saveSessionLog,
        setUserNote,
        exportData,
        importData,
        resetData,
        studiedLessonsCount,
        completedLessonsCount,
        workingEvidenceCount,
        verifiedEvidenceCount,
        proposalCount,
        prototypeCount,
        streak,
        currentDailyStreak,
        completedToday,
        streakInfo,
        recentDaysStreak,
        recommendedLesson,
        chatgptProgress,
        m365Progress,
        crossProgress,
        labsCompletedCount,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export function useLearningState(): LearningContextValue {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearningState must be used within a LearningProvider');
  }
  return context;
}
