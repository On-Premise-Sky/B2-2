/* config.js: 웹 페이지에 표시되는 내용을 모아둔 파일 */

const SITE_CONFIG = {
  /* 브라우저 탭 제목 / 검색 설명 */
  meta: {
    title: '김영운 | Portfolio',
    description: '김영운의 포트폴리오 웹사이트입니다.', 
  },

  /* 네비게이션 */
  nav: {
    logoText: 'Portfolio',
  },

  /* Hero(인사말, CTA 버튼) */
  hero: {
    greeting: '환영합니다.',
    title: '김영운의 포트폴리오',
    role: '디지털 전환을 넘어, 실질적인 비즈니스 가치를 창출하는 AX 컨설턴트입니다.', 
    // [BONUS 2] 타이핑 효과로 번갈아 표시할 문구 목록
    typingPhrases: [
      'AX 컨설턴트', 
      'AI 서비스 기획자', 
      '마케팅 사이언티스트', 
    ],
    description: 'AX Consultant: Driving Business Value beyond Digital Transformation', 
    primaryCta: { label: '프로젝트 보기', href: '#projects' },
    secondaryCta: { label: '문의하기', href: '#contact' },
  },

  /* About(자기소개) */
  about: {
    lead: '디지털 전환을 넘어, 실질적인 비즈니스 가치를 창출하는 AX 컨설턴트',
    image: {
      src: 'images/김영운.jpg',
      alt: '프로필 사진', // 이미지 내용을 설명하는 문장
    },
    // 주요 경력
    paragraphs: [
      '직장 경력: Ernst & Young AI 컨설팅 팀 / KoDATA(한국평가데이터) 리서치 팀',
      '주요 프로젝트: 하나증권 옴니버스 계좌 타겟 MTS 개선/ BNK금융그룹 모바일 앱 리뷰 분석 시스템',
    ],
    // 핵심 정보
    facts: [
      { label: '학교', value: '경희대학교' },
      { label: '전공', value: '경영학, 수학, 한국어학' }, 
      { label: '관심 분야', value: 'Fin-Tech, Mobility, Smart City' }, 
      { label: '이메일', value: 'k.theodore.yw@gmail.com' }, 
    ],
  },

  /* Awards(수상경력) */
  awards: {
    lead: '공모전·해커톤·경진대회에서 기획과 개발로 증명한 수상경력입니다.',
    // 항목 1개 = 수상 1건. 화면에서는 year 기준으로 묶여 최신 연도부터 표시됨
    // prize 값(대상 / 최우수상 / 우수상 / 장려상 / 동상 / 입선)에 따라 배지 색이 달라짐
    items: [
      { year: 2026, title: '하나 청년 금융인재 양성 프로젝트', prize: '최우수상', description: 'AI 기반 외국인 옴니버스 투자 활성화 솔루션 기획 및 개발' },
      { year: 2025, title: 'BNK 금융그룹 디지털 혁신 챌린지 해커톤', prize: '우수상', description: 'AI Agent 기반 모바일 뱅킹 App 리뷰 수집/분석/관리 자동화 서비스 개발' },
      { year: 2025, title: '한양대학교 전국 대학생 SW 아이디어톤', prize: '최우수상', description: '한국어 교육 이미지 학습 콘텐츠 생성 AI Agent 서비스 개발 및 사업 기획' },
      { year: 2025, title: '서울특별시 디지털 공간정보 활용 공모전', prize: '우수상', description: '서울특별시 교통량 및 인프라를 고려한 스마트 버스 정류장 최적 입지 분석 모델 개발' },
      { year: 2025, title: '경기도 경제과학진흥원 AI 전문인력 양성과정 경연대회', prize: '대상', description: '한국풍 웹툰 배경 이미지 생성 AI Agent 시스템 기획 및 개발' },
      { year: 2025, title: '신한은행 헤이영 캠퍼스 아이디어 경진대회(금융상품 설계 부문)', prize: '우수상', description: '대학생 맞춤 체크카드 신상품 기획' },
      { year: 2025, title: '디만트코리아 오티콘챌린지', prize: '최우수상', description: 'AI 기반 청각정보처리장애(APD) 및 소리 처리 솔루션 기획' },
      { year: 2025, title: 'PMI한국챕터 대학생 프로젝트 경연대회', prize: '대상', description: '고립/은둔 청년 사회성 향상을 위한 디지털 치료제 개발 프로젝트 기획 및 관리 방안 계획' },
      { year: 2025, title: '화성시 공공디자인 공모전', prize: '동상', description: '장애인을 위한 스마트 버스 정류장 기획 및 유니버셜 디자인' },
      { year: 2025, title: '한경국립대학교 전국 장애/비장애 대학생 창업경진대회', prize: '우수상', description: '장애인을 위한 스마트 버스 정류장 사업 기획' },
      { year: 2024, title: '방송통신위원회 위치정보 우수 비즈니스모델 공모전', prize: '우수상', description: 'PV-BSS 통합형 스마트폴 제품 개발 및 사업 기획' },
      { year: 2024, title: '한국정보산업연합회 한이음 ICT 멘토링 공모전', prize: '장려상', description: '부산항 항만 물동량 예측 및 항만 운영 관리 대시보드 개발' },
      { year: 2024, title: '한국연구재단 데이터과학 논술대회', prize: '입선', description: '서울시 태양광 발전량 예측 및 PV-BSS 스마트폴 최적 입지 선정' },
      { year: 2024, title: '알텐코리아 모빌리티 설계 아이디어 공모전', prize: '최우수상', description: '환자 및 구급대원 모두의 편의와 안전성을 향상시킨 통합형 구급차 설계' },
      { year: 2024, title: '인천시 스마트도시디자인 공모전', prize: '동상', description: 'PV-BSS 통합형 스마트 버스 정류장 기획 및 디자인' },
      { year: 2024, title: '기아자동차 PBV 아이디어 공모전(비즈니스 부문)', prize: '대상', description: '장애인 콜택시, 펫 택시, 공항 택시로 활용 가능한 Coexistence Mobility 기획' },
      { year: 2024, title: 'EY 한영 대학생 사업계획 경진대회', prize: '최우수상', description: '시니어 펫 시터 매칭 플랫폼 사업 기획' },
      { year: 2024, title: 'Microsoft AI Challenge for Biodiversity', prize: '우수상', description: '꿀벌 감소 영향력 요인 분석 말벌 퇴치 스마트 양봉 시스템 기획 및 개발' },
      { year: 2023, title: '한국데이터산업진흥원 데이터안심구역 경진대회', prize: '우수상', description: '외국인 특화 은행점포 기획 및 최적입지 분석' },
      { year: 2023, title: '동대문구 공공데이터 활용 정책 아이디어 공모전', prize: '최우수상', description: '편의점 활용 폐의약품 회수/처리 플랫폼 기획 및 최적입지 분석' },
      { year: 2023, title: '한국지능정보사회진흥원 AI 허브 개방 데이터 아이디어 경진대회', prize: '장려상', description: 'IPTV 기반 디지털 휴먼을 활용한 홈뱅킹 서비스 기획' },
      { year: 2023, title: '게임물관리위원회 게임정책연구활성화 논문 공모전', prize: '대상', description: '‘게임의 환경적 영향을 고려한 등급분류 및 사후관리에 대한 제언’ 논문 작성 및 투고' },
      { year: 2022, title: 'DMC 빅데이터 아이디어 오디션', prize: '최우수상', description: 'MZ세대 맞춤 중소기업 추천 대시보드 기획 및 개발' },
      { year: 2020, title: '에듀윌 대학 연합학술제', prize: '우수상', description: '변리사 자격증 신사업 전략 기획' },
    ],
  },

  /* Skills(기술 스택 목록) */
  skills: {
    lead: '사용할 수 있는 기술을 분야별로 정리했습니다.', 
    // 카테고리 1개 = 카드 1개
    categories: [
      { category: 'AI', items: ['RAG', 'Vision', 'NLP', 'Claude Code'] }, 
      { category: 'Data', items: ['Python', 'SQL', 'GIS', 'Tableau'] }, 
      { category: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Notion', 'Figma', 'MS Office'] }, 
    ],
  },

  /* Projects(GitHub API 연동) */
  projects: {
    lead: 'Codyssey 과정에서 수행한 프로젝트입니다.', 
    githubUsername: 'ktheodoreyw',
    excludeForks: true, // true: fork 한 저장소는 목록에서 제외
    maxRepos: 12, // 화면에 표시할 최대 저장소 수
    sort: 'updated', // 정렬 기준: updated | created | pushed | full_name
  },

  /* Contact(문의 폼) */
  contact: {
    lead: '궁금한 점이 있다면 편하게 메시지를 남겨 주세요.',
    successMessage: '메시지를 보냈습니다. 확인 후 답장드리겠습니다.',
    // [BONUS 3] Formspree 엔드포인트
    formspreeEndpoint: 'https://formspree.io/f/xrpbpaow',
  },

  /* Footer(저작권, 소셜 링크) */
  footer: {
    copyrightName: '김영운', 
    // iconClass 는 Font Awesome 클래스명(https://fontawesome.com/search?o=r&m=free)
    socialLinks: [
      { label: 'GitHub', url: 'https://github.com/ktheodoreyw', iconClass: 'fa-brands fa-github' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/yeong-woon-kim-86463a2a4/', iconClass: 'fa-brands fa-linkedin' },
    ],
  },

  /* 보너스 과제 ON/OFF */
  features: {
    languageFilter: true, // [BONUS 1] 언어별 프로젝트 필터링
    typingEffect: true, // [BONUS 2] Hero 타이핑 효과
    // [BONUS 3] 폼 실제 전송
    systemTheme: true, // [BONUS 4] 시스템 다크 모드 감지
  },
};
