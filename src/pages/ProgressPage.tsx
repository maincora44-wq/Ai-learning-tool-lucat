import React, { useState, useMemo } from 'react';
import { useLearningState } from '../hooks/useLearningState';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { KnowledgeGraph } from '../components/KnowledgeGraph';
import { exportSessionToMarkdown } from '../storage/db';
import { SessionLog, Stage, Maturity } from '../domain/types';

interface ProgressPageProps {
  onNavigate?: (route: string, id?: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const {
    sessionLogs,
    saveSessionLog,
    evidenceRecords,
    studiedLessonsCount,
    workingEvidenceCount,
    verifiedEvidenceCount,
    streak,
  } = useLearningState();

  // Active Progress Sub-View Tab
  const [activeTab, setActiveTab] = useState<'graph' | 'overview' | 'sessions'>('graph');

  // New session modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState<Partial<SessionLog>>({
    date: new Date().toISOString().split('T')[0],
    topic: '월마감 통제 자동화 아키텍처 실무',
    stage: 'AUTOMATION',
    goal: '중복 실행 방지 멱등성 키 기반 결산 파이프라인 설계',
    learned: '멱등성 키(Idempotency Key)를 통해 재시도나 중복 트리거 시에도 중복 이메일 발송이 억제됨을 검증함.',
    mentalModel: '트리거 → 필터 → 멱등성 게이트(캐시 대조) → 디스패치 → 불변 감사 로그 기록.',
    practiced: 'LAB-05 시뮬레이터에서 5개 합성 통제 항목으로 배치 실행 및 즉시 재실행 테스트 수행.',
    implemented: 'MD5 기반 {RunDate}_{ControlId}_{DueDays} 멱등성 키 계산 및 필터 로직.',
    verified: '즉시 2차 재실행 시 3건의 중복 알림이 SKIPPED로 억제되어 0건 발송됨을 확인.',
    stillUnclear: '다일간 지속되는 월마감 주기에 대한 캐시 만료 정책.',
    nextBestStep: 'Power Automate 시각적 흐름 설계 랩(LAB-06)으로 진행.',
    artifactCreated: 'CloseNotificationFlow_v1.json',
    actuallyExecuted: '5개 합성 통제 대상 스케줄링 시뮬레이션 및 관리자 에스컬레이션 분기 실행.',
    testsPerformed: '정상 케이스, 담당자 누락 엣지 케이스, 네트워크 타임아웃, 중복 재실행 테스트 완료.',
    maturity: 'WORKING',
    maturityReason: '실제 입출력이 포함된 엔드투엔드 시뮬레이션 실행이 기록되었으며 부작용이 없음을 검증함.',
  });

  const handleSaveNewLog = () => {
    const newLog: SessionLog = {
      id: `ses-${Date.now().toString(36)}`,
      date: logForm.date || new Date().toISOString().split('T')[0],
      topic: logForm.topic || 'AI 구현 일반 학습',
      stage: (logForm.stage as Stage) || 'TOOLS',
      goal: logForm.goal || '',
      learned: logForm.learned || '',
      mentalModel: logForm.mentalModel || '',
      practiced: logForm.practiced || '',
      implemented: logForm.implemented || '',
      verified: logForm.verified || '',
      stillUnclear: logForm.stillUnclear || '',
      nextBestStep: logForm.nextBestStep || '',
      artifactCreated: logForm.artifactCreated || '',
      actuallyExecuted: logForm.actuallyExecuted || '',
      testsPerformed: logForm.testsPerformed || '',
      maturity: (logForm.maturity as Maturity) || 'CONCEPT',
      maturityReason: logForm.maturityReason || '학습자가 세션 완료 기록을 작성함.',
      updatedAt: new Date().toISOString(),
    };

    saveSessionLog(newLog);
    setShowLogModal(false);
  };

  const handleExportSessionMd = (session: SessionLog) => {
    const md = exportSessionToMarkdown(session);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `학습세션기록_${session.date}_${session.stage}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calendar Heatmap Calculation (Last 28 Days)
  const heatmapDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; count: number }[] = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = sessionLogs.filter((s) => s.date === dateStr).length;
      days.push({ dateStr, dayNum: d.getDate(), count });
    }
    return days;
  }, [sessionLogs]);

  // Skill matrix competencies (8 Core Dimensions localized in Korean)
  const SKILL_MATRIX = [
    { title: '1. 도구 선택 역량 (Tool Selection)', level: studiedLessonsCount >= 3 ? '숙련 (Proficient)' : '성장 중 (Developing)', score: Math.min(100, studiedLessonsCount * 25) },
    { title: '2. 프롬프트 및 워크플로 설계', level: studiedLessonsCount >= 6 ? '숙련 (Proficient)' : '성장 중 (Developing)', score: Math.min(100, studiedLessonsCount * 18) },
    { title: '3. 자동화 신뢰성 & 멱등성 설계', level: workingEvidenceCount >= 1 ? '작동 입증 (Working)' : '기초 단계 (Foundational)', score: Math.min(100, workingEvidenceCount * 35 + 20) },
    { title: '4. 에이전트 루프 및 거버넌스', level: verifiedEvidenceCount >= 1 ? '체계적 검증 (Verified)' : '기초 학습 (Emerging)', score: Math.min(100, verifiedEvidenceCount * 50 + 20) },
    { title: '5. 다각적 검증 및 스트레스 테스트', level: verifiedEvidenceCount >= 1 ? '체계적 검증 (Verified)' : '성장 중 (Developing)', score: Math.min(100, verifiedEvidenceCount * 45 + 15) },
    { title: '6. 감사 모니터링 & 로깅 아키텍처', level: workingEvidenceCount >= 1 ? '작동 입증 (Working)' : '기초 단계 (Foundational)', score: Math.min(100, workingEvidenceCount * 30 + 20) },
    { title: '7. 회계/내부통제 AI 워크플로', level: studiedLessonsCount >= 4 ? '숙련 (Proficient)' : '성장 중 (Developing)', score: Math.min(100, studiedLessonsCount * 22) },
    { title: '8. 투자 리서치 & 무효화 워크플로', level: studiedLessonsCount >= 4 ? '숙련 (Proficient)' : '성장 중 (Developing)', score: Math.min(100, studiedLessonsCount * 22) },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            학습 성취도 & 커리큘럼 지식 그래프
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            도구(Tools)부터 시스템(Systems)까지의 단계별 학습 의존성과 증적 감사 추적표입니다.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5"
        >
          <span>+ 학습 세션 기록하기</span>
        </button>
      </div>

      {/* Aggregate Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">학습한 레슨 수</span>
          <span className="text-xl font-bold text-white mt-1 block">{studiedLessonsCount} 개</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-emerald-400 block text-[11px]">작동 입증 산출물 (Working)</span>
          <span className="text-xl font-bold text-emerald-300 mt-1 block">{workingEvidenceCount} 건</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-violet-400 block text-[11px]">전방위 검증 시스템 (Verified)</span>
          <span className="text-xl font-bold text-violet-300 mt-1 block">{verifiedEvidenceCount} 건</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-amber-400 block text-[11px]">연속 학습일 (Streak)</span>
          <span className="text-xl font-bold text-amber-300 mt-1 block">{streak} 일 연속</span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('graph')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'graph'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🕸</span>
          <span>D3 커리큘럼 지식 그래프 (의존성 흐름)</span>
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>📊</span>
          <span>역량 매트릭스 & 28일 활동 히트맵</span>
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'sessions'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>📋</span>
          <span>증적 감사 및 세션 기록 ({sessionLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: D3 KNOWLEDGE GRAPH */}
      {activeTab === 'graph' && (
        <div className="space-y-4">
          <KnowledgeGraph
            onNavigateLesson={(id) => onNavigate?.('lesson', id)}
            onNavigateLab={(id) => onNavigate?.('practice', id)}
          />

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
              <span>💡</span>
              <span>지식 그래프 활용 가이드:</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              각 노드는 커리큘럼의 핵심 단원이며, 화살표는 <strong>선수 학습(Prerequisite)과 후속 연계 관계</strong>를 나타냅니다.
              마우스로 노드를 드래그하거나 휠로 확대/축소할 수 있으며, 노드를 클릭하면 해당 레슨의 선수 과목, 후속 연계 및 실무 핵심 산출물을 즉시 확인하고 바로 학습으로 이동할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & HEATMAP */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 28-Day Real Study Heatmap */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-slate-300 tracking-wider">
                28일간의 실제 학습 활동 잔디 (Asia/Seoul 기준)
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">
                총 {sessionLogs.length} 개의 실제 저장된 세션 로그
              </span>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1 pt-1">
              {heatmapDays.map((d, i) => (
                <div
                  key={i}
                  title={`${d.dateStr}: ${d.count} 건의 학습`}
                  className={`h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-mono transition-all ${
                    d.count >= 2
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : d.count === 1
                      ? 'bg-emerald-500/50 text-white'
                      : 'bg-slate-950 text-slate-600 border border-slate-800/80'
                  }`}
                >
                  <span>{d.dayNum}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-mono pt-1">
              <span>활동 없음</span>
              <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
              <span className="w-3 h-3 rounded bg-emerald-500/50" />
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>활동 많음</span>
            </div>
          </div>

          {/* 8-Dimension Competency Matrix */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-slate-300 tracking-wider">
                8대 핵심 역량 성취도 매트릭스 (AI 프레임워크 기준)
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">실무 중심 평가</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {SKILL_MATRIX.map((skill, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{skill.title}</span>
                    <span className="font-mono text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {skill.level}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${skill.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE & SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Evidence Audit Trail Table */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-slate-300 tracking-wider">
                실행 산출물 증적 감사 기록표 ({evidenceRecords.length})
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">위변조 불가 감사 증적</span>
            </div>

            {evidenceRecords.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-950 text-slate-500 text-xs">
                저장된 증적 기록이 없습니다. 실습(Practice) 탭에서 랩을 수행하고 "성숙도 감사(Maturity Audit)"를 실행하세요.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">산출물 명칭 / 실습 랩</th>
                      <th className="p-3">성숙도 레벨</th>
                      <th className="p-3">증적 출처 (Provenance)</th>
                      <th className="p-3">테스트 완료 현황</th>
                      <th className="p-3">기록 일자</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-sans">
                    {evidenceRecords.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-950/50">
                        <td className="p-3 font-semibold text-white">
                          <div>{ev.title}</div>
                          <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                            {ev.artifactDescription}
                          </div>
                        </td>
                        <td className="p-3">
                          <EvidenceBadge maturity={ev.maturity} size="sm" />
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">
                          {ev.provenance}
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          {ev.normalTest && ev.edgeTest ? (
                            <span className="text-emerald-400 font-bold">4종 테스트 완료 (전방위)</span>
                          ) : (
                            <span className="text-amber-400">설계 제안 / 단일 테스트</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-500">
                          {ev.updatedAt.split('T')[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Saved Session Logs List */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xs font-mono uppercase text-slate-300 tracking-wider">
              종료 세션 학습 회고 로그 ({sessionLogs.length})
            </h2>

            {sessionLogs.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-950 text-slate-500 text-xs">
                저장된 세션 로그가 없습니다. 우측 상단의 "+ 학습 세션 기록하기" 버튼을 눌러 첫 회고를 작성하세요.
              </div>
            ) : (
              <div className="space-y-3">
                {sessionLogs.map((ses) => (
                  <div
                    key={ses.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <span className="font-mono text-cyan-400 font-bold mr-2">[{ses.date}]</span>
                        <strong className="text-white text-sm">{ses.topic}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <EvidenceBadge maturity={ses.maturity} size="sm" />
                        <button
                          onClick={() => handleExportSessionMd(ses)}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:text-white text-slate-400 font-mono text-[10px] transition"
                        >
                          마크다운 내보내기 (.MD)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-mono block">배운 점 (Learned):</span>
                        {ses.learned}
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono block">실습한 내용 (Practiced):</span>
                        {ses.practiced}
                      </div>
                      <div>
                        <span className="text-emerald-400 font-mono block">실제 구현물 (Implemented):</span>
                        {ses.implemented || '없음 (개념/설계 단계)'}
                      </div>
                      <div>
                        <span className="text-cyan-400 font-mono block">다음 최선의 단계 (Next Step):</span>
                        {ses.nextBestStep}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal to Log New Session (Full Korean Form) */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200 my-8 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">표준 학습 세션 및 실무 산출물 회고 기록</h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">학습 일자</label>
                <input
                  type="date"
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">학습 주제 (Topic)</label>
                <input
                  type="text"
                  value={logForm.topic}
                  onChange={(e) => setLogForm({ ...logForm, topic: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-400 mb-1">1. 무엇을 배웠습니까? (Learned)</label>
                <textarea
                  value={logForm.learned}
                  onChange={(e) => setLogForm({ ...logForm, learned: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                  placeholder="예: 대규모 원장 분석 시 프롬프트 텍스트 연산 대신 파이썬 판다스 연산 분리가 필수적임을 배움..."
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">2. 무엇을 실습했습니까? (Practiced)</label>
                <textarea
                  value={logForm.practiced}
                  onChange={(e) => setLogForm({ ...logForm, practiced: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                  placeholder="예: LAB-05 결산 통제 배치 시뮬레이션을 실행하고 멱등성 키로 중복 알림 억제 검증..."
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">3. 실제로 실행해 본 것은 무엇입니까? (Actually Executed)</label>
                <input
                  type="text"
                  value={logForm.actuallyExecuted}
                  onChange={(e) => setLogForm({ ...logForm, actuallyExecuted: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                  placeholder="예: 5개 합성 통제 항목 배치 실행 및 즉시 2차 재실행 테스트..."
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">4. 아직 불분명하거나 애매한 점은 무엇입니까? (Still Unclear)</label>
                <input
                  type="text"
                  value={logForm.stillUnclear}
                  onChange={(e) => setLogForm({ ...logForm, stillUnclear: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                  placeholder="예: 테넌트 간 권한 정책 변경 시의 자동화 영향도..."
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">5. 다음 최선의 조치는 무엇입니까? (Next Best Step)</label>
                <input
                  type="text"
                  value={logForm.nextBestStep}
                  onChange={(e) => setLogForm({ ...logForm, nextBestStep: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                  placeholder="예: 4단계 에이전트 루프 설계(G01) 레슨 착수..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                취소
              </button>
              <button
                onClick={handleSaveNewLog}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                세션 로그 저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
