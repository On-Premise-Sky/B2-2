// ==========================================================
// DOM
// ==========================================================
/*
    JavaScript에서 화면의 HTML 요소를 조작하기 위해 필요한 DOM 요소들을 미치 찾아 변수에 저장.
*/
// Light / Dark Theme을 변경하는 버튼
const themeToggle =
    document.querySelector(".theme-toggle");

// 사이트 상단 Navigation 전체 영역
// 모바일 메뉴 바깥 클릭 여부를 확인 할 때 사용
const siteNav =
    document.querySelector(".site-nav");

//모바일 화면에서 사용하는 Hamburger Menu 버튼
const menuToggle =
    document.querySelector(".menu-toggle");

// Navigation Link 목록을 감싸는 ul 요소
// 모바일에서 active Class를 붙여 메뉴를 열고 닫음.
const navList =
    document.querySelector(".nav-list");

// Navigation 안에 존재하는 모든 Link
// Link를 클릭했을 때 모바일 메뉴를 닫기 위해 사용
const navLinks =
    document.querySelectorAll(".nav-list a");

// href가 #으로 시작하는 페이지 내부 이동 Link
// About, Skills, Projects 등으로 Smooth Scroll하기 위해 사용
const internalLinks =
    document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    );

// 일정 거리 이상 Scroll 했을 때 나타나는 페이지 맨 위로 이동하는 버튼
const scrollTopButton =
    document.querySelector(".scroll-top");

// 사이트 상단 Header, Scroll 위치에 따라 scrolled Class를 적용
const siteHeader =
    document.querySelector(".site-header");

// Mouse 위치를 따라 움직이는 물결 / 조명 Pointer Effect 요소
const pointerEffect =
    document.querySelector(".pointer-effect");

// data-reveal 속성을 가진 모든 요소, Scroll 시 등장. Animation을 적용할 대상
const revealElements =
    document.querySelectorAll("[data-reveal]");

// Hero 영역에서 한 글자씩 출력할 Text 요소 
const typingText =
    document.querySelector("#typing-text");

// Hero Typing Animation 옆에서 깜빡이는 Cursor
const typingCursor =
    document.querySelector(".typing-cursor");

// Contact Form 전체   
const contactForm =
    document.querySelector("#contact-form");

// Contact Form의 Submit Button
// 전송 중 중복 Submit을 막기 위해 사용
const submitButton =
    contactForm.querySelector(
        ".submit-button"
    );

// Submit Button 안에 표시되는 Text
// Send Message ↔ Sending... 변경에 사용
const submitLabel =
    submitButton.querySelector(
        ".submit-label"
    );

const nameInput =
    document.querySelector("#name");

const emailInput =
    document.querySelector("#email");

const messageInput =
    document.querySelector("#message");

// Form 전송 성공 / 실패 메시지를 표시하는 영역
const formStatus =
    document.querySelector(".form-status");
// GitHub Repository Card들이 표시되는 영역
// Loading / Error / Empty 상태 역시 이 영역에 출력
const projectsList =
    document.querySelector("#projects-list");
// GitHub Repository 언어 Filter Button들이 들어가는 영역
const projectFilters =
    document.querySelector("#project-filters");


// ==========================================================
// CONFIG
// ==========================================================

/*
    사이트에서 반복해서 사용하는 설정값들을
    Magic Number로 직접 적지 않고 상수로 관리한다.

    이렇게 하면 나중에 값을 수정할 때
    한 곳만 변경하면 된다.
*/

// GitHub API로 조회할 GitHub 사용자 이름
const GITHUB_USERNAME =
    "yhana972";

// GitHub Repository 목록 API 주소
//
// sort=updated
// → 최근 수정된 Repository 순서
//
// direction=desc
// → 최신순
//
// per_page=30
// → 최대 30개 Repository 요청
const GITHUB_API_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=30`;

// Scroll이 60px 이상 내려가면 Header에 scrolled Class를 적용
const HEADER_SCROLL_THRESHOLD =
    60;

// Scroll이 300px 이상 내려가면 Scroll Top Button을 표시
const SCROLL_TOP_THRESHOLD =
    300;

// Tablet Layout으로 전환하는 기준 Width 768px 이상에서는 Mobile Menu 상태를 초기화
const TABLET_BREAKPOINT =
    768;

// Reveal 대상 요소가 약 20% 보이면 IntersectionObserver Callback 실행
const REVEAL_THRESHOLD =
    0.2;

// Hero Typing Animation에서 글자 하나가 출력되는 시간 간격(ms)
const TYPING_SPEED =
    90;

// 페이지가 시작된 뒤 Typing Animation이 시작되기까지의 지연 시간(ms)
const TYPING_START_DELAY =
    450;


/*
    Contact Validation 기준.

    HTML의 minlength / maxlength와
    동일한 값을 유지한다.
*/

const NAME_MIN_LENGTH =
    2;

const NAME_MAX_LENGTH =
    30;

const EMAIL_MAX_LENGTH =
    100;

const MESSAGE_MIN_LENGTH =
    10;

const MESSAGE_MAX_LENGTH =
    1000;


// ==========================================================
// MEDIA QUERY
// ==========================================================
/*
    화면 Width만 확인하는 것이 아니라
    사용자의 입력 장치나 접근성 설정 같은
    Browser / OS 환경을 JavaScript에서 확인한다.
*/

// 현재 기기가 Mouse처럼 정밀한 Pointer를 사용하는지 확인
//
// true
// → Pointer Effect 활성화 가능
//
// false
// → Touch Device일 가능성이 높으므로 Pointer Effect 비활성화
const hasFinePointer =
    window.matchMedia(
        "(pointer: fine)"
    ).matches;

// 사용자가 OS에서
// '동작 줄이기 / Reduce Motion' 옵션을 사용 중인지 확인
//
// true인 경우
// Typing / Smooth Scroll / Reveal 등의 Animation을 줄인다.
const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

// 운영체제의 Dark Mode 설정을 확인하는 MediaQueryList
//
// matches === true
// → System Dark Mode
//
// matches === false
// → System Light Mode
const systemThemeQuery =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


// ==========================================================
// THEME INITIAL VALUE
// ==========================================================
// 현재 운영체제 Theme을 확인해
// "dark" 또는 "light" 문자열을 반환한다.
const getSystemTheme = () => {
    return systemThemeQuery.matches
        ? "dark"
        : "light";
};

// 이전에 사용자가 직접 선택한 Theme이 있다면
// localStorage에서 가져온다.
//
// 저장된 값이 없다면 null
const savedTheme =
    localStorage.getItem(
        "yhana972-theme"
    );

// localStorage에 저장된 Theme 값이
// 실제로 사용할 수 있는 값인지 검사
//
// light / dark만 정상값으로 인정
const hasSavedTheme =
    savedTheme === "dark" ||
    savedTheme === "light";


// ==========================================================
// APPLICATION STATE
// ==========================================================

/*
    페이지에서 변경되는 상태를
    STATE 객체 하나에 모아 관리한다.

    핵심 흐름

    사용자 Event
        ↓
    STATE 변경
        ↓
    Render 함수 실행
        ↓
    화면 UI 변경


    예)

    Theme Button Click
        ↓
    STATE.theme.current 변경
        ↓
    renderTheme()
        ↓
    화면 Theme 변경
*/

const STATE = {

    // ------------------------------------------------------
    // Theme 상태
    // ------------------------------------------------------
    theme: {
        /*
            현재 적용되어 있는 Theme

            초기값 우선순위:

            1. 사용자가 localStorage에 저장한 Theme
            2. 저장값이 없으면 OS System Theme
        */

        current:
            hasSavedTheme
                ? savedTheme
                : getSystemTheme(),
        /*
            사용자가 사이트에서 Theme Button을
            직접 눌러 설정한 적이 있는지 여부

            true
            → 사용자 설정 우선

            false
            → System Theme 변경을 따라갈 수 있음
        */
        hasUserPreference:
            hasSavedTheme,
    },
    // ------------------------------------------------------
    // Mobile Menu 상태
    // ------------------------------------------------------
    menu: {

        /*
            Hamburger Menu가 현재 열려 있는지 여부

            false
            → 닫힘

            true
            → 열림
        */
        isOpen:
            false,
    },
    // ------------------------------------------------------
    // GitHub Project 상태
    // ------------------------------------------------------
    projects: {

        /*
            GitHub API에서 받아온
            Repository 객체들을 저장하는 배열
        */
        repositories:
            [],

        /*
            현재 선택한 Programming Language Filter

            기본값:
            ALL
        */
        filter:
            "ALL",


        /*
            GitHub API 현재 상태

            idle
            → 아직 요청하지 않음

            loading
            → 요청 중

            success
            → 성공

            empty
            → Repository 없음

            error
            → 요청 실패
        */
        status:
            "idle",
    },
    // ------------------------------------------------------
    // Contact Form 상태
    // ------------------------------------------------------
    contact: {
                /*
            Contact Form이 현재 전송 중인지 여부

            true일 때
            → Submit Button 비활성화
            → Sending... 표시

            중복 전송을 방지하기 위해 사용
        */
        isSubmitting:
            false,
    },
};


// ==========================================================
// THEME
// ==========================================================
/*
    Theme 관련 함수는 다음 흐름으로 동작한다.

    현재 Theme 상태
        ↓
    STATE.theme.current
        ↓
    renderTheme()
        ↓
    <html data-theme="...">
        ↓
    CSS 변수 변경
        ↓
    Light / Dark Mode 반영
*/

// 현재 Theme에 맞춰
// Theme Toggle 버튼의 아이콘과 접근성 문구를 변경한다.
//
// dark 상태라면
// → 사용자가 다음에 누르면 light로 바뀌므로 ☀ 표시
//
// light 상태라면
// → 다음에 누르면 dark로 바뀌므로 ☾ 표시
const updateThemeButton = (
    theme
) => {
    if (theme === "dark") {
        themeToggle.textContent =
            "☀";

        themeToggle.setAttribute(
            "aria-label",
            "라이트 모드로 변경"
        );

        return;
    }


    themeToggle.textContent =
        "☾";


    themeToggle.setAttribute(
        "aria-label",
        "다크 모드로 변경"
    );
};


// STATE에 저장된 현재 Theme을 실제 화면에 반영하는 Render 함수
const renderTheme = () => {
    /*
        document.documentElement
        → HTML 문서의 최상위 <html> 요소

        dataset.theme
        → data-theme 속성

        결과 예:

        <html data-theme="dark">
    */
    document.documentElement
        .dataset
        .theme =
        STATE.theme.current;

    // Theme 상태가 바뀌었으므로
    // Toggle Button UI도 함께 갱신
    updateThemeButton(
        STATE.theme.current
    );
};

// 사용자가 Theme Toggle Button을 직접 클릭했을 때 실행되는 Event Handler
const handleThemeToggle = () => {
    /*
        현재 Theme이 light이면 dark
        dark이면 light로 반전

        삼항 연산자:

        조건
            ? 참일 때 값
            : 거짓일 때 값
    */
    STATE.theme.current =
        STATE.theme.current === "light"
            ? "dark"
            : "light";

    /*
        사용자가 Theme을 직접 선택했다는 것을 기록

        이후 OS Theme이 변경되어도
        사용자 선택을 더 우선하기 위해 사용
    */
    STATE.theme.hasUserPreference =
        true;

    // 변경된 STATE를 실제 UI에 반영
    renderTheme();

    /*
        선택한 Theme을 Browser localStorage에 저장

        페이지를 새로고침하거나
        Browser를 다시 열어도 설정을 유지할 수 있다.
    */
    localStorage.setItem(
        "yhana972-theme",
        STATE.theme.current
    );
};

// 운영체제의 Light / Dark 설정이 바뀌었을 때 실행되는 Event Handler
const handleSystemThemeChange = (
    event
) => {
    /*
        사용자가 이미 사이트에서 Theme을 직접 선택했다면
        System Theme 변경을 따라가지 않는다.

        사용자 명시적 선택 > 운영체제 기본 설정
    */
    if (
        STATE.theme
            .hasUserPreference
    ) {
        return;
    }

    /*
        Media Query의 matches 값

        true
        → prefers-color-scheme: dark 조건 만족

        false
        → Light Mode
    */
    STATE.theme.current =
        event.matches
            ? "dark"
            : "light";

    // 변경된 System Theme을 화면에 반영
    renderTheme();
};

// 페이지 최초 로딩 시
// 현재 STATE의 Theme을 화면에 즉시 반영
renderTheme();


// ==========================================================
// HERO TYPING
// ==========================================================
/*
    Hero Typing 효과

    HTML의 data-text에 저장된 문장을 가져와
    한 글자씩 화면에 출력한다.

    흐름:

    전체 문장 가져오기
        ↓
    문자 배열로 변환
        ↓
    첫 글자 출력
        ↓
    setTimeout
        ↓
    다음 글자 출력
        ↓
    모든 글자를 출력할 때까지 반복
*/
const runHeroTyping = () => {
     /*
        typingText DOM 요소가 존재하지 않는다면
        이후 코드에서 오류가 발생할 수 있으므로 종료한다.

        방어 코드
    */

    if (!typingText) {
        return;
    }
/*
        HTML의 data-text 값을 가져온다.

        예:

        <span
            id="typing-text"
            data-text="서비스의 흐름을 설계합니다."
        ></span>
    */

    const fullText =
        typingText.dataset.text ||
        "";

/*
        전체 문자열을 문자 단위 배열로 변환

        예:

        "ABC"

        ↓

        ["A", "B", "C"]

        Array.from()을 사용하면
        문자열을 문자 단위로 순회하기 편해진다.
    */
    const characters =
        Array.from(
            fullText
        );

    /*
        사용자가 OS에서 Reduce Motion을 설정했다면
        Typing Animation을 실행하지 않는다.

        접근성 대응
    */

    if (
        prefersReducedMotion
    ) {
        typingText.textContent =
            fullText;


        if (typingCursor) {
            typingCursor.hidden =
                true;
        }


        return;
    }


    typingText.textContent =
        "";


    let typingIndex =
        0;

    /*
        한 글자를 화면에 출력하는 함수, 한 번 실행할 때마다 문자 하나를 출력하고 다음 실행을 setTimeout으로 예약한다.
    */
    const typeNextCharacter =
        () => {
            /*
                모든 문자를 출력했다면 더 이상 실행하지 않고 종료
            */
            if (
                typingIndex >=
                characters.length
            ) {
                return;
            }

            /*  현재 Index의 글자를 기존 Text 뒤에 추가
                textContent += → 기존 문자열 뒤에 이어 붙이기
            */
            typingText.textContent +=
                characters[
                    typingIndex
                ];


            typingIndex +=
                1;

            /*
                TYPING_SPEED 시간 뒤에 자기 자신을 다시 실행

                예:

                90ms
                ↓
                다음 글자 출력
                ↓
                90ms
                ↓
                다음 글자 출력
            */
            window.setTimeout(
                typeNextCharacter,
                TYPING_SPEED
            );
        };

 /*
        페이지가 열리자마자 바로 Typing하지 않고 일정 시간 대기한 뒤 시작
        현재:
        450ms
    */
    window.setTimeout(
        typeNextCharacter,
        TYPING_START_DELAY
    );
};


runHeroTyping();


// ==========================================================
// MOBILE NAVIGATION
// ==========================================================
/*
    모바일 메뉴 관련 핵심 흐름
    사용자가 Hamburger Button 클릭
        ↓
    STATE.menu.isOpen 변경
        ↓
    renderMenu()
        ↓
    active Class / aria-expanded / 버튼 아이콘 변경

    즉,
    "현재 메뉴가 열려 있는가?"라는 상태는 DOM이 아니라 STATE.menu.isOpen이 기준이 된다.
*/
// 현재 STATE.menu.isOpen 값을 기준으로 모바일 Navigation UI를 실제 화면에 반영한다.
const renderMenu = () => {
    /*
        classList.toggle(className, condition)

        condition === true
        → active Class 추가

        condition === false
        → active Class 제거
    */

    navList.classList.toggle(
        "active",
        STATE.menu.isOpen
    );

/*
        Screen Reader에게 현재 Menu가 열려 있는지 알려준다.
        true → 펼쳐짐 false → 접힘
    */
    menuToggle.setAttribute(
        "aria-expanded",
        String(
            STATE.menu.isOpen
        )
    );
    /*
        Button의 목적도 현재 상태에 따라 변경
        Menu 닫힘 → "메뉴 열기"   Menu 열림 → "메뉴 닫기"
    */
    menuToggle.setAttribute(
        "aria-label",
        STATE.menu.isOpen
            ? "메뉴 닫기"
            : "메뉴 열기"
    );


    menuToggle.textContent =
        STATE.menu.isOpen
            ? "×"
            : "☰";
};

// 모바일 메뉴 상태를 변경하는 공통 함수
// 여러 곳에서 직접 STATE.menu.isOpen을 바꾸지 않고 이 함수를 거쳐 상태 변경 + 화면 렌더링을 함께 처리한다.
const setMenuState = (
    isOpen
) => {
    STATE.menu.isOpen =
        isOpen;


    renderMenu();
};


const handleMenuToggle = () => {
    setMenuState(
        !STATE.menu.isOpen
    );
};

// Navigation Link를 클릭하면 모바일 Menu를 닫는다.
// 메뉴 항목을 선택한 뒤에도 메뉴가 계속 열린 상태로 남지 않도록 처리
const handleNavLinkClick = () => {
    setMenuState(
        false
    );
};

// 모바일 Menu가 열려 있을 때 Navigation 바깥 영역을 클릭하면 Menu를 닫는다.
const handleOutsideMenuClick = (
    event
) => {
    if (
        !STATE.menu.isOpen
    ) {
        return;
    }


    if (
        siteNav.contains(
            event.target
        )
    ) {
        return;
    }


    setMenuState(
        false
    );
};


const handleWindowResize = () => {
    if (
        window.innerWidth >=
        TABLET_BREAKPOINT
    ) {
        setMenuState(
            false
        );
    }
};


const handleEscapeKey = (
    event
) => {
    if (
        event.key !== "Escape" ||
        !STATE.menu.isOpen
    ) {
        return;
    }


    setMenuState(
        false
    );


    menuToggle.focus();
};


// ==========================================================
// SMOOTH SCROLL
// ==========================================================
/*
    페이지 내부 Link를 클릭했을 때 Browser 기본 Jump 이동 대신 scrollIntoView()를 이용해 자연스럽게 이동한다.
*/

const handleInternalLinkClick = (
    event
) => {
        /*
        event.currentTarget → Event Listener가 등록된 현재 Link
        event.target → 실제 클릭된 가장 안쪽 요소
        이 경우 Link 자체의 href가 필요하므로 currentTarget을 사용한다.
    */

    const link =
        event.currentTarget;


    const targetId =
        link.getAttribute(
            "href"
        );


    const target =
        document.querySelector(
            targetId
        );


    if (!target) {
        return;
    }


    event.preventDefault();


    target.scrollIntoView({
        behavior:
            prefersReducedMotion
                ? "auto"
                : "smooth",

        block:
            "start",
    });
};


// ==========================================================
// SCROLL UI
// ==========================================================
/*
    현재 Scroll 위치(window.scrollY)를 확인해
    1. Scroll Top Button 표시 여부
    2. Header Style 변경 여부
    를 한 번에 갱신한다.
*/
const updateScrollUI = () => {
        /*
        Scroll 300px 이상
        → active Class 추가
        → Scroll Top Button 표시

        300px 미만
        → active Class 제거
    */
    scrollTopButton
        .classList
        .toggle(
            "active",

            window.scrollY >=
                SCROLL_TOP_THRESHOLD
        );

    /*
        Scroll 60px 이상
        → Header에 scrolled Class 추가

        CSS에서
        Background / Shadow 등을 변경
    */
    siteHeader
        .classList
        .toggle(
            "scrolled",

            window.scrollY >=
                HEADER_SCROLL_THRESHOLD
        );
};


const handleWindowScroll = () => {
    updateScrollUI();
};


const handleScrollTopClick = () => {
    window.scrollTo({
        top:
            0,

        behavior:
            prefersReducedMotion
                ? "auto"
                : "smooth",
    });
};


updateScrollUI();


// ==========================================================
// POINTER EFFECT
// ==========================================================
/*
    마우스 위치를 따라 Light Mode에서는 물결, Dark Mode에서는 조명 느낌을 표현한다.

    핵심 흐름
    pointermove
        ↓
    clientX / clientY
        ↓
    CSS 변수에 저장
        ↓
    CSS radial-gradient 위치 변경
*/
const updatePointerEffect = (
    event
) => {
    /*
        clientX
        → 현재 Browser Viewport 기준 X 좌표

        clientY
        → 현재 Browser Viewport 기준 Y 좌표

        CSS에서 사용하기 위해 px 문자열로 변환
    */
    const x =
        `${event.clientX}px`;

    const y =
        `${event.clientY}px`;

    /*
        <html> 요소의 CSS Custom Property 변경

        결과 예:
        --pointer-x: 520px;
        --pointer-y: 310px;
    */
    document.documentElement
        .style
        .setProperty(
            "--pointer-x",
            x
        );


    document.documentElement
        .style
        .setProperty(
            "--pointer-y",
            y
        );

    /*
        Pointer가 움직이기 시작하면 Effect를 보이도록 active Class 추가
    */
    pointerEffect
        .classList
        .add(
            "active"
        );
};

// pointermove Event Handler, Event 객체를 Pointer Effect 함수에 전달
const handlePointerMove = (
    event
) => {
    updatePointerEffect(
        event
    );
};

// Pointer가 HTML 영역 밖으로 나가면 Effect를 숨긴다.
const handlePointerLeave = () => {
    pointerEffect
        .classList
        .remove(
            "active"
        );
};


// ==========================================================
// SCROLL REVEAL
// ==========================================================
/*
    data-reveal 속성을 가진 요소가 화면에 들어오면 visible Class를 추가해 등장 Animation을 실행한다.
    Scroll 위치를 직접 계산하지 않고 IntersectionObserver를 사용한다.
*/
// Reveal 대상 요소 하나를 실제로 보여주는 함수
const showRevealElement = (
    element
) => {
    /*
        CSS의:[data-reveal].visible 상태로 변경된다.
    */
    element
        .classList
        .add(
            "visible"
        );
};

// IntersectionObserver가 감지한 결과들을 처리
const handleRevealEntries = (
    entries,
    observer
) => {
    /*
        한 번의 Callback에 여러 Entry가 들어올 수 있으므로 forEach()로 하나씩 확인한다.
    */

    entries.forEach(
        (entry) => {
             /*
                아직 Viewport와 교차하지 않았다면 아무 작업도 하지 않음
            */
            if (
                !entry.isIntersecting
            ) {
                return;
            }

          // 화면에 들어온 요소 표시
            showRevealElement(
                entry.target
            );

        /*
                이 Reveal Animation은 한 번만 실행하면 된다.
                따라서 표시가 완료된 요소는 Observer 감시 대상에서 제거한다.
                불필요한 감시 작업 감소
            */
            observer.unobserve(
                entry.target
            );
        }
    );
};

// Scroll Reveal 기능 초기화
const initializeRevealAnimation =
    () => {
        /*
            다음 두 상황에서는 Animation을 사용하지 않는다.
            1. 사용자가 Reduced Motion 설정
            2. Browser가 IntersectionObserver 미지원
        */
        if (
            prefersReducedMotion ||
            !(
                "IntersectionObserver"
                in window
            )
        ) {
            /*
                Animation을 실행하지 않는 대신 모든 Element를 즉시 표시한다.
                콘텐츠 자체가 숨겨져 버리지 않도록 Fallback 처리
            */
            revealElements.forEach(
                showRevealElement
            );

            return;
        }

        /*
            Reveal Element를 감시할 IntersectionObserver 생성
            threshold: 0.2 → Element가 약 20% 보이면 Callback 실행
        */
        const revealObserver =
            new IntersectionObserver(
                handleRevealEntries,
                {
                    threshold:
                        REVEAL_THRESHOLD,
                }
            );

        /*
            data-reveal을 가진 모든 Element를 Observer의 감시 대상으로 등록
        */
        revealElements.forEach(
            (element) => {
                revealObserver.observe(
                    element
                );
            }
        );
    };


initializeRevealAnimation();


// ==========================================================
// CONTACT FORM VALIDATION
// ==========================================================
/*
    Contact Form 입력값을 검사하는 영역
    검증 대상:
    이름
    → 필수
    → 2 ~ 30자

    이메일
    → 필수
    → 이메일 형식
    → 최대 100자

    메시지
    → 필수
    → 10 ~ 1000자
*/
const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// ----------------------------------------------------------
// 공통 Error UI
// ----------------------------------------------------------
/*
    모든 Input Validation에서 반복되는
    Error UI 처리 로직을 함수로 분리했다.
    오류 발생:

    Input
    ↓
    error Class 추가
    ↓
    aria-invalid="true"
    ↓
    Error Message 출력
*/
// 특정 Input에 Error 상태를 표시한다.
const showError = (
    input,
    message
) => {
    // CSS에서 오류 스타일을 적용하기 위한 Class
    input
        .classList
        .add(
            "error"
        );

    /*
        Screen Reader에게 현재 입력값이 유효하지 않다는 것을 전달
        정상 상태에서는 Attribute 자체를 제거하고 오류일 때만 true를 사용한다.
    */
    input.setAttribute(
        "aria-invalid",
        "true"
    );

    /*
        현재 Input을 감싸고 있는 가장 가까운 .form-field 부모를 찾는다.
        closest()→ 자기 자신부터 부모 방향으로 탐색
    */
    const formField =
        input.closest(
            ".form-field"
        );

    /*
        해당 Form Field 안에서 Error Message를 표시할 요소를 찾는다.
    */
    const errorMessage =
        formField
            .querySelector(
                ".error-message"
            );


    errorMessage.textContent =
        message;
};


const clearError = (
    input
) => {
    input
        .classList
        .remove(
            "error"
        );


    input.removeAttribute(
        "aria-invalid"
    );


    const formField =
        input.closest(
            ".form-field"
        );


    const errorMessage =
        formField
            .querySelector(
                ".error-message"
            );


    errorMessage.textContent =
        "";
};


// ----------------------------------------------------------
// 이름 검증
// 2 ~ 30자
// ----------------------------------------------------------

const validateName = () => {
    const value =
        nameInput
            .value
            .trim();


    if (!value) {
        showError(
            nameInput,
            "이름을 입력해주세요."
        );

        return false;
    }


    if (
        value.length <
        NAME_MIN_LENGTH
    ) {
        showError(
            nameInput,
            `이름은 최소 ${NAME_MIN_LENGTH}자 이상 입력해주세요.`
        );

        return false;
    }


    if (
        value.length >
        NAME_MAX_LENGTH
    ) {
        showError(
            nameInput,
            `이름은 최대 ${NAME_MAX_LENGTH}자까지 입력할 수 있습니다.`
        );

        return false;
    }


    clearError(
        nameInput
    );


    return true;
};


// ----------------------------------------------------------
// 이메일 검증
// 필수 + 형식 + 최대 100자
// ----------------------------------------------------------

const validateEmail = () => {
    const value =
        emailInput
            .value
            .trim();


    if (!value) {
        showError(
            emailInput,
            "이메일을 입력해주세요."
        );

        return false;
    }


    if (
        value.length >
        EMAIL_MAX_LENGTH
    ) {
        showError(
            emailInput,
            `이메일은 최대 ${EMAIL_MAX_LENGTH}자까지 입력할 수 있습니다.`
        );

        return false;
    }


    if (
        !emailPattern.test(
            value
        )
    ) {
        showError(
            emailInput,
            "올바른 이메일 형식을 입력해주세요."
        );

        return false;
    }


    clearError(
        emailInput
    );


    return true;
};


// ----------------------------------------------------------
// 메시지 검증
// 10 ~ 1000자
// ----------------------------------------------------------

const validateMessage = () => {
    const value =
        messageInput
            .value
            .trim();


    if (!value) {
        showError(
            messageInput,
            "메시지를 입력해주세요."
        );

        return false;
    }


    if (
        value.length <
        MESSAGE_MIN_LENGTH
    ) {
        showError(
            messageInput,
            `메시지는 최소 ${MESSAGE_MIN_LENGTH}자 이상 입력해주세요.`
        );

        return false;
    }


    if (
        value.length >
        MESSAGE_MAX_LENGTH
    ) {
        showError(
            messageInput,
            `메시지는 최대 ${MESSAGE_MAX_LENGTH}자까지 입력할 수 있습니다.`
        );

        return false;
    }


    clearError(
        messageInput
    );


    return true;
};


const validateForm = () => {
    const isNameValid =
        validateName();


    const isEmailValid =
        validateEmail();


    const isMessageValid =
        validateMessage();


    return (
        isNameValid &&
        isEmailValid &&
        isMessageValid
    );
};


// ==========================================================
// CONTACT FORM STATUS
// ==========================================================

const clearFormStatus = () => {
    formStatus.textContent =
        "";


    formStatus
        .classList
        .remove(
            "success",
            "error"
        );
};


const setFormStatus = (
    message,
    type = ""
) => {
    formStatus.textContent =
        message;


    formStatus
        .classList
        .remove(
            "success",
            "error"
        );


    if (type) {
        formStatus
            .classList
            .add(
                type
            );
    }
};


const renderSubmittingState = () => {
    contactForm
        .classList
        .toggle(
            "is-submitting",
            STATE.contact
                .isSubmitting
        );


    contactForm.setAttribute(
        "aria-busy",
        String(
            STATE.contact
                .isSubmitting
        )
    );


    /*
        Input을 disabled 하면
        FormData에서 제외되므로
        Submit Button만 비활성화한다.
    */

    submitButton.disabled =
        STATE.contact
            .isSubmitting;


    submitLabel.textContent =
        STATE.contact
            .isSubmitting
            ? "Sending..."
            : "Send Message";
};


const setSubmittingState = (
    isSubmitting
) => {
    STATE.contact.isSubmitting =
        isSubmitting;


    renderSubmittingState();
};


// ==========================================================
// CONTACT INPUT EVENTS
// ==========================================================

const handleNameInput = () => {
    clearFormStatus();


    const length =
        nameInput
            .value
            .trim()
            .length;


    /*
        현재 값이 유효 범위에 들어오면
        기존 Error 상태를 실시간으로 제거한다.
    */

    if (
        length >=
            NAME_MIN_LENGTH &&
        length <=
            NAME_MAX_LENGTH
    ) {
        clearError(
            nameInput
        );
    }
};


const handleEmailInput = () => {
    clearFormStatus();


    const value =
        emailInput
            .value
            .trim();


    if (
        value.length <=
            EMAIL_MAX_LENGTH &&
        emailPattern.test(
            value
        )
    ) {
        clearError(
            emailInput
        );
    }
};


const handleMessageInput = () => {
    clearFormStatus();


    const length =
        messageInput
            .value
            .trim()
            .length;


    if (
        length >=
            MESSAGE_MIN_LENGTH &&
        length <=
            MESSAGE_MAX_LENGTH
    ) {
        clearError(
            messageInput
        );
    }
};


// ==========================================================
// CONTACT FORM SUBMIT
// ==========================================================

/*
    Contact Form 전체 전송 Flow
    Submit
        ↓
    preventDefault()
        ↓
    Validation
        ↓
    실패
        → 첫 번째 오류 Input Focus

    성공
        ↓
    FormData 생성
        ↓
    Sending State
        ↓
    Formspree fetch POST
        ↓
    Success / Error
        ↓
    Sending State 종료
*/
const handleContactSubmit =
    async (event) => {
        /*
            Form의 기본 Submit 동작을 차단

            기본 동작:
            페이지 이동 / 새로고침 가능

            현재 동작:
            JavaScript fetch()로 직접 전송
        */
        event.preventDefault();

        // 이전 성공/실패 상태 제거
        clearFormStatus();

        // 전체 입력값 Validation 실행
        const isValid =
            validateForm();


        if (!isValid) {
            /*
                Error Class가 붙은 첫 번째 Input을 찾는다.
            */
            const firstInvalidInput =
                contactForm
                    .querySelector(
                        ".error"
                    );

            /*
                첫 번째 오류 Input으로 Focus 이동
                Keyboard 사용자도 어디를 수정해야 하는지 바로 알 수 있다.
            */
            if (
                firstInvalidInput
            ) {
                firstInvalidInput
                    .focus();
            }


            return;
        }

        /*
            Formspree 설정값이 아직 예제 값으로 남아 있는 경우를 방어
            현재 실제 HTML에서는 실제 Formspree URL을 사용 중이다.
        */
        if (
            contactForm.action
                .includes(
                    "YOUR_FORM_ID"
                )
        ) {
            setFormStatus(
                "Formspree Form ID를 먼저 설정해주세요.",
                "error"
            );

            return;
        }


        const formData =
            new FormData(
                contactForm
            );

        /*
            중요: FormData를 먼저 생성한 뒤 전송 중 상태로 변경한다.
            이전에 Input 자체를 disabled 처리했더니 FormData에 값이 포함되지 않는 문제가 있었기 때문.
        */
        setSubmittingState(
            true
        );


        try {
            /*
                Formspree Endpoint로 POST 요청
                action: HTML form의 action URL
                body: FormData
                Accept: JSON Response 요청
            */
            const response =
                await fetch(
                    contactForm.action,
                    {
                        method:
                            "POST",

                        body:
                            formData,

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            /*
                HTTP 429 Too Many Requests
                요청이 너무 많이 발생한 상태
            */

            if (
                response.status ===
                429
            ) {
                throw new Error(
                    "RATE_LIMIT"
                );
            }


            if (!response.ok) {
                let message =
                    "메시지를 전송하지 못했습니다.";


                try {
                    const data =
                        await response.json();


                    if (
                        Array.isArray(
                            data.errors
                        ) &&
                        data.errors.length >
                            0
                    ) {
                        message =
                            data.errors
                                .map(
                                    ({
                                        message:
                                            errorMessage,
                                    }) =>
                                        errorMessage
                                )
                                .join(" ");
                    }

                } catch {
                    /*
                        JSON 응답이 아닌 경우
                        기본 메시지를 사용한다.
                    */
                }


                throw new Error(
                    message
                );
            }


            contactForm.reset();


            [
                nameInput,
                emailInput,
                messageInput,
            ].forEach(
                clearError
            );


            setFormStatus(
                "메시지가 전송되었습니다. 감사합니다!",
                "success"
            );

        } catch (error) {
            console.error(
                "[Contact Form Error]",
                error
            );


            if (
                error.message ===
                "RATE_LIMIT"
            ) {
                setFormStatus(
                    "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
                    "error"
                );

                return;
            }


            setFormStatus(
                error.message ||
                "메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.",
                "error"
            );

        } finally {
            setSubmittingState(
                false
            );
        }
    };


// ==========================================================
// ESCAPE HTML
// ==========================================================
/*
    GitHub API처럼 외부에서 받아온 문자열을 innerHTML에 그대로 넣으면 HTML로 해석될 가능성이 있다.

    예를 들어 외부 문자열에:
    <script>...</script>
    같은 값이 들어 있다면 그대로 HTML로 해석되는 것은 위험하다.
    따라서 &, <, >, ", ' 같은 문자를
    HTML Entity로 변환한 뒤 사용한다.
*/
// 외부 문자열을 HTML Entity로 치환하는 함수
const escapeHTML = (
    value
) => {
    /*
        변환할 특수문자와
        대응되는 HTML Entity를 Object로 정의

        &  → &amp;
        <  → &lt;
        >  → &gt;
        "  → &quot;
        '  → &#039;
    */
    const entities = {
        "&":
            "&amp;",

        "<":
            "&lt;",

        ">":
            "&gt;",

        "\"":
            "&quot;",

        "'":
            "&#039;",
    };

    /*
        어떤 값이 들어와도 String으로 변환한 뒤 정규식으로 특수문자를 찾는다.
        replace()가 찾은 문자마다 entities Object의 대응값으로 변경한다.
    */
    return String(
        value
    ).replace(
        /[&<>"']/g,

        (character) =>
            entities[
                character
            ]
    );
};


// ==========================================================
// PROJECT FILTER
// ==========================================================
/*
    GitHub Repository마다 language 값이 있다.

    예:

    [
        { language: "JavaScript" },
        { language: "Python" },
        { language: "JavaScript" },
        { language: null }
    ]

    여기에서:

    1. language만 추출
    2. null 제거
    3. 중복 제거
    4. 정렬
    5. Filter Button 생성

    을 수행한다.
*/
// Repository 데이터를 기준으로 Language Filter Button을 생성한다.
const renderProjectFilters =
    () => {
/*
            STATE.projects.repositories
            ↓ map()

            language 값만 추출

            ↓ filter(Boolean)

            null / undefined 등 제거

            ↓ Set

            중복 Language 제거

            ↓ Spread Syntax

            다시 Array로 변환

            ↓ sort()

            가나다/알파벳 순 정렬
        */
        const languages = [
            ...new Set(
                STATE.projects
                    .repositories
                    .map(
                        ({
                            language,
                        }) =>
                            language
                    )
                    .filter(
                        Boolean
                    )
            ),
        ].sort(
            (
                first,
                second
            ) =>
                first.localeCompare(
                    second
                )
        );

        /*
            Filter의 첫 항목은
            항상 전체 프로젝트를 보여주는 ALL

            예:

            [
                "ALL",
                "C#",
                "JavaScript",
                "Python"
            ]
        */
        const filters = [
            "ALL",
            ...languages,
        ];

        /*
            Filter 배열을 Button HTML 문자열 배열로 변환한 뒤 join("")으로 하나의 HTML 문자열로 합친다.
        */
        projectFilters.innerHTML =
            filters
                .map(
                    (filter) => {
                         /*
                            현재 생성 중인 Filter가 STATE에 저장된 선택 Filter와 같은지 확인
                            true→ active Button
                        */
                        const isActive =
                            filter ===
                            STATE.projects
                                .filter;

                        /*
                            화면에 표시할 Label ALL은 사용자에게 보기 좋게 "All"로 표시
                            나머지 Language는 외부 Data이므로 escapeHTML 처리
                        */
                        const label =
                            filter === "ALL"
                                ? "All"
                                : escapeHTML(
                                    filter
                                );

                        /*
                            Filter 값을 HTML data-* Attribute에 넣기 전에 URL Encoding 처리
                            특수문자가 포함되더라도 안전하게 Attribute 값으로 사용할 수 있게 한다.
                        */
                        const encodedFilter =
                            encodeURIComponent(
                                filter
                            );

                        /*
                            aria-pressed
                            Toggle 성격의 Button이 현재 선택 상태인지 Screen Reader에 전달한다.
                        */
                        return `
                            <button
                                type="button"
                                class="project-filter${isActive ? " active" : ""}"
                                data-filter="${encodedFilter}"
                                aria-pressed="${isActive}"
                            >
                                ${label}
                            </button>
                        `;
                    }
                )
                .join("");


        projectFilters.hidden =
            false;
    };


// ==========================================================
// PROJECT STATES
// ==========================================================
/*
    GitHub API 영역은 한 가지 화면만 존재하는 것이 아니다.

    Loading
    Empty
    Error
    Success

    상태에 따라 서로 다른 UI를 보여준다.
*/
// Filter 영역을 숨기고 내부 Button을 제거한다.
//
// Loading / Empty / Error 상태에서는
// 사용할 Filter가 없기 때문에 숨긴다.
const hideProjectFilters = () => {
    projectFilters.hidden =
        true;


    projectFilters.innerHTML =
        "";
};


const renderLoading = () => {
    STATE.projects.status =
        "loading";


    hideProjectFilters();


    projectsList.setAttribute(
        "aria-busy",
        "true"
    );


    projectsList.innerHTML = `
        <p class="projects-status">
            프로젝트를 불러오는 중...
        </p>
    `;
};


const renderEmpty = () => {
    STATE.projects.status =
        "empty";


    hideProjectFilters();


    projectsList.setAttribute(
        "aria-busy",
        "false"
    );


    projectsList.innerHTML = `
        <p class="projects-status">
            표시할 프로젝트가 없습니다.
        </p>
    `;
};


const renderFilteredEmpty = () => {
    projectsList.setAttribute(
        "aria-busy",
        "false"
    );


    projectsList.innerHTML = `
        <p class="projects-status">
            해당 언어의 프로젝트가 없습니다.
        </p>
    `;
};


const renderError = (
    message
) => {
    STATE.projects.status =
        "error";


    hideProjectFilters();


    projectsList.setAttribute(
        "aria-busy",
        "false"
    );


    projectsList.innerHTML = `
        <div class="projects-status">

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                type="button"
                class="retry-projects"
            >
                다시 시도
            </button>

        </div>
    `;
};


// ==========================================================
// PROJECT CARDS
// ==========================================================
/*
    GitHub API에서 받아온 Repository Array를
    Project Card HTML로 변환한다.

    Repository Object
        ↓
    map()
        ↓
    Card HTML String
        ↓
    join("")
        ↓
    projectsList.innerHTML
*/
const renderProjects = (
    repositories
) => {
    STATE.projects.status =
        "success";


    projectsList.setAttribute(
        "aria-busy",
        "false"
    );

    /*
        repositories 배열의 각 Repository를 Project Card HTML 문자열로 변환한다.
        map()은 원본 배열을 수정하지 않고 새로운 배열을 반환한다.
    */
    const cards =
        repositories.map(
            (
                repository,
                index
            ) => {
                 /*
                    구조 분해 할당

                    repository.name
                    repository.description
                    repository.html_url
                    ...

                    을 반복하지 않고 필요한 Property만 변수로 꺼낸다.
                */
                const {
                    name,
                    description,
                    html_url,
                    language,
                    stargazers_count,
                    forks_count,
                } =
                    repository;

                /*
                    GitHub API에서 받은 문자열을 innerHTML에 넣기 전에 Escape
                */
                const safeName =
                    escapeHTML(
                        name
                    );


                const safeDescription =
                    escapeHTML(
                        description ||
                        "프로젝트 설명이 없습니다."
                    );


                const safeLanguage =
                    escapeHTML(
                        language ||
                        "Unknown"
                    );


                const safeUrl =
                    escapeHTML(
                        html_url
                    );


                return `
                    <article class="project-card">

                        <div class="project-card-top">

                            <span class="project-depth">
                                DEPTH ${String(index + 1).padStart(2, "0")}
                            </span>

                            <span class="project-language">
                                ${safeLanguage}
                            </span>

                        </div>


                        <h3>
                            ${safeName}
                        </h3>


                        <p>
                            ${safeDescription}
                        </p>


                        <div class="project-meta">

                            <span>
                                ★ ${stargazers_count}
                            </span>

                            <span>
                                Fork ${forks_count}
                            </span>

                            <a
                                href="${safeUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub ↗
                            </a>

                        </div>

                    </article>
                `;
            }
        );

/*
        map() 결과:

        [
            "<article>...</article>",
            "<article>...</article>",
            ...
        ]

        join("")

        ↓

        하나의 HTML 문자열로 연결
    */
    projectsList.innerHTML =
        cards.join("");
};


// ==========================================================
// FILTER PROJECTS
// ==========================================================
/*
    현재 STATE.projects.filter 값에 맞춰
    화면에 보여줄 Repository를 결정한다.

    Filter Button
        ↓
    STATE.projects.filter
        ↓
    filter()
        ↓
    renderProjects()
*/
const renderFilteredProjects =
    () => {
        /*
            현재 Filter가 ALL이면 전체 Repository 사용
            아니면 language가 선택 Filter와 같은 Repository만 추출
        */

        const filteredRepositories =
            STATE.projects.filter ===
            "ALL"

                ? STATE.projects
                    .repositories

                : STATE.projects
                    .repositories
                    .filter(
                        ({
                            language,
                        }) =>
                            language ===
                            STATE.projects
                                .filter
                    );

        /*
            필터 결과가 하나도 없다면 Card 대신 Empty UI 표시
        */
        if (
            filteredRepositories
                .length === 0
        ) {
            renderFilteredEmpty();

            return;
        }


        renderProjects(
            filteredRepositories
        );
    };


// ==========================================================
// FETCH PROJECTS
// ==========================================================
/*
    GitHub API 호출 전체 흐름

    fetchProjects()
        ↓
    Loading 표시
        ↓
    fetch()
        ↓
    HTTP 상태 확인
        ↓
    JSON Parsing
        ↓
    STATE에 Repository 저장
        ↓
    Filter 생성
        ↓
    Project Card Rendering

    실패하면
        ↓
    Error UI
*/
const fetchProjects =
    async () => {
        renderLoading();         // API 요청 직전에 Loading UI 표시


        try {
            /*
                GitHub REST API 요청

                await
                → Response가 올 때까지
                  이 async 함수 내부 실행을 기다린다.
            */
            const response =
                await fetch(
                    GITHUB_API_URL
                );

            /*
                403 → GitHub API 제한 상황에서 발생할 수 있음
                429 → Too Many Requests
            */
            if (
                response.status === 403 ||
                response.status === 429
            ) {
                console.error(
                    `[GitHub API] Rate Limit Error (${response.status})`
                );


                throw new Error(
                    "RATE_LIMIT"
                );
            }


            if (
                response.status ===
                404
            ) {
                console.error(
                    "[GitHub API] User Not Found (404)"
                );


                throw new Error(
                    "NOT_FOUND"
                );
            }

            /*
                fetch()는 404 / 500 같은 HTTP Error가 와도 반드시 catch로 자동 이동하는 것은 아니다.
                따라서 response.ok를 직접 검사한다.
            */
            if (!response.ok) {
                console.error(
                    `[GitHub API] HTTP Error (${response.status})`
                );


                throw new Error(
                    `HTTP_${response.status}`
                );
            }

            /*
                Response Body의 JSON을 JavaScript 값으로 변환
            */
            const repositories =
                await response.json();

            /*
                정상적인 GitHub Repository API라면 Array가 와야 한다.
                예상과 다른 데이터라면 잘못된 응답으로 판단
            */

            if (
                !Array.isArray(
                    repositories
                )
            ) {
                console.error(
                    "[GitHub API] Invalid Response Data"
                );


                throw new Error(
                    "INVALID_DATA"
                );
            }

            // API 성공 + Repository 0개
            if (
                repositories.length ===
                0
            ) {                // STATE도 빈 배열로 초기화
                STATE.projects.repositories =
                    [];

                // Empty UI 표시
                renderEmpty();


                return;
            }

            /*
                GitHub Repository 데이터를 Application STATE에 저장
            */
            STATE.projects.repositories =
                repositories;

            /*
                새 데이터를 받았으므로 Filter는 기본값 ALL로 초기화
            */
            STATE.projects.filter =
                "ALL";

            // Repository Language를 기반으로 Filter 생성
            renderProjectFilters();
            // 현재 Filter 기준 Project Card Rendering
            renderFilteredProjects();

        } catch (error) {
            console.error(
                "[GitHub API Error]",
                error
            );


            if (
                error.message ===
                "RATE_LIMIT"
            ) {
                renderError(
                    "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
                );

                return;
            }


            if (
                error.message ===
                "NOT_FOUND"
            ) {
                renderError(
                    "GitHub 사용자를 찾을 수 없습니다."
                );

                return;
            }


            renderError(
                "프로젝트를 불러올 수 없습니다."
            );
        }
    };


// ==========================================================
// PROJECT EVENTS
// ==========================================================
/*
    Project Filter Button과 Retry Button은
    innerHTML로 동적으로 만들어진다.

    따라서 각각의 Button마다 Event Listener를 붙이는 대신
    Parent Container에 Listener를 하나만 등록하는
    Event Delegation 방식을 사용한다.
*/
// Project Filter 영역에서 Click이 발생했을 때 실행
const handleProjectFilterClick = (
    event
) => {
        /*
        event.target이 Element인지 확인 closest()를 안전하게 호출하기 위한 방어 코드
    */
    if (
        !(
            event.target
            instanceof Element
        )
    ) {
        return;
    }

    /*
        실제 Click 위치부터 부모 방향으로 올라가면서 가장 가까운 .project-filter Button을 찾는다.
        Button 내부 Text를 눌러도 Button 자체를 찾을 수 있다.
    */
    const filterButton =
        event.target.closest(
            ".project-filter"
        );


    if (!filterButton) {
        return;
    }

    /*
        HTML:

        data-filter="JavaScript"
        ↓
        dataset.filter
        ↓
        "JavaScript"

        renderProjectFilters()에서 encodeURIComponent 했으므로 다시 decodeURIComponent로 원래 값 복원
    */
    STATE.projects.filter =
        decodeURIComponent(
            filterButton
                .dataset
                .filter
        );

    /*
        선택 상태가 바뀌었으므로

        1. Filter Button UI 갱신
        2. Project Card 목록 갱신
    */
    renderProjectFilters();

    renderFilteredProjects();
};

// Projects 영역에서 Click이 발생했을 때 실행
const handleProjectsListClick = (
    event
) => {
    if (
        !(
            event.target
            instanceof Element
        )
    ) {
        return;
    }


    const retryButton =
        event.target.closest(
            ".retry-projects"
        );


    if (!retryButton) {
        return;
    }


    fetchProjects();
};


// ==========================================================
// EVENT REGISTRATION
// ==========================================================

// Theme
themeToggle.addEventListener(
    "click",
    handleThemeToggle
);


systemThemeQuery.addEventListener(
    "change",
    handleSystemThemeChange
);


// Navigation
menuToggle.addEventListener(
    "click",
    handleMenuToggle
);


navLinks.forEach(
    (link) => {
        link.addEventListener(
            "click",
            handleNavLinkClick
        );
    }
);


document.addEventListener(
    "click",
    handleOutsideMenuClick
);


document.addEventListener(
    "keydown",
    handleEscapeKey
);


window.addEventListener(
    "resize",
    handleWindowResize
);


// Smooth Scroll
internalLinks.forEach(
    (link) => {
        link.addEventListener(
            "click",
            handleInternalLinkClick
        );
    }
);


// Scroll
window.addEventListener(
    "scroll",
    handleWindowScroll,
    {
        passive:
            true,
    }
);


scrollTopButton.addEventListener(
    "click",
    handleScrollTopClick
);


// Pointer
if (hasFinePointer) {
    window.addEventListener(
        "pointermove",
        handlePointerMove,
        {
            passive:
                true,
        }
    );


    document.documentElement
        .addEventListener(
            "mouseleave",
            handlePointerLeave
        );
}


// Contact
nameInput.addEventListener(
    "input",
    handleNameInput
);


emailInput.addEventListener(
    "input",
    handleEmailInput
);


messageInput.addEventListener(
    "input",
    handleMessageInput
);


contactForm.addEventListener(
    "submit",
    handleContactSubmit
);


// Projects
projectFilters.addEventListener(
    "click",
    handleProjectFilterClick
);


projectsList.addEventListener(
    "click",
    handleProjectsListClick
);


// ==========================================================
// INITIALIZE
// ==========================================================

fetchProjects();