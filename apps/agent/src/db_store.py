import os
import json
import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional, Dict

from db.connection import is_connected, PILLAR_KEYS
from db.repositories import expert_repository, pillar_repository


class DBStore:
    """Store for Purpose360 AI operational data.

    Backed by PostgreSQL when available (Docker running, schema migrated).
    Falls back to an in-memory store for the current session when Postgres
    is unreachable, ensuring the agent stays functional in dev.
    """

    PILLAR_KEYS = PILLAR_KEYS

    def __init__(self):
        self._is_mock = not is_connected()
        self._expert_context: Dict[str, Any] = {}
        self._interfaces: List[Dict[str, Any]] = []
        self._feedback: List[Dict[str, Any]] = []
        self._networking: List[Dict[str, Any]] = []
        self._pillar_plan: Optional[Dict[str, Any]] = None

        if not self._is_mock:
            print("[db_store] Using PostgreSQL backend")
        else:
            print("[db_store] Using in-memory fallback")

    # ── expert profile ─────────────────────────────────────────────────

    def save_expert_context(self, specialty: str, profile_data: Dict[str, Any]) -> str:
        if not self._is_mock:
            result = expert_repository.save_expert_context(specialty, profile_data)
            if result:
                print(f"[db_store] Saved expert context for {specialty} (Postgres)")
                return result

        new_id = str(uuid.uuid4())
        self._expert_context = {
            "id": new_id,
            "specialty": specialty,
            "profile_data": profile_data,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        print(f"[db_store] Saved expert context for {specialty} (in-memory)")
        return new_id

    def get_expert_context(self) -> Optional[Dict[str, Any]]:
        if not self._is_mock:
            result = expert_repository.get_expert_context()
            if result:
                return result
        return self._expert_context or None

    # ── generated interfaces ────────────────────────────────────────────

    def save_interface(self, expert_id: str, component_type: str, ui_schema: Dict[str, Any], current_state: Dict[str, Any]) -> str:
        new_id = str(uuid.uuid4())
        interface = {
            "id": new_id,
            "expert_id": expert_id,
            "component_type": component_type,
            "ui_schema": ui_schema,
            "current_state": current_state,
            "last_agent_update": datetime.now(timezone.utc).isoformat(),
        }
        self._interfaces.append(interface)
        print(f"[db_store] Saved interface {component_type}")
        return new_id

    def list_interfaces(self, expert_id: str) -> List[Dict[str, Any]]:
        return [i for i in self._interfaces if i["expert_id"] == expert_id]

    # ── networking ──────────────────────────────────────────────────────

    def save_networking_recommendation(self, expert_id: str, name: str, entity_type: str, metadata: Dict[str, Any]) -> str:
        new_id = str(uuid.uuid4())
        rec = {
            "id": new_id,
            "expert_id": expert_id,
            "name": name,
            "type": entity_type,
            "metadata": metadata,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self._networking.append(rec)
        return new_id

    # ── pillars ─────────────────────────────────────────────────────────

    def _default_pillar(self) -> Dict[str, Any]:
        return {
            "score": 0,
            "status": "not_started",
            "last_review": "",
            "next_action": "",
            "history": [],
        }

    def save_pillar_plan(self, expert_id: str, specialty: str, pillars: Dict[str, Any]) -> str:
        if not self._is_mock:
            result = pillar_repository.save_pillar_plan(expert_id, specialty, pillars)
            if result:
                print(f"[db_store] Saved pillar plan for {specialty} ({expert_id}) (Postgres)")
                return expert_id

        plan = {
            "expert_id": expert_id,
            "specialty": specialty,
            "pillars": {
                k: {**self._default_pillar(), **(pillars.get(k) or {})}
                for k in self.PILLAR_KEYS
            },
            "overall_health_score": self._compute_health(pillars),
            "last_agent_update": datetime.now(timezone.utc).isoformat(),
        }
        self._pillar_plan = plan
        print(f"[db_store] Saved pillar plan for {specialty} ({expert_id}) (in-memory)")
        return expert_id

    def get_pillar_plan(self) -> Optional[Dict[str, Any]]:
        if not self._is_mock:
            result = pillar_repository.get_pillar_plan()
            if result:
                return result
        return getattr(self, "_pillar_plan", None)

    def update_pillar_action(self, pillar_key: str, action: str, score_delta: int = 5) -> Optional[Dict[str, Any]]:
        if not self._is_mock:
            result = pillar_repository.update_pillar_action(pillar_key, action, score_delta)
            if result:
                return result

        plan = getattr(self, "_pillar_plan", None)
        if not plan or pillar_key not in self.PILLAR_KEYS:
            return None
        pillar = plan["pillars"].get(pillar_key)
        if not pillar:
            return None
        entry = {
            "action": action,
            "date": datetime.now(timezone.utc).isoformat(),
            "impact": score_delta,
        }
        pillar["history"].append(entry)
        pillar["score"] = min(100, max(0, (pillar.get("score") or 0) + score_delta))
        pillar["last_review"] = datetime.now(timezone.utc).isoformat()
        pillar["status"] = self._infer_status(pillar["score"])
        pillar["next_action"] = ""
        plan["overall_health_score"] = self._compute_health(plan["pillars"])
        plan["last_agent_update"] = datetime.now(timezone.utc).isoformat()
        return plan

    def get_pending_pillar_actions(self) -> List[Dict[str, Any]]:
        if not self._is_mock:
            result = pillar_repository.get_pending_pillar_actions()
            if result:
                return result

        plan = getattr(self, "_pillar_plan", None)
        if not plan:
            return []
        pending = []
        for key, p in plan["pillars"].items():
            if p.get("next_action"):
                pending.append({"pillar": key, "action": p["next_action"], "score": p["score"]})
        return pending

    @staticmethod
    def _compute_health(pillars: Dict[str, Any]) -> int:
        scores = [v.get("score", 0) for v in pillars.values() if isinstance(v, dict)]
        return round(sum(scores) / len(scores)) if scores else 0

    @staticmethod
    def _infer_status(score: int) -> str:
        if score >= 80:
            return "on_track"
        if score >= 50:
            return "in_progress"
        if score >= 20:
            return "needs_attention"
        return "not_started"


_db_singleton = None


def get_db():
    global _db_singleton
    if _db_singleton is None:
        _db_singleton = DBStore()
    return _db_singleton
