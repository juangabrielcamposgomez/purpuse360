-- PURPOSE360 AI: AGENTIC DATABASE SCHEMA
-- Designed for real-time Generative UI and Health Professional Ecosystems
-- Optimized for PostgreSQL with JSONB for maximum agentic flexibility

-- 1. Expert Context (The Seed)
CREATE TABLE IF NOT EXISTS expert_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialty VARCHAR(255) NOT NULL, -- e.g., 'Sleep Medicine Neurologist'
    profile_data JSONB NOT NULL DEFAULT '{}', -- {goals: [], audience: "", services: []}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Generated Interfaces (The Heart of GenUI)
-- This table allows the Agent to persist the UI it constructs for the user
CREATE TABLE IF NOT EXISTS generated_interfaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID REFERENCES expert_context(id) ON DELETE CASCADE,
    component_type VARCHAR(100) NOT NULL, -- e.g., 'SleepMetricsDashboard', 'StrategicPositioning'
    ui_schema JSONB NOT NULL DEFAULT '{}', -- Props, layout, and visual configuration
    current_state JSONB NOT NULL DEFAULT '{}', -- The live data/metrics within the component
    last_agent_update TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent Feedback Loop (Human-in-the-Loop)
-- Stores approvals, adjustments, and the reasoning behind AI decisions
CREATE TABLE IF NOT EXISTS agent_feedback_loop (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interface_id UUID REFERENCES generated_interfaces(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- 'Approve', 'Adjust', 'Execute'
    interaction_data JSONB NOT NULL DEFAULT '{}', -- User comments or parameter adjustments
    agent_reasoning_log TEXT, -- Why the agent proposed this specific interface
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Networking Graph (Ecosistema Vertical)
-- Stores relationships and collaboration recommendations
CREATE TABLE IF NOT EXISTS networking_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID REFERENCES expert_context(id) ON DELETE CASCADE,
    related_entity_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'Clinic', 'Specialist', 'Podcast', 'Community'
    relationship_metadata JSONB NOT NULL DEFAULT '{}', -- {relevance_score: 0.95, action: "Connect"}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance (JSONB GIN indices for deep querying)
CREATE INDEX IF NOT EXISTS idx_expert_profile ON expert_context USING GIN (profile_data);
CREATE INDEX IF NOT EXISTS idx_gen_ui_schema ON generated_interfaces USING GIN (ui_schema);
CREATE INDEX IF NOT EXISTS idx_gen_ui_state ON generated_interfaces USING GIN (current_state);
CREATE INDEX IF NOT EXISTS idx_networking_meta ON networking_graph USING GIN (relationship_metadata);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_expert_context_updated_at
    BEFORE UPDATE ON expert_context
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- COMMENTS FOR AGENTIC GUIDANCE
COMMENT ON TABLE expert_context IS 'Source of truth for professional identity. Agent uses this to drive all GenUI decisions.';
COMMENT ON TABLE generated_interfaces IS 'Persistence layer for agent-constructed interfaces. Allows OS session state recovery.';
COMMENT ON TABLE agent_feedback_loop IS 'HITL data. Allows the agent to learn from user preferences and adjustments.';
COMMENT ON TABLE networking_graph IS 'Vertical ecosystem data. Stores AI-recommended growth and collaboration links.';
