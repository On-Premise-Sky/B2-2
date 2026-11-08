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

## 시나리오 3. `git revert`

- **작성자 / 역할**:
- **상황**:
- **절차**:

```bash
```

- **결과**:
- **주의점**: main은 보호되어 있으므로 revert도 브랜치 → PR로 반영합니다.

## 시나리오 4. `git stash` / `git stash pop`

- **작성자 / 역할**:
- **상황**:
- **절차**:

```bash
```

- **결과**:
- **주의점**:
