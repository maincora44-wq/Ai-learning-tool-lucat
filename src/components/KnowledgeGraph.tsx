import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Stage, Platform, Domain } from '../domain/types';
import { useLearningState } from '../hooks/useLearningState';
import { StageBadge } from './StageBadge';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  code: string;
  title: string;
  titleKo: string;
  stage: Stage;
  stageIndex: number; // 1 to 5
  platform: Platform;
  domain: Domain;
  descriptionKo: string;
  prerequisitesKo: string[];
  outputKo: string;
  labId?: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  relationshipKo: string;
}

// Curriculum nodes and dependencies from Tools to Systems
export const CURRICULUM_NODES: GraphNode[] = [
  // Stage 1: Tools
  {
    id: 'T01',
    code: 'T01',
    title: 'Models vs Context vs Tools vs Memory',
    titleKo: '모델 vs 컨텍스트 vs 도구 vs 메모리',
    stage: 'TOOLS',
    stageIndex: 1,
    platform: 'CROSS',
    domain: 'BOTH',
    descriptionKo: '기초 모델의 연산 경계와 무상태성(Stateless)을 이해하고, 왜 프라이빗 재무 파일에 외부 커넥터가 필요한지 파악합니다.',
    prerequisitesKo: ['웹 기본 개념', '스프레드시트 구조 이해'],
    outputKo: 'AI 시스템 4대 구성요소 분류 다이어그램',
    labId: 'LAB-01',
  },
  {
    id: 'T02',
    code: 'T02',
    title: 'Prompt Structure, Constraints & Verification',
    titleKo: '프롬프트 구조, 부정 제약 및 검증 규칙',
    stage: 'TOOLS',
    stageIndex: 1,
    platform: 'CHATGPT',
    domain: 'ACCOUNTING',
    descriptionKo: '역할, 목표, 부정 제약, 출력 스키마를 결합하여 환각 없는 내부회계관리제도(ICFR) 감사 증적 요청서를 작성합니다.',
    prerequisitesKo: ['T01 (모델 vs 컨텍스트 경계)'],
    outputKo: '결함 없는 감사 증적 요청(PBC) 양식',
    labId: 'LAB-02',
  },
  {
    id: 'T03',
    code: 'T03',
    title: 'Files, Search, Analysis & Tool Choice',
    titleKo: '파일 분석, 파이썬 샌드박스 및 도구 선택',
    stage: 'TOOLS',
    stageIndex: 1,
    platform: 'CHATGPT',
    domain: 'BOTH',
    descriptionKo: '대용량 분개장 검증 시 토큰 연산 오차를 방지하고 파이썬 판다스(Code Interpreter)로 벤포드 법칙 및 주말 거래를 정밀 필터링합니다.',
    prerequisitesKo: ['T01', 'T02'],
    outputKo: '결정론적 원장 예외 필터링 스크립트',
    labId: 'LAB-01',
  },
  {
    id: 'T05',
    code: 'T05',
    title: 'Microsoft 365 Copilot Chat, Scope & Access',
    titleKo: 'M365 Copilot Chat, 권한 범위 및 데이터 접근',
    stage: 'TOOLS',
    stageIndex: 1,
    platform: 'M365',
    domain: 'ACCOUNTING',
    descriptionKo: 'Microsoft Graph 시맨틱 인덱스 및 Entra ID 권한 경계를 학습하고 SharePoint 과도한 공유(Oversharing) 위험을 방지합니다.',
    prerequisitesKo: ['T01'],
    outputKo: '테넌트 권한 분리 및 시맨틱 검색 거버넌스 맵',
    labId: 'LAB-01',
  },
  {
    id: 'T06',
    code: 'T06',
    title: 'Excel/Word/PowerPoint Copilot Patterns',
    titleKo: '오피스 앱 코파일럿 실무 패턴 (표 계약)',
    stage: 'TOOLS',
    stageIndex: 1,
    platform: 'M365',
    domain: 'BOTH',
    descriptionKo: '엑셀 공식 표(Table) 계약을 통해 차이 분석 수식을 생성하고, 워드/PPT로 경영진 보고서를 구조화합니다.',
    prerequisitesKo: ['T05'],
    outputKo: '예실대비 자동 수식 표 & 경영진 브리핑 초안',
    labId: 'LAB-02',
  },
  {
    id: 'T07',
    code: 'T07',
    title: 'Outlook/Teams/SharePoint & Audit Permissions',
    titleKo: '아웃룩/팀즈 타임라인 추출 및 증적 추적',
    stage: 'TOOLS',
    stageIndex: 1,
    platform: 'M365',
    domain: 'ACCOUNTING',
    descriptionKo: '감사 분쟁 및 결산 지연 스레드에서 주관적 감정을 배제하고 객관적 타임라인과 합의 기한을 타임스탬프와 함께 추출합니다.',
    prerequisitesKo: ['T05', 'T06'],
    outputKo: '객관적 사건 타임라인 및 미결 조치 표',
    labId: 'LAB-02',
  },

  // Stage 2: Workflows
  {
    id: 'W01',
    code: 'W01',
    title: '6-Stage Governed Workflow Architecture',
    titleKo: '6단계 통제형 워크플로 아키텍처',
    stage: 'WORKFLOWS',
    stageIndex: 2,
    platform: 'CROSS',
    domain: 'BOTH',
    descriptionKo: '입력 계약 → 순차 단계 → 결정 게이트(중요성 기준) → 검증 → 최종 산출물 → 예외 에스컬레이션 경로를 설계합니다.',
    prerequisitesKo: ['T01-T07 (도구 역량)'],
    outputKo: '재현 가능한 내부통제 승인 파이프라인 명세서',
    labId: 'LAB-03',
  },
  {
    id: 'W02',
    code: 'W02',
    title: 'Reproducible Investment Research',
    titleKo: '재현 가능한 5단계 투자 리서치 워크플로',
    stage: 'WORKFLOWS',
    stageIndex: 2,
    platform: 'CHATGPT',
    domain: 'INVESTING',
    descriptionKo: '비즈니스 모델, 현금흐름 질, 밸류에이션, 베어 케이스를 체계화하고 사전에 명량한 반증/무효화 기준(Invalidation Triggers)을 수립합니다.',
    prerequisitesKo: ['W01', 'T02'],
    outputKo: '무효화 기준이 명시된 주식 분석 메모',
    labId: 'LAB-04',
  },
  {
    id: 'W03',
    code: 'W03',
    title: 'Evidence-Centered Accounting Memorandum',
    titleKo: '증적 중심 기술회계 메모 (자본화 vs 수선비)',
    stage: 'WORKFLOWS',
    stageIndex: 2,
    platform: 'CHATGPT',
    domain: 'ACCOUNTING',
    descriptionKo: 'IAS 16 / ASC 360 기준에 따라 14만 달러 설비 개보수를 부품별 대체(자본화)와 일상 유지비용(당기비용)으로 분리하고 분개를 확정합니다.',
    prerequisitesKo: ['W01', 'T02'],
    outputKo: '부품 제거 손익 및 감사 증적 체크리스트 메모',
    labId: 'LAB-03',
  },

  // Stage 3: Automation
  {
    id: 'A01',
    code: 'A01',
    title: 'Triggers, Schedules, Retries & Idempotency',
    titleKo: '트리거, 스케줄, 재시도 및 멱등성 설계',
    stage: 'AUTOMATION',
    stageIndex: 3,
    platform: 'CROSS',
    domain: 'BOTH',
    descriptionKo: '트리거, 필터, 지수 백오프 재시도와 함께 결정론적 멱등성 키(Idempotency Key)를 구축하여 중복 발송 및 이중 전표 재난을 원천 차단합니다.',
    prerequisitesKo: ['W01 (워크플로 안정화)'],
    outputKo: '중복 억제 멱등성 키 기반 배치 자동화 파이프라인',
    labId: 'LAB-05',
  },
  {
    id: 'A04',
    code: 'A04',
    title: 'Power Automate Triggers, Conditions & DLP',
    titleKo: 'Power Automate 조건 분기, 결재 및 DLP 거버넌스',
    stage: 'AUTOMATION',
    stageIndex: 3,
    platform: 'M365',
    domain: 'ACCOUNTING',
    descriptionKo: 'SharePoint, Teams 결재 카드, Outlook을 연동하고 고정자산 폐기 승인 및 미승인 48시간 타임아웃 에스컬레이션을 구현합니다.',
    prerequisitesKo: ['A01', 'T05'],
    outputKo: '타임아웃 및 DLP 거버넌스가 적용된 클라우드 흐름',
    labId: 'LAB-06',
  },

  // Stage 4: Agents
  {
    id: 'G01',
    code: 'G01',
    title: 'Goal, Plan, Tool, Observe, State & Stop Loop',
    titleKo: '목표, 계획, 도구, 관찰, 상태 및 종료 루프',
    stage: 'AGENTS',
    stageIndex: 4,
    platform: 'CROSS',
    domain: 'BOTH',
    descriptionKo: '목표 수립 → 동적 하위계획 → 읽기 전용 샌드박스 도구 호출 → 결과 관찰 → 상태 갱신 → 종료 조건을 돌며 은행 계정조정 차이를 수사합니다.',
    prerequisitesKo: ['A01 (자동화 신뢰성)', 'W01'],
    outputKo: '원장 쓰기 권한이 배제된 통제형 계정조정 조사 에이전트',
    labId: 'LAB-07',
  },

  // Stage 5: Systems
  {
    id: 'S01',
    code: 'S01',
    title: 'Enterprise AI Reference Architecture & ADR',
    titleKo: '엔터프라이즈 AI 참조 아키텍처 및 결정 기록(ADR)',
    stage: 'SYSTEMS',
    stageIndex: 5,
    platform: 'CROSS',
    domain: 'BOTH',
    descriptionKo: '도구, 워크플로, 자동화, 에이전트를 통합하는 7대 모듈형 AI 엔터프라이즈 운영체제 참조 아키텍처 및 아키텍처 결정 기록(ADR)을 완성합니다.',
    prerequisitesKo: ['G01', 'A04', 'W02', 'W03'],
    outputKo: '7대 모듈 통합 투자/회계 OS 아키텍처 결정서(ADR)',
    labId: 'LAB-08',
  },
];

// Dependency Links illustrating the prerequisite learning flow
export const CURRICULUM_LINKS: GraphLink[] = [
  // Stage 1 -> Stage 1 internal progression
  { source: 'T01', target: 'T02', relationshipKo: '컨텍스트 제약 조건 부여' },
  { source: 'T01', target: 'T03', relationshipKo: '코드 인터프리터 연산 격리' },
  { source: 'T01', target: 'T05', relationshipKo: 'M365 테넌트 권한 경계 이해' },
  { source: 'T05', target: 'T06', relationshipKo: 'Excel 표 스키마 계약 수립' },
  { source: 'T05', target: 'T07', relationshipKo: '협업 스레드 감사 증적 추출' },

  // Stage 1 -> Stage 2 Workflows
  { source: 'T02', target: 'W01', relationshipKo: '구조화된 입력 계약 설계' },
  { source: 'T02', target: 'W03', relationshipKo: '기술회계 메모 엄밀성 적용' },
  { source: 'T03', target: 'W02', relationshipKo: '정량 팩트와 현금흐름 분석' },
  { source: 'T06', target: 'W01', relationshipKo: '결산 보고 워크플로 연결' },

  // Stage 2 Workflows internal & cross
  { source: 'W01', target: 'W02', relationshipKo: '5단계 체계적 리서치 프로세스' },
  { source: 'W01', target: 'W03', relationshipKo: '수선비 판정 의사결정 게이트' },

  // Stage 2 -> Stage 3 Automation
  { source: 'W01', target: 'A01', relationshipKo: '안정화된 프로세스의 자동화 전환' },
  { source: 'A01', target: 'A04', relationshipKo: 'Power Automate 클라우드 결재 구현' },

  // Stage 3 -> Stage 4 Agents
  { source: 'A01', target: 'G01', relationshipKo: '결정론적 자동화에서 에이전트 루프 확장' },
  { source: 'A04', target: 'G01', relationshipKo: '도구 샌드박스 및 예외 처리 연결' },

  // Stage 2 & 4 -> Stage 5 Systems
  { source: 'W02', target: 'S01', relationshipKo: '투자 리서치 OS 모듈 통합' },
  { source: 'W03', target: 'S01', relationshipKo: 'ICFR 자동화 랩 결합' },
  { source: 'G01', target: 'S01', relationshipKo: 'HITL 인간 통제 및 전사 시스템 거버넌스' },
];

const STAGE_COLORS: Record<Stage, { stroke: string; fill: string; text: string }> = {
  TOOLS: { stroke: '#0ea5e9', fill: '#0369a1', text: '#38bdf8' },
  WORKFLOWS: { stroke: '#06b6d4', fill: '#0891b2', text: '#22d3ee' },
  AUTOMATION: { stroke: '#10b981', fill: '#059669', text: '#34d399' },
  AGENTS: { stroke: '#14b8a6', fill: '#0d9488', text: '#2dd4bf' },
  SYSTEMS: { stroke: '#8b5cf6', fill: '#6d28d9', text: '#a78bfa' },
};

interface KnowledgeGraphProps {
  onNavigateLesson?: (lessonId: string) => void;
  onNavigateLab?: (labId: string) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  onNavigateLesson,
  onNavigateLab,
}) => {
  const { attempts } = useLearningState();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterStage, setFilterStage] = useState<Stage | 'ALL'>('ALL');
  const [filterDomain, setFilterDomain] = useState<Domain | 'ALL'>('ALL');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Filtered nodes and links based on UI selections
  const { filteredNodes, filteredLinks } = useMemo(() => {
    let nodes = CURRICULUM_NODES;

    if (filterStage !== 'ALL') {
      nodes = nodes.filter((n) => n.stage === filterStage);
    }
    if (filterDomain !== 'ALL') {
      nodes = nodes.filter((n) => n.domain === filterDomain || n.domain === 'BOTH');
    }

    const nodeIds = new Set(nodes.map((n) => n.id));
    const links = CURRICULUM_LINKS.filter((l) => {
      const srcId = typeof l.source === 'string' ? l.source : l.source.id;
      const tgtId = typeof l.target === 'string' ? l.target : l.target.id;
      return nodeIds.has(srcId) && nodeIds.has(tgtId);
    });

    return { filteredNodes: nodes, filteredLinks: links };
  }, [filterStage, filterDomain]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', [0, 0, width, height]).attr('width', width).attr('height', height);

    // Definitions: Gradients, drop-shadows & Arrow Markers
    const defs = svg.append('defs');

    // Arrowhead marker
    defs
      .append('marker')
      .attr('id', 'arrow-marker')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#38bdf8')
      .attr('opacity', 0.85);

    // Arrowhead marker for active links
    defs
      .append('marker')
      .attr('id', 'arrow-marker-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 9)
      .attr('markerHeight', 9)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#34d399');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'node-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('class', 'graph-container');

    // Zoom and pan setup
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Layout configuration: Column-based stratified positioning by stage
    // Stage 1 (Tools): x ~ 100, Stage 2: x ~ 280, Stage 3: x ~ 460, Stage 4: x ~ 640, Stage 5: x ~ 780
    const stageXMap: Record<number, number> = {
      1: width * 0.12,
      2: width * 0.34,
      3: width * 0.55,
      4: width * 0.76,
      5: width * 0.92,
    };

    // Deep copy data for D3 simulation
    const nodesData: GraphNode[] = filteredNodes.map((d) => ({ ...d }));
    const linksData: GraphLink[] = filteredLinks.map((d) => ({
      ...d,
      source: typeof d.source === 'object' ? (d.source as GraphNode).id : d.source,
      target: typeof d.target === 'object' ? (d.target as GraphNode).id : d.target,
    }));

    // Group nodes by stage to calculate initial stratified Y coordinates
    const stageGroups: Record<number, GraphNode[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    nodesData.forEach((n) => {
      if (stageGroups[n.stageIndex]) {
        stageGroups[n.stageIndex].push(n);
      }
    });

    Object.keys(stageGroups).forEach((stageKey) => {
      const group = stageGroups[Number(stageKey)];
      const total = group.length;
      group.forEach((node, idx) => {
        const step = height / (total + 1);
        node.x = stageXMap[node.stageIndex] || width / 2;
        node.y = step * (idx + 1);
      });
    });

    // Background stage column guidelines
    const stageGuides = g.append('g').attr('class', 'stage-guides').attr('opacity', 0.25);
    [1, 2, 3, 4, 5].forEach((idx) => {
      const x = stageXMap[idx];
      stageGuides
        .append('line')
        .attr('x1', x)
        .attr('y1', 20)
        .attr('x2', x)
        .attr('y2', height - 20)
        .attr('stroke', '#475569')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');

      const stageNameKo = ['도구 (Tools)', '워크플로 (Workflows)', '자동화 (Automation)', '에이전트 (Agents)', '시스템 (Systems)'][idx - 1];
      stageGuides
        .append('text')
        .attr('x', x)
        .attr('y', 16)
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(`${idx}단계: ${stageNameKo}`);
    });

    // Simulation setup with custom force along X axis to preserve stage hierarchy
    const simulation = d3
      .forceSimulation<GraphNode>(nodesData)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(linksData)
          .id((d) => d.id)
          .distance(90)
      )
      .force('charge', d3.forceManyBody().strength(-180))
      .force('x', d3.forceX<GraphNode>((d) => stageXMap[d.stageIndex] || width / 2).strength(0.85))
      .force('y', d3.forceY<GraphNode>(height / 2).strength(0.2))
      .force('collision', d3.forceCollide<GraphNode>().radius(36));

    // Links container
    const linkGroup = g.append('g').attr('class', 'links');
    const links = linkGroup
      .selectAll<SVGPathElement, GraphLink>('path')
      .data(linksData)
      .join('path')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.8)
      .attr('stroke-opacity', 0.75)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow-marker)');

    // Nodes container
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodesData)
      .join('g')
      .attr('class', 'node-item')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer halo / background circle
    nodeElements
      .append('circle')
      .attr('r', 22)
      .attr('fill', (d) => STAGE_COLORS[d.stage]?.fill || '#0f172a')
      .attr('fill-opacity', 0.25)
      .attr('stroke', (d) => {
        const isCompleted = attempts[d.id]?.completedAt;
        return isCompleted ? '#34d399' : STAGE_COLORS[d.stage]?.stroke || '#38bdf8';
      })
      .attr('stroke-width', (d) => (attempts[d.id]?.completedAt ? 2.5 : 1.8))
      .attr('filter', 'url(#node-glow)');

    // Inner node circle
    nodeElements
      .append('circle')
      .attr('r', 17)
      .attr('fill', '#090d16')
      .attr('stroke', (d) => (attempts[d.id]?.completedAt ? '#10b981' : '#1e293b'))
      .attr('stroke-width', 1.2);

    // Node Code Label (T01, W01, etc.)
    nodeElements
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', (d) => {
        const isCompleted = attempts[d.id]?.completedAt;
        return isCompleted ? '#34d399' : STAGE_COLORS[d.stage]?.text || '#f8fafc';
      })
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', 'bold')
      .text((d) => d.code);

    // Sub-label below node (Korean title)
    nodeElements
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '32px')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '9px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .text((d) => {
        return d.titleKo.length > 10 ? `${d.titleKo.slice(0, 9)}...` : d.titleKo;
      });

    // Completed badge checkmark icon
    nodeElements.each(function (d) {
      if (attempts[d.id]?.completedAt) {
        d3.select(this)
          .append('circle')
          .attr('cx', 14)
          .attr('cy', -14)
          .attr('r', 6)
          .attr('fill', '#10b981');

        d3.select(this)
          .append('text')
          .attr('x', 14)
          .attr('y', -12)
          .attr('text-anchor', 'middle')
          .attr('font-size', '8px')
          .attr('fill', '#022c22')
          .attr('font-weight', 'bold')
          .text('✓');
      }
    });

    // Hover & Click Interactions
    nodeElements
      .on('mouseenter', (event, d) => {
        setHoveredNodeId(d.id);
        // Highlight active connections
        links
          .attr('stroke', (l) => {
            const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return sId === d.id || tId === d.id ? '#34d399' : '#1e293b';
          })
          .attr('stroke-width', (l) => {
            const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return sId === d.id || tId === d.id ? 2.8 : 1.2;
          })
          .attr('stroke-opacity', (l) => {
            const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return sId === d.id || tId === d.id ? 1 : 0.2;
          })
          .attr('marker-end', (l) => {
            const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return sId === d.id || tId === d.id ? 'url(#arrow-marker-active)' : 'url(#arrow-marker)';
          });
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
        links
          .attr('stroke', '#334155')
          .attr('stroke-width', 1.8)
          .attr('stroke-opacity', 0.75)
          .attr('marker-end', 'url(#arrow-marker)');
      })
      .on('click', (_event, d) => {
        setSelectedNode(d);
      });

    // Simulation tick handler with smooth curved path rendering
    simulation.on('tick', () => {
      links.attr('d', (d) => {
        const source = d.source as GraphNode;
        const target = d.target as GraphNode;
        const dx = (target.x || 0) - (source.x || 0);
        const dy = (target.y || 0) - (source.y || 0);
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.25; // Subtle curve
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      nodeElements.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, attempts]);

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
  };

  // Find incoming (prerequisite) and outgoing (next step) nodes for selected node
  const nodeConnections = useMemo(() => {
    if (!selectedNode) return { incoming: [], outgoing: [] };
    const incoming: { node: GraphNode; relKo: string }[] = [];
    const outgoing: { node: GraphNode; relKo: string }[] = [];

    CURRICULUM_LINKS.forEach((link) => {
      const srcId = typeof link.source === 'string' ? link.source : (link.source as GraphNode).id;
      const tgtId = typeof link.target === 'string' ? link.target : (link.target as GraphNode).id;

      if (tgtId === selectedNode.id) {
        const srcNode = CURRICULUM_NODES.find((n) => n.id === srcId);
        if (srcNode) incoming.push({ node: srcNode, relKo: link.relationshipKo });
      }

      if (srcId === selectedNode.id) {
        const tgtNode = CURRICULUM_NODES.find((n) => n.id === tgtId);
        if (tgtNode) outgoing.push({ node: tgtNode, relKo: link.relationshipKo });
      }
    });

    return { incoming, outgoing };
  }, [selectedNode]);

  return (
    <div className="space-y-4">
      {/* Top Banner and Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>D3 커리큘럼 지식 그래프 (Knowledge Graph)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              도구(Tools)에서 시스템(Systems)으로 이어지는 5단계 학습 의존성과 흐름도를 대화형으로 탐색합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetZoom}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-slate-300 hover:text-white transition"
              title="줌 및 위치 초기화"
            >
              ⟲ 줌 리셋
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-mono mr-1">단계:</span>
            {(['ALL', 'TOOLS', 'WORKFLOWS', 'AUTOMATION', 'AGENTS', 'SYSTEMS'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStage(st)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] transition ${
                  filterStage === st
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {st === 'ALL'
                  ? '전체 단계'
                  : st === 'TOOLS'
                  ? '1.도구'
                  : st === 'WORKFLOWS'
                  ? '2.워크플로'
                  : st === 'AUTOMATION'
                  ? '3.자동화'
                  : st === 'AGENTS'
                  ? '4.에이전트'
                  : '5.시스템'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-mono mr-1">분야:</span>
            {(['ALL', 'ACCOUNTING', 'INVESTING'] as const).map((dm) => (
              <button
                key={dm}
                onClick={() => setFilterDomain(dm)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  filterDomain === dm
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dm === 'ALL' ? '전체' : dm === 'ACCOUNTING' ? '회계/통제' : '투자 분석'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* D3 Interactive Graph Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[500px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl select-none"
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-mono space-y-1">
          <div className="text-slate-400 font-bold uppercase mb-1">범례 (Legend)</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-sky-400 bg-sky-500/30" />
            <span>1단계: 도구 (Tools)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-cyan-400 bg-cyan-500/30" />
            <span>2단계: 워크플로 (Workflows)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 bg-emerald-500/30" />
            <span>3단계: 자동화 (Automation)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-teal-400 bg-teal-500/30" />
            <span>4단계: 에이전트 (Agents)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-purple-400 bg-purple-500/30" />
            <span>5단계: 시스템 (Systems)</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5 border-t border-slate-800 text-emerald-400">
            <span>✓</span>
            <span>학습 완료 노드 (Passed)</span>
          </div>
        </div>

        {/* Zoom Instructions Tip */}
        <div className="absolute top-3 right-3 text-[10px] text-slate-500 font-mono bg-slate-900/60 px-2 py-1 rounded border border-slate-800/80">
          드래그로 이동 · 휠로 줌 · 노드 클릭 시 상세 정보
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4 text-xs text-slate-200 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {selectedNode.code}
                </span>
                <StageBadge stage={selectedNode.stage} size="sm" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                  {selectedNode.platform} · {selectedNode.domain}
                </span>
                {attempts[selectedNode.id]?.completedAt && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    ✓ 완료됨 (점수: {attempts[selectedNode.id]?.quizScore ?? 100}%)
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-white">{selectedNode.titleKo}</h4>
              <div className="text-[11px] text-slate-400 italic">{selectedNode.title}</div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="font-mono text-slate-400 text-[10px] uppercase block mb-1">
                학습 목표 및 해결 과제:
              </span>
              <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                {selectedNode.descriptionKo}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block font-mono">
                  ← 선수 학습 과목 (Prerequisites):
                </span>
                {nodeConnections.incoming.length === 0 ? (
                  <span className="text-slate-500">기초 단계 (선수 학습 없음)</span>
                ) : (
                  <ul className="space-y-1">
                    {nodeConnections.incoming.map((inc, idx) => (
                      <li key={idx} className="text-slate-300">
                        <strong className="text-cyan-400">{inc.node.code}</strong>:{' '}
                        {inc.node.titleKo} ({inc.relKo})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block font-mono">
                  → 후속 연계 과목 (Next Steps):
                </span>
                {nodeConnections.outgoing.length === 0 ? (
                  <span className="text-slate-500">최종 시스템 단계 (후속 의존성 없음)</span>
                ) : (
                  <ul className="space-y-1">
                    {nodeConnections.outgoing.map((out, idx) => (
                      <li key={idx} className="text-slate-300">
                        <strong className="text-emerald-400">{out.node.code}</strong>:{' '}
                        {out.node.titleKo} ({out.relKo})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-500 font-mono block">실무 핵심 산출물:</span>
                <span className="text-cyan-300 font-medium">{selectedNode.outputKo}</span>
              </div>
              <div className="flex gap-2">
                {onNavigateLesson && (
                  <button
                    onClick={() => onNavigateLesson(selectedNode.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-sm"
                  >
                    이 레슨 학습하기 →
                  </button>
                )}
                {selectedNode.labId && onNavigateLab && (
                  <button
                    onClick={() => onNavigateLab(selectedNode.labId!)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-semibold transition"
                  >
                    ⚡ 실습 랩 ({selectedNode.labId})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
