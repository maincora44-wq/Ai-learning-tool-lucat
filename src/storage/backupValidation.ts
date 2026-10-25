import type { ExportDataPayload } from '../domain/types';

const isRecord = (x: unknown): x is Record<string, unknown> =>
  x !== null && typeof x === 'object' && !Array.isArray(x);
const validMap = (x: unknown): x is Record<string, unknown> =>
  isRecord(x) && Object.keys(x).every(k => !['__proto__', 'prototype', 'constructor'].includes(k));
const hasString = (x: Record<string, unknown>, key: string) => typeof x[key] === 'string';

/** Reject malformed backups before any live storage is overwritten. */
export function validateBackupPayload(value: unknown): asserts value is ExportDataPayload {
  if (!isRecord(value) || value.schemaVersion !== '1.0') {
    throw new Error('지원하지 않는 백업 버전입니다.');
  }
  const maps = ['attempts', 'quizAttempts', 'labSubmissions', 'userNotes'] as const;
  for (const name of maps) {
    if (!validMap(value[name])) throw new Error(`백업 필드 ${name}의 형식이 올바르지 않습니다.`);
  }
  if (!isRecord(value.preferences) || !Array.isArray(value.evidenceRecords) || !Array.isArray(value.sessionLogs)) {
    throw new Error('백업에 필수 학습 기록이나 환경설정이 없습니다.');
  }
  if (typeof value.preferences.language !== 'string' || typeof value.preferences.focus !== 'string' ||
      typeof value.preferences.dailyGoalMin !== 'number') {
    throw new Error('백업 환경설정이 손상되었습니다.');
  }
  for (const note of Object.values(value.userNotes as Record<string, unknown>)) {
    if (typeof note !== 'string') throw new Error('백업 노트는 문자열이어야 합니다.');
  }
  for (const entry of Object.values(value.attempts as Record<string, unknown>)) {
    if (!isRecord(entry) || !hasString(entry, 'id') || !hasString(entry, 'lessonId') ||
        !hasString(entry, 'startedAt')) throw new Error('레슨 학습 기록이 손상되었습니다.');
  }
  for (const list of Object.values(value.quizAttempts as Record<string, unknown>)) {
    if (!Array.isArray(list) || list.some(q => !isRecord(q) || !hasString(q, 'id') ||
        !hasString(q, 'lessonId') || typeof q.score !== 'number' ||
        !isRecord(q.selectedAnswers))) throw new Error('퀴즈 기록이 손상되었습니다.');
  }
  for (const entry of Object.values(value.labSubmissions as Record<string, unknown>)) {
    if (!isRecord(entry) || !hasString(entry, 'id') || !hasString(entry, 'labId')) {
      throw new Error('실습 기록이 손상되었습니다.');
    }
  }
  if (value.evidenceRecords.some(e => !isRecord(e) || !hasString(e, 'id') || !hasString(e, 'title') ||
      !hasString(e, 'maturity')) ||
      value.sessionLogs.some(s => !isRecord(s) || !hasString(s, 'id') || !hasString(s, 'date'))) {
    throw new Error('증적 또는 학습 세션 기록이 손상되었습니다.');
  }
}
