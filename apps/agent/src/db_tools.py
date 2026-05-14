import json
from typing import Annotated, Dict, Any, List
from langchain_core.tools import tool
from db_store import get_db

@tool
def save_expert_profile(
    specialty: Annotated[str, "The healthcare specialty (e.g., 'Sleep Neurologist')"],
    goals: Annotated[List[str], "Primary goals of the professional"],
    target_audience: Annotated[str, "The primary patient or client group"],
    services: Annotated[List[str], "Services offered by the professional"],
) -> str:
    """Save the core professional profile to the Purpose360 AI operational database.
    
    Call this immediately after the user completes the onboarding flow or 
    manually provides their professional details. This 'Seed' data allows 
    the system to adapt all future Generative UI components.
    """
    db = get_db()
    profile_data = {
        "goals": goals,
        "target_audience": target_audience,
        "services": services
    }
    expert_id = db.save_expert_context(specialty, profile_data)
    return f"Expert profile for {specialty} saved successfully. ExpertID: {expert_id}"

@tool
def persist_generated_interface(
    expert_id: Annotated[str, "The ID of the professional (ExpertID)"],
    component_type: Annotated[str, "The type of UI component (e.g., 'SleepMetricsDashboard')"],
    ui_schema: Annotated[Dict[str, Any], "The configuration and layout of the component"],
    current_state: Annotated[Dict[str, Any], "The live data/metrics within the component"],
) -> str:
    """Persist a generated UI component to the database.
    
    Call this whenever you generate or update a complex Generative UI dashboard.
    This ensures the user's operational ecosystem is saved and can be recovered 
    in future sessions.
    """
    db = get_db()
    interface_id = db.save_interface(expert_id, component_type, ui_schema, current_state)
    return f"Interface {component_type} persisted successfully. InterfaceID: {interface_id}"

@tool
def get_professional_context() -> str:
    """Retrieve the current professional profile from the database.
    
    Use this to understand the context of the user if they haven't just 
    provided it. Returns 'No profile found' if the database is empty.
    """
    db = get_db()
    context = db.get_expert_context()
    if not context:
        return "No professional profile found in database. Please run onboarding."
    import json
    return json.dumps(context, indent=2)

@tool
def save_pillar_strategy(
    specialty: Annotated[str, "Healthcare specialty (e.g., 'neurólogo', 'psicólogo')"],
    pillars: Annotated[
        Dict[str, Any],
        "Dict with keys: posicionamiento, visibilidad, identidad, humanizacion. "
        "Each value is a dict with optional keys: score (0-100), next_action (str). "
        "Example: {'posicionamiento': {'score': 40, 'next_action': 'Publicar artículo sobre apnea'}}",
    ],
) -> str:
    """Save or update the 4 Pillars strategic plan for a healthcare professional.
    
    Call this after the onboarding audit or whenever pillars are reviewed.
    Always include ALL FOUR pillars even if only one changed.
    """
    db = get_db()
    ctx = db.get_expert_context()
    expert_id = (ctx or {}).get("id") or "default"
    db.save_pillar_plan(expert_id, specialty, pillars)
    plan = db.get_pillar_plan()
    health = plan.get("overall_health_score", 0) if plan else 0
    return (
        f"Pillar strategy saved for {specialty}. "
        f"Overall brand health: {health}/100. "
        f"The dashboard will reflect this immediately."
    )


@tool
def get_pillar_plan() -> str:
    """Retrieve the current 4 Pillars strategic plan.
    
    Returns the full plan including scores, next actions, and history
    for all four pillars (posicionamiento, visibilidad, identidad, humanizacion).
    Use this to understand the professional's brand health before suggesting actions.
    """
    db = get_db()
    plan = db.get_pillar_plan()
    if not plan:
        return json.dumps({
            "error": "No pillar plan found. Run the 4 Pillars audit first via renderProfessionalOnboarding.",
            "overall_health_score": 0,
            "pillars": {}
        })
    result = {
        "specialty": plan.get("specialty", ""),
        "overall_health_score": plan.get("overall_health_score", 0),
        "last_review": plan.get("last_agent_update", ""),
        "pillars": plan.get("pillars", {}),
    }
    pending = db.get_pending_pillar_actions()
    if pending:
        result["pending_actions"] = pending
    return json.dumps(result, indent=2)


@tool
def update_pillar_action(
    pillar_key: Annotated[
        str,
        "Which pillar to update: 'posicionamiento', 'visibilidad', 'identidad', or 'humanizacion'",
    ],
    action: Annotated[str, "Description of the action completed (e.g., 'Published 3 LinkedIn articles')"],
    score_delta: Annotated[
        int,
        "How many points this action adds to the pillar score (0-20, default 5). "
        "Small actions = 3, medium = 5, big milestones = 10.",
    ] = 5,
) -> str:
    """Record a completed action for a pillar and update the score.
    
    Call this AFTER the professional completes a pillar action
    (e.g., published content, recorded a reel, updated their brand kit).
    The dashboard will reflect the new score immediately.
    """
    db = get_db()
    plan = db.update_pillar_action(pillar_key, action, score_delta)
    if not plan:
        return (
            f"Could not update pillar '{pillar_key}'. "
            "Make sure a pillar plan exists (run save_pillar_strategy first)."
        )
    pillar = plan["pillars"].get(pillar_key, {})
    return (
        f"Pillar '{pillar_key}' updated. "
        f"Action recorded: {action}. "
        f"New score: {pillar.get('score', 0)}/100. "
        f"Overall brand health: {plan.get('overall_health_score', 0)}/100."
    )


@tool
def get_pending_pillar_actions() -> str:
    """Get all pending next actions across the 4 pillars.
    
    Use this to remind the professional what they should work on next.
    Returns an empty list if everything is up to date.
    """
    db = get_db()
    pending = db.get_pending_pillar_actions()
    if not pending:
        return json.dumps({"pending": [], "message": "No pending actions. All pillars are up to date."})
    return json.dumps({"pending": pending}, indent=2)


def load_db_tools() -> List[Any]:
    """Return the list of database-backed tools for the agent."""
    return [
        save_expert_profile,
        persist_generated_interface,
        get_professional_context,
        save_pillar_strategy,
        get_pillar_plan,
        update_pillar_action,
        get_pending_pillar_actions,
    ]
