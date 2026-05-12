# 🎨 Guía de Estilo y Estándares: Purpose360 AI
**Convenciones de Código y Arquitectura Limpia**  
**Rol:** Senior GenAI Developer  
**Estado:** Finalizado

Para mantener la mantenibilidad del proyecto a largo plazo, todos los desarrolladores deben seguir estas convenciones.

---

## 1. Convenciones de Nomenclatura

*   **React (TSX):** `PascalCase` para componentes (ej: `PatientCard.tsx`) y `camelCase` para hooks y variables.
*   **Python:** `snake_case` para funciones y variables (ej: `fetch_lead_data`), y `PascalCase` para clases (ej: `NotionAdapter`).
*   **Archivos:** `kebab-case` para nombres de archivos no-componentes (ej: `api-utils.ts`).

---

## 2. Estándares de Frontend (Next.js 15)

*   **Componentes de Cliente vs Servidor:** Usar `'use client'` solo cuando sea necesario para interactividad o uso de hooks de CopilotKit.
*   **Styling:** Uso estricto de **Tailwind CSS**. Evitar estilos inline.
*   **Tipado:** Uso obligatorio de TypeScript. No se permite el uso de `any`. Definir interfaces/tipos para todas las props de componentes.

---

## 3. Estándares de IA (Agente)

*   **Prompting:** Los prompts del sistema deben estar centralizados en `apps/agent/src/prompts.py`. No definir prompts dentro de los nodos del grafo.
*   **Herramientas (Tools):** Cada herramienta debe tener una descripción clara y detallada, ya que es lo que el LLM lee para decidir su ejecución.
*   **Gestión de Errores:** Todas las llamadas a APIs externas deben estar envueltas en bloques `try-except` con logs claros.

---

## 4. Estructura de Proyecto Sugerida
*   `/components`: Componentes visuales reutilizables.
*   `/hooks`: Lógica de estado y llamadas a herramientas del agente.
*   `/services`: Capa de abstracción para APIs (BFF).
*   `/types`: Definiciones globales de tipos de datos.

---
*Documento generado por Antigravity - Senior GenAI Developer.*
