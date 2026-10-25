import {
  Stage,
  Maturity,
  Lesson,
  LessonAttempt,
  QuizQuestion,
  SessionLog,
  EvidenceRecord,
  UserPreferences,
} from './types';

/**
 * Pure function enforcing strict evidence-based maturity transitions.
 * PRD Section 3.4 & 8.1
 */
export function canAssignMaturity(
  record: Partial<EvidenceRecord>,
  target: Maturity
): { allowed: boolean; reason: string } {
  // Always allowed to downgrade or select CONCEPT
  if (target === 'CONCEPT') {
    return {
      allowed: true,
      reason: 'CONCEPT level indicates theoretical comprehension with no saved artifact required.',
    };
  }

  // PROPOSAL requires a written workflow, architecture, or design artifact
  if (!record.artifactDescription || record.artifactDescription.trim().length < 10) {
    return {
      allowed: false,
      reason: 'PROPOSAL requires a documented design artifact or written specification (minimum 10 characters).',
    };
  }
  if (target === 'PROPOSAL') {
    return {
      allowed: true,
      reason: 'Valid design artifact provided for PROPOSAL state.',
    };
  }

  // PROTOTYPE requires partial implementation or tangible artifact reference
  if (!record.userDeclaredExists) {
    return {
      allowed: false,
      reason: 'PROTOTYPE requires user attestation that a partial implementation or runnable configuration exists.',
    };
  }
  if (target === 'PROTOTYPE') {
    return {
      allowed: true,
      reason: 'Partial implementation or prototype configuration attested.',
    };
  }

  // WORKING requires at least one recorded end-to-end run
  if (!record.executionRunRecorded) {
    return {
      allowed: false,
      reason: 'WORKING maturity strictly requires at least one recorded end-to-end execution run with actual input and output.',
    };
  }
  if (target === 'WORKING') {
    return {
      allowed: true,
      reason: 'End-to-end run recorded with verified execution output.',
    };
  }

  // VERIFIED requires all four tests: normal, edge, failure, rerun + known limitations
  const hasNormal = Boolean(record.normalTest && record.normalTest.trim().length >= 8);
  const hasEdge = Boolean(record.edgeTest && record.edgeTest.trim().length >= 8);
  const hasFailure = Boolean(record.failureTest && record.failureTest.trim().length >= 8);
  const hasRerun = Boolean(record.rerunTest && record.rerunTest.trim().length >= 8);

  if (!hasNormal || !hasEdge || !hasFailure || !hasRerun) {
    const missing: string[] = [];
    if (!hasNormal) missing.push('Normal case test');
    if (!hasEdge) missing.push('Edge case test');
    if (!hasFailure) missing.push('Failure case test');
    if (!hasRerun) missing.push('Rerun / idempotency test');
    return {
      allowed: false,
      reason: `VERIFIED maturity strictly requires all 4 systematic tests. Missing: ${missing.join(', ')}.`,
    };
  }

  return {
    allowed: true,
    reason: 'All four tests (Normal, Edge, Failure, Rerun) and execution logs documented and confirmed.',
  };
}

/**
 * Pure quiz evaluation function.
 * Pass score threshold is 80%.
 */
export function calculateQuizScore(
  questions: QuizQuestion[],
  selectedAnswers: Record<string, string[]>
): {
  score: number;
  passed: boolean;
  questionResults: Record<string, boolean>;
  totalCorrect: number;
  totalQuestions: number;
} {
  if (questions.length === 0) {
    return { score: 100, passed: true, questionResults: {}, totalCorrect: 0, totalQuestions: 0 };
  }

  let correctCount = 0;
  const questionResults: Record<string, boolean> = {};

  for (const q of questions) {
    const userSelections = selectedAnswers[q.id] || [];
    const correctIds = q.correctOptionIds || [];

    // Check if user set matches correct set exactly
    const isCorrect =
      userSelections.length === correctIds.length &&
      correctIds.every((id) => userSelections.includes(id));

    questionResults[q.id] = isCorrect;
    if (isCorrect) {
      correctCount += 1;
    }
  }

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 80;

  return {
    score,
    passed,
    questionResults,
    totalCorrect: correctCount,
    totalQuestions: questions.length,
  };
}

export function isLessonCompleted(attempt?: LessonAttempt): boolean {
  if (!attempt) return false;
  return Boolean(attempt.completedAt && (attempt.quizScore ?? 0) >= 80);
}

export function calculateStageProgress(
  stage: Stage,
  lessons: Lesson[],
  attempts: Record<string, LessonAttempt>
): {
  total: number;
  completed: number;
  percentage: number;
} {
  const stageLessons = lessons.filter((l) => l.stage === stage);
  if (stageLessons.length === 0) return { total: 0, completed: 0, percentage: 0 };

  const completed = stageLessons.filter((l) => isLessonCompleted(attempts[l.id])).length;
  const percentage = Math.round((completed / stageLessons.length) * 100);

  return { total: stageLessons.length, completed, percentage };
}

/**
 * Deterministic lesson recommender.
 * PRD Section 6.2
 */
export function nextRecommendedLesson(
  lessons: Lesson[],
  attempts: Record<string, LessonAttempt>,
  preferences: UserPreferences
): Lesson | undefined {
  const readyLessons = lessons.filter((l) => l.contentStatus === 'READY');

  // 1. Resume unfinished lesson if in progress
  for (const l of readyLessons) {
    const att = attempts[l.id];
    if (att && att.startedAt && !att.completedAt) {
      return l;
    }
  }

  // 2. Recommend next unstarted lesson matching user domain and nearest stage
  const stageOrder: Stage[] = ['TOOLS', 'WORKFLOWS', 'AUTOMATION', 'AGENTS', 'SYSTEMS'];

  for (const stage of stageOrder) {
    const uncompletedInStage = readyLessons.filter(
      (l) => l.stage === stage && !isLessonCompleted(attempts[l.id])
    );

    // Try domain match first
    const domainMatch = uncompletedInStage.find((l) => {
      if (preferences.focus === 'BOTH' || preferences.focus === 'ALL') return true;
      return l.domain === preferences.focus || l.domain === 'BOTH' || l.domain === 'ALL';
    });

    if (domainMatch) return domainMatch;

    // Otherwise any uncompleted in this stage
    if (uncompletedInStage.length > 0) return uncompletedInStage[0];
  }

  // Fallback to first ready lesson
  return readyLessons[0];
}

/**
 * Formats a Date or date string to local YYYY-MM-DD.
 */
export function getLocalDateString(dateInput: Date | string = new Date()): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export interface DailyStreakInfo {
  currentStreak: number;
  completedToday: boolean;
  completedYesterday: boolean;
  activeDates: string[];
  totalActiveDays: number;
}

/**
 * Calculates current daily streak of completed lessons (and sessions) without mock data.
 */
export function calculateLessonDailyStreak(
  attempts: Record<string, LessonAttempt> = {},
  sessionLogs: SessionLog[] = []
): DailyStreakInfo {
  const dateSet = new Set<string>();

  // Collect completion dates from completed lessons
  Object.values(attempts).forEach((att) => {
    if (isLessonCompleted(att) && att.completedAt) {
      dateSet.add(getLocalDateString(att.completedAt));
      dateSet.add(att.completedAt.split('T')[0]);
    }
  });

  // Also collect dates from recorded study sessions
  sessionLogs.forEach((log) => {
    if (log.date) {
      dateSet.add(log.date);
    }
  });

  const activeDates = Array.from(dateSet).sort().reverse();
  const now = new Date();
  const todayStr = getLocalDateString(now);
  const todayIsoStr = now.toISOString().split('T')[0];

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);
  const yesterdayIsoStr = yesterdayDate.toISOString().split('T')[0];

  const completedToday = dateSet.has(todayStr) || dateSet.has(todayIsoStr);
  const completedYesterday = dateSet.has(yesterdayStr) || dateSet.has(yesterdayIsoStr);

  if (!completedToday && !completedYesterday) {
    return {
      currentStreak: 0,
      completedToday: false,
      completedYesterday: false,
      activeDates,
      totalActiveDays: activeDates.length,
    };
  }

  // Count consecutive days backward starting from today (if completed) or yesterday (if completed yesterday)
  let streak = 0;
  const startRefDate = new Date(completedToday ? now : yesterdayDate);
  startRefDate.setHours(12, 0, 0, 0);

  while (true) {
    const checkStr1 = getLocalDateString(startRefDate);
    const checkStr2 = startRefDate.toISOString().split('T')[0];

    if (dateSet.has(checkStr1) || dateSet.has(checkStr2)) {
      streak += 1;
      startRefDate.setDate(startRefDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak: streak,
    completedToday,
    completedYesterday,
    activeDates,
    totalActiveDays: activeDates.length,
  };
}

/**
 * Calculate study streak from completed lessons and actual session records.
 */
export function calculateStudyStreak(
  sessionLogs: SessionLog[],
  attempts?: Record<string, LessonAttempt>
): number {
  return calculateLessonDailyStreak(attempts || {}, sessionLogs).currentStreak;
}
