import React from 'react';
import { useLearningState } from '../hooks/useLearningState';
import { LESSON_CATALOG } from '../data/lessonCatalog';
import { ALL_LABS } from '../data/labs';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { Stage } from '../domain/types';

interface HomePageProps {
  onNavigate: (route: string, id?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const {
    preferences,
    updatePreferences,
    studiedLessonsCount,
    workingEvidenceCount,
    verifiedEvidenceCount,
    proposalCount,
    prototypeCount,
    recommendedLesson,
    attempts,
    chatgptProgress,
    m365Progress,
    labsCompletedCount,
  } = useLearningState();

  const STAGES: { stage: Stage; label: string; desc: string }[] = [
    { stage: 'TOOLS', label: '1. 도구 (Tools)', desc: '기초 모델, 컨텍스트, 토큰 및 도구 연동' },
    { stage: 'WORKFLOWS', label: '2. 워크플로 (Workflows)', desc: '입력 스키마, 의사결정 분기 및 출력 검증' },
    { stage: 'AUTOMATION', label: '3. 자동화 (Automation)', desc: '트리거, 재시도, 멱등성 및 장애 복구' },
    { stage: 'AGENTS', label: '4. 에이전트 (Agents)', desc: '목표 지향, 관찰 루프 및 인간 참여(HITL)' },
    { stage: 'SYSTEMS', label: '5. 시스템 (Systems)', desc: '참조 아키텍처 및 감사 거버넌스' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Daily Objective Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              오늘의 학습 미션 · 권장 {preferences.dailyGoalMin}분 집중 실습
            </span>
            <span className="text-xs text-slate-400 font-medium">
              삼성 갤럭시 Z 폴드7 최적화 PWA
            </span>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {recommendedLesson ? recommendedLesson.title : '단계별 AI 실무 학습 여정'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {recommendedLesson
                ? recommendedLesson.problem
                : 'ChatGPT와 Microsoft 365 AI를 증적 기반의 5단계 엔지니어링 프레임워크로 학습합니다.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {recommendedLesson && (
              <button
                onClick={() => onNavigate('lesson', recommendedLesson.id)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <span>오늘의 레슨 시작하기</span>
                <span>→</span>
              </button>
            )}

            {recommendedLesson?.labId && (
              <button
                onClick={() => onNavigate('practice', recommendedLesson.labId)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 text-emerald-400 text-xs font-semibold transition flex items-center gap-2"
              >
                <span>⚡ 연계 실습 랩 열기 ({recommendedLesson.labId})</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
            >
              전체 커리큘럼 로드맵
            </button>
          </div>
        </div>
      </div>

      {/* Real Aggregate Evidence Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200">
        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2">
          증적 기반 구현 상태 감사 원장 (Evidence Ledger)
        </div>
        <p className="text-sm font-medium text-slate-200">
          현재 총 <strong className="text-cyan-400 font-mono">{studiedLessonsCount}</strong>개{' '}
          레슨을 학습했으며, <strong className="text-emerald-400 font-mono">{workingEvidenceCount}</strong>개{' '}
          구현물이 실제 작동(Working) 상태이고,{' '}
          <strong className="text-violet-400 font-mono">{verifiedEvidenceCount}</strong>개가 전방위 검증(Verified)되었습니다.
        </p>
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <EvidenceBadge maturity="PROPOSAL" size="sm" />
          <span className="text-slate-400 font-mono text-[11px] self-center mr-3">{proposalCount}개 제안</span>
          <EvidenceBadge maturity="PROTOTYPE" size="sm" />
          <span className="text-slate-400 font-mono text-[11px] self-center mr-3">{prototypeCount}개 프로토타입</span>
          <EvidenceBadge maturity="WORKING" size="sm" />
          <span className="text-slate-400 font-mono text-[11px] self-center mr-3">{workingEvidenceCount}개 작동 입증</span>
          <EvidenceBadge maturity="VERIFIED" size="sm" />
          <span className="text-slate-400 font-mono text-[11px] self-center">{verifiedEvidenceCount}개 전방위 검증</span>
        </div>
      </div>

      {/* Capability Ladder Progression */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            역량 사다리 누적 진행도 (Capability Ladder)
          </h2>
          <span className="text-xs text-slate-400">단계별 숙련도</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {STAGES.map((s) => {
            const stageLessons = LESSON_CATALOG.filter((l) => l.stage === s.stage && l.contentStatus === 'READY');
            const comp = stageLessons.filter((l) => Boolean(attempts[l.id]?.completedAt)).length;
            const pct = stageLessons.length ? Math.round((comp / stageLessons.length) * 100) : 0;

            return (
              <button
                key={s.stage}
                onClick={() => onNavigate('roadmap')}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{s.desc}</div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>{comp}/{stageLessons.length}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Teacher's 4 Practical Domain Tracks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">👨‍🏫</span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              AI 선생님의 4대 실무 특화 트랙 (다양한 방면의 AI 활용)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('coach')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
          >
            선생님 스튜디오 열기 →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              domain: 'INVESTING' as const,
              title: '투자 & 밸류에이션 리서치',
              icon: '📈',
              badge: '재무제표 & DCF',
              lessonId: 'INV-01',
              desc: 'Python 샌드박스로 10-K 공시 원문 파싱, FCF 계산 및 적대적 멀티 에이전트 투자 심의회 구축.',
            },
            {
              domain: 'ECONOMY' as const,
              title: '거시 경제 & 글로벌 마켓',
              icon: '🌐',
              badge: 'FOMC & 금리/물가',
              lessonId: 'ECO-01',
              desc: '연준 FOMC 성명서 Redline 문구 비교, 장단기 금리 역전 및 CPI 인플레이션 시나리오 트리.',
            },
            {
              domain: 'ENGLISH' as const,
              title: '실전 비즈니스 영어 & 협상',
              icon: '💬',
              badge: 'C레벨 영작 & 롤플레잉',
              lessonId: 'ENG-01',
              desc: '3가지 톤(Executive/Assertive/Collaborative) 정밀 교정 및 해외 바이어 1:1 실전 협상 에이전트.',
            },
            {
              domain: 'ALL' as const,
              title: '올라운드 종합 AI 마스터',
              icon: '🚀',
              badge: '도구 → 시스템',
              lessonId: 'T01',
              desc: '100페이지 백서 3분 구조화, 프롬프트 체이닝, 자동화 파이프라인 및 엔터프라이즈 운영체제.',
            },
          ].map((track) => {
            const isCurrent =
              preferences.focus === track.domain ||
              (track.domain === 'ALL' && (preferences.focus === 'BOTH' || preferences.focus === 'ALL'));

            return (
              <div
                key={track.domain}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xl">{track.icon}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      {track.badge}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white leading-snug">{track.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-3">
                    {track.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => {
                      updatePreferences({ focus: track.domain });
                    }}
                    className={`font-semibold cursor-pointer ${
                      isCurrent ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isCurrent ? '✓ 활성 트랙' : '트랙 선택'}
                  </button>
                  <button
                    onClick={() => onNavigate('lesson', track.lessonId)}
                    className="text-cyan-300 hover:text-cyan-200 font-bold cursor-pointer"
                  >
                    레슨 보기 →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform & Applied Practice Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* ChatGPT */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-400 font-mono">ChatGPT 트랙</span>
            <span className="text-[11px] text-slate-400">{chatgptProgress.completed}/{chatgptProgress.total}개 완료</span>
          </div>
          <div className="text-[11px] text-slate-400">
            고급 프롬프트, 코드 인터프리터 Python 분석, 재현 가능한 리서치 및 투자 메모.
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${chatgptProgress.pct}%` }} />
          </div>
        </div>

        {/* Microsoft 365 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-cyan-400 font-mono">Microsoft 365 AI 트랙</span>
            <span className="text-[11px] text-slate-400">{m365Progress.completed}/{m365Progress.total}개 완료</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Microsoft Graph 테넌트 보안, Excel/Word 코파일럿, Power Automate 클라우드 결재 흐름.
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: `${m365Progress.pct}%` }} />
          </div>
        </div>

        {/* Applied Labs */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-teal-400 font-mono">실습 랩 & 시뮬레이션</span>
            <span className="text-[11px] text-slate-400">{labsCompletedCount}/8개 완료</span>
          </div>
          <div className="text-[11px] text-slate-400">
            결산 배치 시뮬레이션, 계정조정 에이전트, 수선비 자본화 판정 & 투자 OS 아키텍처.
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-teal-400"
              style={{ width: `${Math.round((labsCompletedCount / 8) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Featured Hands-on Launch Labs Quick Access */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            주요 실전 실습 랩 (8개 전 과정 구축 완료)
          </h2>
          <button
            onClick={() => onNavigate('practice')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            전체 랩 보기 →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALL_LABS.slice(0, 4).map((lab) => (
            <div
              key={lab.id}
              onClick={() => onNavigate('practice', lab.id)}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {lab.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {lab.minutes}분 소요 · {lab.stage === 'TOOLS' ? '1단계 도구' : lab.stage === 'WORKFLOWS' ? '2단계 워크플로' : lab.stage === 'AUTOMATION' ? '3단계 자동화' : lab.stage === 'AGENTS' ? '4단계 에이전트' : '5단계 시스템'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {lab.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lab.scenario}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">분야: {lab.domain === 'ACCOUNTING' ? '회계/통제' : lab.domain === 'INVESTING' ? '투자분석' : '통합'}</span>
                <span className="text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  실습 시작하기 →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
