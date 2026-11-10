# Git 트러블슈팅 기록

> 4가지 시나리오는 팀 전체가 모두 수행하고, 팀원은 각자 최소 1개 기록 작성에 참여합니다.

## 담당 현황

| 시나리오 | 명령어 | 담당자 | 상태 |
| --- | --- | --- | --- |
| 1. 최근 커밋 메시지 수정 | `git commit --amend` | 김영운 | 완료 |
| 2. 로컬 커밋 취소, 변경 유지 | `git reset --soft HEAD~1` | 김나현 | 완료 |
| 3. push된 커밋 되돌리기 | `git revert <커밋>` | 이승우 | 완료 |
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

- **작성자 / 역할**: 김영운 / 미션 설계, CONTRIBUTING 총괄
- **상황**: 앞서 GitHub 웹 편집기의 기본 메시지(`Update docs/conflict-resolution.md`, `a31111d`)가 그대로 main에 머지되어 컨벤션을 어긴 커밋이 남았습니다. 같은 실수를 자기 브랜치에서 의도적으로 재현해(`update`), push 전에 amend로 교정했습니다.
- **절차**: `update` 커밋 후 `git log -1 --format=%p`로 부모가 1개인 일반 커밋임을 확인하고, `git status -sb`로 push 전임을 확인했습니다. amend 전후의 `git log -1`과 `git log --oneline -2` 출력은 파일로 저장해 그대로 옮겼습니다.

```bash
git add docs/troubleshooting-log.md
git commit -m "update"
git log -1 --format=%p
git status -sb
git log -1
git commit --amend -m "docs: 트러블슈팅 시나리오 1 담당자와 상황 작성"
git log -1
git log --oneline -2
```

- **결과**: 메시지가 `update`에서 컨벤션 형식으로 바뀌었고, 해시가 `d583dfd` → `5d8882c`로 바뀌었습니다. 부모 커밋(`142854d`)은 그대로입니다.

**push 전 확인** — upstream 표시가 없어 원격에 올라가지 않은 상태입니다.

```text
## docs/ktheodoreyw-amend-redo
```

**amend 전 `git log -1`**

```text
commit d583dfd393ad52196279249629c5f959ab8b4136
Author: 김영운 <k.theodore.yw@khu.ac.kr>
Date:   Tue Nov 10 14:05:16 2026 +0900

    update
```

**amend 후 `git log -1`**

```text
commit 5d8882c207131e3f74dea08e5dcfa7b0525e637a
Author: 김영운 <k.theodore.yw@khu.ac.kr>
Date:   Tue Nov 10 14:05:16 2026 +0900

    docs: 트러블슈팅 시나리오 1 담당자와 상황 작성
```

**부모 커밋 비교** — 두 출력의 둘째 줄(부모 `142854d`)이 같아 마지막 커밋 하나만 교체되었음을 확인했습니다.

```text
d583dfd update
142854d Merge pull request #41 from On-Premise-Sky/docs/sw0410-contributing-sync
```

```text
5d8882c docs: 트러블슈팅 시나리오 1 담당자와 상황 작성
142854d Merge pull request #41 from On-Premise-Sky/docs/sw0410-contributing-sync
```

- **주의점**:
  - amend는 마지막 커밋을 새 커밋으로 **교체**하므로 해시가 바뀝니다.
  - push한 뒤에 amend하면 강제 push가 필요하므로 공유 브랜치에서는 하지 않습니다. 이미 push한 커밋은 `revert`나 후속 커밋으로 바로잡습니다.
  - GitHub 웹 편집기로 커밋할 때는 기본 메시지(`Update ...`)를 지우고 컨벤션에 맞게 다시 씁니다.
  - 빠뜨린 파일은 `git add` 후 `git commit --amend --no-edit`로 메시지를 유지한 채 추가할 수 있습니다.
  - `update` 커밋이 생성되지 않은 상태(`nothing to commit`)에서 amend하면 직전 커밋인 main의 머지 커밋이 교체됩니다([#37](https://github.com/On-Premise-Sky/B2-2/pull/37)). amend 전 `git log -1`에 `Merge:` 줄이 있거나 메시지가 `update`가 아니면 중단합니다.

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

- **작성자 / 역할**: 이승우 / 저장소·보호 규칙 관리, 실습
- **상황**: 의도적 실수 PR([#24](https://github.com/On-Premise-Sky/B2-2/pull/24))로 README.md에 임시 메모를 추가해 main에 머지했습니다(`5f9df75`, 머지 커밋 `c558951`). 이미 main에 push된 커밋이라 `reset`으로 지우면 다른 팀원의 히스토리와 어긋나므로, 되돌리는 커밋을 새로 만드는 `revert`를 사용했습니다.
- **절차**: 최신 main에서 브랜치를 만들고, 머지 커밋이 아닌 실수 커밋 `5f9df75`를 되돌렸습니다. 머지 커밋은 부모가 둘이라 `-m` 옵션이 필요하지만, 실수 커밋은 부모가 하나이고 PR의 변경이 이 커밋뿐이라 결과가 같습니다. revert의 기본 메시지(`Revert "docs: README에 임시 메모 추가"`)는 커밋 컨벤션(`type: 설명`)에 맞지 않으므로(#24 리뷰 의견), `--no-commit`으로 되돌리기만 한 뒤 컨벤션에 맞춰 메시지를 직접 썼습니다. 되돌린 커밋은 본문에 적어 추적할 수 있게 했습니다.

```bash
git switch main
git pull origin main
git switch -c fix/sw0410-revert-temp-note
git revert --no-commit 5f9df75
git diff --cached          # README의 메모 두 줄만 삭제되는지 확인
git commit -m "fix: README 임시 메모 되돌리기" -m "되돌린 커밋: 5f9df75 (docs: README에 임시 메모 추가, PR #24)"
git log --oneline -2
```

- **결과**: 실수 커밋은 히스토리에 그대로 남고, 그 변경을 지우는 커밋 `431aadb`가 새로 추가되었습니다. README.md는 #24 이전 상태로 돌아갔습니다.

  ```text
  431aadb (HEAD -> fix/sw0410-revert-temp-note) fix: README 임시 메모 되돌리기
  c558951 (origin/main, origin/HEAD, main) Merge pull request #24 from On-Premise-Sky/docs/sw0410-temp-note
  ```

- **주의점**: main은 보호되어 있으므로 revert도 브랜치 → PR로 반영합니다. `revert`는 push된 커밋에, `reset`은 push 전 로컬 커밋에만 씁니다. revert 커밋도 팀 컨벤션(`type: 설명`)을 따르고, 되돌린 커밋 번호는 본문에 남깁니다.

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
