# 🚀 Guía de Desarrollo: Purpose360 AI

Esta guía detalla cómo trabajar en los diferentes componentes del sistema y cómo extender las capacidades del agente.

## 1. Configuración Inicial
Asegúrate de tener instalados:
*   Node.js 20+
*   Python 3.10+ (recomendado usar `uv`)
*   Docker Desktop

### Instalación de dependencias
```bash
npm install
npm run install:agent
```

### Variables de Entorno
Crea un archivo `.env` en la raíz basado en `.env.example`. Los valores críticos son:
*   `GEMINI_API_KEY`: Para el cerebro del agente.
*   `COPILOTKIT_LICENSE_TOKEN`: Para el runtime de CopilotKit.
*   `NOTION_TOKEN` & `NOTION_LEADS_DATABASE_ID`: Para la integración con Notion.

## 2. Flujo de Trabajo Local
Para arrancar todo el ecosistema (Infraestructura, Frontend, BFF, Agent):
```bash
npm run dev
```
Esto levantará:
*   **Postgres/Redis** en Docker.
*   **Frontend** en `http://localhost:3000`.
*   **BFF** en `http://localhost:3001`.
*   **LangGraph Agent** en `http://localhost:8133`.

## 3. Cómo Extender el Agente (LangGraph)
Para añadir nuevas capacidades al cerebro del sistema:
1.  **Define la herramienta en Python:** Edita `apps/agent/src/notion_tools.py` o crea un nuevo archivo en `src/`.
2.  **Registra la herramienta:** Añádela a la lista `backend_tools` en `apps/agent/main.py`.
3.  **Actualiza el Prompt:** Ajusta `apps/agent/src/prompts.py` para que el agente sepa cuándo usar la nueva herramienta.

## 4. Cómo Extender la UI Generativa (CopilotKit)
Si quieres que el agente interactúe con nuevos componentes visuales:
1.  **Crea el componente React** en `apps/frontend/components`.
2.  **Usa `useFrontendTool`:** En tu página principal, registra la herramienta que el agente llamará para manipular ese componente.
3.  **Define el contrato en Python:** (Opcional pero recomendado) Añade un stub en `apps/agent/src/canvas.py` para documentar la herramienta que el frontend está exponiendo.

## 5. Depuración
*   **Logs del Agente:** Revisa la consola donde corre `langgraph dev`.
*   **Trazas del LLM:** El sistema está configurado para usar **LangSmith** si proporcionas una `LANGSMITH_API_KEY`.
*   **Estado de la DB:** Puedes conectarte al Postgres local (puerto 5432) para inspeccionar las tablas de hilos de CopilotKit.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
