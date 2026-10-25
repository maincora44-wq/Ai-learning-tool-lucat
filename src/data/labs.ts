import { Lab } from '../domain/types';

export const ALL_LABS: Lab[] = [
  {
    id: 'LAB-01',
    code: 'LAB-01',
    title: '비즈니스 업무에 최적화된 AI 도구 선택 및 아키텍처 매핑',
    lessonIds: ['T01', 'T03', 'T05'],
    domain: 'BOTH',
    stage: 'TOOLS',
    minutes: 15,
    scenario: '5가지 실제 금융/회계/투자 비즈니스 시나리오가 주어집니다. 각 시나리오별로 최적의 도구(ChatGPT 텍스트, 코드 인터프리터 Python, 웹 검색, M365 Copilot, 결정론적 스크립트/자동화)를 선택하고, 아키텍처적 근거, 핵심 한계점, 데이터 보안 경계를 검증하십시오.',
    syntheticFixtureDescription: '엄격한 데이터 프라이버시, 정확한 수치 계산, 테넌트 보안 경계를 테스트하는 5대 합성 업무 카드 세트.',
    syntheticDataJson: [
      {
        id: 'TASK-1',
        description: '사내 셰어포인트 폴더에 저장된 구매 내부통제 지침 문서를 요약하여 감사위원회 보고서 작성.',
        idealTool: 'M365 Copilot (또는 Graph 연동 사내 RAG)',
        rationale: '테넌트 내부 비공개 문서에 대한 사용자 위임 권한과 정확한 출처 각주(Citation)가 필수적임.',
        limitation: '사내 셰어포인트의 과도한 공유(Oversharing) 권한 문제에 종속됨.',
      },
      {
        id: 'TASK-2',
        description: '45,000행 분량의 합성 분개장(General Ledger) CSV 파일에서 주말 기표 내역 및 벤포드의 법칙 왜곡 분석.',
        idealTool: 'ChatGPT Advanced Data Analysis (Python 샌드박스) 또는 로컬 Pandas',
        rationale: '확률적 언어 모델 추론이 아닌 메모리 버퍼 상의 엄격한 결정론적 수치 계산과 행 필터링이 필요함.',
        limitation: '실시간 사내 ERP 데이터베이스와 직접 동기화되지 않음.',
      },
      {
        id: 'TASK-3',
        description: '경쟁사가 2시간 전에 공시한 최신 SEC 10-Q 및 실적 발표 보도자료 수집 및 분석.',
        idealTool: 'ChatGPT 웹 검색 또는 실시간 금융 공시 API',
        rationale: '기초 모델의 정적 학습 컷오프를 넘어선 실시간 외부 웹 정보 검색이 필수적임.',
        limitation: '검색된 요약본을 전자공시(EDGAR) 원문 파일과 대조 검증해야 함.',
      },
      {
        id: 'TASK-4',
        description: '예산 승인이 3일 이상 지연된 코스트 센터 관리자에게 매일 아침 정기 독촉 이메일 자동 발송.',
        idealTool: '결정론적 자동화 엔진 (Power Automate / Cron 스케줄러)',
        rationale: '환각(Hallucination) 없이 정해진 스케줄에 맞춰 100% 신뢰성 있게 반복 실행되어야 함.',
        limitation: '안정적인 데이터 스키마와 중복 발송을 막는 멱등성 키(Idempotency Key)가 필수적임.',
      },
      {
        id: 'TASK-5',
        description: '합성 리스 계약 조항을 분석하여 리스 회계기준(IFRS 16 / K-IFRS 1116) 적용 여부 및 회계 메모 초안 작성.',
        idealTool: '정형화된 제약 조건을 적용한 ChatGPT 프롬프트 엔지니어링',
        rationale: '계약서 조항의 의미론적 해석 및 전문 회계 메모 서식 구성에 최적화되어 있음.',
        limitation: '반드시 공인회계사(CPA)의 인간 승인(Human-in-the-Loop) 검토가 수반되어야 함.',
      },
    ],
    syntheticDataCsv: `업무ID,시나리오설명,데이터위치,필수보장요건
TASK-1,사내 셰어포인트 구매 규정 문서 요약,사내 셰어포인트,테넌트 프라이버시 및 Graph 각주
TASK-2,45000행 분개장 데이터 분석 및 벤포드 검증,로컬 CSV,결정론적 계산 및 행 필터링
TASK-3,최신 경쟁사 공시 및 실적 보도자료 수집,공개 웹,최신성 및 원문 출처 링크
TASK-4,예산 지연 코스트센터 대상 정기 독촉 알림,ERP / 이메일,멱등적 실행 및 무환각 보장
TASK-5,리스 회계기준 검토 기술 메모 초안 작성,합성 계약서 텍스트,의미론적 종합 및 회계기준 정밀성`,
    steps: [
      '1단계: 5가지 업무 카드를 데이터 위치, 수학적 결정론, 프라이버시, 실행 모드의 4대 기준으로 분석합니다.',
      '2단계: 드롭다운에서 각 업무에 가장 적합한 아키텍처 도구를 매핑합니다.',
      '3단계: 도구 선택의 구조적 근거와 절대 간과해서는 안 될 치명적 한계점을 서술합니다.',
      '4단계: 평가 루브릭을 확인하여 과제 적합성을 자가 진단합니다.',
    ],
    expectedDeliverables: [
      '데이터 보안 및 결정론적 제약 조건이 반영된 5대 비즈니스 업무 도구 할당 매트릭스 및 한계점 보고서.',
    ],
    rubric: [
      { dimension: '도구 선택의 적합성', max: 3, rubricText: '데이터 프라이버시 및 수학적 계산 요건에 맞춰 최적의 도구를 올바르게 매핑함.' },
      { dimension: '아키텍처적 근거', max: 3, rubricText: '모델 가중치, 컨텍스트 윈도우, 외부 도구의 실행 경계를 정확히 인용함.' },
      { dimension: '위험 및 한계점 식별', max: 2, rubricText: '권한 과다공유나 토큰 연산 오차 등 핵심 취약점을 명확히 짚어냄.' },
      { dimension: '안전 통제 완성도', max: 2, rubricText: '인간 참여(HITL) 검증 및 데이터 마스킹 방안을 완비함.' },
    ],
    testCases: [
      {
        id: 'TC-01-NORM',
        kind: 'normal',
        title: '정상 케이스: 셰어포인트 사내 문서 요약',
        description: '비공개 테넌트 파일 처리를 위해 M365 Copilot을 올바르게 선택하는지 검증합니다.',
        syntheticInput: { taskId: 'TASK-1' },
        expectedBehavior: 'Microsoft Graph의 테넌트 보안 경계에 근거하여 M365 Copilot을 권장함.',
      },
      {
        id: 'TC-01-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 45,000행 대용량 장부 연산',
        description: '대규모 표 데이터에 대해 일반 텍스트 프롬프트 대신 코드 인터프리터를 선택하는지 검증합니다.',
        syntheticInput: { taskId: 'TASK-2' },
        expectedBehavior: '확률적 텍스트 추론을 배제하고 Python 샌드박스 / 결정론적 스크립트를 선택함.',
      },
      {
        id: 'TC-01-FAIL',
        kind: 'failure',
        title: '실패 방지: 단순 챗봇으로 스케줄링 시도 차단',
        description: '일반 챗봇 프롬프트를 정기 스케줄 알림 도구로 사용하는 오판을 걸러냅니다.',
        syntheticInput: { taskId: 'TASK-4' },
        expectedBehavior: '대화형 챗봇 대신 결정론적 워크플로 자동화 엔진이 필수적임을 지적함.',
      },
      {
        id: 'TC-01-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 도구 매핑 감사 추적',
        description: '동일한 비즈니스 요건에 대해 재평가 시에도 변함없는 권장 도구를 유지하는지 확인합니다.',
        syntheticInput: { replay: true },
        expectedBehavior: '역량 사다리 매핑의 오차 없는 일관성 유지.',
      },
    ],
    interactiveType: 'tool_selector',
  },

  {
    id: 'LAB-02',
    code: 'LAB-02',
    title: '내부회계관리제도(ICFR) 통제 증적 요청을 위한 안전한 프롬프트 설계',
    lessonIds: ['T02', 'T05'],
    domain: 'ACCOUNTING',
    stage: 'TOOLS',
    minutes: 15,
    scenario: '합성 유럽 자회사 "Alpha Precision Europe"의 내부통제 항목 CTRL-204(10만 달러 초과 계약 변경 건)를 테스트하고 있습니다. 환각을 방지하는 엄격한 부정 제약(Negative Constraint)을 포함하고, 개인식별정보(PII)를 제거하며, 정형화된 감사 증적 요청(PBC) 표를 출력하는 안전한 프롬프트를 작성하십시오.',
    syntheticFixtureDescription: '이중 승인 요건 및 미확인 임원 서명이 포함된 합성 자회사 계약 변경 현황 데이터.',
    syntheticDataJson: {
      entity: 'Alpha Precision Europe Ltd (합성 데이터)',
      period: '2026년 3분기',
      controlId: 'CTRL-204',
      controlDescription: '미화 100,000달러를 초과하는 모든 고객 및 공급업체 계약 변경은 계약 체결 전 대표이사(Managing Director)와 법무책임자(Legal Counsel) 양자 모두의 서면 승인을 받아야 함.',
      identifiedSampleAmendments: [
        { amendmentId: 'AMD-801', customer: 'Global Synthetic Logistics', amount: 145000, signedBy: '대표이사 단독 서명 (법무책임자 서명 누락)' },
        { amendmentId: 'AMD-802', customer: 'Northstar Energy Synthetic', amount: 95000, signedBy: '영업팀장 단독 서명' },
        { amendmentId: 'AMD-803', customer: 'Apex Manufacturing Synthetic', amount: 260000, signedBy: '대표이사 및 법무책임자 쌍방 서명 완료' },
      ],
    },
    syntheticDataCsv: `계약변경ID,고객사명,변경금액USD,서명현황,필수감사조치
AMD-801,Global Synthetic Logistics,145000,대표이사 단독 서명,법무책임자 결재 누락에 대한 PBC 증적 요청
AMD-802,Northstar Energy Synthetic,95000,영업팀장 단독 서명,통제 범위 확인 (10만달러 기준 미달 확인)
AMD-803,Apex Manufacturing Synthetic,260000,쌍방 서명 완료,발효일자 및 타임스탬프 일치성 검증`,
    steps: [
      '1단계: 합성 계약 변경 데이터와 통제 기준 금액($100,000)을 검토합니다.',
      '2단계: [역할], [목표], [부정 제약], [출력 표 스키마], [검증 규칙]을 포함한 구조화된 프롬프트를 작성합니다.',
      '3단계: 실제 임원 성명이나 비공개 파일이 노출되지 않도록 가명화 및 데이터 마스킹을 점검합니다.',
      '4단계: 프롬프트가 AMD-801을 잠재적 통제 미비점(Control Exception)으로 명확히 플래그하는지 확인합니다.',
    ],
    expectedDeliverables: [
      '부정 제약 조건이 명시된 구조화 프롬프트 텍스트 및 복사 가능한 PBC 감사 증적 요청 표.',
    ],
    rubric: [
      { dimension: '기준 및 범위 한정', max: 3, rubricText: '10만 달러 기준선과 이중 서명 요건을 프롬프트에 명확히 명시함.' },
      { dimension: '부정 제약 조건의 엄격성', max: 3, rubricText: '누락된 법무 서명을 자의적으로 추정하거나 준수된 것으로 환각하는 행위를 원천 금지함.' },
      { dimension: '출력 스키마의 정밀도', max: 2, rubricText: '필수 열(계약ID, 금액, 서명현황, 결재 누락 여부 등)을 갖춘 표 형식 출력 강제.' },
      { dimension: '데이터 프라이버시 준수', max: 2, rubricText: '엄격히 합성된 데이터와 마스킹된 메타데이터만을 활용함.' },
    ],
    testCases: [
      {
        id: 'TC-02-NORM',
        kind: 'normal',
        title: '정상 케이스: 10만 달러 기준 필터링',
        description: 'AMD-801($145k)과 AMD-803($260k)을 테스트 모집단으로 올바르게 분류합니다.',
        syntheticInput: { testAmount: 145000 },
        expectedBehavior: 'AMD-801에 대해 법무 결재 증적 제출을 요구함.',
      },
      {
        id: 'TC-02-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 기준선 근접 항목 ($95k)',
        description: '기준 금액에 근접한 AMD-802에 대해 쪼개기 계약이나 추가 변경 여부를 확인합니다.',
        syntheticInput: { testAmount: 95000 },
        expectedBehavior: '연관된 추가 계약 변경이 존재하는지 여부를 확인하는 지침 생성.',
      },
      {
        id: 'TC-02-FAIL',
        kind: 'failure',
        title: '실패 방지: 법무 승인 임의 추정 금지',
        description: 'AMD-801의 법무 서명 누락에 대해 "구두 승인이 있었을 것"이라고 환각하지 않도록 차단합니다.',
        syntheticInput: { amendmentId: 'AMD-801' },
        expectedBehavior: '[잠재적 통제 미비점 - 증적 누락] 경고를 명확히 출력함.',
      },
      {
        id: 'TC-02-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 결정론적 표 출력',
        description: '반복 실행 시에도 동일한 열 구조와 항목이 일관되게 생성되는지 검증합니다.',
        syntheticInput: { rerun: true },
        expectedBehavior: '출력 열 헤더의 오차 없는 재현성 보장.',
      },
    ],
    interactiveType: 'prompt_authoring',
  },

  {
    id: 'LAB-03',
    code: 'LAB-03',
    title: '수선유지비 vs 자본적 지출 판정 회계 메모 작성 (IAS 16 / ASC 360)',
    lessonIds: ['W01', 'W03'],
    domain: 'ACCOUNTING',
    stage: 'WORKFLOWS',
    minutes: 20,
    scenario: '합성 제조업체 "Alpha Precision Ltd"가 중앙 냉동기 오버홀에 142,000달러를 지출했습니다. 세부 청구 내역을 IAS 16(유형자산) 및 ASC 360 기준에 따라 검토하십시오. 자본화(자산 처리) 대상과 당기비용(수선비) 대상을 명확히 분리하고, 대체된 구 부품의 제거(Derecognition) 요건을 명시하며, 분개장 회계처리와 "증적 불충분" 시 유보 결론을 도출하십시오.',
    syntheticFixtureDescription: '3대 세부 항목으로 구성된 공급업체 인보이스 #INV-8821: 컴프레서 코어 모듈($64,000), 모터 권선 재생($38,000), 냉매 세척 및 가스켓 교체($40,000).',
    syntheticDataJson: {
      invoiceNumber: 'INV-8821',
      vendor: 'Thermal Dynamics Industrial Services (합성 업체)',
      totalAmount: 142000,
      assetDetails: {
        assetTag: 'FA-CHILLER-01',
        description: '공장 메인 흡수식 냉동기 1호기',
        originalCost: 400000,
        netBookValue: 120000,
        usefulLifeRemaining: '오버홀 전 기준 잔여 내용연수 3년',
      },
      lineItems: [
        { item: '컴프레서 코어 교체 모듈', cost: 64000, description: '고장난 2018년식 코어를 고효율 신형 유닛으로 전면 교체하여 설비 내용연수를 7년 연장하고 냉각 효율을 15% 개선함.' },
        { item: '모터 권선 및 로터 밸런싱', cost: 38000, description: '베어링 진동 발생 후 모터의 작동 RPM을 원래 공장 출하 시 사양으로 복구함.' },
        { item: '연례 냉매 세척 및 예방 정비 실링 키트', cost: 40000, description: '제조사 운영 프로토콜에 따라 12개월마다 주기적으로 수행해야 하는 일상적 예방 정비.' },
      ],
    },
    syntheticDataCsv: `비용항목,금액USD,기술적작업설명,회계기준판단근거,제안회계처리
컴프레서 코어 모듈,64000,내용연수 7년 연장 및 용량 15% 개선,IAS 16.13 구분 가능한 주요 부품의 대체,자본화 (구 부품 장부금액 제거 전제)
모터 권선 재생,38000,원래 공장 출하 성능으로 단순 복구,IAS 16.12 일상적인 수선 및 유지보수,당기비용 (수선유지비) 즉시 인식
냉매 세척 및 실링,40000,12개월 주기 정기 유지보수,IAS 16.12 정기 점검 및 소모품 교체,당기비용 (수선유지비) 즉시 인식`,
    steps: [
      '1단계: 3개 청구 항목을 IAS 16.12(일상적 유지보수)와 IAS 16.13(부품 대체) 기준으로 세부 분해합니다.',
      '2단계: 자본화 대상($64,000)과 당기비용 대상($78,000) 금액을 명확히 산출합니다.',
      '3단계: 대체된 구 컴프레서 장부가액의 제거(Derecognition) 회계처리 방안을 수립합니다.',
      '4단계: 차변/대변 분개 초안을 작성하고 감사 증적 검토 항목 3가지를 정리합니다.',
      '5단계: 공급업체 부품 원가 이력이 부족할 경우 "증적 불충분(Insufficient Evidence)" 의견을 낼 수 있도록 결론을 유보합니다.',
    ],
    expectedDeliverables: [
      '분개장 회계처리, 구 부품 제거 분석, 감사인 챌린지 체크리스트가 포함된 회계 기술 메모 초안.',
    ],
    rubric: [
      { dimension: '기준서 인용 및 적용 정밀도', max: 3, rubricText: 'IAS 16.12(유지보수)와 16.13(대체자본화) 기준을 혼동 없이 정확히 적용함.' },
      { dimension: '대체 자산 제거(Derecognition) 평가', max: 3, rubricText: '교체된 구 부품의 잔존 장부금액을 식별하여 자산에서 제거해야 함을 명시함.' },
      { dimension: '비판적 회계감사 시각', max: 2, rubricText: '전액 자본화 시도를 방어하고 증적 부족 시 유보 의견을 허용함.' },
      { dimension: '분개장 수치 정밀도', max: 2, rubricText: '건설중인자산/기계장치와 수선비 계정을 차변/대변 균형 있게 구성함.' },
    ],
    testCases: [
      {
        id: 'TC-03-NORM',
        kind: 'normal',
        title: '정상 케이스: 항목별 금액 분리 ($64k 자본화 / $78k 비용)',
        description: '학습자가 일괄 자본화나 일괄 비용처리 대신 정확한 분리 인식을 수행하는지 평가합니다.',
        syntheticInput: { total: 142000 },
        expectedBehavior: '컴프레서 $64k 자본화, 나머지 $78k 수선비 즉시 비용화 권고.',
      },
      {
        id: 'TC-03-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 구 부품의 장부가액 미분리 상태',
        description: '고정자산대장에 컴프레서 원가가 별도 분리되어 있지 않은 경우의 실무 처리 대안을 검증합니다.',
        syntheticInput: { separateOldCostKnown: false },
        expectedBehavior: '신규 대체원가를 기준으로 역사적 취득가액을 역산 추정하여 구 자산을 제거하도록 권고.',
      },
      {
        id: 'TC-03-FAIL',
        kind: 'failure',
        title: '실패 방지: 142,000달러 전액 자본화 차단',
        description: '일상적 유지보수 비용($78k)을 부당하게 자본화하려는 회계 오류를 엄격히 차단합니다.',
        syntheticInput: { proposedCap: 142000 },
        expectedBehavior: 'IAS 16.12 위반으로 즉시 검증 실패 처리.',
      },
      {
        id: 'TC-03-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 감사 조서 재현성',
        description: '재검토 시에도 동일한 회계 기준 인용과 분개 논리가 재현되는지 확인합니다.',
        syntheticInput: { auditReview: true },
        expectedBehavior: '조서의 논리적 추적 가능성 완전 유지.',
      },
    ],
    interactiveType: 'accounting_memo',
  },

  {
    id: 'LAB-04',
    code: 'LAB-04',
    title: '재현 가능한 투자 리서치 워크플로 및 무효화 기준 수립',
    lessonIds: ['W01', 'W02'],
    domain: 'INVESTING',
    stage: 'WORKFLOWS',
    minutes: 20,
    scenario: '합성 반도체 기업 "Apex Semiconductor"(APEX-SYN)에 대한 엄격한 투자 리서치 워크플로를 수행하십시오. [출처가 명확한 객관적 사실]과 [경영진의 일방적 주장], 그리고 [애널리스트의 주관적 해석]을 엄격히 분리하십시오. 잉여현금흐름(FCF) 전환율을 계산하고, 비정상적인 재고자산 급증을 분석하며, 파괴적인 약세 시나리오(Bear Case)와 3대 수치적 무효화 기준(Invalidation Triggers)을 설정하십시오.',
    syntheticFixtureDescription: '매출 24% 성장의 화려한 외형과 달리 재고자산 75% 급증 및 영업현금흐름 음수(-$45M)를 보이는 합성 재무제표 데이터.',
    syntheticDataJson: {
      ticker: 'APEX-SYN',
      companyName: 'Apex Semiconductor Systems (합성 기업)',
      fiscalYear: '2026 회계연도',
      metrics: {
        revenue: '12억 달러 (전년 대비 +24% 성장)',
        grossMargin: '52.0% (전년 대비 -300 bps 하락)',
        operatingIncome: '2억 1,000만 달러 (전년 대비 +12% 증가)',
        netIncome: '1억 6,500만 달러 (전년 대비 +10% 증가)',
        inventory: '4억 2,000만 달러 (전년 대비 +75% 급증)',
        accountsReceivable: '2억 8,000만 달러 (전년 대비 +42% 증가)',
        operatingCashFlow: '-4,500만 달러 (전년도 +1억 8,000만 달러에서 급락)',
        freeCashFlow: '-1억 2,500만 달러 (설비투자 $80M 반영)',
        daysSalesOfInventory: '194일 (전년도 128일에서 급증)',
      },
      managementGuidance: '경영진은 차세대 AI 가속기 고객 수요를 선제 확보하기 위한 전략적 웨이퍼 원자재 비축으로 재고가 증가했다고 설명함.',
    },
    syntheticDataCsv: `지표,전년도(FY2025),당해연도(FY2026),전년비증감,해석및리스크
매출액,$968M,$1200M,+24.0%,외형 성장 견고
매출총이익률,55.0%,52.0%,-300 bps,마진 압박 시작
당기순이익,$150M,$165M,+10.0%,회계상 장부 이익은 흑자
영업현금흐름,$180M,-$45M,음수 다이버전스,운전자본 급증으로 실제 현금 심각한 유출
재고자산,$240M,$420M,+75.0%,경고: 재고자산 회전일수가 128일에서 194일로 급증
잉여현금흐름(FCF),$110M,-$125M,심각한 현금 유출,순이익 대비 현금 전환율 -75%로 붕괴`,
    steps: [
      '1단계: 4분면 표를 작성합니다: [공시된 사실] vs [경영진 주장] vs [애널리스트 해석] vs [실행 권고사항].',
      '2단계: 운전자본 다이버전스를 분석합니다: 당기순이익은 흑자인데 영업현금흐름이 왜 -$45M으로 무너졌는가?',
      '3단계: 정밀한 약세 시나리오(Bear Case)를 설계합니다: 고객 취소나 평균판매단가(ASP) 하락 시 재고평가손실 규모는?',
      '4단계: 3대 투자 가설 무효화 기준(Invalidation Triggers)을 설정합니다: (예: 마진 48% 붕괴, 재고일수 200일 초과 등).',
    ],
    expectedDeliverables: [
      '현금 전환율 감사, 약세 시나리오, 3대 수치적 무효화 기준이 완비된 투자 리서치 메모.',
    ],
    rubric: [
      { dimension: '사실과 주장의 엄격한 분리', max: 3, rubricText: '공시된 GAAP 재무 데이터와 경영진의 가이던스 주장을 엄격히 구분함.' },
      { dimension: '현금흐름 전환율 정밀 분석', max: 3, rubricText: '운전자본 악화 요인을 짚어내고 순이익 대 FCF 괴리를 정확히 규명함.' },
      { dimension: '약세 시나리오의 치밀함', max: 2, rubricText: '재고 진부화 및 주문 취소에 따른 재무적 타격을 정밀 분석함.' },
      { dimension: '가설 무효화 기준의 측정가능성', max: 2, rubricText: '사전에 수치로 확약된 3가지 명확한 투자 철회 조건을 제시함.' },
    ],
    testCases: [
      {
        id: 'TC-04-NORM',
        kind: 'normal',
        title: '정상 케이스: 운전자본 위험 신호 탐지',
        description: '매출 성장률(24%) 대비 재고자산 증가율(75%)의 이상 급등을 감지하는지 테스트합니다.',
        syntheticInput: { inventoryGrowth: 75, revGrowth: 24 },
        expectedBehavior: '운전자본 압박 및 회전일수(194일) 급증을 주요 리스크로 지적함.',
      },
      {
        id: 'TC-04-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 경영진의 전략적 비축 주장 검증',
        description: '경영진의 주장을 무비판적으로 수용하지 않고 비판적 회의주의를 적용하는지 테스트합니다.',
        syntheticInput: { claim: '전략적 웨이퍼 비축' },
        expectedBehavior: '고객사 수주잔고(Backlog) 계약금 증빙 확인을 선결 과제로 요구함.',
      },
      {
        id: 'TC-04-FAIL',
        kind: 'failure',
        title: '실패 방지: 맹목적 매수 추천 차단',
        description: '심각한 현금 유출을 무시한 채 외형 매출 성장률만 보고 무조건 매수를 추천하는 실수를 차단합니다.',
        syntheticInput: { ignoreCashFlow: true },
        expectedBehavior: '신인의무 위반으로 즉시 제출 기각.',
      },
      {
        id: 'TC-04-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 스트레스 테스트 재현성',
        description: '재평가 시에도 변함없는 무효화 트리거 기준선이 유지되는지 확인합니다.',
        syntheticInput: { rerun: true },
        expectedBehavior: '가설 철회 기준의 완벽한 일관성 유지.',
      },
    ],
    interactiveType: 'investment_research',
  },

  {
    id: 'LAB-05',
    code: 'LAB-05',
    title: '월마감 내부통제 지연 알림 및 에스컬레이션 시뮬레이터',
    lessonIds: ['A01', 'A04'],
    domain: 'ACCOUNTING',
    stage: 'AUTOMATION',
    minutes: 20,
    scenario: '대화형 결정론적 월마감 통제 마감 기한 파이프라인을 실행하고 검증하십시오. 5개의 합성 내부통제 항목을 평가합니다. 시스템이 완료된 작업을 필터링하고, 담당자가 누락된 경우 총괄 관리자(Controller)에게 에스컬레이션하며, 가장 중요한 멱등성 키(Idempotency Key)를 사용하여 중복 재실행 시 이메일 중복 발송을 원천 억제하는 과정을 관찰하십시오!',
    syntheticFixtureDescription: '각기 다른 기한 경과일, 미배정 담당자, 중복 실행 방지 메커니즘을 포함한 5대 합성 월마감 통제 데이터.',
    syntheticDataJson: [
      { controlId: 'CTRL-101', name: '당좌예금 계정조정표 작성', owner: 'm.kim@synthetic-corp.com', dueDaysAgo: 1, status: 'Pending' },
      { controlId: 'CTRL-102', name: '유형자산 신규 취득 검토', owner: 's.jenkins@synthetic-corp.com', dueDaysAgo: 0, status: 'Complete' },
      { controlId: 'CTRL-103', name: '매출 컷오프 샘플링 검증', owner: 'm.kim@synthetic-corp.com', dueDaysAgo: 3, status: 'Pending' },
      { controlId: 'CTRL-104', name: '수기 분개(Top-Side JE) 승인', owner: null, dueDaysAgo: 2, status: 'Pending' },
      { controlId: 'CTRL-105', name: '관계회사 채권채무 대사 매트릭스', owner: 'd.park@synthetic-corp.com', dueDaysAgo: 2, status: 'In Progress' },
    ],
    syntheticDataCsv: `통제ID,통제항목명,담당자이메일,지연일수,현재상태,중요도
CTRL-101,당좌예금 계정조정표 작성,m.kim@synthetic-corp.com,1,Pending,High
CTRL-102,유형자산 신규 취득 검토,s.jenkins@synthetic-corp.com,0,Complete,Medium
CTRL-103,매출 컷오프 샘플링 검증,m.kim@synthetic-corp.com,3,Pending,High
CTRL-104,수기 분개(Top-Side JE) 승인,,2,Pending,High
CTRL-105,관계회사 채권채무 대사 매트릭스,d.park@synthetic-corp.com,2,In Progress,Medium`,
    steps: [
      '1단계: "자동화 배치 1차 실행"을 클릭하여 합성 통제 항목에 대해 일일 스케줄러를 가동합니다.',
      '2단계: 생성된 실행 로그를 확인합니다: 이미 완료된 CTRL-102는 발송 제외되었음을 확인합니다.',
      '3단계: 엣지 케이스 확인: 담당자가 누락된 CTRL-104가 회계총괄팀장 에스컬레이션 분기로 안전하게 우회되었는지 확인합니다.',
      '4단계: "즉시 중복 재실행 (Duplicate Batch)"을 클릭하여 네트워크 재시도나 중복 트리거 상황을 시뮬레이션합니다.',
      '5단계: 모든 알림이 [SKIPPED - 멱등성 키 이미 존재] 상태로 억제되어 중복 발송 수가 0건임을 확인합니다!',
    ],
    expectedDeliverables: [
      '트리거 처리, 담당자 누락 라우팅, 검증된 멱등성 억제 결과가 포함된 대화형 자동화 실행 로그.',
    ],
    rubric: [
      { dimension: '트리거 및 필터링 로직', max: 3, rubricText: '완료된 항목과 기한 미도래 항목을 정확히 발송 제외함.' },
      { dimension: '멱등성 보호 장치', max: 3, rubricText: '결정론적 해시 키를 통해 재실행 시 중복 알림이 원천 차단됨을 입증함.' },
      { dimension: '엣지 케이스 예외 라우팅', max: 2, rubricText: '담당자 누락 시 시스템 에러 대신 총괄 관리자 결재 분기로 안전하게 유도함.' },
      { dimension: '감사 로그 완전성', max: 2, rubricText: '타임스탬프, 키 값, 처리 상태 코드가 담긴 불변 감사 원장을 기록함.' },
    ],
    testCases: [
      {
        id: 'TC-05-NORM',
        kind: 'normal',
        title: '정상 케이스: 1일 지연 표준 알림',
        description: '기한이 1일 경과한 CTRL-101에 대해 정상 독촉 알림을 디스패치합니다.',
        syntheticInput: { controlId: 'CTRL-101' },
        expectedBehavior: 'm.kim@synthetic-corp.com 담당자에게 1건의 알림 발송.',
      },
      {
        id: 'TC-05-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 담당자 누락 시 에스컬레이션',
        description: '담당자 이메일이 없는 CTRL-104를 총괄 관리자 수신함으로 라우팅합니다.',
        syntheticInput: { controlId: 'CTRL-104' },
        expectedBehavior: '시스템 중단 없이 controller@synthetic-corp.com으로 안전하게 전달.',
      },
      {
        id: 'TC-05-FAIL',
        kind: 'failure',
        title: '실패 방지: 즉시 재실행 시 중복 이메일 폭탄 차단',
        description: '배치를 즉시 재실행했을 때 중복 이메일이 단 1건도 발송되지 않아야 합니다.',
        syntheticInput: { rerunImmediately: true },
        expectedBehavior: '멱등성 키 대조를 통해 100% 발송 억제 성공.',
      },
      {
        id: 'TC-05-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 멱등성 키 포맷 감사',
        description: '{RunDate}-{ControlId}-{DueDaysAgo} 형식의 결정론적 키 무결성을 검증합니다.',
        syntheticInput: { auditKey: true },
        expectedBehavior: '예상 키 스키마와 완벽 일치.',
      },
    ],
    interactiveType: 'flow_simulation',
  },

  {
    id: 'LAB-06',
    code: 'LAB-06',
    title: 'Power Automate 클라우드 결재 흐름 시각적 설계 시뮬레이션',
    lessonIds: ['A04', 'T05'],
    domain: 'ACCOUNTING',
    stage: 'AUTOMATION',
    minutes: 20,
    scenario: '"유형자산 처분 및 폐기 승인"을 위한 Power Automate 클라우드 흐름을 설계하고 시뮬레이션하십시오. 시각적 블록을 순서대로 배치합니다: SharePoint 트리거 → 조건 분기(장부가액 >= $10,000) → Teams 승인 요청 → SharePoint 상태 업데이트. 승인 타임아웃 예외 분기를 포함하여 3건의 합성 처분 요청에 대한 실행을 테스트하십시오.',
    syntheticFixtureDescription: '드래그 및 클릭 가능한 시각적 블록과 합성 SharePoint 자산 처분 항목 데이터.',
    syntheticDataJson: [
      { disposalId: 'DSP-01', assetTag: 'FA-SRV-99', nbv: 14500, status: 'Submitted', reason: '서버실 노후 장비 폐기' },
      { disposalId: 'DSP-02', assetTag: 'FA-DESK-12', nbv: 850, status: 'Submitted', reason: '파손 사무용 의자 폐기' },
      { disposalId: 'DSP-03', assetTag: 'FA-CHIL-04', nbv: 32000, status: 'Submitted', reason: '공장 리노베이션 설비 처분' },
    ],
    syntheticDataCsv: `처분요청ID,자산관리태그,순장부가액USD,현재상태,예상처리분기
DSP-01,FA-SRV-99,14500,Submitted,고액 자산 분기 (회계총괄팀장 Teams 정식 결재 필수)
DSP-02,FA-DESK-12,850,Submitted,소액 자산 자동 승인 (1만 달러 미만 기준 충족)
DSP-03,FA-CHIL-04,32000,Submitted,고액 자산 분기 (승인 타임아웃 48시간 지연 시뮬레이션)`,
    steps: [
      '1단계: 4대 핵심 액션을 순서대로 배치합니다: [SharePoint 트리거] → [조건: 장부가액 >= $10k] → [Teams 승인] → [SharePoint 상태 업데이트].',
      '2단계: 고액 자산 승인 분기 구성: 승인권자를 `controller@synthetic-corp.com`으로 지정합니다.',
      '3단계: 타임아웃 예외 분기 구성: 48시간 동안 무응답 시 `assistant-controller@synthetic-corp.com`으로 에스컬레이션합니다.',
      '4단계: 3건의 합성 요청에 대해 시뮬레이션 실행을 클릭하고 로그를 점검합니다.',
    ],
    expectedDeliverables: [
      '고액 수기 결재, 소액 자동 승인, 타임아웃 예외 경로가 모두 입증된 플로우 구성 스키마.',
    ],
    rubric: [
      { dimension: '흐름 아키텍처 및 순서성', max: 3, rubricText: '트리거, 조건문, 승인 카드를 논리적 순서에 맞게 올바르게 배열함.' },
      { dimension: '임계값 분기 정확성', max: 3, rubricText: '1만 달러 이상은 정식 승인으로, 미만은 즉시 자동 처리로 정확히 분기함.' },
      { dimension: '타임아웃 SLA 예외 처리', max: 2, rubricText: '결재 지연 시 워크플로가 중단되지 않고 대리 결재자에게 에스컬레이션됨.' },
      { dimension: 'DLP 및 사내 테넌트 거버넌스', max: 2, rubricText: '개인용 메일박스 대신 공식 사내 테넌트 커넥터를 사용함.' },
    ],
    testCases: [
      {
        id: 'TC-06-NORM',
        kind: 'normal',
        title: '정상 케이스: 고액 자산 처분 ($14.5k)',
        description: 'DSP-01 항목이 회계총괄팀장 Teams 승인 카드로 라우팅되는지 확인합니다.',
        syntheticInput: { disposalId: 'DSP-01' },
        expectedBehavior: 'Teams 승인 요청 디스패치 후 최종 승인 상태로 안전하게 업데이트.',
      },
      {
        id: 'TC-06-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 소액 자산 처분 ($850)',
        description: '1만 달러 미만인 DSP-02가 임원 승인을 우회하여 즉시 자동 승인되는지 검증합니다.',
        syntheticInput: { disposalId: 'DSP-02' },
        expectedBehavior: '불필요한 결재를 생략하고 SharePoint 상태를 자동 업데이트.',
      },
      {
        id: 'TC-06-FAIL',
        kind: 'failure',
        title: '실패 방지: 48시간 승인 타임아웃',
        description: '결재자가 부재중일 때 플로우가 영구 대기 상태에 빠지지 않는지 검증합니다.',
        syntheticInput: { timedOut: true },
        expectedBehavior: '48시간 타임아웃 분기로 대리 결재자에게 정상 이관.',
      },
      {
        id: 'TC-06-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 기승인 건 중복 방지',
        description: '이미 승인된 항목을 편집하더라도 중복 결재 카드가 뜨지 않는지 확인합니다.',
        syntheticInput: { alreadyApproved: true },
        expectedBehavior: '트리거 조건에서 조기 종료.',
      },
    ],
    interactiveType: 'power_automate_builder',
  },

  {
    id: 'LAB-07',
    code: 'LAB-07',
    title: '계정조정 차이 조사 및 원인 규명 에이전트 (Reconciliation Detective)',
    lessonIds: ['G01', 'T01'],
    domain: 'ACCOUNTING',
    stage: 'AGENTS',
    minutes: 25,
    scenario: '합성 은행 계정조정표 상의 18,450달러 차이 원인을 규명하는 ICFR 전용 탐정 에이전트를 구성하고 테스트하십시오. 읽기 전용 도구(원장 조회, 은행 입출금 내역 조회, 거래처 계약 조회)만 허용하고, 장부 쓰기 권한(전표 직접 기표)은 엄격히 차단하십시오. 최대 루프 반복 횟수를 5회로 제한하고 에이전트 루프를 실행한 후, 최종 인간 승인(HITL) 서명용 증적 보고서를 검토하십시오.',
    syntheticFixtureDescription: '총계정원장(#10100) 잔액 $1,420,500 대 은행 잔고증명서 $1,402,050. 미조정 차이 = $18,450.',
    syntheticDataJson: {
      accountNumber: '10100 - 당좌예금',
      asOfDate: '2026-09-30',
      glBalance: 1420500,
      bankBalance: 1402050,
      unreconciledVariance: 18450,
      syntheticToolsAvailable: [
        { name: 'query_gl_transactions', permission: 'READ_ONLY', description: '총계정원장 분개 전표를 일자 및 금액별로 조회합니다.' },
        { name: 'query_bank_clearing_feed', permission: 'READ_ONLY', description: '전자 은행 입출금 배치 및 해외 송금 전신환(SWIFT) 번호를 조회합니다.' },
        { name: 'lookup_vendor_payment_terms', permission: 'READ_ONLY', description: '거래처 계약 마스터 파일 및 지급 조건을 조회합니다.' },
        { name: 'post_adjusting_journal_entry', permission: 'WRITE', description: '총계정원장에 수정 분개 전표를 직접 기표합니다 (주의: 직무분리 원칙).' },
      ],
      hiddenVarianceRootCause: '합성 거래처(Synthetic Global Logistics)에 지급한 18,450달러 상당의 해외 송금 건(#WT-9022)이 원장에는 9월 29일에 기표되었으나, 국제 금융 결제일 휴무로 인해 은행에서는 10월 2일에 출금되었습니다. 이는 회계 오류나 횡령이 아닌 정상적인 기말 미결제 타임랙(Timing Difference)입니다.',
    },
    syntheticDataCsv: `거래ID,거래일자,시스템,금액USD,적요설명,처리상태
TX-8801,2026-09-29,총계정원장(GL),18450,해외송금 WT-9022 Synthetic Global Logistics,원장 기표 완료
TX-BANK-00,2026-09-30,은행통장,0,월말 기준 WT-9022 은행 미인출 상태,은행 미반영
TX-BANK-99,2026-10-02,은행통장,18450,SWIFT 정상 출금 완료 WT-9022,월말 후 정상 인출 (타임랙 항목)`,
    steps: [
      '1단계: 도구 권한 설정: "query_gl_transactions", "query_bank_clearing_feed", "lookup_vendor_payment_terms" 3대 읽기 도구를 선택합니다.',
      '2단계: 가드레일 통제: "post_adjusting_journal_entry"(원장 직접 기표) 권한을 반드시 해제합니다 (직무분리 원칙에 따라 에이전트의 원장 직접 수정은 원천 금지!).',
      '3단계: 최대 반복 횟수를 5회로 지정하고 종료 조건으로 "가설 신뢰도 90% 이상"을 설정합니다.',
      '4단계: 에이전트 시뮬레이션 가동: [목표] → [계획] → [도구 호출] → [관찰] → [상태 업데이트] 루프를 확인합니다.',
      '5단계: 최종 증적 보고서 검토: 에이전트가 9월 29일 송금이 10월 2일에 은행 결제된 "미결제 타임랙"임을 규명하고 최종 승인을 요청하는지 확인합니다.',
    ],
    expectedDeliverables: [
      '읽기 전용 보안 경계가 확립되고 조사 추적 로그가 감사 가능한 수준으로 보존된 에이전트 명세서.',
    ],
    rubric: [
      { dimension: '도구 권한 가드레일', max: 3, rubricText: '직무분리 원칙(SoD)을 준수하여 쓰기(Write) 권한을 완벽히 차단함.' },
      { dimension: '에이전트 루프 추론 논리', max: 3, rubricText: '가설 수립, 도구 호출 결과 관찰, 상태 업데이트 과정을 논리적으로 추적함.' },
      { dimension: '근본 원인 식별 정확도', max: 2, rubricText: '18,450달러 차이가 횡령이나 누락이 아닌 정상적인 결제 타임랙임을 정확히 규명함.' },
      { dimension: '인간 참여(HITL) 서명 체계', max: 2, rubricText: '에이전트 단독 처리를 배제하고 회계책임자의 최종 승인을 위한 완벽한 증적 조서를 마련함.' },
    ],
    testCases: [
      {
        id: 'TC-07-NORM',
        kind: 'normal',
        title: '정상 케이스: 결제 시차(타임랙) 원인 규명',
        description: '송금 배치 #WT-9022의 국제 SWIFT 결제일 시차를 정확히 규명하는지 테스트합니다.',
        syntheticInput: { variance: 18450 },
        expectedBehavior: '미달 예금 / 기말 미결제 송금 가설을 도출하고 10월 2일 거래와 대사함.',
      },
      {
        id: 'TC-07-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 에이전트 원장 쓰기 시도 차단',
        description: '에이전트가 스스로 수정 분개를 원장에 기표하려 할 때 보안 예외가 발생하는지 검증합니다.',
        syntheticInput: { attemptedTool: 'post_adjusting_journal_entry' },
        expectedBehavior: '보안 예외 발생: 에이전트에게 전표 직접 기표 권한을 부여하지 않음.',
      },
      {
        id: 'TC-07-FAIL',
        kind: 'failure',
        title: '실패 방지: 무한 루프 차단',
        description: '데이터가 불명확할 때 에이전트가 무한 루프에 빠지지 않고 5회에서 안전하게 정지하는지 확인합니다.',
        syntheticInput: { unresolvable: true },
        expectedBehavior: '최대 반복 횟수(5회) 도달 시 미해결 예외 보고서를 출력하고 정지.',
      },
      {
        id: 'TC-07-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 감사 증적 재현성',
        description: '동일한 도구와 데이터로 재실행 시 오차 없는 동일한 결론이 도출되는지 확인합니다.',
        syntheticInput: { rerun: true },
        expectedBehavior: '조사 결과의 완전한 재현성 유지.',
      },
    ],
    interactiveType: 'agent_investigator',
  },

  {
    id: 'LAB-08',
    code: 'LAB-08',
    title: '7대 모듈 엔터프라이즈 투자 리서치 OS 아키텍처 결정 기록(ADR)',
    lessonIds: ['S01', 'W02'],
    domain: 'INVESTING',
    stage: 'SYSTEMS',
    minutes: 30,
    scenario: '완전한 7대 모듈 엔터프라이즈 AI 투자 리서치 운영체제(OS) 아키텍처를 설계하십시오: [시장 정보 인텔리전스] → [투자 기회 레이더] → [심층 리서치 메모] → [포트폴리오 및 리스크 매트릭스] → [투자 전략 랩] → [의사결정 저널] → [CIO 최종 자본 배분]. 각 모듈별로 입력 계약, 갱신 주기, 결정론적 규칙, AI 역할, 인간 승인 게이트, 평가 지표를 정의하고 최종 아키텍처 결정 기록(ADR)을 내보내십시오.',
    syntheticFixtureDescription: '역량 사다리 매핑(자동화 vs 워크플로 vs 에이전트)과 거버넌스 계약을 포함한 7대 모듈 토폴로지 매트릭스.',
    syntheticDataJson: {
      systemTitle: '투자 리서치 운영체제 (Investment Research OS v1.0)',
      modules: [
        { id: 'MOD-1', name: '시장 정보 인텔리전스 (Market Intelligence)', stage: 'AUTOMATION', cadence: '매일 아침 06:00', aiRole: '거시 경제 감성 및 실적 컨퍼런스콜 녹취록 핵심 요약', deterministicRule: '엄격한 가격 알림 트리거 및 SEC 10-K 공시 원문 피드 수신', humanApproval: '없음 (읽기 전용 피드)' },
        { id: 'MOD-2', name: '투자 기회 레이더 (Opportunity Radar)', stage: 'AUTOMATION', cadence: '매주 1회', aiRole: '필터링 조건 충족 종목의 비즈니스 모델 요약', deterministicRule: 'ROIC > 15%, 부채비율(Debt/EBITDA) < 2.5배, FCF 수익률 > 5%', humanApproval: '관심 종목(Watchlist) 등록 시 리드 애널리스트 승인' },
        { id: 'MOD-3', name: '심층 리서치 메모 (Deep Research Memo)', stage: 'WORKFLOWS', cadence: '필요 시 수시 실행', aiRole: '5계층 리서치 메모 초안 작성 및 약세 시나리오/무효화 기준 도출', deterministicRule: '운전자본 괴리 및 잉여현금흐름 전환율 계산', humanApproval: '선임 애널리스트 정식 확약 서명 필수' },
        { id: 'MOD-4', name: '포트폴리오 & 리스크 매트릭스', stage: 'AGENTS', cadence: '격주 1회', aiRole: '다각적 스트레스 테스트 시나리오 시뮬레이션 (금리, 관세, 환율 충격)', deterministicRule: '단일 종목 최대 비중 10% 제한, 특정 섹터 최대 비중 25% 제한', humanApproval: '리스크 관리책임자(CRO) 정식 서명' },
        { id: 'MOD-5', name: '투자 전략 랩 (Strategy Lab)', stage: 'WORKFLOWS', cadence: '매월 1회', aiRole: '백테스트 가설 수립 및 팩터 분석 보고서 작성', deterministicRule: '워크포워드(Walk-Forward) 검증 및 샤프 지수 계산', humanApproval: '전략 투자위원회 승인' },
        { id: 'MOD-6', name: '의사결정 저널 (Decision Journal)', stage: 'AUTOMATION', cadence: '모든 매매 집행 시마다', aiRole: '매매 사후 회고록 및 가설 일치도 분석', deterministicRule: '매매 전 가설 원문의 불변 타임스탬프 암호화 해시 기록', humanApproval: '트레이더의 사전 확약 서명 필수' },
        { id: 'MOD-7', name: 'CIO 최종 자본 배분 (Capital Allocation)', stage: 'SYSTEMS', cadence: '분기별 1회', aiRole: '포트폴리오 리밸런싱 최적화 제안서 작성', deterministicRule: '현금 보유 비중 최소 10% 유지 하한선 준수', humanApproval: '최고투자책임자(CIO) 단독 재량 승인 (자동 매매 일체 금지)' },
      ],
    },
    syntheticDataCsv: `모듈ID,모듈명,단계,갱신주기,결정론적규칙,AI역할,인간승인게이트
MOD-1,시장 정보 인텔리전스,AUTOMATION,매일 06:00,가격 알림 및 공시 수집,녹취록 및 뉴스 요약,없음 (읽기 전용 피드)
MOD-2,투자 기회 레이더,AUTOMATION,매주 1회,ROIC>15% & FCF>5% 필터,스크리닝 종목 사업 모델 분석,관심 종목 편입 승인
MOD-3,심층 리서치 메모,WORKFLOWS,수시,현금 전환율 공식 계산,약세 시나리오 및 무효화 기준 도출,선임 애널리스트 정식 확약
MOD-4,포트폴리오 & 리스크,AGENTS,격주 1회,단일 종목 최대 10% 한도,시나리오 스트레스 테스트,리스크 책임자 정식 승인
MOD-5,투자 전략 랩,WORKFLOWS,매월 1회,샤프 지수 및 팩터 분석,가설 검증 및 리뷰,전략 투자위원회 승인
MOD-6,의사결정 저널,AUTOMATION,매매 시마다,불변 타임스탬프 해시 보존,사후 회고 분석,트레이더 사전 확약 서명
MOD-7,CIO 자본 배분,SYSTEMS,분기별,현금 보유 10% 하한선,리밸런싱 제안,CIO 단독 최종 승인 (자동 매매 금지)`,
    steps: [
      '1단계: 7대 모듈을 검토하고 각 모듈이 적절한 역량 단계(자동화 vs 워크플로 vs 에이전트 vs 시스템)에 매핑되었는지 점검합니다.',
      '2단계: AI의 자의적 판단을 방어하는 각 모듈의 결정론적 제약 규칙(포지션 한도, 현금 비중 하한선 등)을 확정합니다.',
      '3단계: 인간 승인 게이트를 점검합니다: 7번 모듈이 브로커 API를 통한 자동 주문 체결을 엄격히 금지하는지 확인합니다.',
      '4단계: 시스템 건강성을 측정하는 핵심 평가 지표(가설 무효화 적중률, 증적 기록 완전성 등)를 수립합니다.',
      '5단계: 최종 아키텍처 결정 기록(ADR)을 생성하고 마크다운/JSON으로 내보냅니다.',
    ],
    expectedDeliverables: [
      '7대 모듈의 계약, 보안 경계, 거버넌스 프로토콜이 기술된 내보내기 가능한 아키텍처 결정 기록(ADR).',
    ],
    rubric: [
      { dimension: '시스템 모듈화 완성도', max: 3, rubricText: '운영체제를 명확한 데이터 계약을 갖춘 7대 독립 모듈로 체계화함.' },
      { dimension: '역량 사다리 매핑 정밀도', max: 3, rubricText: '각 모듈을 워크플로, 자동화, 에이전트, 시스템 단계에 올바르게 배치함.' },
      { dimension: '거버넌스 및 인간 승인 게이트', max: 2, rubricText: 'CIO의 배타적 재량권을 보장하고 자동 매매 위험을 완벽히 차단함.' },
      { dimension: 'ADR 문서화 완전성', max: 2, rubricText: '맥락, 결정 사항, 결과, 알려진 한계점을 모두 포괄하여 문서화함.' },
    ],
    testCases: [
      {
        id: 'TC-08-NORM',
        kind: 'normal',
        title: '정상 케이스: 7대 모듈 경계 매핑',
        description: '7개 모듈 전체에 대해 정의된 계약과 갱신 주기가 존재하는지 검증합니다.',
        syntheticInput: { moduleCount: 7 },
        expectedBehavior: '완전한 엔드투엔드 시스템 아키텍처 토폴로지 생성.',
      },
      {
        id: 'TC-08-EDGE',
        kind: 'edge',
        title: '엣지 케이스: 무단 자동 매매 원천 차단',
        description: '7번 모듈에 증권사 API 자동 매매 권한이 부여되지 않도록 차단하는지 테스트합니다.',
        syntheticInput: { autoTradeEnabled: false },
        expectedBehavior: '인간 CIO 독점 집행 장벽을 엄격히 강제함.',
      },
      {
        id: 'TC-08-FAIL',
        kind: 'failure',
        title: '실패 방지: 단일 거대 프롬프트로 일원화 시도 기각',
        description: '7대 모듈을 분리하지 않고 단 하나의 거대 프롬프트로 퉁치려는 부실 설계를 걸러냅니다.',
        syntheticInput: { monolithic: true },
        expectedBehavior: '설계 기각: 책임 분리와 감사 추적 불가능으로 검증 실패.',
      },
      {
        id: 'TC-08-RERUN',
        kind: 'rerun',
        title: '재실행 일관성: 내보낸 ADR 문서 검증',
        description: '재실행 시에도 필수 항목이 모두 포함된 일관된 ADR 문서가 생성되는지 확인합니다.',
        syntheticInput: { exportAdr: true },
        expectedBehavior: '유효한 마크다운/JSON ADR 페이로드 생성.',
      },
    ],
    interactiveType: 'architecture_adr',
  },
];
