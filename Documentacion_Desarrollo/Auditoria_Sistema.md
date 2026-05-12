# Purpose360 AI: System Audit Report

**Role**: Senior Developer (React, CopilotKit, GenAI)  
**Status**: Context established. Audit complete.

## 1. Executive Summary
Purpose360 AI is a sophisticated, agentic "Intelligent Operating System" tailored for healthcare and wellness professionals. It leverages a modern, distributed architecture combining **Next.js**, **LangGraph**, and **CopilotKit v2** to provide a seamless, AI-driven experience with a heavy focus on **Notion** integration and **Generative UI**.

---

## 2. Technical Stack & Architecture

### Frontend (`apps/frontend`)
- **Framework**: Next.js 15+ (React 19)
- **Styling**: Tailwind CSS 4 + Radix UI (Premium aesthetics with Plus Jakarta Sans & Spline Sans Mono).
- **AI Integration**: `@copilotkit/react-core/v2` and `@copilotkit/react-ui/v2`.
- **State Management**: Agentic state sync via CopilotKit, optimistic UI for lead edits.
- **Components**: High-fidelity custom components for health metrics, strategic positioning, and lead management.

### BFF (`apps/bff`)
- **Runtime**: Node.js / TypeScript.
- **Orchestration**: `CopilotRuntime` v2 managing intelligence, agents, and MCP servers.
- **Intelligence**: Configured with `CopilotKitIntelligence` (pointing to a local gateway).
- **Resilience**: Custom middleware to handle Postgres seeding issues and LangGraph thread locks.

### AI Agent (`apps/agent`)
- **Core Engine**: Python-based **LangGraph**.
- **Reasoning**: Uses `deepagents` planner for multi-step turns (e.g., "draft email + queue").
- **Benchmarking**: Native support for switching between `gemini-3.1-flash-lite`, `gemini-flash-react`, and `claude-sonnet-4-6-react`.
- **Storage**: Custom `LeadStore` and `DbStore` for persistent context and lead state.

### MCP Server (`apps/mcp`)
- **Standard**: Model Context Protocol via `mcp-use`.
- **Tools**: Specialized visualization tools (`show-lead-list`, `show-lead-demand`, `show-canvas-dashboard`) that render interactive widgets directly in the chat.

---

## 3. Key Agentic Patterns

### Generative UI (A2UI)
The system uses `useRenderTool` to provide context-aware, interactive cards for:
- **Strategic Positioning**: Phased roadmaps for professionals.
- **Health Metrics**: Sleep dashboards and content strategies.
- **Lead Management**: Mini-cards and interactive email drafts with HITL (Human-in-the-Loop) approval flows.

### Intelligent Triage
The agent doesn't just chat; it acts on the workspace:
- **Notion Sync**: Bi-directional sync with Notion databases.
- **Dynamic Filtering**: AI can highlight, filter, and select leads based on natural language commands.
- **Optimistic Updates**: Changes made by the agent are reflected instantly in the UI, then persisted via tools.

---

## 4. Current Observations & Potential Optimizations

### Strengths
- **Latest Tech**: Use of React 19 and CopilotKit v2 positions the project at the bleeding edge.
- **Robust Error Handling**: The BFF remapping of 5xx errors into actionable toasts is a great DX/UX touch.
- **Extensible Agent**: The runtime factory in `runtime.py` allows for rapid testing of different LLM architectures.

### Areas for Attention
- **Seeding Dependencies**: The system relies on a specific Postgres state. If `npm run seed` hasn't been run, the agent will fail (though the BFF handles this gracefully).
- **LangGraph Recursion**: The current limit is set to 60 to accommodate the `deepagents` planner. Monitoring token usage and turn latency will be key for scaling.
- **MCP Tool Fallbacks**: The `ToolFallbackCard` is used for unregistered tools, ensuring a graceful fallback, but many tools are already "premium-mapped".

---

## 5. Next Steps
I am ready to assist with:
1. **Refining the Health & Wellness components** (e.g., improving the Onboarding flow).
2. **Deepening the Notion integration** (e.g., automated follow-up sequences).
3. **Enhancing the Agent's planning logic** using `deepagents` capabilities.
4. **Optimizing the Tailwind 4 / Radix UI design system** for even more "WOW" factor.

**System Audit Complete.** Ready for instructions.
