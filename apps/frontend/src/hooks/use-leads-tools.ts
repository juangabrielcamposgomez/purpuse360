import { useCallback } from "react";
import { z } from "zod";
import { useFrontendTool, useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { toast } from "sonner";
import type { Lead, LeadFilter, AgentState } from "@/lib/leads/types";
import { initialState, emptyFilter } from "@/lib/leads/state";
import { applyPatch } from "@/lib/leads/optimistic";

const leadShape = z.object({
  id: z.string(),
  url: z.string().optional(),
  name: z.string(),
  company: z.string().default(""),
  email: z.string().default(""),
  role: z.string().default(""),
  phone: z.string().optional(),
  source: z.string().optional(),
  technical_level: z.string().default(""),
  interested_in: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  workshop: z.string().default("Not sure yet"),
  status: z.string().default("Not started"),
  opt_in: z.boolean().default(false),
  message: z.string().default(""),
  submitted_at: z.string().default(""),
});

function mergeAgentState(raw: unknown): AgentState {
  const partial =
    raw && typeof raw === "object" ? (raw as Partial<AgentState>) : {};
  return {
    ...initialState,
    ...partial,
    filter: { ...initialState.filter, ...(partial.filter ?? {}) },
    header: { ...initialState.header, ...(partial.header ?? {}) },
    sync: { ...initialState.sync, ...(partial.sync ?? {}) },
    leads: partial.leads ?? initialState.leads,
    highlightedLeadIds:
      partial.highlightedLeadIds ?? initialState.highlightedLeadIds,
  };
}

export function useLeadsTools(
  commitLeadEdit: (leadId: string, patch: Partial<Lead>) => void
) {
  const { agent } = useAgent();

  const updateState = useCallback(
    (updater: (prev: AgentState) => AgentState) => {
      agent?.setState(updater(mergeAgentState(agent?.state)));
    },
    [agent]
  );

  useFrontendTool({
    name: "setHeader",
    description: "Set the workspace header (title and subtitle shown above the canvas).",
    parameters: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
    }),
    handler: async ({ title, subtitle }: { title?: string; subtitle?: string }) => {
      updateState((prev) => ({
        ...prev,
        header: {
          title: title ?? prev.header.title,
          subtitle: subtitle ?? prev.header.subtitle,
        },
      }));
      return "header updated";
    },
  });

  useFrontendTool({
    name: "setLeads",
    description: "Replace the entire lead list. Call this once after fetching from Notion.",
    parameters: z.object({ leads: z.array(leadShape) }),
    handler: async ({ leads }) => {
      const list = leads as Lead[];
      updateState((prev) => ({
        ...prev,
        leads: list,
        highlightedLeadIds: prev.highlightedLeadIds.filter((id) =>
          list.some((l) => l.id === id)
        ),
        selectedLeadId:
          prev.selectedLeadId &&
          list.some((l) => l.id === prev.selectedLeadId)
            ? prev.selectedLeadId
            : null,
      }));
      return `loaded ${list.length} leads`;
    },
  });

  useFrontendTool({
    name: "setSyncMeta",
    description: "Record which Notion database is the canvas's source of truth and when we last synced.",
    parameters: z.object({
      databaseId: z.string().optional(),
      databaseTitle: z.string().optional(),
      syncedAt: z.string().optional(),
    }),
    handler: async ({ databaseId, databaseTitle, syncedAt }: { databaseId?: string; databaseTitle?: string; syncedAt?: string }) => {
      updateState((prev) => ({
        ...prev,
        sync: {
          databaseId: databaseId ?? prev.sync.databaseId,
          databaseTitle: databaseTitle ?? prev.sync.databaseTitle,
          syncedAt: syncedAt ?? new Date().toISOString(),
        },
      }));
      return "sync meta updated";
    },
  });

  useFrontendTool({
    name: "setFilter",
    description: "Narrow the visible leads. Pass any subset of fields; omitted fields are kept.",
    parameters: z.object({
      workshops: z.array(z.string()).optional(),
      technical_levels: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
      opt_in: z.enum(["any", "yes", "no"]).optional(),
      search: z.string().optional(),
    }),
    handler: async (patch: Partial<LeadFilter>) => {
      updateState((prev) => ({
        ...prev,
        filter: { ...prev.filter, ...patch },
      }));
      return "filter updated";
    },
  });

  useFrontendTool({
    name: "clearFilters",
    description: "Reset all filters to show every loaded lead.",
    parameters: z.object({}),
    handler: async () => {
      updateState((prev) => ({ ...prev, filter: emptyFilter }));
      return "filters cleared";
    },
  });

  useFrontendTool({
    name: "highlightLeads",
    description: "Visually highlight specific leads. Pass an empty array to clear highlights.",
    parameters: z.object({ leadIds: z.array(z.string()) }),
    handler: async (args: { leadIds: string[] }) => {
      updateState((prev) => ({
        ...prev,
        highlightedLeadIds: args.leadIds || [],
      }));
      return `highlighted ${args.leadIds.length} leads`;
    },
  });

  useFrontendTool({
    name: "selectLead",
    description: "Open the detail panel for one lead. Pass null to deselect.",
    parameters: z.object({ leadId: z.string().nullable() }),
    handler: async (args: { leadId: string | null }) => {
      updateState((prev) => ({
        ...prev,
        selectedLeadId: args.leadId || null,
      }));
      return args.leadId ? `selected ${args.leadId}` : "selection cleared";
    },
  });

  useFrontendTool({
    name: "commitLeadEdit",
    description: "Commit an edit to a single lead with optimistic UI. Asks the agent to persist via update_notion_lead.",
    parameters: z.object({
      leadId: z.string(),
      patch: z.object({
        name: z.string().optional(),
        company: z.string().optional(),
        email: z.string().optional(),
        role: z.string().optional(),
        phone: z.string().optional(),
        source: z.string().optional(),
        technical_level: z.string().optional(),
        interested_in: z.array(z.string()).optional(),
        tools: z.array(z.string()).optional(),
        workshop: z.string().optional(),
        status: z.string().optional(),
        opt_in: z.boolean().optional(),
        message: z.string().optional(),
      }).passthrough(),
    }),
    handler: async ({ leadId, patch }: { leadId: string; patch: Partial<Lead> }) => {
      commitLeadEdit(leadId, patch);
      return `queued: editing ${leadId}`;
    },
  });
}
