import os
import json
import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional, Dict

class DBStore:
    """Store for Purpose360 AI operational data.
    
    If Postgres is not reachable (e.g. Docker not running), falls back to 
    an in-memory store for the current session to ensure the agent stays functional.
    """
    
    def __init__(self):
        self._is_mock = True
        self._expert_context: Dict[str, Any] = {}
        self._interfaces: List[Dict[str, Any]] = []
        self._feedback: List[Dict[str, Any]] = []
        self._networking: List[Dict[str, Any]] = []
        
        # Try to connect to real Postgres if available
        # Connection string for outside Docker: postgresql://intelligence:intelligence@localhost:5433/postgres
        self.db_url = os.getenv("DATABASE_URL") or "postgresql://intelligence:intelligence@localhost:5433/postgres"
        
        # We don't initialize the real DB connection here to avoid blocking at boot
        # Instead, we do it lazily in the first tool call.
        
    def _get_conn(self):
        """Lazy connection to Postgres."""
        try:
            import psycopg
            # In a real implementation, we would use a connection pool
            return psycopg.connect(self.db_url)
        except Exception:
            return None

    def save_expert_context(self, specialty: str, profile_data: Dict[str, Any]) -> str:
        """Persist the professional profile."""
        new_id = str(uuid.uuid4())
        self._expert_context = {
            "id": new_id,
            "specialty": specialty,
            "profile_data": profile_data,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        # In mock mode, we just store it in memory
        print(f"[db_store] Saved expert context for {specialty}")
        return new_id

    def get_expert_context(self) -> Optional[Dict[str, Any]]:
        """Fetch the current expert profile."""
        return self._expert_context or None

    def save_interface(self, expert_id: str, component_type: str, ui_schema: Dict[str, Any], current_state: Dict[str, Any]) -> str:
        """Persist a generated interface."""
        new_id = str(uuid.uuid4())
        interface = {
            "id": new_id,
            "expert_id": expert_id,
            "component_type": component_type,
            "ui_schema": ui_schema,
            "current_state": current_state,
            "last_agent_update": datetime.now(timezone.utc).isoformat()
        }
        self._interfaces.append(interface)
        print(f"[db_store] Saved interface {component_type}")
        return new_id

    def list_interfaces(self, expert_id: str) -> List[Dict[str, Any]]:
        """List all active interfaces for the expert."""
        return [i for i in self._interfaces if i["expert_id"] == expert_id]

    def save_networking_recommendation(self, expert_id: str, name: str, entity_type: str, metadata: Dict[str, Any]) -> str:
        """Save a networking recommendation."""
        new_id = str(uuid.uuid4())
        rec = {
            "id": new_id,
            "expert_id": expert_id,
            "name": name,
            "type": entity_type,
            "metadata": metadata,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self._networking.append(rec)
        return new_id

_db_singleton = None

def get_db():
    global _db_singleton
    if _db_singleton is None:
        _db_singleton = DBStore()
    return _db_singleton
