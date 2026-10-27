#!/usr/bin/env python3
"""KPL BP Studio data pipeline.

Pulls official Tencent Honor of Kings competition data (the same public
competition service used by the KPL site / 王者营地 event pages), builds a
compact snapshot for the local BP workbench, and caches immutable battle
details so subsequent refreshes are incremental.

Usage:
    python sync.py             # incremental sync
    python sync.py --force     # ignore HTTP caches for match/battle lists
"""

from __future__ import annotations

import argparse
import concurrent.futures
import gzip
from collections import Counter
import json
import os
import random
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from runtime_paths import DATA_DIR, WEB_DIR

CACHE_DIR = DATA_DIR / "cache"
SNAPSHOT_PATH = DATA_DIR / "snapshot.json"
STATUS_PATH = DATA_DIR / "status.json"
LOCK_PATH = DATA_DIR / "sync.lock"
WEB_ASSETS = WEB_DIR / "assets"

API_BASE = "https://prod.comp.smoba.qq.com"
TGA_BASE = "https://tga-openapi.tga.qq.com"
HERO_LIST_URL = "https://pvp.qq.com/web201605/js/herolist.json"
CN_TZ = timezone(timedelta(hours=8))

# The official KPL event page exposes its live standings through Tencent AMS
# (the same chart service used by pvp.qq.com). The annual-final chart returns
# the 大师组/精英组 tables with official points and net game points.
KPL_STANDINGS_URL = "https://smoba.ams.game.qq.com/ide/"
KPL_S3_STANDINGS_FORM = {
    "iChartId": "621295",
    "iSubChartId": "621295",
    "sIdeToken": "7ISlzu",
    "sStage": "lts",
    "e_code": "0",
    "g_code": "0",
    "eas_url": "https://pvp.qq.com/cp/kpl2026/",
    "eas_refer": "https://pvp.qq.com/cp/kpl2026/index.html",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
    ),
    "Referer": "https://pvp.qq.com/matchdata/schedule.html",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

ROLE_NAMES = {
    1: "对抗路",
    2: "打野",
    3: "中路",
    4: "发育路",
    5: "游走",
}

SEASON_SPECS = {
    "KPL2026S3": {
        "display": "2026 年度总决赛",
        "short": "年度总决赛",
        "leagueName": "2026年KPL年度总决赛",
        "fallbackLeagueId": "20260004",
        "order": 0,
    },
    "KPL2026S2": {
        "display": "2026 KPL 夏季赛",
        "short": "夏季赛",
        "leagueName": "2026年KPL夏季赛",
        "fallbackLeagueId": "20260003",
        "order": 1,
    },
}


def now_iso() -> str:
    return datetime.now(CN_TZ).isoformat(timespec="seconds")


def write_json_atomic(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    with tmp.open("w", encoding="utf-8", newline="\n") as fh:
        json.dump(payload, fh, ensure_ascii=False, separators=(",", ":"))
    os.replace(tmp, path)


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def set_status(**fields: Any) -> None:
    current: dict[str, Any] = {}
    if STATUS_PATH.exists():
        try:
            current = read_json(STATUS_PATH)
        except Exception:
            current = {}
    current.update(fields)
    current["updatedAt"] = now_iso()
    write_json_atomic(STATUS_PATH, current)


def _decode_response(raw: bytes, encoding: str) -> bytes:
    if encoding.lower() == "gzip":
        return gzip.decompress(raw)
    return raw


def http_json(
    path_or_url: str,
    params: dict[str, Any] | None = None,
    *,
    retries: int = 4,
    timeout: int = 30,
) -> Any:
    url = path_or_url if path_or_url.startswith("http") else API_BASE + path_or_url
    if params:
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}{urllib.parse.urlencode(params)}"
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(request, timeout=timeout) as response:
                raw = response.read()
                raw = _decode_response(raw, response.headers.get("Content-Encoding", ""))
                payload = json.loads(raw.decode("utf-8-sig"))
            if isinstance(payload, dict) and payload.get("code") not in (None, 200):
                raise RuntimeError(
                    f"API code {payload.get('code')} for {url}: {payload.get('message', '')}"
                )
            return payload
        except Exception as exc:  # noqa: BLE001 - retry transport and payload errors
            last_error = exc
            if attempt + 1 < retries:
                time.sleep(0.4 * (2**attempt) + random.random() * 0.25)
    raise RuntimeError(f"Request failed after {retries} attempts: {url} ({last_error})")


def http_post_json(
    url: str,
    form: dict[str, str],
    *,
    retries: int = 3,
    timeout: int = 20,
) -> Any:
    """POST a small form to Tencent AMS and decode its JSON response."""
    body = urllib.parse.urlencode(form).encode("utf-8")
    request_headers = {
        **HEADERS,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://pvp.qq.com",
    }
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            request = urllib.request.Request(
                url, data=body, headers=request_headers, method="POST"
            )
            with urllib.request.urlopen(request, timeout=timeout) as response:
                raw = response.read()
                raw = _decode_response(raw, response.headers.get("Content-Encoding", ""))
                payload = json.loads(raw.decode("utf-8-sig"))
            if not isinstance(payload, dict):
                raise RuntimeError(f"Unexpected AMS payload for {url}")
            if payload.get("ret") not in (None, 0):
                raise RuntimeError(
                    f"AMS ret {payload.get('ret')} for {url}: {payload.get('sMsg', '')}"
                )
            return payload
        except Exception as exc:  # noqa: BLE001 - retry then fall back to cache
            last_error = exc
            if attempt + 1 < retries:
                time.sleep(0.5 * (2**attempt) + random.random() * 0.25)
    raise RuntimeError(f"AMS request failed after {retries} attempts: {url} ({last_error})")


def fetch_s3_standings() -> dict[str, Any] | None:
    """Live 2026 年度总决赛 擂台赛 standings from the official KPL page.

    Returns the raw ``data`` object keyed by S/A, or the last good cache if the
    official page is temporarily unavailable. A missing standings table must
    never block the BP snapshot.
    """
    cache_path = CACHE_DIR / "standings" / "KPL2026S3.json"
    try:
        payload = http_post_json(KPL_STANDINGS_URL, KPL_S3_STANDINGS_FORM)
        data = (payload.get("jData") or {}).get("data")
        if isinstance(data, dict) and any(isinstance(data.get(key), list) for key in ("S", "A")):
            write_json_atomic(cache_path, data)
            return data
        raise RuntimeError("AMS standings payload has no S/A groups")
    except Exception as exc:  # noqa: BLE001
        cached = cache_read(cache_path)
        if isinstance(cached, dict):
            print(f"[warn] official standings unavailable, using cache: {exc}", file=sys.stderr)
            return cached
        print(f"[warn] official standings unavailable: {exc}", file=sys.stderr)
        return None


def get_hero_roster() -> list[dict[str, Any]]:
    payload = http_json(HERO_LIST_URL, retries=4)
    heroes: list[dict[str, Any]] = []
    for item in payload:
        try:
            hero_id = int(item.get("ename"))
        except (TypeError, ValueError):
            continue
        role_codes = []
        for token in str(item.get("roles") or "").split("|"):
            token = token.strip()
            if token.isdigit():
                role_codes.append(int(token))
        if not role_codes:
            primary = item.get("hero_type")
            if isinstance(primary, int) and primary in ROLE_NAMES:
                role_codes = [primary]
        heroes.append(
            {
                "id": hero_id,
                "name": str(item.get("cname") or hero_id).strip(),
                "title": str(item.get("title") or "").strip(),
                "roles": [ROLE_NAMES[code] for code in role_codes if code in ROLE_NAMES],
                "remoteIcon": f"https://res.edata.qq.com/sgame/static/images/hero/{hero_id}.jpg",
            }
        )
    heroes.sort(key=lambda h: h["id"])
    return heroes


def discover_leagues() -> dict[str, dict[str, Any]]:
    payload = http_json("/leaguesite/leagues/open", retries=4)
    rows = payload.get("results") or []
    found: dict[str, dict[str, Any]] = {}
    for season_id, spec in SEASON_SPECS.items():
        candidates = [
            row
            for row in rows
            if str(row.get("year")) == "2026"
            and (
                str(row.get("league_name", "")).replace(" ", "") == spec["leagueName"]
                or spec["short"] in str(row.get("league_name", ""))
            )
        ]
        candidates.sort(key=lambda row: str(row.get("league_id", "")), reverse=True)
        if candidates:
            row = candidates[0]
            found[season_id] = {
                "id": season_id,
                "leagueId": str(row.get("league_id")),
                "leagueName": row.get("league_name") or spec["leagueName"],
                "display": spec["display"],
                "short": spec["short"],
                "startTime": row.get("start_time") or "",
                "endTime": row.get("end_time") or "",
                "order": spec["order"],
            }
        else:
            found[season_id] = {
                "id": season_id,
                "leagueId": spec["fallbackLeagueId"],
                "leagueName": spec["leagueName"],
                "display": spec["display"],
                "short": spec["short"],
                "startTime": "",
                "endTime": "",
                "order": spec["order"],
            }
    return found


def safe_key(value: str) -> str:
    return "".join(ch if ch.isalnum() or ch in "._-" else "_" for ch in str(value))


def cache_read(path: Path) -> Any | None:
    if not path.exists():
        return None
    try:
        return read_json(path)
    except Exception:
        return None


def fetch_season_base(season: dict[str, Any], force: bool) -> dict[str, Any]:
    """Fetch the small aggregate endpoints on every sync.

    Aggregate lists are cheap and must reflect the newest completed games.
    ``force`` only controls the large, immutable per-battle caches.
    """
    league_id = season["leagueId"]
    season_dir = CACHE_DIR / "seasons" / season["id"]
    season_dir.mkdir(parents=True, exist_ok=True)
    paths = {
        "heroes": season_dir / "hero-settle.json",
        "teams": season_dir / "team-settle.json",
        "matches": season_dir / "matches.json",
    }
    tasks = {
        "heroes": ("/leaguesite/league/hero/settle_list/open", {"league_id": league_id}),
        "teams": ("/leaguesite/league/team/settle_list/open", {"league_id": league_id}),
        "matches": ("/leaguesite/matches/open", {"league_id": league_id}),
    }
    results: dict[str, Any] = {}
    for key, (endpoint, params) in tasks.items():
        payload = http_json(endpoint, params)
        items = payload.get("data") if key in ("heroes", "teams") else payload.get("results")
        if items is None:
            items = []
        write_json_atomic(paths[key], items)
        results[key] = items
    if season["id"] == "KPL2026S3":
        results["standings"] = fetch_s3_standings()
    else:
        results["standings"] = None
    return results


def get_match_battle_list(
    match: dict[str, Any],
    season_id: str,
    *,
    force: bool,
) -> list[dict[str, Any]]:
    match_id = str(match.get("match_id"))
    cache_path = CACHE_DIR / "match-battles" / f"{safe_key(match_id)}.json"
    if not force:
        cached = cache_read(cache_path)
        if cached is not None:
            return cached
    payload = http_json("/leaguesite/match/battles/open", {"match_id": match_id})
    battles = payload.get("results") or []
    # A just-finished series can briefly return an empty/partial battle list.
    # Do not poison the cache in that case; the next sync will retry.
    expected_games = int(match.get("camp1", {}).get("score", 0) or 0) + int(
        match.get("camp2", {}).get("score", 0) or 0
    )
    if battles and (expected_games <= 0 or len(battles) >= expected_games):
        write_json_atomic(cache_path, battles)
    return battles


def compact_battle_detail(detail: dict[str, Any]) -> dict[str, Any]:
    """Keep only the fields needed for BP analytics.

    A full battle payload contains every player's equipment and damage stats.
    Retaining hundreds of those in memory is unnecessary for this tool.
    """
    camps = {}
    for camp_no, camp_key in ((1, "camp1"), (2, "camp2")):
        camp = detail.get(camp_key) or {}
        camps[camp_key] = {
            "team_id": camp.get("team_id"),
            "team_name": camp.get("team_name"),
        }
    return {
        "battle_id": detail.get("battle_id"),
        "status": detail.get("status"),
        "win_camp": detail.get("win_camp"),
        "game_duration": detail.get("game_duration"),
        "battle_seq": detail.get("battle_seq"),
        "camp1": camps["camp1"],
        "camp2": camps["camp2"],
        "bp_list": [
            {
                "camp": item.get("camp"),
                "is_ban_or_pick": item.get("is_ban_or_pick"),
                "hero_id": item.get("hero_id"),
            }
            for item in (detail.get("bp_list") or [])
        ],
        "players": [
            {
                "camp": item.get("camp"),
                "hero_id": item.get("hero_id"),
                "name": str(
                    item.get("player_name")
                    or item.get("actual_player_name")
                    or ""
                ).strip(),
                "position": str(item.get("position_desc") or "").strip(),
                "team_id": str(item.get("team_id") or ""),
            }
            for item in (detail.get("battle_player_list") or [])
            if item.get("camp") in (1, 2) and item.get("hero_id")
        ],
    }


def get_battle_detail(battle_id: str, *, force: bool) -> dict[str, Any] | None:
    cache_path = CACHE_DIR / "battles" / f"{safe_key(battle_id)}.json"
    if not force:
        cached = cache_read(cache_path)
        if cached is not None:
            return compact_battle_detail(cached)
    try:
        payload = http_json("/leaguesite/battle/open", {"battle_id": battle_id})
    except Exception as exc:  # noqa: BLE001 - a single missing battle should not kill sync
        print(f"[warn] battle {battle_id}: {exc}", file=sys.stderr)
        return None
    detail = payload.get("data")
    if not isinstance(detail, dict):
        return None
    write_json_atomic(cache_path, detail)
    return compact_battle_detail(detail)


def collect_battle_records(
    seasons: dict[str, dict[str, Any]],
    season_base: dict[str, dict[str, Any]],
    *,
    force: bool,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[str]]:
    all_series: list[dict[str, Any]] = []
    all_battles: list[dict[str, Any]] = []
    warnings: list[str] = []

    for season_id in sorted(seasons, key=lambda key: seasons[key]["order"]):
        season = seasons[season_id]
        matches = season_base[season_id]["matches"]
        finished = [
            match
            for match in matches
            if int(match.get("status", 0) or 0) == 2
            and match.get("camp1")
            and match.get("camp2")
        ]

        set_status(
            phase="fetching-match-lists",
            message=f"读取 {season['short']} 赛程对局列表",
            season=season_id,
            progress=0,
            total=len(finished),
        )

        lists: dict[str, list[dict[str, Any]]] = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            futures = {
                pool.submit(get_match_battle_list, match, season_id, force=force): match
                for match in finished
            }
            for index, future in enumerate(concurrent.futures.as_completed(futures), 1):
                match = futures[future]
                match_id = str(match.get("match_id"))
                try:
                    lists[match_id] = future.result()
                except Exception as exc:  # noqa: BLE001
                    warnings.append(f"{season_id} {match_id} 对局列表失败: {exc}")
                    lists[match_id] = []
                if index % 10 == 0 or index == len(futures):
                    set_status(
                        phase="fetching-match-lists",
                        message=f"{season['short']}：已读取 {index}/{len(futures)} 场系列赛",
                        progress=index,
                        total=len(futures),
                    )

        for match in finished:
            match_id = str(match.get("match_id"))
            camp1 = match["camp1"]
            camp2 = match["camp2"]
            score1 = int(camp1.get("score", 0) or 0)
            score2 = int(camp2.get("score", 0) or 0)
            if bool(camp1.get("is_win")):
                winner = 1
            elif bool(camp2.get("is_win")):
                winner = 2
            elif score1 != score2:
                winner = 1 if score1 > score2 else 2
            else:
                winner = 0
            all_series.append(
                {
                    "id": match_id,
                    "cc": str(match.get("cc_match_id") or ""),
                    "season": season_id,
                    "date": str(match.get("start_time") or "")[:16],
                    "stage": str(match.get("match_stage_desc") or ""),
                    "bo": int(match.get("bo", 0) or 0),
                    "t1": str(camp1.get("team_id") or ""),
                    "t2": str(camp2.get("team_id") or ""),
                    "s1": score1,
                    "s2": score2,
                    "w": winner,
                }
            )

        battle_entries: list[tuple[dict[str, Any], str]] = []
        for match in finished:
            match_id = str(match.get("match_id"))
            for battle in lists.get(match_id, []):
                if int(battle.get("status", 0) or 0) != 2:
                    continue
                battle_id = str(battle.get("battle_id") or "")
                if battle_id:
                    battle_entries.append((battle, match_id))

        seen: set[str] = set()
        unique_entries = []
        for battle, match_id in battle_entries:
            battle_id = str(battle.get("battle_id"))
            if battle_id in seen:
                continue
            seen.add(battle_id)
            unique_entries.append((battle, match_id))

        set_status(
            phase="fetching-battles",
            message=f"{season['short']}：准备读取 {len(unique_entries)} 局 BP",
            season=season_id,
            progress=0,
            total=len(unique_entries),
        )

        details: dict[str, dict[str, Any] | None] = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
            futures = {
                pool.submit(get_battle_detail, str(battle["battle_id"]), force=force): str(
                    battle["battle_id"]
                )
                for battle, _ in unique_entries
            }
            for index, future in enumerate(concurrent.futures.as_completed(futures), 1):
                battle_id = futures[future]
                try:
                    details[battle_id] = future.result()
                except Exception as exc:  # noqa: BLE001
                    warnings.append(f"{season_id} 对局 {battle_id} 详情失败: {exc}")
                    details[battle_id] = None
                if index % 10 == 0 or index == len(futures):
                    set_status(
                        phase="fetching-battles",
                        message=f"{season['short']}：已读取 {index}/{len(futures)} 局 BP",
                        progress=index,
                        total=len(futures),
                    )

        for battle, match_id in unique_entries:
            battle_id = str(battle.get("battle_id"))
            detail = details.get(battle_id)
            if not detail or (not detail.get("bp_list") and not detail.get("players")):
                warnings.append(f"{season_id} {battle_id} 无 BP 数据")
                continue
            camps = {}
            for camp_no, camp_key in ((1, "camp1"), (2, "camp2")):
                camp = detail.get(camp_key) or {}
                camps[camp_no] = {
                    "id": str(camp.get("team_id") or ""),
                    "name": str(camp.get("team_name") or ""),
                }
            if not camps[1]["id"] or not camps[2]["id"]:
                warnings.append(f"{season_id} {battle_id} 阵营信息不完整")
                continue

            picks: dict[int, list[int]] = {1: [], 2: []}
            bans: dict[int, list[int]] = {1: [], 2: []}
            for item in detail.get("bp_list") or []:
                try:
                    camp_no = int(item.get("camp") or 0)
                    hero_id = int(item.get("hero_id") or 0)
                except (TypeError, ValueError):
                    continue
                if camp_no not in (1, 2) or not hero_id:
                    continue
                # Official API uses 0 for ban and 1 for pick.
                if int(item.get("is_ban_or_pick") or 0) == 1:
                    picks[camp_no].append(hero_id)
                else:
                    bans[camp_no].append(hero_id)
            if len(picks[1]) != 5 or len(picks[2]) != 5:
                # Rare official-data gaps: recover the pick set from the
                # per-player rows (each player carries hero_id and camp).
                for item in detail.get("players") or []:
                    try:
                        camp_no = int(item.get("camp") or 0)
                        hero_id = int(item.get("hero_id") or 0)
                    except (TypeError, ValueError):
                        continue
                    if camp_no in (1, 2) and hero_id and hero_id not in picks[camp_no]:
                        picks[camp_no].append(hero_id)
                # Keep exactly five per side, in player-list order.
                picks[1] = picks[1][:5]
                picks[2] = picks[2][:5]
            if len(picks[1]) != 5 or len(picks[2]) != 5:
                warnings.append(
                    f"{season_id} {battle_id} 选人数量异常 "
                    f"({len(picks[1])}/{len(picks[2])})"
                )
                continue
            winner = int(detail.get("win_camp") or 0)
            player_rows = []
            for item in detail.get("players") or []:
                try:
                    camp_no = int(item.get("camp") or 0)
                    hero_id = int(item.get("hero_id") or 0)
                except (TypeError, ValueError):
                    continue
                name = str(item.get("name") or "").strip()
                position = str(item.get("position") or "").strip()
                if camp_no in (1, 2) and hero_id and name:
                    player_rows.append([camp_no, hero_id, name, position])
            all_battles.append(
                {
                    "id": battle_id,
                    "season": season_id,
                    "mid": match_id,
                    "seq": int(detail.get("battle_seq") or battle.get("battle_seq") or 0),
                    "date": str(battle.get("start_time") or "")[:10]
                    or next(
                        (s["date"][:10] for s in all_series if s["id"] == match_id),
                        "",
                    ),
                    "stage": next(
                        (s["stage"] for s in all_series if s["id"] == match_id), ""
                    ),
                    "t": [camps[1]["id"], camps[2]["id"]],
                    "p": [picks[1], picks[2]],
                    "b": [bans[1], bans[2]],
                    "pl": player_rows,
                    "w": winner if winner in (1, 2) else 0,
                    "dur": int(detail.get("game_duration") or 0),
                }
            )

    all_series.sort(key=lambda row: (row["date"], row["id"]))
    all_battles.sort(key=lambda row: (row["season"], row["date"], row["mid"], row["seq"]))
    return all_series, all_battles, warnings


def resolve_team_id(team_index: dict[str, dict[str, Any]], name: str) -> str:
    """Resolve the official standings name to our stable team id."""
    target = str(name or "").strip()
    if not target:
        return ""
    for team in team_index.values():
        if target in (team.get("name"), team.get("short")):
            return team["id"]
    compact = target.replace(" ", "")
    for team in team_index.values():
        team_name = str(team.get("name") or "").replace(" ", "")
        if compact and (compact in team_name or team_name in compact):
            return team["id"]
    return ""


def build_official_s3_standings(
    raw: dict[str, Any],
    team_index: dict[str, dict[str, Any]],
    season: dict[str, Any],
) -> dict[str, Any]:
    groups = []
    for key, label, group_name in (
        ("S", "S", "大师组"),
        ("A", "A", "精英组"),
    ):
        source_rows = raw.get(key)
        if not isinstance(source_rows, list):
            continue
        rows = []
        rank = 1
        for index, item in enumerate(source_rows):
            # The official page uses iRank to mark a tie with the previous row.
            if index == 0 or not item.get("iRank"):
                rank = index + 1
            name = str(item.get("name") or "").strip()
            team_id = resolve_team_id(team_index, name)
            team = team_index.get(team_id) if team_id else None
            series_wins = int(item.get("win") or 0)
            series_losses = int(item.get("lose") or 0)
            series_played = series_wins + series_losses
            rows.append(
                {
                    "rank": rank,
                    "teamId": team_id,
                    "teamName": str((team or {}).get("name") or name),
                    "short": str((team or {}).get("short") or ""),
                    "group": key,
                    "groupName": group_name,
                    "seriesWins": series_wins,
                    "seriesLosses": series_losses,
                    "seriesPlayed": series_played,
                    "gameWins": int(item.get("win_match") or 0),
                    "gameLosses": int(item.get("lost_match") or 0),
                    "netPoints": int(item.get("net_points") or 0),
                    "points": int(item.get("points") or 0),
                    "winRate": round(series_wins / series_played, 4)
                    if series_played
                    else None,
                    "matchState": int(item.get("match_state") or 0),
                    "outcome": item.get("outcome"),
                }
            )
        groups.append(
            {
                "key": key,
                "name": group_name,
                "short": group_name,
                "rows": rows,
            }
        )
    return {
        "season": "KPL2026S3",
        "label": season.get("display") or "2026 年度总决赛",
        "stage": "擂台赛",
        "source": "official",
        "sourceLabel": "KPL 官方积分榜",
        "sourceUrl": "https://pvp.qq.com/cp/kpl2026/index.html",
        "updatedAt": now_iso(),
        "groups": groups,
        "note": "官方擂台赛积分榜：胜场=积分，净胜分=小局净胜；分组为大师组 / 精英组。",
    }


def derive_standings(
    season_id: str,
    season: dict[str, Any],
    series_rows: list[dict[str, Any]],
    team_index: dict[str, dict[str, Any]],
    *,
    stage_contains: str | tuple[str, ...],
    stage_label: str,
    group_name: str,
    note: str,
    source_url: str = "https://pvp.qq.com/cp/a20260601xjsjfb/index.html",
) -> dict[str, Any]:
    tokens = (stage_contains,) if isinstance(stage_contains, str) else stage_contains
    stats: dict[str, dict[str, int]] = {}
    for row in series_rows:
        stage_text = str(row.get("stage") or "")
        if not any(token in stage_text for token in tokens):
            continue
        for side in (1, 2):
            team_id = str(row.get(f"t{side}"))
            if not team_id:
                continue
            bucket = stats.setdefault(
                team_id,
                {"wins": 0, "losses": 0, "gameWins": 0, "gameLosses": 0},
            )
            won = row.get("w") == side
            bucket["wins" if won else "losses"] += 1
            bucket["gameWins"] += int(row.get(f"s{side}") or 0)
            bucket["gameLosses"] += int(row.get(f"s{3 - side}") or 0)

    rows = []
    for team_id, bucket in stats.items():
        played = bucket["wins"] + bucket["losses"]
        if not played:
            continue
        team = team_index.get(team_id)
        rows.append(
            {
                "teamId": team_id,
                "teamName": str((team or {}).get("name") or team_id),
                "short": str((team or {}).get("short") or ""),
                "group": "ALL",
                "groupName": group_name,
                "seriesWins": bucket["wins"],
                "seriesLosses": bucket["losses"],
                "seriesPlayed": played,
                "gameWins": bucket["gameWins"],
                "gameLosses": bucket["gameLosses"],
                "netPoints": bucket["gameWins"] - bucket["gameLosses"],
                "points": bucket["wins"],
                "winRate": round(bucket["wins"] / played, 4) if played else None,
            }
        )
    rows.sort(
        key=lambda row: (
            -row["points"],
            -row["netPoints"],
            -(row["winRate"] or 0),
            row["teamName"],
        )
    )
    last_key = None
    for index, row in enumerate(rows):
        key = (row["points"], row["netPoints"])
        if key != last_key:
            row["rank"] = index + 1
            last_key = key
    return {
        "season": season_id,
        "label": season.get("display") or season_id,
        "stage": stage_label,
        "source": "derived",
        "sourceLabel": "官方赛程汇总",
        "sourceUrl": source_url,
        "updatedAt": now_iso(),
        "groups": [
            {
                "key": "ALL",
                "name": group_name,
                "short": group_name,
                "rows": rows,
            }
        ],
        "note": note,
    }


S2_PLAYOFF_ROUNDS = (
    ("winners-r1", "胜者组第一轮", "winners", ("2026082901", "2026083001"), "胜者组决赛", "败者组第三轮"),
    ("winners-final", "胜者组决赛", "winners", ("2026090401",), "总决赛", "败者组决赛"),
    ("losers-r1", "败者组第一轮", "losers", ("2026082701", "2026082801"), "败者组第二轮", "淘汰"),
    ("losers-r2", "败者组第二轮", "losers", ("2026083101", "2026090101"), "败者组第三轮", "淘汰"),
    ("losers-r3", "败者组第三轮", "losers", ("2026090201", "2026090301"), "败者组第四轮", "淘汰"),
    ("losers-r4", "败者组第四轮", "losers", ("2026090501",), "败者组决赛", "淘汰"),
    ("losers-final", "败者组决赛", "losers", ("2026090601",), "总决赛", "淘汰"),
    ("final", "总决赛", "final", ("2026091201",), "冠军", "亚军"),
)


def bracket_team(team_index: dict[str, dict[str, Any]], team_id: Any) -> dict[str, Any]:
    team = team_index.get(str(team_id)) if team_id else None
    return {
        "id": str(team_id) if team_id else "",
        "name": str((team or {}).get("name") or "待定"),
        "short": str((team or {}).get("short") or ""),
    }


def bracket_match_from_series(
    row: dict[str, Any] | None,
    team_index: dict[str, dict[str, Any]],
    *,
    match_id: str,
    winner_to: str,
    loser_to: str,
) -> dict[str, Any]:
    if not row:
        return {
            "id": match_id,
            "date": "",
            "team1": {"id": "", "name": "待定", "short": ""},
            "team2": {"id": "", "name": "待定", "short": ""},
            "score1": None,
            "score2": None,
            "winnerId": "",
            "loserId": "",
            "winnerTo": winner_to,
            "loserTo": loser_to,
            "status": "tbd",
        }
    team1 = bracket_team(team_index, row.get("t1"))
    team2 = bracket_team(team_index, row.get("t2"))
    winner_side = int(row.get("w") or 0)
    winner = team1 if winner_side == 1 else team2 if winner_side == 2 else None
    loser = team2 if winner_side == 1 else team1 if winner_side == 2 else None
    return {
        "id": str(row.get("id") or match_id),
        "date": str(row.get("date") or ""),
        "team1": team1,
        "team2": team2,
        "score1": int(row.get("s1") or 0),
        "score2": int(row.get("s2") or 0),
        "winnerId": winner.get("id") if winner else "",
        "loserId": loser.get("id") if loser else "",
        "winnerTo": winner_to,
        "loserTo": loser_to,
        "status": "finished" if winner else "pending",
    }


def build_s2_playoff_bracket(
    season_id: str,
    season: dict[str, Any],
    season_series: list[dict[str, Any]],
    team_index: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    by_id = {str(row.get("id")): row for row in season_series}
    rounds = []
    for key, name, bracket, ids, winner_to, loser_to in S2_PLAYOFF_ROUNDS:
        rounds.append(
            {
                "key": key,
                "name": name,
                "bracket": bracket,
                "matches": [
                    bracket_match_from_series(
                        by_id.get(match_id),
                        team_index,
                        match_id=match_id,
                        winner_to=winner_to,
                        loser_to=loser_to,
                    )
                    for match_id in ids
                ],
            }
        )
    return {
        "season": season_id,
        "label": season.get("display") or season_id,
        "key": "jhs",
        "name": "季后赛",
        "stage": "季后赛",
        "view": "bracket",
        "source": "derived",
        "sourceLabel": "官方赛程对阵",
        "sourceUrl": "https://pvp.qq.com/cp/a20260601xjsjfb/index.html",
        "updatedAt": now_iso(),
        "rounds": rounds,
        "groups": [],
        "note": "按官方季后赛胜者组 / 败者组 / 总决赛对阵整理；胜者进下一轮，败者进入败者组或淘汰。",
    }


def build_s3_tws_bracket(
    season_id: str,
    season: dict[str, Any],
    season_series: list[dict[str, Any]],
    team_index: dict[str, dict[str, Any]],
    official_matches: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    rows = [
        row
        for row in season_series
        if "突围赛" in str(row.get("stage") or "")
    ]
    rows.sort(key=lambda row: (str(row.get("date") or ""), str(row.get("id") or "")))
    matches = [
        bracket_match_from_series(
            row,
            team_index,
            match_id=str(row.get("id") or ""),
            winner_to="晋级下一轮",
            loser_to="淘汰",
        )
        for row in rows
    ]
    seen = {match["id"] for match in matches}
    for match in official_matches or []:
        if "突围赛" not in str(match.get("match_stage_desc") or ""):
            continue
        match_id = str(match.get("match_id") or "")
        if not match_id or match_id in seen:
            continue
        camp1 = match.get("camp1") or {}
        camp2 = match.get("camp2") or {}
        if not camp1 or not camp2:
            continue
        team1 = bracket_team(team_index, camp1.get("team_id"))
        team2 = bracket_team(team_index, camp2.get("team_id"))
        matches.append(
            {
                "id": match_id,
                "date": str(match.get("start_time") or ""),
                "team1": team1,
                "team2": team2,
                "score1": None,
                "score2": None,
                "winnerId": "",
                "loserId": "",
                "winnerTo": "晋级下一轮",
                "loserTo": "淘汰",
                "status": "pending" if int(match.get("status", 0) or 0) != 2 else "finished",
            }
        )
    matches.sort(key=lambda match: (match.get("date") or "", match.get("id") or ""))
    return {
        "season": season_id,
        "label": season.get("display") or season_id,
        "key": "tws",
        "name": "突围赛",
        "stage": "突围赛",
        "view": "bracket",
        "source": "derived",
        "sourceLabel": "官方赛程对阵",
        "sourceUrl": "https://pvp.qq.com/cp/kpl2026/index.html",
        "updatedAt": now_iso(),
        "rounds": [
            {
                "key": "tws-r1",
                "name": "突围赛",
                "bracket": "single",
                "matches": matches,
            }
        ],
        "groups": [],
        "note": "按官方突围赛 BO7 单败赛果整理：胜者晋级，败者淘汰；未结束的对阵标为待定。",
    }


def build_s3_tts_schedule(
    season_id: str,
    season: dict[str, Any],
    team_index: dict[str, dict[str, Any]],
    official_matches: list[dict[str, Any]],
) -> dict[str, Any]:
    """Show the official knockout schedule, including matches not yet played."""
    rounds = {key: [] for key in ("knockout", "final")}
    for match in official_matches:
        stage = str(match.get("match_stage_desc") or "")
        if "淘汰赛" not in stage and "总决赛" not in stage:
            continue
        camp1 = match.get("camp1") or {}
        camp2 = match.get("camp2") or {}
        team1 = bracket_team(team_index, camp1.get("team_id"))
        team2 = bracket_team(team_index, camp2.get("team_id"))
        if not team1.get("id") and camp1.get("team_name"):
            team1["name"] = str(camp1.get("team_name"))
        if not team2.get("id") and camp2.get("team_name"):
            team2["name"] = str(camp2.get("team_name"))
        status_num = int(match.get("status", 0) or 0)
        finished = status_num == 2
        score1 = camp1.get("score")
        score2 = camp2.get("score")
        if status_num == 0:
            score1 = None
            score2 = None
        winner_id = ""
        if finished and score1 is not None and score2 is not None:
            winner_id = str(team1.get("id") if int(score1) > int(score2) else team2.get("id") if int(score2) > int(score1) else "")
        key = "final" if "总决赛" in stage else "knockout"
        rounds[key].append(
            {
                "id": str(match.get("match_id") or ""),
                "date": str(match.get("start_time") or "")[:16],
                "team1": team1,
                "team2": team2,
                "score1": score1,
                "score2": score2,
                "winnerId": winner_id,
                "loserId": "",
                "winnerTo": "冠军" if key == "final" else "晋级下一轮",
                "loserTo": "亚军" if key == "final" else "淘汰",
                "status": "finished" if finished else "live" if status_num == 1 else "upcoming",
            }
        )
    round_defs = (
        ("knockout", "淘汰赛赛程", "single"),
        ("final", "总决赛", "final"),
    )
    structured = [
        {"key": key, "name": name, "bracket": bracket, "matches": rounds[key]}
        for key, name, bracket in round_defs
        if rounds[key]
    ]
    if not structured:
        return build_s3_tts_placeholder(season_id, season)
    return {
        "season": season_id,
        "label": season.get("display") or season_id,
        "key": "tts",
        "name": "淘汰赛",
        "stage": "淘汰赛",
        "view": "bracket",
        "source": "official",
        "sourceLabel": "官方赛程对阵",
        "sourceUrl": "https://kpl.qq.com/",
        "updatedAt": now_iso(),
        "rounds": structured,
        "groups": [],
        "note": "按官方赛程展示淘汰赛对阵；未开赛显示开赛时间，进行中显示当前比分，赛后自动更新赛果。",
    }


def build_s3_tts_placeholder(
    season_id: str,
    season: dict[str, Any],
) -> dict[str, Any]:
    """Official 8-team double-elimination structure, filled as games finish."""
    round_specs = (
        ("winners-qf", "胜者组四分之一决赛", "winners", 4, "胜者组半决赛", "败者组第一轮"),
        ("winners-sf", "胜者组半决赛", "winners", 2, "胜者组决赛", "败者组四分之一决赛"),
        ("winners-final", "胜者组决赛", "winners", 1, "总决赛", "败者组决赛"),
        ("losers-r1", "败者组第一轮", "losers", 2, "败者组四分之一决赛", "淘汰"),
        ("losers-qf", "败者组四分之一决赛", "losers", 2, "败者组半决赛", "淘汰"),
        ("losers-sf", "败者组半决赛", "losers", 2, "败者组决赛", "淘汰"),
        ("losers-final", "败者组决赛", "losers", 1, "总决赛", "淘汰"),
        ("final", "总决赛", "final", 1, "冠军", "亚军"),
    )
    rounds = []
    for key, name, bracket, count, winner_to, loser_to in round_specs:
        rounds.append(
            {
                "key": key,
                "name": name,
                "bracket": bracket,
                "matches": [
                    {
                        "id": f"{key}-{index + 1}",
                        "date": "",
                        "team1": {"id": "", "name": "待定", "short": ""},
                        "team2": {"id": "", "name": "待定", "short": ""},
                        "score1": None,
                        "score2": None,
                        "winnerId": "",
                        "loserId": "",
                        "winnerTo": winner_to,
                        "loserTo": loser_to,
                        "status": "tbd",
                    }
                    for index in range(count)
                ],
            }
        )
    return {
        "season": season_id,
        "label": season.get("display") or season_id,
        "key": "tts",
        "name": "淘汰赛",
        "stage": "淘汰赛",
        "view": "bracket",
        "source": "derived",
        "sourceLabel": "官方赛制结构",
        "sourceUrl": "https://pvp.qq.com/cp/kpl2026/index.html",
        "updatedAt": now_iso(),
        "rounds": rounds,
        "groups": [],
        "note": "官方淘汰赛为 8 队 BO7 双败淘汰；当前尚未开赛，先展示胜者组 / 败者组 / 总决赛结构，赛后自动填入对阵。",
    }


def compute_snapshot(
    seasons: dict[str, dict[str, Any]],
    base: dict[str, dict[str, Any]],
    roster: list[dict[str, Any]],
    series: list[dict[str, Any]],
    battles: list[dict[str, Any]],
    warnings: list[str],
) -> dict[str, Any]:
    hero_by_id = {hero["id"]: hero for hero in roster}
    team_index: dict[str, dict[str, Any]] = {}
    season_meta: dict[str, dict[str, Any]] = {}

    for season_id in sorted(seasons, key=lambda key: seasons[key]["order"]):
        season = seasons[season_id]
        teams_payload = base[season_id]["teams"]
        series_rows = [row for row in series if row["season"] == season_id]
        battle_rows = [row for row in battles if row["season"] == season_id]

        total_games = len(battle_rows)
        team_game_counts: dict[str, dict[str, int]] = {}
        for battle in battle_rows:
            for side_index in (0, 1):
                team_id = str(battle["t"][side_index])
                counts = team_game_counts.setdefault(team_id, {"played": 0, "wins": 0})
                counts["played"] += 1
                if battle["w"] == side_index + 1:
                    counts["wins"] += 1

        season_meta[season_id] = {
            "id": season_id,
            "label": season["display"],
            "short": season["short"],
            "leagueId": season["leagueId"],
            "leagueName": season["leagueName"],
            "startTime": season.get("startTime", ""),
            "endTime": season.get("endTime", ""),
            "battles": total_games,
            "series": len(series_rows),
            "teams": len(teams_payload),
            "battleRecords": len(battle_rows),
            "order": season["order"],
        }

        for team_entry in teams_payload:
            info = team_entry.get("team_info") or {}
            team_id = str(info.get("team_id") or "")
            if not team_id:
                continue
            team = team_index.setdefault(
                team_id,
                {
                    "id": team_id,
                    "name": str(info.get("team_name") or team_id),
                    "short": str(info.get("team_abbreviation") or ""),
                    "logo": str(info.get("team_icon") or ""),
                    "seasons": {},
                },
            )
            team_series = [row for row in series_rows if team_id in (row["t1"], row["t2"])]
            series_wins = sum(
                1
                for row in team_series
                if (row["w"] == 1 and row["t1"] == team_id)
                or (row["w"] == 2 and row["t2"] == team_id)
            )
            game_counts = team_game_counts.get(team_id, {"played": 0, "wins": 0})
            games_played = game_counts["played"]
            games_won = game_counts["wins"]
            team["seasons"][season_id] = {
                "series": {
                    "played": len(team_series),
                    "wins": series_wins,
                    "losses": len(team_series) - series_wins,
                    "winRate": round(series_wins / len(team_series), 4)
                    if team_series
                    else None,
                },
                "games": {
                    "played": games_played,
                    "wins": games_won,
                    "losses": max(0, games_played - games_won),
                    "winRate": round(games_won / games_played, 4) if games_played else None,
                },
            }

        hero_payload = base[season_id]["heroes"]
        for entry in hero_payload:
            info = entry.get("hero_info") or {}
            try:
                hero_id = int(info.get("hero_id"))
            except (TypeError, ValueError):
                continue
            hero = hero_by_id.get(hero_id)
            if hero is None:
                hero = {
                    "id": hero_id,
                    "name": str(info.get("hero_name") or hero_id),
                    "title": "",
                    "roles": [],
                    "remoteIcon": str(info.get("hero_icon") or ""),
                }
                hero_by_id[hero_id] = hero
                roster.append(hero)

        # Derive hero counts from the recovered per-game BP records. The
        # official settle endpoint is authoritative but occasionally omits a
        # few picks in older seasons; per-game records are complete here.
        hero_counts = {
            hero_id: {"bans": 0, "picks": 0, "wins": 0} for hero_id in hero_by_id
        }
        for battle in battle_rows:
            for side_index in (0, 1):
                won = battle["w"] == side_index + 1
                for hero_id in battle["p"][side_index]:
                    if hero_id in hero_counts:
                        hero_counts[hero_id]["picks"] += 1
                        if won:
                            hero_counts[hero_id]["wins"] += 1
                for hero_id in battle["b"][side_index]:
                    if hero_id in hero_counts:
                        hero_counts[hero_id]["bans"] += 1

        for hero_id, counts in hero_counts.items():
            bans = counts["bans"]
            picks = counts["picks"]
            wins = counts["wins"]
            hero_by_id[hero_id].setdefault("seasons", {})[season_id] = {
                "bans": bans,
                "banRate": round(bans / total_games, 4) if total_games else None,
                "picks": picks,
                "pickRate": round(picks / total_games, 4) if total_games else None,
                "wins": wins,
                "losses": max(0, picks - wins),
                "winRate": round(wins / picks, 4) if picks else None,
            }

    # Merge teams into a stable season-aware view.
    teams = sorted(team_index.values(), key=lambda t: t["name"])
    for team in teams:
        for season_id in seasons:
            team["seasons"].setdefault(
                season_id,
                {
                    "series": {"played": 0, "wins": 0, "losses": 0, "winRate": None},
                    "games": {"played": 0, "wins": 0, "losses": 0, "winRate": None},
                },
            )
        total_series_played = sum(s["series"]["played"] for s in team["seasons"].values())
        total_series_wins = sum(s["series"]["wins"] for s in team["seasons"].values())
        total_games_played = sum(s["games"]["played"] for s in team["seasons"].values())
        total_games_won = sum(s["games"]["wins"] for s in team["seasons"].values())
        team["total"] = {
            "series": {
                "played": total_series_played,
                "wins": total_series_wins,
                "losses": total_series_played - total_series_wins,
                "winRate": round(total_series_wins / total_series_played, 4)
                if total_series_played
                else None,
            },
            "games": {
                "played": total_games_played,
                "wins": total_games_won,
                "losses": total_games_played - total_games_won,
                "winRate": round(total_games_won / total_games_played, 4)
                if total_games_played
                else None,
            },
        }

    # Standings: annual finals use the official 大师组/精英组 points table;
    # summer has no open standings chart anymore, so aggregate its official
    # regular-season series into the same points format. Knockout stages are
    # shown as their own tables because wins/points there are not league points.
    standings: dict[str, dict[str, Any]] = {}
    for season_id in sorted(seasons, key=lambda key: seasons[key]["order"]):
        season = seasons[season_id]
        season_series = [row for row in series if row["season"] == season_id]
        if season_id == "KPL2026S3":
            official = base[season_id].get("standings")
            if isinstance(official, dict):
                lts = build_official_s3_standings(official, team_index, season)
            else:
                lts = derive_standings(
                    season_id,
                    season,
                    season_series,
                    team_index,
                    stage_contains="擂台赛",
                    stage_label="擂台赛",
                    group_name="擂台赛总榜",
                    note="官方积分接口暂不可用，按官方擂台赛赛果汇总：胜场=积分，净胜分=小局净胜。",
                    source_url="https://pvp.qq.com/cp/kpl2026/index.html",
                )
                warnings.append("年度总决赛官方积分榜暂不可用，已回退为赛程汇总积分榜")
            tws = build_s3_tws_bracket(
                season_id,
                season,
                season_series,
                team_index,
                base[season_id].get("matches") or [],
            )
            tts = build_s3_tts_schedule(
                season_id,
                season,
                team_index,
                base[season_id].get("matches") or [],
            )
            standings[season_id] = {
                **lts,
                "stage": "擂台赛",
                "stages": [
                    {**lts, "key": "lts", "name": "擂台赛"},
                    {**tws, "key": "tws", "name": "突围赛"},
                    {**tts, "key": "tts", "name": "淘汰赛"},
                ],
                "groups": lts.get("groups", []),
            }
        else:
            regular = derive_standings(
                season_id,
                season,
                season_series,
                team_index,
                stage_contains="常规赛",
                stage_label="常规赛",
                group_name="常规赛总榜",
                note="按官方常规赛赛果汇总：胜场=积分，净胜分=小局净胜；仅统计常规赛阶段。",
            )
            playoffs = build_s2_playoff_bracket(
                season_id, season, season_series, team_index
            )
            standings[season_id] = {
                **regular,
                "stage": "常规赛",
                "stages": [
                    {**regular, "key": "cgs", "name": "常规赛"},
                    {**playoffs, "key": "jhs", "name": "季后赛"},
                ],
                "groups": regular.get("groups", []),
            }

    # Actual positional usage, derived from each player's official lane/role
    # in every recorded game. This corrects heroes whose class/static page role
    # no longer matches how they are used in KPL (e.g. 杨戬/哪吒/夏侯惇 jungle,
    # 王维 mid, 张良/墨子 support).
    hero_position_counts: dict[str, dict[int, Counter[str]]] = {}
    for battle in battles:
        season_id = battle["season"]
        for row in battle.get("pl") or []:
            try:
                hero_id = int(row[1])
            except (TypeError, ValueError, IndexError):
                continue
            position = str(row[3] if len(row) > 3 else "").strip()
            if position not in ROLE_NAMES.values():
                continue
            by_hero = hero_position_counts.setdefault(season_id, {})
            by_hero.setdefault(hero_id, Counter())[position] += 1

    # Heroes: include the full official roster, including zero-presence heroes.
    heroes = []
    for hero in roster:
        seasons_stats = {}
        for season_id in seasons:
            seasons_stats[season_id] = hero.get("seasons", {}).get(
                season_id,
                {
                    "bans": 0,
                    "banRate": 0.0,
                    "picks": 0,
                    "pickRate": 0.0,
                    "wins": 0,
                    "losses": 0,
                    "winRate": None,
                },
            )
        total_bans = sum(stat["bans"] for stat in seasons_stats.values())
        total_picks = sum(stat["picks"] for stat in seasons_stats.values())
        total_wins = sum(stat["wins"] for stat in seasons_stats.values())
        total_games = sum(season_meta[s]["battles"] for s in seasons)

        position_stats = {}
        total_positions: Counter[str] = Counter()
        for season_id in seasons:
            season_positions = hero_position_counts.get(season_id, {}).get(hero["id"])
            if season_positions:
                position_stats[season_id] = dict(season_positions)
                total_positions.update(season_positions)
        official_roles = list(hero.get("roles", []))
        if total_positions:
            ordered = [role for role, _ in total_positions.most_common()]
            appearances = sum(total_positions.values())
            threshold = max(2, int(appearances * 0.08))
            actual_roles = [ordered[0]] + [
                role for role in ordered[1:] if total_positions[role] >= threshold
            ]
            roles = actual_roles
            position_stats["total"] = dict(total_positions)
        else:
            roles = official_roles
        heroes.append(
            {
                "id": hero["id"],
                "name": hero["name"],
                "title": hero.get("title", ""),
                "roles": roles,
                "officialRoles": official_roles,
                "positionStats": position_stats,
                "remoteIcon": hero.get("remoteIcon", ""),
                "localIcon": f"assets/heroes/{hero['id']}.jpg",
                "seasons": seasons_stats,
                "total": {
                    "bans": total_bans,
                    "banRate": round(total_bans / total_games, 4) if total_games else None,
                    "picks": total_picks,
                    "pickRate": round(total_picks / total_games, 4) if total_games else None,
                    "wins": total_wins,
                    "losses": max(0, total_picks - total_wins),
                    "winRate": round(total_wins / total_picks, 4) if total_picks else None,
                },
            }
        )
    heroes.sort(key=lambda h: (-(h["total"]["bans"] + h["total"]["picks"]), h["name"]))

    all_team_ids = {team["id"] for team in teams}
    clean_series = [
        row
        for row in series
        if row["t1"] in all_team_ids and row["t2"] in all_team_ids
    ]
    clean_battles = [
        row
        for row in battles
        if row["t"][0] in all_team_ids and row["t"][1] in all_team_ids
    ]

    # Player-hero history, limited to the two requested seasons. This powers
    # the "selected team's players on this hero" breakdown in the UI.
    player_index: dict[tuple[str, str, int], dict[str, Any]] = {}
    for battle in clean_battles:
        season_id = battle["season"]
        for row in battle.get("pl") or []:
            try:
                camp_no = int(row[0])
                hero_id = int(row[1])
            except (TypeError, ValueError, IndexError):
                continue
            if camp_no not in (1, 2) or not hero_id:
                continue
            team_id = str(battle["t"][camp_no - 1])
            player_name = str(row[2] if len(row) > 2 else "").strip()
            position = str(row[3] if len(row) > 3 else "").strip()
            if not player_name:
                continue
            key = (team_id, player_name, hero_id)
            record = player_index.setdefault(
                key,
                {
                    "teamId": team_id,
                    "playerName": player_name,
                    "position": position,
                    "heroId": hero_id,
                    "seasons": {},
                },
            )
            if position and not record["position"]:
                record["position"] = position
            season_stats = record["seasons"].setdefault(
                season_id, {"games": 0, "wins": 0}
            )
            season_stats["games"] += 1
            if battle["w"] == camp_no:
                season_stats["wins"] += 1

    player_heroes = []
    for record in player_index.values():
        seasons_stats = {}
        total_games = 0
        total_wins = 0
        for season_id in sorted(seasons, key=lambda key: seasons[key]["order"]):
            stats = record["seasons"].get(season_id, {"games": 0, "wins": 0})
            games = int(stats["games"])
            wins = int(stats["wins"])
            total_games += games
            total_wins += wins
            seasons_stats[season_id] = {
                "games": games,
                "wins": wins,
                "winRate": round(wins / games, 4) if games else None,
            }
        player_heroes.append(
            {
                **record,
                "seasons": seasons_stats,
                "total": {
                    "games": total_games,
                    "wins": total_wins,
                    "winRate": round(total_wins / total_games, 4)
                    if total_games
                    else None,
                },
            }
        )
    player_heroes.sort(
        key=lambda row: (
            row["teamId"],
            -row["total"]["games"],
            row["playerName"],
            row["heroId"],
        )
    )

    data_through = max((row["date"] for row in clean_series), default="")
    total_series = len(clean_series)
    total_battles = sum(meta["battles"] for meta in season_meta.values())
    return {
        "schemaVersion": 1,
        "meta": {
            "generatedAt": now_iso(),
            "dataThrough": data_through,
            "source": "腾讯王者荣耀官方赛事中台",
            "sourceShort": "王者荣耀赛事官方数据",
            "sourceNote": (
                "赛程、BP、英雄 Ban/Pick 与战队数据来自腾讯王者荣耀赛事官方接口"
                "（prod.comp.smoba.qq.com，与王者营地赛事数据同源）；"
                "年度总决赛积分榜来自 KPL 官方赛事页 AMS 图表，夏季赛积分由官方赛程汇总。"
                "本工具为本地分析工具，非官方客户端。"
            ),
            "sourceUrls": [
                API_BASE + "/leaguesite/leagues/open",
                API_BASE + "/leaguesite/matches/open",
                API_BASE + "/leaguesite/battle/open",
                "https://pvp.qq.com/cp/kpl2026/index.html",
                "http://pvp.qq.com/cp/a20260601xjsjfb/index.html",
            ],
            "seasonOrder": sorted(seasons, key=lambda key: seasons[key]["order"]),
            "seasons": season_meta,
            "combinedLabel": "两赛季合计",
            "totalSeries": total_series,
            "totalBattles": total_battles,
            "playerHeroRecords": len(player_heroes),
            "players": len(
                {(row["teamId"], row["playerName"]) for row in player_heroes}
            ),
            "warnings": warnings[:50],
        },
        "heroes": heroes,
        "teams": teams,
        "series": clean_series,
        "battles": clean_battles,
        "playerHeroes": player_heroes,
        "standings": standings,
    }


def acquire_lock() -> Any | None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if LOCK_PATH.exists():
        try:
            age = time.time() - LOCK_PATH.stat().st_mtime
            if age > 30 * 60:
                LOCK_PATH.unlink(missing_ok=True)
        except OSError:
            pass
    try:
        fd = os.open(LOCK_PATH, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.write(fd, f"{os.getpid()} {now_iso()}".encode("ascii", "ignore"))
        return fd
    except FileExistsError:
        return None


def release_lock(fd: Any | None) -> None:
    if fd is not None:
        try:
            os.close(fd)
        except OSError:
            pass
    LOCK_PATH.unlink(missing_ok=True)


def download_assets(snapshot: dict[str, Any]) -> None:
    """Best-effort cache of hero portraits and team logos for offline use."""
    HERO_DIR = WEB_ASSETS / "heroes"
    TEAM_DIR = WEB_ASSETS / "teams"
    HERO_DIR.mkdir(parents=True, exist_ok=True)
    TEAM_DIR.mkdir(parents=True, exist_ok=True)

    hero_tasks = []
    for hero in snapshot.get("heroes", []):
        path = HERO_DIR / f"{hero['id']}.jpg"
        if path.exists() and path.stat().st_size > 500:
            continue
        url = hero.get("remoteIcon") or (
            f"https://res.edata.qq.com/sgame/static/images/hero/{hero['id']}.jpg"
        )
        hero_tasks.append((url, path))
    team_tasks = []
    for team in snapshot.get("teams", []):
        path = TEAM_DIR / f"{team['id']}.png"
        if path.exists() and path.stat().st_size > 500:
            continue
        if team.get("logo"):
            team_tasks.append((team["logo"], path))

    def download_one(task: tuple[str, Path]) -> None:
        url, path = task
        try:
            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": HEADERS["User-Agent"],
                    "Referer": "https://pvp.qq.com/",
                },
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                raw = response.read()
            if len(raw) > 500:
                path.write_bytes(raw)
        except Exception:
            return

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        list(pool.map(download_one, hero_tasks + team_tasks))


def run_sync(force: bool = False) -> dict[str, Any]:
    started = time.time()
    set_status(
        state="running",
        phase="starting",
        message="开始同步官方赛事数据",
        startedAt=now_iso(),
        finishedAt=None,
        error=None,
        progress=0,
        total=0,
        warnings=[],
    )
    lock_fd = acquire_lock()
    if lock_fd is None:
        set_status(state="busy", message="已有同步任务在运行")
        raise RuntimeError("A sync task is already running")
    try:
        seasons = discover_leagues()
        set_status(phase="discovering", message="已定位 2026 两个赛季")

        base: dict[str, dict[str, Any]] = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            futures = {
                pool.submit(fetch_season_base, season, force): season_id
                for season_id, season in seasons.items()
            }
            for future in concurrent.futures.as_completed(futures):
                season_id = futures[future]
                base[season_id] = future.result()

        roster = get_hero_roster()
        series, battles, warnings = collect_battle_records(
            seasons, base, force=force
        )
        set_status(phase="computing", message="正在汇总英雄、战队与 BP 数据")

        snapshot = compute_snapshot(seasons, base, roster, series, battles, warnings)
        write_json_atomic(SNAPSHOT_PATH, snapshot)
        download_assets(snapshot)

        elapsed = round(time.time() - started, 1)
        result = {
            "ok": True,
            "generatedAt": snapshot["meta"]["generatedAt"],
            "battles": snapshot["meta"]["totalBattles"],
            "series": snapshot["meta"]["totalSeries"],
            "heroes": len(snapshot["heroes"]),
            "teams": len(snapshot["teams"]),
            "warnings": len(snapshot["meta"]["warnings"]),
            "elapsed": elapsed,
        }
        set_status(
            state="idle",
            phase="done",
            message=(
                f"同步完成：{result['battles']} 小局 / {result['series']} 场系列赛 / "
                f"{result['heroes']} 位英雄"
            ),
            finishedAt=now_iso(),
            duration=elapsed,
            snapshot=result,
            error=None,
            warnings=snapshot["meta"]["warnings"],
        )
        return result
    except Exception as exc:  # noqa: BLE001
        set_status(
            state="error",
            phase="error",
            message=f"同步失败：{exc}",
            finishedAt=now_iso(),
            error=str(exc),
        )
        raise
    finally:
        release_lock(lock_fd)


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync KPL competition data")
    parser.add_argument("--force", action="store_true", help="ignore HTTP caches")
    args = parser.parse_args()
    try:
        result = run_sync(force=args.force)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"sync failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
