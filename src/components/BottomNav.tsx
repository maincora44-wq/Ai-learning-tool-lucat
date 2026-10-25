import React from 'react';

interface BottomNavProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeRoute, onNavigate }) => {
  const NAV_ITEMS = [
    { id: 'home', label: '홈', sub: '대시보드', icon: '🏠' },
    { id: 'roadmap', label: '로드맵', sub: '5단계', icon: '🗺️' },
    { id: 'practice', label: '실습 랩', sub: '8대 랩', icon: '⚡' },
    { id: 'coach', label: 'AI 코치', sub: '구현 코치', icon: '💬' },
    { id: 'progress', label: '성취도', sub: '지식그래프', icon: '📊' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 py-1.5 px-2 md:hidden">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base mb-0.5">{item.icon}</span>
              <span className="text-[10px] leading-tight font-medium">{item.label}</span>
              <span className="text-[8px] opacity-70 leading-none">{item.sub}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
