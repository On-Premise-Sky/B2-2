// render.js: 팀원 데이터는 ../data/members.json에서 읽고, 읽은 배열로 카드를 그린다.

const MEMBERS_URL = 'data/members.json';
const UNCONFIRMED = '확인 필요';

// 태그를 만들고 글자를 넣는다. 확인되지 않은 값에는 표시용 class를 더한다.
const createText = (tag, className, text) => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  if (text === UNCONFIRMED) {
    element.classList.add('is-unconfirmed');
  }
  return element;
};

const createSiteEntry = ({ id, name, hasSite }) => {
  if (!hasSite) {
    return createText('p', 'member-pending', '사이트 준비 중');
  }

  const link = createText('a', 'member-link', '개인 사이트 열기 →');
  link.href = `../team/${id}/`;
  link.setAttribute('aria-label', `${name} 개인 사이트 열기`);
  return link;
};

const createCard = (member) => {
  const { id, name, role, intro, github } = member;
  const card = document.createElement('li');
  card.className = 'member-card';

  const handle = createText('a', 'member-handle', `@${id}`);
  handle.href = github;
  handle.target = '_blank';
  handle.rel = 'noopener';

  card.append(
    handle,
    createText('h3', 'member-name', name),
    createText('p', 'member-role', role),
    createText('p', 'member-intro', intro),
    createSiteEntry(member),
  );
  return card;
};

const render = (members) => {
  document.getElementById('member-list').append(...members.map(createCard));
  document.getElementById('member-count').textContent = `팀원 ${members.length}명`;
};

// JSON을 읽어 카드를 그린다. 실패하면 목록 자리에 안내 문구를 보여 준다.
const loadMembers = async () => {
  try {
    const response = await fetch(MEMBERS_URL);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const { members } = await response.json();
    render(members);
  } catch (error) {
    // file:// 로 열면 브라우저가 fetch를 막는다. 그때만 로컬 서버 안내를 덧붙인다.
    const guide = location.protocol === 'file:'
      ? ' Live Server 등 로컬 서버로 열어 주세요.'
      : '';
    document.getElementById('member-list').append(
      createText('li', 'noscript', `팀원 목록을 불러오지 못했습니다.${guide}`),
    );
    console.error('[members] 불러오기 실패:', error);
  }
};

loadMembers();
