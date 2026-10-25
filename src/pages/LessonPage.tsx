import React, { useState, useEffect } from 'react';
import { LESSON_CATALOG } from '../data/lessonCatalog';
import { ALL_QUIZZES } from '../data/quizzes';
import { useLearningState } from '../hooks/useLearningState';
import { StageBadge } from '../components/StageBadge';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { MiniQuiz } from '../components/MiniQuiz';
import { QuizQuestion } from '../domain/types';

interface LessonPageProps {
  lessonId: string;
  onNavigate: (route: string, id?: string) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({ lessonId, onNavigate }) => {
  const {
    attempts,
    recordLessonStep,
    completeLesson,
    userNotes,
    setUserNote,
  } = useLearningState();

  const lesson = LESSON_CATALOG.find((l) => l.id === lessonId) || LESSON_CATALOG[0];
  const attempt = attempts[lesson.id];

  const currentIdx = LESSON_CATALOG.findIndex((l) => l.id === lesson.id);
  const nextLesson =
    currentIdx >= 0 && currentIdx < LESSON_CATALOG.length - 1
      ? LESSON_CATALOG[currentIdx + 1]
      : undefined;

  const [activeStep, setActiveStep] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    if (userNotes[lesson.id]) {
      setNoteContent(userNotes[lesson.id]);
    } else {
      setNoteContent('');
    }
    // Track start
    recordLessonStep(lesson.id, activeStep);
  }, [lesson.id]);

  const handleStepChange = (newStep: number) => {
    setActiveStep(newStep);
    recordLessonStep(lesson.id, newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPrompt = () => {
    if (lesson.copyablePromptTemplate) {
      navigator.clipboard.writeText(lesson.copyablePromptTemplate);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleSaveNote = () => {
    setUserNote(lesson.id, noteContent);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Quizzes for this lesson
  const questions: QuizQuestion[] = (lesson.quizIds || [])
    .map((qid) => ALL_QUIZZES[qid])
    .filter(Boolean);

  const SECTIONS = [
    { id: 0, title: '1. 해결 과제', subtitle: '실무 Pain Point' },
    { id: 1, title: '2. 아키텍처', subtitle: '멘탈 모델 & 데이터 흐름' },
    { id: 2, title: '3. 개념 비교', subtitle: '인접 기술 및 차이점' },
    { id: 3, title: '4. 판단 기준', subtitle: '적용 시점 vs 배제 기준' },
    { id: 4, title: '5. 실무 시나리오', subtitle: '합성 비즈니스 케이스' },
    { id: 5, title: '6. 단계별 실습', subtitle: '프롬프트 & 템플릿' },
    { id: 6, title: '7. 검증 케이스', subtitle: '4대 스트레스 테스트' },
    { id: 7, title: '8. 퀴즈 & 성숙도', subtitle: '이해 점검 & 다음 단계' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Lesson Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-cyan-400">{lesson.code}</span>
            <StageBadge stage={lesson.stage} size="sm" />
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
              {lesson.platform === 'CHATGPT' ? 'ChatGPT' : lesson.platform === 'M365' ? 'Microsoft 365' : '크로스플랫폼'} · {lesson.domain === 'ACCOUNTING' ? '회계/통제' : lesson.domain === 'INVESTING' ? '투자분석' : '통합'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>⏱ 소요시간 {lesson.minutes}분</span>
            {attempt?.completedAt && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                ✓ 학습 완료
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
            {lesson.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-300">
            <span className="text-cyan-400 font-semibold">핵심 목표:</span>
            <span>{lesson.objectives[0]}</span>
          </div>
        </div>

        {/* Security / Synthetic Data Notice */}
        {lesson.securityNotice && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-300/90 flex items-center gap-2">
            <span>🛡</span>
            <span>{lesson.securityNotice}</span>
          </div>
        )}
      </div>

      {/* Stepped Section Progress Bar (Optimized for Fold7) */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div className="flex gap-1.5 min-w-max">
          {SECTIONS.map((sec) => {
            const isActive = activeStep === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleStepChange(sec.id)}
                className={`px-3 py-2 rounded-xl text-left transition-all border ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] font-mono leading-none">{sec.title}</div>
                <div className="text-[9px] opacity-75 mt-0.5 leading-none">{sec.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stepped Content Body */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-200">
        {/* Step 0: Problem Solved */}
        {activeStep === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">1.</span> 해결하고자 하는 구체적 Pain Point
            </h2>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-300">
              {lesson.problem}
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                측정 가능한 세부 학습 목표:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {lesson.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Step 1: Architecture & Mental Model */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">2.</span> 기저 아키텍처 및 멘탈 모델 (Mental Model)
            </h2>
            <div className="whitespace-pre-line font-sans text-sm text-slate-300 leading-relaxed p-4 bg-slate-950 rounded-2xl border border-slate-800">
              {lesson.architecture}
            </div>

            {/* Visual Architecture Diagram */}
            <div className="pt-2">
              <ArchitectureDiagram
                type={
                  lesson.stage === 'TOOLS'
                    ? 'model_context'
                    : lesson.stage === 'WORKFLOWS'
                    ? 'workflow_loop'
                    : lesson.stage === 'AUTOMATION'
                    ? 'automation_pipeline'
                    : lesson.stage === 'AGENTS'
                    ? 'agent_cycle'
                    : 'system_architecture'
                }
              />
            </div>
          </div>
        )}

        {/* Step 2: Comparison */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">3.</span> 인접 개념과의 비교 및 차이점
            </h2>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-300">
              {lesson.comparison}
            </div>
          </div>
        )}

        {/* Step 3: Decision Criteria */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">4.</span> 명시적 의사결정 기준: 적용 시점 vs 배제 기준
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✓</span> 적용해야 하는 경우 (When to Use):
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {lesson.useWhen.map((uw, i) => (
                    <li key={i}>{uw}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✕</span> 절대 사용하지 말아야 할 경우 (When NOT to Use):
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {lesson.avoidWhen.map((aw, i) => (
                    <li key={i}>{aw}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Applied Scenario */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">5.</span> 실무 합성 비즈니스 시나리오
            </h2>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-300">
              {lesson.scenario}
            </div>
          </div>
        )}

        {/* Step 5: Guided Exercise & Template */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">6.</span> 단계별 실습 가이드 및 복사 가능 프롬프트 템플릿
            </h2>

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                단계별 실행 절차:
              </h3>
              <ol className="space-y-2 text-xs text-slate-300">
                {lesson.guidedSteps.map((step, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {lesson.copyablePromptTemplate && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                    즉시 사용 가능한 프롬프트 템플릿:
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition"
                  >
                    {copyFeedback ? '✓ 클립보드 복사 완료!' : '템플릿 복사하기'}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 whitespace-pre-wrap overflow-x-auto">
                  {lesson.copyablePromptTemplate}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Tests & Verification */}
        {activeStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">7.</span> 4대 다각적 체계적 검증 케이스 (Stress Test)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono font-bold text-emerald-400 block">1. 정상 케이스 (Normal Case):</span>
                <p className="text-slate-300">{lesson.verification.normalCase}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono font-bold text-amber-400 block">2. 엣지 케이스 (Edge Case):</span>
                <p className="text-slate-300">{lesson.verification.edgeCase}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono font-bold text-rose-400 block">3. 실패 방지 케이스 (Failure Case):</span>
                <p className="text-slate-300">{lesson.verification.failureCase}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono font-bold text-cyan-400 block">4. 재실행 / 멱등성 케이스 (Rerun Case):</span>
                <p className="text-slate-300">{lesson.verification.rerunCase}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Next Maturity Step, English Glossary & Quiz */}
        {activeStep === 7 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-cyan-400">8.</span> 다음 성숙도 단계 및 액션 플랜
              </h2>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-300">
                {lesson.nextStage}
              </div>
            </div>

            {/* Inject MiniQuiz Component to verify comprehension before completion */}
            <MiniQuiz
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              lessonCode={lesson.code}
              questions={questions}
              isCompleted={Boolean(attempt?.completedAt)}
              completedAt={attempt?.completedAt}
              initialScore={attempt?.quizScore}
              labId={lesson.labId}
              nextLessonId={nextLesson?.id}
              onCompleteLesson={(score) => completeLesson(lesson.id, score, false)}
              onNavigate={onNavigate}
            />

            {/* Professional English Expressions with Korean Meanings */}
            {lesson.glossary.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  실무 영문 전문 표현 및 한국어 해설 (Global Business English)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {lesson.glossary.map((g, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="font-bold text-cyan-300 text-sm">{g.term}</div>
                      <div className="text-slate-300 text-[11px] font-medium">{g.koreanMeaning}</div>
                      <div className="text-slate-400 text-[11px] italic pt-1 border-t border-slate-800/80">
                        "{g.exampleSentence}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comprehension Quiz Gatekeeper Notice for Steps 0-6 */}
        {activeStep < 7 && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🧠</span>
              <div>
                <span className="text-slate-300 font-medium">
                  레슨 완료 인증을 위해 8단계 '이해 점검 미니 퀴즈'({questions.length}문항)를 통과해야 합니다.
                </span>
                {attempt?.completedAt ? (
                  <span className="ml-2 text-emerald-400 font-mono text-[11px] font-bold">
                    ✓ 통과 완료 ({attempt.quizScore ?? 100}점)
                  </span>
                ) : (
                  <span className="ml-2 text-amber-400 font-mono text-[11px]">
                    (80점 이상 필요)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleStepChange(7)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold whitespace-nowrap transition cursor-pointer self-start sm:self-auto"
            >
              미니 퀴즈 바로가기 →
            </button>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-medium ${
              activeStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-500'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            ← 이전 섹션
          </button>

          <span className="text-xs font-mono text-slate-400">
            8개 섹션 중 {activeStep + 1}단계
          </span>

          <button
            onClick={() => handleStepChange(Math.min(7, activeStep + 1))}
            disabled={activeStep === 7}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              activeStep === 7
                ? 'opacity-30 cursor-not-allowed text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            다음 섹션 →
          </button>
        </div>
      </div>

      {/* Private Local User Notes Drawer */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            나만의 학습 메모 및 회고 (개인 학습 원장)
          </h3>
          <button
            onClick={handleSaveNote}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs transition"
          >
            {noteSaved ? '✓ 브라우저 저장 완료' : '메모 저장하기'}
          </button>
        </div>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="이 레슨에서 얻은 핵심 인사이트, 질문 사항, 회사 실무 적용 아이디어를 기록하십시오..."
          rows={3}
          className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
        />
        <div className="text-[10px] text-slate-400">
          * 브라우저 로컬 저장소(IndexedDB)에 보관되며, 설정 메뉴에서 언제든 JSON 백업을 다운로드할 수 있습니다.
        </div>
      </div>
    </div>
  );
};
