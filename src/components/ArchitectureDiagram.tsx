import React from 'react';

interface ArchitectureDiagramProps {
  type: 'model_context' | 'workflow_loop' | 'automation_pipeline' | 'agent_cycle' | 'system_architecture';
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ type }) => {
  if (type === 'model_context') {
    return (
      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3">
        <div className="font-semibold text-cyan-400 flex items-center justify-between">
          <span>아키텍처 물리적 연산 경계: 모델 vs 컨텍스트 vs 도구 vs 메모리</span>
          <span className="text-[10px] text-slate-400 font-mono">무상태성 명세</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-sky-400 font-bold mb-1">1. 모델 가중치 (Weights)</div>
            <div className="text-slate-400">동결된 신경망 파라미터. 다음 토큰 확률 추론. 사내 테넌트 데이터 인식 불가.</div>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50">
            <div className="text-cyan-300 font-bold mb-1">2. 컨텍스트 윈도우 (Context)</div>
            <div className="text-slate-400">활성 작업 메모리. 무상태(Stateless) 버퍼. 추론을 위해 데이터가 반드시 명시 주입되어야 함.</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
            <div className="text-emerald-300 font-bold mb-1">3. 외부 도구 (Tools / APIs)</div>
            <div className="text-slate-400">외부 실행 팔: Graph 커넥터, Python 샌드박스, 웹 검색, SQL 데이터베이스 쿼리.</div>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/50">
            <div className="text-purple-300 font-bold mb-1">4. 영구 메모리 (Store)</div>
            <div className="text-slate-400">지속 상태 저장소 (IndexedDB / SQL DB). 무상태 API 호출 사이의 세션 데이터를 영구 보존.</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'workflow_loop') {
    return (
      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3">
        <div className="font-semibold text-cyan-400 flex items-center justify-between">
          <span>통제된 5단계 구조화 워크플로 파이프라인</span>
          <span className="text-[10px] text-emerald-400 font-mono">결정론적 경로</span>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 text-center font-mono text-[11px]">
          <div className="p-2 rounded bg-slate-950 border border-slate-800 flex-1">
            <div className="text-sky-400 font-semibold">1. 입력 계약</div>
            <div className="text-[10px] text-slate-400">정형 입력 데이터</div>
          </div>
          <div className="text-slate-600 hidden md:block">→</div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 flex-1">
            <div className="text-cyan-400 font-semibold">2. 실행 단계</div>
            <div className="text-[10px] text-slate-400">작업 변환 절차</div>
          </div>
          <div className="text-slate-600 hidden md:block">→</div>
          <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 flex-1">
            <div className="text-amber-400 font-semibold">3. 의사결정 게이트</div>
            <div className="text-[10px] text-slate-400">임계값 및 기준 대조</div>
          </div>
          <div className="text-slate-600 hidden md:block">→</div>
          <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 flex-1">
            <div className="text-emerald-400 font-semibold">4. 유효성 검증</div>
            <div className="text-[10px] text-slate-400">품질 및 준수 검증</div>
          </div>
          <div className="text-slate-600 hidden md:block">→</div>
          <div className="p-2 rounded bg-purple-950/40 border border-purple-800/60 flex-1">
            <div className="text-purple-400 font-semibold">5. 산출물 / 예외</div>
            <div className="text-[10px] text-slate-400">최종 조서 / 에스컬레이션</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'automation_pipeline') {
    return (
      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3">
        <div className="font-semibold text-emerald-400 flex items-center justify-between">
          <span>자동화 신뢰성 & 멱등성(Idempotency) 아키텍처 패턴</span>
          <span className="text-[10px] text-cyan-400 font-mono">중복 실행 0건 보장</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">트리거</span>
            <span>정기 스케줄(Cron) 또는 이벤트 웹훅 수신</span>
          </div>
          <div className="text-slate-600 pl-4">↓</div>
          <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold">멱등성 게이트</span>
            <span>결정론적 키 계산: MD5(일자 + 통제ID + 경과일) → 이미 처리된 키면 즉시 안전 종료 (스킵)</span>
          </div>
          <div className="text-slate-600 pl-4">↓ (신규 키 확인)</div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">디스패치</span>
            <span>지수 백오프 재시도와 함께 알림 발송 + 불변 실행 감사 로그 기록</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'agent_cycle') {
    return (
      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3">
        <div className="font-semibold text-teal-400 flex items-center justify-between">
          <span>통제된 자율 에이전트 루프 (Governed Agentic Loop)</span>
          <span className="text-[10px] text-rose-400 font-mono">인간 서명(HITL) 게이트 강제</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
          <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
            <span className="text-teal-400 font-bold block">1. 목표 (Goal)</span>
            범위 한정된 비즈니스 목적
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
            <span className="text-cyan-400 font-bold block">2. 계획 (Plan)</span>
            동적 하위 작업 분해
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
            <span className="text-sky-400 font-bold block">3. 도구 호출 (Tool)</span>
            읽기 전용 샌드박스 실행
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
            <span className="text-emerald-400 font-bold block">4. 관찰 (Observe)</span>
            도구 반환 결과 수집 및 검토
          </div>
          <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
            <span className="text-purple-400 font-bold block">5. 상태 (State)</span>
            에이전트 메모리 버퍼 갱신
          </div>
          <div className="p-2 bg-rose-950/40 rounded border border-rose-800/60 text-rose-300 font-bold">
            <span className="block text-rose-400">6. 정지 / HITL 게이트</span>
            최대 반복 제한 & 인간 서명 필수
          </div>
        </div>
      </div>
    );
  }

  // System Architecture
  return (
    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3 font-mono">
      <div className="font-semibold text-green-400 flex items-center justify-between">
        <span>7대 모듈 엔터프라이즈 AI 참조 아키텍처</span>
        <span className="text-[10px] text-slate-400">ADR 거버넌스</span>
      </div>
      <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-center text-slate-300 font-semibold text-[11px]">
        통합 거버넌스 & 권한 매트릭스 (Entra ID RBAC · DLP · 감사 로그 · 신인의무 HITL)
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
        <div className="p-2 rounded bg-slate-900 border border-slate-800">
          <div className="text-sky-400 font-bold">모듈 1: 시장 정보</div>
          <div className="text-slate-400">정기 수집 파이프라인</div>
        </div>
        <div className="p-2 rounded bg-slate-900 border border-slate-800">
          <div className="text-cyan-400 font-bold">모듈 2: 기회 레이더</div>
          <div className="text-slate-400">결정론적 스크리닝</div>
        </div>
        <div className="p-2 rounded bg-slate-900 border border-slate-800">
          <div className="text-teal-400 font-bold">모듈 3: 심층 리서치</div>
          <div className="text-slate-400">5계층 리서치 메모</div>
        </div>
        <div className="p-2 rounded bg-slate-900 border border-slate-800">
          <div className="text-emerald-400 font-bold">모듈 4: 리스크 매트릭스</div>
          <div className="text-slate-400">스트레스 테스트 에이전트</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
        <div className="p-2 rounded bg-slate-900 border border-slate-800">
          <div className="text-amber-400 font-bold">모듈 5: 전략 랩</div>
          <div className="text-slate-400">워크포워드 백테스트</div>
        </div>
        <div className="p-2 rounded bg-slate-900 border border-slate-800">
          <div className="text-purple-400 font-bold">모듈 6: 의사결정 저널</div>
          <div className="text-slate-400">불변 가설 타임스탬프 해시</div>
        </div>
        <div className="p-2 rounded bg-rose-950/40 border border-rose-800/60">
          <div className="text-rose-400 font-bold">모듈 7: CIO 자본 배분</div>
          <div className="text-rose-300 font-bold">인간 단독 집행 (자동 매매 금지)</div>
        </div>
      </div>
    </div>
  );
};
