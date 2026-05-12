# 🧪 Plan de Pruebas y QA: Purpose360 AI
**Estrategia de Aseguramiento de Calidad para Sistemas Agenticos**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Este documento detalla la estrategia para garantizar que el sistema Purpose360 AI sea robusto, confiable y seguro para su uso por profesionales de la salud.

---

## 1. Niveles de Prueba

### A. Pruebas Unitarias (Tradicionales)
*   **Frontend:** Verificación de renderizado de componentes individuales (Cards, Buttons, Layouts) usando Jest y React Testing Library.
*   **BFF:** Pruebas de lógica de negocio y middlewares de seguridad.
*   **Agente:** Pruebas de funciones individuales en Python (parsers de datos, utilidades de redacción).

### B. Pruebas de Integración (Tool Integration)
*   **Conexión MCP:** Validar que el servidor MCP responde correctamente a las peticiones del agente.
*   **Notion Sync:** Verificar que las escrituras en el LeadStore local o de Notion persistan correctamente.

### C. Evaluación de IA (LLM Evals)
Este es el pilar más crítico. Se deben realizar pruebas de:
*   **Extracción de Intención:** ¿El agente entiende "Agenda una cita" correctamente?
*   **Detección de Herramientas:** ¿Llama a la herramienta correcta con los argumentos válidos?
*   **Evaluación de Respuestas:** Uso de métricas como *Faithfulness* (que no invente datos) y *Relevance* (que responda lo solicitado).

---

## 2. Escenarios de Prueba Críticos

| Escenario | Resultado Esperado |
| :--- | :--- |
| **Cambio de Estado de Lead** | Al decir "Cambia a Juan a cerrado", el estado en la DB debe ser "Closed" y el Canvas debe actualizarse. |
| **Fallo de Conexión API** | Si Gemini o Notion fallan, el sistema debe mostrar un mensaje de error amigable (Graceful Degradation). |
| **Sesión Persistente** | Al cerrar y reabrir el navegador, el historial de chat debe mantenerse intacto. |
| **Inyección de Prompts** | El sistema debe filtrar intentos de manipulación de instrucciones (jailbreaking). |

---

## 3. Herramientas de QA
*   **LangSmith:** Para monitoreo de trazas, depuración de grafos y evaluación masiva de prompts.
*   **Cypress / Playwright:** Para pruebas End-to-End (E2E) simulando la navegación del usuario real.
*   **Pytest:** Framework estándar para pruebas en la capa del agente (Python).

---
*Documento generado por Antigravity - Senior GenAI Developer.*
