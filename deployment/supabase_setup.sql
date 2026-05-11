-- SQL para preparar Supabase para Purpose360 AI
-- Ejecuta esto en el SQL Editor de tu proyecto en Supabase

-- 1. Crear el esquema de CopilotKit Intelligence (si no existe)
-- Nota: El servicio 'intelligence' suele crearlo automáticamente, 
-- pero esto asegura que los permisos sean correctos.
CREATE SCHEMA IF NOT EXISTS cpki;

-- 2. Crear la tabla de usuarios iniciales (requerida por el starter kit)
CREATE TABLE IF NOT EXISTS cpki.users (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insertar los usuarios por defecto para que el agente y la UI funcionen
INSERT INTO cpki.users (id, organization_id, created_at) 
VALUES 
    ('default', 'casa-de-erlang', NOW()), 
    ('1_default', 'casa-de-erlang', NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Habilitar extensiones necesarias (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
