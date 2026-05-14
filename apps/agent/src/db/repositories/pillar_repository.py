"""CRUD for pillar_audits table — replaces the old in-memory pillar plan."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Optional

from db.connection import connection, PILLAR_KEYS


def save_pillar_plan(
    expert_id: str, specialty: str, pillars: dict[str, Any]
) -> Optional[dict[str, Any]]:
    """Upsert one row per pillar for this expert."""
    now = datetime.now(timezone.utc).isoformat()

    with connection() as conn:
        if conn is None:
            return None
        try:
            with conn.cursor() as cur:
                for key in PILLAR_KEYS:
                    p = pillars.get(key, {})
                    score = min(100, max(0, p.get("score", 0)))
                    status = p.get("status", "not_started")
                    next_action = p.get("next_action", "")
                    history = p.get("history", [])
                    audit_data = p.get("audit_data", {})
                    recommendations = p.get("recommendations", [])

                    cur.execute(
                        """
                        INSERT INTO public.pillar_audits
                            (expert_id, type, score, status, next_action, history, audit_data, recommendations, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s::jsonb, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            score = EXCLUDED.score,
                            status = EXCLUDED.status,
                            next_action = EXCLUDED.next_action,
                            history = EXCLUDED.history,
                            audit_data = EXCLUDED.audit_data,
                            recommendations = EXCLUDED.recommendations,
                            updated_at = EXCLUDED.updated_at
                        """,
                        (
                            expert_id, key, score, status, next_action,
                            json.dumps(history), json.dumps(audit_data),
                            json.dumps(recommendations), now,
                        ),
                    )
            conn.commit()
            return _build_plan(expert_id, specialty)
        except Exception as exc:
            print(f"[pillar_repo] save failed: {exc}")
            return None


def get_pillar_plan(expert_id: Optional[str] = None) -> Optional[dict[str, Any]]:
    """Fetch the pillar plan for the given expert (or the most recent one)."""
    with connection() as conn:
        if conn is None:
            return None
        try:
            with conn.cursor() as cur:
                if expert_id:
                    cur.execute(
                        "SELECT e.specialty, e.id FROM public.expert_context e WHERE e.id = %s",
                        (expert_id,),
                    )
                else:
                    cur.execute(
                        "SELECT e.specialty, e.id FROM public.expert_context e ORDER BY e.updated_at DESC LIMIT 1"
                    )
                expert_row = cur.fetchone()
                if not expert_row:
                    return None
                specialty = expert_row[0]
                eid = str(expert_row[1])

                cur.execute(
                    "SELECT type, score, status, next_action, history, audit_data, recommendations, updated_at "
                    "FROM public.pillar_audits WHERE expert_id = %s",
                    (eid,),
                )
                rows = cur.fetchall()

            pillars = {}
            for row in rows:
                key = row[0]
                pillars[key] = {
                    "score": row[1] or 0,
                    "status": row[2] or "not_started",
                    "next_action": row[3] or "",
                    "history": row[4] if isinstance(row[4], list) else [],
                    "audit_data": row[5] if isinstance(row[5], dict) else {},
                    "recommendations": row[6] if isinstance(row[6], list) else [],
                    "last_review": row[7].isoformat() if row[7] else "",
                }

            return _build_plan(eid, specialty, pillars)
        except Exception as exc:
            print(f"[pillar_repo] get failed: {exc}")
            return None


def update_pillar_action(
    pillar_key: str, action: str, score_delta: int = 5
) -> Optional[dict[str, Any]]:
    """Append an action to a pillar's history and update its score."""
    with connection() as conn:
        if conn is None:
            return None
        try:
            with conn.cursor() as cur:
                # Find the most recent expert
                cur.execute(
                    "SELECT e.id FROM public.expert_context e ORDER BY e.updated_at DESC LIMIT 1"
                )
                expert_row = cur.fetchone()
                if not expert_row:
                    return None
                eid = str(expert_row[0])

                cur.execute(
                    "SELECT id, score, history FROM public.pillar_audits "
                    "WHERE expert_id = %s AND type = %s",
                    (eid, pillar_key),
                )
                audit_row = cur.fetchone()
                if not audit_row:
                    return None

                audit_id = audit_row[0]
                current_score = audit_row[1] or 0
                history = audit_row[2] if isinstance(audit_row[2], list) else []
                now = datetime.now(timezone.utc).isoformat()
                new_score = min(100, max(0, current_score + score_delta))
                history.append({"action": action, "date": now, "impact": score_delta})
                status = _infer_status(new_score)

                cur.execute(
                    "UPDATE public.pillar_audits SET score = %s, status = %s, "
                    "history = %s::jsonb, next_action = '', updated_at = %s "
                    "WHERE id = %s",
                    (new_score, status, json.dumps(history), now, audit_id),
                )
            conn.commit()
            return get_pillar_plan(eid)
        except Exception as exc:
            print(f"[pillar_repo] update failed: {exc}")
            return None


def get_pending_pillar_actions(expert_id: Optional[str] = None) -> list[dict[str, Any]]:
    """Return all pillars with a non-empty next_action."""
    plan = get_pillar_plan(expert_id)
    if not plan:
        return []
    pending = []
    for key, p in (plan.get("pillars") or {}).items():
        if p.get("next_action"):
            pending.append({"pillar": key, "action": p["next_action"], "score": p["score"]})
    return pending


def _build_plan(
    expert_id: str,
    specialty: str,
    pillars: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """Construct the plan dict from stored data."""
    if pillars is None:
        pillars = {}
    # Ensure every pillar key exists
    for key in PILLAR_KEYS:
        if key not in pillars:
            pillars[key] = {
                "score": 0,
                "status": "not_started",
                "last_review": "",
                "next_action": "",
                "history": [],
            }
    return {
        "expert_id": expert_id,
        "specialty": specialty,
        "pillars": pillars,
        "overall_health_score": _compute_health(pillars),
        "last_agent_update": datetime.now(timezone.utc).isoformat(),
    }


def _compute_health(pillars: dict[str, Any]) -> int:
    scores = [v.get("score", 0) for v in pillars.values() if isinstance(v, dict)]
    return round(sum(scores) / len(scores)) if scores else 0


def _infer_status(score: int) -> str:
    if score >= 80:
        return "on_track"
    if score >= 50:
        return "in_progress"
    if score >= 20:
        return "needs_attention"
    return "not_started"
