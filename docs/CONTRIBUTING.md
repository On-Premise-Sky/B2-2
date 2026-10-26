# 협업 가이드 (CONTRIBUTING)

## 0. 작업 흐름 한눈에 보기

1. Issue 생성 (작업 1개 = Issue 1개)
2. `main`에서 브랜치 생성: `git switch -c feature/<이슈번호>-<설명>`
3. 컨벤션에 맞춰 커밋
4. push 후 PR 생성 (본문에 `Closes #이슈번호`)
5. 리뷰 1명 이상 승인 → 작성자가 merge
6. merge 후 로컬 브랜치 정리: `git switch main && git pull && git branch -d <브랜치>`

## 1. 브랜치 네이밍 규칙

형식: `<type>/<이슈번호>-<짧은-설명>` (영문 소문자, 단어는 `-`로 연결)

| type | 용도 | 예시 |
| --- | --- | --- |
| `feature` | 기능·결과물 추가 | `feature/3-add-team-intro` |
| `fix` | 잘못된 내용 수정 | `fix/8-readme-link` |
| `docs` | 문서 작업 | `docs/5-contributing-review-rule` |

- `main`에 직접 push 하지 않습니다 (Branch Protection으로 막혀 있음).
- 브랜치는 merge 후 삭제합니다.

## 2. 커밋 메시지 컨벤션

형식: `<type>: <무엇을 바꿨는지>` (한글 가능, 50자 이내)

| type | 의미 |
| --- | --- |
| `feat` | 새 기능 / 결과물 추가 |
| `fix` | 오류 수정 |
| `docs` | 문서 추가·수정 |
| `refactor` | 동작 변화 없는 구조 개선 |
| `chore` | 설정, 폴더 구조 등 기타 |

좋은 예:
- `docs: CONTRIBUTING에 리뷰 최소 기준 추가`
- `feat: 홍길동 팀 소개 파일 추가`
- `fix: README의 conflict 문서 링크 경로 수정`

금지 (의미 없는 메시지):
- 대상을 알 수 없는 단어만: `update`, `fix`, `temp`, `wip`, `final`
- 무엇을/왜가 없는 것: `bug fix`, `edit file`

## 3. PR 작성 규칙

- 제목: 커밋 컨벤션과 같은 형식 (`docs: ...`)
- 본문은 템플릿(`.github/pull_request_template.md`)을 따르며 아래 3가지는 필수
  - **What**: 무엇을 바꿨는지
  - **Why**: 왜 바꿨는지
  - **How**: 어떻게 확인했는지 (미리보기, 실행 결과 등)
- 본문에 `Closes #이슈번호` 포함
- PR은 작게: 한 PR에 한 가지 목적

## 4. 코드 리뷰 규칙

- 모든 PR은 최소 1명 승인 후 merge
- 리뷰어는 "LGTM"만 남기지 않고 **실질 코멘트 1개 이상** 작성
  - 특정 라인/파일을 근거로 한 질문, 대안 제안, 리스크 지적, 개선 제안
- 작성자는 모든 코멘트에 답글 또는 수정 커밋으로 응답 (상호작용 기록 남기기)
- 리뷰 요청 후 24시간 안에 리뷰하기 (팀 합의 필요)
- 말투: 사람이 아니라 코드에 대해 말하기, 제안은 이유와 함께

## 5. 충돌 발생 시 대응 흐름

| 단계 | 누가 | 어떻게 |
| --- | --- | --- |
| 1. 발견 | PR 작성자 | PR에 "conflicts" 표시 확인 또는 merge 시 충돌 |
| 2. 공유 | PR 작성자 | 팀 채널에 충돌 파일과 상대 PR 공유 |
| 3. 해결 | PR 작성자 (필요하면 상대 작성자와 함께) | 로컬에서 `git pull origin main` → 마커 정리 → 커밋 |
| 4. 확인 | 리뷰어 | 해결 결과가 양쪽 의도를 모두 반영했는지 리뷰 |
| 5. 기록 | 해결한 사람 | `docs/conflict-resolution.md`에 템플릿대로 기록 |

주의: 공유 브랜치(`main`)에는 `--force` push, rebase 금지. 개인 feature 브랜치의 히스토리 정리는 팀에 먼저 알린 뒤 진행합니다.
