import React, { useState, useRef, useEffect } from 'react';
import { useLearningState } from '../hooks/useLearningState';

interface HeaderProps {
  onOpenSearch: () => void;
  onNavigate: (route: string, id?: string) => void;
  activeRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onNavigate, activeRoute }) => {
  const {
    preferences,
    updatePreferences,
    currentDailyStreak,
    completedToday,
    streakInfo,
    recentDaysStreak,
    recommendedLesson,
    completedLessonsCount,
  } = useLearningState();

  const [showStreakModal, setShowStreakModal] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const streakButtonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        streakButtonRef.current &&
        !streakButtonRef.current.contains(event.target as Node)
      ) {
        setShowStreakModal(false);
      }
    }
    if (showStreakModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStreakModal]);

  const TRACK_CYCLE: ('ALL' | 'INVESTING' | 'ECONOMY' | 'ENGLISH' | 'ACCOUNTING')[] = [
    'ALL',
    'INVESTING',
    'ECONOMY',
    'ENGLISH',
    'ACCOUNTING',
  ];

  const handleToggleFocus = () => {
    const currentIndex = TRACK_CYCLE.indexOf(preferences.focus as any);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % TRACK_CYCLE.length;
    updatePreferences({ focus: TRACK_CYCLE[nextIndex] });
  };

  // Next Milestone calculation
  const MILESTONES = [3, 7, 14, 30, 50, 100];
  const nextMilestone = MILESTONES.find((m) => m > currentDailyStreak) || 100;
  const milestoneProgress = Math.min(100, Math.round((currentDailyStreak / nextMilestone) * 100));

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-3">
      {/* Brand logo & title */}
      <div
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2.5 cursor-pointer select-none group"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-300 font-black text-xs">
            OS
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
            <span>AI Learning OS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              v1.0 정식버전
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium tracking-wide leading-none mt-1 hidden sm:block">
            1.도구 → 2.워크플로 → 3.자동화 → 4.에이전트 → 5.시스템
          </div>
        </div>
      </div>

      {/* Quick controls */}
      <div className="flex items-center gap-2 relative">
        {/* Domain focus pill toggle */}
        <button
          onClick={handleToggleFocus}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-500/40 text-[11px] font-medium text-slate-300 transition flex items-center gap-1 cursor-pointer"
          title="클릭하여 학습 트랙 변경: 종합과정 / 투자분석 / 거시경제 / 비즈니스영어 / 회계통제"
        >
          <span className="text-[10px] text-slate-500">트랙:</span>
          <span className="text-cyan-400 font-semibold">
            {preferences.focus === 'INVESTING' && '투자분석 📈'}
            {preferences.focus === 'ECONOMY' && '거시경제 🌐'}
            {preferences.focus === 'ENGLISH' && '비즈니스영어 💬'}
            {preferences.focus === 'ACCOUNTING' && '회계/통제 ⚖️'}
            {(preferences.focus === 'BOTH' || preferences.focus === 'ALL' || !preferences.focus) && '종합과정 🚀'}
          </span>
        </button>

        {/* Interactive Current Daily Streak Badge */}
        <button
          ref={streakButtonRef}
          onClick={() => setShowStreakModal((prev) => !prev)}
          className={`px-2.5 py-1 rounded-full border text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
            currentDailyStreak > 0
              ? completedToday
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:border-amber-400 shadow-amber-500/10'
                : 'bg-slate-900 border-amber-500/40 text-amber-400 hover:border-amber-400 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="현재 일일 연속 학습 스트릭 (클릭하여 세부 정보 및 7일 기록 확인)"
        >
          <span className={`text-xs ${currentDailyStreak > 0 ? 'animate-bounce' : ''}`}>🔥</span>
          <span className="font-bold">
            {currentDailyStreak > 0 ? `${currentDailyStreak}일 연속` : '0일 (시작하기)'}
          </span>
          {currentDailyStreak > 0 && (
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                completedToday ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
              }`}
              title={completedToday ? '오늘 학습 완료' : '오늘 레슨 완료 필요'}
            />
          )}
        </button>

        {/* Motivational Streak Popover Modal */}
        {showStreakModal && (
          <div
            ref={popoverRef}
            className="absolute right-0 top-11 w-80 sm:w-96 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-slate-200 text-xs z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <h4 className="font-bold text-white text-sm">일일 연속 학습 스트릭</h4>
                  <p className="text-[10px] text-slate-400">완료된 레슨 기준으로 자동 집계됩니다</p>
                </div>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Current Streak Hero */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border border-slate-800 text-center space-y-1 mb-3">
              <div className="text-3xl font-black text-amber-400 font-mono tracking-tight flex items-center justify-center gap-1.5">
                <span>🔥</span>
                <span>{currentDailyStreak}</span>
                <span className="text-base font-normal text-slate-300">일 연속</span>
              </div>
              <div className="text-[11px] text-slate-300">
                {currentDailyStreak === 0
                  ? '오늘 첫 레슨을 완료하여 연속 학습을 시작하세요!'
                  : completedToday
                  ? '🎉 오늘 레슨을 완료하여 스트릭을 성공적으로 지켰습니다!'
                  : '⏳ 오늘 아직 레슨을 완료하지 않았습니다! 스트릭을 이어가세요.'}
              </div>
            </div>

            {/* 7-Day Mini Calendar Activity Strip */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                <span>최근 7일 학습 현황</span>
                <span>총 {streakInfo.totalActiveDays}일 활동</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {recentDaysStreak.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-center text-center transition-all ${
                      day.completed
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                        : day.isToday
                        ? 'bg-slate-950 border border-cyan-500/40 text-cyan-400'
                        : 'bg-slate-950 border border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <span className="text-[9px] opacity-75">{day.dayLabel}</span>
                    <span className="text-xs my-0.5">
                      {day.completed ? '🔥' : day.isToday ? '○' : '·'}
                    </span>
                    <span className="text-[9px] font-mono">
                      {day.isToday ? '오늘' : day.dateStr.split('-')[2]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Milestone Progress Bar */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 mb-3">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">다음 마일스톤: {nextMilestone}일 연속 달성</span>
                <span className="text-amber-400 font-bold">{currentDailyStreak} / {nextMilestone}일 ({milestoneProgress}%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
            </div>

            {/* Action / Recommendation Button */}
            {!completedToday && recommendedLesson && (
              <button
                onClick={() => {
                  setShowStreakModal(false);
                  onNavigate('lesson', recommendedLesson.id);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>오늘의 레슨으로 스트릭 이어가기 ({recommendedLesson.code})</span>
                <span>→</span>
              </button>
            )}

            {completedToday && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                <span>누적 완료 레슨: {completedLessonsCount}개</span>
                <span className="text-emerald-400">내일도 연속 학습을 이어가세요!</span>
              </div>
            )}
          </div>
        )}

        {/* Search button */}
        <button
          onClick={onOpenSearch}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          title="커리큘럼 및 전문 용어 검색"
        >
          <span className="text-xs px-1">🔍</span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => onNavigate('settings')}
          className={`p-1.5 rounded-xl border transition cursor-pointer ${
            activeRoute === 'settings'
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="설정 및 데이터 백업/복원"
        >
          <span className="text-xs px-1">⚙</span>
        </button>
      </div>
    </header>
  );
};
