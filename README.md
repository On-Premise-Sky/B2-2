# Git 협업 미션

Git 브랜치 · PR · 코드 리뷰 · 충돌 해결 워크플로우를 팀으로 직접 경험하는 저장소입니다.

## 팀원

| 이름 | 깃허브 주소 | 역할 |
| --- | --- | --- |
| 이승우 | [@sw0410](https://github.com/sw0410) | 저장소·보호 규칙 관리, Pages 배포 |
| 김영운 | [@ktheodoreyw](https://github.com/ktheodoreyw) | 미션 설계, 템플릿 제작, CONTRIBUTING 총괄, SUBMISSION.md |
| 김나현 | [@yhana972](https://github.com/yhana972) | 팀 랜딩 페이지 제작·최종 점검 |
| 안시우 | [@SIUUU1](https://github.com/SIUUU1) | team/README.md, CODEOWNERS, Git 히스토리 증빙 |

## 브랜치 전략: GitHub Flow

> 팀 규모가 작고 배포 단계가 따로 없어서, main + feature/* 두 종류만 쓰는 GitHub Flow가 가장 단순합니다.
> 모든 변경이 PR을 거치므로 리뷰와 이슈 추적이 자연스럽게 강제됩니다.
> main은 항상 "깨지지 않는 상태"로 유지하고, 작업은 짧은 feature 브랜치에서 끝냅니다.

자세한 규칙은 [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)를 참고하세요.

## 결과물

- 팀 소개 랜딩 페이지에서 팀원 4명의 역할과 한 줄 소개를 확인하고, 각자의 개인 사이트로 이동할 수 있습니다.
- [랜딩 페이지 소스](src/index.html)
- [팀원별 소개 및 개인 사이트 목록](team/README.md)

로컬에서 실행하려면 저장소를 VS Code로 열고 `src/index.html`을 Live Server로 실행합니다. GitHub의 소스 링크에서는 HTML 코드가 표시되며, GitHub Pages 배포가 완료되면 이 섹션에 웹페이지 접속 주소도 추가합니다.

## 문서

- [제출물 인덱스 (SUBMISSION.md)](SUBMISSION.md)
- [협업 가이드 (CONTRIBUTING)](docs/CONTRIBUTING.md)
- [충돌 해결 기록](docs/conflict-resolution.md)
- [트러블슈팅 기록](docs/troubleshooting-log.md)

> 임시 메모: Pages 배포 후 URL 추가 예정
