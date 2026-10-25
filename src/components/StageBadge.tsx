import React from 'react';
import { Stage } from '../domain/types';

interface StageBadgeProps {
  stage: Stage;
  size?: 'sm' | 'md' | 'lg';
}

const STAGE_CONFIG: Record<
  Stage,
  { label: string; korean: string; color: string; border: string; bg: string }
> = {
  TOOLS: {
    label: 'Stage 1 · Tools',
    korean: '도구',
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
  },
  WORKFLOWS: {
    label: 'Stage 2 · Workflows',
    korean: '워크플로',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
  },
  AUTOMATION: {
    label: 'Stage 3 · Automation',
    korean: '자동화',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  AGENTS: {
    label: 'Stage 4 · Agents',
    korean: '에이전트',
    color: 'text-teal-400',
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/10',
  },
  SYSTEMS: {
    label: 'Stage 5 · Systems',
    korean: '시스템',
    color: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
  },
};

export const StageBadge: React.FC<StageBadgeProps> = ({ stage, size = 'md' }) => {
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.TOOLS;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.border} ${config.color} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{config.label}</span>
      <span className="opacity-60 text-[10px]">({config.korean})</span>
    </span>
  );
};
