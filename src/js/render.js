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
  const { id, name, role, intro } = member;
  const card = document.createElement('li');
  card.className = 'member-card';
  card.append(
    createText('p', 'member-handle', id === UNCONFIRMED ? `ID ${UNCONFIRMED}` : `@${id}`),
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

// fetch는 file:// 로 열면 브라우저가 막는다. 그 경우 안내 문구를 보여 준다.
const loadMembers = async () => {
  try {
    const response = await fetch(MEMBERS_URL);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const { members } = await response.json();
    render(members);
  } catch (error) {
    document.getElementById('member-list').append(
      createText('li', 'noscript', '팀원 목록을 불러오지 못했습니다. Live Server 등 로컬 서버로 열어 주세요.'),
    );
    console.error('[members] 불러오기 실패:', error);
  }
};

loadMembers();
