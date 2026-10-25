import React, { useState, useMemo } from 'react';
import { LESSON_CATALOG } from '../data/lessonCatalog';
import { useLearningState } from '../hooks/useLearningState';
import { StageBadge } from '../components/StageBadge';
import { Stage, Platform, Domain } from '../domain/types';

interface RoadmapPageProps {
  onNavigate: (route: string, id?: string) => void;
}

const STAGE_METADATA: Record<
  Stage,
  {
    title: string;
    korean: string;
    question: string;
    output: string;
    description: string;
  }
> = {
  TOOLS: {
    title: '1단계 — 도구 (Tools)',
    korean: '도구 활용',
    question: '기초 모델, 컨텍스트 윈도우, 외부 도구, 메모리의 물리적 연산 경계는 어떻게 작동하는가?',
    output: '환각 없는 구조화 프롬프트 템플릿 및 업무별 최적 도구 할당 매트릭스',
    description: '다단계 자동화를 구축하기 전에 기초 모델의 추론 메커니즘, 토큰 한도, 도구 선택 원칙을 마스터합니다.',
  },
  WORKFLOWS: {
    title: '2단계 — 워크플로 (Workflows)',
    korean: '구조화된 워크플로',
    question: '복잡한 비즈니스 문제를 재현 가능하고 감사 가능한 단계별 절차로 어떻게 분해하는가?',
    output: '검증된 회계 기술 메모, 투자 리서치 파이프라인, 예외 검토 매트릭스',
    description: '단순 대화형 챗봇 질문을 표준화된 입력 계약, 유효성 검증, 검토자 승인 게이트로 체계화합니다.',
  },
  AUTOMATION: {
    title: '3단계 — 자동화 (Automation)',
    korean: '신뢰성 있는 자동화',
    question: '결정론적 업무를 중복 실행 없이 정기 트리거 및 안전한 재시도로 어떻게 구현하는가?',
    output: '멱등성 기반 월마감 알림 파이프라인, Power Automate 승인 흐름 및 DLP 거버넌스',
    description: '예외 처리기, 지수 백오프 재시도, 엄격한 멱등성 키(Idempotency Key)로 스케줄을 안전하게 연결합니다.',
  },
  AGENTS: {
    title: '4단계 — 에이전트 (Agents)',
    korean: '목표 지향 에이전트',
    question: '자율 에이전트 루프가 반드시 필요한 시점은 언제이며, 인간의 통제 가드레일을 어떻게 강제하는가?',
    output: '읽기 전용 보안 경계와 최대 반복 제한이 확립된 계정조정 조사 에이전트',
    description: '목표 → 계획 → 도구 호출 → 관찰 루프를 설계하고 횟수 제한과 인간 서명(HITL) 체계를 결합합니다.',
  },
  SYSTEMS: {
    title: '5단계 — 시스템 (Systems)',
    korean: '엔터프라이즈 시스템',
    question: '총체적인 AI 운영체제를 어떻게 평가, 모니터링, 거버넌스 관리하는가?',
    output: '7대 모듈 투자 리서치 OS 및 내부통제 자동화 랩 아키텍처 결정 기록(ADR)',
    description: '도구, 워크플로, 자동화, 에이전트를 통합 보안, 평가 프레임워크, 장애 복구 런북 아래 결합합니다.',
  },
};

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate }) => {
  const { attempts } = useLearningState();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'ALL'>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'ALL'>('ALL');
  const [selectedStageTab, setSelectedStageTab] = useState<Stage | 'ALL'>('ALL');

  const STAGES: Stage[] = ['TOOLS', 'WORKFLOWS', 'AUTOMATION', 'AGENTS', 'SYSTEMS'];

  const filteredLessons = useMemo(() => {
    return LESSON_CATALOG.filter((l) => {
      if (selectedPlatform !== 'ALL' && l.platform !== selectedPlatform && l.platform !== 'CROSS') {
        return false;
      }
      if (selectedDomain !== 'ALL' && l.domain !== selectedDomain && l.domain !== 'BOTH') {
        return false;
      }
      if (selectedStageTab !== 'ALL' && l.stage !== selectedStageTab) {
        return false;
      }
      return true;
    });
  }, [selectedPlatform, selectedDomain, selectedStageTab]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
          5단계 커리큘럼 로드맵 (전체 35개 주제)
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          점진적 역량 사다리: 1.도구(Tools) → 2.워크플로(Workflows) → 3.자동화(Automation) → 4.에이전트(Agents) → 5.시스템(Systems)
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        {/* Platform filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 mr-1">플랫폼 필터:</span>
          {(['ALL', 'CHATGPT', 'M365', 'CROSS'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedPlatform === p
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'ALL' ? '전체 플랫폼' : p === 'CHATGPT' ? 'ChatGPT' : p === 'M365' ? 'Microsoft 365' : '크로스 플랫폼'}
            </button>
          ))}
        </div>

        {/* Domain filter & stage tab */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 mr-1">전문 분야:</span>
            {(['ALL', 'INVESTING', 'ECONOMY', 'ENGLISH', 'ACCOUNTING'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedDomain === d
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d === 'ALL'
                  ? '전체 과정 🚀'
                  : d === 'INVESTING'
                  ? '투자분석 📈'
                  : d === 'ECONOMY'
                  ? '거시경제 🌐'
                  : d === 'ENGLISH'
                  ? '비즈니스영어 💬'
                  : '회계/통제 ⚖️'}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            35개 커리큘럼 주제 중 {filteredLessons.length}개 표시 중
          </div>
        </div>
      </div>

      {/* Stages view */}
      <div className="space-y-8">
        {STAGES.map((stage) => {
          const stageLessons = filteredLessons.filter((l) => l.stage === stage);
          if (selectedStageTab !== 'ALL' && selectedStageTab !== stage) return null;
          if (stageLessons.length === 0) return null;

          const meta = STAGE_METADATA[stage];
          const readyCount = stageLessons.filter((l) => l.contentStatus === 'READY').length;
          const completedCount = stageLessons.filter((l) => Boolean(attempts[l.id]?.completedAt)).length;

          return (
            <div key={stage} className="space-y-3">
              {/* Stage Header Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <StageBadge stage={stage} size="md" />
                    <span className="text-xs text-slate-400 font-medium font-mono">
                      완료 {completedCount}개 · 학습 가능 {readyCount}개 · 준비 중 {stageLessons.length - readyCount}개
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-2 font-medium">
                    <span className="text-cyan-400 font-bold">핵심 질문:</span> {meta.question}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-bold">대표 산출물:</span> {meta.output}
                  </div>
                </div>
              </div>

              {/* Lessons Grid for this stage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {stageLessons.map((lesson) => {
                  const isReady = lesson.contentStatus === 'READY';
                  const attempt = attempts[lesson.id];
                  const isDone = Boolean(attempt?.completedAt);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        if (isReady) {
                          onNavigate('lesson', lesson.id);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isReady
                          ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 cursor-pointer group shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/60 opacity-65 cursor-default'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                            <span className={isReady ? 'text-cyan-400' : 'text-slate-500'}>
                              {lesson.code}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-[10px] text-slate-400 font-normal uppercase">
                              {lesson.platform === 'CHATGPT' ? 'ChatGPT' : lesson.platform === 'M365' ? 'M365 Copilot' : '크로스플랫폼'} · {lesson.domain === 'ACCOUNTING' ? '회계' : lesson.domain === 'INVESTING' ? '투자' : '공통'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {isDone && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                                ✓ 학습 완료
                              </span>
                            )}
                            {!isReady && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                                개설 예정
                              </span>
                            )}
                            {isReady && !isDone && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                소요시간 {lesson.minutes}분
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className={`text-sm font-bold leading-snug ${isReady ? 'text-white group-hover:text-cyan-300' : 'text-slate-400'}`}>
                          {lesson.title}
                        </h3>

                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {lesson.problem}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        {isReady ? (
                          <>
                            <span className="text-cyan-400/90 font-medium group-hover:translate-x-0.5 transition-transform">
                              8단계 심화 학습 시작 →
                            </span>
                            {lesson.labId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate('practice', lesson.labId);
                                }}
                                className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-mono text-[10px]"
                              >
                                ⚡ 연계 랩 ({lesson.labId})
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-500 text-[10px] italic">
                            v1.0 커리큘럼 카탈로그 등록 주제 (순차 오픈 예정)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
