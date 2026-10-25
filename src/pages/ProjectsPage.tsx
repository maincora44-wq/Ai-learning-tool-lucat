import React from 'react';
import { ProjectCard } from '../domain/types';
import { EvidenceBadge } from '../components/EvidenceBadge';

interface ProjectsPageProps {
  onNavigate: (route: string, id?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const PROJECTS: ProjectCard[] = [
    {
      id: 'PROJ-ICFR',
      title: '내부회계관리제도(ICFR) 통제 자동화 랩',
      subtitle: '재무보고 내부통제 및 월마감 결산 자동화 엔지니어링 엔진',
      domain: 'ACCOUNTING',
      goal: '반복적인 결산 기한 독촉을 자동화하고, 계정조정 차이 조사를 에이전트로 격리하며, 통제되지 않은 원장 직접 기표 없이 인간 승인(HITL) 체계를 확립합니다.',
      currentMaturity: 'WORKING',
      currentBlocker: '엔터프라이즈 Microsoft Graph 커넥터 권한에 대한 사내 IT 보안팀 정식 승인 대기 중.',
      nextAction: '월마감 피크 부하 상황에서의 예외 에스컬레이션 흐름 시뮬레이션 완결.',
      modules: [
        {
          id: 'MOD-CLOSE-REMIND',
          title: '일일 월마감 지연 알림 파이프라인',
          stage: 'AUTOMATION',
          maturity: 'VERIFIED',
          deterministicRule: '멱등성 키: MD5(RunDate + ControlID + DueDays)',
          aiRole: '없음 (100% 결정론적 Power Automate 클라우드 스케줄러)',
          humanApproval: '단순 알림은 불필요, 담당자 누락 건은 회계총괄팀장에게 에스컬레이션',
        },
        {
          id: 'MOD-RECON-AGENT',
          title: '은행 계정조정 차이 탐정 에이전트',
          stage: 'AGENTS',
          maturity: 'WORKING',
          deterministicRule: '원장 및 통장 내역 읽기 전용 도구만 허용, 최대 5회 반복 제한',
          aiRole: 'SWIFT 결제 지연 및 기말 미결제 타임랙 가설 추론',
          humanApproval: '원장 수정 분개 기표 전 회계총괄책임자 서명 필수',
        },
        {
          id: 'MOD-MEMO-DRAFT',
          title: '수선비 vs 자본적 지출 판정 회계 메모',
          stage: 'WORKFLOWS',
          maturity: 'PROPOSAL',
          deterministicRule: 'IAS 16 / ASC 360 대체 부품 장부가액 제거 비율 검증',
          aiRole: '공급업체 청구 세부 내역 기반 6단계 기술 메모 초안 작성',
          humanApproval: '선임 회계 디렉터 및 공인회계사(CPA) 정식 서명',
        },
      ],
      humanApprovalCheckpoints: [
        '직무분리(SoD) 원칙: 전표 작성자는 자신의 수정 분개를 스스로 승인할 수 없음.',
        '중요성(Materiality) 임계치: 미화 10,000달러를 초과하는 모든 차이는 2인 이상 결재 필수.',
        '어떠한 AI 에이전트에게도 총계정원장 직접 쓰기(기표) 권한을 일체 부여하지 않음.',
      ],
    },
    {
      id: 'PROJ-INVEST-OS',
      title: '투자 리서치 운영체제 (Investment Research OS)',
      subtitle: '규율 있는 다중 모듈 자본 배분 및 상장주식 에쿼티 리서치 시스템',
      domain: 'INVESTING',
      goal: '투자 기회 발굴, 5계층 리서치 메모, 현금흐름 전환율 스트레스 테스트, 무효화 기준을 체계화하되 자동 매매는 원천 차단합니다.',
      currentMaturity: 'PROPOSAL',
      currentBlocker: '검증된 SEC 10-K 데이터 계약을 갖춘 과거 재무제표 API 신뢰성 확립 단계.',
      nextAction: 'LAB-08 아키텍처 결정 기록(ADR) 문서 내보내기 완결.',
      modules: [
        {
          id: 'MOD-RADAR',
          title: '투자 기회 레이더 & 스크리닝',
          stage: 'AUTOMATION',
          maturity: 'PROPOSAL',
          deterministicRule: 'ROIC > 15%, 순차입금/EBITDA < 2.5배, FCF 수익률 > 5%',
          aiRole: '스크리닝 통과 기업의 경제적 해자 및 고객 리뷰 종합',
          humanApproval: '유니버스 편입 시 담당 섹터 애널리스트 승인',
        },
        {
          id: 'MOD-RESEARCH',
          title: '5계층 심층 리서치 메모',
          stage: 'WORKFLOWS',
          maturity: 'WORKING',
          deterministicRule: '현금 전환 다이버전스 산출 공식: 영업현금흐름 / 당기순이익',
          aiRole: '파괴적 약세 시나리오 및 수치적 가설 무효화 기준 도출',
          humanApproval: '리드 포트폴리오 매니저 정식 서명',
        },
        {
          id: 'MOD-CIO',
          title: 'CIO 자본 배분 & 의사결정 저널',
          stage: 'SYSTEMS',
          maturity: 'CONCEPT',
          deterministicRule: '현금 보유 하한선 10%, 단일 종목 최대 비중 10% 제한',
          aiRole: '포트폴리오 리밸런싱 최적화 대안 제안',
          humanApproval: '최고투자책임자(CIO) 단독 재량권 행사 (자동 매매 완전 금지)',
        },
      ],
      humanApprovalCheckpoints: [
        '증권사 브로커 매매 주문 집행은 100% 수작업이며 인간 트레이더가 감독함.',
        '신규 포지션 진입 전 사전에 서명된 수치적 무효화 기준(Invalidation Trigger) 확약 필수.',
        '분기별 투자 가설 왜곡(Thesis Drift) 및 하방 리스크 정기 재검토 의무화.',
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
          캡스톤 실전 시스템 프로젝트 (Capstone Projects)
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          워크플로, 자동화, 통제된 에이전트가 유기적으로 결합된 엔터프라이즈 운영체제 아키텍처입니다.
        </p>
      </div>

      {/* Project Cards */}
      <div className="space-y-8">
        {PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-200"
          >
            {/* Top banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-cyan-400 text-xs">{proj.id}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {proj.domain === 'ACCOUNTING' ? '회계 / 내부통제' : '투자 리서치'}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white">{proj.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{proj.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <EvidenceBadge maturity={proj.currentMaturity} size="md" />
              </div>
            </div>

            {/* Goal & Blockers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 md:col-span-2 space-y-1">
                <span className="font-mono text-slate-400 uppercase tracking-wider block text-[10px]">
                  전략적 핵심 목표 (Strategic Goal)
                </span>
                <p className="text-slate-300 leading-relaxed">{proj.goal}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-1">
                <span className="font-mono text-amber-400 uppercase tracking-wider block text-[10px]">
                  현재 해결 과제 (Current Blocker)
                </span>
                <p className="text-amber-300 leading-relaxed">{proj.currentBlocker}</p>
              </div>
            </div>

            {/* Sub-modules matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                시스템 하위 모듈 토폴로지 (Module Topology):
              </h3>
              <div className="space-y-2">
                {proj.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-white text-sm">{mod.title}</strong>
                        <span className="text-[10px] font-mono text-cyan-400">[{mod.stage}]</span>
                      </div>
                      <div className="space-y-0.5 text-slate-400 text-[11px]">
                        <div>
                          <strong className="text-slate-300">결정론적 규칙:</strong> {mod.deterministicRule}
                        </div>
                        <div>
                          <strong className="text-slate-300">AI 역할:</strong> {mod.aiRole}
                        </div>
                        <div>
                          <strong className="text-slate-300">인간 승인 요건:</strong> {mod.humanApproval}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <EvidenceBadge maturity={mod.maturity} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fiduciary Human Approval Gates */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2 text-xs">
              <h4 className="font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🛡</span>
                <span>필수 인간 참여(Human-in-the-Loop) 승인 체크포인트:</span>
              </h4>
              <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                {proj.humanApprovalCheckpoints.map((chk, i) => (
                  <li key={i}>{chk}</li>
                ))}
              </ul>
            </div>

            {/* Quick jump to linked lab */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() =>
                  onNavigate('practice', proj.id === 'PROJ-ICFR' ? 'LAB-05' : 'LAB-08')
                }
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition"
              >
                연계 캡스톤 실습 랩 시작하기 →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
