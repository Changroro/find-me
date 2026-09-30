from datetime import date
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("find_me_config", ROOT / "scripts/config.py")
config = importlib.util.module_from_spec(spec)
spec.loader.exec_module(config)


class ConfigTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.config_path = Path(self.directory.name) / "user/config.json"
        self.record_path = Path(self.directory.name) / "notes/record.md"
        self.default = config.DEFAULT.read_bytes()

    def initialize(self):
        return config.setup(self.config_path, str(self.record_path), ["습관", "가치관"])

    def test_setup_copies_prompt_and_preserves_existing_records(self):
        self.record_path.parent.mkdir()
        self.record_path.write_text("# 기존 기록\n", encoding="utf-8")
        settings = self.initialize()
        self.assertEqual(settings["prompt"], json.loads(self.default)["prompt"])
        self.assertEqual(settings["topics"], ["습관", "가치관"])
        self.assertEqual(self.record_path.read_text(encoding="utf-8"), "# 기존 기록\n")
        before = self.config_path.read_bytes()
        with self.assertRaises(ValueError):
            self.initialize()
        self.assertEqual(self.config_path.read_bytes(), before)
        self.assertEqual(config.DEFAULT.read_bytes(), self.default)

    def test_fix_changes_only_user_prompt_and_rejects_stale_revision(self):
        self.initialize()
        before, revision = config.load(self.config_path)
        config.fix(self.config_path, "맥락을 구체적으로 쓰고 발견은 짧게 쓴다.", revision)
        after, next_revision = config.load(self.config_path)
        self.assertEqual(after["record_path"], before["record_path"])
        self.assertEqual(after["topics"], before["topics"])
        self.assertEqual(after["prompt"], "맥락을 구체적으로 쓰고 발견은 짧게 쓴다.")
        self.assertNotEqual(next_revision, revision)
        with self.assertRaises(ValueError):
            config.fix(self.config_path, "오래된 수정안", revision)
        self.assertEqual(config.load(self.config_path)[0], after)
        self.assertEqual(config.DEFAULT.read_bytes(), self.default)
        self.assertFalse(self.record_path.exists())

    def test_append_reads_current_config_and_deduplicates_today(self):
        self.initialize()
        _, revision = config.load(self.config_path)
        entry = "- #가치관 기록의 활용도를 중요하게 여긴다. 대화 맥락: 기록의 쓸모를 점검했다."
        self.assertTrue(config.append(self.config_path, entry, revision, config.history(self.config_path)["revision"]))
        before = self.record_path.read_text(encoding="utf-8")
        self.assertIn(f"## {date.today().isoformat()}", before)
        self.assertFalse(config.append(self.config_path, entry, revision, config.history(self.config_path)["revision"]))
        self.assertEqual(self.record_path.read_text(encoding="utf-8"), before)
        config.fix(self.config_path, "짧은 문단 형식으로 기록한다.", revision)
        with self.assertRaises(ValueError):
            config.append(self.config_path, "이전 프롬프트의 기록", revision, config.history(self.config_path)["revision"])
        _, current = config.load(self.config_path)
        self.assertTrue(config.append(self.config_path, "새 개인 프롬프트의 문단 기록.", current, config.history(self.config_path)["revision"]))
        self.assertTrue(self.record_path.read_text(encoding="utf-8").startswith(before))

    def test_duplicate_record_from_an_earlier_day_is_not_appended(self):
        self.initialize()
        _, revision = config.load(self.config_path)
        entry = "- #습관 수정 전에 변경 이유를 이해하려 한다. 대화 맥락: 이유를 먼저 설명해 달라고 말했다."
        self.record_path.write_text(f"# 나에 대해\n\n## 2020-01-01\n\n{entry}\n", encoding="utf-8")
        before = self.record_path.read_bytes()
        self.assertFalse(config.append(self.config_path, entry, revision, config.history(self.config_path)["revision"]))
        self.assertEqual(self.record_path.read_bytes(), before)

    def test_missing_invalid_and_empty_settings_fail_without_default_fallback(self):
        with self.assertRaises(ValueError):
            config.load(self.config_path)
        self.initialize()
        original = self.config_path.read_bytes()
        _, revision = config.load(self.config_path)
        with self.assertRaises(ValueError):
            config.fix(self.config_path, " ", revision)
        self.assertEqual(self.config_path.read_bytes(), original)
        self.config_path.write_text("{잘못된 JSON}", encoding="utf-8")
        with self.assertRaises(ValueError):
            config.load(self.config_path)

    def test_history_includes_old_records_and_stale_comparisons_cannot_write(self):
        self.initialize()
        snapshot = config.history(self.config_path)
        self.assertEqual(snapshot["content"], "")
        empty_revision = snapshot["revision"]
        _, revision = config.load(self.config_path)
        previous = "# 나에 대해\n\n## 2020-01-01\n\n- #습관 이전 발견. 대화 맥락: 과거 발언.\n"
        self.record_path.write_text(previous, encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "최신 기록과 다시 비교"):
            config.append(self.config_path, "새로운 발견", revision, snapshot["revision"])
        self.assertEqual(self.record_path.read_text(encoding="utf-8"), previous)
        snapshot = config.history(self.config_path)
        self.assertEqual(snapshot["content"], previous)
        self.assertNotEqual(snapshot["revision"], empty_revision)
        self.assertTrue(config.append(self.config_path, "새로운 발견", revision, snapshot["revision"]))

    def test_cli_append_without_history_revision_is_rejected(self):
        self.initialize()
        _, revision = config.load(self.config_path)
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts/config.py"), "--config", str(self.config_path), "append", "--expected", revision],
            input="임의 기록", capture_output=True, text=True,
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.record_path.exists())

    def test_paths_topics_and_locks_prevent_unsafe_writes(self):
        for path in ("relative.md", str(ROOT / "config.json")):
            with self.assertRaises(ValueError):
                config.absolute_path(path)
        for topics in ([], ["습관", "습관"], ["#습관"], ["일하는 방식"]):
            with self.assertRaises(ValueError):
                config.setup(self.config_path, str(self.record_path), topics)
        self.assertFalse(self.config_path.exists())
        self.initialize()
        _, revision = config.load(self.config_path)
        with config.locked(self.config_path):
            with self.assertRaises(ValueError):
                config.fix(self.config_path, "동시 수정", revision)

    def test_cli_loads_custom_config_in_each_process(self):
        self.initialize()
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts/config.py"), "--config", str(self.config_path), "show"],
            capture_output=True, text=True, check=True,
        )
        loaded = json.loads(result.stdout)
        config.fix(self.config_path, "개인 프롬프트 두 번째 버전", loaded["revision"])
        result = subprocess.run(
            [sys.executable, str(ROOT / "scripts/config.py"), "--config", str(self.config_path), "show"],
            capture_output=True, text=True, check=True,
        )
        self.assertEqual(json.loads(result.stdout)["settings"]["prompt"], "개인 프롬프트 두 번째 버전")


if __name__ == "__main__":
    unittest.main()
