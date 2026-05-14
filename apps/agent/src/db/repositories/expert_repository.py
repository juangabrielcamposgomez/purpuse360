"""CRUD for the expert_context table."""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from db.connection import connection


def save_expert_context(specialty: str, profile_data: dict[str, Any]) -> Optional[str]:
    """Insert or update the expert context. Returns the expert id."""
    expert_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    goals = profile_data.get("goals", [])
    target_audience = profile_data.get("target_audience", "")
    services = profile_data.get("services", [])

    with connection() as conn:
        if conn is None:
            return None
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO public.expert_context
                        (id, specialty, profile_data, goals, target_audience, services, updated_at)
                    VALUES (%s, %s, %s::jsonb, %s::jsonb, %s, %s::jsonb, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        specialty = EXCLUDED.specialty,
                        profile_data = EXCLUDED.profile_data,
                        goals = EXCLUDED.goals,
                        target_audience = EXCLUDED.target_audience,
                        services = EXCLUDED.services,
                        updated_at = EXCLUDED.updated_at
                    """,
                    (
                        expert_id,
                        specialty,
                        json.dumps(profile_data),
                        json.dumps(goals if isinstance(goals, list) else [goals]),
                        target_audience,
                        json.dumps(services if isinstance(services, list) else [services]),
                        now,
                    ),
                )
            conn.commit()
            return expert_id
        except Exception as exc:
            print(f"[expert_repo] save failed: {exc}")
            return None


def get_expert_context() -> Optional[dict[str, Any]]:
    """Fetch the most recent expert context."""
    with connection() as conn:
        if conn is None:
            return None
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, specialty, profile_data, goals, target_audience, services, created_at, updated_at "
                    "FROM public.expert_context ORDER BY updated_at DESC LIMIT 1"
                )
                row = cur.fetchone()
            if not row:
                return None
            return {
                "id": str(row[0]),
                "specialty": row[1],
                "profile_data": row[2] if isinstance(row[2], dict) else {},
                "goals": row[3] if isinstance(row[3], list) else [],
                "target_audience": row[4] or "",
                "services": row[5] if isinstance(row[5], list) else [],
                "created_at": row[6].isoformat() if row[6] else "",
                "updated_at": row[7].isoformat() if row[7] else "",
            }
        except Exception as exc:
            print(f"[expert_repo] get failed: {exc}")
            return None
