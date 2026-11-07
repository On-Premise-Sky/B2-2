# 충돌 해결 기록

> 팀 기준: 최소 2회, 그중 1회 이상은 비자명 충돌
> (같은 hunk를 서로 다르게 수정 / 한쪽은 파일 이동·삭제, 다른 쪽은 내용 수정)

## 현황

| # | 날짜 | 유형 | 관련 PR | 해결자 | 비자명? |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-11-07 | 같은 위치에 팀원 행 추가 | [#14](https://github.com/On-Premise-Sky/B2-2/pull/14), [#18](https://github.com/On-Premise-Sky/B2-2/pull/18) | 김나현 | 예 |
| 2 | | | # | | |

---

## 기록 템플릿 (복사해서 사용)

### 충돌 #N: <한 줄 요약>

- **날짜**:
- **관련 브랜치 / PR**: `feature/...` ↔ `feature/...` / #
- **참여자**: (작성자, 상대, 리뷰어)
- **유형**: 같은 hunk 수정 / 파일 이동·삭제 vs 내용 수정 / 기타

#### 1. 상황 (어떻게 충돌이 생겼나)

#### 2. 재현 절차

```bash
# 충돌을 다시 만들 수 있는 명령어 순서
```

#### 3. 충돌 내용

```text
<<<<<<< HEAD
(내 쪽 내용)
=======
(main 쪽 내용)
>>>>>>> main
```

- `<<<<<<<` ~ `=======`: 현재 브랜치(HEAD) 쪽 변경
- `=======` ~ `>>>>>>>`: 합치려는 브랜치 쪽 변경

#### 4. 해결 방법과 이유

#### 5. 결과

- 해결 커밋:
- 최종 반영된 내용:

#### 6. 주의점 / 배운 점

---

### 충돌 #1: 팀원 소개 표의 같은 위치에 추가된 행 병합

- **날짜**: 2026-11-07
- **관련 브랜치 / PR**: `feature/yhana972-site` ↔ `origin/main` / [#14](https://github.com/On-Premise-Sky/B2-2/pull/14), [#18](https://github.com/On-Premise-Sky/B2-2/pull/18)
- **참여자**: 작성자 김나현, main 쪽 변경 이승우·김영운, 리뷰 요청 대상 이승우
- **유형**: 같은 hunk에 서로 다른 팀원 행 추가

#### 1. 상황 (어떻게 충돌이 생겼나)

개인 사이트 브랜치의 `team/README.md`에는 김나현 행을 추가했고, A와 B의 사이트 PR이 병합된 main에는 같은 표 위치에 이승우·김영운 행이 추가되어 있었습니다. B의 PR #18 병합 후 최신 main을 받아오면서 내용 충돌이 발생했습니다. 루트 `README.md`는 자동 병합되었으며 실제 충돌 파일은 `team/README.md` 한 개였습니다.

- 병합 전 HEAD: `d18710a075c324f0e924cd9c0001da7713bfec16`
- 가져온 main: `3adf7d469749ee6cd7e07741c26293ea8e7ece78`

#### 2. 재현 절차

실제로 실행한 명령과 출력은 다음과 같습니다.

```bash
git switch feature/yhana972-site
git fetch origin
git merge origin/main
git status --short
```

```text
Auto-merging README.md
Auto-merging team/README.md
CONFLICT (content): Merge conflict in team/README.md
Automatic merge failed; fix conflicts and then commit the result.
```

`git status --short`에서 충돌 파일은 다음과 같이 표시됐습니다. 나머지는 main에서 정상적으로 병합된 변경 파일이었습니다.

```text
UU team/README.md
```

같은 충돌을 나중에 재현하려면 작업을 모두 커밋한 상태의 별도 실습 브랜치에서 아래 고정 커밋을 사용합니다.

```bash
git switch -c practice/yhana972-conflict-replay d18710a075c324f0e924cd9c0001da7713bfec16
git merge --no-commit 3adf7d469749ee6cd7e07741c26293ea8e7ece78
# 충돌 상태를 확인한 뒤 재현 실습을 종료
git merge --abort
```

#### 3. 충돌 내용

```text
<<<<<<< HEAD
| 김나현 | [@yhana972](https://github.com/yhana972) | 사용자에게 편리하고 자연스러운 경험을 만드는 개발자 | [개인 사이트](yhana972/) |
=======
| 이승우 | [@sw0410](https://github.com/sw0410) | 동료와 함께 자라는 개발자 | [개인 사이트](sw0410/) |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 비즈니스 가치를 만드는 AX 컨설턴트 | [개인 사이트](ktheodoreyw/) |
>>>>>>> origin/main
```

HEAD 쪽은 개인 사이트 브랜치의 김나현 행이고, origin/main 쪽은 먼저 병합된 이승우·김영운 행입니다.

#### 4. 해결 방법과 이유

세 행 모두 유효한 팀원 정보이므로 양쪽 내용을 보존하는 keep both 방식으로 수동 편집했습니다. 충돌 마커를 제거하고 팀이 정한 A → B → C 순서로 배치했습니다. 루트 README의 빈 행과 머리글 정리는 D의 마지막 병합 때 처리하기로 한 합의를 따랐습니다.

```markdown
| 이름 | GitHub | 한 줄 소개 | 사이트 |
| --- | --- | --- | --- |
| 이승우 | [@sw0410](https://github.com/sw0410) | 동료와 함께 자라는 개발자 | [개인 사이트](sw0410/) |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 비즈니스 가치를 만드는 AX 컨설턴트 | [개인 사이트](ktheodoreyw/) |
| 김나현 | [@yhana972](https://github.com/yhana972) | 사용자에게 편리하고 자연스러운 경험을 만드는 개발자 | [개인 사이트](yhana972/) |
```

#### 5. 결과

- 세 사람의 소개와 개인 사이트 링크를 보존했습니다.
- 표 머리글과 구분선, A → B → C 행 순서를 확인했습니다.
- 상대 경로 `sw0410/`, `ktheodoreyw/`, `yhana972/` 각각에 `index.html`이 존재하는지 확인했습니다.
- 해결 후 README 두 파일에서 충돌 마커가 제거되었는지, 스테이징 후 미해결 파일 목록이 비었는지 확인했습니다.
- 브라우저 실행 검증은 이 충돌 해결 단계에서는 수행하지 않았습니다.
- 해결 커밋은 PR #14의 `fix: 팀원 소개 표 충돌 해결 및 재현 기록 추가` 병합 커밋에서 확인할 수 있습니다.

#### 6. 주의점 / 배운 점

- 서로 다른 브랜치라도 같은 파일의 같은 위치에 내용을 추가하면 충돌할 수 있습니다.
- 한쪽 내용만 선택하면 다른 팀원 정보가 사라지므로 두 변경의 의도를 먼저 확인해야 합니다.
- 충돌 해결 전에 상태와 마커를 기록해야 실제 충돌을 재현하고 설명할 수 있습니다.
- main을 직접 수정하거나 강제 push하지 않고 개인 사이트 브랜치에서 병합과 해결을 진행했습니다.
