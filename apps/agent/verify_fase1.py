import sys; sys.path.insert(0, 'src')
import json
from pathlib import Path
c = json.loads((Path('data/constants.json')).read_text())
print(f'OK: constants.json has {len(c["pillar_keys"])} pillar keys, {len(c["lead_statuses"])} statuses')
from db.connection import is_connected, PILLAR_KEYS
print(f'OK: PILLAR_KEYS from db.connection: {PILLAR_KEYS}')
from db_store import get_db
db = get_db()
assert db.PILLAR_KEYS == PILLAR_KEYS
print(f'OK: db_store singleton created, mock={db._is_mock}')
from db.repositories.pillar_repository import save_pillar_plan, get_pillar_plan, update_pillar_action, get_pending_pillar_actions
print('OK: pillar_repository functions importable')
from db.repositories.expert_repository import save_expert_context, get_expert_context
print('OK: expert_repository functions importable')
from db.repositories.social_repository import list_connections
print('OK: social_repository functions importable')
print()
print('=== FASE 1 VERIFICATION PASSED ===')
