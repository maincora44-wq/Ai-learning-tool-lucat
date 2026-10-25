import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../domain/types';
import { calculateQuizScore } from '../domain/mastery';
import { useLearningState } from '../hooks/useLearningState';

export interface MiniQuizProps {
  lessonId: string;
  lessonTitle: string;
  lessonCode: string;
  questions: QuizQuestion[];
  isCompleted?: boolean;
  completedAt?: string;
  initialScore?: number;
  labId?: string;
  nextLessonId?: string;
  onCompleteLesson: (score: number) => void;
  onNavigate?: (route: string, id?: string) => void;
}

export const MiniQuiz: React.FC<MiniQuizProps> = ({
  lessonId,
  lessonTitle,
  lessonCode,
  questions: rawQuestions,
  isCompleted = false,
  completedAt,
  initialScore,
  labId,
  nextLessonId,
  onCompleteLesson,
  onNavigate,
}) => {
  const { recordQuizAttempt } = useLearningState();

  // If a lesson has no questions authored yet, generate dynamic fallback verification questions
  const questions: QuizQuestion[] =
    rawQuestions && rawQuestions.length > 0
      ? rawQuestions
      : [
          {
            id: `Q-FB-${lessonId}-1`,
            lessonId,
            prompt: `[${lessonCode}] ${lessonTitle}에서 다룬 아키텍처 원칙에 비추어 볼 때, AI 시스템 도입 시 가장 먼저 검증해야 하는 것은 무엇입니까?`,
            kind: 'single_choice',
            options: [
              { id: 'opt1', text: '컨텍스트 윈도우에 주입되는 입력 데이터의 무결성 및 외부 도구 호출의 결정론적 검증 체계' },
              { id: 'opt2', text: '모델이 별도의 도구 없이 사내 비공개 데이터베이스를 자동으로 크롤링할 수 있는지 여부' },
              { id: 'opt3', text: '모든 수치 계산을 파이썬 대신 순수 텍스트 프롬프트로만 처리할 수 있는지 여부' },
              { id: 'opt4', text: '프롬프트에 아무런 제약 조건 없이 자율 실행을 허용하는지 여부' },
            ],
            correctOptionIds: ['opt1'],
            explanation: 'AI 시스템은 명시적으로 주입된 컨텍스트와 검증된 도구를 통해서만 신뢰성을 확보할 수 있습니다. 비공개 데이터 자동 크롤링이나 순수 텍스트 수치 계산은 환각 위험을 초래합니다.',
          },
          {
            id: `Q-FB-${lessonId}-2`,
            lessonId,
            prompt: '실무 배포(Working / Verified) 수준에 도달하기 위해 필수적으로 수행해야 하는 4대 검증 테스트는 무엇입니까?',
            kind: 'single_choice',
            options: [
              { id: 'opt1', text: '정상 케이스, 엣지 케이스, 실패/가드레일 방어 케이스, 재실행 일관성(멱등성) 테스트' },
              { id: 'opt2', text: '속도 테스트, 화면 캡처 테스트, 글자 수 테스트, 폰트 스타일 테스트' },
              { id: 'opt3', text: '단일 프롬프트 실행 후 결과가 마음에 드는지 확인하는 주관적 평가' },
              { id: 'opt4', text: '인터넷 연결 여부 확인 및 브라우저 새로고침 테스트' },
            ],
            correctOptionIds: ['opt1'],
            explanation: '내부통제 및 감사 수준의 AI 성숙도를 입증하기 위해서는 정상(Normal), 경계값(Edge), 예외차단(Failure), 재실행 일관성(Rerun) 4대 체계적 테스트가 필수적입니다.',
          },
        ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stack' | 'focus'>('stack');
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
    questionResults: Record<string, boolean>;
    totalCorrect: number;
    totalQuestions: number;
  } | null>(null);

  const [justCompleted, setJustCompleted] = useState<boolean>(false);

  // Sync state if lesson changes
  useEffect(() => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
    setActiveQuestionIdx(0);
    setJustCompleted(false);
  }, [lessonId]);

  const answeredCount = Object.keys(selectedAnswers).filter(
    (qid) => selectedAnswers[qid]?.length > 0
  ).length;
  const isAllAnswered = answeredCount === questions.length;

  const handleSelectOption = (qId: string, optId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: [optId],
    }));
  };

  const handleSubmit = () => {
    const res = calculateQuizScore(questions, selectedAnswers);
    setQuizResult(res);
    setIsSubmitted(true);
    recordQuizAttempt(lessonId, selectedAnswers, res.score, res.passed);

    // Auto mark as complete if passed
    if (res.passed) {
      onCompleteLesson(res.score);
      setJustCompleted(true);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizResult(null);
    setActiveQuestionIdx(0);
    setJustCompleted(false);
  };

  const handleMarkAsCompleteManually = () => {
    const score = quizResult?.score ?? (initialScore || 100);
    onCompleteLesson(score);
    setJustCompleted(true);
  };

  return (
    <div
      id="lesson-mini-quiz"
      className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Decorative gradient corner glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mini-Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm">
              🧠
            </span>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>이해 점검 미니 퀴즈</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {questions.length}문항
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            레슨을 완료하기 전 핵심 아키텍처와 비즈니스 통제 원칙을 이해했는지 점검합니다.
            <span className="text-cyan-400 font-semibold ml-1">
              (합격 기준: 80점 이상)
            </span>
          </p>
        </div>

        {/* Status / View Mode Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View mode toggle */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('stack')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-medium ${
                viewMode === 'stack'
                  ? 'bg-slate-800 text-cyan-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="전체 문항 한눈에 보기"
            >
              전체 보기
            </button>
            <button
              onClick={() => setViewMode('focus')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-medium ${
                viewMode === 'focus'
                  ? 'bg-slate-800 text-cyan-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="문항별 집중 모드"
            >
              문항별 보기
            </button>
          </div>

          {/* Current Completion State Badge */}
          {isCompleted || justCompleted ? (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
              <span>✓</span>
              <span>완료됨 ({quizResult?.score ?? initialScore ?? 100}점)</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              완료 대기 중
            </span>
          )}
        </div>
      </div>

      {/* Progress & Score Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            응답 진행도: {answeredCount} / {questions.length} 완료
          </span>
          {quizResult && (
            <span
              className={`font-bold ${
                quizResult.passed ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              채점 결과: {quizResult.score}점 ({quizResult.totalCorrect}/
              {quizResult.totalQuestions} 정답) {quizResult.passed ? '🎉 통과' : '⚠️ 미달'}
            </span>
          )}
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className={`h-full transition-all duration-300 ${
              isSubmitted
                ? quizResult?.passed
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
                : 'bg-cyan-500'
            }`}
            style={{
              width: isSubmitted
                ? `${quizResult?.score || 0}%`
                : `${(answeredCount / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Focus Mode Step Indicator (if in focus view) */}
      {viewMode === 'focus' && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-1.5">
            {questions.map((q, idx) => {
              const isAns = (selectedAnswers[q.id]?.length || 0) > 0;
              const isCur = activeQuestionIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center cursor-pointer ${
                    isCur
                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400/50'
                      : isAns
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {activeQuestionIdx + 1} / {questions.length}
          </div>
        </div>
      )}

      {/* Question List (Stack View or Focus View) */}
      <div className="space-y-5">
        {(viewMode === 'stack' ? questions : [questions[activeQuestionIdx]]).map(
          (q, renderedIdx) => {
            const actualIndex =
              viewMode === 'stack' ? renderedIdx : activeQuestionIdx;
            const userSelections = selectedAnswers[q.id] || [];
            const isCorrect = quizResult?.questionResults[q.id];

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700/80'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      문항 {actualIndex + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-white leading-relaxed">
                      {q.prompt}
                    </h4>
                  </div>

                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 font-mono ${
                        isCorrect
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {isCorrect ? '✓ 정답' : '✕ 오답'}
                    </span>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => {
                    const isChosen = userSelections.includes(opt.id);
                    const isAnswer = q.correctOptionIds.includes(opt.id);

                    let btnStyle =
                      'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

                    if (isSubmitted) {
                      if (isAnswer) {
                        btnStyle =
                          'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold shadow-sm shadow-emerald-950';
                      } else if (isChosen && !isAnswer) {
                        btnStyle =
                          'bg-rose-950/50 border-rose-500/80 text-rose-300 line-through opacity-85';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500';
                      }
                    } else if (isChosen) {
                      btnStyle =
                        'bg-cyan-500/15 border-cyan-400 text-cyan-200 font-medium shadow-sm shadow-cyan-950';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`w-full p-3 rounded-xl border text-left text-xs leading-relaxed transition flex items-start gap-3 cursor-pointer ${btnStyle} ${
                          isSubmitted ? 'cursor-default' : ''
                        }`}
                      >
                        {/* Radio indicator */}
                        <span
                          className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                            isSubmitted
                              ? isAnswer
                                ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold text-[10px]'
                                : isChosen
                                ? 'border-rose-400 bg-rose-500 text-white font-bold text-[10px]'
                                : 'border-slate-700 bg-slate-900'
                              : isChosen
                              ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-black text-[10px]'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSubmitted ? (isAnswer ? '✓' : isChosen ? '✕' : '') : isChosen ? '●' : ''}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanations (Revealed on submission) */}
                {isSubmitted && (
                  <div className="pt-2 space-y-2">
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200/90'
                          : 'bg-amber-950/30 border-amber-800/40 text-amber-200/90'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        <span>💡</span>
                        <span>정답 및 아키텍처 해설:</span>
                      </div>
                      <p>{q.explanation}</p>
                    </div>

                    {/* Distractor explanations if available */}
                    {q.distractorExplanations && Object.keys(q.distractorExplanations).length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                        <div className="font-semibold text-slate-300">
                          🔍 오답 선지 주의사항 (함정 및 통제 미비점):
                        </div>
                        {Object.entries(q.distractorExplanations).map(([optId, exp]) => (
                          <div key={optId} className="pl-2 border-l-2 border-amber-500/40">
                            <span className="text-amber-400 font-mono mr-1">[{optId}]</span>
                            <span>{exp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* Focus Mode Nav Buttons */}
      {viewMode === 'focus' && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
            disabled={activeQuestionIdx === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-800 ${
              activeQuestionIdx === 0
                ? 'opacity-30 cursor-not-allowed text-slate-500'
                : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
            }`}
          >
            ← 이전 문항
          </button>
          <button
            onClick={() =>
              setActiveQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))
            }
            disabled={activeQuestionIdx === questions.length - 1}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 cursor-pointer ${
              activeQuestionIdx === questions.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            다음 문항 →
          </button>
        </div>
      )}

      {/* Quiz Action Bar */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {!isSubmitted ? (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-lg ${
                isAllAnswered
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              <span>퀴즈 제출 및 이해도 채점</span>
              <span>({answeredCount}/{questions.length})</span>
            </button>
            {!isAllAnswered && (
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                * 모든 문항을 선택해야 채점할 수 있습니다.
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              다시 풀기 ↺
            </button>

            {quizResult?.passed ? (
              <button
                onClick={handleMarkAsCompleteManually}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>✓ 학습 완료 등록 확인</span>
                <span>({quizResult.score}점)</span>
              </button>
            ) : (
              <span className="text-xs text-rose-400 font-medium">
                통과 기준(80점) 미달입니다. 오답 해설을 검토한 후 '다시 풀기'를 진행해 주세요.
              </span>
            )}
          </div>
        )}

        {/* Post-Quiz Navigation: Next Lab or Next Lesson */}
        {(quizResult?.passed || isCompleted || justCompleted) && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {labId && onNavigate && (
              <button
                onClick={() => onNavigate('practice', labId)}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>연계 실습 랩 시작</span>
                <span className="text-cyan-400">→</span>
              </button>
            )}
            {nextLessonId && onNavigate && (
              <button
                onClick={() => onNavigate('lessons', nextLessonId)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <span>다음 레슨</span>
                <span>→</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Completion Banner */}
      {(justCompleted || (isCompleted && !isSubmitted)) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>레슨 학습 완료 인증 완료</span>
                {completedAt && (
                  <span className="text-[10px] font-mono text-slate-400">
                    ({new Date(completedAt).toLocaleDateString()})
                  </span>
                )}
              </div>
              <div className="text-emerald-300/80 text-[11px] mt-0.5">
                일일 연속 학습 스트릭 및 프로필 진행도 원장에 반영되었습니다.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {labId && onNavigate && (
              <button
                onClick={() => onNavigate('practice', labId)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
              >
                실습 랩 바로가기 →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
