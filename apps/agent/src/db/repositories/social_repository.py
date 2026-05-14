"""Stub repository for social_connections — will be used in Phase 2."""

from __future__ import annotations

from typing import Any, Optional

from db.connection import connection


def list_connections(expert_id: str) -> list[dict[str, Any]]:
    """List active social connections for an expert."""
    with connection() as conn:
        if conn is None:
            return []
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, platform, account_name, is_active, metadata, created_at "
                    "FROM public.social_connections WHERE expert_id = %s ORDER BY platform",
                    (expert_id,),
                )
                rows = cur.fetchall()
            return [
                {
                    "id": str(r[0]),
                    "platform": r[1],
                    "account_name": r[2],
                    "is_active": r[3],
                    "metadata": r[4] if isinstance(r[4], dict) else {},
                    "created_at": r[5].isoformat() if r[5] else "",
                }
                for r in rows
            ]
        except Exception:
            return []
