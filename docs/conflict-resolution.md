# 충돌 해결 기록

> 팀 기준: 최소 2회, 그중 1회 이상은 비자명 충돌
> (같은 hunk를 서로 다르게 수정 / 한쪽은 파일 이동·삭제, 다른 쪽은 내용 수정)

## 현황

| # | 날짜 | 유형 | 관련 PR | 해결자 | 비자명? |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-11-07 | 같은 위치에 팀원 행 추가 | [#14](https://github.com/On-Premise-Sky/B2-2/pull/14), [#18](https://github.com/On-Premise-Sky/B2-2/pull/18) | 김나현 | 예 |
| 2 | 2026-11-07 | 같은 hunk의 팀원 표 행 추가 + 빈 행·머리글 정리 | [#15](https://github.com/On-Premise-Sky/B2-2/pull/15) | 안시우 | 예 |
| 3 | 2026-11-07 | 같은 hunk의 팀원 표 행 추가 (2개 파일) | [#18](https://github.com/On-Premise-Sky/B2-2/pull/18) | 김영운 | 예 |
| 4 | 2026-11-08 | 파일 삭제·분리 vs 같은 파일 내용 수정 (modify/delete) | [#34](https://github.com/On-Premise-Sky/B2-2/pull/34) (main 쪽: [#27](https://github.com/On-Premise-Sky/B2-2/pull/27)) | 이승우 | 예 |

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

---

### 충돌 #2: 팀원 표 두 파일 동시 충돌과 누적 정리 병합

- **날짜**: 2026-11-07
- **관련 브랜치 / PR**: `feature/SIUUU1-site` ↔ `origin/main` / [#15](https://github.com/On-Premise-Sky/B2-2/pull/15)
- **참여자**: 작성자 안시우, main 쪽 변경 이승우·김영운·김나현, 리뷰어 김나현
- **유형**: 같은 hunk에 서로 다른 팀원 행 추가 (2개 파일 동시) + 한쪽은 빈 행 삭제, 다른 쪽은 같은 블록에 행 추가

#### 1. 상황 (어떻게 충돌이 생겼나)

팀이 정한 병합 순서 A → B → C → D에서 저는 마지막 순서였습니다. 네 명이 모두 같은 커밋 `6ddd574`에서 분기해 각자 두 개의 같은 파일을 고쳤기 때문에, 앞의 세 PR(#16, #18, #14)이 병합된 main을 받아오는 시점에 충돌이 발생했습니다.

충돌 #1과 달리 이번에는 **두 파일이 동시에 충돌**했고, 루트 `README.md`에서는 단순한 행 추가 충돌이 아니었습니다. 제 브랜치는 빈 행 하나를 삭제하고 그 자리에 제 행을 넣었고, main 쪽은 빈 행을 남긴 채 표 맨 아래에 행을 추가했기 때문에, 같은 블록에 대해 **삭제와 추가가 맞물린 충돌**이 되었습니다.

- 병합 전 HEAD: `9956516c2775e853ac76c1d96510167b72241714`
- 가져온 main: `7569ac29ec749c4090323b47039d4ef9c9c61d91`

#### 2. 재현 절차

실제로 실행한 명령과 출력은 다음과 같습니다.

```bash
git switch feature/SIUUU1-site
git fetch origin
git merge origin/main
```

```text
자동 병합: README.md
충돌 (내용): README.md에 병합 충돌
자동 병합: team/README.md
충돌 (내용): team/README.md에 병합 충돌
자동 병합이 실패했습니다. 충돌을 바로잡고 결과물을 커밋하십시오.
```

`git status --short`에서 충돌 파일은 두 개로 표시됐습니다. 나머지는 main에서 정상 병합된 변경 파일입니다.

```text
UU README.md
UU team/README.md
```

같은 충돌을 나중에 재현하려면 작업을 모두 커밋한 상태의 별도 실습 브랜치에서 아래 고정 커밋을 사용합니다.

```bash
git switch -c practice/SIUUU1-conflict-replay 9956516c2775e853ac76c1d96510167b72241714
git merge --no-commit 7569ac29ec749c4090323b47039d4ef9c9c61d91
# 충돌 상태를 확인한 뒤 재현 실습을 종료
git merge --abort
```

#### 3. 충돌 내용

`README.md` — HEAD 쪽은 빈 행 하나를 삭제하고 안시우 행을 넣었고, main 쪽은 빈 행을 남긴 채 김나현 행을 추가했습니다.

```text
|  | @ | |
|  | @ | |
<<<<<<< HEAD
|  | @ | |
| 안시우 | [@SIUUU1](https://github.com/SIUUU1) | team/README.md, CODEOWNERS, Git 히스토리 증빙 |
=======
| 김나현 | [@yhana972](https://github.com/yhana972) | 팀 랜딩 페이지 제작·최종 점검|
>>>>>>> origin/main
```

`team/README.md` — HEAD 쪽은 안시우 행 하나, main 쪽은 먼저 병합된 세 명의 행입니다.

```text
<<<<<<< HEAD
| 안시우 | [@SIUUU1](https://github.com/SIUUU1) | 개발·데이터·의료 도메인을 잇는 엔지니어 | [개인 사이트](SIUUU1/) |
=======
| 이승우 | [@sw0410](https://github.com/sw0410) | 동료와 함께 자라는 개발자 | [개인 사이트](sw0410/) |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 비즈니스 가치를 만드는 AX 컨설턴트 | [개인 사이트](ktheodoreyw/) |
| 김나현 | [@yhana972](https://github.com/yhana972) | 사용자에게 편리하고 자연스러운 경험을 만드는 개발자 | [개인 사이트](yhana972/) |
>>>>>>> origin/main
```

#### 4. 해결 방법과 이유

네 명의 정보가 모두 유효하므로 양쪽을 보존하는 keep both로 수동 편집하고, 팀이 정한 A → B → C → D 순서로 배치했습니다.

여기에 더해, PR #14 리뷰에서 합의한 **누적 정리 세 가지**를 이 병합 커밋에서 함께 처리했습니다. 네 명이 모두 병합된 시점이 빈 행을 없앨 수 있는 첫 시점이고, 정리를 별도 PR로 분리하면 같은 블록을 다시 고쳐 또 충돌이 나기 때문입니다.

1. 루트 `README.md`에 남아 있던 빈 행 2개 삭제
2. 표 머리글을 `이름 | GitHub | 담당` → `이름 | 깃허브 주소 | 역할`로 변경
3. 김나현 행의 닫는 파이프 앞 공백 누락(`점검|`) 수정

```markdown
| 이름 | 깃허브 주소 | 역할 |
| --- | --- | --- |
| 이승우 | [@sw0410](https://github.com/sw0410) | 저장소·보호 규칙 관리, Pages 배포 |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 미션 설계, 템플릿 제작, CONTRIBUTING 총괄, SUBMISSION.md |
| 김나현 | [@yhana972](https://github.com/yhana972) | 팀 랜딩 페이지 제작·최종 점검 |
| 안시우 | [@SIUUU1](https://github.com/SIUUU1) | team/README.md, CODEOWNERS, Git 히스토리 증빙 |
```

`team/README.md`도 같은 순서로 네 행을 배치하고, 아직 추가하지 않은 사람을 위한 예시 코드 블록은 그대로 남겼습니다.

#### 5. 결과

- 네 사람의 담당, 소개, 개인 사이트 링크를 모두 보존했습니다.
- 두 파일에서 충돌 마커가 남지 않았는지 `grep`으로 확인했습니다.
- 상대 경로 `sw0410/`, `ktheodoreyw/`, `yhana972/`, `SIUUU1/` 네 폴더에 각각 `index.html`이 존재하는지 확인했습니다.
- 루트 README 표에 빈 행이 없고 4행만 남은 것을 확인했습니다.
- 스테이징 후 미해결 파일 목록이 비었는지 확인했습니다.
- 해결 커밋은 PR #15에 포함되어 있습니다.

#### 6. 주의점 / 배운 점

- 병합 순서가 뒤일수록 받아올 변경이 누적되어 충돌 파일 수와 범위가 커집니다. 마지막 순서라면 미리 시간을 확보해두는 편이 안전합니다.
- 한쪽이 **삭제**하고 다른 쪽이 같은 블록에 **추가**하면, 행 추가끼리 부딪히는 경우보다 양쪽 의도를 읽기 어렵습니다. 마커만 지우고 한쪽을 고르면 의도가 소실되므로 원래 PR의 논의를 먼저 확인해야 합니다.
- 표 전체 정리처럼 여러 사람의 변경이 다 모인 뒤에만 가능한 작업은, 마지막 병합자가 충돌 해결과 같은 커밋에서 처리하면 같은 자리를 다시 건드리는 추가 충돌을 막을 수 있습니다. 이 방식은 PR #14 리뷰에서 미리 합의했습니다.
- 같은 파일의 맞닿은 위치를 여러 사람이 고칠 때는 누가 어느 줄을 쓸지 먼저 알리는 것이 비용이 가장 적습니다. 이 기록 파일도 요약표 행을 미리 나눠 쓰기로 공유했습니다.

---

### 충돌 #3: 사이트 PR 병합 순서로 생긴 팀원 표 두 파일 충돌

- **날짜**: 2026-11-07
- **관련 브랜치 / PR**: `feature/ktheodoreyw-site` ↔ `origin/main` / [#18](https://github.com/On-Premise-Sky/B2-2/pull/18) (main 쪽 변경: [#16](https://github.com/On-Premise-Sky/B2-2/pull/16))
- **참여자**: 작성자 김영운, main 쪽 변경 이승우, 리뷰어 김나현(승인)·이승우(사후 리뷰)
- **유형**: 같은 hunk 수정 (2개 파일: 인접한 빈 행을 서로 다른 팀원 행으로 교체 + 표 맨 아래에 서로 다른 행 추가)

#### 1. 상황 (어떻게 충돌이 생겼나)

팀이 정한 병합 순서 A → B → C → D에서 저는 B였습니다. `feature/ktheodoreyw-site`는 `e8dbae4`(PR #9 병합 시점)를 기준으로 작업했고, 그 사이 A의 PR #16이 먼저 main에 병합되었습니다. 두 브랜치가 같은 두 파일의 같은 표를 고쳤기 때문에 PR #18 병합 전에 충돌이 발생했습니다. 이 기록은 팀에서 처음 발생한 충돌이며, 이후 충돌 #1(김나현)·#2(안시우)는 이 해결 결과가 반영된 main을 받아오면서 이어졌습니다.

- 루트 `README.md`: 제 브랜치는 병합 순서에 맞추려고 첫 번째 빈 행을 비워 두고 **두 번째** 빈 행을 김영운 행으로 바꿨고(`15866dd`), main은 **첫 번째** 빈 행을 이승우 행으로 바꿨습니다. 서로 다른 줄을 고쳤지만 **바로 붙어 있는 줄**이라 Git이 같은 hunk로 보고 자동 병합하지 못했습니다.
- `team/README.md`: 양쪽 모두 표 맨 아래 같은 위치에 자기 행을 추가했습니다. 제 브랜치는 처음에 예시 코드 블록 안에 행을 넣었다가 `9a4aad0`에서 표 안으로 옮겼습니다.

- 병합 전 HEAD: `9a4aad0a463f1631261e7d29395fd2d258538a12`
- 가져온 main: `c5c3872bcdbec1bea296e38a5b477968dc143909`

#### 2. 재현 절차

병합 전에 main 쪽에서도 먼저 머지를 시도해 충돌을 확인하고, `git status`·`git diff` 출력을 저장소 밖(`~/conflict-logs/B2-2-pr18/`)에 저장한 뒤 `git merge --abort`로 되돌렸습니다. 실제 해결은 Branch Protection 규칙에 따라 PR 브랜치에서 진행했습니다.

```bash
git switch feature/ktheodoreyw-site
git fetch origin
git merge origin/main
git status --short
```

```text
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Auto-merging team/README.md
CONFLICT (content): Merge conflict in team/README.md
Automatic merge failed; fix conflicts and then commit the result.
```

`git status --short`에서 충돌 파일은 두 개로 표시됐습니다. 나머지(`team/sw0410/` 폴더)는 main에서 정상 병합된 변경 파일입니다.

```text
UU README.md
UU team/README.md
```

같은 충돌을 나중에 재현하려면 작업을 모두 커밋한 상태의 별도 실습 브랜치에서 아래 고정 커밋을 사용합니다.

```bash
git switch -c practice/ktheodoreyw-conflict-replay 9a4aad0a463f1631261e7d29395fd2d258538a12
git merge --no-commit c5c3872bcdbec1bea296e38a5b477968dc143909
# 충돌 상태를 확인한 뒤 재현 실습을 종료
git merge --abort
```

#### 3. 충돌 내용

`README.md` — HEAD 쪽은 첫 번째 빈 행을 남기고 두 번째 자리에 김영운 행을, origin/main 쪽은 첫 번째 자리에 이승우 행을 넣고 두 번째 빈 행을 남겼습니다.

```text
<<<<<<< HEAD
|  | @ | |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 미션 설계, 템플릿 제작, CONTRIBUTING 총괄, SUBMISSION.md |
=======
| 이승우 | [@sw0410](https://github.com/sw0410) | 저장소·보호 규칙 관리, Pages 배포 |
|  | @ | |
>>>>>>> origin/main
```

`team/README.md` — HEAD 쪽은 김영운 행, origin/main 쪽은 먼저 병합된 이승우 행입니다.

```text
<<<<<<< HEAD
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 비즈니스 가치를 만드는 AX 컨설턴트 | [개인 사이트](ktheodoreyw/) |
=======
| 이승우 | [@sw0410](https://github.com/sw0410) | 동료와 함께 자라는 개발자 | [개인 사이트](sw0410/) |
>>>>>>> origin/main
```

#### 4. 해결 방법과 이유

두 사람의 정보가 모두 유효하므로 양쪽을 보존하는 keep both 방식으로 수동 편집했습니다. 충돌 마커를 제거하고 팀이 정한 병합 순서대로 이승우(A) → 김영운(B)으로 배치했습니다.

루트 `README.md`에서는 양쪽에 하나씩 남아 있던 빈 행 중 HEAD 쪽 빈 행은 이승우 행이 차지했으므로 제거하고, main 쪽 빈 행은 C·D가 사용할 자리로 남겨 빈 행이 원래대로 2개가 되도록 맞췄습니다. 표 머리글·빈 행 정리는 마지막 병합(D) 때 처리하기로 한 합의에 따라 이 단계에서는 하지 않았습니다.

```markdown
| 이름 | GitHub | 담당 |
| --- | --- | --- |
| 이승우 | [@sw0410](https://github.com/sw0410) | 저장소·보호 규칙 관리, Pages 배포 |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 미션 설계, 템플릿 제작, CONTRIBUTING 총괄, SUBMISSION.md |
|  | @ | |
|  | @ | |
```

`team/README.md`도 같은 순서로 두 행을 배치하고, 아래 예시 코드 블록은 그대로 남겼습니다.

```markdown
| 이름 | GitHub | 한 줄 소개 | 사이트 |
| --- | --- | --- | --- |
| 이승우 | [@sw0410](https://github.com/sw0410) | 동료와 함께 자라는 개발자 | [개인 사이트](sw0410/) |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 비즈니스 가치를 만드는 AX 컨설턴트 | [개인 사이트](ktheodoreyw/) |
```

#### 5. 결과

- 해결 커밋: `3af48c3` (`Merge remote-tracking branch 'origin/main' into feature/ktheodoreyw-site`), PR 병합 커밋: `3adf7d4`
- 두 사람의 담당, 소개, 개인 사이트 링크를 모두 보존했습니다.
- 두 파일에서 충돌 마커가 남지 않았는지 `grep`으로 확인했습니다.
- `git diff origin/main -- README.md team/README.md`로 main 대비 김영운 행만 추가되었는지 확인했습니다.
- 상대 경로 `sw0410/`, `ktheodoreyw/` 각각에 `index.html`이 존재하는지 확인했습니다.
- 스테이징 후 미해결 파일 목록이 비었는지 확인했습니다.

#### 6. 주의점 / 배운 점

- 서로 **다른 줄**을 고쳐도 그 줄들이 **바로 붙어 있으면** Git은 같은 hunk로 보고 충돌을 냅니다. 병합 순서를 예상해 미리 두 번째 빈 행에 넣어 두었지만 충돌을 피하지 못했습니다.
- 충돌 마커의 HEAD는 "지금 내가 있는 브랜치"입니다. main에서 머지하면 HEAD가 main, PR 브랜치에서 머지하면 HEAD가 내 브랜치가 되어 위아래가 반대로 나오므로, 기록할 때 어느 쪽에서 머지했는지 함께 적어야 합니다.
- 충돌 출력은 저장소 밖에 저장해야 기록용 파일이 실수로 커밋되지 않습니다.
- main을 직접 수정하지 않고 PR 브랜치에서 main을 받아 해결한 뒤 push하면, 해결 과정이 PR 안에서 리뷰되고 Branch Protection 규칙도 지킬 수 있습니다.

---

### 충돌 #4: members.js 삭제·분리와 같은 파일 수정의 modify/delete 충돌

- **날짜**: 2026-11-08
- **관련 브랜치 / PR**: `feature/sw0410-member-github` ↔ `origin/main` / [#34](https://github.com/On-Premise-Sky/B2-2/pull/34) (main 쪽 변경: [#27](https://github.com/On-Premise-Sky/B2-2/pull/27))
- **참여자**: 작성자 이승우, main 쪽 변경 안시우, 리뷰어 안시우
- **유형**: 파일 삭제·이동 vs 내용 수정 (modify/delete)

#### 1. 상황 (어떻게 충돌이 생겼나)

계획표 5번(충돌 2 수정 측)입니다. 랜딩 PR #22와 CODEOWNERS PR #20이 머지된 같은 커밋 `1b520eb`에서 저와 안시우님이 함께 분기했습니다.

- 안시우님(#27): `src/js/members.js`를 **삭제**하고, 데이터는 `src/data/members.json`, 카드 렌더링은 `src/js/render.js`로 분리했습니다.
- 저(#34): 같은 `src/js/members.js`에서 팀원 데이터에 `github` 필드를 추가하고, `createCard`에서 `@아이디`를 GitHub 프로필 링크로 바꿨습니다(`8869a8d`).

#27이 먼저 머지된 뒤 제 브랜치로 main을 받아오자, "main은 지운 파일을 나는 고쳤다"는 modify/delete 충돌이 났습니다. 같은 줄을 다르게 고친 내용 충돌과 달리 충돌 마커가 없고, 파일을 남길지 지울지를 사람이 정해야 합니다.

- 병합 전 HEAD: `8869a8d5fa83c9f4cdadde8fa7f6c1da250e7e64`
- 가져온 main: `d0819487c829ea0104771cd3d0c937de79b6616c`

#### 2. 재현 절차

```bash
git switch feature/sw0410-member-github
git fetch origin
git merge origin/main
git status
```

```text
CONFLICT (modify/delete): src/js/members.js deleted in origin/main and modified in HEAD.  Version HEAD of src/js/members.js left in tree.
Automatic merge failed; fix conflicts and then commit the result.
```

같은 충돌을 다시 만들려면 작업을 모두 커밋한 상태에서 아래 고정 커밋을 씁니다. 커밋 번호로 머지하므로 메시지의 `origin/main` 자리에 커밋 번호가 표시됩니다.

```bash
git switch -c practice/sw0410-conflict-replay 8869a8d5fa83c9f4cdadde8fa7f6c1da250e7e64
git merge --no-commit d0819487c829ea0104771cd3d0c937de79b6616c
# 충돌 상태를 확인한 뒤 재현 실습을 종료
git merge --abort
```

#### 3. 충돌 내용

마커 대신 `git status`에 미해결 파일로 표시됐습니다. them은 받아온 main, HEAD는 제 브랜치입니다. Git은 판단을 미루고 제 버전의 `members.js`를 작업 트리에 남겨 두었습니다.

```text
Changes to be committed:
        modified:   docs/troubleshooting-log.md
        new file:   src/data/members.json
        modified:   src/index.html
        new file:   src/js/render.js

Unmerged paths:
  (use "git add/rm <file>..." as appropriate to mark resolution)
        deleted by them: src/js/members.js
```

#### 4. 해결 방법과 이유

파일을 분리한 main의 구조가 이후 기준이므로 **삭제는 그대로 따르고**, 제 변경만 새 위치로 옮겼습니다. `git add src/js/members.js`로 파일을 되살리면 사용하지 않는 옛 파일이 다시 생기고 데이터가 두 곳에 나뉘므로 선택하지 않았습니다.

- 데이터: 4명 모두 `"hasSite": true` 위에 `"github": "https://github.com/<id>",` 추가 → `src/data/members.json`. JSON은 마지막 항목 뒤 쉼표를 허용하지 않으므로 `hasSite` 앞에 넣어 기존 줄을 건드리지 않았습니다.
- 렌더링: `createCard`의 `@아이디`를 `<a>`로 만들고 `href`, `target="_blank"`, `rel="noopener"` 지정 → `src/js/render.js`
- `git rm src/js/members.js`로 삭제를 확정하고, 두 파일을 `git add`했습니다.

`src/data/members.json` (한 명 예시)

```json
{
  "id": "sw0410",
  "name": "이승우",
  "role": "저장소·보호 규칙 관리, Pages 배포",
  "intro": "동료와 함께 자라는 개발자",
  "github": "https://github.com/sw0410",
  "hasSite": true
}
```

`src/js/render.js`의 `createCard` 안

```js
const handle = createText('a', 'member-handle', `@${id}`);
handle.href = github;
handle.target = '_blank';
handle.rel = 'noopener';
```

#### 5. 결과

- 해결 커밋: `56c2efd`
- `git status`에서 `All conflicts fixed but you are still merging.` 확인 후 커밋했습니다.
- `members.json`이 `fetch`로 읽히므로 `python -m http.server`로 `src/`를 열어 카드 4개 표시, `@아이디` 클릭 시 각자 GitHub 프로필이 새 탭으로 열리는 것을 확인했습니다.
- 리뷰 반영(`e4b6497`): `<p>`가 `<a>`로 바뀌며 `.member-link`에만 있던 hover·focus-visible 스타일을 `.member-handle`에도 적용했고, 외곽선이 카드 폭 전체로 늘어나지 않게 `align-self: flex-start`를 넣었습니다.

#### 6. 주의점 / 배운 점

- modify/delete 충돌은 마커가 없어 파일을 열어도 표시가 안 보입니다. `git status`의 `deleted by them / deleted by us`로 파악해야 합니다.
- 해결은 "파일을 남길지 지울지"를 고르는 것으로 끝나지 않습니다. 삭제된 파일의 내용이 어디로 옮겨졌는지 상대 PR에서 확인하고, 내 변경을 그 위치에 다시 적용해야 의도가 사라지지 않습니다.
- 이 충돌은 상대가 머지하기 **전에** 같은 커밋에서 분기해야 생깁니다. 분기 직후 채널에 알려 순서를 맞췄습니다.
- 공유 기록 파일의 붙은 줄(요약표 다음 행, 파일 끝)은 앞 기록(#30)이 머지된 뒤 최신 main 위에서 써야 기록끼리 다시 충돌하지 않습니다.
