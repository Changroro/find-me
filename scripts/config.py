import argparse
from contextlib import contextmanager
from datetime import date
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
DEFAULT = ROOT / "assets/default.json"


def absolute_path(value):
    path = Path(value).expanduser()
    if not path.is_absolute():
        raise ValueError("경로는 절대 경로 또는 ~로 시작해야 합니다.")
    path = path.resolve()
    if path == ROOT or ROOT in path.parents:
        raise ValueError("사용자 설정과 기록은 플러그인 루트 밖에 저장해야 합니다.")
    if path.exists() and not path.is_file():
        raise ValueError("파일 경로가 필요합니다.")
    return path


def validate(settings, config_path):
    if not isinstance(settings, dict) or set(settings) != {"record_path", "topics", "prompt"}:
        raise ValueError("JSON에는 record_path, topics, prompt가 필요합니다.")
    if not isinstance(settings["record_path"], str) or not settings["record_path"].strip():
        raise ValueError("record_path가 설정되지 않았습니다. setup을 실행하세요.")
    record_path = absolute_path(settings["record_path"])
    if record_path == config_path:
        raise ValueError("설정 파일과 기록 파일은 달라야 합니다.")
    topics = settings["topics"]
    if not isinstance(topics, list) or not topics or any(
        not isinstance(topic, str) or not re.fullmatch(r"[\w-]+", topic) for topic in topics
    ) or len(set(topics)) != len(topics):
        raise ValueError("topics는 중복 없이 주제 이름을 담은 배열이어야 합니다. 공백과 #은 제외하세요.")
    if not isinstance(settings["prompt"], str) or not settings["prompt"].strip():
        raise ValueError("prompt는 비어 있지 않은 문자열이어야 합니다.")
    return record_path


def load(config_path):
    if not config_path.is_file():
        raise ValueError(f"설정이 없습니다. setup을 먼저 실행하세요: {config_path}")
    raw = config_path.read_bytes()
    settings = json.loads(raw)
    validate(settings, config_path)
    return settings, hashlib.sha256(raw).hexdigest()


@contextmanager
def locked(path):
    lock = path.with_name(f".{path.name}.lock")
    try:
        lock.mkdir(mode=0o700)
    except FileExistsError as error:
        raise ValueError(f"다른 작업이 진행 중이거나 이전 작업의 잠금이 남아 있습니다: {lock}") from error
    try:
        yield
    finally:
        lock.rmdir()


def save(config_path, settings):
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=config_path.parent, delete=False) as file:
            temporary = Path(file.name)
            json.dump(settings, file, ensure_ascii=False, indent=2)
            file.write("\n")
            file.flush()
            os.fsync(file.fileno())
        os.replace(temporary, config_path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def setup(config_path, record_path, topics):
    settings = json.loads(DEFAULT.read_text(encoding="utf-8"))
    settings["record_path"] = str(absolute_path(record_path))
    settings["topics"] = topics
    record = validate(settings, config_path)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    with locked(config_path):
        if config_path.exists():
            raise ValueError("기존 사용자 JSON을 덮어쓰지 않습니다. 프롬프트 변경은 fix-record를 사용하세요.")
        record.parent.mkdir(parents=True, exist_ok=True)
        save(config_path, settings)
    return settings


def fix(config_path, prompt, expected):
    with locked(config_path):
        settings, revision = load(config_path)
        if revision != expected:
            raise ValueError("설정이 변경되었습니다. 다시 읽고 수정안을 갱신하세요.")
        settings["prompt"] = prompt
        validate(settings, config_path)
        save(config_path, settings)


def history(config_path):
    settings, _ = load(config_path)
    record = validate(settings, config_path)
    raw = record.read_bytes() if record.exists() else b""
    return {"record_path": str(record), "revision": hashlib.sha256(raw).hexdigest(), "content": raw.decode("utf-8")}


def append(config_path, content, expected, expected_history):
    if not content.strip():
        raise ValueError("빈 기록은 추가할 수 없습니다.")
    with locked(config_path):
        settings, revision = load(config_path)
        if revision != expected:
            raise ValueError("설정이 변경되었습니다. 현재 프롬프트로 기록을 다시 작성하세요.")
        record = validate(settings, config_path)
        with locked(record):
            raw = record.read_bytes() if record.exists() else b""
            if hashlib.sha256(raw).hexdigest() != expected_history:
                raise ValueError("기록이 변경되었습니다. 최신 기록과 다시 비교하세요.")
            existing = raw.decode("utf-8")
            heading = f"## {date.today().isoformat()}"
            dates = list(re.finditer(r"^## \d{4}-\d{2}-\d{2}$", existing, re.MULTILINE))
            today = dates and dates[-1].group() == heading
            content = content.strip()
            if f"\n{content}\n" in f"\n{existing.strip()}\n":
                return False
            prefix = "" if existing else "# 나에 대해\n"
            if not today:
                prefix += f"\n{heading}\n"
            with record.open("a", encoding="utf-8") as file:
                if existing and not existing.endswith("\n"):
                    file.write("\n")
                file.write(f"{prefix}\n{content}\n")
    return True


def main():
    parser = argparse.ArgumentParser(description="find-me 사용자 JSON 관리")
    parser.add_argument("--config", default=os.environ.get("FIND_ME_CONFIG", str(Path.home() / ".config/find-me/config.json")))
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("show")
    commands.add_parser("history")
    commands.add_parser("template")
    setup_parser = commands.add_parser("setup")
    setup_parser.add_argument("--record-path", required=True)
    setup_parser.add_argument("--topics", nargs="+", required=True)
    for command in ("fix", "append"):
        command_parser = commands.add_parser(command)
        command_parser.add_argument("--expected", required=True)
        if command == "append":
            command_parser.add_argument("--expected-history", required=True)
    args = parser.parse_args()
    if args.command == "template":
        print(DEFAULT.read_text(encoding="utf-8"), end="")
        return
    config_path = absolute_path(args.config)
    if args.command == "setup":
        setup(config_path, args.record_path, args.topics)
        print(f"find-me: 설정 완료 → {config_path}")
    elif args.command == "show":
        settings, revision = load(config_path)
        print(json.dumps({"config_path": str(config_path), "revision": revision, "settings": settings}, ensure_ascii=False, indent=2))
    elif args.command == "history":
        print(json.dumps(history(config_path), ensure_ascii=False, indent=2))
    elif args.command == "fix":
        fix(config_path, sys.stdin.read(), args.expected)
        print(f"find-me: 프롬프트 수정 완료 → {config_path}")
    elif args.command == "append":
        written = append(config_path, sys.stdin.read(), args.expected, args.expected_history)
        print("find-me: 기록함" if written else "find-me: 이미 기록한 내용")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as error:
        print(f"find-me: 오류: {error}", file=sys.stderr)
        sys.exit(1)
