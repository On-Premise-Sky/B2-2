/* =====================================================================
 * main.js — 상태(state) · 이벤트 · 렌더링 로직
 * ---------------------------------------------------------------------
 * 모든 기능은 같은 흐름을 따릅니다.
 *
 *   사용자 이벤트  →  setState() 로 상태 변경  →  render 함수가 DOM 업데이트
 *
 * 목차
 *   0. 상수 / 설정값
 *   1. STATE (상태 객체)
 *   2. DOM 헬퍼 & 요소 캐시
 *   3. setState — 상태 변경의 단일 통로
 *   4. 정적 콘텐츠 렌더링 (config.js → DOM)
 *   5. 테마(다크 모드)                 + [BONUS 4] 시스템 다크 모드 감지
 *   6. 네비게이션 (햄버거 메뉴, 부드러운 스크롤)
 *   7. 스크롤 (네비게이션 스타일, 스크롤 탑 버튼)
 *   8. 스크롤 애니메이션 (Intersection Observer)
 *   9. Projects — GitHub API 연동      + [BONUS 1] 언어별 필터링
 *  10. Contact 폼 유효성 검사          + [BONUS 3] Formspree 실제 전송
 *  11. [BONUS 2] Hero 타이핑 효과
 *  12. 초기화 (이벤트 연결)
 * ===================================================================== */

'use strict';

/* =====================================================================
 * 0. 상수 / 설정값  (README 에 명시한 기준값)
 * ===================================================================== */
const NAV_SCROLL_THRESHOLD = 60; // px — 이 이상 스크롤하면 네비게이션 배경색 변경
const TOP_BUTTON_THRESHOLD = 300; // px — 이 이상 스크롤하면 스크롤 탑 버튼 표시
const REVEAL_THRESHOLD = 0.2; // Intersection Observer 임계값 (요소의 20% 가 보이면 등장)
const THEME_STORAGE_KEY = 'ktheodoreyw-theme'; // localStorage 키
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILTER_ALL = 'All';
const NO_LANGUAGE_LABEL = '기타'; // language 가 null 인 저장소의 표시 이름

// 수상 등급 → 배지 스타일 이름. 배열 순서 = 요약(summary)에 표시되는 순서
const PRIZE_TIERS = [
  { prize: '대상', tier: 'grand' },
  { prize: '최우수상', tier: 'top' },
  { prize: '우수상', tier: 'high' },
  { prize: '장려상', tier: 'merit' },
  { prize: '동상', tier: 'merit' },
  { prize: '입선', tier: 'merit' },
];

// 구조분해 할당: config.js 의 SITE_CONFIG 객체에서 필요한 값만 꺼내 씀
const { meta, nav, hero, about, awards, skills, projects, contact, footer, features } = SITE_CONFIG;

/* =====================================================================
 * 1. STATE — 화면을 결정하는 모든 값을 한 객체에 모음
 * ===================================================================== */
const state = {
  // 흐름 ①: 테마 토글 → theme 변경 → 전체 색상 변경
  theme: {
    mode: 'light', // 'light' | 'dark'
    source: 'default', // 'user'(직접 선택, 저장됨) | 'system'(OS 설정) | 'default'
  },
  // 흐름 ②: 햄버거 클릭 / 스크롤 → ui 변경 → 메뉴·헤더·탑 버튼 변경
  ui: {
    menuOpen: false,
    navScrolled: false,
    showTopButton: false,
  },
  // 흐름 ③: API 호출 → projects 변경 → Projects 섹션 변경
  projects: {
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error' | 'empty'
    items: [], // GitHub 저장소 배열
    errorMessage: '',
    filter: FILTER_ALL, // [BONUS 1] 현재 선택된 언어 필터
  },
  // 흐름 ④: 폼 입력/제출 → form 변경 → 에러 메시지·성공 메시지 변경
  form: {
    values: { name: '', email: '', message: '' },
    errors: { name: '', email: '', message: '' },
    status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
    statusMessage: '',
  },
};

/* =====================================================================
 * 2. DOM 헬퍼 & 요소 캐시
 * ===================================================================== */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const dom = {
  root: document.documentElement,
  header: $('#site-header'),
  navMenu: $('#nav-menu'),
  hamburger: $('#hamburger'),
  themeToggle: $('#theme-toggle'),
  themeIcon: $('#theme-icon'),
  scrollTopButton: $('#scroll-top'),
  projectFilters: $('#project-filters'),
  projectsView: $('#projects-view'),
  form: $('#contact-form'),
  submitButton: $('#submit-btn'),
  formStatus: $('#form-status'),
};

// innerHTML 에 외부 데이터(GitHub 응답 등)를 넣기 전, HTML 특수문자를 무력화 (XSS 방지)
const escapeHTML = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const setText = (selector, text) => {
  const element = $(selector);
  if (element && text) element.textContent = text;
};

/* =====================================================================
 * 3. setState — 상태 변경의 단일 통로
 * ---------------------------------------------------------------------
 * 상태는 반드시 이 함수로만 바꿉니다. 상태가 바뀌면 그 조각(slice)을
 * 담당하는 render 함수가 자동으로 호출되어 화면이 상태와 항상 일치합니다.
 * (React 의 setState → re-render 와 같은 개념)
 * ===================================================================== */
const setState = (slice, patch) => {
  state[slice] = { ...state[slice], ...patch }; // 1) 상태 변경
  renderers[slice](); // 2) 해당 상태를 그리는 함수 실행
};

/* =====================================================================
 * 4. 정적 콘텐츠 렌더링 — config.js 의 내용을 HTML 뼈대에 채워 넣음
 * ===================================================================== */
const getPrizeTier = (prize) => PRIZE_TIERS.find((item) => item.prize === prize)?.tier ?? 'merit';

// 수상 배열 → { 2025: [...], 2024: [...] } 형태로 연도별 묶음 (reduce)
const groupAwardsByYear = (items) =>
  items.reduce((groups, award) => {
    (groups[award.year] ??= []).push(award);
    return groups;
  }, {});

const renderAwards = () => {
  const { lead, items = [] } = awards;
  setText('#awards-lead', lead);

  // ① 등급별 건수 요약 — 0건인 등급은 표시하지 않음
  const countByPrize = (prize) => items.filter((award) => award.prize === prize).length;
  const summaryItems = [
    { label: '전체 수상', count: items.length, tier: 'total' },
    ...PRIZE_TIERS.map(({ prize, tier }) => ({ label: prize, count: countByPrize(prize), tier })),
  ].filter(({ count }) => count > 0);

  $('#awards-summary').innerHTML = summaryItems
    .map(
      ({ label, count, tier }) => `
        <li class="awards-summary__item awards-summary__item--${tier}">
          <span class="awards-summary__count">${count}</span>
          <span class="awards-summary__label">${escapeHTML(label)}</span>
        </li>`
    )
    .join('');

  // ② 연도별 목록 — 최신 연도부터, 같은 연도 안에서는 config 에 적은 순서 유지
  const groups = groupAwardsByYear(items);
  const years = Object.keys(groups).sort((a, b) => b - a);

  $('#awards-timeline').innerHTML = years
    .map(
      (year) => `
        <section class="award-year reveal" aria-labelledby="award-year-${year}">
          <h3 class="award-year__label" id="award-year-${year}">
            <span class="award-year__num">${year}</span>
            <span class="award-year__count">${groups[year].length}건</span>
          </h3>
          <ol class="award-list">
            ${groups[year]
              .map(
                ({ title, prize, description }) => `
                  <li class="award">
                    <span class="award__prize award__prize--${getPrizeTier(prize)}">
                      ${getPrizeTier(prize) === 'grand' ? '<i class="fa-solid fa-trophy" aria-hidden="true"></i>' : ''}
                      ${escapeHTML(prize)}
                    </span>
                    <div class="award__body">
                      <h4 class="award__title">${escapeHTML(title)}</h4>
                      <p class="award__desc">${escapeHTML(description)}</p>
                    </div>
                  </li>`
              )
              .join('')}
          </ol>
        </section>`
    )
    .join('');
};

const renderContent = () => {
  // meta
  if (meta.title) document.title = meta.title;
  const metaDescription = $('meta[name="description"]');
  if (metaDescription && meta.description) metaDescription.setAttribute('content', meta.description);

  // nav
  setText('#nav-logo', nav.logoText);

  // Hero
  setText('#hero-greeting', hero.greeting);
  setText('#hero-title', hero.title);
  setText('#typing-text', hero.role);
  setText('#typing-fallback', hero.role);
  setText('#hero-description', hero.description);
  [
    ['#hero-cta-primary', hero.primaryCta],
    ['#hero-cta-secondary', hero.secondaryCta],
  ].forEach(([selector, { label, href }]) => {
    // 배열 구조분해 + 객체 구조분해
    const link = $(selector);
    link.textContent = label;
    link.setAttribute('href', href);
  });

  // About
  setText('#about-lead', about.lead);
  const aboutImage = $('#about-image');
  aboutImage.setAttribute('src', about.image.src);
  aboutImage.setAttribute('alt', about.image.alt);
  $('#about-text').innerHTML = about.paragraphs.map((text) => `<p>${escapeHTML(text)}</p>`).join('');
  $('#about-facts').innerHTML = about.facts
    .map(
      ({ label, value }) => `
        <div class="about__fact">
          <dt>${escapeHTML(label)}</dt>
          <dd>${escapeHTML(value)}</dd>
        </div>`
    )
    .join('');

  // Awards — 등급별 건수 요약 + 연도별 목록
  renderAwards();

  // Skills — 카테고리 배열을 map 으로 <article> 카드로 변환
  setText('#skills-lead', skills.lead);
  $('#skills-grid').innerHTML = skills.categories
    .map(
      ({ category, items }) => `
        <article class="card skill-card reveal">
          <h3 class="skill-card__title">${escapeHTML(category)}</h3>
          <ul class="skill-card__list">
            ${items.map((item) => `<li class="tag">${escapeHTML(item)}</li>`).join('')}
          </ul>
        </article>`
    )
    .join('');

  // Projects / Contact 설명
  setText('#projects-lead', projects.lead);
  setText('#contact-lead', contact.lead);

  // Footer
  setText('#footer-year', String(new Date().getFullYear()));
  setText('#footer-name', footer.copyrightName);
  $('#social-links').innerHTML = footer.socialLinks
    .map(
      ({ label, url, iconClass }) => `
        <li>
          <a class="social-links__link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">
            <i class="${escapeHTML(iconClass)}" aria-hidden="true"></i>
            <span>${escapeHTML(label)}</span>
          </a>
        </li>`
    )
    .join('');
};

/* =====================================================================
 * 5. 테마(다크 모드)
 *    이벤트(click) → setState('theme') → renderTheme() → data-theme 속성 변경
 *    → CSS 변수가 통째로 교체되어 전체 화면 색상이 바뀜
 * ===================================================================== */
const readSavedTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null; // 사생활 보호 모드 등 localStorage 접근 불가 시
  }
};

const saveTheme = (mode) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* 저장 실패해도 화면 전환은 계속 동작 */
  }
};

const renderTheme = () => {
  const { mode } = state.theme;
  const isDark = mode === 'dark';

  dom.root.setAttribute('data-theme', mode);
  dom.themeToggle.setAttribute('aria-pressed', String(isDark));
  dom.themeToggle.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
  dom.themeIcon.classList.remove('fa-moon', 'fa-sun');
  dom.themeIcon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
};

const handleThemeToggle = () => {
  const nextMode = state.theme.mode === 'dark' ? 'light' : 'dark';
  saveTheme(nextMode); // 사용자가 직접 고른 값만 localStorage 에 저장
  setState('theme', { mode: nextMode, source: 'user' });
};

/* ------------------------------ [BONUS 4] ------------------------------
 * 시스템 다크 모드 감지 (prefers-color-scheme)
 * - 저장된 값이 없을 때만 OS 설정을 초기 테마로 사용
 * - 사용자가 토글을 누르기 전까지는 OS 설정 변경도 실시간 반영
 * - css/style.css 의 [BONUS 4] 미디어 쿼리는 JS 실행 전 깜빡임을 줄이는 역할
 * ---------------------------------------------------------------------- */
const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

const detectSystemTheme = () => (systemDarkQuery.matches ? 'dark' : 'light');

const handleSystemThemeChange = ({ matches }) => {
  if (state.theme.source !== 'system') return; // 사용자가 직접 고른 테마가 우선
  setState('theme', { mode: matches ? 'dark' : 'light' });
};
/* ---------------------------- [/BONUS 4] ------------------------------ */

const initTheme = () => {
  const saved = readSavedTheme();

  if (saved) {
    setState('theme', { mode: saved, source: 'user' }); // 기본 과제: 새로고침 후에도 유지
  } else if (features.systemTheme) {
    setState('theme', { mode: detectSystemTheme(), source: 'system' }); // [BONUS 4]
    systemDarkQuery.addEventListener('change', handleSystemThemeChange); // [BONUS 4]
  } else {
    setState('theme', { mode: 'light', source: 'default' });
  }

  dom.themeToggle.addEventListener('click', handleThemeToggle);
};

/* =====================================================================
 * 6~7. 네비게이션 & 스크롤 UI
 *    이벤트(click/scroll) → setState('ui') → renderUI() → 클래스 토글
 * ===================================================================== */
const renderUI = () => {
  const { menuOpen, navScrolled, showTopButton } = state.ui;

  // 햄버거 메뉴: classList.toggle('active', 조건) — 상태가 true 면 추가, false 면 제거
  dom.navMenu.classList.toggle('active', menuOpen);
  dom.hamburger.classList.toggle('active', menuOpen);
  dom.header.classList.toggle('menu-open', menuOpen);
  dom.hamburger.setAttribute('aria-expanded', String(menuOpen));
  dom.hamburger.setAttribute('aria-label', menuOpen ? '메뉴 닫기' : '메뉴 열기');

  // 네비게이션 배경 (60px 이상 스크롤 시)
  dom.header.classList.toggle('scrolled', navScrolled);

  // 스크롤 탑 버튼 (300px 이상 스크롤 시)
  dom.scrollTopButton.classList.toggle('show', showTopButton);
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getScrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

const handleHamburgerClick = () => setState('ui', { menuOpen: !state.ui.menuOpen });

// 부드러운 스크롤: 페이지 내 앵커(#...) 클릭 시 기본 점프 동작을 막고 scrollIntoView 로 이동
const handleAnchorClick = (event) => {
  const hash = event.currentTarget.getAttribute('href');
  const target = hash && hash.length > 1 ? $(hash) : null;
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
  history.pushState(null, '', hash);
  if (state.ui.menuOpen) setState('ui', { menuOpen: false }); // 모바일: 이동 후 메뉴 닫기
};

const handleScroll = () => {
  const navScrolled = window.scrollY >= NAV_SCROLL_THRESHOLD;
  const showTopButton = window.scrollY >= TOP_BUTTON_THRESHOLD;

  // scroll 이벤트는 매우 자주 발생 → 값이 "바뀐 순간"에만 상태를 변경해 불필요한 DOM 업데이트 방지
  if (navScrolled !== state.ui.navScrolled || showTopButton !== state.ui.showTopButton) {
    setState('ui', { navScrolled, showTopButton });
  }
};

const handleScrollTopClick = () => window.scrollTo({ top: 0, behavior: getScrollBehavior() });

const handleKeydown = ({ key }) => {
  if (key === 'Escape' && state.ui.menuOpen) setState('ui', { menuOpen: false });
};

const initNavigation = () => {
  dom.hamburger.addEventListener('click', handleHamburgerClick);
  $$('a[href^="#"]').forEach((link) => link.addEventListener('click', handleAnchorClick));
  window.addEventListener('scroll', handleScroll, { passive: true });
  dom.scrollTopButton.addEventListener('click', handleScrollTopClick);
  document.addEventListener('keydown', handleKeydown);
  handleScroll(); // 새로고침 시 이미 스크롤된 위치라면 즉시 반영
};

/* =====================================================================
 * 8. 스크롤 애니메이션 (Intersection Observer)
 *    .reveal 요소가 20% 이상 보이면 .visible 클래스를 붙여 등장시킴
 * ===================================================================== */
const revealObserver =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(({ isIntersecting, target }) => {
            if (!isIntersecting) return;
            target.classList.add('visible');
            observer.unobserve(target); // 한 번 등장한 요소는 관찰 종료
          });
        },
        { threshold: REVEAL_THRESHOLD }
      )
    : null;

// 동적으로 추가된 카드(Projects)도 관찰할 수 있도록 scope 를 받아 재사용
const observeReveals = (scope = document) => {
  $$('.reveal:not(.visible)', scope).forEach((element) => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('visible');
  });
};

/* =====================================================================
 * 9. Projects — GitHub API 연동
 *    fetchRepos() → setState('projects', {status}) → renderProjects()
 * ===================================================================== */
const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });

const getLanguageLabel = ({ language }) => language ?? NO_LANGUAGE_LABEL;

// 저장소 객체 1개 → 카드 HTML 1개 (구조분해 할당 + 템플릿 리터럴)
const createRepoCard = (repo) => {
  const {
    name,
    description,
    html_url: url,
    stargazers_count: stars,
    forks_count: forks,
    updated_at: updatedAt,
  } = repo;

  return `
    <article class="card project-card reveal">
      <h3 class="project-card__title">
        <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(name)}</a>
      </h3>
      <p class="project-card__description">${escapeHTML(description ?? '설명이 등록되지 않은 저장소입니다.')}</p>
      <ul class="project-card__meta">
        <li class="tag">${escapeHTML(getLanguageLabel(repo))}</li>
        <li><i class="fa-solid fa-star" aria-hidden="true"></i> <span class="visually-hidden">Stars</span> ${stars}</li>
        <li><i class="fa-solid fa-code-fork" aria-hidden="true"></i> <span class="visually-hidden">Forks</span> ${forks}</li>
      </ul>
      <p class="project-card__updated">최근 업데이트 <time datetime="${escapeHTML(updatedAt)}">${formatDate(updatedAt)}</time></p>
    </article>`;
};

/* ------------------------------ [BONUS 1] ------------------------------
 * 언어별 프로젝트 필터링 (array.filter)
 *    이벤트(click) → setState('projects', {filter}) → renderProjects()
 * ---------------------------------------------------------------------- */
// 저장소 배열 → 중복 없는 언어 목록 (map + Set)
const getLanguages = (repos) => [FILTER_ALL, ...new Set(repos.map(getLanguageLabel))];

// 현재 필터 상태에 맞는 저장소만 남김 (filter)
const getVisibleRepos = () => {
  const { items, filter } = state.projects;
  if (!features.languageFilter || filter === FILTER_ALL) return items;
  return items.filter((repo) => getLanguageLabel(repo) === filter);
};

const renderProjectFilters = () => {
  const { status, items, filter } = state.projects;

  if (!features.languageFilter || status !== 'success') {
    dom.projectFilters.innerHTML = '';
    return;
  }

  dom.projectFilters.innerHTML = getLanguages(items)
    .map(
      (language) => `
        <button type="button"
                class="filter-btn ${language === filter ? 'active' : ''}"
                data-filter="${escapeHTML(language)}"
                aria-pressed="${language === filter}">
          ${escapeHTML(language)}
        </button>`
    )
    .join('');
};

// 필터 버튼은 매번 새로 그려지므로, 부모 요소에 한 번만 이벤트를 연결 (이벤트 위임)
const handleFilterClick = (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  const { filter } = button.dataset;
  if (filter !== state.projects.filter) setState('projects', { filter });
};
/* ---------------------------- [/BONUS 1] ------------------------------ */

// 상태(status)별 화면 — 상태 이름과 1:1 로 대응하는 뷰 함수 모음
const projectViews = {
  idle: () => '',

  loading: () => `
    <div class="status-box">
      <span class="spinner" aria-hidden="true"></span>
      <p class="status-box__title">프로젝트를 불러오는 중...</p>
    </div>`,

  error: () => `
    <div class="status-box status-box--error">
      <p class="status-box__title">프로젝트를 불러올 수 없습니다</p>
      <p class="status-box__detail">${escapeHTML(state.projects.errorMessage)}</p>
      <button type="button" class="btn btn--primary" data-action="retry">다시 시도</button>
    </div>`,

  empty: () => `
    <div class="status-box">
      <p class="status-box__title">표시할 프로젝트가 없습니다</p>
      <p class="status-box__detail">GitHub 에 공개 저장소를 만들면 이곳에 자동으로 표시됩니다.</p>
    </div>`,

  success: () => `
    <div class="projects-grid">
      ${getVisibleRepos() /* [BONUS 1] 미사용 시 state.projects.items 와 동일 */
        .map(createRepoCard)
        .join('')}
    </div>`,
};

const renderProjects = () => {
  const { status } = state.projects;

  dom.projectsView.setAttribute('aria-busy', String(status === 'loading'));
  dom.projectsView.innerHTML = projectViews[status]();
  renderProjectFilters(); // [BONUS 1]
  observeReveals(dom.projectsView); // 새로 그려진 카드에 스크롤 애니메이션 적용
};

// HTTP 상태 코드 → 사용자에게 보여줄 안내 문구
const getHttpErrorMessage = (response) => {
  const { status, headers } = response;

  if (status === 403 || status === 429) {
    // 레이트 리밋(시간당 60회) 초과
    const resetAt = Number(headers.get('x-ratelimit-reset')) * 1000;
    const resetText = resetAt
      ? ` ${new Date(resetAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 이후 다시 시도해 주세요.`
      : ' 잠시 후 다시 시도해 주세요.';
    return `GitHub API 요청 한도(시간당 60회)를 초과했습니다.${resetText}`;
  }
  if (status === 404) return `GitHub 사용자 "${projects.githubUsername}" 를 찾을 수 없습니다. js/config.js 의 githubUsername 을 확인해 주세요.`;
  return `GitHub 서버가 요청을 처리하지 못했습니다. (HTTP ${status})`;
};

/* 상태 UI 확인용 개발 도구: 주소 뒤에 ?mock=loading | error | empty 를 붙이면
 * 실제 API 를 호출하지 않고 해당 상태를 재현합니다. (README "상태별 UI 확인 방법" 참고) */
const getMockMode = () => new URLSearchParams(window.location.search).get('mock');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestRepos = async () => {
  const mockMode = getMockMode();
  if (mockMode === 'loading') return new Promise(() => {}); // 끝나지 않는 요청 → 로딩 상태 유지
  if (mockMode === 'error') {
    await wait(800);
    throw new Error('mock=error 로 재현한 에러 상태입니다.');
  }
  if (mockMode === 'empty') {
    await wait(800);
    return [];
  }

  const { githubUsername, sort } = projects;
  const endpoint = `https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?sort=${sort}&per_page=100`;
  const response = await fetch(endpoint, { headers: { Accept: 'application/vnd.github+json' } });

  // fetch 는 404/403 이어도 reject 하지 않으므로, response.ok 를 직접 확인해 실패로 분기
  if (!response.ok) throw new Error(getHttpErrorMessage(response));

  return response.json();
};

const fetchRepos = async () => {
  setState('projects', { status: 'loading', errorMessage: '' }); // ① 로딩 상태

  try {
    const data = await requestRepos();

    const items = data
      .filter(({ fork }) => !(projects.excludeForks && fork)) // fork 저장소 제외
      .slice(0, projects.maxRepos);

    setState('projects', {
      status: items.length > 0 ? 'success' : 'empty', // ② 성공 / ③ 빈 상태
      items,
      filter: FILTER_ALL,
    });
  } catch (error) {
    // ④ 에러 상태 — 네트워크 단절(TypeError) 과 HTTP 에러(throw new Error) 모두 이곳으로 모임
    const errorMessage =
      error instanceof TypeError ? '네트워크 연결을 확인한 뒤 다시 시도해 주세요.' : error.message;
    setState('projects', { status: 'error', items: [], errorMessage });
  }
};

// "다시 시도" 버튼도 동적으로 생성되므로 이벤트 위임으로 처리
const handleProjectsViewClick = (event) => {
  if (event.target.closest('[data-action="retry"]')) fetchRepos();
};

const initProjects = () => {
  dom.projectsView.addEventListener('click', handleProjectsViewClick);
  dom.projectFilters.addEventListener('click', handleFilterClick); // [BONUS 1]
  fetchRepos();
};

/* =====================================================================
 * 10. Contact 폼 유효성 검사
 *    이벤트(input/submit) → setState('form', {errors}) → renderForm()
 * ===================================================================== */
// 필드별 검증 규칙 — 문제가 있으면 에러 문구를, 없으면 빈 문자열을 반환
const validators = {
  name: (value) => (value.trim() ? '' : '이름을 입력해 주세요.'),
  email: (value) => {
    if (!value.trim()) return '이메일을 입력해 주세요.';
    return EMAIL_PATTERN.test(value.trim()) ? '' : '이메일 형식이 올바르지 않습니다. (예: name@example.com)';
  },
  message: (value) => (value.trim() ? '' : '메시지를 입력해 주세요.'),
};

const validateAll = (values) =>
  Object.fromEntries(Object.entries(values).map(([field, value]) => [field, validators[field](value)]));

const renderForm = () => {
  const { errors, status, statusMessage } = state.form;

  // 에러 메시지를 각 입력 필드 바로 아래에 표시/숨김
  Object.entries(errors).forEach(([field, message]) => {
    const input = $(`#${field}`);
    const hasError = Boolean(message);

    $(`#${field}-error`).textContent = message;
    input.classList.toggle('invalid', hasError);
    input.setAttribute('aria-invalid', String(hasError));
  });

  // 제출 버튼 & 결과 메시지
  const isSubmitting = status === 'submitting';
  dom.submitButton.disabled = isSubmitting;
  dom.submitButton.textContent = isSubmitting ? '보내는 중...' : '메시지 보내기';

  dom.formStatus.textContent = statusMessage;
  dom.formStatus.classList.remove('form-status--success', 'form-status--error');
  if (status === 'success') dom.formStatus.classList.add('form-status--success');
  if (status === 'error') dom.formStatus.classList.add('form-status--error');
};

// input 이벤트: 타이핑하는 즉시 해당 필드만 다시 검증 → 즉각적인 피드백
const handleFormInput = ({ target }) => {
  const { name: field, value } = target;
  if (!(field in validators)) return;

  setState('form', {
    values: { ...state.form.values, [field]: value },
    errors: { ...state.form.errors, [field]: validators[field](value) },
    status: 'idle',
    statusMessage: '',
  });
};

/* ------------------------------ [BONUS 3] ------------------------------
 * Formspree 로 실제 이메일 전송
 * - config.js 의 contact.formspreeEndpoint 가 입력된 경우에만 동작
 * ---------------------------------------------------------------------- */
const sendToFormspree = async (values) => {
  const response = await fetch(contact.formspreeEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  });
  if (!response.ok) throw new Error(`Formspree 응답 오류 (HTTP ${response.status})`);
};
/* ---------------------------- [/BONUS 3] ------------------------------ */

const handleFormSubmit = async (event) => {
  event.preventDefault(); // 기본 동작(페이지 새로고침·이동) 방지
  if (state.form.status === 'submitting') return;

  // 자동완성 등으로 input 이벤트 없이 채워진 값까지 포함하도록 제출 시점에 다시 읽음
  const formValues = Object.fromEntries(new FormData(dom.form));
  const values = { ...state.form.values, ...formValues };
  const errors = validateAll(values);
  const firstInvalidField = Object.keys(errors).find((field) => errors[field]);

  if (firstInvalidField) {
    setState('form', { values, errors, status: 'idle', statusMessage: '' });
    $(`#${firstInvalidField}`).focus();
    return;
  }

  try {
    if (contact.formspreeEndpoint) {
      setState('form', { values, errors, status: 'submitting', statusMessage: '' });
      await sendToFormspree(values); // [BONUS 3]
    }

    dom.form.reset();
    setState('form', {
      values: { name: '', email: '', message: '' },
      errors,
      status: 'success',
      statusMessage: contact.successMessage,
    });
  } catch {
    setState('form', {
      status: 'error',
      statusMessage: '메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
};

const initForm = () => {
  dom.form.addEventListener('input', handleFormInput);
  dom.form.addEventListener('submit', handleFormSubmit);
};

/* =====================================================================
 * 11. [BONUS 2] Hero 타이핑 효과
 * ---------------------------------------------------------------------
 * config.hero.typingPhrases 의 문구를 한 글자씩 출력 → 잠시 멈춤 → 지움 → 다음 문구
 * '동작 줄이기' 설정 사용자에게는 첫 문구를 고정으로 보여 줌
 * ===================================================================== */
const TYPING_SPEED = 90; // ms — 글자 입력 간격
const DELETING_SPEED = 40; // ms — 글자 삭제 간격
const PAUSE_AFTER_TYPED = 1600; // ms — 문구 완성 후 대기
const PAUSE_BEFORE_NEXT = 400; // ms — 다음 문구 시작 전 대기

const initTypingEffect = () => {
  const { typingPhrases = [] } = hero;
  const target = $('#typing-text');
  if (!features.typingEffect || typingPhrases.length === 0) return; // 보너스 OFF → hero.role 고정 문구 유지

  setText('#typing-fallback', typingPhrases.join(', ')); // 스크린 리더용 고정 텍스트

  if (prefersReducedMotion()) {
    const [firstPhrase] = typingPhrases;
    target.textContent = firstPhrase;
    return;
  }

  $('#typing-cursor').classList.add('active');
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const phrase = typingPhrases[phraseIndex];
    charIndex += isDeleting ? -1 : 1;
    target.textContent = phrase.slice(0, charIndex);

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    if (!isDeleting && charIndex === phrase.length) {
      isDeleting = true;
      delay = PAUSE_AFTER_TYPED;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      delay = PAUSE_BEFORE_NEXT;
    }
    setTimeout(tick, delay);
  };

  target.textContent = '';
  tick();
};

/* =====================================================================
 * 12. 초기화
 * ===================================================================== */
// 상태 조각(slice) 이름 → 그 상태를 화면에 그리는 함수
const renderers = {
  theme: renderTheme,
  ui: renderUI,
  projects: renderProjects,
  form: renderForm,
};

const init = () => {
  dom.root.classList.add('js'); // JS 가 동작할 때만 .reveal 요소를 숨김 (JS 미동작 시에도 내용은 보이도록)
  renderContent();
  initTheme();
  initNavigation();
  observeReveals();
  initProjects();
  initForm();
  initTypingEffect(); // [BONUS 2]
};

init();
