import React, { useState } from 'react';
import { Maturity, EvidenceRecord, EvidenceProvenance } from '../domain/types';
import { canAssignMaturity } from '../domain/mastery';

interface MaturityModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: EvidenceRecord;
  onSave: (updated: EvidenceRecord) => void;
}

export const MaturityModal: React.FC<MaturityModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [targetMaturity, setTargetMaturity] = useState<Maturity>(record.maturity);
  const [artifactDescription, setArtifactDescription] = useState(record.artifactDescription || '');
  const [userDeclaredExists, setUserDeclaredExists] = useState(record.userDeclaredExists || false);
  const [executionRunRecorded, setExecutionRunRecorded] = useState(record.executionRunRecorded || false);
  const [normalTest, setNormalTest] = useState(record.normalTest || '');
  const [edgeTest, setEdgeTest] = useState(record.edgeTest || '');
  const [failureTest, setFailureTest] = useState(record.failureTest || '');
  const [rerunTest, setRerunTest] = useState(record.rerunTest || '');
  const [provenance, setProvenance] = useState<EvidenceProvenance>(record.provenance || 'USER_REPORTED');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentEvaluation = canAssignMaturity(
    {
      artifactDescription,
      userDeclaredExists,
      executionRunRecorded,
      normalTest,
      edgeTest,
      failureTest,
      rerunTest,
    },
    targetMaturity
  );

  const handleSave = () => {
    if (!currentEvaluation.allowed) {
      setErrorMsg(currentEvaluation.reason);
      return;
    }

    const updated: EvidenceRecord = {
      ...record,
      maturity: targetMaturity,
      artifactDescription,
      userDeclaredExists,
      executionRunRecorded,
      normalTest,
      edgeTest,
      failureTest,
      rerunTest,
      provenance,
      maturityReason: currentEvaluation.reason,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  const MATURITY_STEPS: Maturity[] = ['CONCEPT', 'PROPOSAL', 'PROTOTYPE', 'WORKING', 'VERIFIED'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              실행 성숙도 감사 심사 (Maturity Audit)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              엄격한 증적 사다리: 개념(CONCEPT) → 제안(PROPOSAL) → 시제품(PROTOTYPE) → 작동입증(WORKING) → 전방위검증(VERIFIED)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Maturity selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            목표 성숙도 등급 선택
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {MATURITY_STEPS.map((mat) => {
              const active = targetMaturity === mat;
              return (
                <button
                  key={mat}
                  type="button"
                  onClick={() => {
                    setTargetMaturity(mat);
                    setErrorMsg(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    active
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono font-bold text-xs">{mat}</span>
                  <span className="text-[10px] opacity-70 mt-1">
                    {mat === 'CONCEPT' && '개념 이해'}
                    {mat === 'PROPOSAL' && '설계 제안'}
                    {mat === 'PROTOTYPE' && '부분 구현'}
                    {mat === 'WORKING' && '1회 작동 입증'}
                    {mat === 'VERIFIED' && '4대 다각 검증'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time evaluation alert */}
        <div
          className={`p-3.5 rounded-xl border text-xs mb-5 flex items-start gap-2.5 ${
            currentEvaluation.allowed
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
          }`}
        >
          <span className="text-base">{currentEvaluation.allowed ? '✓' : '⚠'}</span>
          <div>
            <div className="font-semibold">
              {currentEvaluation.allowed ? '증적 필수 요건 충족 (승격 가능)' : '증적 선행 요건 미충족 (추가 작성 필요)'}
            </div>
            <div className="opacity-90 mt-0.5">{currentEvaluation.reason}</div>
          </div>
        </div>

        {/* Required Evidence Fields */}
        <div className="space-y-4 max-h-[46vh] overflow-y-auto pr-1">
          {/* Artifact Description (Required for PROPOSAL+) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              산출물 설계 명세 / 핵심 내용 서술{' '}
              <span className="text-amber-400 font-mono">(PROPOSAL 등급부터 필수)</span>
            </label>
            <textarea
              value={artifactDescription}
              onChange={(e) => setArtifactDescription(e.target.value)}
              placeholder="워크플로 아키텍처, 프롬프트 명세, 또는 코드 구성 내용을 기술하십시오..."
              rows={3}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Prototype Attestation */}
          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="userDeclaredExists"
              checked={userDeclaredExists}
              onChange={(e) => setUserDeclaredExists(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 cursor-pointer"
            />
            <label htmlFor="userDeclaredExists" className="text-xs text-slate-300 cursor-pointer">
              실행 가능한 설정 파일, 프로토타입 스크립트 또는 템플릿이 기기에 실재함을 확약합니다.{' '}
              <span className="text-cyan-400 font-mono">(PROTOTYPE 등급부터 필수)</span>
            </label>
          </div>

          {/* End-to-End Execution Run */}
          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="executionRunRecorded"
              checked={executionRunRecorded}
              onChange={(e) => setExecutionRunRecorded(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 cursor-pointer"
            />
            <label htmlFor="executionRunRecorded" className="text-xs text-slate-300 cursor-pointer">
              실제 입력값과 결과 출력이 수반된 최소 1회의 엔드투엔드 실행이 완료되었음을 확약합니다.{' '}
              <span className="text-emerald-400 font-mono">(WORKING 등급부터 필수)</span>
            </label>
          </div>

          {/* 4 Systematic Tests (Required for VERIFIED) */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-violet-400 font-mono">
              VERIFIED 등급을 위한 4대 필수 스트레스 테스트:
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">
                1. 정상 케이스 테스트 (표준 입력 및 정상 결과 도출 확인)
              </label>
              <input
                type="text"
                value={normalTest}
                onChange={(e) => setNormalTest(e.target.value)}
                placeholder="예: 이중 결재 요건을 갖춘 표준 인보이스 테스트 완료..."
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">
                2. 엣지 케이스 테스트 (필드 누락, 임계값 경계, 극단적 볼륨)
              </label>
              <input
                type="text"
                value={edgeTest}
                onChange={(e) => setEdgeTest(e.target.value)}
                placeholder="예: 담당자 누락 시 시스템 에러 없이 총괄팀장 결재로 우회됨을 확인..."
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">
                3. 실패 방지 테스트 (잘못된 스키마, 타임아웃, 이상 입력 차단)
              </label>
              <input
                type="text"
                value={failureTest}
                onChange={(e) => setFailureTest(e.target.value)}
                placeholder="예: 구 부품 제거 없는 부당 전액 자본화 시도를 차단하고 유보 결론 도출..."
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">
                4. 재실행 / 멱등성 테스트 (재현성 확인, 중복 부작용 억제)
              </label>
              <input
                type="text"
                value={rerunTest}
                onChange={(e) => setRerunTest(e.target.value)}
                placeholder="예: 즉시 2차 재실행 시 멱등성 키로 중복 알림 억제(0건 발송) 검증..."
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Provenance */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              증적 출처 유형 (Evidence Provenance)
            </label>
            <select
              value={provenance}
              onChange={(e) => setProvenance(e.target.value as EvidenceProvenance)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="USER_REPORTED">사용자 직접 진술 (User Attested)</option>
              <option value="APP_SIMULATION">앱 내장 시뮬레이터 실행 검증 (Simulated Engine)</option>
              <option value="EXTERNAL_UNVERIFIED">외부 미검증 데이터 (External Unverified)</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs font-medium">
            ⚠ {errorMsg}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs hover:bg-slate-800"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!currentEvaluation.allowed}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              currentEvaluation.allowed
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            성숙도 감사 승인 및 저장
          </button>
        </div>
      </div>
    </div>
  );
};
