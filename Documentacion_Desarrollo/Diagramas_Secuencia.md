# 🔄 Diagramas de Secuencia: Purpose360 AI
**Flujos de Comunicación y Protocolo AG-UI**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Este documento detalla la interacción técnica de bajo nivel entre los componentes del sistema, enfocándose en el protocolo de comunicación asíncrona y el renderizado de UI generativa.

---

## 1. Flujo de Mensaje y Renderizado GenUI
Este diagrama muestra cómo un mensaje del usuario activa una respuesta del agente que incluye un componente visual dinámico.

```mermaid
sequenceDiagram
    participant U as Usuario (Navegador)
    participant F as Frontend (Next.js)
    participant B as BFF (CopilotKit Runtime)
    participant A as Agente (LangGraph Python)
    participant L as LLM (Gemini/Claude)

    U->>F: Escribe "Muéstrame el paciente Juan"
    F->>B: Petición HTTP (Protocolo AG-UI)
    B->>A: Invoke Graph (LangGraph SDK)
    A->>L: Consulta Contexto + System Prompt
    L-->>A: Sugerencia: Llamar a renderLeadMiniCard(id=123)
    
    Note over A,L: Tool Calling (Frontend Tool)
    
    A->>B: Stream Event: Action(renderLeadMiniCard)
    B->>F: SSE Event: Generative UI Component Call
    F->>F: Localiza componente React <LeadMiniCard />
    F->>U: Renderiza Tarjeta en el Chat
    
    A->>L: Generar respuesta de texto
    L-->>A: "Aquí tienes los detalles de Juan..."
    A->>B: Stream Event: Text Chunk
    B->>F: SSE Event: Message Delta
    F->>U: Muestra texto incremental en el chat
```

---

## 2. Flujo de Ejecución de Herramientas Backend (MCP/Notion)
Este diagrama detalla cómo el agente interactúa con datos externos de forma segura.

```mermaid
sequenceDiagram
    participant F as Frontend (Canvas)
    participant B as BFF
    participant A as Agente (LangGraph)
    participant MCP as Servidor MCP (Notion)
    participant N as Notion API

    F->>B: Acción de Usuario / Contexto de Canvas
    B->>A: Sincroniza estado de leads
    A->>A: Detecta necesidad de actualizar Notion
    
    Note over A,MCP: Ejecución de Herramienta Backend
    
    A->>MCP: Tool Call: mcp_update_lead(lead_id, data)
    MCP->>N: Petición PATCH /v1/pages/{id}
    N-->>MCP: Confirmación (200 OK)
    MCP-->>A: Result: Lead actualizado exitosamente
    
    A->>B: Emit: State Update (Sync)
    B->>F: Push: Actualización de Estado (A2UI)
    F->>F: El Canvas se refresca visualmente
```

---

## 3. Protocolo AG-UI (Agent-Graphic User Interface)
El sistema utiliza el protocolo AG-UI para manejar la complejidad del streaming y la sincronización de estado:

1.  **Transporte:** Utiliza Server-Sent Events (SSE) para permitir que el Agente "empuje" actualizaciones al cliente sin que este las pida.
2.  **Mensajes de Acción:** Permite que el agente solicite al frontend que ejecute funciones locales (ej: abrir un modal, cambiar un filtro o renderizar un componente específico).
3.  **Sincronización de Estado:** El estado del Canvas se envía al BFF en cada turno (`useAgentContext`), asegurando que el LLM siempre tenga la "foto" actual de lo que el usuario está viendo.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
