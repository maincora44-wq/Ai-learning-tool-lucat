import React, { useState, useEffect } from 'react';
import { LearningProvider, useLearningState } from './hooks/useLearningState';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LessonPage } from './pages/LessonPage';
import { PracticePage } from './pages/PracticePage';
import { CoachPage } from './pages/CoachPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { preferences, updatePreferences, loading } = useLearningState();

  const [activeRoute, setActiveRoute] = useState<string>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('T01');
  const [selectedLabId, setSelectedLabId] = useState<string>('LAB-01');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (route: string, id?: string) => {
    if (route === 'lesson' && id) {
      setSelectedLessonId(id);
    }
    if (route === 'practice' && id) {
      setSelectedLabId(id);
    }
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono animate-pulse">
          OS
        </div>
        <div className="text-xs font-mono">Initializing AI Learning OS local vault...</div>
      </div>
    );
  }

  // Quick 90-sec Onboarding Modal (PRD Section 6.1)
  const showOnboarding = !preferences.onboardingCompleted;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* PWA Install and Connectivity Banner */}
      <PWAInstallBanner />

      {/* Top Application Header */}
      <Header
        activeRoute={activeRoute}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Body with Responsive Desktop/Folded-Unfolded Layout */}
      <div className="flex-1 flex w-full">
        {/* Desktop / Unfolded Fold7 Sidebar */}
        <Sidebar activeRoute={activeRoute} onNavigate={handleNavigate} />

        {/* Primary Page Canvas */}
        <main className="flex-1 p-4 md:p-8 min-w-0 max-w-5xl mx-auto w-full">
          {activeRoute === 'home' && <HomePage onNavigate={handleNavigate} />}
          {activeRoute === 'roadmap' && <RoadmapPage onNavigate={handleNavigate} />}
          {activeRoute === 'lesson' && (
            <LessonPage lessonId={selectedLessonId} onNavigate={handleNavigate} />
          )}
          {activeRoute === 'practice' && (
            <PracticePage initialLabId={selectedLabId} onNavigate={handleNavigate} />
          )}
          {activeRoute === 'coach' && <CoachPage />}
          {activeRoute === 'progress' && <ProgressPage onNavigate={handleNavigate} />}
          {activeRoute === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
          {activeRoute === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Mobile / Folded Screen Bottom Navigation */}
      <BottomNav activeRoute={activeRoute} onNavigate={handleNavigate} />

      {/* Quick Search & Filter Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={(id) => handleNavigate('lesson', id)}
        onSelectLab={(id) => handleNavigate('practice', id)}
      />

      {/* Onboarding Dialog (First run only) */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-200 space-y-5">
            <div>
              <div className="inline-block font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full mb-2">
                Quick Setup · Under 90s
              </div>
              <h2 className="text-xl font-black text-white">Welcome to AI Learning OS</h2>
              <p className="text-xs text-slate-400 mt-1">
                Progressive capability framework: Tools → Workflows → Automation → Agents → Systems.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-white block mb-1">Primary Focus Track:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['ALL', 'INVESTING', 'ECONOMY', 'ENGLISH', 'ACCOUNTING'] as const).map((track) => (
                    <button
                      key={track}
                      onClick={() => updatePreferences({ focus: track })}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        preferences.focus === track
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {track === 'ALL'
                        ? '종합 마스터 🚀'
                        : track === 'INVESTING'
                        ? '투자분석 📈'
                        : track === 'ECONOMY'
                        ? '거시경제 🌐'
                        : track === 'ENGLISH'
                        ? '비즈니스영어 💬'
                        : '회계/통제 ⚖️'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-white block mb-1">Daily Study Target:</label>
                <div className="flex gap-2">
                  {[15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => updatePreferences({ dailyGoalMin: mins as any })}
                      className={`flex-1 p-2 rounded-xl border text-center font-mono ${
                        preferences.dailyGoalMin === mins
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                🛡 <strong>Synthetic Data Only:</strong> This learning environment uses realistic synthetic business data. No company tenant permissions, cloud database, or logins required.
              </div>
            </div>

            <button
              onClick={() => updatePreferences({ onboardingCompleted: true, safetyPledged: true })}
              className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider transition shadow-lg shadow-cyan-500/20"
            >
              Start Learning OS →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
}
