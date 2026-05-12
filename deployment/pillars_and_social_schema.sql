-- PURPOSE360 AI: PILLARS & SOCIAL INTEGRATION SCHEMA
-- This script extends the base schema to support the 4 pillars audit and social media connections.
-- Target: Supabase / PostgreSQL

-- 1. Ensure extensions and schema
CREATE SCHEMA IF NOT EXISTS cpki;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Update expert_context to support multi-tenancy (linking to cpki.users)
-- We check if user_id already exists to avoid errors.
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'expert_context') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='expert_context' AND column_name='user_id') THEN
            ALTER TABLE public.expert_context ADD COLUMN user_id TEXT REFERENCES cpki.users(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 3. Enum for the 4 Pillars
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pillar_type') THEN
        CREATE TYPE pillar_type AS ENUM ('posicionamiento', 'visibilidad', 'identidad', 'humanizacion');
    END IF;
END $$;

-- 4. Table for Pillar Audits (The 4 Pillars results)
CREATE TABLE IF NOT EXISTS pillar_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID REFERENCES public.expert_context(id) ON DELETE CASCADE,
    type pillar_type NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    audit_data JSONB NOT NULL DEFAULT '{}', -- Stores answers to the audit questions
    recommendations JSONB NOT NULL DEFAULT '[]', -- AI generated actionable steps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table for Social Media Connections (Integration with Supabase Vault)
-- Instead of storing tokens directly, we store the secret_id from the vault schema.
CREATE TABLE IF NOT EXISTS social_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID REFERENCES public.expert_context(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'linkedin', 'google_business', 'facebook'
    account_name VARCHAR(255),
    external_id TEXT, -- ID from the platform
    
    -- Supabase Vault Integration:
    -- Store the reference to the vault secret instead of the raw token.
    access_token_secret_id UUID, -- References vault.secrets(id)
    refresh_token_secret_id UUID, -- References vault.secrets(id)
    
    expires_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}', -- Follower count, status, profile pic url
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(expert_id, platform)
);

-- 6. Table for Marketing Campaigns (Positioning Execution)
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID REFERENCES public.expert_context(id) ON DELETE CASCADE,
    pillar_id UUID REFERENCES pillar_audits(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    budget DECIMAL(12,2),
    content_plan JSONB NOT NULL DEFAULT '{}', -- Ad copy, media assets, targeting info
    performance_metrics JSONB NOT NULL DEFAULT '{}', -- Clicks, impressions, conversions
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_pillar_audit_expert ON pillar_audits(expert_id);
CREATE INDEX IF NOT EXISTS idx_social_conn_expert ON social_connections(expert_id);
CREATE INDEX IF NOT EXISTS idx_mkt_campaign_expert ON marketing_campaigns(expert_id);
CREATE INDEX IF NOT EXISTS idx_audit_data ON pillar_audits USING GIN (audit_data);
CREATE INDEX IF NOT EXISTS idx_campaign_content ON marketing_campaigns USING GIN (content_plan);

-- Function for updated_at if it doesn't exist (it is in purpose360_schema.sql but we ensure it here)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at on new tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pillar_audits_updated_at') THEN
        CREATE TRIGGER update_pillar_audits_updated_at
            BEFORE UPDATE ON pillar_audits
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_social_connections_updated_at') THEN
        CREATE TRIGGER update_social_connections_updated_at
            BEFORE UPDATE ON social_connections
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketing_campaigns_updated_at') THEN
        CREATE TRIGGER update_marketing_campaigns_updated_at
            BEFORE UPDATE ON marketing_campaigns
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Comments for Agentic Guidance
COMMENT ON TABLE pillar_audits IS 'Results of the 4 Pillars Audit (Posicionamiento, Visibilidad, Identidad, Humanización).';
COMMENT ON TABLE social_connections IS 'OAuth connections to social platforms for automated positioning and campaigns.';
COMMENT ON TABLE marketing_campaigns IS 'AI-generated and executed marketing campaigns based on positioning requirements.';
