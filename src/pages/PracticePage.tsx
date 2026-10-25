import React, { useState, useEffect } from 'react';
import { ALL_LABS } from '../data/labs';
import { useLearningState } from '../hooks/useLearningState';
import { runMonthEndAutomationSimulation, INITIAL_SYNTHETIC_CONTROLS, SimulationResult } from '../domain/flowSimulator';
import { StageBadge } from '../components/StageBadge';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { MaturityModal } from '../components/MaturityModal';

interface PracticePageProps {
  initialLabId?: string;
  onNavigate: (route: string, id?: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ initialLabId }) => {
  const { labSubmissions, saveLabSubmission, evidenceRecords, addOrUpdateEvidence } = useLearningState();

  const [activeLabId, setActiveLabId] = useState<string>(initialLabId || ALL_LABS[0].id);
  const activeLab = ALL_LABS.find((l) => l.id === activeLabId) || ALL_LABS[0];

  const submission = labSubmissions[activeLab.id] || {
    id: `sub-${activeLab.id}`,
    labId: activeLab.id,
    updatedAt: new Date().toISOString(),
    workingNotes: '',
    artifactPayload: {},
    selfRubricScores: {},
    testCaseResults: {},
  };

  const [workingNotes, setWorkingNotes] = useState(submission.workingNotes || '');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(submission.selfRubricScores || {});
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'untested'>>(
    submission.testCaseResults || {}
  );
  const [saveStatus, setSaveStatus] = useState(false);

  // LAB-05 simulation state
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [existingRunKeys, setExistingRunKeys] = useState<Set<string>>(new Set());

  // LAB-07 agent tools state
  const [selectedAgentTools, setSelectedAgentTools] = useState<string[]>([
    'query_gl_transactions',
    'query_bank_clearing_feed',
  ]);
  const [agentLoopRun, setAgentLoopRun] = useState(false);

  // LAB-06 power automate builder state
  const [flowSteps] = useState<string[]>([
    'SharePoint: 항목이 생성되거나 수정될 때 (트리거)',
    '조건문: 순장부가액 >= 10,000달러 여부 판정',
    '승인 요청: Teams로 회계총괄팀장에게 대화형 승인 카드 발송',
    'SharePoint: 항목 상태를 "승인 완료"로 업데이트',
  ]);
  const [flowSimResult, setFlowSimResult] = useState<string | null>(null);

  // Maturity Audit Modal state
  const [isMaturityModalOpen, setIsMaturityModalOpen] = useState(false);

  useEffect(() => {
    if (initialLabId && ALL_LABS.some((l) => l.id === initialLabId)) {
      setActiveLabId(initialLabId);
    }
  }, [initialLabId]);

  useEffect(() => {
    const curSub = labSubmissions[activeLab.id];
    setWorkingNotes(curSub?.workingNotes || '');
    setRubricScores(curSub?.selfRubricScores || {});
    setTestResults(curSub?.testCaseResults || {});
  }, [activeLab.id, labSubmissions]);

  // Download sample CSV fixture
  const handleDownloadCsv = () => {
    if (!activeLab.syntheticDataCsv) return;
    const blob = new Blob([activeLab.syntheticDataCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeLab.code}_합성_데이터셋.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveWorkspace = () => {
    saveLabSubmission(activeLab.id, {
      workingNotes,
      selfRubricScores: rubricScores,
      testCaseResults: testResults,
      completedAt: new Date().toISOString(),
    });
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  // Run LAB-05 simulation
  const handleRunMonthEndSim = (rerunDuplicate: boolean = false) => {
    const { result, updatedRunKeys } = runMonthEndAutomationSimulation(
      INITIAL_SYNTHETIC_CONTROLS,
      rerunDuplicate ? existingRunKeys : new Set(),
      '2026-10-09'
    );
    setSimResult(result);
    setExistingRunKeys(updatedRunKeys);
  };

  // Run LAB-06 flow simulation
  const handleRunFlowSim = () => {
    setFlowSimResult(`[시뮬레이션 실행 기록: 2026-10-09 08:30:12 KST]
1단계: SharePoint 처분 요청 'FA-SRV-99' 수신 (장부가액: $14,500)
2단계: 조건 평가: $14,500 >= $10,000 -> 참(TRUE)
3단계: Teams 승인 카드 디스패치 -> controller@synthetic-corp.com
4단계: 회계총괄팀장 대화형 카드 서명 승인: '노후 전산장비 폐기 적격 승인'
5단계: SharePoint 원장 상태 '승인 완료(Approved)'로 자동 갱신
실행 결과: 성공 (예외 없이 결정론적 결재 흐름 완결됨)`);
  };

  // Find linked evidence record
  const currentEvidence =
    evidenceRecords.find((e) => e.labId === activeLab.id) || {
      id: `ev-${activeLab.id}`,
      labId: activeLab.id,
      title: activeLab.title,
      maturity: 'PROPOSAL',
      artifactDescription: workingNotes || activeLab.scenario,
      userDeclaredExists: true,
      executionRunRecorded: false,
      provenance: 'APP_SIMULATION',
      maturityReason: 'AI Learning OS에서 실습 랩 초안 작업이 작성됨.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
          실전 실습 랩 & 시뮬레이션 (총 8개 랩)
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          실제 비즈니스 합성 데이터셋을 활용해 연습하고 증적 기반 성숙도(Working/Verified)를 감사하십시오.
        </p>
      </div>

      {/* Lab Tabs selector */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div className="flex gap-2 min-w-max">
          {ALL_LABS.map((lab) => {
            const isActive = activeLabId === lab.id;
            const isCompleted = Boolean(labSubmissions[lab.id]?.completedAt);
            return (
              <button
                key={lab.id}
                onClick={() => setActiveLabId(lab.id)}
                className={`px-3 py-2 rounded-2xl text-left border transition ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span>{lab.code}</span>
                  {isCompleted && <span>✓</span>}
                </div>
                <div className="text-[10px] truncate max-w-[150px] opacity-80 mt-0.5">
                  {lab.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lab Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-200">
        {/* Lab Title Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-emerald-400 text-sm">{activeLab.code}</span>
              <StageBadge stage={activeLab.stage} size="sm" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                {activeLab.domain === 'ACCOUNTING' ? '회계/통제' : activeLab.domain === 'INVESTING' ? '투자분석' : '통합'} · {activeLab.minutes}분 실습
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">{activeLab.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaturityModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-cyan-300 transition flex items-center gap-1.5"
            >
              <span>현재 성숙도:</span>
              <EvidenceBadge maturity={currentEvidence.maturity} size="sm" />
            </button>
          </div>
        </div>

        {/* Scenario & Synthetic Data Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            비즈니스 시나리오 및 합성 데이터 픽스처:
          </h3>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-300">
            {activeLab.scenario}
          </div>

          {activeLab.syntheticDataCsv && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] truncate mr-2">
                데이터셋: {activeLab.syntheticFixtureDescription}
              </span>
              <button
                onClick={handleDownloadCsv}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs flex-shrink-0 transition flex items-center gap-1"
              >
                <span>📥</span>
                <span>합성 샘플 CSV 다운로드</span>
              </button>
            </div>
          )}
        </div>

        {/* INTERACTIVE LAB WORKSPACES BASED ON LAB TYPE */}

        {/* LAB-05: Month-End Automation Simulator */}
        {activeLab.code === 'LAB-05' && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono">
                대화형 자동화 & 멱등성(Idempotency) 시뮬레이터
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRunMonthEndSim(false)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                >
                  ▶ 일일 정기 배치 실행
                </button>
                <button
                  onClick={() => handleRunMonthEndSim(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                  title="중복 실행 시 멱등성 키가 중복 알림을 차단하는지 테스트"
                >
                  ⚡ 즉시 중복 재실행 (멱등성 테스트)
                </button>
              </div>
            </div>

            {simResult && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">검토 통제 건수</span>
                    <span className="text-white font-bold">{simResult.totalControlsEvaluated} 개</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 block">발송된 알림</span>
                    <span className="text-emerald-300 font-bold">{simResult.notificationsSent} 통</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 block">중복 차단 건수</span>
                    <span className="text-amber-300 font-bold">{simResult.duplicateRunsSuppressed} 건 억제됨</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-cyan-400 block">관리자 에스컬레이션</span>
                    <span className="text-cyan-300 font-bold">{simResult.escalationsTriggered} 건 이관</span>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {simResult.logs.map((log, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg border text-[11px] font-mono flex items-start justify-between gap-2 ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                          : log.status === 'SKIPPED'
                          ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                          : log.status === 'WARNING'
                          ? 'bg-cyan-950/30 border-cyan-800/40 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold mr-2">[{log.step}]</span>
                        <span>{log.message}</span>
                      </div>
                      <span className="text-[10px] opacity-60 flex-shrink-0">{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LAB-06: Power Automate Visual Sequencer */}
        {activeLab.code === 'LAB-06' && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Power Automate 클라우드 결재 흐름 시뮬레이션
              </h3>
              <button
                onClick={handleRunFlowSim}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                ▶ 플로우 실행 트레이스 테스트
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400">구성된 액션 블록 순서:</span>
              <div className="space-y-1.5 font-mono text-xs">
                {flowSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">검증된 블록</span>
                  </div>
                ))}
              </div>
            </div>

            {flowSimResult && (
              <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 whitespace-pre-wrap">
                {flowSimResult}
              </pre>
            )}
          </div>
        )}

        {/* LAB-07: Reconciliation Agent Tool Config */}
        {activeLab.code === 'LAB-07' && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider font-mono">
                ICFR 차이 조사 에이전트 샌드박스 (차이 금액: $18,450)
              </h3>
              <button
                onClick={() => setAgentLoopRun(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
              >
                ▶ 5단계 에이전트 루프 실행
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-mono">
                허용 도구 선택 (주의: 장부 쓰기 권한은 직무분리 원칙상 엄격히 차단됨!):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAgentTools.includes('query_gl_transactions')}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedAgentTools([...selectedAgentTools, 'query_gl_transactions']);
                      else setSelectedAgentTools(selectedAgentTools.filter((t) => t !== 'query_gl_transactions'));
                    }}
                    className="w-4 h-4 text-teal-500 rounded bg-slate-950 border-slate-700"
                  />
                  <div>
                    <span className="font-mono font-bold text-white block">query_gl_transactions</span>
                    <span className="text-[10px] text-slate-400">읽기 전용: 총계정원장 전표 내역 조회</span>
                  </div>
                </label>

                <label className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAgentTools.includes('query_bank_clearing_feed')}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedAgentTools([...selectedAgentTools, 'query_bank_clearing_feed']);
                      else setSelectedAgentTools(selectedAgentTools.filter((t) => t !== 'query_bank_clearing_feed'));
                    }}
                    className="w-4 h-4 text-teal-500 rounded bg-slate-950 border-slate-700"
                  />
                  <div>
                    <span className="font-mono font-bold text-white block">query_bank_clearing_feed</span>
                    <span className="text-[10px] text-slate-400">읽기 전용: 전자 은행 결제 배치 및 통장 내역 조회</span>
                  </div>
                </label>

                <label className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-800/40 flex items-center gap-2 opacity-70">
                  <input
                    type="checkbox"
                    disabled
                    checked={false}
                    className="w-4 h-4 text-rose-500 rounded bg-slate-950 border-slate-700"
                  />
                  <div>
                    <span className="font-mono font-bold text-rose-400 line-through block">
                      post_adjusting_journal_entry
                    </span>
                    <span className="text-[10px] text-rose-300">원천 차단: 원장 직접 기표는 인간 승인(HITL) 필수</span>
                  </div>
                </label>

                <label className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAgentTools.includes('lookup_vendor_terms')}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedAgentTools([...selectedAgentTools, 'lookup_vendor_terms']);
                      else setSelectedAgentTools(selectedAgentTools.filter((t) => t !== 'lookup_vendor_terms'));
                    }}
                    className="w-4 h-4 text-teal-500 rounded bg-slate-950 border-slate-700"
                  />
                  <div>
                    <span className="font-mono font-bold text-white block">lookup_vendor_terms</span>
                    <span className="text-[10px] text-slate-400">읽기 전용: 거래처 계약 조건 및 지급 기한 조회</span>
                  </div>
                </label>
              </div>
            </div>

            {agentLoopRun && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-teal-400 font-bold">[에이전트 추론 루프 트레이스 - 최대 5회 반복 한도]</div>
                <div className="text-slate-300">반복 1: query_gl_transactions(계정: 10100, 9월 29일) 호출 → 해외 송금 WT-9022 ($18,450) 식별</div>
                <div className="text-slate-300">반복 2: query_bank_clearing_feed(9월 30일) 호출 → 9월 30일 통장에는 해당 출금 내역 없음</div>
                <div className="text-slate-300">반복 3: query_bank_clearing_feed(10월 02일) 호출 → 일치 항목 발견! 월마감 후 10월 2일 정상 출금 확인</div>
                <div className="text-emerald-300 font-bold">반복 4 (종료 조건 충족): 원인은 정상적인 국제 송금 결제 시차(타임랙). 가설 신뢰도: 98%</div>
                <div className="p-2.5 rounded bg-slate-950 border border-teal-500/40 text-teal-200 mt-2">
                  <strong>감사 증적 보고서 작성 완료:</strong> 송금 건 WT-9022는 기말 미결제 타임랙 항목임. 회계총괄책임자 서명 결재로 이관함 (에이전트 단독 기표 차단).
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Interactive Working Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              나의 실습 산출물 및 작업 분석 (Deliverable Analysis):
            </h3>
            <span className="text-[11px] text-slate-400">기기에 자동 보관됨</span>
          </div>

          <textarea
            value={workingNotes}
            onChange={(e) => setWorkingNotes(e.target.value)}
            placeholder={`[${activeLab.title}]에 대한 실습 분석 내용을 기록하십시오...\n- 문제 정의 및 해결 목표\n- 공시 사실 vs 자의적 가정 분리\n- 제안 워크플로 및 의사결정 규칙\n- 엣지 케이스 및 예외 처리 방안`}
            rows={8}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>

        {/* 10-Point Evaluation Rubric */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              10점 만점 전문 평가 루브릭 (합격 기준: 8점 이상)
            </h3>
            <span className="text-xs font-bold text-cyan-400 font-mono">
              총점:{' '}
              {Object.values(rubricScores).reduce((a, b) => a + b, 0)} / 10점
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeLab.rubric.map((item, idx) => {
              const currentScore = rubricScores[item.dimension] ?? item.max;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{item.dimension}</span>
                    <select
                      value={currentScore}
                      onChange={(e) =>
                        setRubricScores({
                          ...rubricScores,
                          [item.dimension]: parseInt(e.target.value, 10),
                        })
                      }
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-xs focus:outline-none"
                    >
                      {Array.from({ length: item.max + 1 }, (_, i) => (
                        <option key={i} value={i}>
                          {i} / {item.max} 점
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.rubricText}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-Way Systematic Test Cases Runner */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            4대 체계적 검증 테스트 케이스 (정상 · 엣지 · 실패방지 · 재실행):
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeLab.testCases.map((tc) => {
              const status = testResults[tc.id] || 'pass';
              return (
                <div
                  key={tc.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-cyan-400 text-[11px]">
                        [{tc.kind === 'normal' ? '정상' : tc.kind === 'edge' ? '엣지' : tc.kind === 'failure' ? '실패방지' : '재실행'}] {tc.title}
                      </span>
                      <select
                        value={status}
                        onChange={(e) =>
                          setTestResults({
                            ...testResults,
                            [tc.id]: e.target.value as 'pass' | 'fail' | 'untested',
                          })
                        }
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          status === 'pass'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                            : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                        }`}
                      >
                        <option value="pass">✓ 통과 (PASS)</option>
                        <option value="fail">✕ 실패 (FAIL)</option>
                        <option value="untested">? 미검증 (UNTESTED)</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{tc.description}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-900">
                    예상 동작: {tc.expectedBehavior}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveWorkspace}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
            >
              {saveStatus ? '✓ 산출물 저장 완료' : '실습 산출물 저장하기'}
            </button>
            <button
              onClick={() => setIsMaturityModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-semibold transition"
            >
              성숙도 감사 평가 →
            </button>
          </div>

          <div className="text-xs text-slate-400">
            현재 산출물 성숙도: <EvidenceBadge maturity={currentEvidence.maturity} size="sm" />
          </div>
        </div>
      </div>

      {/* Maturity Modal */}
      {isMaturityModalOpen && (
        <MaturityModal
          isOpen={isMaturityModalOpen}
          onClose={() => setIsMaturityModalOpen(false)}
          record={currentEvidence}
          onSave={(updated) => {
            addOrUpdateEvidence(updated);
          }}
        />
      )}
    </div>
  );
};
