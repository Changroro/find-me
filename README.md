<h1 align="center">Find Me</h1>

<p align="center">
  <strong>AI와 나눈 대화에서 나의 습관과 판단 기준을 발견합니다.</strong><br>
  Claude Code와 Codex에서 사용하는 개인 기록 플러그인
</p>

<p align="center">
  <a href="https://github.com/Changroro/find-me/releases"><img src="https://img.shields.io/github/v/release/Changroro/find-me?style=flat-square&color=26786b&label=%EB%A6%B4%EB%A6%AC%EC%8A%A4" alt="최신 릴리스"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/%EB%9D%BC%EC%9D%B4%EC%84%A0%EC%8A%A4-MIT-26786b?style=flat-square" alt="MIT 라이선스"></a>
  <img src="https://img.shields.io/badge/Claude_Code_%C2%B7_Codex-%EC%A7%80%EC%9B%90-26786b?style=flat-square" alt="Claude Code와 Codex 지원">
</p>

<p align="center"><a href="#시작하기">시작하기</a> · <a href="#사용법">사용법</a> · <a href="#작동-방식">작동 방식</a></p>

## 소개 영상

https://github.com/user-attachments/assets/df8549bd-b5f0-4dc5-947d-41e26d25903c

노트북을 든 개발자가 AI 포모로 지쳐 있다가 자신의 습관과 기준을 발견해 가는 30초 한국어 손그림 영상입니다.

## 프로젝트 소개

대화에는 내가 무엇을 중요하게 여기는지, 어떤 방식으로 일하는지에 대한 단서가 남습니다. Find Me는 그중 근거가 충분하고 자기 이해에 도움이 되는 내용을 골라 기록합니다. 개발 습관과 에이전트 사용 방식뿐 아니라 가치관·감정·고민·경험도 기록할 수 있습니다.

각 기록은 **범용적인 발견과 실제 대화 맥락**으로 구성됩니다. 나중에 읽었을 때 무엇을 발견했는지, 어떤 말에서 나온 내용인지 함께 확인할 수 있습니다.

```markdown
- #일하는방식 변경의 이유와 범위를 이해한 뒤 진행하는 방식을 선호한다.
  대화 맥락: 사용자가 수정 전에 무엇을 왜 바꾸는지 이해하고 진행하는 편이며,
  이유를 모르면 불안하다고 직접 설명했다.
```

위 예시는 사용자가 자신의 선호와 이유를 직접 설명한 경우입니다. 단순히 “코드를 설명해줘”라고 요청했다는 이유만으로 같은 성향을 기록하지 않습니다.

## 주요 기능

### 대화에서 나를 발견하기

- 선택한 주제에 맞는 의미 있는 자기 이야기와 충분한 관찰 근거를 기록합니다.
- 지난 기록과 비교해 같은 발견의 반복을 줄입니다.
- 과거와 모순되거나 이상한 내용은 사용자에게 묻고, 답변을 받은 뒤 기록합니다.

### 내 기준으로 기록하기

- 문서를 저장할 경로와 기록할 주제를 직접 선택합니다.
- 기록에 대한 피드백으로 개인 프롬프트를 다듬습니다.
- Claude Code와 Codex가 같은 개인 설정과 Markdown 문서를 사용합니다.

## 시작하기

Python 3.11 이상과 [uv](https://docs.astral.sh/uv/)가 필요합니다. 저장 위치는 일반 폴더나 Obsidian 볼트를 선택할 수 있습니다.

### Claude Code

Claude Code에서 다음 명령을 실행합니다.

```text
/plugin marketplace add Changroro/find-me
/plugin install find-me@find-me
```

설치 후 새 세션에서 초기 설정을 시작합니다.

```text
/find-me:setup
```

### Codex

터미널에서 플러그인을 설치합니다.

```sh
codex plugin marketplace add Changroro/find-me
codex plugin add find-me@find-me
```

설치 후 새 세션에서 초기 설정을 시작합니다.

```text
$find-me:setup
```

설정할 때 **기록 문서의 절대 경로**와 **기록할 주제**를 입력합니다. 기존 기록 문서를 지정하면 이후 기록을 이어서 추가합니다.

## 사용법

| 하고 싶은 일 | Claude Code | Codex |
|---|---|---|
| 저장 경로와 주제 설정 | `/find-me:setup` | `$find-me:setup` |
| 현재 대화에서 기록 남기기 | `/find-me:write-record` | `$find-me:write-record` |
| 피드백으로 기록 기준 수정 | `/find-me:fix-record` | `$find-me:fix-record` |

write-record는 의미 있는 자기 이야기가 나올 때 에이전트가 자동으로 사용할 수도 있습니다. 기록할 만한 내용이 없으면 아무것도 추가하지 않습니다.

기록이 원하는 방식과 다르면 fix-record에 피드백을 전달합니다.

```text
발견은 한 문장으로 줄여줘.
대화 맥락에는 내가 실제로 한 요구를 더 구체적으로 적어줘.
```

수정은 개인 프롬프트에 반영되고 다음 기록부터 적용됩니다. 과거 기록의 문장은 자동으로 바뀌지 않습니다.

<details>
<summary><strong>기록할 주제와 선별 기준</strong></summary>

기본 주제는 `습관`, `성격`, `가치관`, `감정`, `고민`, `관계`, `경험`, `성과`, `일하는방식`, `취향`입니다. setup에서 선택하거나 주제를 추가할 수 있습니다.

단순 작업 지시·기술적 요구·한 번의 도구 선택·기록 관리 피드백만으로 성향을 만들지 않습니다. 사용자가 직접 밝힌 의미 있는 자기 이야기나 충분한 근거가 필요합니다. 관찰만으로 습관·성격을 말하려면 서로 다른 상황 둘 이상의 근거를 확인합니다.

날짜가 달라도 과거와 의미가 같고 새 이유·적용 조건·변화가 없으면 생략합니다. 모순이나 오류가 의심되면 과거 내용과 이번 발언을 보여 주고 확인합니다. 답변을 기다리는 동안 해당 항목은 저장하지 않습니다.

</details>

## 작동 방식

```text
setup         기본 프롬프트를 개인 설정으로 복사
                         ↓
write-record  대화에서 후보 선별 → 과거와 비교 → 필요한 확인 → 문서에 추가
                         ↑
fix-record    피드백으로 개인 프롬프트 수정
```

기본 프롬프트는 [assets/default.json](assets/default.json)에 있습니다. setup은 그 복사본을 사용자 JSON으로 만들고, write-record는 실행할 때마다 현재 개인 프롬프트를 읽습니다. 플러그인을 업데이트해도 기존 개인 프롬프트는 유지됩니다.

<details>
<summary><strong>개인 설정의 위치와 변경 방법</strong></summary>

기본 설정 경로는 `~/.config/find-me/config.json`입니다. 사용자 JSON과 기록 문서는 플러그인 폴더 밖에 저장합니다.

```json
{
  "record_path": "/절대/경로/기록.md",
  "topics": ["습관", "가치관", "일하는방식"],
  "prompt": "사용자가 조정하는 기록용 프롬프트"
}
```

setup 재실행은 기존 JSON을 덮어쓰지 않습니다. 프롬프트는 fix-record로 수정하고, 저장 경로나 주제를 변경하려면 사용자 JSON의 해당 필드를 수정합니다.

다른 설정 경로를 사용하려면 두 도구의 실행 환경에 동일한 `FIND_ME_CONFIG` 절대 경로를 지정합니다. 다른 PC에서는 해당 PC의 문서 경로로 설정합니다.

설정이 없거나 JSON·경로가 잘못되면 오류를 알리고 기록을 중단합니다. 파일의 동시 변경이 감지되면 최신 기록을 다시 읽고 비교합니다.

</details>

## 개발 및 기여

개인 오픈소스 프로젝트입니다. 공통 스킬과 Python 표준 라이브러리 도우미를 사용하며, 두 도구에서 같은 기록 절차를 제공합니다. 개선 제안은 [Issues](https://github.com/Changroro/find-me/issues)에 남길 수 있습니다.

<details>
<summary><strong>소스 검증과 영상 재현</strong></summary>

```sh
uv run python -m unittest discover -s tests
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict skills
```

스킬은 `skills/`, 기본 프롬프트는 `assets/default.json`, 설정·기록 도우미는 `scripts/config.py`에 있습니다. [영상 소스와 제작 근거](media/find-me-video/RESEARCH.md)도 저장소에 포함합니다.

</details>

## 라이선스

[MIT License](LICENSE).
