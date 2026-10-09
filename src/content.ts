export const LINKS: Record<"demo" | "github" | "contact", string | null> = {
  demo: null,
  github: "https://github.com/STiTy-team",
  contact: null,
};

export const copy = {
  skip: "본문으로 건너뛰기",
  nav: { why: "연구 배경", how: "작동 방식", events: "현장", docs: "개발 문서" },
  cta: {
    demo: "라이브 데모 열기",
    code: "GitHub에서 코드 보기",
    contact: "팀에 연락하기",
  },
  hero: {
    label: "SKKAI Speech AI session",
    title: ["말이 끝나기 전에 통역하는", "실시간 동시통역 시스템"],
    name: "STiTy",
    body: "서로 언어가 다르더라도, 언어 장벽 없이 실시간으로 소통하는 미래를 꿈꿔요.",
    facts: [
      { value: "0.5초 미만", label: "목표 지연" },
      { value: "재수정 없음", label: "한 번 뜬 자막은 그대로" },
      { value: "자동 감지", label: "버튼 없이 대화와 언어를 알아서" },
    ],
    scroll: "스크롤해서 데모 보기",
  },
  story: [
    {
      label: "DEMO · 시작",
      title: "언어 두 개만 고르면 시작해요.",
      body: "버튼을 누르지 않아도, 말이 끝났다고 알리지 않아도 돼요. 대화와 언어를 STiTy가 알아서 감지해요.",
    },
    {
      label: "DEMO · 인식",
      title: "말이 끝나기 전에 글자가 나와요.",
      body: "아직 인식 중인 글자는 흐리게 먼저 떠요. 이미 뜬 글자는 자리가 바뀌지 않고, 새 글자는 끝에만 붙어요.",
    },
    {
      label: "DEMO · 커밋",
      title: "의미가 서면 바로 확정하고 번역해요.",
      body: "모델이 의미 경계에서 <SEG> 토큰을 내는 순간 구절이 확정돼요. 확정된 구절에는 곧바로 번역이 붙고, 상대는 소리로도 들을 수 있어요.",
    },
    {
      label: "DEMO · 대화",
      title: "상대 말도 같은 방식으로 와요.",
      body: "내 말은 오른쪽 파란 말풍선, 상대 말은 왼쪽 회색 말풍선이에요. 원문 아래에 번역이 붙어서, 둘 다 자기 언어로 읽어요.",
    },
    {
      label: "DEMO · 발표",
      title: "발표에서는 자막 화면이 돼요.",
      body: "같은 서버에 웹 자막 화면을 붙이면, 발표자의 말이 언어마다 한 줄씩 자막으로 흘러요. 프로젝터에 띄워 쓰면 돼요.",
    },
  ],
  modes: [
    { name: "스피커", body: "기기 하나로 같이 듣는 방식이에요. 번역이 스피커로 나와요." },
    { name: "이어폰", body: "한 사람이 이어폰을 끼고 상대 말의 번역을 들어요." },
    { name: "둘 다", body: "두 사람 모두 이어폰을 끼고 서로의 번역을 들어요." },
  ],
  langsLabel: "앱에서 고를 수 있는 언어",
  langs: ["한국어", "영어", "일본어", "중국어", "스페인어"],
  partial: {
    label: "증분 디코딩 · 들어온 오디오 전체를 매번 다시 읽어요",
    steps: [
      ["t₁", "안"],
      ["t₂", "안녕하세요"],
      ["t₃", "안녕하세요 반갑습니다"],
    ],
  },
  speed: {
    label: "말이 끝난 뒤 다음 말이 나오기까지",
    rows: [
      { name: "사람 사이 대화", value: 0.2, text: "약 0.2초", tone: "human" },
      { name: "STiTy 목표", value: 0.5, text: "0.5초 미만", tone: "stity" },
      { name: "상용 회의용 STT", from: 3, value: 5, text: "3~5초", tone: "other" },
    ],
    source: "대화 간격: Stivers 외, PNAS 2009. 상용 STT 지연: 팀 조사.",
  },
  speakers: {
    mine: "나",
    mineLang: "한국어로 말해요",
    peer: "상대",
    peerLang: "영어로 말해요",
  },
  stagePhoto: "IBM Qiskit Fall Fest 2025 with SKKU, 무대 옆 모니터에 뜬 영어 자막",
  phone: {
    setupTitle: "누구와 대화하나요?",
    mine: "내 언어",
    theirs: "상대 언어",
    korean: "한국어",
    english: "영어",
    listen: "듣는 방식",
    modes: ["스피커", "이어폰", "둘 다"],
    start: "시작하기",
    chips: "한국어 → 영어 · 스피커",
    live: "듣는 중",
    stop: "대화 끝내기",
    stageTitle: "실시간 자막",
  },
  why: {
    label: "BACKGROUND · 요구사항 분석",
    title: "실시간 대화는 얼마나 빨라야 할까요?",
    lead: "실제 대화에서 말과 말 사이 간격은 약 200ms예요. 상용 회의 기록용 STT는 3~5초 지연을 피하기 어렵고, 말이 이어지면 출력을 통째로 다시 써요.",
    p1: "사람은 상대 말이 끝나고 약 0.2초 안에 대답해요.",
    p1a: "주말에 뭐 했어요?",
    p1b: "등산 갔어요.",
    p2: "상용 STT는 번역이 끝나기까지 3~5초가 걸려요. 그사이 대화가 멈춰요.",
    sfx: "째깍 째깍",
    p3: "말이 이어지면 이미 뜬 번역이 통째로 바뀌어요. 읽던 사람은 헷갈려요.",
    rewrite: [
      ["지금", "Right now"],
      ["지금 갈게", "I'm on my way"],
    ],
    reqs: [
      { label: "요구조건 1", title: "0.5초 미만의 지연" },
      { label: "요구조건 2", title: "출력 고정성 (재수정 없음)" },
    ],
    source: "대화 간격: Stivers 외, PNAS 2009. 상용 STT 지연: 팀 조사.",
  },
  goals: {
    label: "GOALS",
    title: "두 가지 요구사항을 지키며, 세 가지 목표로.",
    items: [
      ["스트리밍 네이티브", "처음부터 스트리밍으로 동작하는 음성 인식 모델 위에서, 입력부터 출력까지 전 구간을 실시간으로 처리해요."],
      ["분절 자립성", "의미 경계 판정을 모델이 직접 하도록 학습해요. 외부 규칙 없이도 지연과 고정성을 지켜요."],
      ["지연과 번역 품질을 함께", "지연을 낮추면서 인식과 번역 품질도 함께 끌어올리고, 여러 언어에서 검증해요."],
    ],
  },
  how: {
    label: "METHODOLOGY",
    title: "모델이 직접 <SEG>를 내는 순간이 곧 커밋이에요.",
    lead: "의미 경계에 <SEG> 토큰을 넣은 데이터로 지도 파인튜닝했어요. 외부 규칙 없이, 토큰 한 번으로 커밋을 결정해요.",
    pipeline: [
      ["Audio Input", "실시간 음성"],
      ["Chunks", "짧은 조각으로"],
      ["Streaming ASR", "흘려 받으며 인식"],
      ["<SEG>", "커밋 판정"],
      ["교정 + 번역", "문맥 반영"],
      ["화면 / TTS", "자막과 음성"],
    ],
    original: {
      tag: "RULE-BASED",
      title: "온점이나 긴 무음이 나와야 커밋",
      rows: [
        { mark: ".", note: "온점 감지, 커밋" },
        { mark: "…(무음)", note: "무음 감지, 커밋" },
      ],
    },
    finetuned: {
      tag: "MODEL-BASED",
      title: "<SEG> 토큰을 내면 바로 커밋",
      mark: "<SEG>",
      note: "SEG 생성, 즉시 커밋",
      sub: "VAD나 문장부호 없이 토큰 한 번으로 결정해요.",
    },
    sentence: ["학교 가는 길에 비가 내렸어요", "그래서 우산을 챙겼어요"],
    priorityLabel: "커밋 정책 우선순위",
    priority: ["1순위 <SEG> 토큰", "2순위 VAD 침묵", "3순위 종결부호"],
    translate: {
      title: "끊어도 문맥은 이어서 번역해요.",
      body: "<SEG>로 나뉜 문장도 앞 문맥을 함께 넘겨서 번역해요. 오인식 교정과 번역을 한 번에 처리해서 빠르고 일관돼요.",
      flow: [
        ["ASR 인식 결과", "오인식 후보 포함"],
        ["문맥을 담은 한 번의 호출", "오인식 교정 + 번역"],
        ["교정된 자막 · 번역 결과", ""],
      ],
    },
  },
  events: {
    label: "IN THE FIELD",
    title: "실제 자리에서 써 봤어요.",
    lead: "1:1 대화는 휴대폰 앱으로, 발표는 프로젝터 자막으로 써요.",
    items: [
      {
        title: "성균관대 영어 시사토론 중앙동아리 Time 정기 세션",
        body: "발표자의 한국어가 슬라이드 아래에 영어 자막으로 떴어요.",
        alt: "강의실 스크린에 발표 슬라이드가 떠 있고, 그 아래에 한국어 문장과 영어 번역 자막이 함께 떠 있다.",
      },
      {
        title: "IBM Qiskit Fall Fest 2025 with SKKU",
        body: "무대 옆 모니터에 발표 내용이 영어 자막으로 떴어요.",
        alt: "행사 무대 옆 모니터에 영어 자막이 떠 있고, 발표자들이 단상에 서 있다. 얼굴은 흐리게 처리됐다.",
      },
    ],
    timeline: [
      ["25-2학기", "Time 정기세션, IBM Qiskit Fall Fest에서 실사용"],
      ["26-1학기", "음성 전문 스타트업 MAGO 협업 네트워킹, URP 연계 학술연구"],
    ],
  },
  invite: {
    title: "다음 행사에 STiTy를 띄워 보세요.",
    lead: "한국어와 영어가 섞이는 발표, 세미나, 교류 모임에 맞춰 다듬었어요. 데모로 먼저 들어 보고, 필요하면 팀에 연락해 주세요.",
  },
  foot: "성균관대학교 SKKAI Speech AI 세션에서 만들었어요.",
};

export const EVENT_META = [
  { img: "assets/event-1.webp", date: "2025-11-06", label: "2025.11.06" },
  { img: "assets/event-2.webp", date: "2025-11-21", label: "2025.11.21" },
];

export const CONVERSATION = {
  peer1: {
    text: "Hi! I heard STiTy can translate our conversation in real time. Is that right?",
    trans: "안녕하세요! STiTy가 우리 대화를 실시간으로 번역해 준다고 들었어요. 맞나요?",
  },
  mine: {
    text: "네, 맞아요. 제가 한국어로 말하면 바로 영어로 들려드려요.",
    trans: "Yes, that's right. When I speak in Korean, you hear it in English right away.",
  },
  peer2: {
    text: "That's amazing. So we can talk naturally without an interpreter?",
    trans: "정말 놀랍네요. 그럼 통역사 없이 자연스럽게 대화할 수 있는 거네요?",
  },
};
