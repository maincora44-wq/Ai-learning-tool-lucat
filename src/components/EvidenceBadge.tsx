import React from 'react';
import { Maturity, EvidenceProvenance } from '../domain/types';

interface EvidenceBadgeProps {
  maturity: Maturity;
  provenance?: EvidenceProvenance;
  size?: 'sm' | 'md' | 'lg';
}

const MATURITY_CONFIG: Record<
  Maturity,
  { label: string; korean: string; color: string; border: string; bg: string; icon: string }
> = {
  CONCEPT: {
    label: 'CONCEPT',
    korean: '개념 이해',
    color: 'text-slate-400',
    border: 'border-slate-700',
    bg: 'bg-slate-800/60',
    icon: '○',
  },
  PROPOSAL: {
    label: 'PROPOSAL',
    korean: '설계 제안',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    icon: '◐',
  },
  PROTOTYPE: {
    label: 'PROTOTYPE',
    korean: '부분 구현',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    icon: '◑',
  },
  WORKING: {
    label: 'WORKING',
    korean: '실행 검증 완료',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    icon: '●',
  },
  VERIFIED: {
    label: 'VERIFIED',
    korean: '체계적 전방위 검증',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    icon: '★',
  },
};

const PROVENANCE_LABELS: Record<EvidenceProvenance, string> = {
  USER_REPORTED: '사용자 직접 확약',
  APP_SIMULATION: '앱 시뮬레이션 검증',
  EXTERNAL_UNVERIFIED: '외부 미검증 데이터',
};

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  maturity,
  provenance,
  size = 'md',
}) => {
  const config = MATURITY_CONFIG[maturity] || MATURITY_CONFIG.CONCEPT;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center gap-1 font-mono font-semibold tracking-wider rounded border ${config.bg} ${config.border} ${config.color} ${sizeClasses}`}
      >
        <span className="text-xs">{config.icon}</span>
        <span>{config.label}</span>
        <span className="opacity-60 text-[10px] font-sans">({config.korean})</span>
      </span>

      {provenance && (
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
          {PROVENANCE_LABELS[provenance]}
        </span>
      )}
    </div>
  );
};
