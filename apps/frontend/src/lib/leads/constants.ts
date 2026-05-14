// ── SINGLE SOURCE OF TRUTH for all shared constants ────────────────────
// TypeScript reads this file; Python reads `agent/data/constants.json`
// which is generated to mirror the values below.

export type PillarKey = "posicionamiento" | "visibilidad" | "identidad" | "humanizacion";

export const PILLAR_KEYS: readonly PillarKey[] = [
  "posicionamiento",
  "visibilidad",
  "identidad",
  "humanizacion",
] as const;

export const PILLAR_LABELS: Record<PillarKey, string> = {
  posicionamiento: "Posicionamiento",
  visibilidad: "Visibilidad",
  identidad: "Identidad",
  humanizacion: "Humanización",
};

export const PILLAR_ICONS: Record<PillarKey, string> = {
  posicionamiento: "Shield",
  visibilidad: "Eye",
  identidad: "UserCircle",
  humanizacion: "Heart",
};

// ── Lead status: aligned with Notion values (SSOT) ─────────────────────
// The agent/Notion uses these values. The frontend adopts them as truth.
// Display labels are mapped only in UI components.

export const LEAD_STATUSES = [
  "Not started",
  "In progress",
  "Done",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_DISPLAY: Record<string, string> = {
  "Not started": "Nuevo Paciente",
  "In progress": "En Consulta",
  Done: "Plan de Tratamiento",
};
