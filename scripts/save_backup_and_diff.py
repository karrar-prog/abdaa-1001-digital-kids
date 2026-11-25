#!/usr/bin/env python3
"""
Abdaa 1001 Digital Kids — Automated Backup & Changelog Processor
Saves full Supabase cloud + local data snapshots into ./backups/
and appends a structured Arabic diff changelog to ./backups/CHANGES_LOG.md.
"""

import hashlib
import json
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

BAGHDAD_TZ = timezone(timedelta(hours=3))
WORKSPACE = Path(__file__).resolve().parent.parent
BACKUPS_DIR = WORKSPACE / "backups"
INCOMING_FILE = BACKUPS_DIR / "_incoming_cloud_dump.json"
LATEST_FILE = BACKUPS_DIR / "latest_backup.json"
CHANGELOG_FILE = BACKUPS_DIR / "CHANGES_LOG.md"

LOCAL_DATA_FILES = [
    "src/data/projectsData.js",
    "src/data/cohortsData.js",
    "src/data/eventData.js",
    "src/data/mentorsData.js",
]

TABLE_LABELS = {
    "abdaa_tickets": "التذاكر وحجوزات الحضور",
    "abdaa_volunteers": "المتطوعون",
    "abdaa_batch2_students": "تسجيلات الدفعة الثانية",
    "abdaa_sponsors": "الرعاة والداعمون",
    "abdaa_site_cms": "إعدادات المحتوى السحابي (CMS)",
    "abdaa_pride_messages": "رسائل حائط الفخر",
    "abdaa_project_evaluations": "تقييمات لجنة التحكيم",
    "abdaa_issued_id_cards": "الهويات الصادرة",
    "abdaa_admin_users": "حسابات الإدارة",
    "abdaa_project_ratings": "تقييمات النجوم للمشاريع (QR)",
}

REDACTED_FIELDS = {"password", "password_hash", "token", "secret"}


def row_key(table_name: str, row: dict) -> str:
    if "id" in row and row["id"] is not None:
        return str(row["id"])
    if table_name == "abdaa_site_cms" and row.get("key") is not None:
        return str(row["key"])
    if table_name == "abdaa_admin_users" and row.get("username"):
        return str(row["username"])
    if table_name == "abdaa_project_ratings":
        return f"p{row.get('project_id')}_d{row.get('device_id')}"
    return hashlib.sha1(json.dumps(row, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()[:12]


def summarize_row(table_name: str, row: dict) -> str:
    if table_name == "abdaa_tickets":
        return f"{row.get('attendee_name') or row.get('full_name') or 'زائر'} ({row.get('booking_code') or row.get('id')})"
    if table_name == "abdaa_volunteers":
        return f"{row.get('full_name') or 'متطوع'} — {row.get('committee') or row.get('field_of_interest') or ''}".strip(" —")
    if table_name == "abdaa_batch2_students":
        return f"{row.get('child_name') or row.get('student_name') or 'طفل'} ({row.get('candidate_code') or row.get('id')})"
    if table_name == "abdaa_sponsors":
        return f"{row.get('company_name') or row.get('name') or 'راعي'}"
    if table_name == "abdaa_pride_messages":
        return f"{row.get('sender_name') or row.get('senderName') or 'مرسل'} ← {row.get('child_name') or row.get('childName') or ''}".strip(" ←")
    if table_name == "abdaa_project_ratings":
        return f"مشروع #{row.get('project_id')} — {row.get('stars')} نجوم"
    if table_name == "abdaa_project_evaluations":
        return f"مشروع #{row.get('project_id')} — الدرجة: {row.get('total_score') or row.get('score') or '-'}"
    if table_name == "abdaa_issued_id_cards":
        return f"{row.get('full_name') or 'عضو'} ({row.get('card_code') or row.get('id')})"
    if table_name == "abdaa_admin_users":
        return f"{row.get('username') or row.get('display_name') or row.get('id')} ({row.get('role') or ''})"
    if table_name == "abdaa_site_cms":
        return f"مفتاح CMS: {row.get('key') or row.get('id')}"
    return f"سجل #{row_key(table_name, row)}"


def sanitize_value(field: str, value):
    if field.lower() in REDACTED_FIELDS:
        return "***"
    text = json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list)) else str(value)
    return text if len(text) <= 80 else text[:77] + "..."


def snapshot_local_files() -> dict:
    meta = {}
    for rel in LOCAL_DATA_FILES:
        p = WORKSPACE / rel
        if p.exists():
            raw = p.read_bytes()
            meta[rel] = {
                "size_bytes": len(raw),
                "sha256": hashlib.sha256(raw).hexdigest(),
                "modified_at": datetime.fromtimestamp(p.stat().st_mtime, tz=BAGHDAD_TZ).isoformat(),
            }
    return meta


def main():
    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
    if not INCOMING_FILE.exists():
        print(f"ERROR: Incoming cloud dump not found at {INCOMING_FILE}", file=sys.stderr)
        sys.exit(1)

    cloud_tables = json.loads(INCOMING_FILE.read_text(encoding="utf-8"))
    now = datetime.now(BAGHDAD_TZ)
    ts_slug = now.strftime("%Y-%m-%d_%H-%M-%S")
    ts_human = now.strftime("%Y-%m-%d الساعة %H:%M:%S (توقيت بغداد)")

    local_files_meta = snapshot_local_files()

    current_snapshot = {
        "backup_timestamp": now.isoformat(),
        "timezone": "Asia/Baghdad",
        "counts": {t: len(rows) if isinstance(rows, list) else 0 for t, rows in cloud_tables.items()},
        "local_data_files": local_files_meta,
        "tables": cloud_tables,
    }

    prev_snapshot = None
    if LATEST_FILE.exists():
        try:
            prev_snapshot = json.loads(LATEST_FILE.read_text(encoding="utf-8"))
        except Exception:
            prev_snapshot = None

    backup_file = BACKUPS_DIR / f"backup_{ts_slug}.json"
    backup_file.write_text(json.dumps(current_snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
    LATEST_FILE.write_text(json.dumps(current_snapshot, ensure_ascii=False, indent=2), encoding="utf-8")

    # Compute structured Arabic changelog
    lines = []
    if not CHANGELOG_FILE.exists():
        lines.append("# سجل النسخ الاحتياطية والتغييرات — مبادرة 1001 طفل رقمي (نادي أبدع)\n")
        lines.append("> يتم تحديث هذا السجل تلقائياً مع كل نسخة احتياطية دورية (كل 4 ساعات).\n")

    lines.append(f"\n---\n\n## 📦 نسخة احتياطية — {ts_human}")
    lines.append(f"- **ملف النسخة:** `{backup_file.name}`")

    total_rows = sum(current_snapshot["counts"].values())
    counts_summary = " | ".join(
        f"{TABLE_LABELS.get(t, t)}: **{c}**" for t, c in current_snapshot["counts"].items() if c > 0
    )
    lines.append(f"- **إجمالي السجلات السحابية:** **{total_rows}** ({counts_summary or 'لا توجد سجلات'})")

    changes_found = False

    if prev_snapshot is None:
        lines.append("- **الحالة:** ✅ أول نسخة احتياطية مرجعية (Baseline) — ستُسجّل جميع التغييرات مقارنةً بها في المرات القادمة.")
        changes_found = True
    else:
        prev_tables = prev_snapshot.get("tables", {})
        table_diffs = []

        all_table_names = sorted(set(prev_tables.keys()) | set(cloud_tables.keys()))
        for t in all_table_names:
            old_map = {row_key(t, r): r for r in (prev_tables.get(t) or []) if isinstance(r, dict)}
            new_map = {row_key(t, r): r for r in (cloud_tables.get(t) or []) if isinstance(r, dict)}

            added_keys = [k for k in new_map if k not in old_map]
            removed_keys = [k for k in old_map if k not in new_map]
            updated_entries = []

            for k in new_map:
                if k in old_map and new_map[k] != old_map[k]:
                    old_r, new_r = old_map[k], new_map[k]
                    diff_fields = []
                    for fk in sorted(set(old_r.keys()) | set(new_r.keys())):
                        if old_r.get(fk) != new_r.get(fk):
                            diff_fields.append(
                                f"`{fk}`: {sanitize_value(fk, old_r.get(fk))} ← {sanitize_value(fk, new_r.get(fk))}"
                            )
                    updated_entries.append((summarize_row(t, new_r), diff_fields))

            if added_keys or removed_keys or updated_entries:
                changes_found = True
                label = TABLE_LABELS.get(t, t)
                table_diffs.append(f"### 🔹 {label} (`{t}`)")
                if added_keys:
                    table_diffs.append(f"- **إضافات جديدة (+{len(added_keys)}):**")
                    for k in added_keys[:25]:
                        table_diffs.append(f"  - ➕ {summarize_row(t, new_map[k])}")
                    if len(added_keys) > 25:
                        table_diffs.append(f"  - ... و {len(added_keys) - 25} سجل إضافي")
                if removed_keys:
                    table_diffs.append(f"- **سجلات محذوفة (-{len(removed_keys)}):**")
                    for k in removed_keys[:25]:
                        table_diffs.append(f"  - ➖ {summarize_row(t, old_map[k])}")
                    if len(removed_keys) > 25:
                        table_diffs.append(f"  - ... و {len(removed_keys) - 25} سجل إضافي")
                if updated_entries:
                    table_diffs.append(f"- **تعديلات ({len(updated_entries)}):**")
                    for title, fields in updated_entries[:25]:
                        table_diffs.append(f"  - ✏️ {title}: " + " ، ".join(fields[:6]))
                    if len(updated_entries) > 25:
                        table_diffs.append(f"  - ... و {len(updated_entries) - 25} تعديل إضافي")

        # Check local data file changes
        prev_local = prev_snapshot.get("local_data_files", {})
        local_diffs = []
        for rel, meta in local_files_meta.items():
            old_meta = prev_local.get(rel)
            if not old_meta:
                local_diffs.append(f"  - ➕ ملف بيانات محلي جديد: `{rel}` ({meta['size_bytes']} بايت)")
            elif old_meta.get("sha256") != meta.get("sha256"):
                local_diffs.append(
                    f"  - ✏️ تعديل ملف محلي: `{rel}` ({old_meta.get('size_bytes')} ← {meta['size_bytes']} بايت)"
                )
        if local_diffs:
            changes_found = True
            table_diffs.append("### 📁 تغييرات ملفات البيانات المحلية (`src/data/`)")
            table_diffs.extend(local_diffs)

        if not changes_found:
            lines.append("- **التغييرات:** لا توجد أي تغييرات جديدة منذ النسخة الاحتياطية السابقة.")
        else:
            lines.extend(table_diffs)

    with CHANGELOG_FILE.open("a", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")

    # Clean up incoming temporary file
    try:
        INCOMING_FILE.unlink()
    except OSError:
        pass

    print(json.dumps({
        "ok": True,
        "backup_file": str(backup_file),
        "latest_file": str(LATEST_FILE),
        "changelog_file": str(CHANGELOG_FILE),
        "total_rows": total_rows,
        "changes_detected": changes_found,
        "counts": current_snapshot["counts"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
