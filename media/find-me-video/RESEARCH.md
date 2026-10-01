# 영상 근거와 제작

사용자가 승인한 [제작 브리프](PROMPT.md)를 기준으로 30초, 1920×1080, 30fps, 한국어 handdrawn 영상을 제작한다. 노트북을 든 개발자 미니미가 반복되는 모델 출시와 뉴스에 포모를 느끼고, AI를 많이 쓰면서도 자신의 역량을 파악하지 못하는 혼란에서 출발한다. 이 이야기는 사용자가 지정한 창작 설정이다. 통계·효과 수치나 실제 사용자의 정신 상태를 주장하지 않는다. 소리는 handdrawn 스킬 기본 방식대로 넣지 않는다.

제품의 기능은 이 저장소에서 구현·검증한 동작을 근거로 한다.

| 영상에서 사용하는 사실 | 근거 |
|---|---|
| 제품 이름은 find-me | ../../plugin.json |
| Claude Code에서 사용 가능 | ../../.claude-plugin/plugin.json, Claude Code CLI 검증 |
| Codex에서 사용 가능 | ../../plugin.json, Codex app-server의 plugin/read 검증 |
| 초기 설정은 setup | ../../skills/setup/SKILL.md |
| 저장 문서 경로는 사용자 선택 | ../../scripts/config.py의 setup |
| 기록할 주제를 선택 | ../../assets/default.json, ../../skills/setup/SKILL.md |
| 기본 프롬프트를 개인 JSON으로 복사 | ../../scripts/config.py의 setup |
| 기본 기록은 발견과 맥락을 구분 | ../../assets/default.json의 prompt |
| 피드백은 개인 프롬프트만 수정 | ../../scripts/config.py의 fix, tests/test_config.py |
| 다음 기록부터 수정된 프롬프트 사용 | ../../skills/write-record/SKILL.md, 독립 동작 검증 |

브리프에 색상을 지정하지 않는다. handdrawn 모듈의 기본 표현을 사용하고, 캐릭터는 노트북을 든 손그림 미니미로 그린다. 포모와 역량에 대한 혼란을 도입에서 충분히 보여 주고, 세 스킬의 이름과 역할을 장면의 주요 제목으로 배치한다. 실제 제품 UI 캡처 대신 손그림 설명 장면을 사용한다.

엔진은 code-video 스킬의 kit.js, handdrawn.js, render.mjs를 재사용한다. 손그림 스타일은 [@nahiddotai의 영상](https://www.threads.com/@nahiddotai/post/DdmtD3zDtkB)을 참고한 code-video 가이드에 따른다. 참고 표시는 영상 끝에도 넣었다.

렌더 방법:

```sh
npm install
bash <code-video 스킬 경로>/scripts/fetch_fonts.sh assets/fonts
node render.mjs stills 2.5 7.5 12.5 17.5 22.5 28
CRF=25 node render.mjs video Find-Me-KO-v2.mp4
```

폰트는 code-video 스킬의 fetch_fonts.sh가 지정한 무료 폰트를 사용한다. 한글과 라틴 글꼴은 index.html의 unicode-range로 구분한다. 폰트 파일·검수 이미지·MP4는 Git에서 제외한다.
