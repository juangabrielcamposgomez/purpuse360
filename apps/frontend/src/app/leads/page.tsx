"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  useAgent,
  useConfigureSuggestions,
  useCopilotKit,
  CopilotChatConfigurationProvider,
  CopilotSidebar,
} from "@copilotkit/react-core/v2";
import { ThreadsDrawer } from "@/components/threads-drawer";
import drawerStyles from "@/components/threads-drawer/threads-drawer.module.css";

import type { AgentState, Lead } from "@/lib/leads/types";
import { initialState } from "@/lib/leads/state";
import { applyFilter } from "@/lib/leads/derive";
import { applyPatch, revertPatch } from "@/lib/leads/optimistic";

import { Header } from "@/components/leads/Header";
import { PipelineBoard } from "@/components/leads/PipelineBoard";
import { QuickStats } from "@/components/leads/QuickStats";
import { StatusDonut } from "@/components/leads/StatusDonut";
import { WorkshopDemand } from "@/components/leads/WorkshopDemand";

import { useLeadsTools } from "@/hooks/use-leads-tools";
import { useLeadsRenderers } from "@/hooks/use-leads-renderers";

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

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

function CanvasInner() {
  const { agent } = useAgent();
  const { copilotkit } = useCopilotKit();

  useConfigureSuggestions({
    available: "before-first-message",
    suggestions: [
      { title: "Import from Notion", message: "Import the leads from Notion." },
      { title: "What's hot?", message: "What workshops are most in demand right now?" },
      { title: "Highlight developers", message: "Highlight every lead with technical_level Developer or Advanced / expert." },
      { title: "Profile a lead", message: "Tell me about Ada Lovelace and show her mini card." },
    ],
  });

  const injectPrompt = useCallback(
    (prompt: string) => {
      if (!agent) return;
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `msg-${Date.now()}`;
      agent.addMessage({ id, role: "user", content: prompt });
      void copilotkit.runAgent({ agent }).catch((error: unknown) => {
        console.error("injectPrompt: runAgent failed", error);
        toast.error("Agent failed to respond. Check your API keys.", { duration: 8000 });
      });
    },
    [agent, copilotkit],
  );

  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [justSyncedIds, setJustSyncedIds] = useState<Set<string>>(new Set());
  const snapshotsRef = useRef<Map<string, Lead>>(new Map());
  const processedToolMsgIds = useRef<Set<string>>(new Set());
  const justSyncedTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const flashJustSynced = useCallback((id: string) => {
    setJustSyncedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const existing = justSyncedTimers.current.get(id);
    if (existing) clearTimeout(existing);
    const t = setTimeout(() => {
      setJustSyncedIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      justSyncedTimers.current.delete(id);
    }, 800);
    justSyncedTimers.current.set(id, t);
  }, []);

  useEffect(() => {
    return () => {
      for (const t of justSyncedTimers.current.values()) clearTimeout(t);
      justSyncedTimers.current.clear();
    };
  }, []);

  const state = mergeAgentState(agent?.state);

  const updateState = useCallback(
    (updater: (prev: AgentState) => AgentState) => {
      agent?.setState(updater(mergeAgentState(agent?.state)));
    },
    [agent],
  );

  const commitLeadEdit = useCallback(
    (leadId: string, patch: Partial<Lead>) => {
      const snap = state.leads.find((l) => l.id === leadId);
      if (!snap) return;
      snapshotsRef.current.set(leadId, snap);
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.add(leadId);
        return next;
      });
      updateState((prev) => applyPatch(prev, leadId, patch));
      injectPrompt(`Update lead ${leadId} in Notion: ${JSON.stringify(patch)}`);
    },
    [state.leads, updateState, injectPrompt],
  );

  // Register tools and renderers via hooks
  useLeadsTools(commitLeadEdit);
  useLeadsRenderers(injectPrompt, updateState);

  const messageTail = (agent?.messages as any[])?.slice(-10) ?? [];
  useEffect(() => {
    if (!agent || !messageTail.length) return;
    for (const m of messageTail) {
      const id = m.id;
      if (!id || m.role !== "tool" || processedToolMsgIds.current.has(id)) continue;
      processedToolMsgIds.current.add(id);

      const content = typeof m.content === "string" ? m.content : "";
      const isFailure = content.startsWith("Update failed") || content.startsWith("Insert failed");
      const isSuccess = content.startsWith("Updated ") || content.startsWith("Added ");
      
      if (!isFailure && !isSuccess) continue;

      const pending = Array.from(snapshotsRef.current.entries());
      if (pending.length === 0) continue;

      if (isSuccess) {
        const [leadId] = pending[pending.length - 1];
        snapshotsRef.current.delete(leadId);
        setSyncingIds((prev) => {
          const next = new Set(prev);
          next.delete(leadId);
          return next;
        });
        flashJustSynced(leadId);
      } else {
        updateState((prev) => {
          let next = prev;
          for (const [, snap] of pending) next = revertPatch(next, snap);
          return next;
        });
        snapshotsRef.current.clear();
        setSyncingIds(new Set());
        toast.error("Couldn't sync leads to Notion — changes reverted.", { duration: 5000 });
      }
    }
  }, [messageTail, agent, flashJustSynced, updateState]);

  const visibleLeads = useMemo(() => applyFilter(state.leads, state.filter), [state.leads, state.filter]);

  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <>
      <main className="flex min-h-screen flex-col gap-5 overflow-auto bg-background px-4 py-4 md:h-screen md:overflow-hidden md:px-6 md:py-6">
        <Header
          title={state.header.title}
          subtitle={state.header.subtitle}
          totalLeads={state.leads.length}
          visibleLeads={visibleLeads.length}
          sync={state.sync}
          onOpenChat={() => setIsChatOpen(!isChatOpen)}
        />

        {state.leads.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="max-w-md text-sm text-muted-foreground">
              Ask the assistant to <span className="font-mono text-foreground">pull workshop signups from Notion</span> to populate the canvas.
            </p>
          </div>
        ) : (
          <>
            <QuickStats leads={state.leads} />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <StatusDonut leads={state.leads} />
              <WorkshopDemand
                leads={state.leads}
                selectedWorkshops={state.filter.workshops}
                onPickWorkshop={(w) => updateState(prev => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    workshops: prev.filter.workshops.includes(w)
                      ? prev.filter.workshops.filter(x => x !== w)
                      : [...prev.filter.workshops, w]
                  }
                }))}
                compact
              />
            </div>
            <div className="min-h-[400px] flex-1 overflow-auto md:min-h-0">
              <PipelineBoard
                leads={visibleLeads}
                selectedLeadId={state.selectedLeadId}
                highlightedLeadIds={state.highlightedLeadIds}
                onSelect={(id) => updateState(prev => ({ ...prev, selectedLeadId: prev.selectedLeadId === id ? null : id }))}
                onMoveLead={(id, _, to) => commitLeadEdit(id, { status: to })}
                syncingIds={syncingIds}
                justSyncedIds={justSyncedIds}
              />
            </div>
          </>
        )}
      </main>

      {isChatOpen && (
        <CopilotSidebar 
          width={420} 
          labels={{
            welcomeMessageText: "Hola, soy Purpose360 Intelligence. ¿Cómo puedo ayudarte hoy?",
            chatInputPlaceholder: "¿Cómo puedo ayudarte con tu estrategia hoy?",
          }}
          input={{ disclaimer: () => null, className: "pb-6" }} 
        />
      )}
      <Toaster position="bottom-right" toastOptions={{ classNames: { error: "!bg-rose-50 !text-rose-900 !border !border-rose-200" } }} />
    </>
  );
}

function HomePage() {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  return (
    <div className={drawerStyles.layout}>
      <ThreadsDrawer agentId="default" threadId={threadId} onThreadChange={setThreadId} />
      <div className={drawerStyles.mainPanel}>
        <CopilotChatConfigurationProvider agentId="default" threadId={threadId}>
          <CanvasInner />
        </CopilotChatConfigurationProvider>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ClientOnly>
      <HomePage />
    </ClientOnly>
  );
}
