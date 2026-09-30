# 변경 기록

## [Unreleased]

## [2.0.0] - 2026-09-30

### Added

- Claude Code와 Codex에서 설치할 수 있는 독립 플러그인과 marketplace.
- 기본 JSON을 개인 JSON으로 복사하고 문서 경로·주제를 입력받는 setup.
- 사용자 피드백으로 개인 프롬프트만 갱신하는 fix-record.
- 설정 검증, 동시 쓰기 잠금, 수정안의 설정 버전 확인.

### Changed

- 기록 스킬 이름을 find-me에서 write-record로 변경.
- 기록할 때마다 개인 JSON의 주제·프롬프트·문서 경로를 읽음.
- Obsidian 자동 탐색 대신 setup에서 사용자가 문서 경로를 지정.
- 기본 기록을 범용적인 발견과 실제 대화 맥락으로 분리하고 사실·관찰을 구분.
