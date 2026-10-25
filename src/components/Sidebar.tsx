import React from 'react';
import { useLearningState } from '../hooks/useLearningState';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute, onNavigate }) => {
  const { studiedLessonsCount, workingEvidenceCount, verifiedEvidenceCount } = useLearningState();

  const NAV_ITEMS = [
    { id: 'home', label: '홈 대시보드', sub: '오늘의 학습 미션', icon: '🏠' },
    { id: 'roadmap', label: '5단계 로드맵', sub: '35개 커리큘럼 주제', icon: '🗺️' },
    { id: 'practice', label: '실습 랩 & 시뮬레이션', sub: '8대 실무 랩 샌드박스', icon: '⚡' },
    { id: 'coach', label: 'AI 구현 코치', sub: '맥락 기반 추론 코칭', icon: '💬' },
    { id: 'progress', label: '성취도 & 지식 그래프', sub: 'D3 의존성 & 증적 원장', icon: '📊' },
    { id: 'projects', label: '캡스톤 프로젝트', sub: '엔터프라이즈 운영체제', icon: '📁' },
    { id: 'settings', label: '설정 & 로컬 백업', sub: '환경설정 및 JSON 보관함', icon: '⚙' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-4 min-h-[calc(100vh-53px)] select-none">
      <div className="space-y-1.5 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          메뉴 탐색 (Navigation)
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/10'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <div>
                <div className="leading-snug">{item.label}</div>
                <div className="text-[10px] opacity-70 leading-tight">{item.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Aggregate Implementation Audit Card */}
      <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs mt-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
          실행 성숙도 원장 (Maturity Ledger)
        </div>
        <div className="space-y-1.5 text-slate-300 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">학습 레슨:</span>
            <span className="font-mono font-bold text-white">{studiedLessonsCount}개</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-400">작동 입증:</span>
            <span className="font-mono font-bold text-emerald-300">{workingEvidenceCount}건</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-violet-400">전방위 검증:</span>
            <span className="font-mono font-bold text-violet-300">{verifiedEvidenceCount}건</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
