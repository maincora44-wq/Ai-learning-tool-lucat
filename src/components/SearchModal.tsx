import React, { useState, useMemo } from 'react';
import { LESSON_CATALOG } from '../data/lessonCatalog';
import { ALL_LABS } from '../data/labs';
import { StageBadge } from './StageBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (id: string) => void;
  onSelectLab: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectLab,
}) => {
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        lessons: LESSON_CATALOG.filter((l) => l.contentStatus === 'READY').slice(0, 6),
        labs: ALL_LABS.slice(0, 4),
      };
    }
    const q = query.toLowerCase();

    const lessons = LESSON_CATALOG.filter((l) => {
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchCode = l.code.toLowerCase().includes(q);
      const matchProblem = l.problem.toLowerCase().includes(q);
      const matchGlossary = l.glossary.some(
        (g) => g.term.toLowerCase().includes(q) || g.koreanMeaning.toLowerCase().includes(q)
      );
      const matchDomain = l.domain.toLowerCase().includes(q);
      const matchPlatform = l.platform.toLowerCase().includes(q);
      return matchTitle || matchCode || matchProblem || matchGlossary || matchDomain || matchPlatform;
    });

    const labs = ALL_LABS.filter((lab) => {
      const matchTitle = lab.title.toLowerCase().includes(q);
      const matchCode = lab.code.toLowerCase().includes(q);
      const matchScenario = lab.scenario.toLowerCase().includes(q);
      return matchTitle || matchCode || matchScenario;
    });

    return { lessons, labs };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <span className="text-slate-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="레슨 제목, 영문 용어, 한국어 해설, 실습 랩, 회계/투자 기준 검색..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              지우기
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Lessons */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>커리큘럼 레슨 ({filteredResults.lessons.length}건)</span>
              <span className="text-slate-400">오프라인 실시간 검색</span>
            </div>
            {filteredResults.lessons.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-slate-400">
                일치하는 레슨이 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredResults.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition text-left flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-cyan-400">{lesson.code}</span>
                        <span className="text-white font-medium group-hover:text-cyan-300">
                          {lesson.title}
                        </span>
                        {lesson.contentStatus === 'PLANNED' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            개설 예정
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{lesson.problem}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <StageBadge stage={lesson.stage} size="sm" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Labs */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              실전 실습 랩 ({filteredResults.labs.length}건)
            </div>
            {filteredResults.labs.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-slate-400">
                일치하는 실습 랩이 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredResults.labs.map((lab) => (
                  <button
                    key={lab.id}
                    onClick={() => {
                      onSelectLab(lab.id);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition text-left flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-emerald-400">{lab.code}</span>
                        <span className="text-white font-medium group-hover:text-emerald-300">
                          {lab.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{lab.scenario}</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400/80 flex-shrink-0">
                      {lab.minutes}분 소요
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
