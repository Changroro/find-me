# 개발 규칙

- 이 프로젝트는 별도 Git worktree에서 개발한다. 현재 작업 브랜치는 `feat/custom-recording`이다.
- 사용자 JSON과 기록 문서는 플러그인 루트 밖에 저장한다. 실제 개인 기록이나 설정을 저장소에 넣지 않는다.
- Claude Code와 Codex가 같은 `skills/`, 기본 JSON, Python 표준 라이브러리 도우미를 사용한다.
- 검증은 `uv run python -m unittest discover -s tests`, `claude plugin validate --strict .`, `claude plugin validate --strict .claude-plugin/plugin.json`, `claude plugin validate --strict skills`로 실행한다.
