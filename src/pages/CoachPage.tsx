import React, { useState } from 'react';
import { useLearningState } from '../hooks/useLearningState';
import { LESSON_CATALOG } from '../data/lessonCatalog';

export const CoachPage: React.FC = () => {
  const { setUserNote } = useLearningState();

  const [activeDomainTab, setActiveDomainTab] = useState<'investing' | 'economy' | 'english' | 'universal'>('investing');
  const [activeStageStep, setActiveStageStep] = useState<number>(0);
  const [mode, setMode] = useState<string>('explain');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSON_CATALOG[0].id);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<
    {
      role: 'user' | 'assistant';
      content: string;
      source?: string;
      timestamp: string;
    }[]
  >([
    {
      role: 'assistant',
      content: `반갑습니다! 여러분의 AI 마스터 선생님(AI Master Teacher)입니다. 🎓

저는 AI를 단순한 챗봇 질문용이 아닌, 실전 문제를 해결하는 강력한 도구이자 시스템으로 가르칩니다.
특히 **투자(Investment), 거시경제(Macro Economics), 비즈니스 영어(Global Business English), 그리고 AI 아키텍처**를 다음의 5단계로 체계적으로 마스터하도록 이끌어 드립니다:

1. [도구 Tools]: AI의 뇌(가중치)와 손발(파이썬/검색 도구)을 분리하여 정확한 계산과 팩트 추출
2. [워크플로 Workflows]: 단발성 대화를 넘어 다단계 프롬프트 체인과 팩트체크 파이프라인 구축
3. [자동화 Automation]: 매일 아침 환율·금리·주요 공시와 데일리 영어 표현을 자동으로 받아보는 비서 구축
4. [에이전트 Agents]: 가치투자자 vs 성장투자자 토론, 1:1 영어 협상 상대역 롤플레잉
5. [시스템 Systems]: 나만의 지능형 포트폴리오 모니터링 및 다국어 지식 라이브러리 운영

상단의 특화 분야 탭을 선택하시거나, 실무에서 궁금한 점을 편하게 질문해 주세요!`,
      source: 'AI 마스터 선생님',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const selectedLesson = LESSON_CATALOG.find((l) => l.id === selectedLessonId);

  // Teacher Framework Data across 4 Domains
  const DOMAIN_CURRICULUM = {
    investing: {
      title: '투자 분석 & 기업 밸류에이션 (Investment & Equity Research)',
      tagline: '단순 주가 예측이 아닌, 10-K 공시 원문과 재무제표를 파이썬으로 파싱하고 밸류에이션 모델을 구축합니다.',
      stages: [
        {
          stage: '1. 도구 (Tools)',
          coreIdea: '언어 모델에게 암산을 시키지 말고, Python Code Interpreter로 재무제표 CSV를 직접 계산하게 하세요.',
          prompt: `[시스템: 월가 시니어 에쿼티 리서치 애널리스트]
아래 첨부된 합성 재무제표 데이터를 Python Pandas로 파싱하여 다음 3대 지표를 산출하십시오:
1. 지난 3개년 잉여현금흐름(FCF) 연평균 성장률(CAGR)
2. 순부채 / EBITDA 비율
3. 투하자본이익률(ROIC) vs 가중평균자본비용(WACC)
모든 계산식과 파이썬 코드를 명시하고, 모델의 임의 가정을 절대 배제하십시오.`,
          pitfall: 'LLM의 텍스트 토큰 산술 환각을 믿고 엑셀 합계를 언어 모델로만 계산하려는 유혹.',
        },
        {
          stage: '2. 워크플로 (Workflows)',
          coreIdea: '공시 요약 파이프라인: [1단계 10-K 사업보고서 위험요인 추출] → [2단계 전년도 대비 차이점 비교] → [3단계 투자 메모 작성]',
          prompt: `다음은 2개 분기 어닝스 콜(실적 발표) 질의응답 녹취록입니다.
1단계: 경영진이 "불확실성(Uncertainty)", "역풍(Headwind)" 단어를 사용한 문맥을 전수 추출하십시오.
2단계: 시설투자(CapEx) 계획이 지연되거나 하향 조정된 항목을 표로 정리하십시오.
3단계: 애널리스트 질의에 대해 구체적 수치 답변을 회피한 3가지 핵심 질문을 식별하십시오.`,
          pitfall: '1단계 원문 검증 없이 모델에게 바로 "이 주식 사도 돼?"라고 물어보는 비체계적 접근.',
        },
        {
          stage: '3. 자동화 (Automation)',
          coreIdea: '매일 아침 관심 종목의 SEC 공시(8-K, 13-F)와 목표주가 변동을 자동으로 모아 브리핑 생성.',
          prompt: `매일 아침 7시 실행: 관심 종목 10개의 최신 공시 피드를 조회하여
- 중요 지분 변동(Insider Buying/Selling)
- 소송 및 규제 리스크 발생 여부
- 증권사 목표주가 컨센서스 상하향 폭을 요약한 모닝 인텔리전스 리포트를 생성하십시오.`,
          pitfall: '중복 이메일 폭탄 방지를 위한 멱등성 키(MD5 해시) 설계 누락.',
        },
        {
          stage: '4. 에이전트 (Agents)',
          coreIdea: '멀티 에이전트 토론: [워런 버핏 스타일 가치투자 에이전트] vs [캐시 우드 스타일 성장 에이전트] vs [리스크 관리관].',
          prompt: `[에이전트 1: 보수적 가치투자자] - 안전마진, 현금흐름 창출력, 해자(Moat) 관점에서 기업 비판.
[에이전트 2: 기술 혁신 성장투자자] - 시장 침투율, 네트워크 효과 관점에서 반론.
[에이전트 3: 리스크 심의위원] - 양측 주장의 논리적 허점을 지적하고 최종 투자의견 종합.`,
          pitfall: '에이전트의 단독 자율 매매 주문 체결 허용 (반드시 인간 승인 게이트 필수).',
        },
        {
          stage: '5. 시스템 (Systems)',
          coreIdea: '개인 맞춤형 투자 포트폴리오 인텔리전스 OS: 데이터 수집 → 밸류에이션 → 리스크 가드레일 통합.',
          prompt: `포트폴리오 리밸런싱 시스템:
1. 정기적으로 보유 종목의 내재가치 대비 시장가격 괴리율을 추적합니다.
2. 특정 종목 비중이 20%를 초과할 경우 경고를 발생시킵니다.
3. 모든 판단의 감사 증적 로그를 영구 로컬 저장소에 저장합니다.`,
          pitfall: '과거 백테스팅 데이터에 대한 과적합(Overfitting)과 감정적 편향.',
        },
      ],
    },
    economy: {
      title: '거시 경제 & 글로벌 마켓 리서치 (Macro Economics & Markets)',
      tagline: '헤드라인 뉴스에 휘둘리지 않고, 연준(Fed) FOMC 성명서, 금리, 물가(CPI), 환율 시나리오를 과학적으로 분석합니다.',
      stages: [
        {
          stage: '1. 도구 (Tools)',
          coreIdea: '연준(FRED) 경제 지표와 미국 국채 10년물-2년물 금리 스프레드를 실시간 주입하여 경기 침체 시그널 확인.',
          prompt: `[시스템: 매크로 이코노미스트]
미국 국채 10년물 금리와 2년물 금리 역전 현상(Inverted Yield Curve)에 대해 다음을 분석하십시오:
1. 최근 6개월간 스프레드 추이
2. 역사적 장단기 금리 역전 후 경기침체(NBER 침체) 진입 평균 시차
3. 현재 통화정책 기조(양적 긴축 QT)가 유동성에 미치는 영향`,
          pitfall: '공식 경제 통계 원문(BLS, BEA) 없이 인터넷 루머나 블로그 텍스트를 사실로 인용.',
        },
        {
          stage: '2. 워크플로 (Workflows)',
          coreIdea: 'FOMC 성명서 문구 비교(Redline Analysis): 전달 성명서 대비 삭제/추가된 핵심 어휘 추적 파이프라인.',
          prompt: `이번 달 FOMC 성명서 원문과 지난달 성명서 원문을 비교하십시오:
1. 문구 변경 사항을 Redline(추가/삭제) 형식으로 표시하십시오.
2. 파월 의장 기자회견 발언에서 매파적(Hawkish) 톤과 비둘기파적(Dovish) 톤의 비중을 정량 평가하십시오.
3. 기준금리 동결 또는 인하 확률에 대한 시장 프라이싱(FedWatch) 변화를 요약하십시오.`,
          pitfall: '중앙은행의 완곡한 외교적 수사(Fedspeak)를 액면 그대로 단순 텍스트로 오독.',
        },
        {
          stage: '3. 자동화 (Automation)',
          coreIdea: '주요 경제 지표(CPI, PCE, 비농업 고용 NFP) 발표 즉시 시장 컨센서스 괴리율을 자동 산출.',
          prompt: `미국 노동부 CPI 발표 즉시:
- 헤드라인 CPI vs 근원(Core) CPI 전년 대비 상승률
- 시장 예상치(Consensus)와의 편차(+/- 0.1%p 등)
- 주거비(Shelter) 및 슈퍼코어 서비스 물가 기여도를 30초 내로 구조화 마크다운으로 요약.`,
          pitfall: '속보 발표 시 잠정치와 확정치 수정(Revision)을 구분하지 못하는 문제.',
        },
        {
          stage: '4. 에이전트 (Agents)',
          coreIdea: '글로벌 거시 충격 시나리오 시뮬레이션: [유가 급등 시나리오] vs [달러화 강세 시나리오] vs [연착륙].',
          prompt: `[매크로 시나리오 스트레스 에이전트]
국제 유가가 배럴당 100달러를 돌파할 경우:
1. 국내 수입물가 및 무역수지에 미치는 파급효과
2. 미국 인플레이션 반등에 따른 금리 인하 지연 가능성
3. 신흥국 환율 압박 및 외환보유액 방어 여력을 3개 시나리오(낙관/기본/비관)로 수치화하십시오.`,
          pitfall: '변수 간의 상관관계(역인과관계, 피드백 루프)를 고려하지 않은 단순 선형 외삽.',
        },
        {
          stage: '5. Systems (시스템)',
          coreIdea: '글로벌 경제 인텔리전스 대시보드: 금리, 유동성, 인플레이션, 환율을 융합한 자율 지능 레이더.',
          prompt: `글로벌 매크로 조기경보 시스템 아키텍처:
- 외환 시장 변동성(VIX, MOVE 지수) 상시 모니터링
- 글로벌 자금 흐름(ETF 유출입) 자동 집계
- 월간 경기 사이클 국면(회복/활황/후퇴/침체) 진단 알고리즘 결합.`,
          pitfall: '블랙 스완(예측 불가능한 외생적 충격)에 대한 가드레일 부재.',
        },
      ],
    },
    english: {
      title: '실전 비즈니스 영어 & 협상 커뮤니케이션 (Global Business English)',
      tagline: '단순 번역기를 버리세요. 미국계 파트너의 관점에서 3가지 톤으로 교정받고, 실전 협상 롤플레잉을 진행합니다.',
      stages: [
        {
          stage: '1. 도구 (Tools)',
          coreIdea: '원어민 뉘앙스 분해기: 단순 직역이 아닌, 업계 표준 콜로케이션(연어)과 격식도(Formality)를 점검.',
          prompt: `[시스템: 뉴욕 월가 로펌 & 투자은행 전문 영문에디터]
내가 작성한 다음 영문 문장을 분석하십시오:
"We want to change the contract price because raw materials are too expensive."
1. 왜 이 문장이 글로벌 협상에서 미숙하고 아마추어처럼 들리는지 이유를 설명하십시오.
2. 다음 3가지 톤으로 대안을 제시하십시오:
   - Option A (Formal / Executive): 정중하지만 법적 무게감이 있는 고위급 표현
   - Option B (Assertive / Firm): 단호하게 가격 조정을 요구하는 협상 표현
   - Option C (Collaborative): 장기 파트너십을 강조하며 상생을 유도하는 표현
3. 포함된 핵심 비즈니스 콜로케이션(Collocations) 3가지를 정리하십시오.`,
          pitfall: '한국어 문장 구조를 그대로 번역기에 넣어 어색한 콩글리시 어조를 방치하는 실수.',
        },
        {
          stage: '2. 워크플로 (Workflows)',
          coreIdea: 'C레벨 글로벌 전략 보고서 작성 파이프라인: [내 거친 한글 생각 메모] → [Minto Pyramid 영문 구조화] → [원어민 에디팅]',
          prompt: `다음 한글 메모를 Minto Pyramid 원칙(결론 우선 보고)에 따라 글로벌 이사회(Board) 보고용 1-Pager 영문 메모로 변환하십시오.
[한글 메모]: 최근 동남아 공장 증설 비용이 예상보다 15% 늘었는데, 인건비 상승 때문이고 현지 공급망을 다변화하면 내년 2분기에는 정상화될 수 있음.
요구사항:
1. Executive Summary (핵심 결론 2줄)
2. Strategic Implications (재무적 영향 및 위험)
3. Actionable Mitigation Plan (구체적 대응책과 타임라인)
4. 전문적인 연결어(Transition words)와 간결하고 힘 있는 동사(Action verbs) 사용.`,
          pitfall: '결론을 마지막에 배치하는 한국식 기승전결 화법을 글로벌 영문 보고서에 그대로 적용.',
        },
        {
          stage: '3. 자동화 (Automation)',
          coreIdea: '매일 아침 글로벌 경제지(WSJ/FT)에서 실무 핵심 표현 3선과 쉐도잉 오디오 스크립트를 자동 추출.',
          prompt: `매일 아침 1편의 글로벌 경제 기사 원문에서:
- 글로벌 비즈니스 미팅에서 바로 쓸 수 있는 세련된 구동사 및 관용구 3개
- 각 표현의 한국어 뜻과 실제 사용 맥락(Context)
- 큰 소리로 소리 내어 연습할 수 있는 쉐도잉(Shadowing) 예문 2개
를 포맷팅하여 데일리 학습 카드로 생성하십시오.`,
          pitfall: '시험용 영어 단어만 암기하고 실무 구두 발표나 이메일에 적용하지 못하는 비효율.',
        },
        {
          stage: '4. 에이전트 (Agents)',
          coreIdea: '해외 투자자 및 바이어와의 1:1 실전 협상 롤플레잉 에이전트: 까다로운 반론에 즉각 영어로 응대.',
          prompt: `[당신의 역할: 실리콘밸리 탑티어 VC 파트너]
[나의 역할: AI 스타트업 창업자]
상황: 500만 달러 투자 유치를 위한 밸류에이션 협상 테이블.
규칙:
1. 당신은 매우 날카롭고 직설적이며, 나의 고객 획득 비용(CAC)과 이탈률(Churn)을 집중 공격하십시오.
2. 내가 영어로 답변하면 답변의 논리적 설득력과 영어 표현의 세련미를 10점 만점으로 평가한 후, 다음 질문으로 압박하십시오.
3. 첫 질문을 영어로 시작해 주십시오.`,
          pitfall: '너무 친절한 AI 페르소나를 사용하여 실전의 가혹한 협상 스트레스를 경험하지 못하는 한계.',
        },
        {
          stage: '5. 시스템 (Systems)',
          coreIdea: '개인 맞춤형 글로벌 커뮤니케이션 OS: 나의 문체(Voice & Tone)를 학습하여 원어민 수준의 이메일을 초안 작성.',
          prompt: `나만의 영문 커뮤니케이션 시스템:
- 내가 자주 하는 실수(전치사 누락, 과도하게 긴 복문) 자동 필터링
- 수신자 직책(C레벨, 실무자, 감사인)에 따른 어조 자동 조율
- 중요한 계약 조항(인수 조건, 면책 조항) 검토 루틴 내장.`,
          pitfall: '문화적 차이(Low-context vs High-context)에 대한 고려 부족.',
        },
      ],
    },
    universal: {
      title: '올라운드 AI 마스터 & 아키텍처 (Universal AI Mastery & Systems)',
      tagline: '환각을 두려워하지 말고 아키텍처로 통제하세요. 100페이지 백서 3분 요약부터 자율 지능 에이전트까지 완성합니다.',
      stages: [
        {
          stage: '1. 도구 (Tools)',
          coreIdea: '컨텍스트 윈도우 한계와 RAG, 도구 호출(Function Calling)의 물리적 연산 경계를 체득.',
          prompt: `[시스템: AI 시스템 수석 아키텍트]
다음 비즈니스 문제를 평가하고 4대 아키텍처 구성요소로 분해하십시오:
"사내 셰어포인트에 저장된 200개의 비공개 계약서에서 자동 갱신 조항과 위약금 규정을 전수 감사"
1. 모델: 필요한 최소 컨텍스트 크기 및 추론 능력
2. 컨텍스트: 청킹(Chunking) 및 임베딩 전략
3. 도구: 정규식 필터링 및 OCR 파이프라인
4. 메모리: 감사 증적 영구 저장소`,
          pitfall: '모든 데이터를 무작정 프롬프트에 통째로 붙여넣어 토큰 한도 초과 및 환각 유발.',
        },
        {
          stage: '2. 워크플로 (Workflows)',
          coreIdea: '자기 검증(Self-Correction) 체인: 모델이 초안을 작성한 후 다른 프롬프트로 팩트와 논리를 역검증.',
          prompt: `[2단계 검증 워크플로]
Step 1 (생성기): 100페이지 산업 보고서의 핵심 성장 동인 5가지를 요약하십시오.
Step 2 (비판기): Step 1의 요약문 각 항목에 대해 원문 페이지 번호와 실제 근거 문장을 대조하고, 근거가 박약한 항목은 탈락시키십시오.
Step 3 (정제기): 통과된 엄밀한 팩트만으로 최종 보고서를 재구성하십시오.`,
          pitfall: '1회성 생성 결과를 비판적 검증 없이 그대로 상사에게 보고.',
        },
        {
          stage: '3. 자동화 (Automation)',
          coreIdea: '스케줄러와 웹훅을 통한 무인 업무 자동화: 인간은 승인 체크포인트(HITL)에만 개입.',
          prompt: `주간 시장 보고서 자동화 파이프라인:
- 매주 금요일 밤 데이터 자동 수집
- 토요일 새벽 초안 자동 작성
- 월요일 아침 팀장 승인(HITL) 대기 큐 생성
- 승인 시 전사 슬랙/이메일 자동 발송.`,
          pitfall: '인간 승인 절차 없이 외부 시스템에 자동 발송/기표하도록 방치.',
        },
        {
          stage: '4. 에이전트 (Agents)',
          coreIdea: '목표 지향적 자율 루프(ReAct Loop): [생각 Thought] → [행동 Act] → [관찰 Observe]의 반복.',
          prompt: `[자율 조사 에이전트]
목표: "2026년 상반기 글로벌 반도체 장비 업계의 주요 M&A 딜 3건을 심층 조사"
도구 목록: [GoogleSearch, SEC_EDGAR, Calculator, FileWrite]
규칙: 각 단계마다 생각(Thought), 취할 행동(Action), 결과를 관찰(Observation)하고 최종 산출물 완성 시 종료하십시오.`,
          pitfall: '무한 루프 방지 장치(Max Iteration limit)와 예산 제약(Cost guardrail) 미설정.',
        },
        {
          stage: '5. 시스템 (Systems)',
          coreIdea: '내부통제 및 감사 수준의 성숙도: CONCEPT → PROPOSAL → PROTOTYPE → WORKING → VERIFIED.',
          prompt: `시스템 성숙도 검증 체크리스트:
1. Normal Case: 표준 입력 100건에 대한 정상 작동 확인
2. Edge Case: 빈 파일, 거대 파일, 특수문자 입력 시 정상 방어
3. Failure Case: 네트워크 단절 시 안전한 에러 핸들링
4. Rerun Case: 동일 데이터 10회 재실행 시 100% 동일 결과 보장.`,
          pitfall: '정상 케이스 1번 돌아간 것을 가지고 "완성된 프로덕션 시스템"이라고 착각하는 행위.',
        },
      ],
    },
  };

  const currentDomainData = DOMAIN_CURRICULUM[activeDomainTab];
  const currentStageInfo = currentDomainData.stages[activeStageStep];

  const handleCopyPrompt = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleSendPromptToChat = (prompt: string) => {
    setInputMessage(prompt);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // Offline deterministic tutor responses
  const getOfflineFallbackResponse = (userPrompt: string, currentMode: string): string => {
    const p = userPrompt.toLowerCase();

    if (activeDomainTab === 'investing' || p.includes('투자') || p.includes('주식') || p.includes('dcf') || p.includes('밸류')) {
      return `[AI 마스터 선생님 - 투자 분석 & 밸류에이션 코칭]
질문: "${userPrompt}"

1. 멘탈 모델 & 아키텍처:
- 투자 분석에서 언어 모델은 "확률적 요약 엔진"이지 "계산기"가 아닙니다.
- 재무제표의 숫자 계산(PER, ROE, FCF)은 반드시 Python Code Interpreter나 엑셀 수식에 맡기고, LLM은 '사업보고서의 위험 요인 비교'와 '어닝스 콜 경영진 어조의 뉘앙스 변화'를 감지하는 데 활용해야 합니다.

2. 추천 프롬프트 실습:
"첨부된 10-K 공시 원문에서 [Risk Factors] 섹션을 읽고, 지난 분기 대비 새롭게 추가되거나 문구가 강화된 공급망 리스크 3가지를 표로 비교해 줘."

3. [한국어 핵심 요약]
- LLM에 "이 주식 오를까?"를 묻지 마세요.
- "이 회사의 현금창출능력을 위협하는 3대 취약점이 공시 원문 어디에 있는가?"를 묻는 것이 월가 애널리스트의 AI 활용법입니다.

4. 핵심 글로벌 투자 영어 표현:
- "Margin of Safety (안전마진)": 내재가치와 시장가격의 격차로 시장 충격을 흡수하는 여유폭.
- "Terminal Value (영구가치)": DCF 밸류에이션에서 예측 기간 이후 기업이 영구히 창출할 가치.
- "Earnings Quality (수익의 질)": 순이익 중 회계적 착시가 아닌 실제 영업현금흐름이 차지하는 비중.`;
    }

    if (activeDomainTab === 'economy' || p.includes('경제') || p.includes('금리') || p.includes('fomc') || p.includes('환율')) {
      return `[AI 마스터 선생님 - 거시 경제 & 글로벌 마켓 코칭]
질문: "${userPrompt}"

1. 멘탈 모델 & 아키텍처:
- 경제 지표(CPI, 금리, 환율)는 상호 얽힌 피드백 루프입니다.
- AI에게 단일 지표의 방향을 묻지 말고, "시나리오 트리(Scenario Tree)"를 그리게 하세요. 예를 들어 [기준금리 동결 + 유가 상승] 국면과 [금리 인하 + 고용 둔화] 국면을 분기하여 분석해야 합니다.

2. 추천 프롬프트 실습:
"이번 FOMC 성명서와 지난달 성명서 문구를 대조하여 삭제된 형용사(예: modest, solid)를 찾아내고, 이것이 채권 시장 10년물 금리에 미치는 시나리오 3가지를 도출해 줘."

3. [한국어 핵심 요약]
- 거시 경제 분석의 핵심은 예측이 아니라 '대응 시나리오 구축'입니다.
- AI는 거시 경제 뉴스 속에서 중앙은행의 미세한 어조 변화(Fedspeak)를 수치화하는 데 가장 탁월합니다.

4. 핵심 글로벌 경제 영어 표현:
- "Hawkish vs. Dovish (매파 vs. 비둘기파)": 물가 안정을 위한 긴축 선호 vs. 경기 부양을 위한 완화 선호.
- "Yield Curve Inversion (장단기 금리 역전)": 경기 침체의 대표적 조기 경보 시그널.
- "Sticky Inflation (끈적한 인플레이션)": 서비스 및 주거비 등 한번 오르면 쉽게 떨어지지 않는 물가 압력.`;
    }

    if (activeDomainTab === 'english' || p.includes('영어') || p.includes('english') || p.includes('이메일') || p.includes('협상')) {
      return `[AI 마스터 선생님 - 실전 비즈니스 영어 & 협상 코칭]
질문: "${userPrompt}"

1. 멘탈 모델 & 아키텍처:
- 단순 번역기는 단어를 1:1로 치환하지만, 비즈니스 영어는 '권력 관계(Power Dynamics)'와 '어조(Tone)'의 게임입니다.
- AI에게 "번역해 줘"라고 하지 말고, "나는 아시아 제조사 대표이고 상대는 까다로운 미국 유통사 바이어야. 파트너십을 해치지 않으면서 단가 8% 인상을 관철하는 협상 이메일을 3가지 톤으로 써 줘"라고 페르소나와 제약을 주어야 합니다.

2. 추천 프롬프트 실습:
"다음 한국어 메시지를 읽고, 글로벌 C레벨 임원들이 신뢰하는 간결하고 주도적인(Assertive) 영문 전략 메모로 변환해 줘. 결론(Action items)을 맨 앞에 배치해 줘."

3. [한국어 핵심 요약]
- 영어를 배울 때 문법보다 중요한 것은 '비즈니스 콜로케이션(단어의 짝)'입니다.
- AI는 24시간 언제든 당신과 날카롭게 대립해 주는 최고의 실전 영어 협상 파트너가 될 수 있습니다.

4. 핵심 글로벌 비즈니스 영어 표현:
- "Touch Base (간단히 현황 점검하다)": Let's touch base next Monday to review the revised pricing structure.
- "Bottom Line (최종 핵심/수익)": The bottom line is that supply chain delays will compress our gross margin by 200 bps.
- "Non-negotiable (양보 불가 조건)": Data privacy compliance is completely non-negotiable for our overseas expansion.`;
    }

    return `[AI 마스터 선생님 - 올라운드 AI 실무 아키텍처 코칭]
질문: "${userPrompt}"

1. 멘탈 모델 (도구 → 워크플로 → 자동화 → 에이전트 → 시스템):
- AI를 잘 쓰는 사람과 못 쓰는 사람의 차이는 '아키텍처'에 있습니다.
- 초보자는 채팅창 하나에 모든 걸 물어보고 실망하지만, 전문가는 프롬프트를 3단계로 쪼개고(워크플로), 매일 정해진 시간에 돌리고(자동화), 비판적 검토 에이전트를 붙여 팩트를 검증(시스템)합니다.

2. [한국어 핵심 요약]
- 환각은 AI의 결함이 아니라 창의적 언어 모델의 본질입니다.
- 환각을 없애는 유일한 방법은 '명시적 컨텍스트 주입', '파이썬 계산 도구 연동', '부정 제약 조건'이라는 3중 안전벨트를 설계하는 것입니다.

3. 핵심 글로벌 AI 아키텍처 영어 표현:
- "Context Boundary (컨텍스트 경계)": 모델이 접근할 수 있는 데이터의 명시적 한계선.
- "Idempotency (멱등성)": 동일한 프롬프트/작업을 여러 번 실행해도 동일한 상태와 결과를 보장하는 성질.
- "Human-in-the-Loop (HITL)": 최종 승인과 서명 단계에 반드시 인간 책임자를 배치하는 통제 원칙.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsg = {
      role: 'user' as const,
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          message: userText,
          lessonContext: {
            domainTab: activeDomainTab,
            selectedLesson: selectedLesson
              ? {
                  code: selectedLesson.code,
                  title: selectedLesson.title,
                  stage: selectedLesson.stage,
                }
              : null,
          },
          history: chatHistory.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.reply) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            source: 'Gemini 3.8 Flash (실시간 마스터 튜터)',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        const fallbackReply = getOfflineFallbackResponse(userText, mode);
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: fallbackReply,
            source: '오프라인 규칙형 학습 가이드 (AI 응답 아님)',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch {
      const fallbackReply = getOfflineFallbackResponse(userText, mode);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackReply,
          source: '오프라인 규칙형 학습 가이드 (AI 응답 아님)',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Teacher Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shadow-inner">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>AI 마스터 선생님 스튜디오</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  다방면 특화 과정
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                회계뿐 아니라 <span className="text-cyan-300 font-semibold">투자, 거시경제, 비즈니스 영어, 일반 실무</span>까지 5단계 프레임워크로 정복합니다.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            1.도구 → 2.워크플로 → 3.자동화 → 4.에이전트 → 5.시스템
          </div>
        </div>

        {/* 4 Specialized Domain Tabs */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'investing', label: '투자 & 밸류에이션', icon: '📈', color: 'cyan' },
            { id: 'economy', label: '거시 경제 & 마켓', icon: '🌐', color: 'blue' },
            { id: 'english', label: '비즈니스 영어 & 협상', icon: '💬', color: 'emerald' },
            { id: 'universal', label: '올라운드 AI 마스터', icon: '🚀', color: 'purple' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveDomainTab(tab.id as any);
                setActiveStageStep(0);
              }}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                activeDomainTab === tab.id
                  ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-md scale-[1.02]'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="text-base">{tab.icon}</div>
              <div className="text-xs font-bold text-white">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stage-by-Stage Curriculum Visualizer */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{currentDomainData.title}</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400">
              5단계 로드맵 ({activeStageStep + 1}/5)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{currentDomainData.tagline}</p>
        </div>

        {/* 5-Step Stage Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {currentDomainData.stages.map((stg, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStageStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition cursor-pointer ${
                activeStageStep === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {stg.stage}
            </button>
          ))}
        </div>

        {/* Active Stage Deep-Dive Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <div className="space-y-1">
            <div className="text-cyan-400 font-bold text-sm">
              💡 선생님의 핵심 교수법:
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              {currentStageInfo.coreIdea}
            </p>
          </div>

          {/* Practical Prompt Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold flex items-center gap-1">
                <span>📝 실전 최고급 프롬프트 템플릿:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    handleCopyPrompt(
                      currentStageInfo.prompt,
                      `prompt-${activeDomainTab}-${activeStageStep}`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition cursor-pointer"
                >
                  {copyFeedback === `prompt-${activeDomainTab}-${activeStageStep}`
                    ? '✓ 복사됨'
                    : '프롬프트 복사'}
                </button>
                <button
                  onClick={() => handleSendPromptToChat(currentStageInfo.prompt)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-[11px] transition cursor-pointer"
                >
                  선생님께 질문하기 ↵
                </button>
              </div>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-300 whitespace-pre-wrap font-mono text-[11px] leading-relaxed border border-slate-800/80">
              {currentStageInfo.prompt}
            </pre>
          </div>

          {/* Pitfall to avoid */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300/90 flex items-start gap-2 text-[11px]">
            <span className="text-base flex-shrink-0">⚠️</span>
            <div>
              <strong>주의해야 할 치명적 함정:</strong> {currentStageInfo.pitfall}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Teacher Chat Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>💬 1:1 대화형 과외 콘솔 (Interactive Tutor)</span>
          </h2>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">튜터 모드:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="explain">아키텍처 및 원리 해설</option>
              <option value="investing">투자 분석 & 재무제표 과외</option>
              <option value="economy">거시 경제 & 금리 지표 과외</option>
              <option value="english">비즈니스 영어 교정 & 회화</option>
              <option value="socratic">소크라테스 문답식 지도</option>
              <option value="challenge">4대 스트레스 테스트 챌린지</option>
            </select>
          </div>
        </div>

        {/* Chat History Container */}
        <div className="p-4 md:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 min-h-[380px] max-h-[520px] overflow-y-auto">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-400 font-mono">
                <span>{msg.role === 'user' ? '학습자' : msg.source || 'AI 마스터 선생님'}</span>
                <span>· {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-medium shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'assistant' && (
                <button
                  onClick={() => {
                    setUserNote('coach-session', msg.content);
                    alert('선생님의 인사이트가 개인 학습 메모에 저장되었습니다.');
                  }}
                  className="text-[10px] text-slate-400 hover:text-cyan-400 mt-1 font-mono transition cursor-pointer"
                >
                  + 학습 메모장에 저장
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 p-2 animate-pulse">
              <span>👨‍🏫</span>
              <span>선생님이 최적의 아키텍처와 피드백을 분석하고 있습니다...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder={
              activeDomainTab === 'investing'
                ? '투자 분석, 10-K 공시, DCF 밸류에이션 등 궁금한 점을 질문하세요...'
                : activeDomainTab === 'economy'
                ? 'FOMC 금리 결정, CPI 인플레이션, 환율 시나리오 등에 대해 질문하세요...'
                : activeDomainTab === 'english'
                ? '교정받고 싶은 영문 이메일이나 협상 표현을 입력하세요...'
                : 'AI 아키텍처, 워크플로 자동화, 에이전트 구축에 대해 질문하세요...'
            }
            className="w-full bg-transparent p-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || loading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              inputMessage.trim() && !loading
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>전송</span>
            <span>↵</span>
          </button>
        </div>
      </div>
    </div>
  );
};
