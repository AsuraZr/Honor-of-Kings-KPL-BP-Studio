"""Runtime paths for source and PyInstaller-packaged builds."""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

FROZEN = bool(getattr(sys, "frozen", False))
BUNDLE_ROOT = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
APP_DIR = Path(sys.executable).resolve().parent if FROZEN else Path(__file__).resolve().parent
WEB_DIR = BUNDLE_ROOT / "web"
BUNDLE_DATA_DIR = BUNDLE_ROOT / "data"
OCR_SCRIPT = BUNDLE_ROOT / "ocr_windows.ps1"


def _is_writable(path: Path) -> bool:
    try:
        path.mkdir(parents=True, exist_ok=True)
        probe = path / ".write-test"
        probe.write_text("ok", encoding="utf-8")
        probe.unlink(missing_ok=True)
        return True
    except OSError:
        return False


def _pick_data_dir() -> Path:
    if not FROZEN:
        return BUNDLE_DATA_DIR
    candidates = [APP_DIR / "data"]
    local_app_data = os.environ.get("LOCALAPPDATA")
    if local_app_data:
        candidates.append(Path(local_app_data) / "KPLBPStudio" / "data")
    else:
        candidates.append(Path.home() / "AppData" / "Local" / "KPLBPStudio" / "data")
    for candidate in candidates:
        if _is_writable(candidate):
            return candidate
    raise RuntimeError("没有可写的数据目录")


DATA_DIR = _pick_data_dir()


def ensure_data() -> None:
    """Seed persistent data from the one-file bundle on first launch."""
    if DATA_DIR == BUNDLE_DATA_DIR:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        return
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not BUNDLE_DATA_DIR.is_dir():
        return
    for source in BUNDLE_DATA_DIR.iterdir():
        if source.name == "cache":
            continue
        target = DATA_DIR / source.name
        if target.exists():
            continue
        if source.is_dir():
            shutil.copytree(source, target)
        else:
            shutil.copy2(source, target)


ensure_data()
