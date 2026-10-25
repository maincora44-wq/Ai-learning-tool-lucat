export type Stage = 'TOOLS' | 'WORKFLOWS' | 'AUTOMATION' | 'AGENTS' | 'SYSTEMS';
export type Platform = 'CHATGPT' | 'M365' | 'CROSS';
export type Domain = 'INVESTING' | 'ECONOMY' | 'ENGLISH' | 'ACCOUNTING' | 'BOTH' | 'ALL';
export type ContentStatus = 'READY' | 'PLANNED';
export type Maturity = 'CONCEPT' | 'PROPOSAL' | 'PROTOTYPE' | 'WORKING' | 'VERIFIED';
export type EvidenceProvenance = 'USER_REPORTED' | 'APP_SIMULATION' | 'EXTERNAL_UNVERIFIED';

export interface GlossaryTerm {
  term: string;
  koreanMeaning: string;
  contextUsage: string;
  exampleSentence: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  prompt: string;
  kind: 'single_choice' | 'multi_choice';
  options: QuizOption[];
  correctOptionIds: string[];
  explanation: string;
  distractorExplanations?: Record<string, string>;
}

export interface LessonSection {
  title: string;
  subtitle?: string;
  content: string;
  diagramSvgType?: 'model_context' | 'workflow_loop' | 'automation_pipeline' | 'agent_cycle' | 'system_architecture';
}

export interface Lesson {
  id: string;
  code: string; // T01, W02, etc.
  title: string;
  stage: Stage;
  platform: Platform;
  domain: Domain;
  minutes: number;
  contentStatus: ContentStatus;
  objectives: string[];
  prerequisites: string[];
  problem: string;
  architecture: string;
  comparison: string;
  useWhen: string[];
  avoidWhen: string[];
  scenario: string;
  guidedSteps: string[];
  copyablePromptTemplate?: string;
  verification: {
    normalCase: string;
    edgeCase: string;
    failureCase: string;
    rerunCase: string;
  };
  nextStage: string;
  glossary: GlossaryTerm[];
  quizIds: string[];
  labId?: string;
  sourceFiles: string[];
  officialDocUrl?: string;
  lastReviewedAt?: string;
  licenseDependent?: boolean;
  securityNotice?: string;
}

export interface LabTestCase {
  id: string;
  kind: 'normal' | 'edge' | 'failure' | 'rerun';
  title: string;
  description: string;
  syntheticInput: any;
  expectedBehavior: string;
}

export interface LabRubricItem {
  dimension: string;
  max: number;
  rubricText: string;
}

export interface Lab {
  id: string;
  code: string; // LAB-01 ... LAB-08
  title: string;
  lessonIds: string[];
  domain: Domain;
  stage: Stage;
  minutes: number;
  scenario: string;
  syntheticFixtureDescription: string;
  syntheticDataCsv?: string;
  syntheticDataJson?: any;
  steps: string[];
  expectedDeliverables: string[];
  rubric: LabRubricItem[];
  testCases: LabTestCase[];
  interactiveType: 'tool_selector' | 'prompt_authoring' | 'accounting_memo' | 'investment_research' | 'flow_simulation' | 'power_automate_builder' | 'agent_investigator' | 'architecture_adr';
}

export interface LessonAttempt {
  id: string;
  lessonId: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  currentStep: number;
  quizScore?: number;
  studyOnly?: boolean;
}

export interface QuizAttempt {
  id: string;
  lessonId: string;
  timestamp: string;
  selectedAnswers: Record<string, string[]>;
  score: number; // 0 - 100
  passed: boolean; // >= 80%
}

export interface LabSubmission {
  id: string;
  labId: string;
  updatedAt: string;
  completedAt?: string;
  workingNotes: string;
  artifactPayload: any;
  selfRubricScores: Record<string, number>;
  testCaseResults: Record<string, 'pass' | 'fail' | 'untested'>;
  evidenceId?: string;
}

export interface EvidenceRecord {
  id: string;
  labId?: string;
  lessonId?: string;
  projectId?: string;
  title: string;
  maturity: Maturity;
  artifactDescription: string;
  artifactUri?: string;
  userDeclaredExists: boolean;
  executionRunRecorded: boolean;
  normalTest?: string;
  edgeTest?: string;
  failureTest?: string;
  rerunTest?: string;
  knownLimitations?: string;
  provenance: EvidenceProvenance;
  maturityReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  stage: Stage;
  goal: string;
  learned: string;
  mentalModel: string;
  practiced: string;
  implemented: string;
  verified: string;
  stillUnclear: string;
  nextBestStep: string;
  artifactCreated: string;
  actuallyExecuted: string;
  testsPerformed: string;
  maturity: Maturity;
  maturityReason: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: 'EN_KO' | 'KO' | 'EN';
  focus: Domain;
  dailyGoalMin: 15 | 20 | 30;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  reducedMotion: boolean;
  onboardingCompleted: boolean;
  safetyPledged: boolean;
  fontSize: 'standard' | 'large';
}

export interface ProjectCard {
  id: string;
  title: string;
  subtitle: string;
  domain: Domain;
  goal: string;
  currentMaturity: Maturity;
  currentBlocker: string;
  nextAction: string;
  modules: {
    id: string;
    title: string;
    stage: Stage;
    maturity: Maturity;
    deterministicRule: string;
    aiRole: string;
    humanApproval: string;
  }[];
  humanApprovalCheckpoints: string[];
}

export interface ExportDataPayload {
  schemaVersion: string;
  exportedAt: string;
  preferences: UserPreferences;
  attempts: Record<string, LessonAttempt>;
  quizAttempts: Record<string, QuizAttempt[]>;
  labSubmissions: Record<string, LabSubmission>;
  evidenceRecords: EvidenceRecord[];
  sessionLogs: SessionLog[];
  userNotes: Record<string, string>;
}
