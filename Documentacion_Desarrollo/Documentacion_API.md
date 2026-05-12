# 🔌 Documentación de API: Purpose360 AI
**Endpoints y Protocolos de Comunicación**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

El sistema utiliza principalmente el protocolo **AG-UI** para la comunicación del agente, pero expone endpoints REST para funciones administrativas y de soporte.

---

## 1. CopilotKit Runtime (BFF)
El punto de entrada principal es el endpoint de CopilotKit, que maneja el streaming de IA.

*   **URL:** `/api/copilotkit`
*   **Método:** `POST`
*   **Headers:** `Content-Type: application/json`
*   **Cuerpo:** Protocolo AG-UI (JSON) conteniendo mensajes, contexto y acciones de herramientas.

---

## 2. Endpoints Administrativos (Ejemplos)

### `GET /api/leads/reset`
*   **Descripción:** Wipes la base de datos local (JSON) y la reinicia desde el seed. Útil para desarrollo.
*   **Respuesta:** `200 OK` { "status": "reset_complete" }

### `GET /api/health`
*   **Descripción:** Health check para monitorear el estado del BFF, la conexión con Postgres y el Agente.
*   **Respuesta:** `200 OK` { "status": "up", "db": "connected", "agent": "connected" }

---

## 3. Integración MCP (Herramientas del Agente)
El Agente expone herramientas que actúan como una API interna. Algunas clave son:

| Herramienta | Parámetros | Acción |
| :--- | :--- | :--- |
| `list_notion_leads` | - | Lista registros desde Notion. |
| `update_notion_lead` | `lead_id`, `patch` | Actualiza campos específicos en Notion. |
| `render_lead_card` | `lead_id` | Solicita al frontend renderizar una ficha. |
| `send_draft_email` | `to`, `subject`, `body` | Envía un correo (previa aprobación). |

---

## 4. Autenticación
Actualmente, el sistema utiliza un `organization_id: "default"` para desarrollo. En producción, se debe implementar **JWT** (JSON Web Tokens) en los headers de cada petición al BFF.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
