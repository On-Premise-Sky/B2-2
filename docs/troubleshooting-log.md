# Git 트러블슈팅 기록

> 4가지 시나리오는 팀 전체가 모두 수행하고, 팀원은 각자 최소 1개 기록 작성에 참여합니다.

## 담당 현황

| 시나리오 | 명령어 | 담당자 | 상태 |
| --- | --- | --- | --- |
| 1. 최근 커밋 메시지 수정 | `git commit --amend` | | 미완료 |
| 2. 로컬 커밋 취소, 변경 유지 | `git reset --soft HEAD~1` | 김나현 | 완료 |
| 3. push된 커밋 되돌리기 | `git revert <커밋>` | | 미완료 |
| 4. 작업 보관 후 전환 | `git stash` / `git stash pop` | 안시우 | 완료 |

## 언제 무엇을 쓰나 (요약)

| 명령 | 히스토리를 바꾸나? | 쓰는 상황 |
| --- | --- | --- |
| `commit --amend` | 바꿈 (마지막 커밋 교체) | push 전, 직전 커밋 메시지·내용 수정 |
| `reset --soft HEAD~1` | 바꿈 (커밋만 취소) | push 전, 커밋을 다시 나누거나 고쳐 쓰고 싶을 때 |
| `revert` | 안 바꿈 (취소 커밋 추가) | 이미 push된 커밋을 안전하게 되돌릴 때 |
| `stash` | 커밋 없음 | 작업 중에 급히 다른 브랜치로 옮겨야 할 때 |

---

## 시나리오 1. `git commit --amend`

- **작성자 / 역할**:
- **상황**:
- **절차**:

```bash
```

- **결과** (전/후 `git log --oneline`):
- **주의점**: push한 커밋을 amend하면 강제 push가 필요하므로, 공유 브랜치에서는 하지 않습니다.

## 시나리오 2. `git reset --soft HEAD~1`

- **작성자 / 역할**: 김나현 / 팀 랜딩 페이지 제작 및 실습
- **상황**: 랜딩 페이지의 CSS와 JS를 하나의 로컬 커밋(`71d9ca1`)에 담았다가, 변경 목적별로 커밋을 나누기 위해 `git reset --soft HEAD~1`을 실행했습니다.
- **절차**: reset 전후에 `git log -2 --oneline`과 `git status --short`를 확인했습니다. 이후 `git restore --staged`로 두 파일의 스테이징을 풀고, 파일별로 다시 `git add`와 `git commit`을 실행했습니다.

```bash
# CSS와 JS를 한 커밋에 담고 상태 확인
git add -- src/css/style.css src/js/members.js
git commit -m "feat: 랜딩 스타일과 팀원 카드 렌더링 추가"
git log -2 --oneline
git status --short

# 마지막 커밋을 취소하고 스테이징 상태 확인
git reset --soft HEAD~1
git log -2 --oneline
git status --short
git diff --cached --name-only

# 스테이징을 풀고 파일별로 커밋
git restore --staged -- src/css/style.css src/js/members.js
git add -- src/css/style.css
git commit -m "feat: 팀 랜딩 페이지 스타일 추가"
git add -- src/js/members.js
git commit -m "feat: 팀원 데이터와 카드 렌더링 추가"
git log -3 --oneline
```

- **결과**: `git reset --soft HEAD~1` 실행 후 `HEAD`가 `71d9ca1`에서 `c5c3872`로 돌아갔습니다. CSS와 JS 파일은 스테이징에 남아 있었고, 이후 각각 별도 커밋으로 나눴습니다.

  **실행 전** — CSS와 JS가 `71d9ca1` 커밋 하나에 들어 있었습니다.

  ```text
  71d9ca1 (HEAD -> feature/yhana972-landing) feat: 랜딩 스타일과 팀원 카드 렌더링 추가
  c5c3872 (origin/main, origin/HEAD) Merge pull request #16 from On-Premise-Sky/feature/sw0410-site
  ```

  **실행 후** — `HEAD`가 이전 커밋으로 돌아갔고, `git status --short`에서 두 파일이 `A`로 표시되어 스테이징에 남아 있음을 확인했습니다. HTML 파일은 미추적 상태(`??`)였습니다.

  ```text
  c5c3872 (HEAD -> feature/yhana972-landing, origin/main, origin/HEAD) Merge pull request #16 from On-Premise-Sky/feature/sw0410-site
  e8dbae4 Merge pull request #9 from On-Premise-Sky/fix/sw0410-task-template-branch
  ```

  ```text
  A  src/css/style.css
  A  src/js/members.js
  ?? src/index.html
  ```

  **커밋 분리 후** — CSS는 `ac7741b`, JS는 `d86ad3d`로 각각 커밋했습니다.

  ```text
  d86ad3d (HEAD -> feature/yhana972-landing) feat: 팀원 데이터와 카드 렌더링 추가
  ac7741b feat: 팀 랜딩 페이지 스타일 추가
  c5c3872 (origin/main, origin/HEAD) Merge pull request #16 from On-Premise-Sky/feature/sw0410-site
  ```
- **주의점**: 아직 push하지 않은 로컬 커밋에서 실습했습니다. 이미 공유한 커밋을 취소할 때는 `git revert`를 사용합니다.
- **파일 구조 변경 안내**: 이 기록의 `src/js/members.js`는 실습 당시 경로입니다. `src/data/members.json`과 `src/js/render.js`로 나누는 후속 변경 내용은 [PR #27](https://github.com/On-Premise-Sky/B2-2/pull/27)을 참고합니다.

## 시나리오 3. `git revert`

- **작성자 / 역할**:
- **상황**:
- **절차**:

```bash
```

- **결과**:
- **주의점**: main은 보호되어 있으므로 revert도 브랜치 → PR로 반영합니다.

## 시나리오 4. `git stash` / `git stash pop`

- **작성자 / 역할**: 안시우 / `team/README.md` 담당
- **상황**: `team/README.md`에 팀 소개 랜딩 페이지로 이동하는 링크를 추가하려고 파일을 고쳤는데, 작업을 시작할 때 브랜치를 만들지 않아 `main`에서 수정하고 있었습니다. 팀 규칙상 `main`에 직접 반영하지 않고 PR을 거쳐야 하므로, 변경을 보존하면서 올바른 브랜치로 옮겨야 했습니다.
- **절차**: `git stash push`로 변경을 보관하고, `git stash list`로 보관 여부를 확인했습니다. 작업 브랜치를 새로 만든 뒤 `git stash pop`으로 복원했습니다.

```bash
# 실수를 발견한 지점: main에서 파일을 고치고 있었다
git branch --show-current
git status --short

# 변경을 보관하고 작업 트리를 비운다
git stash push -m "team/README.md 랜딩 페이지 링크 추가"
git stash list
git status --short

# 올바른 작업 브랜치를 만들고 변경을 되돌려 놓는다
git switch -c fix/SIUUU1-team-readme-link
git stash pop
git stash list
git status --short
```

- **결과**: 변경을 그대로 유지한 채 `main`에서 작업 브랜치로 옮겼습니다.

  **보관** — 작업 트리가 비워졌고 보관 목록에 1건이 생겼습니다.

  ```text
  Saved working directory and index state On main: team/README.md 랜딩 페이지 링크 추가
  ```

  ```text
  stash@{0}: On main: team/README.md 랜딩 페이지 링크 추가
  ```

  이 시점에 `git status --short`는 아무것도 출력하지 않았습니다. 변경이 작업 트리에서 보관 목록으로 옮겨졌다는 뜻입니다.

  **복원** — 새 브랜치에서 변경이 되살아나고, 보관 항목은 목록에서 제거됐습니다.

  ```text
  현재 브랜치 fix/SIUUU1-team-readme-link
  커밋하도록 정하지 않은 변경 사항:
  	수정함:        team/README.md

  Dropped refs/stash@{0} (b5d43f977104cf516156b773e50311735b08552c)
  ```

  복원 후 `git stash list`는 비어 있었고, `git status --short`는 `M team/README.md`를 출력했습니다. `git diff`로 링크 한 줄이 그대로 남아 있는 것을 확인했습니다.

- **주의점**:
  - `git stash`는 현재 브랜치의 커밋 이력을 변경하지 않습니다. 보관한 변경은 `refs/stash`에 별도로 쌓이므로 공유 브랜치에서도 안전합니다.
  - `pop`은 복원하면서 보관 항목을 **삭제**합니다. 같은 변경을 여러 브랜치에 적용해야 하면 항목을 남기는 `git stash apply`를 쓰고, 끝난 뒤 `git stash drop`으로 지웁니다.
  - 미추적 파일(`??`)은 기본적으로 보관되지 않습니다. 새로 만든 파일까지 함께 옮기려면 `git stash push -u`를 사용합니다.
  - 보관할 때 `-m`으로 설명을 남기면 나중에 `git stash list`에서 무엇을 보관했는지 알 수 있습니다. 설명이 없으면 `WIP on <브랜치>`로만 표시됩니다.
  - 복원할 브랜치에서 같은 파일이 이미 달라져 있으면 `pop` 단계에서 충돌이 납니다. 그때는 충돌을 해결한 뒤 `git stash drop`으로 항목을 정리합니다.
