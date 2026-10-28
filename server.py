#!/usr/bin/env python3
"""Local web server for KPL BP Studio.

Serves the static workbench, a compact JSON snapshot, sync status, and a
manual/incremental refresh endpoint. It intentionally uses only the Python
standard library so the app can run on a clean Windows machine.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import subprocess
import sys
import tempfile
import threading
import time
import traceback
import urllib.parse
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from runtime_paths import BUNDLE_DATA_DIR, BUNDLE_ROOT, DATA_DIR, OCR_SCRIPT, WEB_DIR

ROOT = BUNDLE_ROOT
SNAPSHOT_PATH = DATA_DIR / "snapshot.json"
STATUS_PATH = DATA_DIR / "status.json"
AUTO_SYNC_SECONDS = int(os.environ.get("KPL_AUTO_SYNC_SECONDS", "180"))
DEFAULT_PORT = int(os.environ.get("KPL_PORT", "5170"))
OCR_MAX_BYTES = 15 * 1024 * 1024
BATTLE_CACHE = DATA_DIR / "cache" / "battles"
BUNDLED_BATTLE_CACHE = BUNDLE_DATA_DIR / "cache" / "battles"
OFFICIAL_REPLAYS_CACHE = DATA_DIR / "cache" / "official-replays.json"
BUNDLED_OFFICIAL_REPLAYS_CACHE = BUNDLE_DATA_DIR / "cache" / "official-replays.json"
AVATAR_DIR = WEB_DIR / "assets" / "heroes"
_AVATAR_TEMPLATES: list[tuple[int, Any]] | None = None

sys.path.insert(0, str(ROOT))
try:
    from sync import run_sync  # noqa: E402
except Exception as exc:  # pragma: no cover - surfaced in the UI
    run_sync = None
    IMPORT_ERROR = exc
else:
    IMPORT_ERROR = None

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

_sync_lock = threading.Lock()
_sync_thread: threading.Thread | None = None
_last_sync_error: str | None = None
_server_started_at = time.time()


def read_json(path: Path) -> Any | None:
    if not path.exists():
        return None
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception:
        return None


def read_status() -> dict[str, Any]:
    status = read_json(STATUS_PATH)
    if not isinstance(status, dict):
        status = {
            "state": "idle",
            "phase": "waiting",
            "message": "等待首次同步",
            "progress": 0,
            "total": 0,
        }
    snapshot = read_json(SNAPSHOT_PATH)
    if isinstance(snapshot, dict):
        meta = snapshot.get("meta") or {}
        status.setdefault("snapshot", {})
        status["snapshot"].update(
            {
                "generatedAt": meta.get("generatedAt"),
                "battles": meta.get("totalBattles"),
                "series": meta.get("totalSeries"),
                "heroes": len(snapshot.get("heroes") or []),
                "teams": len(snapshot.get("teams") or []),
            }
        )
    status["syncRunning"] = _sync_lock.locked()
    status["autoSyncSeconds"] = AUTO_SYNC_SECONDS
    status["serverTime"] = time.strftime("%Y-%m-%dT%H:%M:%S%z")
    status["lastSyncError"] = _last_sync_error
    return status


def _sync_worker(force: bool) -> None:
    global _last_sync_error
    try:
        if run_sync is None:
            raise RuntimeError(f"数据同步模块加载失败：{IMPORT_ERROR}")
        run_sync(force=force)
        _last_sync_error = None
    except Exception as exc:  # noqa: BLE001
        _last_sync_error = str(exc)
        print(f"[sync] failed: {exc}", file=sys.stderr)
        traceback.print_exc()
    finally:
        try:
            _sync_lock.release()
        except RuntimeError:
            pass


def start_sync(force: bool = False) -> tuple[bool, str]:
    global _sync_thread
    if _sync_lock.locked():
        return False, "同步任务正在运行"
    if run_sync is None:
        return False, f"同步模块不可用：{IMPORT_ERROR}"
    _sync_lock.acquire()
    _sync_thread = threading.Thread(
        target=_sync_worker, args=(force,), name="kpl-data-sync", daemon=True
    )
    _sync_thread.start()
    return True, "同步已开始"


def snapshot_age_seconds() -> float | None:
    if not SNAPSHOT_PATH.exists():
        return None
    return max(0.0, time.time() - SNAPSHOT_PATH.stat().st_mtime)


def run_windows_ocr(image_bytes: bytes) -> dict[str, Any]:
    """OCR a screenshot with the built-in Windows Chinese OCR engine."""
    if os.name != "nt":
        raise RuntimeError("截屏识别目前仅支持 Windows 本机运行")
    if not image_bytes:
        raise RuntimeError("截图内容为空")
    if len(image_bytes) > OCR_MAX_BYTES:
        raise RuntimeError("截图过大，请压缩到 15MB 以内")
    if not OCR_SCRIPT.exists():
        raise RuntimeError("缺少 ocr_windows.ps1")
    powershell = Path(os.environ.get("SystemRoot", r"C:\Windows")) / "System32" / "WindowsPowerShell" / "v1.0" / "powershell.exe"
    if not powershell.exists():
        powershell = Path("powershell.exe")
    suffix = ".png"
    if image_bytes[:3] == b"\xff\xd8\xff":
        suffix = ".jpg"
    elif image_bytes[:4] == b"RIFF" and image_bytes[8:12] == b"WEBP":
        suffix = ".webp"
    tmp_path = None
    result_path = None
    try:
        with tempfile.NamedTemporaryFile(prefix="kpl-ocr-", suffix=suffix, delete=False) as tmp:
            tmp.write(image_bytes)
            tmp_path = Path(tmp.name)
        with tempfile.NamedTemporaryFile(prefix="kpl-ocr-result-", suffix=".json", delete=False) as tmp:
            result_path = Path(tmp.name)
        completed = subprocess.run(
            [
                str(powershell),
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(OCR_SCRIPT),
                str(tmp_path),
                str(result_path),
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=60,
        )
        if completed.returncode != 0:
            detail = (completed.stderr or completed.stdout or "OCR failed").strip()
            raise RuntimeError(detail.splitlines()[-1][:300])
        if not result_path.exists():
            raise RuntimeError("OCR 没有返回结果文件")
        try:
            payload = json.loads(result_path.read_text(encoding="utf-8-sig"))
        except Exception as exc:
            raise RuntimeError(f"OCR 返回解析失败：{exc}") from exc
        if not isinstance(payload, dict):
            raise RuntimeError("OCR 返回格式异常")
        return payload
    finally:
        if tmp_path is not None:
            try:
                tmp_path.unlink(missing_ok=True)
            except OSError:
                pass
        if result_path is not None:
            try:
                result_path.unlink(missing_ok=True)
            except OSError:
                pass


def load_avatar_templates():
    global _AVATAR_TEMPLATES
    if _AVATAR_TEMPLATES is not None:
        return _AVATAR_TEMPLATES
    try:
        import cv2
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError("头像识别需要安装 opencv-python-headless") from exc
    templates = []
    for path in sorted(AVATAR_DIR.glob("*.jpg")):
        try:
            hero_id = int(path.stem)
        except ValueError:
            continue
        image = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
        if image is None:
            continue
        templates.append((hero_id, image))
    if not templates:
        raise RuntimeError("没有找到英雄头像素材")
    _AVATAR_TEMPLATES = templates
    return templates


def _detect_avatar_slots(cv2: Any, np: Any, image: Any) -> list[dict[str, Any]]:
    """Find the two 10-avatar BP rows, ignoring player portraits below."""
    height, width = image.shape[:2]
    crop = image[: int(height * 0.52), :]
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 40, 120)
    edges = cv2.dilate(edges, np.ones((3, 3), np.uint8), iterations=1)
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    rects = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if 45 <= w <= 105 and 45 <= h <= 105 and 0.7 <= w / max(1, h) <= 1.4:
            rects.append((x, y, w, h))
    rects.sort(key=lambda rect: rect[2] * rect[3], reverse=True)
    unique = []
    for rect in rects:
        cx = rect[0] + rect[2] / 2
        cy = rect[1] + rect[3] / 2
        if any(
            abs(cx - (other[0] + other[2] / 2)) < 18
            and abs(cy - (other[1] + other[3] / 2)) < 18
            for other in unique
        ):
            continue
        unique.append(rect)
    rows = []
    for rect in sorted(unique, key=lambda item: item[1]):
        cy = rect[1] + rect[3] / 2
        row = next((item for item in rows if abs(cy - item["cy"]) < 18), None)
        if row is None:
            row = {"cy": cy, "rects": []}
            rows.append(row)
        row["rects"].append(rect)
    candidates = []
    for row in rows:
        left = [rect for rect in row["rects"] if rect[0] + rect[2] / 2 < width / 2]
        right = [rect for rect in row["rects"] if rect[0] + rect[2] / 2 >= width / 2]
        if len(left) < 4 or len(right) < 4:
            continue
        left = sorted(left, key=lambda rect: rect[0])[:5]
        right = sorted(right, key=lambda rect: rect[0])[:5]
        candidates.append({"cy": row["cy"], "left": left, "right": right})
    if not candidates:
        return []
    candidates.sort(key=lambda item: item["cy"])
    # Prefer the top two 10-slot rows; ignore score/logo/player clusters.
    chosen = sorted(candidates, key=lambda item: (-(len(item["left"]) + len(item["right"])), item["cy"]))[:2]
    chosen.sort(key=lambda item: item["cy"])
    def saturation(rects: list[tuple[int, int, int, int]]) -> float:
        values = []
        for x, y, w, h in rects:
            patch = image[y : y + h, x : x + w]
            hsv = cv2.cvtColor(patch, cv2.COLOR_BGR2HSV)
            values.append(float(hsv[:, :, 1].mean()))
        return sum(values) / max(1, len(values))
    saturations = [saturation(item["left"] + item["right"]) for item in chosen]
    ban_index = 0 if saturations[0] <= saturations[-1] else len(chosen) - 1
    slots = []
    for row_index, row in enumerate(chosen):
        kind = "ban" if row_index == ban_index else "pick"
        for side, rects in (("blue", row["left"]), ("red", row["right"])):
            for rect in rects:
                slots.append({"side": side, "type": kind, "rect": rect})
    return slots


def _match_avatar_slot(cv2: Any, patch: Any, templates: list[tuple[int, Any]]) -> list[tuple[float, int]]:
    # The same hero can be cropped at different zoom levels in a screenshot.
    # Pad the slot and search several template scales instead of forcing both
    # images to one fixed 90x90 square.
    padded = cv2.copyMakeBorder(patch, 32, 32, 32, 32, cv2.BORDER_REPLICATE)
    fixed_patch = cv2.resize(patch, (90, 90))
    scores = []
    for hero_id, template in templates:
        fixed = cv2.matchTemplate(
            fixed_patch,
            cv2.resize(template, (90, 90)),
            cv2.TM_CCOEFF_NORMED,
        )[0, 0]
        best_scale = -1.0
        # Stay near the real slot size. Very small templates can match a
        # random eye/weapon fragment of an unrelated portrait.
        for size in range(60, 91, 5):
            if size >= padded.shape[0] or size >= padded.shape[1]:
                continue
            resized = cv2.resize(template, (size, size))
            result = cv2.matchTemplate(padded, resized, cv2.TM_CCOEFF_NORMED)
            _, score, _, _ = cv2.minMaxLoc(result)
            best_scale = max(best_scale, float(score))
        scores.append((float(fixed) + best_scale, hero_id))
    scores.sort(reverse=True)
    return scores


def run_avatar_recognition(image_bytes: bytes) -> dict[str, Any]:
    """Locate BP slots first, then identify each portrait independently."""
    if not image_bytes:
        raise RuntimeError("截图内容为空")
    if len(image_bytes) > OCR_MAX_BYTES:
        raise RuntimeError("截图过大，请压缩到 15MB 以内")
    try:
        import cv2
        import numpy as np
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError("头像识别需要安装 numpy 和 opencv-python-headless") from exc
    templates = load_avatar_templates()
    array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(array, cv2.IMREAD_COLOR)
    if image is None:
        raise RuntimeError("无法读取截图，请使用 PNG / JPG / WEBP")
    height, width = image.shape[:2]
    scale = min(1.0, 900.0 / max(1, width))
    if scale < 1.0:
        image = cv2.resize(image, (max(1, int(width * scale)), max(1, int(height * scale))))
        height, width = image.shape[:2]
    slots = _detect_avatar_slots(cv2, np, image)
    if len(slots) >= 10:
        slot_scores = []
        for slot in slots:
            x, y, w, h = slot["rect"]
            patch = cv2.cvtColor(image[y : y + h, x : x + w], cv2.COLOR_BGR2GRAY)
            slot_scores.append({**slot, "scores": _match_avatar_slot(cv2, patch, templates)})
        # Greedy unique assignment: one hero cannot occupy two BP slots.
        used = set()
        assigned = []
        for slot in sorted(slot_scores, key=lambda item: item["scores"][0][0], reverse=True):
            for score, hero_id in slot["scores"]:
                if hero_id in used:
                    continue
                used.add(hero_id)
                assigned.append(
                    {
                        "heroId": hero_id,
                        "score": round(score, 4),
                        "side": slot["side"],
                        "type": slot["type"],
                        "x": slot["rect"][0],
                        "y": slot["rect"][1],
                        "size": slot["rect"][2],
                        "candidates": [
                            {"heroId": candidate_id, "score": round(candidate_score, 4)}
                            for candidate_score, candidate_id in slot["scores"][:5]
                        ],
                    }
                )
                break
        assigned.sort(key=lambda item: (0 if item["type"] == "ban" else 1, 0 if item["side"] == "blue" else 1, item["x"]))
        if assigned:
            return {
                "width": width,
                "height": height,
                "slots": assigned,
                "detections": assigned,
            }
    # Fallback for screenshots whose portraits are not on a clean BP grid.
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    sizes = (30, 36, 44, 52, 60, 68, 76, 84)
    detections = []
    for hero_id, template in templates:
        best_score = -1.0
        best_loc = None
        best_size = 0
        for size in sizes:
            if size >= gray.shape[0] or size >= gray.shape[1]:
                continue
            resized = cv2.resize(template, (size, size))
            result = cv2.matchTemplate(gray, resized, cv2.TM_CCOEFF_NORMED)
            _, score, _, loc = cv2.minMaxLoc(result)
            if score > best_score:
                best_score = float(score)
                best_loc = loc
                best_size = size
        if best_score >= 0.52 and best_loc is not None:
            x, y = int(best_loc[0]), int(best_loc[1])
            detections.append(
                {
                    "heroId": hero_id,
                    "score": round(best_score, 4),
                    "x": x,
                    "y": y,
                    "size": best_size,
                    "side": "blue" if x + best_size / 2 < width / 2 else "red",
                }
            )
    detections.sort(key=lambda row: row["score"], reverse=True)
    selected = []
    seen_heroes = set()
    for item in detections:
        if item["heroId"] in seen_heroes:
            continue
        cx = item["x"] + item["size"] / 2
        cy = item["y"] + item["size"] / 2
        if any(
            abs(cx - (other["x"] + other["size"] / 2)) < max(item["size"], other["size"]) * 0.55
            and abs(cy - (other["y"] + other["size"] / 2)) < max(item["size"], other["size"]) * 0.55
            for other in selected
        ):
            continue
        seen_heroes.add(item["heroId"])
        selected.append(item)
        if len(selected) >= 20:
            break
    return {
        "width": width,
        "height": height,
        "detections": selected,
    }


def load_battle_detail(battle_id: str) -> dict[str, Any] | None:
    safe = "".join(ch if ch.isalnum() or ch in "._-" else "_" for ch in str(battle_id))
    path = BATTLE_CACHE / f"{safe}.json"
    if not path.is_file():
        path = BUNDLED_BATTLE_CACHE / f"{safe}.json"
    if not path.is_file():
        return None
    raw = read_json(path)
    if not isinstance(raw, dict):
        return None
    camp_keys = (
        "team_id",
        "team_name",
        "team_icon",
        "is_win",
        "kill_num",
        "assist_num",
        "death_num",
        "gold",
        "kda",
    )
    camps = {}
    for key in ("camp1", "camp2"):
        camp = raw.get(key) or {}
        camps[key] = {field: camp.get(field) for field in camp_keys}
    players = []
    for row in raw.get("battle_player_list") or []:
        equipment = []
        for item in row.get("BriefEquipList") or []:
            if not isinstance(item, dict):
                continue
            equipment.append(
                {
                    "id": item.get("equip_id"),
                    "name": item.get("equip_name"),
                    "icon": item.get("equip_icon"),
                }
            )
        players.append(
            {
                "camp": row.get("camp"),
                "teamId": row.get("team_id"),
                "teamName": row.get("team_name"),
                "heroId": row.get("hero_id"),
                "heroName": row.get("hero_name"),
                "heroIcon": row.get("hero_icon"),
                "playerName": row.get("player_name"),
                "actualPlayerName": row.get("actual_player_name"),
                "playerIcon": row.get("player_icon"),
                "position": row.get("position"),
                "positionDesc": row.get("position_desc"),
                "kills": row.get("kill_num"),
                "assists": row.get("assist_num"),
                "deaths": row.get("death_num"),
                "gold": row.get("gold"),
                "kda": row.get("kda"),
                "hurtTotal": row.get("hurt_total"),
                "hurtRate": row.get("hurt_total_rate"),
                "beHurtTotal": row.get("be_hurt_total"),
                "beHurtRate": row.get("be_hurt_total_rate"),
                "mvp": row.get("is_mvp"),
                "mvpScore": row.get("mvp_score"),
                "participation": row.get("participation_rate"),
                "equipment": equipment,
            }
        )
    videos = raw.get("video_list") or []
    replay_url = "https://kpl.qq.com/#/Videos"
    replay_direct = False
    official_map = {}
    for map_path in (OFFICIAL_REPLAYS_CACHE, BUNDLED_OFFICIAL_REPLAYS_CACHE):
        if map_path.is_file():
            try:
                loaded = read_json(map_path)
                if isinstance(loaded, dict):
                    official_map = loaded
                break
            except Exception:  # noqa: BLE001 - replay metadata is optional
                official_map = {}
    official = official_map.get(str(battle_id)) if isinstance(official_map, dict) else None
    if isinstance(official, dict) and official.get("url"):
        replay_url = str(official.get("url"))
        replay_direct = True
    elif isinstance(videos, list):
        for video in videos:
            if isinstance(video, dict) and video.get("video_id"):
                replay_url = "https://kpl.qq.com/#/PlayVideo?vid=" + urllib.parse.quote(str(video.get("video_id")))
                replay_direct = True
                break
    return {
        "battleId": raw.get("battle_id"),
        "winCamp": raw.get("win_camp"),
        "duration": raw.get("game_duration"),
        "battleSeq": raw.get("battle_seq"),
        "camp1": camps["camp1"],
        "camp2": camps["camp2"],
        "players": players,
        "replayUrl": replay_url,
        "replayDirect": replay_direct,
    }


def auto_sync_loop(stop_event: threading.Event) -> None:
    # Give the server a moment to finish starting, then refresh if data is old.
    stop_event.wait(8)
    while not stop_event.is_set():
        try:
            age = snapshot_age_seconds()
            if age is None or age > max(90, AUTO_SYNC_SECONDS - 30):
                if not _sync_lock.locked():
                    print("[auto] starting scheduled sync")
                    start_sync(force=False)
        except Exception as exc:  # noqa: BLE001
            print(f"[auto] {exc}", file=sys.stderr)
        stop_event.wait(AUTO_SYNC_SECONDS)


class Handler(BaseHTTPRequestHandler):
    server_version = "KPLBPStudio/1.2.10"

    def log_message(self, fmt: str, *args: Any) -> None:
        # Keep the console clean; only log API errors and non-static failures.
        if args and str(args[1]).startswith(("4", "5")):
            print(f"[http] {self.address_string()} {fmt % args}")

    def _send_json(self, payload: Any, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode(
            "utf-8"
        )
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _send_bytes(
        self, body: bytes, content_type: str, status: int = 200, cache: bool = False
    ) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        if cache:
            self.send_header("Cache-Control", "public, max-age=86400")
        else:
            self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _serve_static(self, path: str) -> None:
        parsed = urllib.parse.urlparse(path)
        rel = urllib.parse.unquote(parsed.path).lstrip("/")
        if not rel:
            rel = "index.html"
        target = (WEB_DIR / rel).resolve()
        try:
            target.relative_to(WEB_DIR.resolve())
        except ValueError:
            self._send_json({"error": "forbidden"}, HTTPStatus.FORBIDDEN)
            return
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            # Single-page app: unknown non-asset routes fall back to index.
            if "." not in Path(rel).name:
                target = WEB_DIR / "index.html"
            else:
                self._send_json({"error": "not found", "path": rel}, HTTPStatus.NOT_FOUND)
                return
        try:
            body = target.read_bytes()
        except OSError:
            self._send_json({"error": "cannot read file"}, HTTPStatus.INTERNAL_SERVER_ERROR)
            return
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        if target.suffix.lower() in {".js", ".css", ".html", ".json", ".svg"}:
            content_type += "; charset=utf-8"
        cache = target.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".ico", ".woff2"}
        self._send_bytes(body, content_type, cache=cache)

    def do_GET(self) -> None:  # noqa: N802
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/health":
            self._send_json(
                {
                    "ok": True,
                    "syncModule": run_sync is not None,
                    "syncRunning": _sync_lock.locked(),
                    "uptime": round(time.time() - _server_started_at, 1),
                }
            )
            return
        if path == "/api/status":
            self._send_json(read_status())
            return
        if path == "/api/data":
            snapshot = read_json(SNAPSHOT_PATH)
            if not isinstance(snapshot, dict):
                self._send_json(
                    {
                        "ok": False,
                        "error": "数据快照尚未生成",
                        "status": read_status(),
                    },
                    HTTPStatus.SERVICE_UNAVAILABLE,
                )
                return
            self._send_json(snapshot)
            return
        if path == "/api/config":
            self._send_json(
                {
                    "app": "KPL-BP-Studio",
                    "version": "1.2.10",
                    "autoSyncSeconds": AUTO_SYNC_SECONDS,
                    "dataDir": str(DATA_DIR),
                    "source": "腾讯王者荣耀官方赛事中台（与王者营地赛事数据同源）",
                }
            )
            return
        if path == "/api/battle":
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            battle_id = str((query.get("id") or [""])[0]).strip()
            if not battle_id:
                self._send_json({"ok": False, "error": "缺少 battle id"}, HTTPStatus.BAD_REQUEST)
                return
            detail = load_battle_detail(battle_id)
            if detail is None:
                self._send_json({"ok": False, "error": "该局暂无赛后数据缓存"}, HTTPStatus.NOT_FOUND)
                return
            self._send_json({"ok": True, **detail})
            return
        self._serve_static(self.path)

    def do_POST(self) -> None:  # noqa: N802
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/avatar":
            try:
                length = int(self.headers.get("Content-Length", "0") or 0)
            except ValueError:
                length = 0
            if length <= 0:
                self._send_json({"ok": False, "error": "缺少截屏数据"}, HTTPStatus.BAD_REQUEST)
                return
            if length > OCR_MAX_BYTES:
                self._send_json({"ok": False, "error": "截图过大，请压缩到 15MB 以内"}, HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
                return
            raw = self.rfile.read(length)
            try:
                result = run_avatar_recognition(raw)
                self._send_json({"ok": True, **result})
            except Exception as exc:  # noqa: BLE001 - expose recognition failure to the UI
                self._send_json(
                    {"ok": False, "error": str(exc)},
                    HTTPStatus.SERVICE_UNAVAILABLE,
                )
            return
        if path == "/api/ocr":
            try:
                length = int(self.headers.get("Content-Length", "0") or 0)
            except ValueError:
                length = 0
            if length <= 0:
                self._send_json({"ok": False, "error": "缺少截屏数据"}, HTTPStatus.BAD_REQUEST)
                return
            if length > OCR_MAX_BYTES:
                self._send_json({"ok": False, "error": "截图过大，请压缩到 15MB 以内"}, HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
                return
            raw = self.rfile.read(length)
            try:
                result = run_windows_ocr(raw)
                self._send_json({"ok": True, **result})
            except Exception as exc:  # noqa: BLE001 - expose OCR failure to the UI
                self._send_json(
                    {"ok": False, "error": str(exc)},
                    HTTPStatus.SERVICE_UNAVAILABLE,
                )
            return
        if path == "/api/refresh":
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            force = str(query.get("full", ["0"])[0]).lower() in {"1", "true", "yes"}
            started, message = start_sync(force=force)
            self._send_json(
                {"ok": started, "message": message, "status": read_status()},
                HTTPStatus.ACCEPTED if started else HTTPStatus.CONFLICT,
            )
            return
        self._send_json({"error": "not found"}, HTTPStatus.NOT_FOUND)


def main() -> int:
    parser = argparse.ArgumentParser(description="KPL BP Studio local server")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--open", action="store_true", help="open browser on startup")
    args = parser.parse_args()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    stop_event = threading.Event()
    auto_thread = threading.Thread(
        target=auto_sync_loop, args=(stop_event,), name="kpl-auto-sync", daemon=True
    )
    auto_thread.start()

    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")
    mimetypes.add_type("image/webp", ".webp")

    try:
        httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    except OSError as exc:
        print(f"无法启动服务（端口 {args.port}）：{exc}", file=sys.stderr)
        return 1

    url = f"http://{args.host}:{args.port}"
    print("=" * 64)
    print("  KPL BP Studio  |  王者荣耀 KPL BP 决策工作台")
    print(f"  {url}")
    print(f"  数据目录: {DATA_DIR}")
    print(f"  自动同步: 每 {AUTO_SYNC_SECONDS} 秒（增量）")
    print("  按 Ctrl+C 停止")
    print("=" * 64)
    if args.open:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n正在停止服务…")
    finally:
        stop_event.set()
        httpd.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
