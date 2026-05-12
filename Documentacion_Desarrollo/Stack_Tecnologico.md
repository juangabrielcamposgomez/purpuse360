# 🛠️ Stack Tecnológico: Purpose360 AI

El proyecto utiliza una combinación de herramientas de "cutting-edge" para el año 2026, enfocadas en la orquestación de agentes y UI generativa.

## Core AI & Orquestación
*   **[CopilotKit v2](https://copilotkit.ai):** El framework principal para conectar el estado de la aplicación React con agentes de IA. Facilita la creación de "Generative UI" donde el agente manipula componentes del frontend.
*   **[LangGraph (Python)](https://langchain-ai.github.io/langgraph/):** Motor de orquestación de agentes. A diferencia de LangChain estándar, permite grafos con ciclos, memoria persistente y control granular sobre el flujo de razonamiento.
*   **[DeepAgents](https://github.com/copilotkit/deepagents):** Librería especializada en agentes de planificación profunda (Deep Planning) para interfaces agenticas.

## Modelos de Lenguaje (LLMs)
*   **Google Gemini 3.1 Flash-Lite:** Modelo principal optimizado para baja latencia y alta ventana de contexto, ideal para orquestación de herramientas.
*   **Anthropic Claude 3.5 Sonnet:** Modelo alternativo de alta capacidad de razonamiento para tareas de análisis complejo.

## Infraestructura & Herramientas
*   **[MCP (Model Context Protocol)](https://modelcontextprotocol.io):** Protocolo de Anthropic para conectar modelos con datos. Utilizado para la integración con **Notion**.
*   **Docker:** Para la gestión de servicios locales (Postgres, Redis, CopilotKit Intelligence).
*   **`uv` (Python package manager):** Gestor de paquetes ultra-rápido para el entorno de Python del agente.
*   **Next.js 15:** Framework de React para el frontend con soporte completo para Server Components y streaming.

## Almacenamiento
*   **Postgres:** Base de datos relacional para persistencia de hilos y metadatos.
*   **Redis:** Cache de baja latencia para el estado de los agentes.

## Herramientas de Desarrollo
*   **LangGraph Studio / Dev:** Interfaz visual para depurar los grafos del agente.
*   **Concurrently:** Orquestación de múltiples procesos (Frontend, BFF, Agent) en un solo comando de terminal.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
