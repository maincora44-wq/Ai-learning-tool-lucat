import { validateBackupPayload } from '../storage/backupValidation';
import { canAssignMaturity, calculateQuizScore, calculateStudyStreak } from '../domain/mastery';
import { runMonthEndAutomationSimulation, INITIAL_SYNTHETIC_CONTROLS } from '../domain/flowSimulator';
import { QuizQuestion, EvidenceRecord, SessionLog } from '../domain/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running AI Learning OS Verification Suite...\n');

// 1. Test canAssignMaturity
console.log('Test 1: Testing canAssignMaturity evidence gates...');
const emptyRecord: Partial<EvidenceRecord> = { maturity: 'CONCEPT' };
assert(canAssignMaturity(emptyRecord, 'CONCEPT').allowed === true, 'CONCEPT must be allowed without artifacts');
assert(canAssignMaturity(emptyRecord, 'PROPOSAL').allowed === false, 'PROPOSAL must fail without artifact description');

const proposalRecord: Partial<EvidenceRecord> = {
  artifactDescription: 'Detailed month-end close workflow specification document.',
  userDeclaredExists: false,
};
assert(canAssignMaturity(proposalRecord, 'PROPOSAL').allowed === true, 'PROPOSAL must pass with artifact description');
assert(canAssignMaturity(proposalRecord, 'PROTOTYPE').allowed === false, 'PROTOTYPE must fail without user declaration');

const prototypeRecord: Partial<EvidenceRecord> = {
  ...proposalRecord,
  userDeclaredExists: true,
  executionRunRecorded: false,
};
assert(canAssignMaturity(prototypeRecord, 'PROTOTYPE').allowed === true, 'PROTOTYPE must pass when declared');
assert(canAssignMaturity(prototypeRecord, 'WORKING').allowed === false, 'WORKING must fail without recorded execution run');

const workingRecord: Partial<EvidenceRecord> = {
  ...prototypeRecord,
  executionRunRecorded: true,
};
assert(canAssignMaturity(workingRecord, 'WORKING').allowed === true, 'WORKING must pass with recorded execution run');
assert(canAssignMaturity(workingRecord, 'VERIFIED').allowed === false, 'VERIFIED must fail without all 4 tests');

const verifiedRecord: Partial<EvidenceRecord> = {
  ...workingRecord,
  normalTest: 'Tested standard 5-row batch; all reminders sent.',
  edgeTest: 'Tested unassigned owner; routed to Controller.',
  failureTest: 'Tested missing SharePoint item; handled without crash.',
  rerunTest: 'Tested re-execution; duplicate emails suppressed by idempotency key.',
};
assert(canAssignMaturity(verifiedRecord, 'VERIFIED').allowed === true, 'VERIFIED must pass when all 4 tests are attested');
console.log('✓ canAssignMaturity tests passed!');

// 2. Test calculateQuizScore
console.log('Test 2: Testing calculateQuizScore...');
const mockQuestions: QuizQuestion[] = [
  {
    id: 'Q1',
    lessonId: 'T01',
    prompt: 'Question 1',
    kind: 'single_choice',
    options: [{ id: 'optA', text: 'A' }, { id: 'optB', text: 'B' }],
    correctOptionIds: ['optA'],
    explanation: 'A is correct',
  },
  {
    id: 'Q2',
    lessonId: 'T01',
    prompt: 'Question 2',
    kind: 'single_choice',
    options: [{ id: 'optA', text: 'A' }, { id: 'optB', text: 'B' }],
    correctOptionIds: ['optB'],
    explanation: 'B is correct',
  },
];

const passResult = calculateQuizScore(mockQuestions, { Q1: ['optA'], Q2: ['optB'] });
assert(passResult.score === 100, 'Score must be 100%');
assert(passResult.passed === true, 'Must pass >= 80%');

const failResult = calculateQuizScore(mockQuestions, { Q1: ['optA'], Q2: ['optA'] });
assert(failResult.score === 50, 'Score must be 50%');
assert(failResult.passed === false, 'Must fail < 80%');
console.log('✓ calculateQuizScore tests passed!');

// 3. Test calculateStudyStreak
console.log('Test 3: Testing calculateStudyStreak...');
const todayStr = new Date().toISOString().split('T')[0];
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

const mockLogs: SessionLog[] = [
  {
    id: '1',
    date: todayStr,
    topic: 'T01',
    stage: 'TOOLS',
    goal: 'Goal',
    learned: '',
    mentalModel: '',
    practiced: '',
    implemented: '',
    verified: '',
    stillUnclear: '',
    nextBestStep: '',
    artifactCreated: '',
    actuallyExecuted: '',
    testsPerformed: '',
    maturity: 'CONCEPT',
    maturityReason: '',
    updatedAt: '',
  },
  {
    id: '2',
    date: yesterdayStr,
    topic: 'T02',
    stage: 'TOOLS',
    goal: 'Goal',
    learned: '',
    mentalModel: '',
    practiced: '',
    implemented: '',
    verified: '',
    stillUnclear: '',
    nextBestStep: '',
    artifactCreated: '',
    actuallyExecuted: '',
    testsPerformed: '',
    maturity: 'CONCEPT',
    maturityReason: '',
    updatedAt: '',
  },
];
assert(calculateStudyStreak(mockLogs) === 2, 'Streak must be 2 for today and yesterday');
console.log('✓ calculateStudyStreak tests passed!');

// 4. Test runMonthEndAutomationSimulation & Idempotency
console.log('Test 4: Testing deterministic automation & idempotency keys in LAB-05...');
const run1 = runMonthEndAutomationSimulation(INITIAL_SYNTHETIC_CONTROLS, new Set(), '2026-10-09');
assert(run1.result.notificationsSent > 0, 'First run must send notifications');
assert(run1.result.duplicateRunsSuppressed === 0, 'First run should have zero duplicate suppressions');
assert(run1.result.escalationsTriggered >= 1, 'CTRL-104 (missing owner) must trigger escalation');

// Immediate second run with returned keys
const run2 = runMonthEndAutomationSimulation(INITIAL_SYNTHETIC_CONTROLS, run1.updatedRunKeys, '2026-10-09');
assert(run2.result.duplicateRunsSuppressed > 0, 'Second run must suppress duplicate emails via idempotency keys');
assert(run2.result.notificationsSent === 0, 'Second run must send zero duplicate notifications');
console.log('✓ runMonthEndAutomationSimulation idempotency tests passed!');


// 5. Test malformed backup rejection (must run before overwriting saved data)
console.log('Test 5: validating import backups...');
const validBackup = {
  schemaVersion: '1.0',
  exportedAt: '2026-10-25T00:00:00.000Z',
  preferences: { language: 'EN_KO', focus: 'BOTH', dailyGoalMin: 20 },
  attempts: {}, quizAttempts: {}, labSubmissions: {},
  evidenceRecords: [], sessionLogs: [], userNotes: {},
};
validateBackupPayload(validBackup);
for (const bad of [
  { ...validBackup, quizAttempts: [] },
  { ...validBackup, attempts: { T01: { id: 3 } } },
  { ...validBackup, userNotes: { T01: { injected: true } } },
  { ...validBackup, evidenceRecords: [{ id: 1 }] },
]) {
  let rejected = false;
  try { validateBackupPayload(bad); } catch { rejected = true; }
  assert(rejected, 'Malformed backup must be rejected before import');
}
console.log('✓ backup payload validation tests passed!');

console.log('\nAll 5 test suites passed successfully! Verification Complete.');
