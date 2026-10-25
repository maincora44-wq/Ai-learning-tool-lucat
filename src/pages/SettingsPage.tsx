import React, { useState } from 'react';
import { useLearningState } from '../hooks/useLearningState';
import { ExportDataPayload } from '../domain/types';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, exportData, importData, resetData } = useLearningState();

  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [parsedPayload, setParsedPayload] = useState<ExportDataPayload | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  // Reset confirmation
  const [resetConfirm, setResetConfirm] = useState(false);

  // Export JSON
  const handleExportJson = async () => {
    try {
      const payload = await exportData();
      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_learning_os_백업_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`내보내기 오류: ${e.message}`);
    }
  };

  // Preview import
  const handleValidateImport = () => {
    setImportError(null);
    try {
      if (!importJsonText.trim()) {
        throw new Error('유효한 JSON 백업 파일 내용을 붙여넣어 주십시오.');
      }
      const parsed = JSON.parse(importJsonText);
      if (!parsed.schemaVersion || parsed.schemaVersion !== '1.0') {
        throw new Error('지원되지 않는 스키마 버전입니다. (버전 1.0만 가능)');
      }
      setParsedPayload(parsed);
      setShowImportPreview(true);
    } catch (e: any) {
      setImportError(e.message || '잘못된 형식의 JSON 데이터입니다.');
    }
  };

  // Execute import
  const handleExecuteImport = async () => {
    if (!parsedPayload) return;
    try {
      const res = await importData(parsedPayload, importMode);
      setImportStatus(`성공적으로 ${res.count}개의 학습 기록을 복원하였습니다. (${importMode === 'merge' ? '기존 데이터에 병합' : '전체 대체'} 모드)`);
      setShowImportPreview(false);
      setImportJsonText('');
      setParsedPayload(null);
      setTimeout(() => setImportStatus(null), 4000);
    } catch (e: any) {
      setImportError(e.message || '데이터 복원 실행에 실패하였습니다.');
    }
  };

  const handleReset = async () => {
    await resetData();
    setResetConfirm(false);
    alert('기기에 저장된 모든 로컬 학습 기록, 노트, 퀴즈 시도 내역이 초기화되었습니다.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
          설정 및 로컬 데이터 저장소 (Data Vault)
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          학습 트랙 환경설정, 언어 모드, 기업 보안 서약, 안전한 영구 JSON 백업 및 복원을 관리합니다.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-200 text-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
          학습 환경설정 (Preferences)
        </h2>

        {/* Focus Track */}
        <div className="space-y-2">
          <label className="font-semibold text-white block">주요 학습 트랙 선택:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { id: 'ALL', label: '올라운드 종합 AI 마스터 (권장) 🚀', sub: '투자, 거시경제, 비즈니스 영어, 회계를 단계별 완전 통합' },
              { id: 'INVESTING', label: '투자 & 에쿼티 리서치 📈', sub: '재무제표, 10-K 공시, DCF 밸류에이션, 어닝스 콜 감성 분석' },
              { id: 'ECONOMY', label: '거시 경제 & 글로벌 마켓 🌐', sub: 'FOMC 금리 사이클, 인플레이션(CPI), 환율 동향, 거시 시나리오' },
              { id: 'ENGLISH', label: '실전 비즈니스 영어 & 협상 💬', sub: 'C레벨 보고서 영작, 글로벌 바이어 협상, 원어민 뉘앙스 교정' },
              { id: 'ACCOUNTING', label: '회계 & 내부통제(ICFR) ⚖️', sub: '감사 증적 무결성, 계정조정 자동화, 내부통제 분리' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => updatePreferences({ focus: f.id as any })}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  preferences.focus === f.id
                    ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold">{f.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">{f.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language Mode */}
        <div className="space-y-2 pt-2">
          <label className="font-semibold text-white block">학습 안내 언어 모드:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'EN_KO', label: '영문 + 한국어 해설 (기본값)', sub: '글로벌 실무 영어와 상세 한국어 해설 병기' },
              { id: 'KO', label: '한국어 중심 모드', sub: '전체 화면 한국어 직관적 학습' },
              { id: 'EN', label: '글로벌 영문 전용 모드', sub: '글로벌 감사/투자 환경 몰입' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => updatePreferences({ language: l.id as any })}
                className={`p-3 rounded-2xl border text-left transition ${
                  preferences.language === l.id
                    ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div>{l.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{l.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Study Goal */}
        <div className="space-y-2 pt-2">
          <label className="font-semibold text-white block">일일 목표 학습 시간:</label>
          <div className="flex gap-2">
            {[15, 20, 30].map((m) => (
              <button
                key={m}
                onClick={() => updatePreferences({ dailyGoalMin: m as any })}
                className={`px-4 py-2 rounded-xl border text-xs font-mono transition ${
                  preferences.dailyGoalMin === m
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                매일 {m}분 집중
              </button>
            ))}
          </div>
        </div>

        {/* Corporate Data Safety Pledge */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 mt-4">
          <input
            type="checkbox"
            id="safetyPledged"
            checked={preferences.safetyPledged}
            onChange={(e) => updatePreferences({ safetyPledged: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="safetyPledged" className="text-slate-300 leading-relaxed cursor-pointer">
            <strong className="text-white block mb-0.5">기업 데이터 보안 및 기밀 보호 준수 서약:</strong>
            본 학습 앱은 오직 엄격히 합성된 가상 데이터만을 사용함을 확인합니다. 개인 AI 도구에 회사의 실제 미공개 계약서, 고객 개인정보, 시스템 비밀번호, 테넌트 시크릿을 절대 입력하지 않겠습니다.
          </label>
        </div>
      </div>

      {/* Backup, Export & Import Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-slate-200 text-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono">
          데이터 영구 보관, 내보내기 & 복원 (JSON Backup)
        </h2>
        <p className="text-slate-400 leading-relaxed">
          퀴즈 점수, 랩 실습 결과물, 나만의 학습 메모, 감사 증적 원장은 모두 사용자의 브라우저 로컬 저장소(IndexedDB)에 영구 보관됩니다. 외부 서버 유출 없이 언제든 완전한 JSON 백업을 다운로드할 수 있습니다.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleExportJson}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
          >
            <span>📥</span>
            <span>로컬 학습 데이터 백업 다운로드 (JSON)</span>
          </button>
        </div>

        {importStatus && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-xl text-emerald-300 font-medium">
            ✓ {importStatus}
          </div>
        )}

        {/* Import JSON Area */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <label className="font-semibold text-white block">백업 파일에서 데이터 복원 (JSON 붙여넣기):</label>
          <textarea
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="이전에 내보낸 ai_learning_os_백업.json 파일의 내용을 여기에 붙여넣으십시오..."
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />

          {importError && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 font-medium">
              ⚠ {importError}
            </div>
          )}

          {!showImportPreview ? (
            <button
              onClick={handleValidateImport}
              disabled={!importJsonText.trim()}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                importJsonText.trim()
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              백업 파일 검증 및 미리보기
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="font-bold text-white text-xs">
                백업 파일 검증 완료 · 스키마 버전 v{parsedPayload?.schemaVersion}
              </div>
              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div>내보낸 시점: {parsedPayload?.exportedAt}</div>
                <div>학습 레슨 시도: {Object.keys(parsedPayload?.attempts || {}).length}개</div>
                <div>증적 감사 기록: {parsedPayload?.evidenceRecords?.length || 0}건</div>
                <div>세션 학습 로그: {parsedPayload?.sessionLogs?.length || 0}건</div>
              </div>

              <div className="flex items-center gap-4 pt-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="text-cyan-500"
                  />
                  <span>기존 데이터와 병합 (권장)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-cyan-500"
                  />
                  <span className="text-rose-400 font-bold">기존 데이터 전체 덮어쓰기</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleExecuteImport}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                >
                  확인 및 데이터 복원 실행
                </button>
                <button
                  onClick={() => setShowImportPreview(false)}
                  className="px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs transition"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dangerous Zone / Reset Data */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-rose-950/60 space-y-3 text-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
          위험 구역: 기기 내 애플리케이션 데이터 초기화
        </h2>
        <p className="text-slate-400">
          이 기기의 IndexedDB에 저장된 모든 학습 레코드, 퀴즈 시도 내역, 맞춤 메모를 완전히 삭제합니다.
        </p>

        {!resetConfirm ? (
          <button
            onClick={() => setResetConfirm(true)}
            className="px-4 py-2 rounded-xl border border-rose-800 text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition"
          >
            기기 내 전체 데이터 초기화...
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-3">
            <span className="text-rose-300 font-bold block">
              정말로 초기화하시겠습니까? 사전에 JSON 백업을 내보내지 않은 경우 복구할 수 없습니다.
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                예, 모든 데이터를 영구 삭제합니다
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs transition"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
