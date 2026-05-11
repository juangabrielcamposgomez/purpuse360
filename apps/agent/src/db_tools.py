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

def load_db_tools() -> List[Any]:
    """Return the list of database-backed tools for the agent."""
    return [
        save_expert_profile,
        persist_generated_interface,
        get_professional_context
    ]
