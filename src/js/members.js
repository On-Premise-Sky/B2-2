// members.js: 팀원 정보는 이 배열에서만 관리하고, 배열을 읽어 카드를 그린다.

const UNCONFIRMED = '확인 필요';

// id: GitHub 아이디이자 team/ 아래 폴더명. 사이트 경로는 ../team/<id>/ 로 만든다.
// hasSite: team/<id>/ 폴더를 확인했으면 true로 바꾼다. false면 링크 대신 '사이트 준비 중'을 보여 준다.
const members = [
  {
    id: 'sw0410',
    name: '이승우',
    role: '저장소·보호 규칙 관리, Pages 배포',
    intro: '동료와 함께 자라는 개발자',
    hasSite: true,
  },
  {
    id: 'ktheodoreyw',
    name: '김영운',
    role: '미션 설계, 템플릿 제작, CONTRIBUTING 총괄, SUBMISSION.md',
    intro: '비즈니스 가치를 만드는 AX 컨설턴트',
    hasSite: true,
  },
  {
    id: 'yhana972',
    name: '김나현',
    role: '팀 랜딩 페이지 제작·최종 점검',
    intro: '사용자에게 편리하고 자연스러운 경험을 만드는 개발자',
    hasSite: true,
  },
  {
    id: 'SIUUU1',
    name: '안시우',
    role: 'team/README.md, CODEOWNERS, Git 히스토리 증빙',
    intro: '개발·데이터·의료 도메인을 잇는 엔지니어',
    hasSite: true,
  },
];

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

document.getElementById('member-list').append(...members.map(createCard));
document.getElementById('member-count').textContent = `팀원 ${members.length}명`;
