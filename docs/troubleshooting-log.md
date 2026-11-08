# Git 트러블슈팅 기록

> 4가지 시나리오는 팀 전체가 모두 수행하고, 팀원은 각자 최소 1개 기록 작성에 참여합니다.

## 담당 현황

| 시나리오 | 명령어 | 담당자 | 상태 |
| --- | --- | --- | --- |
| 1. 최근 커밋 메시지 수정 | `git commit --amend` | | 미완료 |
| 2. 로컬 커밋 취소, 변경 유지 | `git reset --soft HEAD~1` | 김나현 | 완료 |
| 3. push된 커밋 되돌리기 | `git revert <커밋>` | | 미완료 |
| 4. 작업 보관 후 전환 | `git stash` / `git stash pop` | | 미완료 |

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

- **결과**: 실수 커밋은 히스토리에 그대로 남고, 그 변경을 지우는 커밋 `<431aadb>`가 새로 추가되었습니다. README.md는 #24 이전 상태로 돌아갔습니다.

  ```text
  <431aadb> (HEAD -> fix/sw0410-revert-temp-note) fix: README 임시 메모 되돌리기
  c558951 (origin/main, origin/HEAD, main) Merge pull request #24 from On-Premise-Sky/docs/sw0410-temp-note
  ```

- **주의점**: main은 보호되어 있으므로 revert도 브랜치 → PR로 반영합니다. `revert`는 push된 커밋에, `reset`은 push 전 로컬 커밋에만 씁니다. revert 커밋도 팀 컨벤션(`type: 설명`)을 따르고, 되돌린 커밋 번호는 본문에 남깁니다.

## 시나리오 4. `git stash` / `git stash pop`

- **작성자 / 역할**:
- **상황**:
- **절차**:

```bash
```

- **결과**:
- **주의점**:
